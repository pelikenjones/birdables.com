/**
 * The five rarity tiers, from the About page table.
 *
 * These are CEILINGS — the most that will ever exist at each tier — not current
 * counts. A card's own `totalPrinted` is the current count.
 *
 *   node --env-file=.env scripts/seed-rarity-tiers.mjs
 */
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const token =
	process.env.SANITY_WRITE_TOKEN ??
	JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;

const client = createClient({
	projectId: 'ubrw2onn',
	dataset: 'production',
	apiVersion: '2026-09-15',
	token,
	useCdn: false
});

const TIERS = [
	{ level: 1, label: 'Common as a backyard feeder', maxPhysical: 2000, maxDigital: 50 },
	{ level: 2, label: 'Worth stopping the car for', maxPhysical: 1500, maxDigital: 25 },
	{ level: 3, label: 'A good day with binoculars', maxPhysical: 800, maxDigital: 10 },
	{ level: 4, label: 'A trip planned around it', maxPhysical: 200, maxDigital: 5 },
	{ level: 5, label: 'A bird of a lifetime', maxPhysical: 50, maxDigital: 1 }
];

for (const tier of TIERS) {
	// Fixed reference data, one document per level — an explicit id is right here.
	// HYPHEN, not a dot: a dot in an _id is reserved for the drafts/versions
	// namespace (`drafts.x`, `versions.<release>.x`), so `rarityTier.1` is read
	// as a version of document `1` in release `rarityTier` and never appears in
	// the published perspective.
	await client.createOrReplace({ _id: `rarityTier-${tier.level}`, _type: 'rarityTier', ...tier });
	console.log(`  tier ${tier.level} — up to ${tier.maxPhysical.toLocaleString('en-US')} physical`);
}
