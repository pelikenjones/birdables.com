<script>
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Card from '#lib/components/Card.svelte';

	let { cards } = $props();
</script>

<ul
	class="gap-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12 sm:space-y-0  lg:gap-x-8 2xl:grid-cols-3"
>
	{#each cards as card, i (card)}
		<li transition:fade animate:flip={{ duration: 750 }} class="space-y-4">
			<Card {card} {i} />
		</li>
	{/each}
</ul>
