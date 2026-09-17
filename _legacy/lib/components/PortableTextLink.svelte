<script>
	import Link from '#lib/components/Link.svelte';

	let { portableText } = $props();

	let url = $derived(portableText.value.link.link.url);
	let text = $derived(portableText.value.link.title);
</script>

<Link class="" href={url}>{text}</Link>
