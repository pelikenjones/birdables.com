// Three bolder homepage directions. Run AFTER build.mjs (this overwrites canvas.json).
// PLATE   — engraved specimen plate: ink black, bone, serif, hairline density
// DROP    — brutalist poster: true black, Anton at 200px+, hard edges, zero radius
// VITRINE — collector's case: near-black green, brass, Cormorant, glass and bevels
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = '/Users/kennehy/birdables.com';
const WORK = '/private/tmp/claude-501/-Users-kennehy-birdables-com/85879f20-686c-4185-a62d-6807a335824c/scratchpad/work';
const OUT = '/private/tmp/claude-501/-Users-kennehy-birdables-com/85879f20-686c-4185-a62d-6807a335824c/scratchpad/canvas';

const birds = JSON.parse(readFileSync(join(REPO, 'src/lib/data/birds.json'), 'utf8')).filter((b) => b.liveOnSite);
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const TIERS = [
	{ n: 1, digital: 50, physical: 2000 },
	{ n: 2, digital: 25, physical: 1500 },
	{ n: 3, digital: 10, physical: 800 },
	{ n: 4, digital: 5, physical: 200 },
	{ n: 5, digital: 1, physical: 50 }
];

/* ---------- fonts: the brand face, inlined; display faces from Google ---------- */
const face = (file, weight, style = 'normal') =>
	`@font-face{font-family:'GreycliffCF';font-weight:${weight};font-style:${style};font-display:swap;src:url(data:font/woff2;base64,${readFileSync(join(WORK, file + '.b64'), 'utf8').trim()}) format('woff2');}`;
const GREYCLIFF = [
	face('GreycliffCFMedium', 500), face('GreycliffCFDemiBold', 600),
	face('GreycliffCFDemiBoldOblique', 600, 'italic'), face('GreycliffCFHeavy', 900)
].join('\n');

/* ---------- repo svg assets ---------- */
const svgFrom = (path) => {
	const raw = readFileSync(path, 'utf8');
	return raw.slice(raw.indexOf('<svg'), raw.lastIndexOf('</svg>') + 6)
		.replace(/\sclass=\{className\}/g, '').replace(/\s*\n\s*/g, ' ');
};
const logoDark = (w = 176, h = 28) =>
	svgFrom(join(REPO, 'static/images/logo-on-dark.svg'))
		.replace('<svg width="672" height="106"', `<svg viewBox="0 0 672 106" width="${w}" height="${h}"`);
const igIcon = svgFrom(join(REPO, 'src/lib/svgs/Instagram.svelte')).replace('<svg', '<svg width="17" height="17"');
const twIcon = svgFrom(join(REPO, 'src/lib/svgs/Twtter.svelte')).replace('<svg', '<svg width="20" height="16"');
const osIcon = svgFrom(join(REPO, 'src/lib/svgs/OpenSeaIcon.svelte')).replace('<svg', '<svg width="18" height="16"');

/* ---------- texture ---------- */
const noise = (op = 0.05, freq = 0.85) => {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="160" height="160" filter="url(#n)" opacity="${op}"/></svg>`;
	return `url("data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}")`;
};

const CARD_SHADOW =
	'drop-shadow(0 0 1px rgba(0,0,0,0.3)) drop-shadow(0 18px 34px rgba(0,0,0,0.55))';

const deck = ({ w, h, popovers = '', shadow = CARD_SHADOW }) => `
					<div style="position: relative; transform-style: preserve-3d; transform: {{cardTransform}}">
						<img src="roseate-spoonbill_01.jpg" alt="Roseate Spoonbill card" style="position: absolute; left: ${-Math.round(w * 0.124)}px; top: 16px; width: ${w}px; height: ${h}px; object-fit: contain; opacity: 0.5; transform: translateZ(-70px); filter: ${shadow}" />
						<img src="northern-cardinal_01.jpg" alt="Northern Cardinal card" style="position: absolute; left: ${-Math.round(w * 0.065)}px; top: 8px; width: ${w}px; height: ${h}px; object-fit: contain; opacity: 0.78; transform: translateZ(-36px); filter: ${shadow}" />
						<img src="brown-pelican_01.jpg" alt="Brown Pelican card, edition 01" style="position: relative; display: block; width: ${w}px; height: ${h}px; object-fit: contain; filter: ${shadow}" />
						${popovers}
					</div>`;

const starRow = (n, on, off, size = 11, gap = 3) =>
	`<span style="display: inline-flex; align-items: center; gap: ${gap}px">${[1, 2, 3, 4, 5]
		.map((i) => `<span style="width: ${size}px; height: ${size}px; border-radius: 999px; background: ${i <= n ? on : 'transparent'}; border: 1px solid ${i <= n ? on : off}"></span>`)
		.join('')}</span>`;

const page = ({ body, bg, ink, googleFonts = '', extraCss = '', script }) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  ${googleFonts}
  <style>
${GREYCLIFF}
    body { margin: 0; background: ${bg}; font-family: 'GreycliffCF', ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: ${ink}; text-decoration: none; }
    a:hover { opacity: 0.7; }
${extraCss}
  </style>
</helmet>
${body}
</x-dc>
${script}
</body>
</html>
`;

const script = (h, accentDefault = '#F29600') => `<script data-dc-script data-props='{"accent":{"editor":"color","default":"${accentDefault}","options":["#F29600","#C9A227","#E8412C","#FFFFFF"],"section":"Brand"},"tilt":{"editor":"range","default":17,"min":0,"max":34,"step":1,"unit":"deg","section":"Card"},"$preview":{"width":1440,"height":${h}}}'>
class Component extends DCLogic {
	renderVals() {
		const tilt = this.props.tilt ?? 17;
		return {
			accent: this.props.accent ?? '${accentDefault}',
			cardTransform: 'rotateY(-' + tilt + 'deg) rotateX(7deg) rotateZ(-1deg)'
		};
	}
}
</script>`;

/* ============================================================= */
/* DIRECTION A — PLATE                                            */
/* ============================================================= */
const P = { bg: '#0A0B0C', ink: '#EDE6D8', dim: 'rgba(237,230,216,0.62)', faint: 'rgba(237,230,216,0.38)', rule: 'rgba(237,230,216,0.22)' };
const serif = `'Libre Caslon Display', Georgia, 'Times New Roman', serif`;
const caps = (text, color, size = 11, ls = '0.22em') =>
	`<span style="font-size: ${size}px; font-weight: 600; letter-spacing: ${ls}; text-transform: uppercase; color: ${color}">${text}</span>`;

const plateRule = (color = P.rule, mt = 0, mb = 0) =>
	`<div style="height: 1px; background: ${color}; margin: ${mt}px 0 ${mb}px"></div>`;

const plateMasthead = () => `
	<div style="padding: 0 56px">
		${plateRule(P.rule, 0, 0)}
		<div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 0">
			${caps('Est. 2021 · Charleston, S.C.', P.faint)}
			<div style="display: flex; align-items: center; gap: 26px">${logoDark(150, 24)}</div>
			<div style="display: flex; align-items: center; gap: 22px">
				${caps('Cards', P.dim)}${caps('About', P.dim)}${caps('Blog', P.dim)}
				<span style="width: 1px; height: 14px; background: ${P.rule}"></span>
				${caps('No. XXI', P.faint)}
			</div>
		</div>
		${plateRule(P.rule)}
	</div>`;

const plateHero = () => `
	<div style="padding: 0 56px">
		<div style="display: flex; gap: 0; border-bottom: 1px solid ${P.rule}">
			<div style="width: 620px; flex-shrink: 0; padding: 54px 48px 54px 0; border-right: 1px solid ${P.rule}">
				${caps('The illustrated flock', '{{accent}}')}
				<h1 style="margin: 20px 0 0; font-family: ${serif}; font-size: 112px; line-height: 0.88; letter-spacing: -0.02em; font-weight: 400; color: ${P.ink}">Collectable<br />Bird Cards</h1>
				<p style="margin: 22px 0 0; font-family: ${serif}; font-style: italic; font-size: 30px; line-height: 1.15; color: ${P.dim}">Because birds are fly.</p>
				${plateRule(P.rule, 34, 26)}
				<div style="display: flex; gap: 34px">
					<p style="margin: 0; flex: 1; font-size: 14px; line-height: 1.7; color: ${P.dim}">Thousands of bird species are at risk from habitat loss and climate change. Even the ones you think of as common sightings may be rarer than you think.</p>
					<p style="margin: 0; flex: 1; font-size: 14px; line-height: 1.7; color: ${P.dim}">Each card is drawn, printed on 100% recycled paper in Charleston, and numbered. The rarity scale mirrors how often you would really see the bird.</p>
				</div>
				<div style="display: flex; align-items: center; gap: 22px; margin-top: 34px">
					<a href="#" style="display: inline-flex; align-items: center; padding: 15px 30px; border: 1px solid ${P.ink}; color: ${P.ink}; font-size: 13px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase">Browse the plates</a>
					<a href="#" style="font-family: ${serif}; font-style: italic; font-size: 19px; color: ${P.dim}; border-bottom: 1px solid ${P.rule}">About the project</a>
				</div>
			</div>
			<div style="flex: 1; position: relative; padding: 54px 0; display: flex; align-items: center; justify-content: center; perspective: 1700px; background-image: ${noise(0.07)}">
				<span style="position: absolute; left: 28px; top: 54px; width: 12px; height: 12px; border-left: 1px solid ${P.rule}; border-top: 1px solid ${P.rule}"></span>
				<span style="position: absolute; right: 0; top: 54px; width: 12px; height: 12px; border-right: 1px solid ${P.rule}; border-top: 1px solid ${P.rule}"></span>
				<span style="position: absolute; left: 28px; bottom: 54px; width: 12px; height: 12px; border-left: 1px solid ${P.rule}; border-bottom: 1px solid ${P.rule}"></span>
				<span style="position: absolute; right: 0; bottom: 54px; width: 12px; height: 12px; border-right: 1px solid ${P.rule}; border-bottom: 1px solid ${P.rule}"></span>
				${deck({ w: 344, h: 482 })}
				<div style="position: absolute; right: 12px; bottom: 76px; text-align: right">
					${caps('Plate i', P.faint)}
					<p style="margin: 6px 0 0; font-family: ${serif}; font-style: italic; font-size: 17px; color: ${P.dim}">Pelecanus occidentalis</p>
				</div>
			</div>
		</div>
	</div>`;

const plateSpecimen = () => `
	<div style="padding: 0 56px">
		<div style="position: relative; display: flex; align-items: center; gap: 0; padding: 60px 0; border-bottom: 1px solid ${P.rule}">
			<div style="position: relative; width: 560px; flex-shrink: 0; display: flex; justify-content: center">
				<img src="bird-osprey.webp" alt="Osprey illustration" style="width: 430px; height: auto; display: block" />
				<span style="position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: ${P.rule}"></span>
			</div>
			<div style="flex: 1; padding-left: 56px; border-left: 1px solid ${P.rule}">
				${caps('Specimen No. 12', '{{accent}}')}
				<h2 style="margin: 16px 0 0; font-family: ${serif}; font-size: 68px; line-height: 0.92; font-weight: 400; color: ${P.ink}">Osprey</h2>
				<p style="margin: 10px 0 0; font-family: ${serif}; font-style: italic; font-size: 24px; color: ${P.dim}">Pandion haliaetus</p>
				${plateRule(P.rule, 28, 0)}
				${[['Rarity', '★★☆☆☆ · two of five'], ['Status', 'Least Concern'], ['Range', 'North America'], ['Edition', '01 — 1,500 printed · 25 digital'], ['Scans', '405 and counting']]
					.map(
						([k, v]) => `<div style="display: flex; align-items: baseline; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid ${P.rule}">
						${caps(k, P.faint)}
						<span style="font-family: ${serif}; font-size: 19px; color: ${P.ink}">${v}</span>
					</div>`
					)
					.join('')}
			</div>
		</div>
	</div>`;

const plateIndex = () => {
	const col = (list, start) =>
		`<div style="flex: 1; display: flex; flex-direction: column">${list
			.map(
				(b, i) => `<div style="display: flex; align-items: baseline; gap: 12px; padding: 11px 0; border-bottom: 1px solid ${P.rule}">
					<span style="width: 26px; font-size: 11px; letter-spacing: 0.08em; color: ${P.faint}; font-variant-numeric: tabular-nums">${String(start + i + 1).padStart(2, '0')}</span>
					<span style="flex: 1; font-family: ${serif}; font-size: 19px; color: ${P.ink}">${b.birdName}</span>
					<span style="font-family: ${serif}; font-style: italic; font-size: 13px; color: ${P.faint}">${b.scientificName}</span>
					${starRow(b.rarity, '{{accent}}', P.rule, 7, 2)}
				</div>`
			)
			.join('')}</div>`;
	return `
	<div style="padding: 60px 56px; border-bottom: 1px solid ${P.rule}">
		<div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 30px">
			<h2 style="margin: 0; font-family: ${serif}; font-size: 54px; line-height: 1; font-weight: 400; color: ${P.ink}">Index of the flock</h2>
			${caps('Twenty-one plates issued', P.faint)}
		</div>
		<div style="display: flex; gap: 48px">${col(birds.slice(0, 7), 0)}${col(birds.slice(7, 14), 7)}${col(birds.slice(14, 21), 14)}</div>
	</div>`;
};

const plateRarity = () => `
	<div style="padding: 60px 56px; border-bottom: 1px solid ${P.rule}">
		<div style="display: flex; gap: 56px">
			<div style="width: 420px; flex-shrink: 0">
				<h2 style="margin: 0; font-family: ${serif}; font-size: 54px; line-height: 0.96; font-weight: 400; color: ${P.ink}">The rarity<br />scale</h2>
				<p style="margin: 22px 0 0; font-size: 14px; line-height: 1.7; color: ${P.dim}">A secret blend of the bird's conservation status, how likely you are to spot one, and the Birdables Scale of Majesticness.</p>
			</div>
			<div style="flex: 1">
				<div style="display: flex; align-items: baseline; padding-bottom: 10px; border-bottom: 1px solid ${P.rule}">
					<span style="width: 90px">${caps('Tier', P.faint)}</span>
					<span style="flex: 1">${caps('Rarity', P.faint)}</span>
					<span style="width: 160px; text-align: right">${caps('Physical', P.faint)}</span>
					<span style="width: 120px; text-align: right">${caps('Digital', P.faint)}</span>
				</div>
				${TIERS.map(
					(t, i) => `<div style="display: flex; align-items: baseline; padding: 18px 0; border-bottom: 1px solid ${P.rule}">
					<span style="width: 90px; font-family: ${serif}; font-size: 30px; color: ${i === 4 ? '{{accent}}' : P.ink}">${ROMAN[i]}</span>
					<span style="flex: 1">${starRow(t.n, i === 4 ? '{{accent}}' : P.ink, P.rule, 9, 3)}</span>
					<span style="width: 160px; text-align: right; font-family: ${serif}; font-size: 26px; color: ${P.ink}; font-variant-numeric: tabular-nums">${t.physical.toLocaleString('en-US')}</span>
					<span style="width: 120px; text-align: right; font-family: ${serif}; font-size: 26px; color: ${P.dim}; font-variant-numeric: tabular-nums">${t.digital}</span>
				</div>`
				).join('')}
			</div>
		</div>
	</div>`;

const plateClose = () => `
	<div style="padding: 76px 56px; text-align: center">
		<img src="bird-sandhill-crane.webp" alt="Sandhill Crane illustration" style="width: 230px; height: auto; display: block; margin: 0 auto 28px" />
		<h2 style="margin: 0; font-family: ${serif}; font-size: 76px; line-height: 0.96; font-weight: 400; color: ${P.ink}">The whole flock<br />is waiting.</h2>
		<div style="display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 34px">
			<a href="#" style="display: inline-flex; padding: 16px 34px; border: 1px solid ${P.ink}; color: ${P.ink}; font-size: 13px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase">Browse all cards</a>
			<a href="#" style="font-family: ${serif}; font-style: italic; font-size: 20px; color: ${P.dim}; border-bottom: 1px solid ${P.rule}">Suggest a bird</a>
		</div>
		${plateRule(P.rule, 60, 18)}
		<div style="display: flex; align-items: center; justify-content: space-between">
			${caps('© 2026 Birdables', P.faint)}
			<div style="display: flex; gap: 18px; color: ${P.dim}">${igIcon}${twIcon}${osIcon}</div>
		</div>
	</div>`;

const PLATE_H = 4260;
const plate = page({
	bg: P.bg,
	ink: P.ink,
	googleFonts: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&display=swap">`,
	script: script(PLATE_H),
	body: `<div style="width: 1440px; background: ${P.bg}; background-image: ${noise(0.04)}; color: ${P.ink}; padding: 22px 0 0">
${plateMasthead()}${plateHero()}${plateSpecimen()}${plateIndex()}${plateRarity()}${plateClose()}
</div>`
});

/* ============================================================= */
/* DIRECTION B — DROP                                             */
/* ============================================================= */
const D = { bg: '#050505', ink: '#FFFFFF', dim: 'rgba(255,255,255,0.58)', rule: 'rgba(255,255,255,0.3)' };
const anton = `'Anton', 'Arial Narrow', Impact, sans-serif`;
const dLabel = (text, color = D.ink, size = 12) =>
	`<span style="font-size: ${size}px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: ${color}">${text}</span>`;

const dropNav = () => `
	<div style="display: flex; align-items: center; justify-content: space-between; padding: 22px 40px; border-bottom: 3px solid ${D.ink}">
		${logoDark(158, 25)}
		<div style="display: flex; align-items: center; gap: 34px">${dLabel('Cards')}${dLabel('About')}${dLabel('Blog')}</div>
		<div style="display: flex; align-items: center; gap: 16px">
			<span style="display: inline-flex; align-items: center; gap: 10px; padding: 11px 20px; border: 2px solid ${D.ink}">${dLabel('Browse all 21')}</span>
		</div>
	</div>`;

const dropHero = () => `
	<div style="position: relative; overflow: hidden; border-bottom: 3px solid ${D.ink}">
		<div style="position: relative; padding: 40px 40px 0">
			<h1 style="margin: 0; font-family: ${anton}; font-size: 232px; line-height: 0.79; letter-spacing: -0.015em; text-transform: uppercase; color: ${D.ink}">Collect<span style="color: {{accent}}">.</span><br />able<br />birds</h1>
			<div style="position: absolute; right: 26px; top: 54px; width: 560px; perspective: 1800px; display: flex; justify-content: flex-end">
				${deck({ w: 392, h: 549, shadow: 'drop-shadow(18px 20px 0 rgba(0,0,0,0.9))' })}
			</div>
			<div style="position: absolute; right: 40px; top: 640px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px">
				<span style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 18px; background: {{accent}}; color: ${D.bg}; font-size: 13px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase">Edition 01 / 2000</span>
			</div>
		</div>
		<div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; padding: 26px 40px 34px">
			<p style="margin: 0; max-width: 520px; font-size: 17px; line-height: 1.6; color: ${D.dim}">Twenty-one birds, drawn and printed on 100% recycled paper. Rarity mirrors how often you would really see one — and when a tier is gone, it is gone.</p>
			<div style="display: flex; align-items: center; gap: 0">
				<a href="#" style="display: inline-flex; align-items: center; padding: 20px 40px; background: ${D.ink}; color: ${D.bg}; font-size: 14px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase">Browse all cards</a>
				<a href="#" style="display: inline-flex; align-items: center; padding: 20px 34px; border: 2px solid ${D.ink}; color: ${D.ink}; font-size: 14px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase">The story</a>
			</div>
		</div>
		<div style="display: grid; grid-template-columns: repeat(4, 1fr); border-top: 3px solid ${D.ink}">
			${[['21', 'cards in the flock'], ['5', 'rarity tiers'], ['8,189', 'qr scans logged'], ['100%', 'recycled paper']]
				.map(
					([v, l], i) => `<div style="padding: 26px 30px; ${i < 3 ? `border-right: 3px solid ${D.ink};` : ''}">
					<div style="font-family: ${anton}; font-size: 54px; line-height: 0.9; color: ${D.ink}">${v}</div>
					<div style="margin-top: 8px">${dLabel(l, D.dim, 11)}</div>
				</div>`
				)
				.join('')}
		</div>
	</div>`;

const dropSheet = () => {
	const cells = birds
		.map(
			(b, i) => `<div style="position: relative; border-right: 2px solid ${D.ink}; border-bottom: 2px solid ${D.ink}; padding: 14px; display: flex; flex-direction: column; gap: 8px; background: ${i === 8 ? D.ink : 'transparent'}">
				<img src="${b.slug}_thumb.jpg" alt="${b.birdName} card" style="width: 100%; height: 190px; object-fit: contain" />
				<div style="display: flex; align-items: baseline; justify-content: space-between">
					<span style="font-size: 11px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: ${i === 8 ? D.bg : D.ink}">${String(i + 1).padStart(2, '0')}</span>
					<span style="font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: ${i === 8 ? D.bg : D.dim}; text-align: right">${b.bigName}</span>
				</div>
			</div>`
		)
		.join('');
	return `
	<div style="border-bottom: 3px solid ${D.ink}">
		<div style="display: flex; align-items: center; justify-content: space-between; padding: 30px 40px">
			<h2 style="margin: 0; font-family: ${anton}; font-size: 92px; line-height: 0.85; text-transform: uppercase; color: ${D.ink}">The contact sheet</h2>
			${dLabel('All 21 · one per plate', D.dim)}
		</div>
		<div style="display: grid; grid-template-columns: repeat(7, 1fr); border-top: 3px solid ${D.ink}; border-left: 2px solid ${D.ink}">${cells}</div>
	</div>`;
};

const dropRarity = () => `
	<div style="border-bottom: 3px solid ${D.ink}">
		<div style="padding: 34px 40px 22px">
			<h2 style="margin: 0; font-family: ${anton}; font-size: 92px; line-height: 0.85; text-transform: uppercase; color: ${D.ink}">Fewer birds,<br />fewer cards</h2>
		</div>
		${TIERS.map((t, i) => {
			const last = i === 4;
			return `<div style="display: flex; align-items: center; gap: 0; padding: 0 40px; border-top: 2px solid ${D.ink}; background: ${last ? D.ink : 'transparent'}; color: ${last ? D.bg : D.ink}">
			<span style="width: 150px; font-family: ${anton}; font-size: 76px; line-height: 1.25">${ROMAN[i]}</span>
			<span style="flex: 1">${starRow(t.n, last ? D.bg : D.ink, last ? 'rgba(5,5,5,0.3)' : D.rule, 13, 5)}</span>
			<span style="width: 320px; text-align: right; font-family: ${anton}; font-size: 60px">${t.physical.toLocaleString('en-US')}</span>
			<span style="width: 110px; text-align: right">${dLabel('physical', last ? 'rgba(5,5,5,0.6)' : D.dim, 11)}</span>
			<span style="width: 150px; text-align: right; font-family: ${anton}; font-size: 60px">${t.digital}</span>
			<span style="width: 100px; text-align: right">${dLabel('digital', last ? 'rgba(5,5,5,0.6)' : D.dim, 11)}</span>
		</div>`;
		}).join('')}
	</div>`;

const dropDrop = () => `
	<div style="display: flex; border-bottom: 3px solid ${D.ink}">
		<div style="width: 620px; flex-shrink: 0; padding: 48px 40px; background: ${D.ink}; color: ${D.bg}">
			${dLabel('Next drop · new idea', 'rgba(5,5,5,0.6)')}
			<h2 style="margin: 16px 0 0; font-family: ${anton}; font-size: 78px; line-height: 0.86; text-transform: uppercase">Be first when new birds hatch</h2>
			<div style="display: flex; align-items: stretch; margin-top: 28px; border: 3px solid ${D.bg}">
				<span style="flex: 1; padding: 16px 20px; font-size: 15px; color: rgba(5,5,5,0.45)">you@example.com</span>
				<span style="display: inline-flex; align-items: center; padding: 16px 26px; background: ${D.bg}; color: ${D.ink}; font-size: 13px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase">Notify me</span>
			</div>
		</div>
		<div style="flex: 1; padding: 48px 40px; display: flex; flex-direction: column; justify-content: center; gap: 22px">
			<div style="display: flex; align-items: flex-end; gap: 26px">
				${[['04', 'days'], ['12', 'hrs'], ['36', 'min']]
					.map(
						([v, l]) => `<div><div style="font-family: ${anton}; font-size: 128px; line-height: 0.82; color: ${D.ink}">${v}</div><div style="margin-top: 10px">${dLabel(l, D.dim, 11)}</div></div>`
					)
					.join('')}
			</div>
			<div style="height: 8px; background: {{accent}}; width: 420px"></div>
			${dLabel('Sample countdown — no drop is scheduled yet', D.dim, 11)}
		</div>
	</div>`;

const dropClose = () => `
	<div style="position: relative; overflow: hidden; padding: 60px 40px 50px">
		<h2 style="margin: 0; font-family: ${anton}; font-size: 168px; line-height: 0.82; text-transform: uppercase; color: ${D.ink}; white-space: nowrap">The whole flock<br />is waiting</h2>
		<img src="bird-loggerhead-shrike.webp" alt="Loggerhead Shrike illustration" style="position: absolute; right: -30px; top: 30px; width: 400px; height: auto" />
		<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 42px; padding-top: 26px; border-top: 3px solid ${D.ink}">
			<div style="display: flex; align-items: center; gap: 0">
				<a href="#" style="display: inline-flex; padding: 20px 40px; background: ${D.ink}; color: ${D.bg}; font-size: 14px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase">Browse all cards</a>
				<a href="#" style="display: inline-flex; padding: 20px 34px; border: 2px solid ${D.ink}; color: ${D.ink}; font-size: 14px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase">Suggest a bird</a>
			</div>
			<div style="display: flex; align-items: center; gap: 22px">
				<div style="display: flex; gap: 18px; color: ${D.ink}">${igIcon}${twIcon}${osIcon}</div>
				${dLabel('© 2026 Birdables', D.dim, 11)}
			</div>
		</div>
	</div>`;

const DROP_H = 4720;
const drop = page({
	bg: D.bg,
	ink: D.ink,
	googleFonts: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&display=swap">`,
	script: script(DROP_H),
	body: `<div style="width: 1440px; background: ${D.bg}; color: ${D.ink}">
${dropNav()}${dropHero()}${dropSheet()}${dropRarity()}${dropDrop()}${dropClose()}
</div>`
});

/* ============================================================= */
/* DIRECTION C — VITRINE                                          */
/* ============================================================= */
// Brass is the tweakable colour on this direction, so it rides the {{accent}} hole.
// The two hairline gradients keep a literal, since a hole inside a gradient is riskier.
const BRASS = '#C9A227';
const V = { bg: '#060E0C', case: '#0B1613', ink: '#F0EAD9', dim: 'rgba(240,234,217,0.62)', faint: 'rgba(240,234,217,0.36)', brass: '{{accent}}', rule: 'rgba(201,162,39,0.34)' };
const cormorant = `'Cormorant Garamond', 'Times New Roman', Georgia, serif`;
const vCaps = (text, color = V.faint, size = 10) =>
	`<span style="font-size: ${size}px; font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase; color: ${color}">${text}</span>`;
const bracket = (pos) => {
	const [v, h] = pos.split('-');
	return `<span style="position: absolute; ${v}: 14px; ${h}: 14px; width: 22px; height: 22px; border-${v}: 1px solid ${V.brass}; border-${h}: 1px solid ${V.brass}"></span>`;
};

const vitrineNav = () => `
	<div style="padding: 26px 56px">
		<div style="display: flex; align-items: center; justify-content: space-between">
			<div style="display: flex; align-items: center; gap: 26px">${vCaps('Cards', V.dim)}${vCaps('About', V.dim)}${vCaps('Blog', V.dim)}</div>
			${logoDark(168, 27)}
			<div style="display: flex; align-items: center; gap: 22px">${vCaps('Case 01', V.brass)}<div style="display: flex; gap: 16px; color: ${V.dim}">${igIcon}${twIcon}${osIcon}</div></div>
		</div>
		<div style="height: 1px; background: linear-gradient(to right, transparent, ${BRASS}, transparent); margin-top: 22px; opacity: 0.6"></div>
	</div>`;

const vitrineHero = () => `
	<div style="display: flex; align-items: center; gap: 56px; padding: 44px 56px 64px">
		<div style="width: 520px; flex-shrink: 0">
			${vCaps('A small museum of birds', V.brass)}
			<h1 style="margin: 22px 0 0; font-family: ${cormorant}; font-size: 104px; line-height: 0.9; font-weight: 300; letter-spacing: -0.02em; color: ${V.ink}">Under<br />glass.</h1>
			<p style="margin: 24px 0 0; font-family: ${cormorant}; font-style: italic; font-size: 27px; line-height: 1.25; color: ${V.dim}">Because birds are fly.</p>
			<p style="margin: 26px 0 0; max-width: 430px; font-size: 15px; line-height: 1.75; color: ${V.dim}">Twenty-one birds, illustrated and numbered, printed on 100% recycled paper in Charleston. Every card is catalogued, graded for rarity, and carries a code that opens its full record.</p>
			<div style="display: flex; align-items: center; gap: 20px; margin-top: 34px">
				<a href="#" style="display: inline-flex; align-items: center; padding: 16px 32px; background: ${V.brass}; color: ${V.bg}; font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase">Enter the collection</a>
				<a href="#" style="font-family: ${cormorant}; font-style: italic; font-size: 20px; color: ${V.ink}; border-bottom: 1px solid ${V.rule}">The catalogue</a>
			</div>
		</div>
		<div style="position: relative; flex: 1; height: 660px; border-radius: 4px; background: radial-gradient(ellipse at 50% 12%, rgba(240,234,217,0.14), rgba(6,14,12,0) 62%), ${V.case}; background-image: ${noise(0.06)}; border: 1px solid ${V.rule}; box-shadow: inset 0 1px 0 rgba(240,234,217,0.12), inset 0 -40px 90px rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; perspective: 1700px; overflow: hidden">
			${bracket('top-left')}${bracket('top-right')}${bracket('bottom-left')}${bracket('bottom-right')}
			<div style="position: relative; top: -26px">${deck({ w: 320, h: 448 })}</div>
			<span style="position: absolute; left: 50%; bottom: 128px; transform: translateX(-50%); width: 420px; height: 1px; background: linear-gradient(to right, transparent, ${BRASS}, transparent); opacity: 0.5"></span>
			<div style="position: absolute; left: 50%; bottom: 52px; transform: translateX(-50%); text-align: center; padding: 14px 30px; border: 1px solid ${V.rule}">
				<div style="font-family: ${cormorant}; font-style: italic; font-size: 20px; color: ${V.ink}">Pelecanus occidentalis</div>
				<div style="margin-top: 6px">${vCaps('Case 01 · Edition 01 · 1 of 2,000', V.faint)}</div>
			</div>
		</div>
	</div>`;

const slab = (b, cert) => `
			<div style="display: flex; flex-direction: column; background: ${V.case}; border: 1px solid ${V.rule}; box-shadow: inset 0 1px 0 rgba(240,234,217,0.1)">
				<div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid ${V.rule}">
					${vCaps(`No. ${cert}`, V.brass, 9)}
					${starRow(b.rarity, V.brass, V.rule, 7, 2)}
				</div>
				<div style="padding: 22px 18px; display: flex; justify-content: center; background: radial-gradient(ellipse at 50% 0%, rgba(240,234,217,0.08), rgba(0,0,0,0) 70%)">
					<img src="${b.slug}_thumb.jpg" alt="${b.birdName} card" style="width: 150px; height: 210px; object-fit: contain; filter: drop-shadow(0 10px 18px rgba(0,0,0,0.6))" />
				</div>
				<div style="padding: 12px 14px 16px; border-top: 1px solid ${V.rule}; text-align: center">
					<div style="font-family: ${cormorant}; font-size: 21px; color: ${V.ink}">${b.birdName}</div>
					<div style="margin-top: 4px">${vCaps(b.conservationStatus, V.faint, 9)}</div>
				</div>
			</div>`;

const vitrineCases = () => `
	<div style="padding: 62px 56px; border-top: 1px solid ${V.rule}">
		<div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 34px">
			<h2 style="margin: 0; font-family: ${cormorant}; font-size: 62px; line-height: 0.96; font-weight: 300; color: ${V.ink}">The cases</h2>
			${vCaps('Six of twenty-one on display', V.faint)}
		</div>
		<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 18px">
			${birds.slice(0, 6).map((b, i) => slab(b, `21-${String(i + 1).padStart(3, '0')}`)).join('')}
		</div>
	</div>`;

const vitrineLedger = () => {
	const seen = [0, 2, 5, 6, 9, 11, 14, 17, 19];
	const rows = (list, start) =>
		`<div style="flex: 1">${list
			.map((b, i) => {
				const got = seen.includes(start + i);
				return `<div style="display: flex; align-items: baseline; gap: 14px; padding: 12px 0; border-bottom: 1px solid ${V.rule}">
					<span style="width: 22px; font-size: 10px; letter-spacing: 0.1em; color: ${V.faint}; font-variant-numeric: tabular-nums">${String(start + i + 1).padStart(2, '0')}</span>
					<span style="flex: 1; font-family: ${cormorant}; font-size: 20px; color: ${got ? V.ink : V.faint}">${b.birdName}</span>
					${got ? `<span style="font-family: ${cormorant}; font-style: italic; font-size: 16px; color: ${V.brass}">seen</span>` : `<span style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: ${V.faint}">—</span>`}
				</div>`;
			})
			.join('')}</div>`;
	return `
	<div style="display: flex; gap: 56px; padding: 62px 56px; border-top: 1px solid ${V.rule}">
		<div style="width: 400px; flex-shrink: 0">
			${vCaps('The ledger · new idea', V.brass)}
			<h2 style="margin: 20px 0 0; font-family: ${cormorant}; font-size: 58px; line-height: 0.96; font-weight: 300; color: ${V.ink}">Owning it is<br />half of it.</h2>
			<p style="margin: 22px 0 0; font-size: 15px; line-height: 1.75; color: ${V.dim}">The other half is standing in a field at dawn. Mark the birds you have actually seen — pull the list from eBird and the ledger fills itself in.</p>
			<div style="margin-top: 28px; padding: 20px 24px; border: 1px solid ${V.rule}">
				<div style="font-family: ${cormorant}; font-size: 44px; line-height: 1; color: ${V.brass}">9 <span style="font-size: 20px; color: ${V.dim}">of 21 seen</span></div>
				<div style="margin-top: 12px">${vCaps('Sample progress', V.faint, 9)}</div>
			</div>
		</div>
		<div style="flex: 1; display: flex; gap: 44px">${rows(birds.slice(0, 11), 0)}${rows(birds.slice(11, 21), 11)}</div>
	</div>`;
};

const vitrineScale = () => `
	<div style="padding: 62px 56px; border-top: 1px solid ${V.rule}">
		<div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 30px">
			<h2 style="margin: 0; font-family: ${cormorant}; font-size: 62px; line-height: 0.96; font-weight: 300; color: ${V.ink}">The scale</h2>
			<p style="margin: 0; max-width: 420px; font-size: 14px; line-height: 1.7; color: ${V.dim}; text-align: right">Conservation status, likeliness of a sighting, and the Birdables Scale of Majesticness.</p>
		</div>
		<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px">
			${TIERS.map(
				(t, i) => `<div style="padding: 26px 22px; border: 1px solid ${V.rule}; background: ${i === 4 ? 'rgba(201,162,39,0.09)' : 'transparent'}; display: flex; flex-direction: column; gap: 14px">
				<div style="font-family: ${cormorant}; font-size: 46px; line-height: 1; color: ${i === 4 ? V.brass : V.ink}">${ROMAN[i]}</div>
				${starRow(t.n, i === 4 ? V.brass : V.ink, V.rule, 8, 3)}
				<div style="height: 1px; background: ${V.rule}"></div>
				<div><div style="font-family: ${cormorant}; font-size: 30px; color: ${V.ink}; font-variant-numeric: tabular-nums">${t.physical.toLocaleString('en-US')}</div>${vCaps('physical', V.faint, 9)}</div>
				<div><div style="font-family: ${cormorant}; font-size: 22px; color: ${V.dim}; font-variant-numeric: tabular-nums">${t.digital}</div>${vCaps('digital', V.faint, 9)}</div>
			</div>`
			).join('')}
		</div>
	</div>`;

const vitrineClose = () => `
	<div style="padding: 70px 56px; border-top: 1px solid ${V.rule}; text-align: center">
		<img src="bird-roseate-spoonbill.webp" alt="Roseate Spoonbill illustration" style="width: 250px; height: auto; display: block; margin: 0 auto 26px" />
		<h2 style="margin: 0; font-family: ${cormorant}; font-size: 72px; line-height: 0.98; font-weight: 300; color: ${V.ink}">The whole flock is waiting.</h2>
		<div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 32px">
			<a href="#" style="display: inline-flex; padding: 16px 34px; background: ${V.brass}; color: ${V.bg}; font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase">Browse all cards</a>
			<a href="#" style="font-family: ${cormorant}; font-style: italic; font-size: 20px; color: ${V.ink}; border-bottom: 1px solid ${V.rule}">Suggest a bird</a>
		</div>
		<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 56px; padding-top: 22px; border-top: 1px solid ${V.rule}">
			${vCaps('© 2026 Birdables · Charleston, S.C.', V.faint, 9)}
			${vCaps('No trees were harmed', V.faint, 9)}
		</div>
	</div>`;

const VITRINE_H = 4180;
const vitrine = page({
	bg: V.bg,
	ink: V.ink,
	googleFonts: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&display=swap">`,
	script: script(VITRINE_H, '#C9A227'),
	body: `<div style="width: 1440px; background: ${V.bg}; background-image: ${noise(0.05)}; color: ${V.ink}">
${vitrineNav()}${vitrineHero()}${vitrineCases()}${vitrineLedger()}${vitrineScale()}${vitrineClose()}
</div>`
});

/* ---------- write ---------- */
writeFileSync(join(OUT, 'Plate.dc.html'), plate);
writeFileSync(join(OUT, 'Drop.dc.html'), drop);
writeFileSync(join(OUT, 'Vitrine.dc.html'), vitrine);

const BASE_H = 13600;
const canvas = {
	pages: [
		{ id: 'page-1', name: 'Bolder directions' },
		{ id: 'page-2', name: 'Previous version' }
	],
	artboards: [
		{ file: 'Plate.dc.html', page: 'page-1', x: 0, y: 0, w: 1440, h: PLATE_H, title: 'A — Plate · engraved specimen', print: 'flow' },
		{ file: 'Drop.dc.html', page: 'page-1', x: 1600, y: 0, w: 1440, h: DROP_H, title: 'B — Drop · brutalist poster', print: 'flow' },
		{ file: 'Vitrine.dc.html', page: 'page-1', x: 3200, y: 0, w: 1440, h: VITRINE_H, title: 'C — Vitrine · collector’s case', print: 'flow' },
		{ file: 'Main.dc.html', page: 'page-2', x: 0, y: 0, w: 1440, h: BASE_H, title: 'Previous — dark', print: 'flow' },
		{ file: 'Light.dc.html', page: 'page-2', x: 1660, y: 0, w: 1440, h: BASE_H, title: 'Previous — light', print: 'flow' }
	],
	annotations: [
		{
			id: 'dir-plate',
			page: 'page-1',
			x: 0,
			y: -250,
			w: 480,
			text: 'A — PLATE\nAn engraved specimen plate. Ink black, bone, a Caslon serif, and hairline rules everywhere: ruled columns, a numbered index of all 21 birds as type rather than a card grid, marginalia.\nWild through DENSITY rather than volume. Orange survives only on the rarity dots and two labels.'
		},
		{
			id: 'dir-drop',
			page: 'page-1',
			x: 1600,
			y: -250,
			w: 480,
			text: 'B — DROP\nA brutalist poster: true black, Anton at 232px running edge to edge, zero rounded corners, 2–3px white rules, hard offset shadows instead of soft blur. The contact sheet is a gapless 7×3 grid with one cell inverted.\nWild through SCALE. Orange is exactly three marks on the whole page.'
		},
		{
			id: 'dir-vitrine',
			page: 'page-1',
			x: 3200,
			y: -250,
			w: 480,
			text: 'C — VITRINE\nA collector’s case. Near-black green, brass hairlines, Cormorant, cards in graded slabs with certificate numbers, a lit case with bevels and a ledger of what you have actually seen.\nWild through TEXTURE and metaphor. Brass replaces orange as the metal; orange does not appear.'
		},
		{
			id: 'previous',
			page: 'page-2',
			x: 0,
			y: -190,
			w: 520,
			text: 'The previous version, kept for comparison. The section ideas carry over into all three directions above — what changed is the foundation, not the content.'
		}
	],
	launch: { view: 'canvas', page: 'page-1' }
};
writeFileSync(join(OUT, 'canvas.json'), JSON.stringify(canvas, null, 2));
console.log(`wrote Plate (${PLATE_H}px), Drop (${DROP_H}px), Vitrine (${VITRINE_H}px) + canvas.json`);
