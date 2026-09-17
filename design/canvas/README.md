# Design spec — homepage redesign

These files generated the approved homepage design. **Treat them as the
specification**, not as build tooling: they hold the exact values the redesign
was signed off on — hex codes, the type scale, spacing, section order, and copy.

Live canvas: https://claude.ai/artifact/32KRfPifDdZdjd1Vuv4A5w
(page 1 = the homepage in light and dark; page 2 = bolder explorations, parked)

Implementation plan: `~/.claude/plans/warm-crafting-starlight.md`

## Files

| File | What it is |
|---|---|
| `build.mjs` | The homepage. Generates the full page in both themes from one function — every section, token and string. |
| `build-wild.mjs` | Three bolder directions (Plate, Drop, Vitrine) that were explored and parked. Not the approved design; kept because the engraved index, the gapless contact sheet and the graded slabs are worth raiding. |
| `canvas.json` | Artboard layout for the canvas — positions, page assignment, sticky notes. |

## These scripts will not run as-is

`build.mjs` reads two kinds of input from a session-scoped scratchpad that no
longer exists:

- base64-encoded Greycliff CF faces (`*.b64`)
- downsized card art, bird cutouts and lifestyle photos

Everything it reads is derived from this repo — `static/fonts/` and
`static/images/` — so the inputs are reproducible, but there is no reason to
reproduce them. Read the file for values; don't try to execute it.

## What to pull out of `build.mjs`

- **`C`** — the brand token object, lifted from `src/app.css`: the gray ramp,
  the beak amber ramp, `--color-gray-blue`, and `CARD_SHADOW` (the four-stack
  `drop-shadow-card` filter).
- **`T(dark)`** — the light/dark theme resolver. Dark page is `#0C1217`, section
  bands `#131B21`. **Light is the default theme**; dark is the toggle.
- **`RAMP_LIGHT` / `RAMP_DARK`** — the ordinal orange ramps used by the rarity
  ladder. Both were validated for lightness monotonicity, step separation and
  contrast against their surface; don't substitute them casually.
- **Section functions**, in page order: `hero`, `whatAre`, `anatomy`,
  `rarityLadder`, `flock`, `scanSection`, `bingo`, `dropBand`, `nominate`,
  `madeRight`, `inTheWild`, `fieldNotes`, `faq`, `closing`, `footer`.

## Known corrections to apply while building

The design contains three things that are now known to be wrong or unwanted:

1. ~~**Print runs.** The rarity popover says 2,000 printed. The real card data says
   `totalPrinted: 50` for every card. Use 50.~~ **Resolved 2026-09-16 — this was
   wrong.** The two numbers are not in conflict and both are real:
   `2,000 / 1,500 / 800 / 200 / 50` is the cap for one rarity in **one edition** —
   a 1-star *first edition* will only ever have 2,000 physical copies. A card's
   `totalPrinted` (50) is internal inventory, a batch run to have stock to sell,
   and is **not surfaced anywhere**. The site shows the cap only. Caps live in
   `rarityTier` documents.

   > The design canvas still shows the older framing. Left as-is on purpose —
   > correct it when those layouts get coded, not on the canvas.
2. **Bird sounds.** The "hear its call" bar in the phone mock and the song badge
   in the hero must go — there are no bird sounds.
3. **The scan section** needs rewriting. A QR identifies a card *design and
   edition*, not a physical copy, so anything per-copy is impossible. See the plan.

Also note: orange is a restrained accent — no orange buttons anywhere — and there
is no marquee band. Both were explicit corrections during the design pass.
