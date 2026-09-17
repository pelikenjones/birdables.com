# birdables.com

Collectible bird cards. Astro static frontend, Sanity content, deployed on Vercel.

## Layout

```
.                 Astro app (src/, public/) — the site
studio/           Sanity Studio, deployed separately
design/canvas/    The signed-off design spec. Read it, don't run it.
_legacy/          The v1 SvelteKit app. Porting reference only; deleted before merge.
```

## Getting started

```sh
pnpm install
cp .env.example .env     # values are already correct; add tokens if you need them
pnpm dev                 # site on :4321
pnpm studio              # Studio on :3333
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Astro dev server |
| `pnpm build` | Static build to `dist/` |
| `pnpm check` | `astro check` — types and template diagnostics |
| `pnpm typegen` | Extract the Studio schema and regenerate `src/lib/sanity.types.ts` |
| `pnpm studio` | Run the Studio locally |
| `pnpm format` | Prettier |

Run `pnpm typegen` after any schema or query change. `studio/schema.json` and
`src/lib/sanity.types.ts` are committed so a fresh clone type-checks without it.

## Configuration

**Env vars: one file, one prefix.** `.env` at the repo root.

- `PUBLIC_*` is read by the Astro app and ships to the browser. `astro.config.mjs`
  runs before Astro loads `.env`, so it reads them with Vite's `loadEnv`;
  everywhere else uses `import.meta.env.PUBLIC_*`.
- Unprefixed vars are server-side only (`SANITY_WRITE_TOKEN`, used by migration
  scripts — the static build fetches published content unauthenticated).

The Studio does not read `.env`. Its project id and dataset live in
`studio/sanity.project.ts`; see that file for why.

> The Sanity **project** id is `ubrw2onn`. `onAnzpJce` is the **organization** id —
> v1's `.env.local` had the latter, which 404s every request.

## Architecture notes

- **Static, no server routes.** Visual Editing was deliberately dropped, which is
  what lets `output: 'static'` work. That also removes `@astrojs/vercel`,
  `@astrojs/react`, `react`, `react-dom`, `react-is`, `styled-components` and the
  frontend's `sanity` dependency — in the reference template those exist *only* to
  serve Visual Editing and the Studio's peer deps.
- **`getStaticPaths()` is hoisted into its own module context.** Module-scope
  consts in a page's frontmatter are invisible inside it. Declare queries inside
  the function or import them, or you get a silent `ReferenceError`.
- **Theme is light by default**, with dark as an explicit opt-in stored under
  `birdables:theme`. `prefers-color-scheme` is deliberately not consulted; see
  `src/lib/theme.ts`.
- **`vercel.json` must stay at the repo root.** Vercel only reads it there — in v1
  it sat in `src/`, so the PostHog proxy rewrites never applied.

## Design

`design/canvas/README.md` explains the spec files and the three known corrections
to apply while building (print runs are 50, no bird sounds, the scan section is
rewritten). Live canvas:
<https://claude.ai/artifact/32KRfPifDdZdjd1Vuv4A5w>

Implementation plan: `~/.claude/plans/warm-crafting-starlight.md`
