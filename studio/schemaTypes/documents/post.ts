import { defineType, defineField, defineArrayMember } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';

/**
 * Field notes. The v1 blog lived in a separate, orphaned Sanity project and was
 * dropped from the rebuild; this is a fresh, minimal post type in the same
 * project as everything else.
 */
export const post = defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'excerpt',
			type: 'text',
			rows: 2,
			description: 'One sentence. Used on the homepage and in link previews.',
			validation: (rule) => rule.max(200).warning('Keep it under 200 characters.')
		}),
		defineField({
			name: 'category',
			type: 'string',
			description: 'The chip on the homepage card, e.g. "Behind the scenes".'
		}),
		defineField({
			name: 'tags',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			options: { layout: 'tags' },
			validation: (rule) => rule.unique().max(4)
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'coverImage',
			title: 'Cover image',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt text',
					type: 'string',
					description: 'Describe the image for someone who cannot see it.'
				})
			]
		}),
		defineField({
			name: 'body',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'block',
					styles: [
						{ title: 'Normal', value: 'normal' },
						{ title: 'Heading', value: 'h2' },
						{ title: 'Subheading', value: 'h3' },
						{ title: 'Quote', value: 'blockquote' }
					],
					lists: [
						{ title: 'Bullet', value: 'bullet' },
						{ title: 'Numbered', value: 'number' }
					]
				}),
				defineArrayMember({
					type: 'image',
					options: { hotspot: true },
					fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })]
				})
			]
		})
	],
	orderings: [
		{ title: 'Newest', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] }
	],
	preview: {
		select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' }
	}
});
