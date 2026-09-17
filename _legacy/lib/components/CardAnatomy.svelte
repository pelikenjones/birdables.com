<script>
	import { asset } from '$app/paths';

	let isModalOpen = false;

	function toggleModal() {
		isModalOpen = !isModalOpen;
	}

	function handleKeydown(e) {
		if (isModalOpen && e.key === 'Escape') {
			toggleModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown}></svelte:window>

<div class="block overflow-hidden rounded-2xl md:rounded-2xl lg:rounded-5xl group mt-10 relative">
	<img
		src={asset(`images/Birdable-Card-Anatomy-Light.webp`)}
		alt="Birdables card anatomy diagram"
	/>
</div>

<!-- Modal -->
<div
	class={`${
		isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 delay-300 pointer-events-none'
	} fixed z-20 inset-0 overflow-y-auto transition`}
	aria-labelledby="modal-rarity-description"
	role="dialog"
	aria-modal="true"
>
	<div class="flex items-center justify-center min-h-screen text-center  sm:block sm:p-0">
		<!-- Overlay -->
		<div
			onclick={toggleModal}
			class={`${
				isModalOpen ? 'opacity-100' : 'opacity-0'
			} fixed h-screen w-screen inset-0 bg-gray-900 bg-opacity-75 transition-opacity duration-300 ease-in-out`}
			aria-hidden="true"
		></div>
		<!-- This element is to trick the browser into centering the modal contents. -->

		<div
			class={`${
				isModalOpen
					? 'opacity-100 translate-y-0 sm:scale-100'
					: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
			} fixed overflow-auto inset-0 flex items-center justify-center h-screen w-screen  pointer-events-none transition-all duration-300 ease-in-out px-0 py-0 md:px-6 md:py-12`}
		>
			<img
				src={asset(`images/Birdable-Card-Anatomy.jpg`)}
				alt="Birdables card anatomy diagram"
				class={`${
					isModalOpen ? 'pointer-events-auto' : 'pointer-events-none'
				} rounded-xl object-center object-cover drop-shadow-card`}
			/>
		</div>
		<button onclick={toggleModal} class="fixed top-4 right-4 text-white cursor-pointer z-10">
			<span class="sr-only">Close Modal</span>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="36"
				height="36"
				class=""
			>
				<path fill="none" d="M0 0h24v24H0z"></path>

				<path
					fill="currentColor"
					d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
				></path>
			</svg>
		</button>
	</div>
</div>
