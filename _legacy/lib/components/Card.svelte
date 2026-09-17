<script>
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let { i, card } = $props();

	let ready = $state(false);

	onMount(() => {
		setTimeout(() => {
			ready = true;
		}, i * 100);
	});
</script>

<a
	href={resolve('/bird/[slug]', { slug: card.slug })}
	data-sveltekit-preload-data
	class={`${
		ready ? 'opacity-100' : 'opacity-0'
	} group flex flex-col space-y-4 tranform transition duration-300`}
>
	<img
		class="card-img object-cover drop-shadow-card card-img"
		src={asset(`images/cards/${card.friendlyId}.webp`)}
		alt={card.cardName}
	/>
	<div class="text-lg leading-6 font-medium space-y-2">
		<p class="flex flex-col">
			<span class="text-xl tracking-tighter leading-none group-hover:underline">
				{#if card.smallName}
					{card.smallName}
				{:else}
					<br />
				{/if}
			</span>
			<span
				class="font-black tracking-tighter leading-none text-2xl md:text-4xl group-hover:underline"
				>{card.bigName}</span
			>
		</p>
		<p class="text-gray-400 italic text-base tracking-tight leading-none">
			{card.scientificName}
		</p>
		<div class="flex space-x-2">
			<!-- {#if card.rarity === 5}
              <span class="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-full text-xs font-semibold">Legendary</span>
            {/if} -->
			{#if card.new}
				<span class="px-3 py-1.5 bg-gray-blue text-gray-600 rounded-full text-xs font-semibold"
					>New!</span
				>
			{/if}
		</div>
	</div>
</a>
