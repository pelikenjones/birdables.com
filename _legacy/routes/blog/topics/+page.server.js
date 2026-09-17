import client from '#lib/sanityClient.js';
import { massageTopics } from '#lib/utils.js';

export async function load() {
	const constraints = `*[_type == "post" && defined(topics)]`;
	const projections = `{
      topics,
      "count": count(topics)
    }`;
	const query = constraints + projections;
	const topicsResults = await client.fetch(query);
	let topics = massageTopics(topicsResults);

	return { topics };
}
