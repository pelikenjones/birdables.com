<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { headerFooterState } from '../stores/store.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		headerFooterState.visible = false;

		return () => { headerFooterState.visible = true; };
	});
</script>

<div class="bg-white h-screen px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
	<div class="mx-auto">
		<main class="sm:flex">
			<p
				class="text-4xl font-extrabold text-beak-600 sm:text-7xl"
			>{page.status}</p>

			<div class="sm:ml-6">
				<div class="sm:border-l sm:border-gray-200 sm:pl-6">
					<h1
						class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
					>{page.status === 404 ? 'This page already migrated!' : page.error.message}</h1>

					{#if page.status === 404}
						<p class="mt-2 text-base text-gray-500">Please check the URL in the address bar and try again.</p>
					{:else if page.status === 500}
						<p class="mt-2 text-base text-gray-500">
							There was an error generating this page. You can try to refresh, but your best bet is to 
							<a href={resolve('/')}>migrate back down south</a>
						</p>
					{:else}
						<p class="mt-2 text-base text-gray-500">
							There was an error generating this page. You can try to refresh, but your best bet is
							to <a href={resolve('/')}>migrate back down south</a>
						</p>
					{/if}
				</div>
				<div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
					<a
						href={resolve('/')}
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-beak-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beak-500"
					>
						Go back home
					</a>
				</div>
			</div>
		</main>
	</div>
</div>
