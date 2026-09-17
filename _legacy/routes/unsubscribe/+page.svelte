<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';

  let id
  let successful = null;

  onMount(async () => {
    if (page.url.searchParams.get('id')) {
      id = page.url.searchParams.get('id');

      const res = await fetch("/api/unNotify", { method: "post", body: JSON.stringify({ id }) });

      if (res.status === 200) {
        successful = true
      } else {
        successful = false
      }
    }
  })
</script>

<div class="bg-white h-[calc(100vh-328px)] px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
  <main class="grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
    {#if successful === true}
      <div class="bg-green-200 text-green-700 p-4 border-green-700 rounded-lg text-center">
        You successfully unsubscribed
      </div>
    {:else if successful === false}
      <div class="bg-red-200 text-red-700 p-4 border-red-700 rounded-lg text-center">
        There was an Error.  Please try again or contact <a class="underline" href="mailto:birdables@gmail.com">birdables@gmail.com</a> if the error persists
      </div>
    {:else}
      <div></div>
    {/if}
    <div class="py-16">
      <div class="text-center">
        <h1 class="mt-2 text-5xl font-extrabold text-gray-900 tracking-tight sm:text-7xl">Bye, Birdlicia.</h1>
        <p class="mt-4 text-base text-gray-500">We hate to see ya go, but we love to watch you fly away.</p>
        <div class="mt-6">
          <a
            href={resolve('/')}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-beak-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beak-500"
          >Go back home<span aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
  </main>
</div>
