import { defineType, defineField, defineArrayMember } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { LinkIcon } from '@sanity/icons/Link';

/**
 * Singleton. Everything here was hardcoded in v1 components, which meant a
 * deploy to change a FAQ answer or a nav label.
 *
 * The one document uses an explicit _id ('siteSettings') — the documented
 * exception to generated ids, so Studio Structure can pin it to a single entry.
 */
export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	icon: CogIcon,

	groups: [
		{ name: 'nav', title: 'Navigation', default: true },
		{ name: 'faq', title: 'FAQ' },
		{ name: 'cta', title: 'Call to action' }
	],

	fields: [
		defineField({
			name: 'navLinks',
			title: 'Navigation links',
			type: 'array',
			group: 'nav',
			of: [
				defineArrayMember({
					type: 'object',
					icon: LinkIcon,
					fields: [
						defineField({
							name: 'label',
							type: 'string',
							validation: (rule) => rule.required()
						}),
						defineField({
							name: 'href',
							type: 'string',
							description: 'Site-relative, e.g. /cards',
							validation: (rule) => rule.required()
						})
					],
					preview: { select: { title: 'label', subtitle: 'href' } }
				})
			],
			validation: (rule) => rule.max(6).warning('More than six items crowds the header.')
		}),
		defineField({
			name: 'socialLinks',
			title: 'Social links',
			type: 'array',
			group: 'nav',
			of: [
				defineArrayMember({
					type: 'object',
					icon: LinkIcon,
					fields: [
						defineField({
							name: 'platform',
							type: 'string',
							options: {
								list: [
									{ title: 'Instagram', value: 'instagram' },
									{ title: 'Twitter / X', value: 'twitter' },
									{ title: 'OpenSea', value: 'opensea' },
									{ title: 'Etsy', value: 'etsy' }
								]
							},
							validation: (rule) => rule.required()
						}),
						defineField({
							name: 'url',
							type: 'url',
							validation: (rule) => rule.required()
						})
					],
					preview: { select: { title: 'platform', subtitle: 'url' } }
				})
			],
			validation: (rule) => rule.unique()
		}),
		defineField({
			name: 'contactEmail',
			title: 'Contact email',
			type: 'string',
			group: 'nav',
			validation: (rule) => rule.email()
		}),

		defineField({
			name: 'nextDropAt',
			title: 'Next drop',
			type: 'datetime',
			group: 'cta',
			description:
				'Leave empty if nothing is scheduled — the countdown hides itself rather than showing a made-up date.'
		}),

		defineField({
			name: 'faqs',
			title: 'FAQ',
			type: 'array',
			group: 'faq',
			of: [
				defineArrayMember({
					type: 'object',
					icon: HelpCircleIcon,
					fields: [
						defineField({
							name: 'question',
							type: 'string',
							validation: (rule) => rule.required()
						}),
						defineField({
							name: 'answer',
							type: 'text',
							rows: 4,
							validation: (rule) => rule.required()
						})
					],
					preview: { select: { title: 'question', subtitle: 'answer' } }
				})
			]
		}),

		defineField({
			name: 'ctaHeading',
			title: 'Heading',
			type: 'string',
			group: 'cta'
		}),
		defineField({
			name: 'ctaBody',
			title: 'Body',
			type: 'text',
			rows: 2,
			group: 'cta'
		}),
		defineField({
			name: 'ctaButtonLabel',
			title: 'Button label',
			type: 'string',
			group: 'cta'
		}),
		defineField({
			name: 'ctaButtonHref',
			title: 'Button link',
			type: 'string',
			group: 'cta'
		})
	],

	preview: {
		prepare: () => ({ title: 'Site settings' })
	}
});
