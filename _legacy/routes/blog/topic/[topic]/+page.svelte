<script>
	import SEO from 'svelte-seo';

	import site from '#lib/info.js';
	import Breadcrumb from '#lib/components/Breadcrumb.svelte';
	import Posts from '#lib/components/blog/Posts.svelte';
	import { unSlugify, capitalize } from '#lib/utils.js';

	let { data } = $props();
	let { posts, currentPage, perPage, count, topics, topic } = data;

	const formattedTopic = capitalize(unSlugify(topic, true));
</script>

<SEO
	title={`${formattedTopic} | ${site.name} Blog`}
	description={`"${formattedTopic}" blog posts`}
	keywords={formattedTopic}
	openGraph={{
		title: `${formattedTopic} |  ${site.name} Blog`,
		// description: toPlainText(post.excerpt),
		url: `${site.address}/blog/topic${topic}`,
		type: 'website',
		images: [
			{
				url: `${site.address}/images/opengraph/index.webp`,
				width: 1200,
				height: 627,
				alt: `${formattedTopic}`
			}
		]
	}}
	twitter={{
		site: `@${site.twitterHandle}`,
		title: `"${formattedTopic}" blog posts | ${site.name}`,
		// description: toPlainText(post.excerpt),
		image: `${site.address}/images/opengraph/index.webp`,
		imageAlt: `${formattedTopic}`
	}}
	jsonLd={{
		logo: `${site.address}/images/logo.svg`,
		'@context': `http://schema.org`,
		'@type': `WebSite`,
		name: `${formattedTopic} blog posts | ${site.name}`,
		url: `${site.address}/blog/topic/${topic}`
	}}
/>

<section class="bg-gray-blue">
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<Breadcrumb
			current={unSlugify(unSlugify(topic, true))}
			steps={[
				{ title: 'Blog', link: '/blog' },
				{ title: 'Topics', link: '/blog/topics' }
			]}
		/>
		<div class="md:flex md:justify-between items-end">
			<div class="max-w-3xl pt-8">
				<h2
					class="text-4xl font-extrabold text-gray-900 flex space-x-4 items-end sm:text-5xl sm:tracking-tighter lg:text-6xl"
				>
					<svg class="-ml-1 mr-3 h-14 w-14" viewBox="0 0 20 20" fill="currentColor">
						<path fill="none" d="M0 0h24v24H0z" /><path
							d="M7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2h3.784zm2.011 0h3.99l.42-4h-3.99l-.42 4z"
						/>
					</svg>
					{unSlugify(topic, true)}
					<span class="tracking-tight italic text-gray-300 text-4xl">({count})</span>
				</h2>
			</div>
		</div>
	</div>
</section>

<div class="bg-white">
	<div class="mx-auto py-12 px-4 max-w-screen-xl sm:px-6 lg:px-8 lg:py-24">
		<Posts
			{posts}
			{topics}
			{count}
			{currentPage}
			{perPage}
			paginationSlug={`/blog/topic/${topic}`}
			currentTopic={topic}
		/>
	</div>
</div>
