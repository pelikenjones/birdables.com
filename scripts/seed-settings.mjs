/**
 * Seeds the siteSettings singleton with copy that was hardcoded in v1
 * components and in the design spec (design/canvas/build.mjs).
 *
 * createIfNotExists, so re-running never clobbers edits made in the Studio.
 * Pass --force to overwrite.
 *
 *   node --env-file=.env scripts/seed-settings.mjs [--force]
 */
import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const FORCE = process.argv.includes('--force');

function resolveToken() {
	if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN;
	const cfg = join(homedir(), '.config/sanity/config.json');
	if (existsSync(cfg)) {
		const t = JSON.parse(readFileSync(cfg, 'utf8'))?.authToken;
		if (t) return t;
	}
	throw new Error('No write token. Set SANITY_WRITE_TOKEN in .env or run `sanity login`.');
}

const client = createClient({
	projectId: 'ubrw2onn',
	dataset: 'production',
	apiVersion: '2026-09-15',
	token: resolveToken(),
	useCdn: false
});

const doc = {
	_id: 'siteSettings',
	_type: 'siteSettings',

	navLinks: [
		{ _key: 'cards', label: 'Cards', href: '/cards' },
		{ _key: 'about', label: 'About Birdables', href: '/about' },
		{ _key: 'blog', label: 'Blog', href: '/blog' }
	],
	socialLinks: [
		{ _key: 'ig', platform: 'instagram', url: 'https://instagram.com/Birdables_Cards' },
		{ _key: 'tw', platform: 'twitter', url: 'https://twitter.com/BirdablesCards' },
		{ _key: 'os', platform: 'opensea', url: 'https://opensea.io/collection/birdables' }
	],
	contactEmail: 'birdables@gmail.com',

	faqs: [
		{
			_key: 'physical',
			question: 'What are the physical cards like?',
			answer:
				'They are 6.4cm (2.5 in) × 8.9cm (3.5 in) — standard trading card size, so they fit your existing sleeves. Printed on high quality 100% recycled paper with a cross-hatch texture, sturdy with a slight bend. Physical cards are no longer available for purchase.'
		},
		{
			_key: 'digital',
			question: 'What is the digital version?',
			answer:
				'An NFT you keep in your wallet, verifiable on the Polygon blockchain, which comes with the hi-res artwork. Digital cards are scarcer than physical ones.'
		},
		{
			_key: 'conservation',
			question: 'How do Birdables help birds?',
			answer:
				'A portion of profits goes to conservation organisations like the Cornell Lab of Ornithology, eBird and Audubon. Nothing is printed on virgin paper, so no trees come down for a Birdable.'
		},
		{
			_key: 'contact',
			question: 'How do I get in touch?',
			answer:
				'Email birdables@gmail.com — there are still a few physical cards in a personal stash, so it is worth asking.'
		}
	],

	ctaHeading: 'The whole flock is waiting.',
	ctaBody:
		'Beautifully illustrated, sustainably printed, and packed with real bird science. Each Birdable is a tiny field guide you can hold in your hand — or trade with a friend.',
	ctaButtonLabel: 'Browse the cards',
	ctaButtonHref: '/cards'
};

if (FORCE) {
	await client.createOrReplace(doc);
	console.log('siteSettings replaced');
} else {
	await client.createIfNotExists(doc);
	console.log('siteSettings seeded (existing document left alone; --force to overwrite)');
}
