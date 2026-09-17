import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { writeClient, rateLimit, clientIp, json } from '~/lib/server/sanityWrite';

export const prerender = false;

const apiKey = import.meta.env.RESEND_API_KEY;
const audienceId = import.meta.env.RESEND_AUDIENCE_ID;

// Deliberately loose. Strict email regexes reject valid addresses; the real
// check is whether the confirmation mail arrives.
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length < 320;

export const POST: APIRoute = async ({ request }) => {
	if (!rateLimit(`notify:${clientIp(request)}`, 3)) {
		return json({ error: 'Too many attempts. Try again shortly.' }, 429);
	}

	let email: unknown;
	let trap: unknown;
	try {
		const body = await request.json();
		({ email, trap } = body);
	} catch {
		return json({ error: 'Bad request.' }, 400);
	}

	if (trap) return json({ ok: true });

	if (typeof email !== 'string' || !looksLikeEmail(email.trim())) {
		return json({ error: 'That does not look like an email address.' }, 400);
	}
	const address = email.trim().toLowerCase();

	if (!apiKey || !audienceId) {
		return json({ error: 'Signups are not configured yet.' }, 503);
	}

	try {
		// Resend owns the list: it is what can actually send, handle opt-in and
		// process unsubscribes.
		const resend = new Resend(apiKey);
		const { error } = await resend.contacts.create({
			email: address,
			audienceId,
			unsubscribed: false
		});
		if (error) return json({ error: 'Could not sign you up. Try again?' }, 502);

		// Mirror into Sanity so signups are visible in the Studio. Best effort:
		// if this fails the person is still subscribed, which is what matters.
		if (writeClient) {
			await writeClient
				.createIfNotExists({
					_id: `subscriber.${address.replace(/[^a-z0-9]/g, '-')}`,
					_type: 'subscriber',
					email: address,
					subscribedAt: new Date().toISOString(),
					source: 'homepage-drop-band'
				})
				.catch(() => {});
		}

		return json({ ok: true });
	} catch {
		return json({ error: 'Could not sign you up. Try again?' }, 502);
	}
};
