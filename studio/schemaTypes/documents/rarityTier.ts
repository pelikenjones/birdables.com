import { defineType, defineField } from 'sanity';
import { StarFilledIcon } from '@sanity/icons/StarFilled';

/**
 * What a rarity level MEANS — five reference documents, one per level.
 *
 * `maxPhysical` / `maxDigital` are the cap for one rarity in ONE EDITION. A
 * 1-star 1st edition will only ever have 2,000 physical copies; a 1-star 2nd
 * edition would get its own 2,000. This cap is the scarcity story and the only
 * print number the site shows.
 *
 * How many have actually been run so far (`card.totalPrinted`) is an internal
 * inventory fact and is deliberately NOT surfaced — the current 50 per card is
 * just a batch Ken ran to have stock to sell, and showing it makes a 2,000-copy
 * edition look like a 50-copy one.
 */
export const rarityTier = defineType({
	name: 'rarityTier',
	title: 'Rarity tier',
	type: 'document',
	icon: StarFilledIcon,
	fields: [
		defineField({
			name: 'level',
			type: 'number',
			description: '1 is the most common, 5 the rarest.',
			options: {
				list: [1, 2, 3, 4, 5].map((n) => ({ title: String(n), value: n })),
				layout: 'radio'
			},
			validation: (rule) => rule.required().min(1).max(5)
		}),
		defineField({
			name: 'label',
			type: 'string',
			description: 'How rare this is, in plain terms.',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'maxPhysical',
			title: 'Maximum physical copies',
			type: 'number',
			description: 'The cap for this rarity in a single edition. Shown on the site.',
			validation: (rule) => rule.required().min(1)
		}),
		defineField({
			name: 'maxDigital',
			title: 'Maximum digital copies',
			type: 'number',
			description: 'The cap for this rarity in a single edition. Shown on the site.',
			validation: (rule) => rule.required().min(1)
		})
	],
	orderings: [{ title: 'Level', name: 'level', by: [{ field: 'level', direction: 'asc' }] }],
	preview: {
		select: { level: 'level', label: 'label', max: 'maxPhysical' },
		prepare: ({ level, label, max }) => ({
			title: `${level} — ${label}`,
			subtitle: `up to ${max?.toLocaleString('en-US')} physical per edition`
		})
	}
});
