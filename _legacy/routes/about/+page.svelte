<script>
	import { asset } from '$app/paths';
	import SEO from 'svelte-seo';
	import site from '#lib/info.js';
	import { scrollToSection } from '#lib/utils.js';
	import FAQ from '#lib/components/FAQ.svelte';
	import Breadcrumb from '#lib/components/Breadcrumb.svelte';
	import CardAnatomy from '#lib/components/CardAnatomy.svelte';
	import Rarity from '#lib/components/Rarity.svelte';
	import ExternalLink from '#lib/components/ExternalLink.svelte';

	let sections = [
		{ link: 'anatomy-of-card', title: 'The Anatomy of a Card' },
		{ link: 'rarity', title: 'The Card Rarity Scale' },
		{
			link: 'physical-vs-digital-cards',
			title: 'Physical -vs- Digital cards'
		},
		{
			link: 'faq',
			title: 'Frequently Asked Questions'
		}
	];
</script>

<SEO
	title={`About ${site.name} | Physical & NFT Bird Collectable Cards`}
	description={`${site.name} are artistic collectible trading cards, available as NFTs and as physical prints. Sustainably produced with a goal of giving back.`}
	keywords={`Bird Collectable Cards, Bird Trading Cards, ${site.name}, Bird NFT's`}
	openGraph={{
		title: `About ${site.name} | Physical & Digital Bird Collectable Cards`,
		description: `${site.name} are artistic collectible trading cards, available as NFTs and as physical prints. Sustainably produced with a goal of giving back.`,
		url: `${site.address}/`,
		type: `website`,
		images: [
			{
				url: `${site.address}/images/opengraph/index.webp`,
				width: 1200,
				height: 627,
				alt: `${site.name} Collectable Cards and NFT's`
			}
		]
	}}
	twitter={{
		site: `@${site.twitterHandle}`,
		title: `${site.name} | Physical & NFT Bird Collectable Cards`,
		description: `${site.name} are artistic collectible trading cards, available as NFTs and as physical prints. Sustainably produced with a goal of giving back.`,
		image: `${site.address}/images/opengraph/index.webp`,
		imageAlt: `${site.name}`
	}}
	jsonLd={{
		logo: `${site.address}/images/logo.svg`,
		'@context': 'http://schema.org',
		'@type': 'WebSite',
		name: `${site.name}`,
		url: `${site.address}`
	}}
/>

<nav
	class="hidden lg:block z-10 fixed right-0 bottom-4 rounded-tl-2xl rounded-bl-2xl bg-white drop-shadow-card overflow-hidden"
>
	<span
		class="text-base font-black text-gray-600 flex items-center space-x-2 border-b border-gray-900/10 py-3 px-6"
		>Navigate to:</span
	>
	{#each sections as section (section.link)}
		<a
			onclick={(e) => {
				scrollToSection(section.link, e);
			}}
			href={`#${section.link}`}
			class="text-xs font-semibold text-gray-600 flex items-center space-x-2 border-b border-gray-900/10 py-3 px-6 transition hover:bg-gray-blue"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class=""
				viewBox="0 0 24 24"
				width="20"
				height="20"
			>
				<path fill="none" d="M0 0h24v24H0z"></path>

				<path
					fill="currentColor"
					d="M12.172 12L9.343 9.172l1.414-1.415L15 12l-4.243 4.243-1.414-1.415z"
				></path>
			</svg>

			<span>{section['title']}</span>
		</a>
	{/each}
</nav>

<div class="relative bg-white border-t border-t-gray-100 md:pb-24">
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<Breadcrumb current="About Birdables" />
		<h1
			class="pt-8 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tighter lg:text-6xl"
		>
			All About Birdables
		</h1>
		<div class="mt-6 text-gray-500 space-y-6">
			<p class="prose prose-xl text-gray-500">
				There's more to Birdables than beautiful cards. The reality is that thousands of bird
				species are currently at risk due to habitat loss, climate change, and other human-related
				factors. Even birds many people think of as common sightings may be rarer than you think. At
				Birdables, our mission is to raise awareness and appreciation for birds, and to hopefully
				make a difference by donating to conservation efforts in the process.
			</p>
			<div>
				{#each sections as section (section.link)}
					<div class="mt-6">
						<a
							onclick={(e) => {
								scrollToSection(section.link, e);
							}}
							href={`#${section.link}`}
							class="text-xl font-semibold text-gray-600 border-b-2 border-gray-900/10 pb-2 transition hover:border-gray-900"
						>
							{section['title']} 
							<span aria-hidden="true">→</span>
						</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<img
		class="block pt-10 md:pt:0 md:absolute md:bottom-0 md:left-[calc(50vw+100px)] md:max-h-full md:w-[calc(100vw-415px)] md:max-w-[725px] md:object-contain"
		src={asset(`images/Yellow-Warbler-About.webp`)}
		alt="Yellow Warbler Bird Illustration"
	/>
</div>

<div
	class="bg-gray-blue py-16 px-4 sm:px-6 lg:px-16 pt-8 border-t border-t-gray-100 sm:py-24"
	id={sections[0].link}
>
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<h2 class="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-5xl">
			{sections[0].title}
		</h2>
		<div class="mt-6 text-gray-500 space-y-6">
			<p class="prose prose-xl text-gray-500">
				Each Birdables card contains elements that reveal information about the bird or card.
			</p>
			<CardAnatomy />
		</div>
	</div>
</div>

<div
	class="bg-white py-16 px-4 sm:px-6 lg:px-16 pt-8 border-t border-t-gray-100 sm:py-24"
	id={sections[1].link}
>
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<h2 class="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-5xl">
			{sections[1].title}
		</h2>
		<div class="mt-8 grid grid-col-1 gap-12 lg:grid-cols-5 lg:gap-12">
			<div class="lg:col-span-3">
				<div class="prose text-gray-500 lg:max-w-none">
					<p>
						Each Birdables card has a rarity rating ranging from <span
							class="inline-flex px-1 space-x-2 items-baseline"
						>
							<Rarity size="sm" stars="1" hideExplainer={true} /><span> to </span><Rarity
								size="sm"
								stars="5"
								hideExplainer={true}
							/></span
						>. The rarity of cards will dictate how many physical cards are ever printed and how
						many digital cards are minted. For example, no more than fifty 1st-edition California
						Condor cards will ever be printed. Determining the rarity is based on a secret blend of
						three properties:
					</p>
					<ol>
						<li>
							<span>
								The bird's <ExternalLink href="https://en.wikipedia.org/wiki/Conservation_status"
									>conservation status</ExternalLink
								>
							</span>
						</li>
						<li>The bird's Likeliness of being spotted in the wild</li>
						<li>The "Birdables Scale of Majesticness"</li>
					</ol>
					<h2 id="rarity-table">Quantity of cards released per rarity:</h2>
				</div>
				<div class="overflow-hidden mt-8 border border-gray-blue rounded-lg sm:rounded-2xl">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-blue">
							<tr>
								<th
									scope="col"
									class="px-1 sm:px-3 py-3 text-center text-xs sm:text-base font-extrabold tracking-tight text-gray-500"
								>
									Rarity
								</th>
								<th
									scope="col"
									class="px-1 sm:px-3 py-3 text-center text-xs sm:text-base font-extrabold tracking-tight text-gray-500"
								>
									Digital copies
								</th>
								<th
									scope="col"
									class="px-1 sm:px-3 py-3 text-center text-xs sm:text-base font-extrabold tracking-tight text-gray-500"
								>
									Physical copies
								</th>
							</tr>
						</thead>
						<tbody>
							<tr class="bg-white">
								<td
									class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
								>
									<div class="flex justify-center">
										<Rarity size="sm" stars="1" hideExplainer={true} />
									</div>
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									50
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									2000
								</td>
							</tr>
							<tr class="bg-gray-blue">
								<td
									class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
								>
									<div class="flex justify-center">
										<Rarity size="sm" stars="2" hideExplainer={true} />
									</div>
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									25
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									1500
								</td>
							</tr>
							<tr class="bg-white">
								<td
									class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
								>
									<div class="flex justify-center">
										<Rarity size="sm" stars="3" hideExplainer={true} />
									</div>
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									10
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									800
								</td>
							</tr>
							<tr class="bg-gray-blue">
								<td
									class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
								>
									<div class="flex justify-center">
										<Rarity size="sm" stars="4" hideExplainer={true} />
									</div>
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									5
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									200
								</td>
							</tr>
							<tr class="bg-white">
								<td
									class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
								>
									<div class="flex justify-center">
										<Rarity size="sm" stars="5" hideExplainer={true} />
									</div>
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									1
								</td>
								<td class="text-center px-1 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-500">
									50
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="lg:col-span-2">
				<img
					src={asset(`images/rarity.webp`)}
					alt="Roseate Spoonbill"
					class="w-full h-full object-center object-contain group-hover:opacity-75"
				/>
			</div>
		</div>
	</div>
</div>

<div
	class="bg-gray-blue py-16 px-4 sm:px-6 lg:px-16 pt-8 border-t border-t-gray-100 sm:py-24"
	id={sections[2].link}
>
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<h2 class="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-5xl">
			{sections[2].title}
		</h2>
		<div class="mt-6 text-gray-500 space-y-6">
			<p class="prose prose-xl text-gray-500">
				Each Birdables card has a physical and digital version. The <strong>physical card</strong>
				is just like your typical sports collectable or Pokemon card. The
				<strong>digital card</strong> is an NFT.
			</p>
		</div>
		<div class="mt-8 lg:grid lg:grid-cols-2 lg:gap-6">
			<div>
				<div class="prose text-gray-500 lg:max-w-none">
					<h3>Physical Cards</h3>
					<p>
						So that they will fit in your existing card sleeves or covers, each card is the standard
						trading/collectable card size of 6.4cm (2.5 in) x 8.9cm (3.5 in).
					</p>
					<p>
						The cards are printed on 100% recycled paper right down the road from where they are
						designed and shipped from in Charleston, SC. We keep everything as local as possible to
						reduce the emissions emitted.
					</p>
					<p>Physical cards are no longer available for purchase.</p>
				</div>
			</div>
			<div>
				<div class="mt-6 prose text-gray-500 lg:mt-0">
					<h3>Digital Cards (NFT)</h3>
					<p>
						If you aren't familiar with digital assets or NFT's (<ExternalLink
							href="https://www.theverge.com/22310188/nft-explainer-what-is-blockchain-crypto-art-faq"
							>Non-Fungible Tokens</ExternalLink
						>), you may not understand the point or purpose of a digital cards, but you're in for a
						treat.
					</p>
					<p>
						Digital cards have an indefinite lifespan in your digital wallet, so you'll never need
						to worry about losing or getting your digital card dirty. The possibilities of how your
						digital card could be displayed or used in games/applications now and in the future are
						endless.
					</p>
					<p>
						Digiatl cards can be purchased securely from <ExternalLink
							href="https://opensea.io/collection/birdables"
							>Birdables' OpenSea Storefront</ExternalLink
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<FAQ title={sections[3].title} id={sections[3].link} />
