<script>
	import { asset } from '$app/paths';
	import SEO from 'svelte-seo';
	import IntersectionObserver from 'svelte-intersection-observer';

	import { resolve } from '$app/paths';
	import site from '#lib/info.js';
	import CallToAction from '#lib/components/CallToAction.svelte';

	let { data } = $props();
	let { cards } = data;

	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	let ready = $state(false);
	onMount(() => ready = true);

	let element = $state();
	let intersecting = $state(false);
	let element2 = $state();
	let intersecting2 = $state(false);
	// let element3;
	// let intersecting3;
	let element4 = $state();
	let intersecting4 = $state(false);
</script>

<SEO
	title={`${site.name} | Physical & NFT Bird Collectable Cards`}
	description={`${site.name} ${site.name} are artistic collectible trading cards, available as NFTs and as physical prints. Sustainably produced with a goal of giving back.`}
	keywords={`Bird Collectable Cards, Bird Trading Cards, ${site.name}, Bird NFT's`}
	openGraph={{
		title: `${site.name} | Physical & Digital Bird Collectable Cards`,
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
		imageAlt: `${site.name}!`
	}}
	jsonLd={{
		logo: `${site.address}/images/logo.svg`,
		'@type': `WebSite`,
		name: `${site.name}`,
		url: `${site.address}`
	}}
/>

<main class="">
	<!-- Hero card -->
	<div class="relative">
		<div class="mx-auto sm:px-6 lg:px-8">
			<div class="relative sm:rounded-2xl bg-gray-blue">
				{#if ready}
					<img
						class="hero-bird bird-1 absolute h-full w-auto hidden lg:block"
						src="/images/Sandhill_Crane.webp"
						alt="Sandhill Crane"
						width="377"
						height="602"
						in:fly={{ x: -100, duration: 1000, delay: 250 }}
					/>
				{/if}

				<div class="z-10 px-4 pt-16 sm:px-12 sm:pt-24 lg:pt-32 lg:px-8">
					<span
						class="text-center sm:text-left lg:text-center block text-gray-900 text-4xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
						>Collectable Bird Cards!
					</span>
					<p
						class="mt-6 lg:mx-auto text-center sm:text-left lg:text-center font-light text-2xl italic text-gray-900 text-opacity-50"
					>Because birds are fly.</p>

					<div
						class="mt-10 flex justify-center sm:justify-start lg:justify-center"
					>
						<a
							data-sveltekit-preload-data
							href={resolve('cards')}
							class="flex items-center justify-center px-12 py-4 border border-transparent text-xl font-black rounded-full bg-gray-900 text-white transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-500 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500 sm:px-8"
						>
							Browse All Cards
						</a>
					</div>

					<img
						src="/images/cards/brown-pelican_01.webp"
						role="presentation"
						alt=""
						class="halfImageFiller opacity-0 pointer-events-none"
						width="751"
						height="1051"
					/>
				</div>
			</div>
			{#if ready}
				<img
					class="hero-bird bird-2 absolute w-auto h-full hidden sm:block"
					src="/images/Loggerhead_Shrike.webp"
					alt="Loggerhead Shrike"
					width="837"
					height="1187"
					in:fly={{ x: 100, duration: 1000, delay: 750 }}
				/>
			{/if}
		</div>

		<div class="absolute top-[-100px] left-0 bg-white h-[calc(100%+100px)] sm:w-6 lg:w-8"></div>
	</div>

	<!-- Cards -->
	<div class="px-4 sm:px-6 lg:px-16 2xl:px-32 relative z-20">
		<div class="-translate-y-1/2">
			<div class="cards relative h-full">
				{#if ready}
					<a
						href={resolve('/bird/[slug]', { slug: 'northern-cardinal' })}
						class="home-card card card-1 card-sm hidden sm:block transition"
						in:fly={{ x: 100, duration: 500, delay: 2500 }}
					>
						<div class="front w-full flex justify-center">
							<img
								src="/images/cards/northern-cardinal_01.webp"
								alt="Northern Cardinal Card - Edition 01"
								class="object-contain drop-shadow-card"
								width="751"
								height="1051"
							/>
						</div>
					</a>
				{/if}
				{#if ready}
					<a
						href={resolve('/bird/[slug]', { slug: 'osprey' })}
						data-sveltekit-preload-data
						class="home-card card card-2 card-md block transition"
						in:fly={{ x: 100, duration: 500, delay: 2000 }}
					>
						<div class="front w-full flex justify-center">
							<img
								src="/images/cards/osprey_01.webp"
								alt="Osprey Card - Edition 01"
								class="object-contain drop-shadow-card"
								width="751"
								height="1051"
							/>
						</div>
					</a>
				{/if}
				{#if ready}
					<a
						href={resolve('/bird/[slug]', { slug: 'brown-pelican' })}
						data-sveltekit-preload-data
						class="home-card card card-3 card-lg block transition"
						in:fade={{ duration: 500, delay: 1500 }}
					>
						<div class="front w-full flex justify-center">
							<img
								src="/images/cards/brown-pelican_01.webp"
								alt="Brown Pelican Card - Edition 01"
								class="object-contain drop-shadow-card"
								width="751"
								height="1051"
							/>
						</div>
					</a>
				{/if}
				{#if ready}
					<a
						href={resolve('/bird/[slug]', { slug: 'yellow-warbler' })}
						data-sveltekit-preload-data
						class="home-card card card-4 card-md block transition"
						in:fly={{ x: -100, duration: 500, delay: 2000 }}
					>
						<div class="front w-full flex justify-center">
							<img
								src="/images/cards/yellow-warbler_01.webp"
								alt="Yellow Warbler Card - Edition 01"
								class="object-contain drop-shadow-card"
								width="751"
								height="1051"
							/>
						</div>
					</a>
				{/if}
				{#if ready}
					<a
						href={resolve('/bird/[slug]', { slug: 'roseate-spoonbill' })}
						data-sveltekit-preload-data
						class="home-card card card-5 card-sm hidden sm:block transition"
						in:fly={{ x: -100, duration: 500, delay: 2500 }}
					>
						<div class="front w-full flex justify-center">
							<img
								src="/images/cards/roseate-spoonbill_01.webp"
								alt="Roseate Spoonbill Card - Edition 01"
								class="object-contain drop-shadow-card"
								width="751"
								height="1051"
							/>
						</div>
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!--This image is a placeholder that helps size the hero correctly. Maybe there is a better way to do this but, this works for now with no javascript.-->
	<img
		src="/images/cards/brown-pelican_01.webp"
		class="halfImageFiller opacity-0 pointer-events-none"
		aria-hidden="true"
		alt=""
		width="751"
		height="1051"
	/>
	<div class="px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
		<div class="lg:max-w-7xl mx-auto">
			<div class="relative">
				<div class="relative md:bg-white md:p-6 space-y-10 lg:space-y-0">
					<div class="grid gap-10 md:grid-cols-2 items-center">
						<div>
							<div class="prose prose-gray prose-lg text-gray-500 md:max-w-none">
								<h2 class="">What are Birdables?</h2>
								<p>
									Birdables are collectible trading cards, available as NFTs and as physical prints.
									With artistic yet realistic designs, a sustainable approach to production, and a
									distribution model that mirrors real bird populations in the wild - Birdables are
									a fun, future-friendly way to commemorate the birds you love.
								</p>
							</div>
							<div class="flex space-x-4 mt-8">
								<a
									href={resolve('cards')}
									data-sveltekit-preload-data
									class="block w-full py-4 px-6 text-center bg-gray-900 border border-transparent rounded-full shadow-lg text-lg font-semibold text-white transition sm:inline-block sm:w-auto hover:ring-3 hover:ring-offset-3 hover:ring-gray-500 focus:ring-3 focus:ring-offset-3 focus:ring-gray-500"
								>
									See the cards
								</a>
							</div>
						</div>
						<div>
							<IntersectionObserver
								element={element}
								bind:intersecting
								threshold={0.5}
								once
							/>

							<img
								bind:this={element}
								src={asset(`images/roseate-spoonbill-cutout.webp`)}
								alt="Roseate Spoonbill"
								class={`${
									intersecting
										? 'motion-safe:opacity-100 motion-safe:translate-x-0'
										: 'motion-safe:opacity-0 motion-safe:translate-x-1/3'
								} transition duration-1000 w-full h-full object-center object-contain group-hover:opacity-75`}
								width="606"
								height="613"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<CallToAction />

	<div class="px-4 sm:px-6 lg:px-8 bg-white pt-12">
		<div class="lg:max-w-7xl mx-auto">
			<div class="relative">
				<div class="relative md:bg-white md:p-6 space-y-10 lg:space-y-0">
					<div class="grid gap-10 md:grid-cols-2 md:items-center md:grid-flow-row-dense">
						<div class="md:col-span-1 md:col-start-2">
							<div class="prose prose-gray prose-lg text-gray-500 md:max-w-none">
								<h2 class="">Can my collection make a difference?</h2>
								<p>
									YES! <span class="font-black text-gray-900"
										>Birdables plans to donate a portion of profits</span
									>
									to bird conservation organizations like the
									<a href="https://www.birds.cornell.edu/" target="_blank" rel="noopener noreferrer"
										>Cornell Lab of Ornithology</a
									>,
									<a href="https://ebird.org/" target="_blank" rel="noopener noreferrer">eBird</a>,
									<a href="https://www.audubon.org/" target="_blank" rel="noopener noreferrer"
										>Audubon</a
									>, and others. As the business gets off the ground (pun intended), we'll share
									more details on our site, including donation amounts and recipients.
								</p>

								<p>
									<span class="font-black text-xl text-gray-900">We care about the fine print</span
									><br />To ensure Birdables is not contributing to the destruction of bird
									habitats, we only use
									<span class="font-black text-gray-900">100% recycled paper</span> for all physical
									cards. No trees are cut down for the creation of Birdables.
								</p>
							</div>
							<div class="flex space-x-4 mt-8">
								<a
									href={resolve('about')}
									data-sveltekit-preload-data
									class="block w-full py-4 px-6 text-center bg-gray-900 border border-transparent rounded-full shadow-lg text-lg font-semibold text-white transition hover:ring-3 hover:ring-offset-3 hover:ring-gray-500 focus:ring-3 focus:ring-offset-3 focus:ring-gray-500 sm:inline-block sm:w-auto"
								>
									Learn more: About Birdables
								</a>
							</div>
						</div>
						<div class="md:col-span-1 md:col-start-1 xl:-translate-y-20">
							<IntersectionObserver
								element={element2}
								bind:intersecting={intersecting2}
								threshold={0.5}
								once
							/>
							<img
								bind:this={element2}
								src={asset(`images/osprey-cutout.webp`)}
								alt="Osprey"
								class={`${
									intersecting2
										? 'motion-safe:opacity-100 motion-safe:translate-x-0'
										: 'motion-safe:opacity-0 motion-safe:-translate-x-1/3'
								} transition duration-1000 w-full h-full object-center object-contain group-hover:opacity-75`}
								width="603"
								height="745"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-gray-blue mt-10 lg:mt-0" id="BirdablesInTheWild">
		<div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
			<div class="px-4 flex items-center justify-between sm:px-6 lg:px-0">
				<div>
					<h2 class="text-3xl font-black">Birdables in the wild</h2>
					<p class="prose-xl text-gray-600">
						Share your Birdables pictures with <strong class="text-gray-900"
							>#BirdablesInTheWild</strong
						>!
					</p>
				</div>
				<a
					href="https://www.instagram.com/birdables_cards/"
					target="_blank"
					rel="noopener noreferrer"
					class="hidden md:block w-full py-4 px-6 text-center bg-gray-900 border border-transparent rounded-full shadow-lg text-lg font-semibold text-white transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-500 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500 sm:inline-block sm:w-auto"
				>
					View on Instagram
				</a>
			</div>

			<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 xl:gap-10">
				<a
					rel="external"
					class="w-full aspect-square rounded-lg overflow-hidden transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-900 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500"
					href={asset(`images/cards-on-grass.webp`)}
				>
					<img
						src={asset(`images/cards-on-grass.webp`)}
						alt="Person using a pen to cross a task off a productivity paper card."
						class="w-full h-full object-center object-cover group-hover:opacity-75"
						width="1400"
						height="1050"
					/></a
				>
				<a
					rel="external"
					class="w-full aspect-square rounded-lg overflow-hidden transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-900 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500"
					href={asset(`images/cards-in-bush.webp`)}
				>
					<img
						src={asset(`images/cards-in-bush.webp`)}
						alt="Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop."
						class="w-full h-full object-center object-cover group-hover:opacity-75"
						width="1400"
						height="1867"
					/></a
				>
				<a
					rel="external"
					class="w-full aspect-square rounded-lg overflow-hidden transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-900 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500"
					href={asset(`images/cards-on-feeder.webp`)}
				>
					<img
						src={asset(`images/cards-on-feeder.webp`)}
						alt="Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop."
						class="w-full h-full object-center object-cover group-hover:opacity-75"
						width="1200"
						height="1600"
					/></a
				>
				<a
					rel="external"
					class="w-full aspect-square rounded-lg overflow-hidden transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-900 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500"
					href={asset(`images/pileated-woodpecker-on-tree.webp`)}
				>
					<img
						src={asset(`images/pileated-woodpecker-on-tree.webp`)}
						alt="Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop."
						class="w-full h-full object-center object-cover group-hover:opacity-75"
						width="1400"
						height="1867"
					/></a
				>
				<a
					rel="external"
					class="w-full aspect-square rounded-lg overflow-hidden transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-900 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500"
					href={asset(`images/cedar-waxwing-in-bush.webp`)}
				>
					<img
						src={asset(`images/cedar-waxwing-in-bush.webp`)}
						alt="Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop."
						class="w-full h-full object-center object-cover group-hover:opacity-75"
						width="1400"
						height="1867"
					/></a
				>
				<a
					rel="external"
					class="w-full aspect-square rounded-lg overflow-hidden transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-900 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500"
					href={asset(`images/cards-on-shirt.webp`)}
				>
					<img
						src={asset(`images/cards-on-shirt.webp`)}
						alt="Paper card sitting upright in walnut card holder on desk."
						class="w-full h-full object-center object-cover group-hover:opacity-75"
						width="1400"
						height="1867"
					/></a
				>
				<div class="col-span-2 flex justify-center">
					<a
						href="https://www.instagram.com/birdables_cards/"
						target="_blank"
						rel="noopener noreferrer"
						class="block mt-6 w-full py-4 px-6 text-center bg-gray-900 border border-transparent rounded-full shadow-lg text-lg font-semibold text-white transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-500 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500 sm:inline-block sm:w-auto"
					>
						Instagram
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="relative py-16 bg-white">
		<div class="max-w-7xl mx-auto md:px-8">
			<div class="grid md:grid-cols-12">
				<div
					class="relative z-10 mt-12 md:mt-0 md:col-start-1 md:row-start-1 md:col-span-4 md:py-16 md:bg-transparent"
				>
					<div class="max-w-md mx-auto px-4 sm:max-w-3xl sm:px-6 md:max-w-none md:p-0">
						<div class="">
							<IntersectionObserver
								element={element4}
								bind:intersecting={intersecting4}
								threshold={0.5}
								once
							/>
							<img
								bind:this={element4}
								class={`${
									intersecting4
									? 'motion-safe:opacity-100 motion-safe:cale-100'
									: 'motion-safe:opacity-0 motion-safe:scale-90'} transition duration-1000 object-cover object-center drop-shadow-card`}
								src={asset(`images/pool-flamingo_01.webp`)}
								alt="Pool Flamingo Card"
								width="1426"
								height="1996"
							/>
						</div>
					</div>
				</div>

				<div
					class="relative row-start-1 bg-gray-blue md:col-start-3 bg-cover md:row-start-1 md:col-span-10 md:rounded-3xl md:grid md:grid-cols-10 md:items-center"
					style={`background-image: url(${asset('images/pool-flamingo-bg.jpg')});`}
				>
					<div
						class="relative max-w-md mx-auto py-12 px-4 space-y-6 sm:max-w-3xl sm:py-16 sm:px-6 md:max-w-none md:p-0 md:col-start-4 md:col-span-6"
					>
						<h2 class="text-3xl font-extrabold">Suggest a bird!</h2>
						<p class="text-lg text-gray-500">
							Which Birdables are you looking for? Our goal is to build collections that spark joy,
							so let us know what you'd like us to add next!
						</p>
						<button
							disabled
							class="opacity-70 cursor-not-allowed block w-full py-4 px-6 text-center bg-gray-900 border border-transparent rounded-full shadow-lg text-lg font-semibold text-white transition hover:ring-3 hover:ring-offset-3 hover:ring-offset-gray-blue hover:ring-gray-500 focus:ring-3 focus:ring-offset-3 focus:ring-offset-gray-blue focus:ring-gray-500 sm:inline-block sm:w-auto"
							href="/">( Coming soonish )</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

{#each cards as card (card.slug)}
	<a data-sveltekit-preload-data class="hidden" href={resolve('/bird/[slug]', { slug: card.slug })}>{card.birdName}</a>
{/each}
{#each cards as card (card.id)}
	<a data-sveltekit-preload-data class="hidden" href={resolve('/card/[id]', { id: card.id })}>{card.birdName}</a>
{/each}

<style lang="postcss">
	.cards {
		perspective: 1000px;
	}

	:global(.show-animation .home-card) {
		animation: birdFadeIn 1s ease forwards;
		opacity: 0;
		transform: rotateX(45deg);
	}

	@media (prefers-reduced-motion) {
		:global(.show-animation .home-card) {
			animation: birdFadeIn 0s ease forwards 0;
		}
	}

	.card {
		--cardAdder: 0%;
		will-change: transform;
		position: absolute;
		top: 50%;
		transform: translateY(-50%) scale(1);
		transform-origin: center;
	}

	.card:hover {
		transform: translateY(-50%) scale(1.05);
		z-index: 4;
	}

	.card:hover img {
		image-rendering: -moz-crisp-edges;
		image-rendering: -o-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
		-ms-interpolation-mode: nearest-neighbor;
	}

	@media (prefers-reduced-motion) {
		.card:hover {
			transform: translateY(-50%) scale(1);
			z-index: 4;
		}
	}

	.card-sm {
		width: calc(20% + var(--cardAdder));
		z-index: 1;
	}
	.card-md {
		width: calc(21.5% + var(--cardAdder));
		z-index: 2;
	}
	.card-lg {
		width: calc(22.5% + var(--cardAdder));
		z-index: 3;
	}

	@media (max-width: 640px) {
		.card-md {
			width: calc(41.5% + var(--cardAdder));
			z-index: 2;
		}
		.card-lg {
			width: calc(42.5% + var(--cardAdder));
			z-index: 3;
		}
	}

	.halfImageFiller {
		width: calc(11.25% + 40px);
	}
	.fullImageFiller {
		width: calc(22.5% + 40px);
	}

	@media (max-width: 640px) {
		.halfImageFiller {
			width: calc(21.25% + 40px);
		}
		.fullImageFiller {
			width: calc(32.5% + 40px);
		}
	}

	.card-1 {
		left: 0;
		animation-delay: 3s;
	}
	.card-2 {
		left: 18.5%;
		animation-delay: 2.5s;
	}
	@media (max-width: 640px) {
		.card-2 {
			left: 0%;
			animation-delay: 1s;
		}
	}
	.card-3 {
		left: 38.6%;
		animation-delay: 2s;
	}
	@media (max-width: 640px) {
		.card-3 {
			left: 28.55%;
			animation-delay: 0.5s;
		}
	}
	.card-4 {
		left: 59.8%;
		animation-delay: 2.5s;
	}
	@media (max-width: 640px) {
		.card-4 {
			animation-delay: 1s;
		}
	}

	.card-5 {
		right: 0;
		animation-delay: 3s;
	}

	.hero-bird {
		bottom: 0;
		z-index: 10;
	}

	:global(.show-animation .bird-1) {
		transform: translateX(-100%) scale(1);
		animation: bird1InFlight 1s ease-in-out forwards 1s;
	}
	@media (prefers-reduced-motion) {
		:global(.show-animation .bird-1) {
			animation: bird1InFlight 0s ease-in-out forwards 0s;
		}
	}
	.bird-1 {
		left: 0;
		height: calc(100% + 15px);
	}

	:global(.show-animation .bird-2) {
		transform: translateX(100%) scale(1);
		animation: bird2InFlight 1s ease-in-out forwards 0.5s;
	}
	@media (prefers-reduced-motion) {
		:global(.show-animation .bird-2) {
			animation: bird2InFlight 0s ease-in-out forwards 0s;
		}
	}
	.bird-2 {
		right: 0;
		height: calc(100% + 15px);
	}

	@keyframes birdFadeIn {
		from {
			opacity: 0;
			transform: rotateX(45deg) translateY(-50%) scale(1);
		}
		to {
			opacity: 1;
			transform: rotateX(0) translateY(-50%) scale(1);
		}
	}

	@keyframes bird1InFlight {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}

	@keyframes bird2InFlight {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
</style>
