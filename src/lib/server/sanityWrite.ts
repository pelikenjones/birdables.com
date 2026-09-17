/**
 * Server-only Sanity client. Holds a write token, so it must never be imported
 * from anything that reaches the browser — only from src/pages/api/, which is
 * `prerender = false`.
 */
import { createClient } from '@sanity/client';

const token = import.meta.env.SANITY_WRITE_TOKEN;

export const writeClient = token
	? createClient({
			projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
			dataset: import.meta.env.PUBLIC_SANITY_DATASET,
			apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
			token,
			useCdn: false
		})
	: null;

/**
 * Fixed-window limiter. Serverless instances don't share memory, so this
 * throttles a burst hitting one warm instance rather than enforcing a global
 * cap — enough to blunt a naive script, not real protection.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
	const now = Date.now();
	const entry = hits.get(key);

	if (!entry || now > entry.resetAt) {
		hits.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}
	if (entry.count >= limit) return false;

	entry.count++;
	return true;
}

export function clientIp(request: Request): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
		request.headers.get('x-real-ip') ??
		'unknown'
	);
}

export const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' }
	});
