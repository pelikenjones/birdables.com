import type { APIRoute } from 'astro';
import { writeClient, rateLimit, clientIp, json } from '~/lib/server/sanityWrite';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	if (!writeClient) return json({ error: 'Voting is not configured.' }, 503);

	if (!rateLimit(`vote:${clientIp(request)}`)) {
		return json({ error: 'Too many votes. Try again in a minute.' }, 429);
	}

	let id: unknown;
	let trap: unknown;
	try {
		({ id, trap } = await request.json());
	} catch {
		return json({ error: 'Bad request.' }, 400);
	}

	// Honeypot: a real person never fills a field they cannot see.
	if (trap) return json({ ok: true });

	if (typeof id !== 'string' || !/^[a-zA-Z0-9._-]+$/.test(id)) {
		return json({ error: 'Bad request.' }, 400);
	}

	try {
		// inc() is atomic server-side, so simultaneous votes can't clobber.
		const updated = await writeClient
			.patch(id)
			.setIfMissing({ voteCount: 0 })
			.inc({ voteCount: 1 })
			.commit({ returnDocuments: true });

		return json({ ok: true, voteCount: updated.voteCount });
	} catch {
		return json({ error: 'Could not record that vote.' }, 500);
	}
};
