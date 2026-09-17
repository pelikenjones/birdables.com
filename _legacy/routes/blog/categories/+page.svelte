<script>
	import SEO from 'svelte-seo';
	import site from '#lib/info.js';
	import Breadcrumb from '#lib/components/Breadcrumb.svelte';
	import { urlFor } from '#lib/sanity-image-url.js';
	import { categoryNamesToString } from '#lib/utils.js';
	import { resolve } from '$app/paths';

	let { data } = $props();
	let { categories } = data;
</script>

<SEO
	title={`${site.name} blog categories`}
	keywords={`${site.name} blog categories,${categoryNamesToString(categories)}`}
	openGraph={{
		title: `${site.name} blog categories`,
		// description: `${categoryNamesToString(true)} ${categories.length > 1 ? "are" : "is"} the ${site.name} blog categor${categories.length > 1 ? "ies" : "y"}`,
		url: `${site.address}/blog/categories`,
		type: 'website',
		images: [
			{
				url: categories[0]?.image?.asset
					? urlFor(categories[0].image.asset).width(1200).quality(80)
					: `${site.address}/images/opengraph/index.webp}`,
				width: 1200,
				height: categories[0]?.image?.asset ? 1200 : 627,
				alt: `${site.name} blog categories`
			}
		]
	}}
	twitter={{
		site: `@${site.twitterHandle}`,
		title: `${site.name} blog categories`,
		// description: `${categoryNamesToString(true)} ${categories.length > 1 ? "are" : "is"} the ${site.name} blog author${categories.length > 1 ? "ies" : "y"}`,
		image: categories[0]?.image?.asset
			? urlFor(categories[0].image.asset).width(1200).quality(80)
			: `${site.address}/images/opengraph/index.webp}`,
		imageAlt: `${site.name} blog categories`
	}}
	jsonLd={{
		logo: `${site.address}/images/logo.svg`,
		'@context': `http://schema.org`,
		'@type': `WebSite`,
		name: `${site.name} categories`,
		url: `${site.address}/blog/categories`
	}}
/>

<section class="bg-gray-blue">
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<Breadcrumb current="Categories" steps={[{ title: 'Blog', link: '/blog' }]} />
		<div class="md:flex md:justify-between items-end">
			<div class="max-w-3xl pt-8">
				<h2
					class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tighter lg:text-6xl"
				>
					Birdables Categories <span class="tracking-tight italic text-gray-300 text-4xl"
						>({categories.length})</span
					>
				</h2>
				<p class="mt-4 text-xl text-gray-500">
					Browse the blog by category to help find exactly what you need.
				</p>
			</div>
		</div>
	</div>
</section>

<div class="bg-white">
	<div class="mx-auto py-6 px-4 max-w-screen-xl sm:px-6 lg:px-8 lg:py-10">
		<div class="space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
			{#each categories as category (category.pageInfo.slug.current)}
				<a href={resolve('/blog/category/[category]', { category: category.pageInfo.slug.current })} class="bg-white ">
					<img
						loading="lazy"
						class="object-cover aspect-video h-full w-full shadow-lg rounded-lg overflow-hidden"
						src={urlFor(category.image).width(600)}
						alt={category.pageInfo.name}
					/>
					<h4 class="font-bold text-xl p-4 text-center">
						{category.pageInfo.name}
						<span class="span text-gray-500 font-light text-base">({category.count})</span>
					</h4>
				</a>
			{/each}
		</div>
	</div>
</div>
