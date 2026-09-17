<script>
	import { asset } from '$app/paths';
	import SEO from 'svelte-seo';

	import site from '#lib/info.js';
	import Breadcrumb from '#lib/components/Breadcrumb.svelte';
	import Link from '#lib/components/Link.svelte';
	import { urlFor } from '#lib/sanity-image-url.js';
	import { authorNamesToString } from '#lib/utils.js';

	let { data } = $props();
	let { authors } = data;
</script>

<SEO
	title={`${site.name} blog authors`}
	description={`${authorNamesToString(authors, true)} ${authors.length > 1 ? 'are' : 'is'} the ${
		site.name
	} blog author${authors.length > 1 ? 's' : ''}`}
	keywords={`${site.name} blog authors,${authorNamesToString(authors)}`}
	openGraph={{
		title: `${site.name} blog authors`,
		description: `${authorNamesToString(authors, true)} ${authors.length > 1 ? 'are' : 'is'} the ${
			site.name
		} blog author${authors.length > 1 ? 's' : ''}`,
		url: `${site.address}/blog/authors`,
		type: 'website',
		images: [
			{
				url: authors[0]?.image?.asset
					? urlFor(authors[0].image.asset).width(1200).quality(80)
					: `${site.address}/images/opengraph/index.webp}`,
				width: 1200,
				height: authors[0]?.image?.asset ? 1200 : 627,
				alt: `${site.name} blog authors`
			}
		]
	}}
	twitter={{
		site: `@${site.twitterHandle}`,
		title: `${site.name} blog authors`,
		description: `${authorNamesToString(authors, true)} ${authors.length > 1 ? 'are' : 'is'} the ${
			site.name
		} blog author${authors.length > 1 ? 's' : ''}`,
		image: authors[0]?.image?.asset
			? urlFor(authors[0].image.asset).width(1200).quality(80)
			: `${site.address}/images/opengraph/index.webp}`,
		imageAlt: `${site.name} blog authors`
	}}
	jsonLd={{
		logo: `${site.address}/images/logo.svg`,
		'@context': `http://schema.org`,
		'@type': `WebSite`,
		name: `${site.name} Authors`,
		url: `${site.address}/blog/authors`
	}}
/>

<section class="bg-gray-blue">
	<div class="max-w-7xl mx-auto pt-10 pb-12 px-4 sm:px-6 md:px-8">
		<Breadcrumb current="Authors" steps={[{ title: 'Blog', link: '/blog' }]} />
		<div class="md:flex md:justify-between items-end">
			<div class="max-w-3xl pt-8">
				<h2
					class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tighter lg:text-6xl"
				>
					Authors <span class="tracking-tight italic text-gray-300 text-4xl"
						>({authors.length})</span
					>
				</h2>
				<p class="mt-4 text-xl text-gray-500">These are the writers of the Birdables blog.</p>
			</div>
		</div>
	</div>
</section>

<div class="bg-white">
	<div class="mx-auto py-12 px-4 max-w-screen-xl sm:px-6 lg:px-8 lg:py-24">
		<div class="space-y-12">
			<ul
				class="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8"
			>
				{#each authors as author (author.pageInfo.slug.current)}
					<li>
						<Link href={`/blog/author/${author.pageInfo.slug.current}`} class="space-y-4">
							<img
								loading="lazy"
								class="object-cover aspect-[4/5] shadow-lg rounded-lg"
								src={author?.image?.asset
									? urlFor(author.image.asset).width(600).quality(80)
									: asset(`images/userImageNotFound.png`)}
								alt={author.pageInfo.name}
							/>

							<div class="space-y-2">
								<div class="text-lg leading-6 font-medium space-y-1">
									<h4>{author.pageInfo.name}</h4>
									{#if author.position}
										<p class="text-gray-600">{author.position}</p>
									{/if}
								</div>
							</div>
						</Link>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
