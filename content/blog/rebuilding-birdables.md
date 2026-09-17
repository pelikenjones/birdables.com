---
title: "Rebuilding Birdables"
slug: "rebuilding-birdables"
excerpt: "A new site, a redesign, and the thing I got wrong about my own QR codes."
publishedAt: "2026-09-16"
category: "Behind the scenes"
tags: rebuild, design, sanity
status: published
---

The site you're looking at is new. The one before it had been running since the first
cards were printed in 2021, which in personal-project terms is a long and fairly
honourable innings.

I didn't rebuild it because it was broken. It worked. I rebuilt it because every time
I wanted to change something — a FAQ answer, a card's details, the wording on the
about page — I had to open an editor, find the right component, and redeploy. The
content lived inside the code. That's fine for a weekend. It gets tiring.

## What actually changed

The card data used to live in a JSON file I hand-edited. Now it's in a CMS, which
means the rarity, the scan count and the conservation status for every card are
things I can fix from my phone.

Underneath, the site went from SvelteKit to Astro and it now builds to plain static
HTML. No server, nothing to keep running. Every page is a file. That sounds like a
downgrade and it isn't — the whole site ships with almost no JavaScript, and the
bits that do need it (the theme toggle, the mobile menu) are small enough to sit
inline in the page.

It's also, finally, light by default. The old design leaned dark. I went back and
forth on this for longer than I'd like to admit and eventually landed on the
unglamorous truth that bird cards look better on white.

## The design

I spent most of the effort on the homepage. The thing I kept coming back to in other
people's sites was small floating panels over a product photo — little labels
pointing at details. For cards, that's an obvious fit: a card already *is* a panel of
facts about a bird, so floating the rarity and the conservation status next to it
just makes the card's own logic visible before you've picked one up.

That turned into the tilted deck at the top of this page. Three cards in space, the
front one facing you, the others falling away behind it.

The hardest part wasn't the layout. It was orange. Birdables has one accent colour, a
beak amber, and I spent a whole round of revisions asking for more of it and then
immediately deciding it was too much. The version that survived uses it for section
numbers, a few hairline rules, the rarity bars, and nothing else. There isn't a single
orange button on this site. It turns out an accent stops reading as an accent the
moment you put it on something you're meant to click.

## The thing I had wrong

Here's the part worth writing down.

Every card has a QR code on the back. I'd always half-thought of it as belonging to
*that card* — the specific piece of paper in your hand. I'd idly wondered about things
like showing where a card had travelled, or who'd given it to you.

None of that is possible, and it never was. The code identifies a card **design and
edition**, not a copy. Every Brown Pelican from the first edition carries the same
code, and the code cannot tell one from another.

I found this slightly deflating for about a day, and then realised it's better. What
the code actually does is count. Scan a Brown Pelican and you're the hundred-and-
somethingth person to have done it — not with your card, but with that card, across
everyone who has ever held one. That's not a fact about the piece of paper in your
hand, it's a fact about the bird, accumulated by strangers. Which is more interesting
than a shipping history.

It also means a second edition is a feature rather than a problem. A Pelican 02 gets
its own code and starts its own count, and the first edition's number stays frozen
where it is — a record of that run, closed.

The printed card doesn't change. The page it points at can keep growing.

## What's still missing

Plenty. The bird pages need better writing. I want to do something with a life list —
a way to mark which ones you've actually seen, which is the whole point of the hobby.
And I'd like to let people vote on which bird gets drawn next, rather than picking
them all on instinct.

Those need more than a static site can do on its own, so they'll come after.

Twenty-one birds so far.
