import { error } from '@sveltejs/kit';
import { fetchAllBirds, fetchLiveBirds } from '#lib/birds.js';
import { returnBirdFromParam } from '#lib/utils.js';

export const prerender = true;

export function entries() {
	const birds = fetchAllBirds();
	return birds.map((bird) => ({ slug: bird.slug }));
}

export async function load({ params }) {
	const birds = fetchAllBirds();
	const bird = returnBirdFromParam(params.slug, 'slug', birds);

	if (bird) {
		const liveBirds = fetchLiveBirds();
		const index = liveBirds.findIndex((b) => b.slug === bird.slug);
		const prevBird =
			index === -1 ? undefined : liveBirds[(index - 1 + liveBirds.length) % liveBirds.length];
		const nextBird = index === -1 ? undefined : liveBirds[(index + 1) % liveBirds.length];

		return {
			bird,
			prevSlug: prevBird?.slug,
			prevBirdName: prevBird?.birdName,
			nextSlug: nextBird?.slug,
			nextBirdName: nextBird?.birdName
		};
	}

	throw error(404, 'Not found');
}
