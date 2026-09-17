import { error } from '@sveltejs/kit';
import client from '#lib/sanityClient.js';
import { postPerPage } from '../../config';
import { slugify, massageTopics } from '#lib/utils.js';

export async function load({ params }) {
	let allPostsWithTopic = []; // Initiate array of _id's for posts with topic
	let [topic, currentPage] = params.topic.split(',');

	// Set currentPage to 1 by default if it wasn't set in the URL
	currentPage = currentPage ? Number(currentPage) : 1;

	let perPage = postPerPage; // ToDo, consider setting this in sanity, but then we'll need to do an additional API call first to get that value
	let start = perPage * currentPage - perPage;
	let end = perPage * currentPage;

	let filter = `*[_type == 'post' && defined(topics)]`;
	let projection = `{
      topics,
      _id
    }`;
	let query = filter + projection;
	let queryParams = { topic, start, end };
	// Query all posts for _id's and topics.  A todo might be to get all the data in one query, and then just return the ones with the correct topic... hmmm
	const res = client
		.fetch(query, queryParams)
		.then((posts) => {
			// This step makes a list of the post _id's with the expected topic
			posts.forEach((post) => {
				post.topics.forEach((eachTopic) => {
					if (topic === slugify(eachTopic)) {
						allPostsWithTopic.push(post._id);
					}
				});
			});
			return allPostsWithTopic;
		})
		// Now we query just for the posts with our targeted _id's
		.then((allPostsWithTopic) => {
			filter = `*[][0]`;
			projection = `{
        ...,
        "posts": *[_type == 'post' && _id in $allPostsWithTopic] | order(publishedAt desc) [$start...$end] {...},
        "blogInfo": *[_type == "blog"][0]{...},
        "topics": *[_type == "post" && defined(topics)] {
          topics
        },
        "count": count(*[_type == 'post' && _id in $allPostsWithTopic])
      }`;

			query = filter + projection;
			params = { allPostsWithTopic, start, end };
			let results = client.fetch(query, params);
			return results;
		})
		.then((results) => {
			const { posts, count, blogInfo, topics: allTopics } = results;
			let topics = massageTopics(allTopics);
			return {
				posts,
				currentPage,
				perPage,
				count,
				blogInfo,
				topics,
				topic
			};
		});

	if (res) {
		return res;
	}

	throw error(404, 'Not Found');
}
