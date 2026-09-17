import { defineQuery } from 'groq';

/**
 * defineQuery (not the `groq` tag) so TypeGen emits a result type AND
 * sanityClient.fetch() infers it automatically.
 *
 * Projections are explicit — no `...` splat, which TypeGen cannot narrow.
 * lqip comes along for the blur-up; see src/lib/image.ts.
 */

/**
 * `totalPrinted` is deliberately NOT projected here. It is internal inventory —
 * surfacing it makes a 2,000-copy edition read like a 50-copy one. What the site
 * shows is the per-edition cap, which lives on `rarityTier`.
 */
const CARD_FIELDS = `
	_id,
	"slug": slug.current,
	smallName,
	bigName,
	edition,
	rarity,
	specialty,
	accentColor,
	releaseDate,
	qrScans,
	availability,
	artwork {
		asset->{
			_id,
			url,
			"lqip": metadata.lqip,
			"aspectRatio": metadata.dimensions.aspectRatio
		}
	},
	bird->{
		commonName,
		"slug": slug.current,
		scientificName,
		conservationStatus
	}
`;

export const cardsQuery = defineQuery(`
	*[_type == "card"] | order(rarity desc, bird->commonName asc) {${CARD_FIELDS}}
`);

export const cardBySlugQuery = defineQuery(`
	*[_type == "card" && slug.current == $slug][0] {
		${CARD_FIELDS},
		sold,
		inventory,
		etsyUrl,
		openseaUrl
	}
`);

export const birdSlugsQuery = defineQuery(`
	*[_type == "bird" && defined(slug.current)].slug.current
`);

const CREDIT = `{ author, license, source, sourceUrl, sourceId }`;

export const birdBySlugQuery = defineQuery(`
	*[_type == "bird" && slug.current == $slug][0] {
		_id,
		commonName,
		"slug": slug.current,
		scientificName,
		family,
		order,
		region,
		conservationStatus,
		sizeRange { lengthMin, lengthMax, wingspanMin, wingspanMax },
		weight,
		lifespan,
		clutch,
		diet,
		nest,
		migration,
		population,
		similarSpecies,
		habitat,
		behavior,
		funFacts,
		eBirdSlug,
		audubonSlug,
		audio {
			title,
			durationSeconds,
			"url": file.asset->url,
			credit ${CREDIT}
		},
		photos[] {
			_key,
			alt,
			image { asset->{ _id, url, "lqip": metadata.lqip, "aspectRatio": metadata.dimensions.aspectRatio } },
			credit ${CREDIT}
		},
		"cards": *[_type == "card" && bird._ref == ^._id] | order(edition asc) {
			${CARD_FIELDS},
			openseaUrl,
			etsyUrl,
			sold,
			inventory
		}
	}
`);

/** Ordered by common name, so prev/next on a bird page matches /cards. */
export const birdNavQuery = defineQuery(`
	*[_type == "bird" && defined(slug.current)] | order(commonName asc) {
		commonName,
		"slug": slug.current
	}
`);

export const allPostsQuery = defineQuery(`
	*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
		_id, title, "slug": slug.current, excerpt, category, tags, publishedAt
	}
`);

export const postBySlugQuery = defineQuery(`
	*[_type == "post" && slug.current == $slug][0] {
		_id, title, "slug": slug.current, excerpt, category, tags, publishedAt, body
	}
`);

export const postSlugsQuery = defineQuery(`
	*[_type == "post" && defined(slug.current) && defined(publishedAt)].slug.current
`);

export const cardSlugsQuery = defineQuery(`
	*[_type == "card" && defined(slug.current)].slug.current
`);

export const rarityTiersQuery = defineQuery(`
	*[_type == "rarityTier"] | order(level asc) {
		_id,
		level,
		label,
		maxPhysical,
		maxDigital
	}
`);

export const recentPostsQuery = defineQuery(`
	*[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[0...3] {
		_id,
		title,
		"slug": slug.current,
		excerpt,
		category,
		tags,
		publishedAt,
		coverImage {
			alt,
			asset->{ _id, url, "lqip": metadata.lqip, "aspectRatio": metadata.dimensions.aspectRatio }
		}
	}
`);

export const nominationsQuery = defineQuery(`
	*[_type == "nomination" && status == "approved"]
		| order(voteCount desc, birdName asc)[0...5] {
		_id,
		birdName,
		"slug": slug.current,
		voteCount
	}
`);

export const siteSettingsQuery = defineQuery(`
	*[_id == "siteSettings"][0] {
		navLinks[] { _key, label, href },
		socialLinks[] { _key, platform, url },
		contactEmail,
		faqs[] { _key, question, answer },
		ctaHeading,
		ctaBody,
		ctaButtonLabel,
		ctaButtonHref,
		nextDropAt
	}
`);
