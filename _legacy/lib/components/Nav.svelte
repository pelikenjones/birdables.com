<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Instagram from '#lib/svgs/Instagram.svelte';
	import OpenSeaIcon from '#lib/svgs/OpenSeaIcon.svelte';
	import Twtter from '#lib/svgs/Twtter.svelte';

	let isOpen = false;
	let shopNavOpen = false;

	function toggle() {
		isOpen = !isOpen;
	}

	function toggleShopNav(setter = null) {
		if (setter !== null) {
			shopNavOpen = setter;
		} else {
			shopNavOpen = !shopNavOpen;
		}
	}

	function handleKeyDown(e) {
		if (isOpen && e.key === 'Escape') {
			toggle();
		}
		if (shopNavOpen && e.key === 'Escape') {
			toggleShopNav(false);
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown}></svelte:window>

<div class="relative bg-white z-10">
	<div class="absolute inset-0 z-30 pointer-events-none" aria-hidden="true"></div>
	<div class="relative z-20">
		<div
			class="flex justify-between items-center px-6 py-6 lg:px-16 lg:justify-start lg:space-x-10"
		>
			<div class="flex space-x-12 items-center">
				<a data-sveltekit-preload-data href={resolve('/')} class="flex">
					<span class="sr-only">Birdables</span>
					<img
						class="h-6 w-auto sm:h-8"
						src="/images/logo.svg"
						alt="Birdables Logo"
						width="202.86"
						height="36"
					/>
				</a>
				<div class="w-[1px] h-12 bg-gray-100 hidden lg:block"></div>
			</div>
			<div class="-mr-2 -my-2 lg:hidden">
				<button
					type="button"
					onclick={toggle}
					class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-90 border0 border-gray-100 hover:border-gray-blue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
					aria-expanded={isOpen}
				>
					<span class="sr-only">Open menu</span>
					<svg
						class="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</button>
			</div>
			<div class="hidden lg:flex-1 lg:flex lg:items-center lg:justify-between">
				<nav class="flex space-x-8">
					<a
						data-sveltekit-preload-data
						href={resolve('cards')}
						onfocus={() => toggleShopNav(false)}
						class={`${page.url.pathname === '/cards' ? 'border-gray-900' : 'border-transparent'} text-lg font-medium text-gray-900 border-b-3 translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900`}
					>Cards</a>

					<a
						onfocus={() => toggleShopNav(false)}
						data-sveltekit-preload-data
						href={resolve('about')}
						class={`${page.url.pathname === '/about' ? 'border-gray-900' : 'border-transparent'} text-lg font-medium text-gray-900 border-b-3 translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900`}
					>About Birdables</a>

					<a
						onfocus={() => toggleShopNav(false)}
						data-sveltekit-preload-data
						href={resolve('blog')}
						class={`${page.url.pathname === '/blog' ? 'border-gray-900' : 'border-transparent'} text-lg font-medium text-gray-900 border-b-3 translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900`}
					>Blog</a>
				</nav>
				<div class="flex items-center lg:ml-12 space-x-6">
					<a
						href="https://instagram.com/Birdables_Cards"
						target="_blank"
						rel="noopener noreferrer"
						class="text-base font-medium text-gray-900 border-b-3 border-transparent translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900"
					>
						<Instagram class="h-[21px] text-gray-900" />
						<span class="sr-only">Link to Instagram</span>
					</a>
					<a
						href="https://twitter.com/BirdablesCards"
						target="_blank"
						rel="noopener noreferrer"
						class="text-base font-medium text-gray-900 border-b-3 border-transparent translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900"
					>
						<Twtter class="h-[21px] text-gray-900" />
						<span class="sr-only">Link to Twitter</span>
					</a>
					<a
						href="https://opensea.io/collection/birdables"
						target="_blank"
						rel="noopener noreferrer"
						class="text-base font-medium text-gray-900 border-b-3 border-transparent translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900"
					>
						<OpenSeaIcon class="h-[21px] text-gray-900" />
						<span class="sr-only">Link to OpenSea</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<div
		class={`absolute z-30 top-0 inset-x-0 p-2 transition origin-top-right lg:hidden ${
			isOpen
				? 'ease-out duration-200 opacity-100 scale-100'
				: 'ease-out duration-150 opacity-0 scale-95 pointer-events-none'
		}`}
	>
		<div
			class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50"
		>
			<div class="pt-5 pb-6 px-5">
				<div class="flex items-center justify-between">
						<a onclick={toggle} data-sveltekit-preload-data href={resolve('/')}>
						<img class="h-6 w-auto" src="/images/logo.svg" alt="Birdables Logo" />
					</a>
					<div class="-mr-2">
						<button
							type="button"
							onclick={toggle}
							class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-90 border0 border-gray-100 hover:border-gray-blue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
						>
							<span class="sr-only">Close menu</span>
							<svg
								class="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					</div>
				</div>
				<div class="mt-6">
					<nav class="grid gap-6">
						<div class="py-6 px-5">
							<div class="grid grid-cols-1 gap-4 text-center">
								<a
									onclick={toggle}
									data-sveltekit-preload-data
									href={resolve('cards')}
									class={`${page.url.pathname === '/cards' ? 'border-gray-900' : 'border-transparent'} text-lg font-medium text-gray-900 border-b-3 translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900`}
								>Cards</a>

								<a
									onclick={toggle}
									data-sveltekit-preload-data
									href={resolve('about')}
									class={`${page.url.pathname === '/about' ? 'border-gray-900' : 'border-transparent'} text-lg font-medium text-gray-900 border-b-3 translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900`}
								>About Birdables</a>

								<a
									onclick={toggle}
									data-sveltekit-preload-data
									href={resolve('blog')}
									class={`${page.url.pathname === '/blog' ? 'border-gray-900' : 'border-transparent'} text-lg font-medium text-gray-900 border-b-3 translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900`}
								>Blog</a>
							</div>
							<div class="flex items-center justify-center space-x-6 mt-6 w-full">
								<a
									href="https://instagram.com/Birdables_Cards"
									target="_blank"
									rel="noopener noreferrer"
									class="text-base font-medium text-gray-900 border-b-3 border-transparent translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900"
								>
									<Instagram class="h-[21px] text-gray-900" />
									<span class="sr-only">Link to Instagram</span>
								</a>
								<a
									href="https://twitter.com/BirdablesCards"
									target="_blank"
									rel="noopener noreferrer"
									class="text-base font-medium text-gray-900 border-b-3 border-transparent translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900"
								>
									<Twtter class="h-[21px] text-gray-900" />
									<span class="sr-only">Link to Twitter</span>
								</a>
								<a
									href="https://opensea.io/collection/birdables"
									target="_blank"
									rel="noopener noreferrer"
									class="text-base font-medium text-gray-900 border-b-3 border-transparent translate-y-1.5 pb-1 transition hover:border-gray-900 focus:border-gray-900"
								>
									<OpenSeaIcon class="h-[21px] text-gray-900" />
									<span class="sr-only">Link to OpenSea</span>
								</a>
							</div>
						</div>
					</nav>
				</div>
			</div>
		</div>
	</div>
</div>
