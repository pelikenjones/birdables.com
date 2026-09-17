<script>
	import { unSlugify } from '#lib/utils.js';
	import { resolve } from '$app/paths';

	let { topics, currentTopic } = $props();

	let isOpen = $state(false);

	function toggle() {
		isOpen = !isOpen;
	}
</script>

{#if topics && topics.length > 0}
	<div class={`${isOpen ? 'z-30' : 'z-0'} space-y-1 w-full sm:w-64 pointer`}>
		<span class={`${isOpen ? 'text-white' : 'text-gray-900'} block text-lg leading-5 font-bold`}>
			Topics: <span class={`${isOpen ? 'text-gray-100' : 'text-gray-500'} text-xs`}
				>(more specific)</span
			>
		</span>
		<div class="relative">
			<span class="inline-block w-full rounded-md shadow-sm">
				<button
					onclick={toggle}
					data-selector="category"
					type="button"
					aria-haspopup="listbox"
					aria-expanded="true"
					aria-labelledby="listbox-label"
					class="relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
				>
					<div class="flex items-center space-x-3">
						<span class="block truncate capitalize">
							{#if currentTopic}
								{unSlugify(currentTopic)}
							{:else}
								Select a topic
							{/if}
						</span>
					</div>
					<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<svg
							class="h-5 w-5 text-gray-400"
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
						>
							<path
								d="M7 7l3-3 3 3m0 6l-3 3-3-3"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</button>
			</span>

			<div
				class={`${isOpen ? 'block' : 'hidden'} absolute mt-1 w-full rounded-md bg-white shadow-lg`}
			>
				<ul
					tabindex="-1"
					role="listbox"
					aria-labelledby="listbox-label"
					aria-activedescendant="listbox-item-3"
					class="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
				>
          {#each topics as topic (topic)}
            <li
              role="option"
              aria-selected={topic === currentTopic}
              class="text-gray-900 cursor-default select-none relative hover:bg-gray-100"
            >
            <a
                href={resolve('/blog/topic/[topic]', { topic })}
              data-sveltekit-reset="false"
                class=" py-2 px-4 flex items-center space-x-3"
                onclick={() => { toggle(); }}
                onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(); }}
              >
								<span
									class={`${
										topic === currentTopic ? 'font-bold' : 'font-normal'
									} block truncate capitalize`}
								>
									{unSlugify(topic)}
								</span>
            </a>
							{#if topic === currentTopic}
								<span class="text-beak-600 absolute inset-y-0 right-0 flex items-center pr-4">
									<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
  <button
    type="button"
    aria-label="Close topics overlay"
    onclick={toggle}
    class={`${
			isOpen ? 'opacity-75 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
		} !ml-0 fixed top-0 left-0 w-screen h-screen bg-black cursor-default transition duration-300`}
></button>
{/if}
