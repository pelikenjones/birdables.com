<script>
import Stars from "./Stars.svelte";
import { resolve } from '$app/paths';

  let { stars, hideExplainer = false, size = null } = $props();

  let isModalOpen = $state(false);

  function toggleModal() {
    isModalOpen = !isModalOpen;
  }

  function handleKeydown(e) {
    if (isModalOpen && e.key === "Escape") {
      toggleModal();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown}></svelte:window>

<div class="">
  <span class="sr-only">Rarity: {stars?.toString()} out of 5 stars</span>
  <div class="flex items-center space-x-1">
    <Stars stars={stars} size={size} />

    {#if !hideExplainer}
      <button onclick={toggleModal} class="text-xs ml-4 underline text-gray-600">(What's this?)</button>
    {/if}
  </div>
</div>

<!-- Modal -->
<div class={`${isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 delay-300 pointer-events-none"} fixed z-20 inset-0 overflow-y-auto transition`} aria-labelledby="modal-rarity-description" role="dialog" aria-modal="true">
  <div class="flex justify-center items-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0">
    <div onclick={toggleModal} class={`${isModalOpen ? "opacity-100" : "opacity-0"} fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity duration-300 ease-in-out`} aria-hidden="true"></div>
    
    <!-- This element is to trick the browser into centering the modal contents. -->

    <span
      class="hidden sm:inline-block sm:align-middle sm:h-screen"
      aria-hidden="true"
    >​</span>

    <div
      class={`${isModalOpen
        ? "opacity-100 translate-y-0 sm:scale-100"
        : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"} inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transition-all duration-300 ease-in-out sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6`}
    >
      <div>
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200"
        >
          <svg
            class="h-6 w-6 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>

            <path
              fill="currentColor"
              d="M12 15.968l4.247 2.377-.949-4.773 3.573-3.305-4.833-.573L12 5.275v10.693zm0 2.292l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928L12 18.26z"
            ></path>
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <span class="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
            Rarity Scale
          </span>
          <div class="mt-2">
            <div class="text-sm text-gray-500 prose">
              Each Birdables card has a rarity rating ranging from

              <span
                class="inline-flex px-1 space-x-2 items-baseline translate-y-0.5"
              >
                <Stars stars="1" space="1" size="sm" />
                <span class="leading-none -translate-y-0.5">to</span>
                <Stars stars="5" space="1" size="sm" />
              </span>

              to depict the scarcity of the card.
              <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() output concatenated with a hash fragment isn't recognized by the rule's static check -->
              <a href={resolve('about') + '#rarity'}>Learn more about the rarity</a>
              .
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-6">
        <button onclick={toggleModal} type="button" class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white transition hover:ring-2 hover:ring-offset-2 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm">
          Got It!
        </button>
      </div>
    </div>

    <button
      onclick={toggleModal}
      class="fixed top-4 right-4 text-white cursor-pointer z-10"
    >
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

      <span class="sr-only">Close Modal</span>
    </button>
  </div>
</div>	
