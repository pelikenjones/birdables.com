# Hosting: Vercel or Cloudflare

**Status: open. Ken decides.** Written 2026-09-17, nothing acted on.

Nothing here blocks a Vercel deploy — that path is ready today. This exists so
the question does not get re-researched from scratch, and so a move to
Cloudflare, if it happens, does not re-break things that are already fixed.

## Short version

Deploy to Vercel unless its Hobby-tier terms do not cover a commercial site.
That is the only open question that actually changes the answer; everything
else is a wash or a small cost.

## Performance is not the deciding factor

Every page on this site is prerendered. Only three routes are not:
`/api/notify`, `/api/vote`, `/api/fetch-media` (`output: 'static'` plus
`prerender = false` on those three — see `astro.config.mjs`).

So ~99% of traffic is static files off a CDN, which both platforms do
identically well. The difference between the platforms only touches two form
posts and an admin button. It will never be perceptible. Do not pick on
benchmarks.

## The one thing that could decide it: Vercel's Hobby terms

Vercel's Hobby tier is restricted to non-commercial use. Birdables sells cards.

**This has not been checked.** Their terms page was not read, and how they would
treat a site that links out to Etsy and OpenSea rather than taking payment
directly is genuinely unclear. Read it before assuming either way — do not
repeat the xeno-canto mistake of calling terms settled without reading them.

- If Hobby covers it → stay on Vercel, the work is already done.
- If it does not → Vercel Pro is $20/mo, or Cloudflare's free tier has no
  equivalent commercial restriction. That is when porting is worth half a day.

## Current state (verified 2026-09-17)

- `@astrojs/vercel` ^11.0.10, `astro` ^7.3.2, `sharp` ^0.35.4.
- `.vercel/project.json` already links this repo to a Vercel project named
  **birdables**. Gitignored, so it is local to Ken's machine.
- Sanity CORS already allows `https://*.vercel.app`, `https://www.birdables.com`,
  `localhost:3333` and `localhost:4321`.
- `vercel.json` at the repo root proxies `/ingest/*` to PostHog so analytics are
  a first-party request. **Vercel-specific.**

## What a move to Cloudflare would actually cost

Three items. None is large; the third is the one that bites silently.

### 1. `Buffer` — one line

`src/pages/api/fetch-media.ts:20` is the only Node global in the entire app
(grepped; nothing else). Workers needs either the `nodejs_compat` flag in
`wrangler.jsonc` plus an explicit `import { Buffer } from 'node:buffer'`, or a
swap to `Uint8Array`.

```jsonc
{ "compatibility_flags": ["nodejs_compat"] }
```

### 2. The PostHog proxy — no direct equivalent

`vercel.json`'s rewrites have no `_redirects` equivalent. Cloudflare's docs are
explicit: *"Proxying will only support relative URLs on your site. You cannot
proxy external domains."* So `/ingest/*` becomes hand-written Worker code
(a `fetch()` passthrough) that then has to be maintained.

This is the genuinely annoying one, and it is easy to forget until analytics
quietly stop arriving.

### 3. The image service — the silent trap

`@astrojs/cloudflare` takes an `imageService` option. It defaults to
`cloudflare-binding`, **not** to what this site currently does. Since every
image here is on a prerendered page, the equivalent is:

```js
adapter: cloudflare({ imageService: 'compile' })
```

`'compile'` keeps sharp optimizing at build time for prerendered routes, which
is what the current setup does.

Get this wrong and the homepage silently ships unoptimized images again —
exactly the bug already fixed once (965kB → 124kB, LCP 7.4s → 2.9s, see
CLAUDE.md "Verified 2026-09-17"). Re-run Lighthouse after any adapter change;
do not assume the build passing means the images are right.

Also available if prerendering ever needs Node APIs workerd lacks:
`prerenderEnvironment: 'node'`.

## The forward-looking argument for Cloudflare

Two things this project already wants, which Cloudflare gives free in-runtime
and Vercel makes you bolt on:

- **The rate limiter is an in-memory `Map`** (`src/lib/server/sanityWrite.ts`).
  Its own comment admits it only throttles a burst hitting one warm instance.
  KV or Durable Objects would make it real.
- **Bingo / life list** (deferred) needs persistent per-visitor state. D1 or KV
  is the obvious home. On Vercel that means a third-party KV and another
  account to manage.

Neither is urgent. Both are real.

## Either way

- Vercel needs `SANITY_WRITE_TOKEN`, `MEDIA_FETCH_SECRET` and the Resend keys
  set in the dashboard; a deployed Studio needs its own two. See `.env.example`
  and `studio/.env.example`.
- `useCdn: false` means published content only appears after a rebuild. Wire a
  Sanity webhook to a deploy hook on whichever platform. Both support this.
- Re-run Lighthouse against the real deployment. All current numbers are from a
  local build served without compression or cache headers.

## Sources

- Astro Cloudflare adapter options (`imageService`, `prerenderEnvironment`,
  `nodejs_compat`) — official Astro docs, retrieved 2026-09-17 via Context7.
- `_redirects` external-proxy limitation — Cloudflare Workers static-assets
  docs, retrieved 2026-09-17 via Context7.
- Vercel Hobby commercial-use terms — **not retrieved. Unverified.**
