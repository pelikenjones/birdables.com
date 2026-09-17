import { defineType, defineField } from 'sanity';
import { StarIcon } from '@sanity/icons/Star';

/**
 * A bird people want drawn next. Votes are an atomic `inc()` on voteCount from
 * the /api/vote endpoint, so concurrent votes cannot clobber each other.
 *
 * Counts are baked into the static build, so the page shows the totals as of
 * the last deploy. That is fine for a running tally; it is not a live counter.
 */
export const nomination = defineType({
	name: 'nomination',
	title: 'Nomination',
	type: 'document',
	icon: StarIcon,
	fields: [
		defineField({
			name: 'birdName',
			title: 'Bird name',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'birdName', maxLength: 96 },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'voteCount',
			title: 'Votes',
			type: 'number',
			initialValue: 0,
			validation: (rule) => rule.min(0)
		}),
		defineField({
			name: 'status',
			type: 'string',
			description: 'Only approved nominations appear on the site.',
			options: {
				list: [
					{ title: 'Approved', value: 'approved' },
					{ title: 'Pending review', value: 'pending' },
					{ title: 'Rejected', value: 'rejected' }
				],
				layout: 'radio'
			},
			initialValue: 'pending'
		})
	],
	orderings: [
		{
			title: 'Most votes',
			name: 'votesDesc',
			by: [{ field: 'voteCount', direction: 'desc' }]
		}
	],
	preview: {
		select: { title: 'birdName', votes: 'voteCount', status: 'status' },
		prepare: ({ title, votes, status }) => ({
			title,
			subtitle: `${votes ?? 0} votes · ${status ?? 'pending'}`
		})
	}
});
