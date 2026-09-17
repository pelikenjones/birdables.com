import { error } from '@sveltejs/kit';
import client from '#lib/sanityClient.js';
import { postPerPage } from '../../config';

export async function load({ params }) {
	// Get the page params
	let [category, currentPage] = params.category.split(',');

	// Set currentPage to 1 by default if it wasn't set in the URL
	currentPage = currentPage ? Number(currentPage) : 1;

	const perPage = postPerPage; // ToDo, consider setting this in sanity, but then we'll need to do an additional API call first to get that value
	const start = perPage * currentPage - perPage;
	const end = perPage * currentPage;

	const filter = '*[_type == "category" && pageInfo.slug.current == $category][0]';
	const projection = `{
      ...,
      "posts": *[_type == 'post' && references(^._id)] | order(publishedAt desc) [$start...$end] {
        ...
      },
      "blogInfo": *[_type == "blog"][0]{...},
      "categories": *[_type == "category"]{
        _id,
        pageInfo,
        "count": count(*[_type == 'post' && references(^._id)])
      },
      "count": count(*[_type == 'post' && references(^._id)])
    }`;

	const query = filter + projection;
	const queryParams = { category, start, end };
	const categoryInfo = await client.fetch(query, queryParams);
	const { posts, count, categories, blogInfo } = categoryInfo;

	if (categoryInfo) {
		return { posts, categoryInfo, currentPage, perPage, count, blogInfo, categories };
	}

	throw error(404, 'Not Found');
}
