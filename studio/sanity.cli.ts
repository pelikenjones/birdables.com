import { defineCliConfig } from 'sanity/cli';
import { projectId, dataset } from './sanity.project';

/**
 * Studio lives in studio/, the Astro app at the repo root, so TypeGen reads
 * queries from ../src and writes the generated types back there — the app owns
 * the types it consumes, and `overloadClientMethods` (on by default) makes
 * sanityClient.fetch() infer from any defineQuery() it finds.
 *
 * schema.json and sanity.types.ts are both committed: every clone, CI job and
 * type check then starts from the same types without running the CLI first.
 */
export default defineCliConfig({
	api: { projectId, dataset },
	typegen: {
		path: ['../src/**/*.{ts,tsx,js,jsx,astro}'],
		schema: './schema.json',
		generates: '../src/lib/sanity.types.ts',
		overloadClientMethods: true
	}
});
