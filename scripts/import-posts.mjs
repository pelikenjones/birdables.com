/**
 * Imports content/blog/*.md into Sanity as `post` documents.
 *
 * Frontmatter drives the metadata; the body converts to Portable Text with
 * @portabletext/markdown. Idempotent by slug, and posts marked `status: draft`
 * are created as Sanity drafts so nothing goes live by accident.
 *
 *   node --env-file=.env scripts/import-posts.mjs
 */
import { createClient } from '@sanity/client';
import { markdownToPortableText } from '@portabletext/markdown';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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

/** Minimal frontmatter parser — these files are ours and the shape is fixed. */
function parse(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) throw new Error('No frontmatter');
	const meta = {};
	for (const line of match[1].split('\n')) {
		const i = line.indexOf(':');
		if (i === -1) continue;
		meta[line.slice(0, i).trim()] = line
			.slice(i + 1)
			.trim()
			.replace(/^["']|["']$/g, '');
	}
	return { meta, body: match[2] };
}

const dir = 'content/blog';
if (!existsSync(dir)) {
	console.log('No content/blog directory — nothing to import.');
	process.exit(0);
}

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
	const { meta, body } = parse(readFileSync(join(dir, file), 'utf8'));
	const isDraft = meta.status === 'draft';

	// Must see drafts too — an unpublished post is invisible to the default
	// perspective, so a published-only lookup silently creates duplicates.
	const existing = await client
		.withConfig({ perspective: 'raw' })
		.fetch(`*[_type == "post" && slug.current == $s] | order(_id asc)[0]{_id}`, { s: meta.slug });

	const doc = {
		_type: 'post',
		title: meta.title,
		slug: { _type: 'slug', current: meta.slug },
		excerpt: meta.excerpt,
		category: meta.category,
		tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
		publishedAt: new Date(meta.publishedAt).toISOString(),
		body: markdownToPortableText(body)
	};

	if (existing?._id) {
		await client.patch(existing._id).set(doc).commit();
		console.log(`  updated ${meta.slug}`);
	} else {
		// A draft _id keeps it out of the published dataset the static build reads.
		const id = isDraft ? `drafts.${crypto.randomUUID()}` : undefined;
		await client.create(id ? { ...doc, _id: id } : doc);
		console.log(`  created ${meta.slug}${isDraft ? ' (draft)' : ''}`);
	}
}
