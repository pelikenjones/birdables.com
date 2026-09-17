import { browser } from '$app/env';
import { PUBLIC_POSTHOG_KEY } from '$app/env/public';
import posthog from 'posthog-js';

export const load = async () => {
	if (browser && PUBLIC_POSTHOG_KEY) {
		posthog.init(PUBLIC_POSTHOG_KEY, {
			api_host: 'https://us.i.posthog.com',
			person_profiles: 'always'
		});
	}
	return;
};
