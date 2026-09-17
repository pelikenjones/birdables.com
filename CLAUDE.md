# Birdables — working notes

Collectable bird cards. Static Astro frontend, Sanity content, Vercel.
Branch: `feat/astro-sanity-rebuild`. Rebuild of a v1 SvelteKit site.

```
.                 Astro app — src/, public/
studio/           Sanity Studio (own pnpm workspace package)
design/canvas/    The signed-off design spec. Read it; don't run it.
_legacy/          v1 SvelteKit source. Porting reference only — delete before merge.
scripts/          One-off migration and media scripts
content/blog/     Markdown posts, imported into Sanity by scripts/import-posts.mjs
docs/             Open decisions worth not re-researching
```

```sh
pnpm dev            # site on :4321
pnpm build          # static build
pnpm check          # astro check — run before claiming anything works
pnpm typegen        # regenerate src/lib/sanity.types.ts after schema/query changes
pnpm studio         # Studio on :3333
```

---

## Things that will be re-derived wrong

### Rarity: caps are per EDITION, and print counts are private

`2,000 / 1,500 / 800 / 200 / 50` physical and `50 / 25 / 10 / 5 / 1` digital are the
cap for one rarity **in one edition**. A 1-star *first edition* will only ever have
2,000 copies; a 1-star second edition gets its own 2,000. Not a lifetime total.

`card.totalPrinted` (50 on every card) is **internal inventory and must not be
surfaced**. Ken printed 50 personally to have stock to sell; it says nothing about
scarcity, and showing it makes a 2,000-copy edition read like a 50-copy one. It is
deliberately **not projected** by `CARD_FIELDS` in `src/lib/queries.ts` so it cannot
leak onto a page by someone reaching for a convenient field.

Caps live in five `rarityTier` documents. The plan file and older comments contain
two earlier, wrong readings of this — trust this section.

### Borrowed media — licence rules are load-bearing

Photos come from Wikimedia Commons, audio from Commons' mirror of xeno-canto.
**Both licence per item, not per collection.** Birdables sells cards, so anything
carrying NonCommercial or NoDerivatives is unusable. GFDL is excluded too.
`licenseAllowsCommercial()` in `src/lib/server/media.ts` enforces this and has the
trap cases covered (`CC BY-NC` must never match a `CC BY` rule).

- **Attribution is a condition of use**, not styling. `PhotoStrip` and `AudioPlayer`
  will not render media without a credit. Do not tidy those caption lines away.
- Audio is capped at 60s. Commons hosts hour-long soundscapes and narrated field
  notes that a species search happily returns — one was 29 minutes.
- A **self-recorded** file uploaded in the Studio with the `credit` block deleted
  shows no attribution, because none is owed.
- Media is fetched **once** per bird via the Studio's "Fetch media" button →
  `/api/fetch-media` (server-side: keeps keys off the browser, sets the descriptive
  User-Agent Wikimedia requires). The site never calls an external API at runtime.

**Unresolved:** xeno-canto's *own API* may be non-commercial-only — their terms page
is behind bot protection and has never been read. Leave `XENO_CANTO_API_KEY` unset;
with no key the direct path never runs. Commons is unaffected and is where audio
currently comes from.

### Sanity

- Project **`ubrw2onn`**. `onAnzpJce` is the *organisation* id and 404s — v1's
  `.env.local` had it as the project id.
- v1 source for migration was **`g5k47w6o`**, not the `pdzqg4pl` hardcoded in
  `_legacy/lib/sanityClient.js` (which matches no project on the account).
- **A dot in an `_id` is reserved** for drafts/versions (`drafts.x`,
  `versions.<release>.x`). Seeding `rarityTier.1` created documents the published
  perspective could not see at all. Use hyphens: `rarityTier-1`, `homePage-en`.
- **`useCdn: false`** deliberately. A static build fetches once, so there's no
  per-request cost to save — but there IS a race where a build triggered right after
  a publish serves the previous version. Caught live.
- `card.specialty` is unexplained v1 legacy (a bare boolean, 7 of 21 cards, spread
  across every rarity). Not surfaced anywhere. Don't invent a meaning for it.

### Env: one file, one prefix

Root `.env`. `PUBLIC_*` reaches the browser; unprefixed is server-only.
`astro.config.mjs` runs before Astro loads `.env`, so it reads vars with Vite's
`loadEnv`; everywhere else uses `import.meta.env.PUBLIC_*`.

The **Studio does not read the root `.env`** — Sanity's bundler only reads `.env`
from the Studio's own directory and only exposes the `SANITY_STUDIO_*` prefix. So
there are two env files, not one:

- **Root `.env`** — nine vars, all listed in `.env.example`. `SANITY_WRITE_TOKEN`
  is not a build input (the static build reads the CDN unauthenticated) but it IS
  a runtime dependency of all three `/api` routes via `sanityWrite.ts`; unset, they
  answer 503. It must be set on Vercel.
- **`studio/.env`** — two vars, `SANITY_STUDIO_MEDIA_ENDPOINT` and
  `SANITY_STUDIO_MEDIA_SECRET`, both only for the "Fetch media" button. The secret
  must equal the root's `MEDIA_FETCH_SECRET`; set one and not the other and the
  button answers 401. The endpoint defaults to `localhost:4321`, so a deployed
  Studio with it unset posts at whoever clicked the button. See
  `studio/.env.example`.

The Studio's project id and dataset are not env vars at all — they are public and
live in `studio/sanity.project.ts`. See that file for why.

`XENO_CANTO_API_KEY` stays empty on purpose; see the media section above.

---

## Architecture decisions worth keeping

- **Static, with three exceptions.** Visual Editing was dropped, which is what lets
  `output: 'static'` work. The only serverless routes are `/api/notify`,
  `/api/vote`, `/api/fetch-media`. Everything else is a file.
- **`getStaticPaths()` is hoisted into its own module context.** Frontmatter consts
  are invisible inside it — import queries there, or get a silent `ReferenceError`.
- **No animation library.** motion.dev's `inView` pulls its whole bundle (43kB gz),
  not the advertised 0.5kB. Reveals are an IntersectionObserver plus a CSS
  transition. `motion` is uninstalled; don't re-add it without measuring.
- **The 3D card is three.js, with the printed faces UNLIT** (`MeshBasicMaterial`).
  The artwork is already correctly exposed; any lit material multiplies it by an
  incident-light term and can only come out muddy or chalky. Lighting touches only
  the extruded body, which is how you read the card's thickness.
- `--card-fill` is the single source of truth for how much of the panel the card
  occupies; the 3D camera reads it so 2D and 3D never desync in scale.
- `three` is in `vite.optimizeDeps.include`. Without it Vite discovers the dep on
  the first dynamic import, re-optimises, and the new `?v=` hash 404s the URL the
  open page is holding — "Failed to fetch dynamically imported module", dev only.
- **Bird page lands in 3D**, deferred until after `window.load` + idle so it doesn't
  race page resources. Card page stays 2D and opt-in.
- Theme is **light by default**; `prefers-color-scheme` is deliberately not
  consulted. See `src/lib/theme.ts`.
- **`vercel.json` must stay at the repo root.** In v1 it sat in `src/`, so the
  PostHog proxy rewrites never applied.

---

## Design

`design/canvas/README.md` explains the spec files. Live canvas:
<https://claude.ai/artifact/32KRfPifDdZdjd1Vuv4A5w>
Bird-page layouts: <https://claude.ai/artifact/5LJEMby2eikpno64vurxED>

House rules from the design pass: **light default**, **no orange buttons anywhere**
(ink on light, white on dark — orange is section numbers, 2px rules, dots and the
rarity bars), no marquee, and a handful of orange marks per page as the ceiling.

Deliberate departures from the canvas, all agreed: the flock section shows three
featured cards rather than all 21; "in the wild" is an editorial 7/5 split rather
than five rotated polaroids; the scan section is a placeholder pending a rewrite;
the rarity "secret blend" chips are plain text because pills read as buttons.

**The design canvas still shows the old print-run framing.** Correct it when those
layouts get coded, not on the canvas.

---

## Verifying

Four bugs this build were **silent no-ops** — code that was never wrong, just acting
on nothing:

- a string replace that matched nothing (the CTA padding, and a missing `setMode`)
- a selector that matched nothing (`[data-card-viewer]` vs `data-card-viewer-three`)
- a sticky element whose parent was exactly its own height

None errored; surrounding checks all came back green. Worth **asserting an anchor
exists before replacing it**, and confirming a selector resolves rather than
trusting the name. Also: grep the *element*, not the file — a scoped `<style>` block
mentions class names on pages that never apply them, which produced three false
readings in a row.

---

## Verified 2026-09-17

Lighthouse on the production build, served locally without compression or cache
headers — Vercel adds both, so real-world numbers are better than these.

| | |
|---|---|
| Accessibility | **100** on `/`, `/cards`, `/bird/*`, `/card/*`, `/about`, `/blog` |
| Performance | **91** (was 72) |
| Best practices / SEO | 100 / 100 |
| LCP | 2.9s · CLS 0 · TBT 0ms |

Three things that fix found:

- **`--ink-faint` failed WCAG AA** at 3.47:1 on the alt band. It is now `#68737b`
  in light mode (4.85 / 4.63) and keeps the ramp value in dark, which already
  passed. The brand ramp is unchanged; only the semantic token moved.
- **Orange text failed badly** — beak-600 is 2.30:1 on white, and section numbers
  are 13px text. `--accent-ink` now flips with the theme (beak-900 light, beak-600
  dark). Rules, dots and rarity bars keep beak-600: decorative marks, no ratio
  requirement.
- **Lifestyle photos bypassed the image pipeline** by living in `public/`, so they
  shipped at source weight — 965kB of images on the homepage. Moved to
  `src/assets/wild/` and rendered with `astro:assets` `<Image>`: **124kB**, LCP
  7.4s → 2.9s. `sharp` is a direct dependency now; without it the build fails at
  the image step.

Keyboard audit is clean: no positive `tabindex`, every modal is a real `<dialog>`
(focus trap and Escape come from the platform), no div-based triggers, skip link
and `:focus-visible` present. Not yet driven by hand in a browser.

## Not done

- **Keyboard pass by hand** — the static audit is clean (see above) but nobody has
  actually tabbed through the drawer, accordion, modals and card viewer.
- **Never deployed, and the platform is undecided.** Vercel is wired and ready
  (`@astrojs/vercel`, `.vercel/project.json` links a project named `birdables`);
  Cloudflare is under consideration. **`docs/hosting.md` has the whole analysis** —
  read it before touching the adapter, because the Cloudflare image service
  defaults to something this site does not want and would silently re-ship
  unoptimized images.
  Vercel needs `SANITY_WRITE_TOKEN`, `MEDIA_FETCH_SECRET` and Resend's keys set;
  a deployed Studio additionally needs its own two (above). Sanity CORS is done —
  `https://*.vercel.app` was added 2026-09-17, alongside `localhost:3333`,
  `localhost:4321` and `https://www.birdables.com`.
- **`_legacy/` still present** — delete once nothing else needs porting.
- **Bingo / life list** deferred by Ken. eBird has no OAuth and no third-party access
  to a user's life list; the buildable shapes are manual ticking and a CSV import,
  both entirely client-side.
- 14 of 21 birds have audio; 21 of 21 have photos. The gaps are content, not bugs.
- Homepage never diffed visually against the canvas, and dark mode never checked.
