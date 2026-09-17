<script>
  let { totalResults, currentPage, perPage, slug } = $props();

  let max = $derived(Math.ceil(totalResults / perPage));
  let start = $derived(perPage * currentPage - perPage + 1);
  let end = $derived(perPage * currentPage);
</script>
{#if (currentPage > 1) || (currentPage < max)}
<nav class="bg-white py-8 flex items-center justify-between border-t border-gray-100">
  <div class="hidden sm:block">
    <p class="text-sm leading-5 text-gray-700">
      Showing
      {#if start !== end}
        <span class="font-medium">{start}</span> to <span class="font-medium">{end <= totalResults ? end : totalResults}</span>
      {:else}
      the <span class="font-medium">last</span>
      {/if}
      of
      <span class="font-medium">{totalResults}</span>
      results
    </p>
  </div>
  <div class="flex-1 flex justify-between sm:justify-end">
		{#if currentPage > 1}
		  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- slug is a runtime-computed base path passed in by the caller, not a static route id -->
		  <a data-sveltekit-reset="false" href={`${slug}/${currentPage - 1}`} class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        <svg class="-ml-1 mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fill="none" d="M0 0h24v24H0z"/><path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"/>
        </svg>
        Previous
      </a>
    {:else}
      <span class="opacity-50 cursor-not-allowed relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white transition ease-in-out duration-150">
        <svg class="-ml-1 mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fill="none" d="M0 0h24v24H0z"/><path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"/>
        </svg>
        Previous
      </span>
    {/if}
		{#if currentPage < max}
		  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- slug is a runtime-computed base path passed in by the caller, not a static route id -->
		  <a data-sveltekit-reset="false" href={`${slug}/${currentPage + 1}`} class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Next
        <svg class="ml-2 -mr-1 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
        </svg>
      </a>
    {:else}
      <span class="opacity-50 cursor-not-allowed ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white transition ease-in-out duration-150">
        Next
        <svg class="ml-2 -mr-1 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
        </svg>
      </span>
    {/if}
  </div>
</nav>
{/if}
