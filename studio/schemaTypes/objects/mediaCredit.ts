import { defineType, defineField } from 'sanity';

/**
 * Attribution travelling with a piece of borrowed media.
 *
 * Both sources we pull from licence PER ITEM, not per collection, so the
 * recordist/photographer and the exact licence have to be stored alongside the
 * asset and rendered wherever it appears. This is a licence obligation, not a
 * nicety — dropping it makes the use non-compliant.
 */
export const mediaCredit = defineType({
	name: 'mediaCredit',
	title: 'Credit',
	type: 'object',
	fields: [
		defineField({
			name: 'author',
			type: 'string',
			description: 'The recordist or photographer, as the source names them.',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'license',
			type: 'string',
			description: 'Exact licence string from the source, e.g. "CC BY-SA 4.0".',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'source',
			type: 'string',
			options: {
				list: [
					{ title: 'xeno-canto', value: 'xeno-canto' },
					{ title: 'Wikimedia Commons', value: 'wikimedia' }
				]
			},
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'sourceUrl',
			title: 'Source page',
			type: 'url',
			description: 'Link back to the original. Required by both licences.',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'sourceId',
			title: 'Source ID',
			type: 'string',
			description: 'e.g. the xeno-canto catalogue number. Used to avoid refetching.'
		})
	]
});
