<script>
	let { text, image, url, hashtags, via, related } = $props();

	let query = $state();
	let href = $state();

	function open(e, site) {
		e.preventDefault();

		if (site) {
			const w = 600;
			const h = 400;
			const x = (screen.width - w) / 2;
			const y = (screen.height - h) / 2;
			const features = `width=${w},height=${h},left=${x},top=${y}`;

			if (site === 'twitter') {
				query = [
					text && `text=${encodeURIComponent(text)}`,
					url && `url=${encodeURIComponent(url)}`,
					hashtags && `hashtags=${hashtags}`,
					via && `via=${encodeURIComponent(via)}`,
					related && `related=${encodeURIComponent(related)}`
				]
					.filter(Boolean)
					.join('&');
				href = `https://twitter.com/intent/tweet?${query}`;
			} else if (site === 'facebook') {
				query = [
					1 === 1 && `app_id=966242223397117`,
					url && `link=${encodeURIComponent(url)}`,
					image && `picture=${encodeURIComponent(image)}`,
					1 === 1 && `name=Birdables`,
					text && `caption=${encodeURIComponent(text)}`,
					text && `description=${encodeURIComponent(text)}`,
					via && `via=${encodeURIComponent(via)}`,
					related && `related=${encodeURIComponent(related)}`
				]
					.filter(Boolean)
					.join('&');
				href = `https://www.facebook.com/dialog/feed?${query}`;
			} else if (site === 'email') {
				href = `mailto:?subject=${text}&body=${url}`;
			}
			window.open(href, '_blank', features);
		}
	}
</script>

<ul class="flex w-full items-center justify-around md:justify-start space-x-6 mt-4">
	<li>
		<button
			data-share="twitter"
			class="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
			onclick={(e) => {
				open(e, 'twitter');
			}}
		>
			<span class="sr-only">Share on Twitter</span>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
				><path fill="none" d="M0 0h24v24H0z" /><path
					fill="currentColor"
					d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
				/></svg
			>
		</button>
	</li>
	<li>
		<a
			href="https://instagram.com/birdables_cards"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
		>
			<span class="sr-only">Share on Instagram</span>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
				><path fill="none" d="M0 0h24v24H0z" /><path
					fill="currentColor"
					d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.25a1.25 1.25 0 0 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 4c-2.474 0-2.878.007-4.029.058-.784.037-1.31.142-1.798.332-.434.168-.747.369-1.08.703a2.89 2.89 0 0 0-.704 1.08c-.19.49-.295 1.015-.331 1.798C4.006 9.075 4 9.461 4 12c0 2.474.007 2.878.058 4.029.037.783.142 1.31.331 1.797.17.435.37.748.702 1.08.337.336.65.537 1.08.703.494.191 1.02.297 1.8.333C9.075 19.994 9.461 20 12 20c2.474 0 2.878-.007 4.029-.058.782-.037 1.309-.142 1.797-.331.433-.169.748-.37 1.08-.702.337-.337.538-.65.704-1.08.19-.493.296-1.02.332-1.8.052-1.104.058-1.49.058-4.029 0-2.474-.007-2.878-.058-4.029-.037-.782-.142-1.31-.332-1.798a2.911 2.911 0 0 0-.703-1.08 2.884 2.884 0 0 0-1.08-.704c-.49-.19-1.016-.295-1.798-.331C14.925 4.006 14.539 4 12 4zm0-2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2z"
				/></svg
			>
		</a>
	</li>
	<li>
		<button
			href="#"
			data-share="facebook"
			class="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
			onclick={(e) => {
				open(e, 'facebook');
			}}
		>
			<span class="sr-only">Share on Facebook</span>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
				><path fill="none" d="M0 0h24v24H0z" /><path
					fill="currentColor"
					d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"
				/></svg
			>
		</button>
	</li>
	<li>
		<button
			data-share="email"
			class="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
			onclick={(e) => {
				open(e, 'email');
			}}
		>
			<span class="sr-only">Share via email</span>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
				><path fill="none" d="M0 0h24v24H0z" /><path
					fill="currentColor"
					d="M22 20.007a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V19h18V7.3l-8 7.2-10-9V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16.007zM4.434 5L12 11.81 19.566 5H4.434zM0 15h8v2H0v-2zm0-5h5v2H0v-2z"
				/></svg
			>
		</button>
	</li>
</ul>
