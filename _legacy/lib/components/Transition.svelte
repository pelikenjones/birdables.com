<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	let { refresh = ``, children } = $props();

	let animations = false;

	onMount(
		() =>
			(animations =
				window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
				window.matchMedia(`(prefers-reduced-motion: reduce)`).matches !== true)
	);
</script>

{#key refresh}
	{#if !!animations}
		<div in:fly={{ delay: 100, duration: 200, y: -10 }} out:fly={{ duration: 100, y: 10 }}>
			{@render children?.()}
		</div>
	{:else}
		{@render children?.()}
	{/if}
{/key}
