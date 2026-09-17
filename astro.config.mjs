// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';

// astro.config.mjs runs BEFORE Astro loads .env, so import.meta.env is empty here.
// loadEnv is the only supported way to read env vars in this file — everywhere else
// in the app, use import.meta.env.PUBLIC_*.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SANITY_API_VERSION } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	'PUBLIC_'
);

if (!PUBLIC_SANITY_PROJECT_ID) {
	throw new Error(
		'PUBLIC_SANITY_PROJECT_ID is not set. Copy .env.example to .env — the project id is `ubrw2onn`.\n' +
			'(`onAnzpJce` is the *organization* id and will 404 every request.)'
	);
}

export default defineConfig({
	site: 'https://www.birdables.com',

	// Still static: every page prerenders. The adapter exists only so the two
	// POST endpoints under /api can opt out with `export const prerender = false`.
	// Astro 5+ folded the old `hybrid` mode into `static`, so no mode change is
	// needed for this — see src/pages/api/.
	output: 'static',
	adapter: vercel(),

	// Arrow-key navigation between birds is a full page load, so the next and
	// previous pages are prefetched on hover/viewport. Without it there is a
	// visible blank flash while the next document is fetched.
	prefetch: { prefetchAll: false, defaultStrategy: 'viewport' },

	integrations: [
		sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET ?? 'production',
			apiVersion: PUBLIC_SANITY_API_VERSION ?? '2026-09-15',
			// false, deliberately. The usual argument for the CDN is per-request cost,
			// which a static build does not have — it fetches once. What it DOES have
			// is a race: publish in the Studio, trigger a build, and the CDN can still
			// be serving the previous version, so the deploy ships stale content. Cost
			// nothing, correctness everything.
			useCdn: false
		}),
		sitemap()
	],

	vite: {
		// The reference template carries a lodash/react-compiler `optimizeDeps.include`
		// list to work around Sanity's CJS interop under Vite. That only bites when
		// `sanity` itself is in the graph — i.e. the embedded Studio route. The Studio
		// is its own package here, so the app pulls only @sanity/client and the list
		// resolves nothing.
		plugins: [tailwindcss()],
		optimizeDeps: {
			// three is only reachable through a dynamic import fired on the 3D
			// toggle, so Vite does not see it at startup. It discovers the dep on
			// that first press, re-runs the optimiser, and the new `?v=` hash makes
			// the URL the open page is holding 404 — "Failed to fetch dynamically
			// imported module". Declaring it here pre-bundles it at server start,
			// with a hash that stays put. Dev only; the production build already
			// code-splits it correctly.
			include: ['three']
		}
	}
});
