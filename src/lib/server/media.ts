/**
 * Fetching borrowed media from xeno-canto and Wikimedia Commons.
 *
 * Both sources licence PER ITEM. Birdables sells cards, so anything carrying a
 * NonCommercial or NoDerivatives clause is unusable no matter how good it is —
 * these helpers reject those rather than leaving the judgement to a human
 * clicking a button.
 *
 * Both are also fetched ONCE per bird and stored in Sanity. That is a licence
 * and etiquette requirement as much as a performance one: xeno-canto actively
 * discourages repeated automated requests, and Wikimedia will block clients
 * that behave like bots without identifying themselves.
 *
 * ┌─ UNRESOLVED, 2026-09-16 ──────────────────────────────────────────────┐
 * │ Two layers, only one of them settled.                                 │
 * │                                                                        │
 * │ REUSING a recording is governed by the CC licence the recordist chose. │
 * │ CC BY / BY-SA / CC0 permit commercial use with attribution, full stop. │
 * │ That is solid, and the filter below enforces it.                       │
 * │                                                                        │
 * │ QUERYING the xeno-canto API may be a separate matter: their terms are  │
 * │ reported to offer "unlimited access for NON-COMMERCIAL use", and       │
 * │ Birdables sells cards. The terms page is behind bot protection and has │
 * │ not been read. Ask xeno-canto directly before enabling audio.          │
 * │                                                                        │
 * │ Until then leave XENO_CANTO_API_KEY unset — with no key, findAudio is  │
 * │ never called and nothing is requested or stored.                       │
 * │                                                                        │
 * │ Wikimedia Commons is unaffected: its reuse terms and User-Agent policy │
 * │ are public and were read.                                              │
 * └────────────────────────────────────────────────────────────────────────┘
 */

/**
 * Commons hosts hour-long soundscapes and narrated field notes alongside clean
 * call recordings, and nothing in the metadata distinguishes them. Length is
 * the one usable proxy: a call or song is seconds, not minutes. A bird with no
 * short recording is better served by no player at all.
 */
export const MAX_AUDIO_SECONDS = 60;

/** Licences that permit commercial reuse. Everything else is refused. */
const COMMERCIAL_OK = [
	/^cc0/i,
	/^public domain/i,
	/^pd(-|$)/i,
	/^cc[- ]by(?![-\s]*(nc|nd))/i,
	/^cc[- ]by[- ]sa/i
];

export function licenseAllowsCommercial(license: string | undefined | null): boolean {
	if (!license) return false;
	const l = license.trim();
	// Explicit bars first — "CC BY-NC-SA" must never match the CC BY rule.
	if (/\bnc\b|noncommercial|non-commercial/i.test(l)) return false;
	if (/\bnd\b|noderiv/i.test(l)) return false;
	// GFDL is technically free but incompatible in practice for a commercial site.
	if (/gfdl|gnu free/i.test(l)) return false;
	return COMMERCIAL_OK.some((re) => re.test(l));
}

/**
 * Wikimedia requires a descriptive User-Agent with contact information.
 * Generic agents ("node-fetch", "curl") may be blocked without notice, and
 * copying a browser UA is treated as malicious.
 */
export const WIKIMEDIA_UA =
	'BirdablesBot/1.0 (https://www.birdables.com; birdables@gmail.com) node-fetch';

export interface FetchedPhoto {
	title: string;
	url: string;
	author: string;
	license: string;
	sourceUrl: string;
}

const stripTags = (v: string) => v.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export async function findPhotos(scientificName: string, want = 3): Promise<FetchedPhoto[]> {
	const params = new URLSearchParams({
		action: 'query',
		generator: 'search',
		gsrsearch: `${scientificName} filetype:bitmap`,
		gsrlimit: '30',
		gsrnamespace: '6',
		prop: 'imageinfo',
		iiprop: 'url|extmetadata',
		iiurlwidth: '1600',
		format: 'json'
	});

	const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
		headers: { 'User-Agent': WIKIMEDIA_UA }
	});
	if (!res.ok) throw new Error(`Wikimedia returned ${res.status}`);
	const json = await res.json();

	// Diagrams, range maps and rescue documentation are not portraits of the bird.
	const unwanted = /oiled|birdwash|cleaner|rinse|rescue|\bmap\b|distribution|chart|diagram|logo|stamp|skeleton|skull|egg|nest box|sign/i;

	const photos: FetchedPhoto[] = [];
	for (const page of Object.values<any>(json?.query?.pages ?? {})) {
		const info = page?.imageinfo?.[0];
		if (!info) continue;

		const title = String(page.title).replace(/^File:/, '');
		if (unwanted.test(title)) continue;
		if (!/\.(jpe?g|png)$/i.test(title)) continue;

		const meta = info.extmetadata ?? {};
		const license = stripTags(meta.LicenseShortName?.value ?? '');
		if (!licenseAllowsCommercial(license)) continue;

		const author = stripTags(meta.Artist?.value ?? '') || 'Unknown';
		photos.push({
			title,
			url: info.thumburl ?? info.url,
			author,
			license,
			sourceUrl: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title)}`
		});
		if (photos.length >= want) break;
	}
	return photos;
}

/**
 * Commons hosts a large mirror of xeno-canto's CC BY-SA recordings, with the XC
 * catalogue number kept in the filename. Taking them from here means no API key
 * and no dependence on xeno-canto's own service terms — Commons' reuse terms
 * are public and guarantee everything hosted is freely licensed.
 *
 * The search needs real filtering: a bare species search also returns
 * pronunciation clips of the bird's NAME in various languages, and xeno-canto's
 * unidentified recordings, neither of which is the bird.
 */
export async function findAudioOnCommons(
	scientificName: string,
	commonName: string
): Promise<FetchedAudio | null> {
	const params = new URLSearchParams({
		action: 'query',
		generator: 'search',
		gsrsearch: `${scientificName} filetype:audio`,
		gsrlimit: '30',
		gsrnamespace: '6',
		prop: 'imageinfo',
		// `size` is what makes imageinfo return a duration for audio.
		iiprop: 'url|extmetadata|size',
		format: 'json'
	});

	const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
		headers: { 'User-Agent': WIKIMEDIA_UA }
	});
	if (!res.ok) throw new Error(`Wikimedia returned ${res.status}`);
	const json = await res.json();

	// "De-Schneeeule.ogg" is someone saying the German word, not an owl.
	const pronunciation = /^[a-z]{2}-|\(intro\)|pronunciation|aussprache|\bspoken\b/i;
	const unidentified = /identity unknown|mystery mystery|unidentified|soundscape/i;
	const audio = /\.(ogg|oga|mp3|wav|flac)$/i;

	let best: FetchedAudio | null = null;

	for (const page of Object.values<any>(json?.query?.pages ?? {})) {
		const info = page?.imageinfo?.[0];
		if (!info) continue;

		const title = String(page.title).replace(/^File:/, '');
		if (!audio.test(title)) continue;
		if (pronunciation.test(title) || unidentified.test(title)) continue;

		// The filename must actually name the bird, or it is something adjacent.
		const names = [scientificName, commonName].map((n) => n.toLowerCase());
		if (!names.some((n) => title.toLowerCase().includes(n))) continue;

		const meta = info.extmetadata ?? {};
		const license = stripTags(meta.LicenseShortName?.value ?? '');
		if (!licenseAllowsCommercial(license)) continue;

		const seconds = Math.round(info.duration ?? 0);
		if (seconds > MAX_AUDIO_SECONDS) continue;

		const xc = title.match(/XC(\d+)/i);
		const candidate: FetchedAudio = {
			id: xc?.[1] ?? title,
			url: info.url,
			author: stripTags(meta.Artist?.value ?? '') || 'Unknown',
			license,
			sourceUrl:
				info.descriptionurl ??
				`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title)}`,
			type: 'call',
			seconds,
			title: title.replace(/\.[a-z0-9]+$/i, ''),
			source: 'wikimedia'
		};

		// Prefer a recording that came from xeno-canto — those are field
		// recordings of the bird rather than incidental audio.
		if (xc) return candidate;
		best ??= candidate;
	}

	return best;
}

export interface FetchedAudio {
	id: string;
	url: string;
	author: string;
	license: string;
	sourceUrl: string;
	type: string;
	seconds: number;
	/** The recording's own title — the "T" in Creative Commons' TASL. */
	title: string;
	source: 'xeno-canto' | 'wikimedia';
}

const toSeconds = (len: string) => {
	const [m = '0', s = '0'] = String(len).split(':');
	return Number(m) * 60 + Number(s);
};

export async function findAudio(
	scientificName: string,
	apiKey: string
): Promise<FetchedAudio | null> {
	// One query per bird, on demand. xeno-canto discourages bulk automated use.
	const params = new URLSearchParams({
		query: `sp:"${scientificName}" q:A`,
		key: apiKey
	});

	const res = await fetch(`https://xeno-canto.org/api/3/recordings?${params}`, {
		headers: { 'User-Agent': WIKIMEDIA_UA }
	});
	if (!res.ok) throw new Error(`xeno-canto returned ${res.status}`);
	const json = await res.json();

	for (const rec of json?.recordings ?? []) {
		const license = String(rec.lic ?? '').replace(/^\/\//, 'https://');
		// xeno-canto reports the licence as a creativecommons.org URL.
		const readable = license
			.replace(/^https?:\/\/creativecommons\.org\/licenses\//, 'CC ')
			.replace(/^https?:\/\/creativecommons\.org\/publicdomain\/zero\//, 'CC0 ')
			.replace(/\/$/, '')
			.replace(/\//g, ' ')
			.toUpperCase();

		if (!licenseAllowsCommercial(readable)) continue;
		if (!rec.file) continue;

		return {
			id: rec.id,
			url: rec.file,
			author: rec.rec ?? 'Unknown',
			license: readable,
			sourceUrl: rec.url?.startsWith('//') ? `https:${rec.url}` : rec.url,
			type: rec.type ?? 'call',
			seconds: toSeconds(rec.length ?? '0:00'),
			// CC asks for Title, Author, Source, Licence. Without this we were
			// crediting three of the four.
			title: [rec.en, rec.type].filter(Boolean).join(' — ') || 'Recording',
			source: 'xeno-canto'
		};
	}
	return null;
}
