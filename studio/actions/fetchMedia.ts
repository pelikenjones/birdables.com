import { DownloadIcon } from '@sanity/icons/Download';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';

/**
 * "Fetch media" on the bird document.
 *
 * Deliberately thin: it POSTs to the site's /api/fetch-media and does nothing
 * else. All the licence filtering, downloading and asset upload happens
 * server-side, because the xeno-canto key must not reach a browser, Wikimedia
 * needs a descriptive User-Agent that browser JS cannot set, and neither
 * origin allows cross-origin reads from the Studio.
 */
const ENDPOINT = process.env.SANITY_STUDIO_MEDIA_ENDPOINT ?? 'http://localhost:4321/api/fetch-media';
const SECRET = process.env.SANITY_STUDIO_MEDIA_SECRET ?? '';

export const fetchMediaAction: DocumentActionComponent = (props: DocumentActionProps) => {
	const { draft, published, id } = props;
	const doc = (draft ?? published) as { scientificName?: string } | null;

	return {
		label: 'Fetch media',
		icon: DownloadIcon,
		disabled: !doc?.scientificName,
		title: doc?.scientificName
			? 'Fetch a call recording and photographs, and store them on this bird'
			: 'Add a scientific name first — it is what the sources are searched by',
		onHandle: async () => {
			try {
				const res = await fetch(ENDPOINT, {
					method: 'POST',
					headers: { 'content-type': 'application/json', 'x-media-secret': SECRET },
					body: JSON.stringify({ birdId: id })
				});
				const body = await res.json();

				if (!res.ok) {
					window.alert(`Could not fetch media.\n\n${body.error ?? res.statusText}`);
				} else {
					window.alert(
						`Media fetched.\n\n${(body.notes ?? []).join('\n')}\n\n` +
							'Only licences that permit commercial use are accepted, so a bird with ' +
							'no result simply has nothing usable published.'
					);
				}
			} catch (e) {
				window.alert(`Could not reach the media endpoint.\n\n${(e as Error).message}`);
			}
			props.onComplete();
		}
	};
};
