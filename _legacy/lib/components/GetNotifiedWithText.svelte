<script>
	import { formatPhoneNumber, emailIsValid } from '#lib/utils.js';
	let useEmailAddress = true;
	let emailTyped;
	let phoneTyped;
	let validation;
	let successful = false;

	function toggle() {
		useEmailAddress = !useEmailAddress;
		validation = null;
	}

	async function submitForm(e) {
		e.preventDefault();

		if (!useEmailAddress && !formatPhoneNumber(phoneTyped)) {
			validation = 'Phone Number not valid.';
		}
		if (useEmailAddress && !emailIsValid(emailTyped)) {
			validation = 'Email not valid.';
		}
		const data = useEmailAddress ? emailTyped : formatPhoneNumber(phoneTyped);

		if (!validation) {
			const res = await fetch('/api/addNotifyee', {
				method: 'post',
				body: JSON.stringify({
					type: useEmailAddress ? 'email' : 'phone',
					data
				})
			});
			if (res.status === 200) {
				successful = true;
				emailTyped = '';
				phoneTyped = '';
				validation = null;
			} else {
				validation =
					'Something weird happened 🧐. Please refresh and try again, or contact birdables@gmail.com';
			}
		}
	}
</script>

<div class="bg-white">
	<div class="max-w-7xl mx-auto pb-12 sm:px-6 lg:pb-16 lg:px-8 xl:px-0">
		<div
			class="py-10 px-6 bg-gray-900 rounded-3xl sm:py-16 sm:px-12 lg:p-20 lg:flex lg:items-center"
		>
			<div class="lg:w-0 lg:flex-1">
				<h2 class="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
					No egrets! Be the first to know when new Birdables hatch.
				</h2>
				<p class="mt-4 max-w-3xl md:text-lg text-gray-100">
					Sign up to receive an <button
						onclick={() => {
							useEmailAddress = true;
						}}
						class={`${!useEmailAddress && 'underline'}`}>email</button
					>
					or
					<button
						onclick={() => {
							useEmailAddress = false;
						}}
						class={`${useEmailAddress && 'underline'}`}>text</button
					> about big releases, rare sightings, and everything in between.
				</p>
			</div>
			<div class="mt-4 md:mt-12 sm:w-full lg:mt-0 lg:ml-8 lg:flex-1">
				<div class="flex items-center mb-4">
					<span class="mr-3" id="email-notifications">
						<button
							onclick={() => {
								useEmailAddress = true;
							}}
							class={`${useEmailAddress ? 'text-white' : 'text-gray-400'} text-base font-medium`}
							>Get Email Notifications</button
						>
					</span>
					<button
						onclick={toggle}
						type="button"
						class="bg-gray-900 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-gray-400 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-white focus:ring-offset-gray-900"
						role="switch"
						aria-checked="false"
						aria-labelledby="email-or-phone-notifications"
					>
						<span class="sr-only">Change notification type</span>
						<span
							aria-hidden="true"
							class={`${
								useEmailAddress ? 'translate-x-0' : 'translate-x-5'
							} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition ease-in-out duration-200`}
						>
							<span
								class={`${
									useEmailAddress
										? 'opacity-100 ease-in duration-200'
										: 'opacity-0 ease-out duration-100'
								} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
								aria-hidden="true"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"
									><path fill="none" d="M0 0h24v24H0z" /><path
										d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z"
									/></svg
								>
							</span>
							<span
								class={`${
									!useEmailAddress
										? 'opacity-100 ease-in duration-200'
										: 'opacity-0 ease-out duration-100'
								} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
								aria-hidden="true"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"
									><path fill="none" d="M0 0h24v24H0z" /><path
										d="M7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2h3.784zm2.011 0h3.99l.42-4h-3.99l-.42 4z"
									/></svg
								>
							</span>
						</span>
					</button>
					<span class="ml-3" id="phone-notifications">
						<button
							onclick={() => {
								useEmailAddress = false;
							}}
							class={`${!useEmailAddress ? 'text-white' : 'text-gray-400'} text-base font-medium`}
							>Get Text Notifications</button
						>
					</span>
				</div>

				<div class="relative">
					<form class="grid grid-cols-1 sm:grid-cols-2 gap-4" onsubmit={submitForm}>
						{#if useEmailAddress}
							<div class="relative">
								<input
									id="email"
									name="email"
									bind:value={emailTyped}
									type="text"
									autocomplete="email"
									class="peer w-full bg-gray-900 text-white border-gray-400 border-2 px-5 py-3 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-white focus:ring-offset-gray-900 rounded-md placeholder-transparent"
									placeholder="Email Address"
								/>
								<label
									for="email"
									class="
              absolute
              left-1/2
              md:left-0
              -translate-x-1/2
              md:translate-x-0
              text-sm 
              text-gray-300 
              -top-3
              rounded-full 
              bg-gray-900 
              px-
              transition-all
              peer-placeholder-shown:text-white 
              peer-placeholder-shown:top-3.5 
              peer-placeholder-shown:text-base 
              peer-placeholder-shown:px-0 
              peer-placeholder-shown:left-1/2
              md:peer-placeholder-shown:left-5
              peer-focus:left-1/2
              md:peer-focus:left-0
              peer-focus:text-sm
              peer-focus:text-gray-300
              peer-focus:-top-3
              peer-focus:rounded-full
              peer-focus:bg-gray-900
              peer-focus:px-4
              ">Email address</label
								>
							</div>
							<button
								type="submit"
								class="block w-full py-3 px-5 text-center bg-gray-500 border border-transparent rounded-full shadow-lg font-semibold text-white transition sm:inline-block sm:w-auto hover:ring-2 hover:ring-offset-4 hover:ring-offset-gray-900 hover:ring-white focus:ring-2 focus:ring-offset-4 focus:ring-offset-gray-900 focus:ring-white"
							>
								Notify me via email
							</button>
						{:else}
							<div class="relative">
						<input
									id="phone"
									name="phone"
									bind:value={phoneTyped}
									type="tel"
							autocomplete="tel"
									required
									class="peer w-full bg-gray-900 text-white border-gray-400 border-2 px-5 py-3 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-white focus:ring-offset-gray-900 rounded-md placeholder-transparent"
									placeholder="Phone Number"
								/>
								<label
									for="phone"
									class="
              absolute
              left-1/2
              md:left-0
              -translate-x-1/2
              md:translate-x-0
              text-sm 
              text-gray-300 
              -top-3
              rounded-full 
              bg-gray-900 
              px-
              transition-all
              peer-placeholder-shown:text-white 
              peer-placeholder-shown:top-3.5 
              peer-placeholder-shown:text-base 
              peer-placeholder-shown:px-0 
              peer-placeholder-shown:left-1/2
              md:peer-placeholder-shown:left-5
              peer-focus:left-1/2
              md:peer-focus:left-0
              peer-focus:text-sm
              peer-focus:text-gray-300
              peer-focus:-top-3
              peer-focus:rounded-full
              peer-focus:bg-gray-900
              peer-focus:px-4
              ">Phone Number</label
								>
							</div>
							<button
								type="submit"
								class="block w-full py-3 px-5 text-center bg-gray-500 border border-transparent rounded-full shadow-lg font-semibold text-white transition sm:inline-block sm:w-auto hover:ring-2 hover:ring-offset-4 hover:ring-offset-gray-900 hover:ring-white focus:ring-2 focus:ring-offset-4 focus:ring-offset-gray-900 focus:ring-white"
							>
								Notify me via text
							</button>
						{/if}
					</form>
					{#if validation}
						<div
							class="absolute -bottom-18 left-0 w-full bg-red-300 text-red-700 mt-4 rounded-lg p-4"
						>
							{validation}
						</div>
					{/if}
					{#if successful}
						<div
							class="absolute -bottom-18 left-0 w-full bg-green-200 text-green-700 border-green-700 border-2 mt-4 rounded-lg p-4"
						>
							Success! You're in the club!
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
