<script>
	import ExternalLink from './ExternalLink.svelte';
	import { browser } from '$app/env';

	let { title = 'Frequently Asked Questionssss', id = 'faq' } = $props();

	function scrollToSection(id, e) {
		if (browser) {
			e.preventDefault();
			document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
			setTimeout(() => {
				window.location.hash = encodeURIComponent(id);
			}, 1000);
		}
	}
</script>

<div class="bg-gray-blue" id={id}>
	<div
		class="max-w-7xl mx-auto py-12 px-4 divide-y divide-gray-200 sm:px-6 lg:py-24 lg:px-8"
	>
		<h2
			class="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-5xl"
		>{title}</h2>

		<div class="mt-8">
			<dl class="divide-y divide-gray-300">
				<div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
					<dt class="text-lg font-semibold text-gray-900 md:col-span-5">
						How do Birdables help birds?
					</dt>
					<dd class="mt-2 md:mt-0 md:col-span-7 text-gray-500 prose">
						<p>
							Great question! <strong>We donate a portion of profits</strong> to a bird conservation
							organization like the <ExternalLink href="https://www.birds.cornell.edu/"
								>Cornell Lab of Ornithology</ExternalLink
							>, <ExternalLink href="https://ebird.org/">eBird</ExternalLink>, <ExternalLink
								href="https://www.audubon.org/">Audubon</ExternalLink
							>, etc. More details on this are still to come, as it is still unclear the cost of
							running this operation. All donation amounts & recipients will be available on this
							website in the future.
						</p>

						<p>
							To make sure Birdables is not contributing to the destruction of bird habitats, <strong
								>100% recycled paper</strong
							> is used for all physical cards and envelope mailers. No trees are cut down for the creation
							of the cards.
						</p>

						<p>
							The Birdables NFT's (digital cards) are minted and distributed on the Polygon
							blockchain, which validates transactions using the Proof-of-Stake consensus model.
							This model <strong>consumes far less energy</strong> than the Proof-of Work model.
						</p>

						<p>
							Energy concise considerations were also made when creating this website. Each page is
							generated one time before uploading the files to the server. This allows for database
							& external API calls to be made once every “build” instead of on every page load by
							every user.
						</p>
					</dd>
				</div>
				<div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
					<dt class="text-lg font-semibold text-gray-900 md:col-span-5">
						What's the deal with offering physical & digital cards?
					</dt>
					<dd class="mt-2 md:mt-0 md:col-span-7 text-gray-500 prose">
						<p>
							Originally, just digital cards were going to be offered. But as we tossed around ideas
							and began showing people early versions of the cards, it became clear that a lot of
							people still wanted something tangible they could hold in their hand. But offering a
							physical product vastly multiplied the complexity of the project. Converting each card
							to a printer-friendly format, finding a printer, figuring out how and if it was
							possible to do all this without cutting down a tree or adding to our planet's urgent
							climate crisis, shipping. All these factors grew this originally small endeavor, to a
							still small, but more time-consuming process.
						</p>
					</dd>
				</div>
				<div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
					<dt class="text-lg font-semibold text-gray-900 md:col-span-5">
						What's the NFT version of a card?
					</dt>
					<dd class="mt-2 md:mt-0 md:col-span-7 text-gray-500 prose">
						<p>
							The NFT version of Birdables cards is a digital version that you keep in your crypto
							wallet. This NFT is proof of your ownership and is verifiable on the immutable <ExternalLink
								href="https://polygon.technology/">Polygon</ExternalLink
							> blockchain. Purchases of the NFT will come with access to the hi-res artwork, not available
							anywhere else. NFT's of Birdables cards are also more scarce than physical cards.
							<a
								onclick={(e) => {
									scrollToSection('rarity', e);
								}}
								href="#rarity">Learn more about the rarity.</a
							>
						</p>
					</dd>
				</div>
				<div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
					<dt class="text-lg font-semibold text-gray-900 md:col-span-5">
						Do physical cards come with card protectors or sleeves?
					</dt>
					<dd class="mt-2 md:mt-0 md:col-span-7 text-gray-500 prose">
						<p>
							Nope. The earth is already cluttered with single use plastics, and Birdables will not
							be a part of the problem. If you'd like to purchase your own, the cards are 6.4cm x
							8.9 cm (2.5 inches x 3.5 inches).
						</p>
					</dd>
				</div>
				<div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
					<dt class="text-lg font-semibold text-gray-900 md:col-span-5">
						Who is behind Birdables?
					</dt>
					<dd class="mt-2 md:mt-0 md:col-span-7 text-gray-500 prose">
						<p>
							Ken Jones. An amature birder, dog-foster dad, designer, music producer, and co-owner
							of the web design studio, <ExternalLink href="https://allday.io">AllDay</ExternalLink
							>. Birdables is very much a pandemic idea turned to creation.
						</p>
					</dd>
				</div>
				<div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
					<dt class="text-lg font-semibold text-gray-900 md:col-span-5">
						Can I support Birdables without purchasing a card?
					</dt>
					<dd class="mt-2 md:mt-0 md:col-span-7 text-gray-500 prose">
						<p>
							Totes! Ken would love to upgrade his birding gear & travel to provide a better end
							product. You can <a
								target="_blank"
								rel="noopener noreferrer"
								href="https://ko-fi.com/ken_jones">donate to Birdables (Ken) here</a
							>.
						</p>
					</dd>
				</div>
				<div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
					<dt class="text-lg font-semibold text-gray-900 md:col-span-5">
						Can I suggest my favorite bird for a card?
					</dt>
					<dd class="mt-2 md:mt-0 md:col-span-7 text-gray-500 prose">
						<p>
							Soon! We have an internal list of birds we want to create cards for initially, mainly
							so that we cover multiple regions and types of birds. But after that, we'll open a way
							for you to suggest a bird you'd like to see.
						</p>
					</dd>
				</div>
				<div class="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
					<dt class="text-lg font-semibold text-gray-900 md:col-span-5">How do I get in touch?</dt>
					<dd class="mt-2 md:mt-0 md:col-span-7 text-gray-500 prose">
						<p>
							<ExternalLink href="mailto:birdables@gmail.com">birdables@gmail.com</ExternalLink>.
						</p>
					</dd>
				</div>
			</dl>
		</div>
	</div>
</div>
