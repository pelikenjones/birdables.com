/** Backfills card.specialty from birds.json, which is the only source for it. */
import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const token =
	process.env.SANITY_WRITE_TOKEN ??
	JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;

const client = createClient({
	projectId: 'ubrw2onn',
	dataset: 'production',
	apiVersion: '2026-09-15',
	token,
	useCdn: false
});

const staticBirds = JSON.parse(readFileSync('_legacy/lib/data/birds.json', 'utf8'));
const cards = await client.fetch(`*[_type == "card"]{_id, "slug": slug.current}`);

let tx = client.transaction();
let n = 0;
for (const card of cards) {
	const s = staticBirds.find((b) => b.slug === card.slug);
	if (!s) continue;
	tx = tx.patch(card._id, (p) => p.set({ specialty: s.specialty ? 'specialty' : 'standard' }));
	if (s.specialty) n++;
}
await tx.commit();
console.log(`patched ${cards.length} cards — ${n} marked specialty`);
