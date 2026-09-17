/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
	readonly PUBLIC_SANITY_PROJECT_ID: string;
	readonly PUBLIC_SANITY_DATASET: string;
	readonly PUBLIC_SANITY_API_VERSION: string;
	readonly PUBLIC_POSTHOG_KEY?: string;
	/** Server-only. Never referenced from a prerendered page. */
	readonly SANITY_WRITE_TOKEN?: string;
	readonly RESEND_API_KEY?: string;
	readonly RESEND_AUDIENCE_ID?: string;
	readonly XENO_CANTO_API_KEY?: string;
	readonly MEDIA_FETCH_SECRET?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
