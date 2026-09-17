import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createClient } from '@sanity/client';

/**
 * Replaces stored recordings that exceed MAX_AUDIO_SECONDS, plus any saved
 * before duration was captured. Commons hosts hour-long soundscapes and
 * narrated field notes that a species search happily returns.
 *
 *   node scripts/refetch-audio.mjs   (dev server must be running)
 */

const secret = readFileSync('.env', 'utf8').match(/^MEDIA_FETCH_SECRET="([^"]+)"/m)[1];
const token = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ubrw2onn', dataset: 'production', apiVersion: '2026-09-15', token, useCdn: false });

// Anything over the cap, plus anything stored before duration was captured.
const birds = await client.fetch(
  `*[_type == "bird" && defined(audio.file.asset) && (!defined(audio.durationSeconds) || audio.durationSeconds > 60)]{_id, commonName, "d": audio.durationSeconds}`
);
console.log(`${birds.length} recordings to replace\n`);

for (const b of birds) {
  // Clear first, so a bird with no acceptable replacement ends up with none
  // rather than silently keeping the over-long one.
  await client.patch(b._id).unset(['audio']).commit();

  const res = await fetch('http://localhost:4321/api/fetch-media', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-media-secret': secret },
    body: JSON.stringify({ birdId: b._id, only: 'audio' })
  });
  const body = await res.json();
  console.log(`  ${b.commonName.padEnd(22)} was ${b.d ?? '?'}s → ${(body.notes ?? [body.error]).join(' ')}`);
  await new Promise((r) => setTimeout(r, 1200));
}
