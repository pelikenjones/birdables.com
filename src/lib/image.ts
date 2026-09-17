// The default export is deprecated in favour of this named one.
import { createImageUrlBuilder } from '@sanity/image-url';
import type { ImageUrlBuilder, SanityImageSource } from '@sanity/image-url';
import { sanityClient } from 'sanity:client';

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource): ImageUrlBuilder {
	return builder.image(source).auto('format');
}

/** Widths the card art and photography are actually laid out at. */
export const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280, 1600] as const;

/**
 * Sanity serves any width you ask for, so the srcset is ours to choose. Cap it
 * at the largest size the layout uses — shipping a 2000px card into a 320px slot
 * is the single easiest Lighthouse regression to introduce here.
 */
export function buildSrcSet(
	source: SanityImageSource,
	widths: readonly number[] = DEFAULT_WIDTHS
): string {
	return widths.map((w) => `${urlFor(source).width(w).url()} ${w}w`).join(', ');
}

/**
 * The 20px base64 preview Sanity generates for every asset. Projected as
 * `"lqip": asset->metadata.lqip` and used as a background behind the real image
 * so the blur-up costs no extra request.
 */
export function lqipStyle(lqip?: string | null): string | undefined {
	if (!lqip) return undefined;
	return `background-image:url(${lqip});background-size:cover;background-position:center`;
}
