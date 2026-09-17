<script>
	import { resolve } from '$app/paths';

	let { variant = 'dark' } = $props();
	// variant: 'dark' (full-width dark panel) | 'compact' (inline card)
</script>

{#if variant === 'compact'}
	<div class="py-8 px-4 sm:px-6 lg:px-16 pt-8 sm:py-16">
		<div class="mx-auto rounded-3xl bg-gray-900 max-w-7xl">
			<div
				class="max-w-3xl rounded-3xl bg-gray-900 mx-auto text-center py-16 px-4 sm:py-24 sm:px-6 lg:px-8"
			>
				<h2 class="text-xl md:text-2xl tracking-tight text-white">
					<span class="block text-3xl md:text-5xl font-extrabold">Like what you see?</span>
					<span class="block mt-4">Learn about the project — the birds, the mission, and what's next.</span>
				</h2>
				<div class="flex flex-col sm:flex-row gap-4 justify-center mt-10">
					<a
						href={resolve('about')}
						data-sveltekit-preload-data
						class="py-3 px-8 text-center bg-white border border-transparent rounded-full shadow-lg font-semibold text-gray-900 transition hover:ring-2 hover:ring-offset-4 hover:ring-offset-gray-900 hover:ring-white focus:ring-2 focus:ring-offset-4 focus:ring-offset-gray-900 focus:ring-white"
					>
						About Birdables
					</a>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="bg-white">
		<div class="max-w-7xl mx-auto pb-12 sm:px-6 lg:pb-16 lg:px-8 xl:px-0">
			<div
				class="py-10 px-6 bg-gray-900 rounded-3xl sm:py-16 sm:px-12 lg:p-20 lg:flex lg:items-center lg:justify-between gap-12"
			>
				<div class="lg:w-0 lg:flex-1">
					<h2 class="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
						The whole flock is waiting.
					</h2>
					<p class="mt-4 max-w-3xl md:text-lg text-gray-100">
						Beautifully illustrated, sustainably printed, and packed with real bird science. Each
						Birdable is a tiny field guide you can hold in your hand — or trade with a friend.
					</p>
				</div>
				<div class="mt-8 lg:mt-0 flex flex-col sm:flex-row sm:items-center lg:flex-col gap-4 shrink-0">
					<a
						href={resolve('cards')}
						data-sveltekit-preload-data
						class="py-4 px-8 text-center bg-white border border-transparent rounded-full shadow-lg font-semibold text-gray-900 transition hover:ring-2 hover:ring-offset-4 hover:ring-offset-gray-900 hover:ring-white focus:ring-2 focus:ring-offset-4 focus:ring-offset-gray-900 focus:ring-white"
					>
						Browse the cards
					</a>
					<a
						href={resolve('about')}
						data-sveltekit-preload-data
						class="text-center text-white underline underline-offset-2 hover:text-white transition"
					>
						Learn about Birdables
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}
