// Builds the Birdables homepage artboards (.dc.html) with the real brand assets inlined.
// Run: node build.mjs
// Page 1 — the full homepage, dark (Main) and light (Light), same generator.
// Page 2 — earlier hero explorations, kept for reference.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REPO = '/Users/kennehy/birdables.com';
const WORK = '/private/tmp/claude-501/-Users-kennehy-birdables-com/85879f20-686c-4185-a62d-6807a335824c/scratchpad/work';
const OUT = '/private/tmp/claude-501/-Users-kennehy-birdables-com/85879f20-686c-4185-a62d-6807a335824c/scratchpad/canvas';

const birds = JSON.parse(readFileSync(join(REPO, 'src/lib/data/birds.json'), 'utf8')).filter(
	(b) => b.liveOnSite
);
const thumbs = readdirSync(WORK)
	.filter((f) => f.endsWith('_thumb.jpg'))
	.sort();
const bySlug = Object.fromEntries(birds.map((b) => [b.slug, b]));

/* ---------- brand tokens, lifted from src/app.css ---------- */
const C = {
	g900: '#11191E', g800: '#1B242B', g700: '#2B343A', g600: '#3D454A', g500: '#505A60',
	g400: '#7B8890', g300: '#ACB9C1', g200: '#DBE1E5', g100: '#EFF4F6', g50: '#F7FAFC',
	blue: '#D3E1E4', beak600: '#F29600', beak500: '#FBAB2A', beak300: '#FFD186',
	good: '#2E9E5B'
};
const ACCENT = C.beak600;
// ordinal ramps, both validated with dataviz/scripts/validate_palette.js --ordinal
const RAMP_DARK = ['#8A5A00', '#B16E00', '#D78500', '#F29600', '#FFC25E'];
const RAMP_LIGHT = ['#F29600', '#D07C00', '#A96200', '#7E4900', '#523000'];

const CARD_SHADOW =
	'drop-shadow(0 0 1px rgba(17,25,30,0.1)) drop-shadow(0 1px 1px rgba(17,25,30,0.06)) drop-shadow(0 8px 5px rgba(17,25,30,0.05)) drop-shadow(0 5px 25px rgba(17,25,30,0.1))';
const POP_SHADOW = '0 1px 2px rgba(17,25,30,0.06), 0 14px 34px rgba(17,25,30,0.14)';

const T = (dark) =>
	dark
		? { bg: '#0C1217', alt: '#131B21', text: '#FFFFFF', dim: C.g300, faint: C.g400, rule: 'rgba(255,255,255,0.11)', ramp: RAMP_DARK, softPanel: 'rgba(255,255,255,0.045)' }
		: { bg: '#FFFFFF', alt: C.g50, text: C.g900, dim: C.g500, faint: C.g400, rule: C.g100, ramp: RAMP_LIGHT, softPanel: C.g50 };

/* ---------- fonts ---------- */
const face = (file, weight, style = 'normal') =>
	`@font-face{font-family:'GreycliffCF';font-weight:${weight};font-style:${style};font-display:swap;src:url(data:font/woff2;base64,${readFileSync(join(WORK, file + '.b64'), 'utf8').trim()}) format('woff2');}`;
const FONTS = [
	face('GreycliffCFMedium', 500), face('GreycliffCFDemiBold', 600),
	face('GreycliffCFDemiBoldOblique', 600, 'italic'), face('GreycliffCFHeavy', 900)
].join('\n');

/* ---------- svg assets from the repo ---------- */
const svgFrom = (path) => {
	const raw = readFileSync(path, 'utf8');
	return raw.slice(raw.indexOf('<svg'), raw.lastIndexOf('</svg>') + 6)
		.replace(/\sclass=\{className\}/g, '').replace(/\s*\n\s*/g, ' ');
};
const fitLogo = (svg, w = 203, h = 32) =>
	svg.replace('<svg width="672" height="106"', `<svg viewBox="0 0 672 106" width="${w}" height="${h}"`);
const logoLight = svgFrom(join(REPO, 'static/images/logo.svg'));
const logoDark = svgFrom(join(REPO, 'static/images/logo-on-dark.svg'));
const logo = (dark, w, h) => fitLogo(dark ? logoDark : logoLight, w, h);
const igIcon = svgFrom(join(REPO, 'src/lib/svgs/Instagram.svelte')).replace('<svg', '<svg width="20" height="20"');
const twIcon = svgFrom(join(REPO, 'src/lib/svgs/Twtter.svelte')).replace('<svg', '<svg width="24" height="19"');
const osIcon = svgFrom(join(REPO, 'src/lib/svgs/OpenSeaIcon.svelte')).replace('<svg', '<svg width="21" height="19"');
const ebird = svgFrom(join(REPO, 'src/lib/svgs/EBird.svelte')).replace('<svg', '<svg width="61" height="22"');
const audubon = svgFrom(join(REPO, 'src/lib/svgs/Audubon.svelte')).replace('<svg', '<svg width="73" height="22"');
const bow = svgFrom(join(REPO, 'src/lib/svgs/BOW.svelte')).replace('<svg', '<svg width="86" height="20"');

/* ---------- glyphs ---------- */
const star = (filled, color, empty) =>
	`<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="${filled ? color : empty}" d="${
		filled
			? 'M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z'
			: 'M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928L12 18.26zm0-2.292l4.247 2.377-.949-4.773 3.573-3.305-4.833-.573L12 5.275l-2.038 4.42-4.833.572 3.573 3.305-.949 4.773L12 15.968z'
	}"/></svg>`;
const stars = (n, color = C.g900, empty = C.g300, gap = 3) =>
	`<div style="display: flex; align-items: center; gap: ${gap}px">${[1, 2, 3, 4, 5].map((i) => star(i <= n, color, empty)).join('')}</div>`;
const waveform = (color, h = 22, bars = 13, w = 3, gapPx = 5) => {
	const heights = [6, 11, 18, 9, 22, 14, 7, 19, 12, 22, 8, 15, 6, 20, 10, 17, 7, 21, 13, 9, 18, 11, 22, 8];
	const list = Array.from({ length: bars }, (_, i) => heights[i % heights.length]);
	return `<svg width="${bars * gapPx - (gapPx - w)}" height="${h}" viewBox="0 0 ${bars * gapPx - (gapPx - w)} ${h}" aria-hidden="true">${list
		.map((v, i) => `<rect x="${i * gapPx}" y="${(h - (v / 22) * h) / 2}" width="${w}" height="${(v / 22) * h}" rx="${w / 2}" fill="${color}"/>`)
		.join('')}</svg>`;
};
const dot = (color, size = 8) =>
	`<span style="width: ${size}px; height: ${size}px; border-radius: 999px; background: ${color}; flex-shrink: 0"></span>`;
const mapGlyph = (accentHole, w = 46) =>
	`<div style="width: ${w}px; height: ${w}px; border-radius: 10px; background: ${C.blue}; position: relative; overflow: hidden; flex-shrink: 0">
			<svg width="${w}" height="${w}" viewBox="0 0 46 46" aria-hidden="true" style="display: block"><path fill="#FFFFFF" d="M6 9c4-2 9-1 13 0 3 1 6 0 9-1 4-1 8 0 11 2 1 3-1 6-3 8-2 2-3 5-3 8 0 4-2 7-5 9-2 1-5 1-7-1-2-2-2-5-4-7-2-2-5-2-7-4-2-2-3-5-4-8-1-2-1-5 0-6z"/></svg>
			<span style="position: absolute; left: 20px; top: 22px; width: 9px; height: 9px; border-radius: 999px; background: ${accentHole}; border: 2px solid #FFFFFF"></span>
		</div>`;
const qrGlyph = (color, size = 26) => {
	const cells = [[0,0,3,3],[4,0,1,1],[6,0,3,3],[5,1,1,2],[0,4,1,1],[2,4,2,1],[5,4,1,2],[7,4,2,1],[4,5,1,1],[0,6,3,3],[4,7,2,2],[7,6,1,1],[8,7,1,2],[6,8,1,1]];
	return `<svg width="${size}" height="${size}" viewBox="0 0 9 9" aria-hidden="true">${cells
		.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`).join('')}</svg>`;
};
const checkGlyph = (color, size = 18) =>
	`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const sunGlyph = (color) =>
	`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.4" stroke="${color}" stroke-width="2"/><path d="M12 1.6v2.6M12 19.8v2.6M22.4 12h-2.6M4.2 12H1.6M19.35 4.65l-1.84 1.84M6.49 17.51l-1.84 1.84M19.35 19.35l-1.84-1.84M6.49 6.49L4.65 4.65" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
const moonGlyph = (color) =>
	`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 14.2A8.6 8.6 0 019.8 3.5a8.6 8.6 0 1010.7 10.7z" stroke="${color}" stroke-width="2" stroke-linejoin="round"/></svg>`;
const arrowGlyph = (color, size = 16) =>
	`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M12.5 5.5L19 12l-6.5 6.5" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const plusGlyph = (color, size = 18) =>
	`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/></svg>`;

/* ---------- popovers ---------- */
const popShell = (inner, extra = '') =>
	`<div style="background: #FFFFFF; border-radius: 18px; box-shadow: ${POP_SHADOW}; padding: 16px 18px; ${extra}">${inner}</div>`;
const popLabel = (text) =>
	`<span style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.g400}">${text}</span>`;
// rarity 1 = 2,000 physical / 50 digital (About page table)
const rarityPop = () =>
	popShell(`<div style="display: flex; flex-direction: column; gap: 9px; width: 190px">
					${popLabel('Rarity')}
					<div style="display: flex; align-items: center; gap: 10px">${stars(1)}
						<span style="font-size: 14px; font-weight: 600; color: ${C.g900}">1 of 5</span></div>
					<div style="display: flex; align-items: center; gap: 7px; padding-top: 9px; border-top: 1px solid ${C.g100}; font-size: 13px; color: ${C.g500}">
						<span style="font-weight: 900; color: ${C.g900}">2,000</span><span>printed ·</span><span style="font-weight: 900; color: ${C.g900}">50</span><span>digital</span></div>
				</div>`);
const statusPop = () =>
	popShell(`<div style="display: flex; flex-direction: column; gap: 8px">
					${popLabel('Conservation')}
					<div style="display: flex; align-items: center; gap: 8px">${dot(C.good, 9)}
						<span style="font-size: 15px; font-weight: 600; color: ${C.g900}">Least Concern</span></div>
				</div>`);
const scansPop = () =>
	popShell(`<div style="display: flex; flex-direction: column; gap: 9px; width: 170px">
					${popLabel('Card activity')}
					<div style="display: flex; align-items: baseline; gap: 7px">
						<span style="font-size: 26px; font-weight: 900; color: ${C.g900}; letter-spacing: -0.02em">397</span>
						<span style="font-size: 14px; color: ${C.g500}">scans</span></div>
					<div style="display: flex; align-items: center; gap: 7px; padding-top: 9px; border-top: 1px solid ${C.g100}">${dot(C.good, 8)}
						<span style="font-size: 13px; color: ${C.g500}">Live from the QR</span></div>
				</div>`);
const songBadge = (accentHole, size = 74) =>
	`<div style="width: ${size}px; height: ${size}px; border-radius: 999px; background: #FFFFFF; box-shadow: ${POP_SHADOW}; display: flex; align-items: center; justify-content: center">${waveform(accentHole, 26, 9)}</div>`;

/* ---------- the 3D deck ---------- */
const deck = ({ w, h, popovers = '' }) => `
					<div style="position: relative; transform-style: preserve-3d; transform: {{cardTransform}}">
						<img src="roseate-spoonbill_01.jpg" alt="Roseate Spoonbill card" style="position: absolute; left: ${-Math.round(w * 0.124)}px; top: 16px; width: ${w}px; height: ${h}px; object-fit: contain; opacity: 0.55; transform: translateZ(-70px); filter: ${CARD_SHADOW}" />
						<img src="northern-cardinal_01.jpg" alt="Northern Cardinal card" style="position: absolute; left: ${-Math.round(w * 0.065)}px; top: 8px; width: ${w}px; height: ${h}px; object-fit: contain; opacity: 0.8; transform: translateZ(-36px); filter: ${CARD_SHADOW}" />
						<img src="brown-pelican_01.jpg" alt="Brown Pelican card, edition 01" style="position: relative; display: block; width: ${w}px; height: ${h}px; object-fit: contain; filter: ${CARD_SHADOW}" />
						${popovers}
					</div>`;

/* ---------- chrome ---------- */
const navLink = (label, t) =>
	`<a href="#" style="font-size: 18px; font-weight: 500; color: ${t.text}; text-decoration: none; padding-bottom: 5px; border-bottom: 3px solid transparent">${label}</a>`;

const modeToggle = (dark, t) => `
				<div style="display: flex; align-items: center; gap: 4px; padding: 4px; border-radius: 999px; border: 1px solid ${t.rule}">
					<span style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 999px; background: ${dark ? 'transparent' : ACCENT}">${sunGlyph(dark ? t.faint : '#FFFFFF')}</span>
					<span style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 999px; background: ${dark ? ACCENT : 'transparent'}">${moonGlyph(dark ? '#FFFFFF' : t.faint)}</span>
				</div>`;

const nav = (dark, t) => `
		<div style="display: flex; align-items: center; justify-content: space-between; padding: 0 64px; height: 88px; flex-shrink: 0">
			<div style="display: flex; align-items: center; gap: 48px">
				${logo(dark)}
				<span style="width: 1px; height: 48px; background: ${t.rule}"></span>
				<nav style="display: flex; align-items: center; gap: 32px">${navLink('Cards', t)}${navLink('About Birdables', t)}${navLink('Blog', t)}</nav>
			</div>
			<div style="display: flex; align-items: center; gap: 22px">
				<div style="display: flex; align-items: center; gap: 20px; color: ${t.text}">${igIcon}${twIcon}${osIcon}</div>
				${modeToggle(dark, t)}
				<a href="#" style="display: inline-flex; align-items: center; padding: 13px 26px; border-radius: 999px; border: 1px solid ${dark ? 'rgba(255,255,255,0.22)' : C.g200}; background: ${dark ? 'transparent' : '#FFFFFF'}; color: ${t.text}; font-size: 16px; font-weight: 600; text-decoration: none">Browse all cards</a>
			</div>
		</div>`;

const btnPrimary = (label, dark) =>
	`<a href="#" style="display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 18px 34px; border-radius: 999px; background: ${dark ? '#FFFFFF' : C.g900}; color: ${dark ? C.g900 : '#FFFFFF'}; font-size: 17px; font-weight: 600; text-decoration: none; box-shadow: 0 10px 24px rgba(17,25,30,${dark ? '0.4' : '0.18'})">${label}</a>`;
const btnGhost = (label, dark, t) =>
	`<a href="#" style="display: inline-flex; align-items: center; justify-content: center; padding: 18px 32px; border-radius: 999px; background: transparent; border: 1px solid ${dark ? 'rgba(255,255,255,0.28)' : C.g200}; color: ${t.text}; font-size: 17px; font-weight: 600; text-decoration: none">${label}</a>`;
// No orange buttons anywhere — the primary action is ink on light, white on dark.
const btnAccent = (label, onDark) =>
	`<a href="#" style="display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 18px 34px; border-radius: 999px; background: ${onDark ? '#FFFFFF' : C.g900}; color: ${onDark ? C.g900 : '#FFFFFF'}; font-size: 17px; font-weight: 600; text-decoration: none; box-shadow: 0 10px 24px rgba(0,0,0,${onDark ? '0.4' : '0.18'})">${label}${arrowGlyph(onDark ? C.g900 : '#FFFFFF')}</a>`;

const chip = (label, t, active = false) =>
	`<span style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; border: 1px solid ${active ? 'transparent' : t.rule}; background: ${active ? t.text : 'transparent'}; color: ${active ? t.bg : t.dim}; font-size: 14px; font-weight: 600">${label}</span>`;

const sectionHead = (num, kicker, title, sub, t, { align = 'left', width = 720 } = {}) => `
			<div style="display: flex; flex-direction: column; align-items: ${align === 'center' ? 'center' : 'flex-start'}; gap: 18px; ${align === 'center' ? 'text-align: center;' : ''} max-width: ${width}px">
				<div style="display: flex; align-items: center; gap: 12px">
					<span style="font-size: 13px; font-weight: 900; letter-spacing: 0.12em; color: {{accent}}">${num}</span>
					<span style="width: 26px; height: 2px; background: {{accent}}"></span>
					<span style="font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: ${t.faint}">${kicker}</span>
				</div>
				<h2 style="margin: 0; font-size: 52px; line-height: 1.02; letter-spacing: -0.035em; font-weight: 900; color: ${t.text}; text-wrap: balance">${title}</h2>
				${sub ? `<p style="margin: 0; font-size: 18px; line-height: 1.6; color: ${t.dim}; text-wrap: pretty">${sub}</p>` : ''}
			</div>`;

const statTile = (value, label, t, accent = false) => `
				<div style="display: flex; flex-direction: column; gap: 8px; padding: 26px 28px; border-radius: 22px; background: ${t.softPanel}; border: 1px solid ${t.rule}; flex: 1">
					<span style="font-size: 40px; font-weight: 900; letter-spacing: -0.03em; color: ${t.text}">${value}</span>
					<span style="font-size: 14px; line-height: 1.45; color: ${t.dim}">${label}</span>
				</div>`;

const section = (inner, { bg, pad = '110px 64px' } = {}) =>
	`<section style="background: ${bg}; padding: ${pad}">${inner}</section>`;

/* ================= 1. HERO ================= */
const heroPanel = (dark, t) => `
			<div style="position: relative; width: 700px; height: 748px; border-radius: 40px; background: ${
				dark
					? 'radial-gradient(circle at 50% 42%, rgba(211,225,228,0.18), rgba(17,25,30,0) 64%)'
					: C.blue
			}; ${dark ? `border: 1px solid ${t.rule};` : `background-image: radial-gradient(${C.g300} 1.2px, transparent 1.2px); background-size: 22px 22px;`} flex-shrink: 0; perspective: 1700px; display: flex; align-items: center; justify-content: center">
				<span style="position: absolute; left: 50%; top: 600px; width: 400px; height: 56px; transform: translateX(-50%); border-radius: 999px; background: radial-gradient(ellipse at center, rgba(${dark ? '0,0,0,0.55' : '17,25,30,0.26'}), rgba(0,0,0,0) 70%)"></span>
				${deck({ w: 372, h: 521, popovers: `
						<div style="position: absolute; left: -138px; top: 92px; transform: translateZ(96px)">${rarityPop()}</div>
						<div style="position: absolute; right: -128px; bottom: 156px; transform: translateZ(122px)">${statusPop()}</div>` })}
				<div style="position: absolute; right: 42px; top: 92px">${scansPop()}</div>
				<div style="position: absolute; left: 44px; bottom: 96px">${songBadge('{{accent}}')}</div>
			</div>`;

const hero = (dark, t) => `
	<div style="display: flex; align-items: flex-start; gap: 56px; padding: 0 64px 96px">
		<div style="display: flex; flex-direction: column; align-items: flex-start; width: 540px; flex-shrink: 0; padding-top: 34px">
			<div style="display: inline-flex; align-items: center; gap: 9px; padding: 9px 18px; border: 1px solid ${t.rule}; border-radius: 999px">
				${dot('{{accent}}', 7)}
				<span style="font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.dim}">Collectible bird cards</span>
			</div>
			<h1 style="margin: 26px 0 0; font-size: 74px; line-height: 0.94; letter-spacing: -0.035em; font-weight: 900; color: ${t.text}">Collectable<br />Bird Cards.</h1>
			<p style="margin: 18px 0 0; font-size: 34px; line-height: 1.1; font-weight: 600; font-style: italic; color: ${t.faint}">Because birds are fly.</p>
			<p style="margin: 26px 0 0; max-width: 452px; font-size: 18px; line-height: 1.65; color: ${t.dim}; text-wrap: pretty">Artistic, realistic trading cards for the birds you love — printed on 100% recycled paper, with a rarity scale that mirrors how often you would really see one.</p>
			<div style="display: flex; align-items: center; gap: 14px; margin-top: 34px">${btnPrimary('Browse all cards', dark)}${btnGhost('About Birdables', dark, t)}</div>
			<div style="display: flex; align-items: center; gap: 18px; margin-top: 42px; font-size: 15px; color: ${t.dim}">
				<span><span style="font-weight: 900; color: ${t.text}">21</span> cards in the flock</span>${dot(t.faint, 4)}
				<span><span style="font-weight: 900; color: ${t.text}">5</span> rarity tiers</span>${dot(t.faint, 4)}
				<span><span style="font-weight: 900; color: ${t.text}">100%</span> recycled paper</span>
			</div>
			<div style="display: flex; flex-direction: column; gap: 16px; margin-top: 52px; padding-top: 30px; border-top: 1px solid ${t.rule}; width: 452px">
				<span style="font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.faint}">Every card links out to</span>
				<div style="display: flex; align-items: center; gap: 30px; filter: ${dark ? 'grayscale(1) invert(1) brightness(1.7)' : 'grayscale(1)'}; opacity: ${dark ? '0.6' : '0.5'}">${ebird}${audubon}${bow}</div>
			</div>
		</div>
		${heroPanel(dark, t)}
	</div>`;

/* ================= 2. MARQUEE ================= */
const marquee = () => {
	const names = birds.map((b) => b.birdName);
	const run = names
		.map((n) => `<span style="font-size: 30px; font-weight: 900; letter-spacing: -0.01em; text-transform: uppercase; color: ${C.g900}; white-space: nowrap">${n}</span>${star(true, C.g900, C.g900).replace('width="15" height="15"', 'width="16" height="16"')}`)
		.join('');
	return `
	<div style="height: 108px; overflow: hidden; display: flex; align-items: center">
		<div style="width: 1560px; margin-left: -60px; transform: rotate(-1.4deg); background: {{accent}}; padding: 20px 0; display: flex; align-items: center; gap: 26px; overflow: hidden; white-space: nowrap">${run}</div>
	</div>`;
};

/* ================= 3. WHAT ARE BIRDABLES ================= */
const fannedCards = () => {
	const picks = ['california-condor', 'snowy-owl', 'osprey'];
	return `<div style="position: relative; width: 520px; height: 420px; flex-shrink: 0">
					${picks
						.map((slug, i) => {
							const rot = [-11, -1, 9][i];
							const left = [10, 160, 310][i];
							const top = [42, 8, 48][i];
							return `<img src="${slug}_thumb.jpg" alt="${bySlug[slug].birdName} card" style="position: absolute; left: ${left}px; top: ${top}px; width: 196px; height: 274px; object-fit: contain; transform: rotate(${rot}deg); filter: ${CARD_SHADOW}" />`;
						})
						.join('')}
				</div>`;
};

const whatAre = (dark, t) => `
		<div style="display: flex; align-items: flex-start; gap: 72px">
			<div style="flex: 1">
				${sectionHead('01', 'What are Birdables', 'Thousands of bird species are at risk. These cards are a small, stubborn act of attention.', 'Artistic yet realistic designs, a sustainable approach to production, and a distribution model that mirrors real bird populations in the wild. Even birds you think of as common sightings may be rarer than you think.', t, { width: 640 })}
				<div style="display: flex; align-items: center; gap: 14px; margin-top: 38px">${btnAccent('See the cards', dark)}${btnGhost('Our mission', dark, t)}</div>
			</div>
			${fannedCards()}
		</div>`;

/* ================= 4. CARD ANATOMY ================= */
const anatomyLabel = (title, sub, t, align = 'left') => `
					<div style="display: flex; flex-direction: column; gap: 5px; ${align === 'right' ? 'text-align: right;' : ''}">
						<span style="font-size: 14px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.text}">${title}</span>
						<span style="font-size: 13px; color: ${t.faint}">${sub}</span>
					</div>`;
const anatomyRow = (title, sub, y, side, t) => {
	const label = anatomyLabel(title, sub, t, side === 'right' ? 'left' : 'right');
	if (side === 'left')
		return `<div style="position: absolute; left: 60px; top: ${y - 20}px; width: 250px">${label}</div>
				<span style="position: absolute; left: 326px; top: ${y}px; width: 176px; height: 1px; background: {{accent}}"></span>
				<span style="position: absolute; left: 496px; top: ${y - 4}px; width: 9px; height: 9px; border-radius: 999px; border: 2px solid {{accent}}; background: ${t.bg}"></span>`;
	return `<div style="position: absolute; right: 60px; top: ${y - 20}px; width: 250px">${label}</div>
				<span style="position: absolute; right: 326px; top: ${y}px; width: 176px; height: 1px; background: {{accent}}"></span>
				<span style="position: absolute; right: 496px; top: ${y - 4}px; width: 9px; height: 9px; border-radius: 999px; border: 2px solid {{accent}}; background: ${t.bg}"></span>`;
};

const anatomy = (dark, t) => `
		<div style="display: flex; flex-direction: column; align-items: center; gap: 44px">
			${sectionHead('02', 'Card anatomy', 'Seven things every card tells you.', 'Each Birdables card carries elements that reveal information about the bird — or about the card itself.', t, { align: 'center', width: 660 })}
			<div style="position: relative; width: 1312px; height: 600px">
				<img src="brown-pelican_01.jpg" alt="Brown Pelican card, edition 01" style="position: absolute; left: 50%; top: 20px; transform: translateX(-50%); width: 400px; height: 560px; object-fit: contain; filter: ${CARD_SHADOW}" />
				${anatomyRow('Bird name', 'Name for common folk', 86, 'left', t)}
				${anatomyRow('Scientific name', 'Name for smarty-pants', 168, 'left', t)}
				${anatomyRow('Rarity scale', '1–5 stars of rareness', 250, 'left', t)}
				${anatomyRow('Call &amp; song', 'How the bird sounds, drawn', 366, 'left', t)}
				${anatomyRow('Habitat map', 'Where the bird turns up', 452, 'right', t)}
				${anatomyRow('QR code', 'Scan to meet the bird', 524, 'right', t)}
				${anatomyRow('Card information', 'Edition · continent · status', 210, 'right', t)}
			</div>
		</div>`;

/* ================= 5. RARITY LADDER ================= */
// About page table: digital / physical copies per tier
const TIERS = [
	{ n: 1, digital: 50, physical: 2000, label: 'Common as a backyard feeder' },
	{ n: 2, digital: 25, physical: 1500, label: 'Worth stopping the car for' },
	{ n: 3, digital: 10, physical: 800, label: 'A good day with binoculars' },
	{ n: 4, digital: 5, physical: 200, label: 'A trip planned around it' },
	{ n: 5, digital: 1, physical: 50, label: 'A bird of a lifetime' }
];
const rarityLadder = (dark, t) => {
	const max = 2000;
	const rows = TIERS.map((tier, i) => {
		const w = Math.max(14, Math.round((tier.physical / max) * 560));
		return `
				<div style="display: flex; align-items: center; gap: 24px; padding: 18px 0; border-top: 1px solid ${t.rule}">
					<div style="width: 108px; flex-shrink: 0">${stars(tier.n, t.text, dark ? 'rgba(255,255,255,0.22)' : C.g200, 2)}</div>
					<span style="width: 246px; flex-shrink: 0; font-size: 15px; color: ${t.dim}">${tier.label}</span>
					<div style="width: 560px; flex-shrink: 0; display: flex; align-items: center; gap: 12px">
						<span style="height: 14px; width: ${w}px; border-radius: 4px; background: ${t.ramp[i]}"></span>
						<span style="font-size: 14px; font-weight: 600; color: ${t.text}; font-variant-numeric: tabular-nums">${tier.physical.toLocaleString('en-US')}</span>
					</div>
					<span style="flex: 1; text-align: right; font-size: 14px; color: ${t.dim}; font-variant-numeric: tabular-nums">${tier.digital} digital</span>
				</div>`;
	}).join('');
	return `
		<div style="display: flex; flex-direction: column; gap: 40px">
			${sectionHead('03', 'The rarity scale', 'The rarer the bird, the fewer cards exist.', 'Rarity decides how many cards are ever printed or minted. Bar length is the physical print run.', t, { width: 680 })}
			<div style="display: flex; flex-direction: column">
				<div style="display: flex; align-items: center; gap: 24px; padding-bottom: 12px">
					<span style="width: 108px; flex-shrink: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.faint}">Rarity</span>
					<span style="width: 246px; flex-shrink: 0"></span>
					<span style="width: 560px; flex-shrink: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.faint}">Physical copies</span>
					<span style="flex: 1; text-align: right; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.faint}">Digital</span>
				</div>
				${rows}
				<div style="border-top: 1px solid ${t.rule}"></div>
			</div>
			<div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap">
				<span style="font-size: 14px; color: ${t.faint}">Rarity is a secret blend of:</span>
				${chip('Conservation status', t)}${chip('Likeliness of being spotted', t)}${chip('The Birdables Scale of Majesticness', t, true)}
			</div>
		</div>`;
};

/* ================= 6. THE FLOCK ================= */
const flock = (dark, t) => {
	const wall = birds
		.map((b) => {
			const file = `${b.slug}_thumb.jpg`;
			if (!thumbs.includes(file)) return '';
			return `<div style="display: flex; flex-direction: column; gap: 10px">
						<img src="${file}" alt="${b.birdName} card" style="width: 100%; height: 232px; object-fit: contain; filter: ${CARD_SHADOW}" />
						<div style="display: flex; flex-direction: column; gap: 3px">
							<span style="font-size: 14px; font-weight: 600; color: ${t.text}; letter-spacing: -0.01em">${b.birdName}</span>
							<div style="display: flex; align-items: center; gap: 6px">${stars(b.rarity, t.text, dark ? 'rgba(255,255,255,0.18)' : C.g200, 2)}</div>
						</div>
					</div>`;
		})
		.join('');
	return `
		<div style="display: flex; flex-direction: column; gap: 40px">
			<div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 40px">
				${sectionHead('04', 'The flock', 'Twenty-one birds, so far.', null, t, { width: 560 })}
				<div style="display: flex; align-items: center; gap: 10px">${chip('All 21', t, true)}${chip('Least Concern', t)}${chip('Threatened', t)}${chip('Specialty', t)}</div>
			</div>
			<div style="display: flex; gap: 20px">
				${statTile('21', 'cards live on the site today', t)}
				${statTile('8,189', 'QR scans across the flock', t, true)}
				${statTile('7', 'specialty cards with extra flourish', t)}
				${statTile('6', 'birds at some level of risk', t)}
			</div>
			<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 28px 20px">${wall}</div>
			<div style="display: flex; justify-content: center">${btnPrimary('Browse all cards', dark)}</div>
		</div>`;
};

/* ================= 7. SCAN → MEET THE BIRD (new idea) ================= */
const phoneMock = (dark, t) => `
				<div style="position: relative; width: 300px; height: 604px; border-radius: 42px; background: ${dark ? '#05090B' : C.g900}; padding: 14px; flex-shrink: 0; box-shadow: 0 30px 60px rgba(17,25,30,0.45)">
					<div style="width: 100%; height: 100%; border-radius: 30px; background: ${dark ? C.g800 : '#FFFFFF'}; overflow: hidden; display: flex; flex-direction: column; padding: 28px 22px; gap: 16px">
						<img src="brown-pelican_01.jpg" alt="Brown Pelican card" style="width: 150px; height: 210px; object-fit: contain; align-self: center; filter: ${CARD_SHADOW}" />
						<div style="display: flex; flex-direction: column; gap: 2px">
							<span style="font-size: 15px; color: ${dark ? t.dim : C.g500}">Brown</span>
							<span style="font-size: 30px; font-weight: 900; letter-spacing: -0.03em; color: ${dark ? '#FFFFFF' : C.g900}; line-height: 1">Pelican</span>
							<span style="font-size: 13px; font-style: italic; color: ${dark ? t.faint : C.g400}">Pelecanus occidentalis</span>
						</div>
						<div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 16px; background: ${dark ? 'rgba(255,255,255,0.07)' : C.g100}">
							${waveform('{{accent}}', 22, 12, 3, 5)}
							<span style="font-size: 13px; font-weight: 600; color: ${dark ? '#FFFFFF' : C.g900}">Hear its call</span>
						</div>
						<div style="display: flex; flex-direction: column; gap: 10px">
							<div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid ${dark ? t.rule : C.g100}">
								<span style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: ${dark ? t.faint : C.g400}">Rarity</span>
								${stars(1, dark ? '#FFFFFF' : C.g900, dark ? 'rgba(255,255,255,0.2)' : C.g200, 2)}
							</div>
							<div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid ${dark ? t.rule : C.g100}">
								<span style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: ${dark ? t.faint : C.g400}">Status</span>
								<span style="font-size: 13px; font-weight: 600; color: ${dark ? '#FFFFFF' : C.g900}">Least Concern</span>
							</div>
						</div>
					</div>
				</div>`;

const scanSection = (dark, t) => `
		<div style="display: flex; align-items: center; gap: 84px">
			<div style="flex: 1">
				${sectionHead('05', 'Scan · new idea', 'Point your phone at the card. Meet the bird.', 'Every card already carries a QR code. Today it opens the bird’s page — the range map, the rarity, where to learn more. The half-step further: the card plays the bird’s call, so the song on the front of the card is one you can actually hear.', t, { width: 600 })}
				<div style="display: flex; align-items: center; gap: 28px; margin-top: 36px">
					<div style="display: flex; align-items: center; gap: 14px; padding: 16px 22px; border-radius: 18px; border: 1px dashed {{accent}}">
						${qrGlyph('{{accent}}', 34)}
						<div style="display: flex; flex-direction: column; gap: 3px">
							<span style="font-size: 14px; font-weight: 600; color: ${t.text}">8,189 scans and counting</span>
							<span style="font-size: 13px; color: ${t.faint}">Every card in the wild, phoning home</span>
						</div>
					</div>
				</div>
				<div style="display: flex; align-items: center; gap: 14px; margin-top: 32px">${btnAccent('Try it on a card', dark)}</div>
			</div>
			${phoneMock(dark, t)}
		</div>`;

/* ================= 8. LIFE LIST / BINGO (new idea) ================= */
const bingo = (dark, t) => {
	const picks = birds.slice(0, 20); // 4 clean rows of 5
	const seen = [0, 3, 4, 6, 9, 12, 13, 17, 19];
	const cells = picks
		.map((b, i) => {
			const got = seen.includes(i);
			return `<div style="position: relative; display: flex; align-items: center; justify-content: center; text-align: center; height: 104px; padding: 10px; border-radius: 16px; border: 1px solid ${got ? '{{accent}}' : t.rule}; background: ${got ? 'rgba(242,150,0,0.10)' : 'transparent'}">
						<span style="font-size: 13px; font-weight: 600; line-height: 1.25; color: ${got ? t.text : t.dim}">${b.birdName}</span>
						${got ? `<span style="position: absolute; right: 8px; top: 8px">${checkGlyph('{{accent}}', 15)}</span>` : ''}
					</div>`;
		})
		.join('');
	return `
		<div style="display: flex; align-items: flex-start; gap: 72px">
			<div style="width: 460px; flex-shrink: 0">
				${sectionHead('06', 'Life list · new idea', 'Birdables Bingo.', 'Tick off the birds you have actually seen in the wild, not just the ones you own. Pull your life list from eBird and the card wall marks itself — the collection becomes a record of where you have been standing.', t, { width: 460 })}
				<div style="display: flex; flex-direction: column; gap: 14px; margin-top: 34px; padding: 22px 24px; border-radius: 20px; background: ${t.softPanel}; border: 1px solid ${t.rule}">
					<div style="display: flex; align-items: baseline; gap: 10px">
						<span style="font-size: 38px; font-weight: 900; letter-spacing: -0.03em; color: {{accent}}">9</span>
						<span style="font-size: 15px; color: ${t.dim}">of 21 spotted in the wild</span>
					</div>
					<span style="height: 10px; border-radius: 4px; background: linear-gradient(to right, {{accent}} 43%, ${t.rule} 43%)"></span>
					<span style="font-size: 13px; color: ${t.faint}">Sample progress — a real list would sync from eBird</span>
				</div>
				<div style="margin-top: 28px">${btnGhost('Connect eBird', dark, t)}</div>
			</div>
			<div style="flex: 1; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px">${cells}</div>
		</div>`;
};

/* ================= 9. DROP BAND (new idea) ================= */
const dropBand = (dark, t) => `
		<div style="display: flex; align-items: center; justify-content: space-between; gap: 64px">
			<div style="display: flex; flex-direction: column; gap: 16px; max-width: 560px">
				${sectionHead('07', 'Next drop · new idea', 'Be the first to know when new Birdables hatch.', 'Card drops land in batches. Get the heads-up before the rarest tiers go.', t, { width: 560 })}
			</div>
			<div style="display: flex; flex-direction: column; gap: 18px; flex-shrink: 0">
				<div style="display: flex; align-items: center; gap: 14px">
					${['04', '12', '36'].map((v, i) => `<div style="display: flex; flex-direction: column; align-items: center; gap: 6px"><span style="display: flex; align-items: center; justify-content: center; width: 96px; height: 96px; border-radius: 24px; background: ${dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF'}; border: 1px solid ${t.rule}; color: ${t.text}; font-size: 42px; font-weight: 900; letter-spacing: -0.03em">${v}</span><span style="font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.faint}">${['days', 'hours', 'mins'][i]}</span></div>`).join('')}
				</div>
				<div style="display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 22px; border-radius: 999px; background: ${dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF'}; border: 1px solid ${t.rule}">
					<span style="font-size: 15px; color: ${t.faint}; width: 220px">you@example.com</span>
					<span style="display: inline-flex; align-items: center; justify-content: center; padding: 14px 26px; border-radius: 999px; background: ${dark ? '#FFFFFF' : C.g900}; color: ${dark ? C.g900 : '#FFFFFF'}; font-size: 15px; font-weight: 600">Notify me</span>
				</div>
			</div>
		</div>`;

/* ================= 10. NOMINATE A BIRD (new idea) ================= */
const NOMINEES = [
	{ name: 'Painted Bunting', votes: 412 },
	{ name: 'Great Blue Heron', votes: 388 },
	{ name: 'Barn Owl', votes: 351 },
	{ name: 'Scarlet Tanager', votes: 297 },
	{ name: 'Common Loon', votes: 244 }
];
const nominate = (dark, t) => {
	const max = NOMINEES[0].votes;
	const rows = NOMINEES.map((n, i) => `
					<div style="display: flex; align-items: center; gap: 22px; padding: 16px 0; border-top: 1px solid ${t.rule}">
						<span style="width: 34px; flex-shrink: 0; font-size: 14px; font-weight: 900; color: ${t.faint}; font-variant-numeric: tabular-nums">0${i + 1}</span>
						<span style="width: 230px; flex-shrink: 0; font-size: 17px; font-weight: 600; color: ${t.text}">${n.name}</span>
						<span style="height: 12px; width: ${Math.round((n.votes / max) * 420)}px; border-radius: 4px; background: ${dark ? 'rgba(255,255,255,0.26)' : C.g300}"></span>
						<span style="font-size: 14px; color: ${t.dim}; font-variant-numeric: tabular-nums">${n.votes}</span>
						<span style="margin-left: auto; display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 999px; border: 1px solid ${t.rule}; font-size: 13px; font-weight: 600; color: ${t.text}">${plusGlyph('{{accent}}', 14)}Vote</span>
					</div>`).join('');
	return `
		<div style="display: flex; flex-direction: column; gap: 36px">
			${sectionHead('08', 'Nominate · new idea', 'Which bird joins the flock next?', 'The site already asks people to suggest a bird. This turns it into a running vote — the winner gets illustrated, and the nominators get first crack at the edition.', t, { width: 660 })}
			<div style="display: flex; flex-direction: column">${rows}<div style="border-top: 1px solid ${t.rule}"></div></div>
			<div style="display: flex; align-items: center; gap: 16px">
				${btnAccent('Suggest a bird', dark)}
				<span style="font-size: 13px; color: ${t.faint}">Vote counts here are sample numbers</span>
			</div>
		</div>`;
};

/* ================= 11. MADE RIGHT ================= */
const madeRight = (dark, t) => `
		<div style="display: flex; align-items: center; gap: 72px">
			<div style="position: relative; width: 520px; flex-shrink: 0">
				<img src="give-back.jpg" alt="Recycling and giving back" style="width: 520px; height: 390px; object-fit: cover; border-radius: 28px" />
				<div style="position: absolute; right: -28px; bottom: -28px; padding: 20px 24px; border-radius: 20px; background: ${dark ? t.alt : '#FFFFFF'}; border-left: 3px solid {{accent}}; box-shadow: ${POP_SHADOW}">
					<span style="display: block; font-size: 30px; font-weight: 900; letter-spacing: -0.03em; color: ${t.text}">0 trees</span>
					<span style="display: block; font-size: 13px; color: ${t.dim}">cut down for a Birdable</span>
				</div>
			</div>
			<div style="flex: 1">
				${sectionHead('09', 'Made right', 'Printed on 100% recycled paper, down the road from where it is drawn.', 'Cards are printed in Charleston, SC — local on purpose, to keep the emissions down. A portion of profits goes to bird conservation, and the digital cards mint on Polygon, which settles by proof-of-stake instead of burning a small country of electricity.', t, { width: 620 })}
				<div style="display: flex; gap: 16px; margin-top: 34px">
					${statTile('100%', 'recycled paper, always', t)}
					${statTile('2.5 × 3.5"', 'standard trading card size', t)}
					${statTile('Polygon', 'proof-of-stake, for the digital twin', t)}
				</div>
			</div>
		</div>`;

/* ================= 12. IN THE WILD ================= */
const inTheWild = (dark, t) => {
	const shots = [
		{ file: 'cards-on-grass.jpg', rot: -4, w: 330, h: 248, mt: 0 },
		{ file: 'cards-in-bush.jpg', rot: 3, w: 268, h: 340, mt: 52 },
		{ file: 'cedar-waxwing-in-bush.jpg', rot: -2.5, w: 268, h: 340, mt: 0 },
		{ file: 'cards-on-feeder.jpg', rot: 4.5, w: 268, h: 340, mt: 44 },
		{ file: 'pileated-woodpecker-on-tree.jpg', rot: -3, w: 268, h: 340, mt: 8 }
	];
	return `
		<div style="display: flex; flex-direction: column; gap: 44px">
			<div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 40px">
				${sectionHead('10', 'In the wild', 'Birdables, out being Birdables.', 'Share yours with #BirdablesInTheWild.', t, { width: 560 })}
				${btnGhost('View on Instagram', dark, t)}
			</div>
			<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 18px">
				${shots
					.map(
						(s) => `<div style="margin-top: ${s.mt}px; padding: 12px 12px 44px; border-radius: 8px; background: ${dark ? '#FFFFFF' : '#FFFFFF'}; transform: rotate(${s.rot}deg); box-shadow: ${POP_SHADOW}">
						<img src="${s.file}" alt="A Birdables card out in the world" style="display: block; width: ${s.w}px; height: ${s.h}px; object-fit: cover" />
					</div>`
					)
					.join('')}
			</div>
		</div>`;
};

/* ================= 13. FIELD NOTES ================= */
const fieldNotes = (dark, t) => `
		<div style="display: flex; align-items: flex-start; gap: 72px">
			<div style="width: 420px; flex-shrink: 0">
				${sectionHead('11', 'Field notes', 'From the blog.', 'All the latest Birdables news and information — new card drops, gear reviews, birding locations, and more.', t, { width: 420 })}
				<div style="margin-top: 30px">${btnGhost('Read the blog', dark, t)}</div>
			</div>
			<div style="flex: 1; display: flex; gap: 20px">
				<div style="flex: 1; display: flex; flex-direction: column; gap: 14px; padding: 28px; border-radius: 24px; background: ${t.softPanel}; border: 1px solid ${t.rule}">
					<div style="display: flex; align-items: center; gap: 10px">
						<span style="display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 999px; border: 1px solid ${t.rule}; color: ${t.dim}; font-size: 12px; font-weight: 600">${dot('{{accent}}', 6)}Behind the scenes</span>
						<span style="font-size: 13px; color: ${t.faint}">Nov 28, 2021</span>
					</div>
					<span style="font-size: 26px; font-weight: 900; letter-spacing: -0.025em; line-height: 1.1; color: ${t.text}">Eco-friendly gift wrapping available</span>
					<span style="font-size: 15px; line-height: 1.55; color: ${t.dim}">100% eco-friendly gift wrapping, just in time for Christmas.</span>
					<div style="display: flex; align-items: center; gap: 8px; margin-top: auto; padding-top: 16px">
						<span style="font-size: 12px; color: ${t.faint}">eco-friendly</span>${dot(t.faint, 3)}
						<span style="font-size: 12px; color: ${t.faint}">holiday season</span>
					</div>
				</div>
				<div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 14px; padding: 28px; border-radius: 24px; border: 1px dashed ${t.rule}">
					<span style="font-size: 20px; font-weight: 600; color: ${t.dim}">More field notes are coming.</span>
					<span style="font-size: 15px; line-height: 1.55; color: ${t.faint}">Drop reports, the making of a card, and where to actually find these birds.</span>
				</div>
			</div>
		</div>`;

/* ================= 14. FAQ ================= */
const FAQS = [
	{ q: 'What are the physical cards like?', a: 'They are 6.4cm (2.5 in) × 8.9cm (3.5 in) — standard trading card size, so they fit your existing sleeves. Printed on high quality 100% recycled paper with a cross-hatch texture, sturdy with a slight bend. Physical cards are no longer available for purchase.', open: true },
	{ q: 'What is the digital version?', a: 'An NFT you keep in your wallet, verifiable on the Polygon blockchain, which comes with the hi-res artwork. Digital cards are scarcer than physical ones.' },
	{ q: 'How do Birdables help birds?', a: 'A portion of profits goes to conservation organisations like the Cornell Lab of Ornithology, eBird and Audubon. Nothing is printed on virgin paper, so no trees come down for a Birdable.' },
	{ q: 'How do I get in touch?', a: 'Email birdables@gmail.com — there are still a few physical cards in a personal stash, so it is worth asking.' }
];
const faq = (dark, t) => `
		<div style="display: flex; align-items: flex-start; gap: 72px">
			<div style="width: 420px; flex-shrink: 0">${sectionHead('12', 'FAQ', 'The usual questions.', null, t, { width: 420 })}</div>
			<div style="flex: 1; display: flex; flex-direction: column">
				${FAQS.map(
					(f) => `<div style="display: flex; flex-direction: column; gap: 12px; padding: 26px 0; border-top: 1px solid ${t.rule}">
					<div style="display: flex; align-items: center; justify-content: space-between; gap: 24px">
						<span style="font-size: 21px; font-weight: 600; letter-spacing: -0.015em; color: ${t.text}">${f.q}</span>
						<span style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 999px; border: 1px solid ${t.rule}; flex-shrink: 0">${f.open ? `<span style="width: 13px; height: 2px; background: {{accent}}"></span>` : plusGlyph(t.faint, 16)}</span>
					</div>
					${f.open ? `<p style="margin: 0; max-width: 660px; font-size: 16px; line-height: 1.65; color: ${t.dim}">${f.a}</p>` : ''}
				</div>`
				).join('')}
				<div style="border-top: 1px solid ${t.rule}"></div>
			</div>
		</div>`;

/* ================= 15. CLOSING CTA ================= */
const closing = (dark, t) => `
		<div style="position: relative; overflow: hidden; border-radius: 44px; background: ${dark ? t.alt : C.g900}; padding: 88px 72px; display: flex; align-items: center; justify-content: space-between; gap: 64px">
			<span style="position: absolute; right: -80px; top: -80px; width: 320px; height: 320px; border-radius: 999px; background: {{accent}}; opacity: 0.16"></span>
			<div style="position: relative; max-width: 620px">
				<h2 style="margin: 0; font-size: 56px; line-height: 1.02; letter-spacing: -0.035em; font-weight: 900; color: #FFFFFF">The whole flock is waiting.</h2>
				<p style="margin: 20px 0 0; font-size: 18px; line-height: 1.6; color: ${C.g300}">Beautifully illustrated, sustainably printed, and packed with real bird science. Each Birdable is a tiny field guide you can hold in your hand — or trade with a friend.</p>
			</div>
			<div style="position: relative; display: flex; flex-direction: column; gap: 14px; flex-shrink: 0">
				${btnAccent('Browse the cards', true)}
				<a href="#" style="text-align: center; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: underline; text-underline-offset: 3px">Learn about Birdables</a>
			</div>
		</div>`;

/* ================= 16. FOOTER ================= */
const footerCol = (title, links, t) => `
				<div style="display: flex; flex-direction: column; gap: 14px">
					<span style="font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.faint}">${title}</span>
					${links.map((l) => `<a href="#" style="font-size: 15px; color: ${t.dim}; text-decoration: none">${l}</a>`).join('')}
				</div>`;

const footer = (dark, t) => `
		<div style="display: flex; flex-direction: column; gap: 56px">
			<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 64px">
				<div style="display: flex; flex-direction: column; gap: 20px; max-width: 360px">
					${logo(dark, 232, 37)}
					<p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${t.dim}">Collectable bird cards, drawn and printed with a light touch. Because birds are fly.</p>
					<div style="display: flex; align-items: center; gap: 20px; color: ${t.text}; margin-top: 4px">${igIcon}${twIcon}${osIcon}</div>
				</div>
				<div style="display: flex; gap: 72px">
					${footerCol('Cards', ['All cards', 'The flock', 'Rarity scale', 'Card anatomy'], t)}
					${footerCol('Project', ['About Birdables', 'Field notes', 'Giving back', 'Suggest a bird'], t)}
					${footerCol('Elsewhere', ['Instagram', 'Twitter', 'OpenSea'], t)}
				</div>
				<div style="display: flex; flex-direction: column; gap: 14px; width: 320px; flex-shrink: 0">
					<span style="font-size: 16px; font-weight: 600; color: ${t.text}">Be the first to know when new Birdables hatch.</span>
					<div style="display: flex; align-items: center; gap: 8px; padding: 6px 6px 6px 18px; border-radius: 999px; border: 1px solid ${t.rule}">
						<span style="flex: 1; font-size: 14px; color: ${t.faint}">Email address</span>
						<span style="display: inline-flex; align-items: center; justify-content: center; padding: 11px 20px; border-radius: 999px; background: ${dark ? '#FFFFFF' : C.g900}; color: ${dark ? C.g900 : '#FFFFFF'}; font-size: 14px; font-weight: 600">Subscribe</span>
					</div>
				</div>
			</div>
			<div style="display: flex; align-items: center; justify-content: space-between; padding-top: 28px; border-top: 1px solid ${t.rule}">
				<span style="font-size: 13px; color: ${t.faint}">© 2026 Birdables. No trees were harmed in the making of these cards.</span>
				<div style="display: flex; align-items: center; gap: 26px">
					<a href="#" style="font-size: 13px; color: ${t.faint}; text-decoration: none">Privacy</a>
					<a href="#" style="font-size: 13px; color: ${t.faint}; text-decoration: none">Terms</a>
				</div>
			</div>
		</div>`;

/* ---------- the whole page ---------- */
const homepage = (dark) => {
	const t = T(dark);
	return `
${nav(dark, t)}
${hero(dark, t)}
${section(whatAre(dark, t), { bg: t.bg, pad: '104px 64px' })}
${section(anatomy(dark, t), { bg: t.alt, pad: '104px 64px' })}
${section(rarityLadder(dark, t), { bg: t.bg, pad: '104px 64px' })}
${section(flock(dark, t), { bg: t.alt, pad: '104px 64px' })}
${section(scanSection(dark, t), { bg: t.bg, pad: '104px 64px' })}
${section(bingo(dark, t), { bg: t.alt, pad: '104px 64px' })}
${section(dropBand(dark, t), { bg: t.alt, pad: '88px 64px' })}
${section(nominate(dark, t), { bg: t.bg, pad: '104px 64px' })}
${section(madeRight(dark, t), { bg: t.alt, pad: '104px 64px' })}
${section(inTheWild(dark, t), { bg: t.bg, pad: '104px 64px' })}
${section(fieldNotes(dark, t), { bg: t.alt, pad: '104px 64px' })}
${section(faq(dark, t), { bg: t.bg, pad: '104px 64px' })}
${section(closing(dark, t), { bg: t.bg, pad: '0 64px 104px' })}
${section(footer(dark, t), { bg: t.alt, pad: '76px 64px' })}`;
};

/* ---------- earlier hero explorations (page 2) ---------- */
const heroOnly = (dark) => {
	const t = T(dark);
	return `${nav(dark, t)}${hero(dark, t)}`;
};

const page = ({ body, script, dark = false, fixedHeight = null }) => {
	const t = T(dark);
	return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
${FONTS}
    body { margin: 0; background: ${t.bg}; font-family: 'GreycliffCF', ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: ${t.text}; }
    a:hover { color: ${dark ? C.g300 : C.g600}; }
    h1, h2 { font-weight: 900; }
  </style>
</helmet>
<div style="width: 1440px; ${fixedHeight ? `height: ${fixedHeight}px;` : ''} background: ${t.bg}; color: ${t.text}; display: flex; flex-direction: column; overflow: hidden">
${body}
</div>
</x-dc>
${script}
</body>
</html>
`;
};

const props = (extra = '', w = 1440, h = 1000) =>
	`"accent":{"editor":"color","default":"#F29600","options":["#F29600","#FBAB2A","#D78500","#11191E"],"section":"Brand"}${extra},"$preview":{"width":${w},"height":${h}}`;
const tiltProp = ',"tilt":{"editor":"range","default":17,"min":0,"max":32,"step":1,"unit":"deg","section":"Card"}';

const tiltScript = (h = 1000) => `<script data-dc-script data-props='{${props(tiltProp, 1440, h)}}'>
class Component extends DCLogic {
	renderVals() {
		const tilt = this.props.tilt ?? 17;
		return {
			accent: this.props.accent ?? '#F29600',
			cardTransform: 'rotateY(-' + tilt + 'deg) rotateX(7deg) rotateZ(-1deg)'
		};
	}
}
</script>`;

// Generous: surplus frame just paints the page background, but a short frame clips the footer.
const PAGE_H = 13600;
writeFileSync(join(OUT, 'Main.dc.html'), page({ body: homepage(true), script: tiltScript(PAGE_H), dark: true }));
writeFileSync(join(OUT, 'Light.dc.html'), page({ body: homepage(false), script: tiltScript(PAGE_H) }));
// Hero-only artboards retired; page 2 now holds the bolder explorations from build-wild.mjs.

const canvas = {
	pages: [
		{ id: 'page-1', name: 'Homepage' },
		{ id: 'page-2', name: 'Bolder explorations' }
	],
	artboards: [
		{ file: 'Main.dc.html', page: 'page-1', x: 0, y: 0, w: 1440, h: PAGE_H, title: 'Homepage — dark (default)', print: 'flow' },
		{ file: 'Light.dc.html', page: 'page-1', x: 1660, y: 0, w: 1440, h: PAGE_H, title: 'Homepage — light mode', print: 'flow' },
		{ file: 'Plate.dc.html', page: 'page-2', x: 0, y: 0, w: 1440, h: 4260, title: 'A — Plate · engraved specimen', print: 'flow' },
		{ file: 'Drop.dc.html', page: 'page-2', x: 1600, y: 0, w: 1440, h: 4720, title: 'B — Drop · brutalist poster', print: 'flow' },
		{ file: 'Vitrine.dc.html', page: 'page-2', x: 3200, y: 0, w: 1440, h: 4180, title: 'C — Vitrine · collector’s case', print: 'flow' }
	],
	annotations: [
		{
			id: 'homepage-dark',
			page: 'page-1',
			x: 0,
			y: -250,
			w: 520,
			text: 'HOMEPAGE — dark by default\nOne direction, two modes: the nav carries a sun/moon toggle and the light twin is the artboard to the right.\nThis revision: deeper charcoal (#0C1217, down from the soft #11191E), the marquee band removed entirely, and no orange buttons anywhere — orange is now only section numbers, the rarity bars, the life-list ticks and a few hairlines.\nSections 05, 06, 07 and 08 are new ideas, not things the site does today — they are labelled "new idea" on the page so nothing reads as a promise.'
		},
		{
			id: 'homepage-light',
			page: 'page-1',
			x: 1660,
			y: -250,
			w: 520,
			text: 'HOMEPAGE — light mode\nThe same page and the same components with the light theme applied. The rarity bars use a separate validated orange ramp, because the dark ramp would wash out on white.'
		},
		{
			id: 'bolder-explorations',
			page: 'page-2',
			x: 0,
			y: -250,
			w: 520,
			text: 'Three bolder explorations, parked here rather than deleted.\nWorth raiding for parts even though the homepage went a different way — the engraved index, the gapless contact sheet and the graded slabs would all drop into the main page.'
		}
	],
	launch: { view: 'canvas', page: 'page-1' }
};
writeFileSync(join(OUT, 'canvas.json'), JSON.stringify(canvas, null, 2));
console.log(`built 4 artboards + canvas.json — ${birds.length} birds, ${thumbs.length} thumbs`);
