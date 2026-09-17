<script>
	import '../app.css';
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';

	import { headerFooterState } from '../stores/store.svelte';

	headerFooterState.visible = true;

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
	<meta name="msapplication-TileColor" content="#ffffff" />
	<meta name="theme-color" content="#ffffff" />
	<meta content="width=device-width, initial-scale=1, minimum-scale=1" name="viewport" />
</svelte:head>

<div class="text-gray-900 relative w-screen selection:bg-gray-900 selection:text-white">
	{#if headerFooterState.visible}
		<Nav />
	{/if}
	{@render children()}
	{#if headerFooterState.visible}
		<Footer />
	{/if}
</div>
