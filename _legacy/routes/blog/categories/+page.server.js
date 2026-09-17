import { error } from '@sveltejs/kit';
import client from '#lib/sanityClient.js';

export async function load() {
	const filter = `*[_type == "category" && defined(pageInfo.slug.current)] | order(desc)`;
	const projections = `{
      ...,
      "count": count(*[_type == 'post' && references(^._id)])
    }`;
	const query = filter + projections;
	const params = '';
	const categories = await client.fetch(query, params);

	if (categories) {
		return { categories };
	}

	throw error(404, 'Not Found');
}
