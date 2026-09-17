import client from '#lib/sanityClient.js';

export async function load() {
	const constraints = `*[][0]`;
	const projections = `{
    "authors": *[_type == "author" && defined(pageInfo.slug.current)] | order(pageInfo.name asc){
      ...
    }
  }`;
	const query = constraints + projections;
	const params = {};
	const data = await client.fetch(query, params);

	return {
		authors: data.authors
	};
}
