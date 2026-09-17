<script>
	import SEO from 'svelte-seo';

	import site from '#lib/info.js';
	import Breadcrumb from '#lib/components/Breadcrumb.svelte';
	import { unSlugify } from '#lib/utils.js';
	import { resolve } from '$app/paths';

	let { data } = $props();
	let { topics } = data;
</script>

<SEO
	title={`${site.name} blog topics`}
	keywords={`${site.name} blog topics,${topics.join()}`}
	openGraph={{
		title: `${site.name} blog topics`,
		// description: `${categoryNamesToString(true)} ${topics.length > 1 ? "are" : "is"} the ${site.name} blog categor${topics.length > 1 ? "ies" : "y"}`,
		url: `${site.address}/blog/topics`,
		type: 'website',
		images: [
			{
				url: `${site.address}/images/opengraph/index.webp`,
				width: 1200,
				height: 627,
				alt: `${site.name} blog topics`
			}
		]
	}}
	twitter={{
		site: `@${site.twitterHandle}`,
		title: `${site.name} blog topics`,
		// description: `${categoryNamesToString(true)} ${topics.length > 1 ? "are" : "is"} the ${site.name} blog author${topics.length > 1 ? "ies" : "y"}`,
		image: `${site.address}/images/opengraph/index.webp`,
		imageAlt: `${site.name} blog topics`
	}}
	jsonLd={{
		logo: `${site.address}/images/logo.svg`,
		'@context': `http://schema.org`,
		'@type': `WebSite`,
		name: `${site.name} topics`,
		url: `${site.address}/blog/topics`
	}}
/>

<section class="bg-gray-blue">
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<Breadcrumb current="Topics" steps={[{ title: 'Blog', link: '/blog' }]} />
		<div class="md:flex md:justify-between items-end">
			<div class="max-w-3xl pt-8">
				<h2
					class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tighter lg:text-6xl"
				>
					Birdables Topics <span class="tracking-tight italic text-gray-300 text-4xl"
						>({topics.length})</span
					>
				</h2>
				<p class="mt-4 text-xl text-gray-500">
					Browse the blog by topics to help find exactly what you need.
				</p>
			</div>
		</div>
	</div>
</section>

<div class="bg-white">
	<div class="mx-auto py-12 px-4 max-w-screen-xl sm:px-6 lg:px-8 lg:py-24">
		<div class="flex flex-wrap">
			{#each topics as topic (topic)}
				<a
					href={resolve('/blog/topic/[topic]', { topic })}
					rel="prefetch"
					class="text-4xl font-bold mr-8 mb-4 inline-flex items-center hover:text-beak-600 hover:underline"
				>
					<svg class="-ml-1 mr-3 h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
						<path fill="none" d="M0 0h24v24H0z" /><path
							d="M7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2h3.784zm2.011 0h3.99l.42-4h-3.99l-.42 4z"
						/>
					</svg>
					{unSlugify(topic)}
				</a>
			{/each}
		</div>
	</div>
</div>
