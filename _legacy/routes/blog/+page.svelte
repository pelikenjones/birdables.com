<script>
	import SEO from 'svelte-seo';

	import site from '#lib/info.js';
	import Posts from '#lib/components/blog/Posts.svelte';
	import PortableText from '#lib/components/PortableText.svelte';
	import Breadcrumb from '#lib/components/Breadcrumb.svelte';
	import { toPlainText } from '#lib/utils.js';

	let { data } = $props();
	let { posts, currentPage, perPage, count, blogInfo, categories, topics } = data;
</script>

<svelte:head>
	<title>{blogInfo.pageInfo.name}</title>
</svelte:head>

<SEO
	title={`${blogInfo.pageInfo.name}`}
	description={`${toPlainText(blogInfo.content)}`}
	keywords={`Blog, ${site.name}`}
	openGraph={{
		title: `${blogInfo.pageInfo.name}`,
		description: toPlainText(blogInfo.content),
		url: `${site.address}/blog`,
		type: 'website',
		images: [
			{
				url: `${site.address}/images/opengraph/index.webp`,
				width: 1200,
				height: 627,
				alt: `${blogInfo.pageInfo.name}`
			}
		]
	}}
	twitter={{
		site: `@${site.twitterHandle}`,
		title: `${blogInfo.pageInfo.name}`,
		description: toPlainText(blogInfo.content),
		image: `${site.address}/images/opengraph/index.webp`,
		imageAlt: `${blogInfo.pageInfo.name}!`
	}}
	jsonLd={{
		logo: `${site.address}/images/logo.svg`,
		'@context': `http://schema.org`,
		'@type': `WebSite`,
		name: `${blogInfo.pageInfo.name}`,
		url: `${site.address}/blog`
	}}
/>

<section class="bg-gray-blue">
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<Breadcrumb current="Blog" />
		<div class="md:flex md:justify-between items-end">
			<div class="max-w-3xl pt-8">
				<h2
					class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tighter lg:text-6xl"
				>
					Birdables Blog <span class="tracking-tight italic text-gray-300 text-4xl"
						>({count} posts)</span
					>
				</h2>
				<PortableText content={blogInfo.content} class="mt-4 prose-xl text-gray-500" />
			</div>
		</div>
	</div>
</section>

<div class="bg-white">
	<section>
		<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
			<Posts {posts} {categories} {topics} {count} {currentPage} {perPage} />
		</div>
	</section>
</div>
