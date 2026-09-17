<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { resolve } from '$app/paths';

	let { data } = $props();
	let { bird } = data;

	if (browser) {
		const navigateToBirdPage = async () => {
			if (bird?.slug) {
				await goto(resolve('/bird/[slug]', { slug: bird.slug }));
			} else {
				await goto(resolve('/'));
			}
		};

		navigateToBirdPage();
	}
</script>

<!-- ToDo: Add a QR Code scanned simple template with not header or footer -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow, noimageindex, noarchive, nosnippet" />
</svelte:head>
