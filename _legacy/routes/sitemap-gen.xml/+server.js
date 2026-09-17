import site from '#lib/info.js';
import { fetchLiveBirds } from '#lib/birds.js';

export const prerender = true;

export async function GET() {
	const birds = fetchLiveBirds();

	const pages = [
		{
			loc: `${site.address}`,
			changefreq: `weekly`,
			priority: `0.7`
		},
		{
			loc: `${site.address}/about`,
			changefreq: `weekly`,
			priority: `0.6`
		},
		{
			loc: `${site.address}/cards`,
			changefreq: `daily`,
			priority: `0.7`
		}
	];
	const body = render(birds, pages);

	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	};

	return new Response(body, { headers });
}

const render = (birds, pages) => `<?xml version="1.0" encoding="UTF-8" ?>
  <urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
  >
  ${pages
		.map(
			(page) => `<url>
        <loc>${page.loc}/</loc>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
      </url>`
		)
		.join('')}
  ${birds
		.map(
			(bird) => `<url>
      <loc>${site.address}/bird/${bird.slug}/</loc>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
    </url>`
		)
		.join('')}
  </urlset>
`;
