import { error } from '@sveltejs/kit';
import client from '#lib/sanityClient.js';

export async function load({ params }) {
	const postFilter = `*[_type == "post" && pageInfo.slug.current == "${params.post}"][0]`;
	const postProjection = `{
      ...,
      authors[]->{pageInfo, image, _id},
      categories[]->{pageInfo, image, _id},
    }`;

	const postQuery = postFilter + postProjection;
	const post = await client.fetch(postQuery);

	if (post) {
		return {
			post
		};
	}

	throw error(404, 'Not Found');
}
