import birds from '#lib/data/birds.json';

export function fetchLiveBirds() {
	return birds.filter((bird) => bird.liveOnSite);
}

export function fetchAllBirds() {
	return birds;
}
