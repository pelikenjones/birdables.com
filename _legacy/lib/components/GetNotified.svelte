<script>
	import { formatPhoneNumber, emailIsValid } from '#lib/utils.js';
	let useEmailAddress = true;
	let emailTyped;
	let phoneTyped;
	let validation;
	let successful = false;

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

<div class="py-8 px-4 sm:px-6 lg:px-16 pt-8 sm:py-16">
	<div class="mx-auto rounded-3xl bg-gray-900 max-w-7xl">
		<div
			class="max-w-3xl rounded-3xl bg-gray-900 mx-auto text-center py-16 px-4 sm:py-24 sm:px-6 lg:px-8"
		>
			<h2 class="text-xl md:text-2xl tracking-tight text-white">
				<span class="block text-3xl md:text-5xl font-extrabold">No Egrets!</span>
				<span class="block mt-4">Be the first to know when new Birdables hatch.</span>
			</h2>
			<div class="relative mx-auto mt-8 max-w-md">
				<form class="grid grid-cols-1 gap-4" onsubmit={submitForm}>
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
							Notify me
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
