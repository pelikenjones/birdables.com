<script>
	import Instagram from '#lib/svgs/Instagram.svelte';
	import OpenSeaIcon from '#lib/svgs/OpenSeaIcon.svelte';
	import Twtter from '#lib/svgs/Twtter.svelte';
	import { resolve } from '$app/paths';
</script>

<footer class="bg-white">
	<div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
		<nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
			<div class="px-5 py-2">
				<a data-sveltekit-preload-data href={resolve('/')} class="text-base text-gray-500 hover:text-gray-900">
					Home
				</a>
			</div>

			<div class="px-5 py-2">
				<a
					data-sveltekit-preload-data
					href={resolve('cards')}
					class="text-base text-gray-500 hover:text-gray-900"
				>Cards</a>
			</div>

			<div class="px-5 py-2">
				<a
					data-sveltekit-preload-data
					href={resolve('about')}
					class="text-base text-gray-500 hover:text-gray-900"
				>About Birdables</a>
			</div>

			<div class="px-5 py-2">
				<a
					data-sveltekit-preload-data
					href={resolve('blog')}
					class="text-base text-gray-500 hover:text-gray-900"
				>Blog</a>
			</div>
		</nav>
		<div class="mt-8 flex justify-center space-x-6">
			<a
				href="https://instagram.com/Birdables_Cards"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-400 hover:text-gray-500"
			>
				<Instagram class="h-[21px]" />
				<span class="sr-only">Link to Instagram</span>
			</a>
			<a
				href="https://twitter.com/BirdablesCards"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-400 hover:text-gray-500"
			>
				<Twtter class="h-[21px]" />
				<span class="sr-only">Link to Twitter</span>
			</a>
			<a
				href="https://opensea.io/collection/birdables"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-400 hover:text-gray-500"
			>
				<OpenSeaIcon class="h-[21px]" />
				<span class="sr-only">Link to OpenSea</span>
			</a>
		</div>
		<p class="mt-8 text-center text-base text-gray-600">
			© {new Date().getFullYear()} Birdables. All rights reserved. | 

			<a
				class="underline"
				href="https://github.com/pelikenjones/birdables.com"
			>View open sourced code</a>
		</p>
	</div>
</footer>
