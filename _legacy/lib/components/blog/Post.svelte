<script>
  import Link from "#lib/components/Link.svelte";
  import PortableText from "#lib/components/PortableText.svelte";
  import { truncate, toPlainText } from "#lib/utils.js";
  import { urlFor } from '#lib/sanity-image-url.js'

  let { post } = $props();
</script>

<div>
<Link href={`/blog/${post.pageInfo.slug.current}`} class="block">
    {#if post.image}
      <img loading=lazy class="aspect-video w-full object-cover shadow-lg rounded-lg mb-4" src={urlFor(post.image.asset).quality(80).width(822)} alt={post.pageInfo.name}>
    {/if}
    <p class="text-sm leading-5 text-gray-500">
      <time datetime={new Date(post.publishedAt)}>{new Date(post.publishedAt).toDateString()}</time>
    </p>
    <h3 class="mt-2 text-xl leading-7 font-semibold text-gray-900">
      {post.pageInfo.name}
    </h3> 
      {#if post.excerpt }
        <PortableText content={post.excerpt} class="mt-3 text-base leading-6 text-gray-500" />
      {:else}
        <p class="mt-3 text-base leading-6 text-gray-500">
          {truncate(toPlainText(post.body))}
        </p>
      {/if}
      </Link>
  <div class="mt-3">
    <Link href={`/blog/${post.pageInfo.slug.current}`} class="text-base leading-6 underline font-semibold text-gray-900 hover:text-beak-600 transition ease-in-out duration-150">
      Read post
    </Link>
  </div>
</div>
