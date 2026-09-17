import { defineType, defineField } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons/Envelope';

/**
 * Mirror of the Resend audience, kept only so drop signups are visible in the
 * Studio alongside everything else. Resend remains the source of truth — it is
 * what can actually send mail, handle double opt-in and process unsubscribes.
 *
 * Deliberately NOT queried by the frontend. Nothing here should ever render.
 */
export const subscriber = defineType({
	name: 'subscriber',
	title: 'Drop subscriber',
	type: 'document',
	icon: EnvelopeIcon,
	fields: [
		defineField({
			name: 'email',
			type: 'string',
			readOnly: true,
			validation: (rule) => rule.required().email()
		}),
		defineField({
			name: 'subscribedAt',
			title: 'Subscribed at',
			type: 'datetime',
			readOnly: true
		}),
		defineField({
			name: 'source',
			type: 'string',
			readOnly: true,
			description: 'Which part of the site the signup came from.'
		})
	],
	preview: {
		select: { title: 'email', subtitle: 'subscribedAt' }
	}
});
