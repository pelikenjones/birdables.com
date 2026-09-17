/**
 * Public Sanity identifiers for the Studio.
 *
 * These are deliberately NOT env vars. Sanity's bundler only exposes the
 * `SANITY_STUDIO_*` prefix and only reads .env files from the Studio's own
 * directory, so pulling them from the repo-root .env would mean either a second
 * env-var scheme or a symlink. Neither is worth it: a project id and a dataset
 * name are public (they ship in every client bundle) and stable for the life of
 * the project.
 *
 * The Astro app reads its copies from the repo-root .env as PUBLIC_SANITY_*.
 * If the project ever moves, both places change.
 *
 * `ubrw2onn` is the PROJECT id. `onAnzpJce` is the ORGANIZATION id — the v1
 * .env.local had the latter, which 404s every request.
 */
export const projectId = 'ubrw2onn';
export const dataset = 'production';
export const apiVersion = '2026-09-15';
