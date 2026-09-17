<script>
	import BlogFilters from '#lib/components/blog/BlogFilters.svelte';
	import Post from '#lib/components/blog/Post.svelte';
	import Pagination from '#lib/components/Pagination.svelte';
	import { resolve } from '$app/paths';

	let { posts = [], categories = [], topics = [], count, currentPage, perPage, currentCategory, currentTopic, paginationSlug = 'blog/page', topText } = $props();
</script>

{#if posts.length > 0}
	<div class="">
		<BlogFilters {categories} {topics} {currentCategory} {currentTopic} />
		{#if topText}{@render topText()}{/if}
		<div class="mb-6 grid gap-16 lg:grid-cols-2 lg:col-gap-5 lg:row-gap-12">
			{#each posts as post (post.pageInfo.slug.current)}
				<Post {post} />
			{/each}
		</div>
		<Pagination totalResults={count} slug={paginationSlug} {currentPage} {perPage} />
	</div>
{:else}
	<div class="">
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="px-4 py-5 sm:p-6">
				<p class="text-sm leading-5 text-gray-500 text-center">
					Sorry, no blog posts to show 😭. <a href={resolve('/')} class="underline">Go to the Homepage</a>
				</p>
			</div>
		</div>
	</div>
{/if}
