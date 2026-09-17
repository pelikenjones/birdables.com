import { createClient } from '@sanity/client';

const client = createClient({
	projectId: 'pdzqg4pl',
	dataset: 'production',
	apiVersion: '2026-03-29',
	token: '', // or leave blank for unauthenticated usage
	useCdn: false // `false` if you want to ensure fresh data
});

export default client;
