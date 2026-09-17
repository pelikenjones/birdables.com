<script>
	import SEO from 'svelte-seo';

	import site from '#lib/info.js';
	import { urlFor } from '#lib/sanity-image-url.js';
	import Posts from '#lib/components/blog/Posts.svelte';
	import PortableText from '#lib/components/PortableText.svelte';
	import Breadcrumb from '#lib/components/Breadcrumb.svelte';
	import { toPlainText, truncate } from '#lib/utils.js';

	let { data } = $props();
	let { posts, categoryInfo, currentPage, perPage, count, categories } = data;
</script>

<svelte:head>
	<title>{categoryInfo.pageInfo.name}</title>
</svelte:head>

<SEO
	title={`${categoryInfo.pageInfo.name} | ${site.name} Blog`}
	description={`${truncate(toPlainText(categoryInfo.description), 160)}`}
	keywords={categoryInfo.pageInfo.name}
	openGraph={{
		title: `${categoryInfo.pageInfo.name} | ${site.name} Blog`,
		description: truncate(toPlainText(categoryInfo.description), 160),
		url: `${site.address}/blog/category/${categoryInfo.pageInfo.slug.current}`,
		type: 'website',
		images: [
			{
				url: `${urlFor(categoryInfo.image.asset).quality(80).size(1200, 627)}`,
				width: 1200,
				height: 627,
				alt: `${categoryInfo.pageInfo.name}`
			}
		]
	}}
	twitter={{
		site: `@${site.twitterHandle}`,
		title: `"${categoryInfo.pageInfo.name}" blog posts | ${site.name} Blog`,
		description: truncate(toPlainText(categoryInfo.description), 160),
		image: `${urlFor(categoryInfo.image.asset).quality(80).size(1200, 627)}`,
		imageAlt: `${categoryInfo.pageInfo.name}!`
	}}
	jsonLd={{
		logo: `${site.address}/images/logo.svg`,
		'@context': `http://schema.org`,
		'@type': `WebSite`,
		name: `${categoryInfo.pageInfo.name} blog posts | ${site.name}`,
		url: `${site.address}/blog/category/${categoryInfo.pageInfo.name}`
	}}
/>

<section class="bg-gray-blue">
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<Breadcrumb
			current={categoryInfo.pageInfo.name}
			steps={[
				{ title: 'Blog', link: '/blog' },
				{ title: 'Categories', link: '/blog/categories' }
			]}
		/>
		<div class="md:flex md:justify-between items-end">
			<div class="max-w-3xl pt-8">
				<h2
					class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tighter lg:text-6xl"
				>
					{categoryInfo.pageInfo.name}
					<span class="tracking-tight italic text-gray-300 text-4xl">({count})</span>
				</h2>
				<PortableText content={categoryInfo.description} class="mt-4 prose-xl text-gray-500" />
			</div>
		</div>
	</div>
</section>


<div class="bg-white">
	<div class="mx-auto py-6 px-4 max-w-screen-xl sm:px-6 lg:px-8 lg:py-10">
		<Posts
			{posts}
			{categories}
			{count}
			{currentPage}
			{perPage}
			paginationSlug={`blog/category/${categoryInfo.pageInfo.slug.current}`}
			currentCategory={categoryInfo._id}
		/>
	</div>
</div>

<style>
</style>
