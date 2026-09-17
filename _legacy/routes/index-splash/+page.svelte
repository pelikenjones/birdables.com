<script>
	import { asset } from '$app/paths';
	import SEO from 'svelte-seo';

	import { browser } from '$app/env';
	import { resolve } from '$app/paths';
	import site from '#lib/info.js';
	import { headerFooterState } from '../../stores/store.svelte';

	const checkIfShownAnimationsCookieIsTrue = () => {
		if (document.cookie.split(';').some((item) => item.includes('shown_animations=true'))) {
			return true;
		}
		return false;
	};

	if (browser && !checkIfShownAnimationsCookieIsTrue()) {
		document.body.classList.add('show-animation');
		document.cookie = `shown_animations=true; SameSite=None; Secure;`;
	}

	headerFooterState.visible = false;
</script>

<SEO
	title={`${site.name} | Physical & NFT Bird Collectable Cards`}
	description={`${site.name} is a collection of artistic yet realistic bird collectable/trading cards. Created for lovers of birds, art, and sustainably thoughtful projects. Distributed in digital (NFT) and physical mediums, so that owners can enjoy ${site.name} cards any way they like.`}
	keywords={`Bird Collectable Cards, Bird Trading Cards, ${site.name}, Bird NFT's`}
	openGraph={{
		title: `${site.name} | Physical & Digital Bird Collectable Cards`,
		description: `${site.name} is a collection of artistic yet realistic bird collectable/trading cards. Created for lovers of birds, art, and sustainably thoughtful projects. Distributed in digital (NFT) and physical mediums, so that owners can enjoy ${site.name} cards any way they like.`,
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
		description: `${site.name} is a collection of artistic yet realistic bird collectable/trading cards. Created for lovers of birds, art, and sustainably thoughtful projects. Distributed in digital (NFT) and physical mediums, so that owners can enjoy ${site.name} cards any way they like.`,
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

<!-- This example requires Tailwind CSS v2.0+ -->
<div class="min-h-screen pt-16 pb-12 flex flex-col bg-white">
	<main class="grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex-shrink-0 flex justify-center">
			<a href={resolve('/')} class="inline-flex">
				<span class="sr-only">{site.name}</span>

				<img
					class="h-12 md:h-16 w-auto"
					src={asset(`images/logo.svg`)}
					alt="{site.name} logo"
				/>
			</a>
		</div>
		<div class="py-16">
			<div class="text-center">
				<h1 class="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
					Coming Soon!
				</h1>
			</div>
		</div>
	</main>
</div>
