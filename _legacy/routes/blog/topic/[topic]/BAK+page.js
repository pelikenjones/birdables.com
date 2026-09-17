import { error } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export async function load({ params, fetch }) {
	let { topic } = params;
	const res = await fetch(resolve(`data/blog/topic/${topic}`));

	const { posts, currentPage, perPage, count, blogInfo, categories, topics } = await res.json();

	if (!posts || posts.length === 0) {
		throw error(404);
	}

	if (res) {
		return { posts, currentPage, perPage, count, blogInfo, categories, topics, topic };
	}

	throw error(400, 'not found');
}
