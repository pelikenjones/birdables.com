<script>
  import {checkIfInternalURL, returnEntireSlug} from '#lib/utils.js';
  import ExternalLink from '#lib/components/ExternalLink.svelte';

  let { class: className, href = null, title = '', text = '', noscroll = undefined, children } = $props();

  const isInternal = checkIfInternalURL(href)
</script>

{#if isInternal}
  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href is an arbitrary CMS-authored internal path, not a static route id -->
  <a class={className} href={`${returnEntireSlug(href)}`} title={title || ""} data-sveltekit-preload-data data-sveltekit-reset={noscroll ? 'false' : undefined}>
    {#if children}{@render children()}{:else}{text !== '' ? text : href}{/if}
  </a>
{:else}
  <ExternalLink class={className ? className : undefined} href={href} title={title}>
    {#if children}{@render children()}{:else}{text !== '' ? text : href}{/if}
  </ExternalLink>
{/if}
