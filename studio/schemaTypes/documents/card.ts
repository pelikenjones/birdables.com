import { defineType, defineField } from 'sanity';
import { ImageIcon } from '@sanity/icons/Image';

/**
 * The printed product. One card is one design in one edition — which is also
 * exactly what a QR code identifies. Every physical copy of the v1 Brown
 * Pelican shares a code; a v2 Pelican would be a separate card document with
 * its own code and its own scan tally. Nothing here is per-copy, because the
 * QR cannot support it.
 */
export const card = defineType({
	name: 'card',
	title: 'Card',
	type: 'document',
	icon: ImageIcon,

	groups: [
		{ name: 'identity', title: 'Identity', default: true },
		{ name: 'print', title: 'Print run' },
		{ name: 'commerce', title: 'Commerce' }
	],

	fields: [
		defineField({
			name: 'bird',
			type: 'reference',
			to: [{ type: 'bird' }],
			group: 'identity',
			description: 'The species this card depicts.',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			group: 'identity',
			description: 'Drives /card/<slug>.',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'smallName',
			title: 'Small name',
			type: 'string',
			group: 'identity',
			description: 'The smaller line on the card front, e.g. "Brown".',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'bigName',
			title: 'Big name',
			type: 'string',
			group: 'identity',
			description: 'The larger line, e.g. "Pelican".',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'edition',
			type: 'string',
			group: 'identity',
			description: 'Two digits, e.g. "01". A reprint gets a new edition and its own QR code.',
			initialValue: '01',
			validation: (rule) => rule.required().regex(/^\d{2}$/, { name: 'two digits' })
		}),
		defineField({
			name: 'artwork',
			type: 'image',
			group: 'identity',
			description: 'The card front.',
			options: { hotspot: true },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'accentColor',
			title: 'Accent colour',
			type: 'string',
			group: 'identity',
			description: 'Hex, including the #. Pulled from the artwork.',
			validation: (rule) =>
				rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex colour like #FF5B1E' })
		}),

		defineField({
			name: 'specialty',
			type: 'string',
			group: 'identity',
			description:
				'Carried over from v1, where it was a bare boolean with no explanation anywhere ' +
				'in the data or the site. 7 of 21 cards have it, spread across every rarity, so ' +
				'it is not a rarity synonym. Not surfaced on the site until it means something.',
			options: {
				list: [
					{ title: 'Standard', value: 'standard' },
					{ title: 'Specialty', value: 'specialty' }
				],
				layout: 'radio'
			},
			initialValue: 'standard'
		}),

		defineField({
			name: 'rarity',
			type: 'number',
			group: 'print',
			description: '1 is the most common, 5 the rarest.',
			options: {
				list: [
					{ title: '1 — Common', value: 1 },
					{ title: '2', value: 2 },
					{ title: '3', value: 3 },
					{ title: '4', value: 4 },
					{ title: '5 — Rarest', value: 5 }
				],
				layout: 'radio'
			},
			validation: (rule) => rule.required().min(1).max(5)
		}),
		defineField({
			name: 'releaseDate',
			title: 'Release date',
			type: 'date',
			group: 'print'
		}),
		defineField({
			name: 'totalPrinted',
			title: 'Printed so far (internal)',
			type: 'number',
			group: 'print',
			description:
				'INTERNAL — not shown anywhere on the site. How many have actually been run, ' +
				'which is currently just the batch printed to have stock to sell. What the ' +
				'site shows is the edition cap on the matching Rarity tier document.',
			validation: (rule) => rule.min(0)
		}),
		defineField({
			name: 'qrScans',
			title: 'QR scans',
			type: 'number',
			group: 'print',
			description:
				'Total scans of this card design across every copy — a collective counter, not a per-copy one.',
			validation: (rule) => rule.min(0)
		}),

		defineField({
			name: 'availability',
			type: 'string',
			group: 'commerce',
			description: 'A list rather than a boolean, so a third state can be added later.',
			options: {
				list: [
					{ title: 'Sold individually', value: 'individual' },
					{ title: 'Only in a pack', value: 'packOnly' }
				],
				layout: 'radio'
			},
			initialValue: 'individual'
		}),
		defineField({
			name: 'sold',
			type: 'number',
			group: 'commerce',
			validation: (rule) => rule.min(0)
		}),
		defineField({
			name: 'inventory',
			type: 'number',
			group: 'commerce',
			validation: (rule) => rule.min(0)
		}),
		defineField({
			name: 'etsyUrl',
			title: 'Etsy URL',
			type: 'url',
			group: 'commerce'
		}),
		defineField({
			name: 'openseaUrl',
			title: 'OpenSea URL',
			type: 'url',
			group: 'commerce'
		}),
		defineField({
			name: 'legacyId',
			title: 'Legacy ID',
			type: 'string',
			group: 'commerce',
			readOnly: true,
			description: 'The _id this record had in the v1 project. Import bookkeeping.'
		})
	],

	preview: {
		select: {
			smallName: 'smallName',
			bigName: 'bigName',
			edition: 'edition',
			media: 'artwork'
		},
		prepare: ({ smallName, bigName, edition, media }) => ({
			title: [smallName, bigName].filter(Boolean).join(' '),
			subtitle: edition ? `Edition ${edition}` : undefined,
			media
		})
	}
});
