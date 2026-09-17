<script>
	import { PortableText } from '@portabletext/svelte';
	import PortableTextLink from '#lib/components/PortableTextLink.svelte';

	let { class: className, content = [] } = $props();
</script>

<div class={className}>
	<PortableText
		value={content}
		components={{
			marks: {
				link: PortableTextLink
			}
		}}
	/>
</div>
