/**
 * One-shot migration: v1 Sanity (g5k47w6o) + birds.json -> the new project.
 *
 * Neither source is complete on its own:
 *   - v1 Sanity has edition / print run / sold / inventory / real qrScans, and
 *     the bird taxonomy and measurements.
 *   - birds.json has friendlyId (which names the card-art files on disk),
 *     the eBird and Audubon slugs, and correct display casing for names.
 *
 * Idempotent: every document is looked up by legacyId first, so re-running
 * patches rather than duplicating. Pass --dry to print the plan and write
 * nothing.
 *
 *   node --env-file=.env scripts/migrate-v1.mjs [--dry]
 */
import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DRY = process.argv.includes('--dry');
const PROJECT_ID = 'ubrw2onn';
const DATASET = 'production';
const V1 = 'https://g5k47w6o.api.sanity.io/v2026-09-15/data/query/production';

/** Prefer an explicit token; fall back to the Sanity CLI's own login. */
function resolveToken() {
	if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN;
	const cfg = join(homedir(), '.config/sanity/config.json');
	if (existsSync(cfg)) {
		const t = JSON.parse(readFileSync(cfg, 'utf8'))?.authToken;
		if (t) return t;
	}
	throw new Error('No write token. Set SANITY_WRITE_TOKEN in .env or run `sanity login`.');
}

const client = createClient({
	projectId: PROJECT_ID,
	dataset: DATASET,
	apiVersion: '2026-09-15',
	token: resolveToken(),
	useCdn: false
});

const v1 = async (query) => {
	const r = await fetch(`${V1}?query=${encodeURIComponent(query)}`);
	const j = await r.json();
	if (j.error) throw new Error(JSON.stringify(j.error));
	return j.result;
};

// ── Source data ──────────────────────────────────────────────────────────────
const v1Cards = await v1(`*[_type == "card"] | order(slug.current asc){
  ..., "birdId": bird._ref, bird->{_id, name, sciName, family, order, region, status, lengthMin, lengthMax, wingspanMin, wingspanMax}
}`);
const staticBirds = JSON.parse(readFileSync('_legacy/lib/data/birds.json', 'utf8'));
const bySlug = Object.fromEntries(staticBirds.map((b) => [b.slug, b]));

// The Java Sparrow card lost its bird reference in v1, but the bird record is
// still there — match it by name rather than dropping a real card.
const JAVA_SPARROW_BIRD_ID = 'df9e1767-f6d6-4864-a7fc-417aa8ba8044';
const orphanBird = await v1(`*[_id == "${JAVA_SPARROW_BIRD_ID}"][0]`);

// Bird range in v1 is finer-grained than the card's single "location" string.
const REGION = (r) => r ?? [];

const plan = v1Cards.map((card) => {
	const slug = card.slug.current;
	const s = bySlug[slug];
	if (!s) throw new Error(`No birds.json record for ${slug}`);
	const b = card.bird ?? (slug === 'java-sparrow' ? orphanBird : null);
	if (!b) throw new Error(`No v1 bird record for ${slug}`);

	return {
		slug,
		friendlyId: s.friendlyId,
		bird: {
			_type: 'bird',
			// birds.json has the display casing ("Java Sparrow"); v1 has "Java sparrow".
			commonName: s.birdName ?? b.name,
			slug: { _type: 'slug', current: slug },
			scientificName: b.sciName ?? s.scientificName,
			family: b.family,
			order: b.order,
			region: REGION(b.region),
			// IUCN wording, from the card — v1's bird.status is the Audubon scale.
			conservationStatus: card.conservationStatus,
			sizeRange: {
				lengthMin: b.lengthMin,
				lengthMax: b.lengthMax,
				wingspanMin: b.wingspanMin,
				wingspanMax: b.wingspanMax
			},
			eBirdSlug: card.eBirdSlug?.current ?? s.eBird,
			audubonSlug: card.audubonSlug?.current ?? s.audubon,
			legacyId: b._id
		},
		card: {
			_type: 'card',
			slug: { _type: 'slug', current: slug },
			smallName: card.smallName,
			bigName: card.bigName,
			edition: card.edition,
			accentColor: card.accentColor,
			rarity: card.rarity,
			releaseDate: card.releaseDate,
			totalPrinted: card.totalPrinted,
			qrScans: card.qrScans,
			availability: card.onlyAvailableInPack ? 'packOnly' : 'individual',
			sold: card.sold,
			inventory: card.inventory,
			etsyUrl: card.etsyUrl || undefined,
			openseaUrl: card.openseaUrl || undefined,
			legacyId: card._id
		}
	};
});

const strip = (o) =>
	Object.fromEntries(
		Object.entries(o).filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && !v.length))
	);

console.log(`${plan.length} cards to migrate${DRY ? ' (dry run)' : ''}\n`);

if (DRY) {
	for (const p of plan) {
		const art = `public/images/cards/${p.friendlyId}.png`;
		console.log(
			`  ${p.slug.padEnd(22)} r${p.card.rarity} ${String(p.card.qrScans).padStart(3)} scans  ` +
				`${p.bird.conservationStatus.padEnd(22)} art:${existsSync(art) ? 'ok' : 'MISSING'}`
		);
	}
	process.exit(0);
}

// ── Write ────────────────────────────────────────────────────────────────────
let createdBirds = 0, createdCards = 0, uploaded = 0;

for (const p of plan) {
	// 1. Bird — look up by legacyId, never by a predicted _id.
	const existingBird = await client.fetch(`*[_type == "bird" && legacyId == $id][0]{_id}`, {
		id: p.bird.legacyId
	});
	let birdId = existingBird?._id;
	if (birdId) {
		await client.patch(birdId).set(strip({ ...p.bird, sizeRange: strip(p.bird.sizeRange) })).commit();
	} else {
		const doc = await client.create(strip({ ...p.bird, sizeRange: strip(p.bird.sizeRange) }));
		birdId = doc._id;
		createdBirds++;
	}

	// 2. Artwork — the card front from disk, not v1's Unsplash reference photos.
	const existingCard = await client.fetch(
		`*[_type == "card" && legacyId == $id][0]{_id, "asset": artwork.asset._ref}`,
		{ id: p.card.legacyId }
	);
	let assetId = existingCard?.asset;
	if (!assetId) {
		const file = `public/images/cards/${p.friendlyId}.png`;
		if (!existsSync(file)) throw new Error(`Missing artwork: ${file}`);
		const asset = await client.assets.upload('image', readFileSync(file), {
			filename: `${p.friendlyId}.png`,
			title: `${p.card.smallName} ${p.card.bigName} — edition ${p.card.edition}`
		});
		assetId = asset._id;
		uploaded++;
	}

	// 3. Card
	const body = strip({
		...p.card,
		bird: { _type: 'reference', _ref: birdId },
		artwork: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
	});
	if (existingCard?._id) {
		await client.patch(existingCard._id).set(body).commit();
	} else {
		await client.create(body);
		createdCards++;
	}

	console.log(`  ✓ ${p.slug}`);
}

console.log(
	`\nbirds created: ${createdBirds}  cards created: ${createdCards}  images uploaded: ${uploaded}`
);
