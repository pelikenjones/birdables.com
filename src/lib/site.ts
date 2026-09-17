import { sanityClient } from 'sanity:client';
import { siteSettingsQuery } from './queries';
import type { SiteSettingsQueryResult } from './sanity.types';

/**
 * siteSettings is read by the nav, the footer and the FAQ. In a static build
 * every page would refetch it, so memoise for the life of the build.
 */
let cached: Promise<SiteSettingsQueryResult> | null = null;

export function getSiteSettings(): Promise<SiteSettingsQueryResult> {
	cached ??= sanityClient.fetch(siteSettingsQuery);
	return cached;
}
