import type { APIRoute } from 'astro';
import { writeClient, json } from '~/lib/server/sanityWrite';
import { findAudio, findAudioOnCommons, findPhotos, WIKIMEDIA_UA } from '~/lib/server/media';

export const prerender = false;

/**
 * Fetches a bird's call recording and photographs once, and stores them in
 * Sanity. Triggered by the "Fetch media" button on the bird document.
 *
 * Server-side on purpose: the xeno-canto key never reaches a browser, there is
 * no CORS problem, and the request carries the descriptive User-Agent Wikimedia
 * requires. Guarded by a shared secret so it is not an open upload endpoint.
 */
const SECRET = import.meta.env.MEDIA_FETCH_SECRET;

async function upload(kind: 'image' | 'file', url: string, filename: string) {
	const res = await fetch(url, { headers: { 'User-Agent': WIKIMEDIA_UA } });
	if (!res.ok) throw new Error(`Could not download ${filename} (${res.status})`);
	const buffer = Buffer.from(await res.arrayBuffer());
	return writeClient!.assets.upload(kind, buffer, { filename });
}

export const POST: APIRoute = async ({ request }) => {
	if (!writeClient) return json({ error: 'Sanity write access is not configured.' }, 503);
	if (!SECRET || request.headers.get('x-media-secret') !== SECRET) {
		return json({ error: 'Not authorised.' }, 401);
	}

	let birdId: unknown;
	let only: unknown;
	try {
		({ birdId, only } = await request.json());
	} catch {
		return json({ error: 'Bad request.' }, 400);
	}
	if (typeof birdId !== 'string') return json({ error: 'birdId is required.' }, 400);

	// `only: 'audio' | 'photos'` re-runs one half without re-uploading the other.
	const wantPhotos = only !== 'audio';
	const wantAudio = only !== 'photos';

	const bird = await writeClient.fetch(
		`*[_type == "bird" && _id == $id][0]{ _id, commonName, scientificName }`,
		{ id: birdId.replace(/^drafts\./, '') }
	);
	if (!bird?.scientificName) {
		return json({ error: 'That bird has no scientific name to search on.' }, 422);
	}

	const notes: string[] = [];
	const patch: Record<string, unknown> = { mediaFetchedAt: new Date().toISOString() };

	// ── photographs ────────────────────────────────────────────────────────
	if (wantPhotos) try {
		const found = await findPhotos(bird.scientificName, 3);
		if (!found.length) {
			notes.push('No commercially-licensed photos found on Wikimedia Commons.');
		} else {
			const photos = [];
			for (const [i, photo] of found.entries()) {
				const asset = await upload('image', photo.url, photo.title);
				photos.push({
					_key: `photo-${i}`,
					_type: 'object',
					image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
					alt: `${bird.commonName} photographed by ${photo.author}`,
					credit: {
						_type: 'mediaCredit',
						author: photo.author,
						license: photo.license,
						source: 'wikimedia',
						sourceUrl: photo.sourceUrl,
						sourceId: photo.title
					}
				});
			}
			patch.photos = photos;
			notes.push(`${photos.length} photo(s) stored.`);
		}
	} catch (e) {
		notes.push(`Photos failed: ${(e as Error).message}`);
	}

	// ── call recording ─────────────────────────────────────────────────────
	// Commons first. It mirrors a large slice of xeno-canto's CC BY-SA
	// recordings, so most birds are reachable WITHOUT using xeno-canto's own
	// API — which sidesteps the unresolved question about their service terms.
	// The direct xeno-canto path stays as a fallback but only runs if a key has
	// deliberately been set.
	const xcKey = import.meta.env.XENO_CANTO_API_KEY;
	if (wantAudio) try {
		let rec = await findAudioOnCommons(bird.scientificName, bird.commonName);
		if (!rec && xcKey) rec = await findAudio(bird.scientificName, xcKey);

		if (!rec) {
			notes.push(
				xcKey
					? 'No commercially-licensed recording found on Commons or xeno-canto.'
					: 'No commercially-licensed recording on Wikimedia Commons for this bird.'
			);
		} else {
			const ext = rec.url.match(/\.([a-z0-9]+)(?:\?|$)/i)?.[1] ?? 'mp3';
			const asset = await upload('file', rec.url, `${bird.scientificName}-${rec.id}.${ext}`);
			patch.audio = {
				_type: 'object',
				file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
				title: rec.title,
				durationSeconds: rec.seconds || undefined,
				credit: {
					_type: 'mediaCredit',
					author: rec.author,
					license: rec.license,
					source: rec.source,
					sourceUrl: rec.sourceUrl,
					sourceId: /^\d+$/.test(rec.id) ? `XC${rec.id}` : rec.id
				}
			};
			notes.push(`Recording stored from ${rec.source} (${rec.license}).`);
		}
	} catch (e) {
		notes.push(`Audio failed: ${(e as Error).message}`);
	}

	await writeClient.patch(bird._id).set(patch).commit();
	return json({ ok: true, notes });
};
