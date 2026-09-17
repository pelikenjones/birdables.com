import { defineType, defineField, defineArrayMember } from 'sanity';
import { EarthAmericasIcon } from '@sanity/icons/EarthAmericas';

/**
 * The animal, separate from the product. A bird outlives any one card: a v2
 * Brown Pelican card is a new `card` pointing at this same `bird`.
 *
 * Taxonomy and measurements came across from v1. The prose fields did not —
 * v1 had no habitat/behaviour text for any of its 635 bird records — so they
 * start empty and get written in the Studio.
 */
export const bird = defineType({
	name: 'bird',
	title: 'Bird',
	type: 'document',
	icon: EarthAmericasIcon,

	groups: [
		{ name: 'identity', title: 'Identity', default: true },
		{ name: 'facts', title: 'Facts' },
		{ name: 'media', title: 'Media' },
		{ name: 'links', title: 'External links' }
	],

	fields: [
		defineField({
			name: 'commonName',
			title: 'Common name',
			type: 'string',
			group: 'identity',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			group: 'identity',
			description: 'Drives /bird/<slug>.',
			options: { source: 'commonName', maxLength: 96 },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'scientificName',
			title: 'Scientific name',
			type: 'string',
			group: 'identity',
			description: 'Genus and species, e.g. Pelecanus occidentalis.'
		}),
		defineField({
			name: 'family',
			type: 'string',
			group: 'facts'
		}),
		defineField({
			name: 'order',
			type: 'string',
			group: 'facts'
		}),
		defineField({
			name: 'region',
			type: 'array',
			group: 'facts',
			of: [defineArrayMember({ type: 'string' })],
			options: {
				list: [
					{ title: 'North America', value: 'North America' },
					{ title: 'South America', value: 'South America' },
					{ title: 'Western Europe', value: 'Western Europe' },
					{ title: 'Europe', value: 'Europe' },
					{ title: 'Africa', value: 'Africa' },
					{ title: 'Asia', value: 'Asia' },
					{ title: 'Oceania', value: 'Oceania' }
				]
			},
			validation: (rule) => rule.unique()
		}),
		defineField({
			name: 'conservationStatus',
			title: 'Conservation status',
			type: 'string',
			group: 'facts',
			description:
				'IUCN Red List wording — what the card fronts and the v1 site show. Note that v1 ' +
				'Sanity also carried an Audubon vocabulary ("Low Concern", "Red Watch List") on its ' +
				'bird records; that is a different scale and was not what got printed.',
			options: {
				list: [
					{ title: 'Least Concern', value: 'Least Concern' },
					{ title: 'Near Threatened', value: 'Near Threatened' },
					{ title: 'Vulnerable', value: 'Vulnerable' },
					{ title: 'Endangered', value: 'Endangered' },
					{ title: 'Critically Endangered', value: 'Critically Endangered' },
					{ title: 'Extinct in the Wild', value: 'Extinct in the Wild' },
					{ title: 'Data Deficient', value: 'Data Deficient' }
				]
			}
		}),
		defineField({
			name: 'sizeRange',
			title: 'Size range',
			type: 'object',
			group: 'facts',
			description: 'Centimetres, as recorded in v1. Leave blank where unknown.',
			options: { columns: 2 },
			fields: [
				defineField({ name: 'lengthMin', title: 'Length min (cm)', type: 'number' }),
				defineField({ name: 'lengthMax', title: 'Length max (cm)', type: 'number' }),
				defineField({ name: 'wingspanMin', title: 'Wingspan min (cm)', type: 'number' }),
				defineField({ name: 'wingspanMax', title: 'Wingspan max (cm)', type: 'number' })
			]
		}),
		defineField({
			name: 'habitat',
			type: 'text',
			rows: 3,
			group: 'facts',
			description: 'Where it lives. No v1 source — write this yourself.'
		}),
		defineField({
			name: 'behavior',
			title: 'Behaviour',
			type: 'text',
			rows: 3,
			group: 'facts',
			description: 'What it does. No v1 source — write this yourself.'
		}),
		defineField({
			name: 'weight',
			type: 'string',
			group: 'facts',
			description: 'A range, e.g. "2–5 kg".'
		}),
		defineField({ name: 'lifespan', type: 'string', group: 'facts', description: 'e.g. "Up to 25 years".' }),
		defineField({ name: 'clutch', title: 'Clutch size', type: 'string', group: 'facts', description: 'e.g. "2–3 eggs".' }),
		defineField({ name: 'diet', type: 'string', group: 'facts' }),
		defineField({ name: 'nest', type: 'string', group: 'facts', description: 'What it builds and where.' }),
		defineField({ name: 'migration', type: 'string', group: 'facts' }),
		defineField({ name: 'population', type: 'string', group: 'facts', description: 'Estimate and trend.' }),
		defineField({
			name: 'similarSpecies',
			title: 'Often confused with',
			type: 'string',
			group: 'facts'
		}),

		defineField({
			name: 'funFacts',
			title: 'Fun facts',
			type: 'array',
			group: 'facts',
			description:
				'Short, surprising, one sentence each. The bird page rotates through them, so ' +
				'they need to stand alone and read in any order. Three to five is the sweet spot.',
			of: [defineArrayMember({ type: 'text', rows: 2 })],
			validation: (rule) => rule.max(6)
		}),
		defineField({
			name: 'audio',
			title: 'Call recording',
			type: 'object',
			group: 'media',
			description:
				'Fetched once from Wikimedia Commons and stored here, so the site never calls an ' +
				'external API at runtime. Only licences permitting commercial use are accepted, ' +
				'and only recordings under a minute.',
			fields: [
				defineField({ name: 'file', type: 'file', options: { accept: 'audio/*' } }),
				defineField({ name: 'title', type: 'string', description: 'e.g. "Adult call".' }),
				defineField({ name: 'durationSeconds', title: 'Duration (seconds)', type: 'number' }),
				defineField({
					name: 'credit',
					type: 'mediaCredit',
					description:
						'Only for BORROWED recordings. Upload your own file and delete this block — ' +
						'the site then shows no attribution, because none is owed.'
				})
			]
		}),
		defineField({
			name: 'photos',
			title: 'Photographs',
			type: 'array',
			group: 'media',
			description:
				'Fetched once from Wikimedia Commons and stored here. Every photo must carry ' +
				'its credit — it is rendered under the image.',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({
							name: 'image',
							type: 'image',
							options: { hotspot: true },
							validation: (rule) => rule.required()
						}),
						defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
						defineField({
							name: 'credit',
							type: 'mediaCredit',
							validation: (rule) => rule.required()
						})
					],
					preview: {
						select: { title: 'credit.author', subtitle: 'credit.license', media: 'image' }
					}
				})
			],
			validation: (rule) => rule.max(6)
		}),
		defineField({
			name: 'mediaFetchedAt',
			title: 'Media last fetched',
			type: 'datetime',
			group: 'media',
			readOnly: true
		}),

		defineField({
			name: 'eBirdSlug',
			title: 'eBird species code',
			type: 'string',
			group: 'links',
			description: 'e.g. "atlpuf" — builds the eBird link.'
		}),
		defineField({
			name: 'audubonSlug',
			title: 'Audubon slug',
			type: 'string',
			group: 'links',
			description: 'e.g. "atlantic-puffin" — builds the Audubon link.'
		}),
		defineField({
			name: 'legacyId',
			title: 'Legacy ID',
			type: 'string',
			group: 'links',
			readOnly: true,
			description: 'The _id this record had in the v1 project. Import bookkeeping.'
		})
	],

	preview: {
		select: { title: 'commonName', subtitle: 'scientificName' }
	}
});
