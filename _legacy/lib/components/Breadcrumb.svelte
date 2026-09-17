<script>
	import { resolve } from '$app/paths';

	let { steps = [], current = '' } = $props();
</script>

<nav class="flex" aria-label="Breadcrumb">
	<ol class="flex items-center space-x-4">
		<li>
			<div>
				<a href={resolve('/')} data-sveltekit-preload-data class="text-gray-800 hover:text-gray-900">
					<svg
						class="flex-shrink-0 h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
						/>
					</svg>
					<span class="sr-only">Home</span>
				</a>
			</div>
		</li>

		{#each steps as step (step.link)}
			<li>
				<div class="flex items-center">
					<svg
						class="flex-shrink-0 h-5 w-5 text-gray-300"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
					</svg>
					<a
						href={resolve(step.link)}
						data-sveltekit-preload-data
						class="ml-4 text-sm font-medium text-gray-800 hover:text-gray-900 underline"
						>{step.title}</a
					>
				</div>
			</li>
		{/each}

		<li>
			<div class="flex items-center">
				<svg
					class="flex-shrink-0 h-5 w-5 text-gray-300"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
					aria-hidden="true"
				>
					<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
				</svg>
				<span class="ml-4 text-sm font-medium text-gray-500" aria-current="page">{current}</span>
			</div>
		</li>
	</ol>
</nav>
