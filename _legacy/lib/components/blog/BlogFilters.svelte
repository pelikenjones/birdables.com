<script>
	import CategorySelector from '#lib/components/blog/CategorySelector.svelte';
	import TopicSelector from '#lib/components/blog/TopicSelector.svelte';

	let { categories, topics, currentCategory, currentTopic } = $props();
</script>

{#if (categories && categories.length > 0) || (topics && topics.length > 0)}
	<div class="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 lg:mb-10">
		<CategorySelector {categories} {currentCategory} />
		<TopicSelector {topics} {currentTopic} />
	</div>
{/if}
