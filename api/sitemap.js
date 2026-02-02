import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const domain = 'https://smartreceptionai.xyz';

    // 1. Define Static Pages
    const staticPages = [
        '',
        '/about-us',
        '/contact-us',
        '/resource-hub',
        '/service-ai-chat',
        '/service-ai-voice',
        '/service-automation',
        '/privacy-policy',
        '/terms-conditions'
    ];

    // 2. Define Articles (Hardcoded to avoid runtime file access issues in Serverless)
    const articleSlugs = [
        'roi-of-first-impressions',
        'ai-vs-human-interaction',
        'maximizing-lead-conversion',
        'hidden-cost-of-missed-calls',
        'modern-telephone-etiquette',
        'data-privacy-communications',
        'scalability-on-demand',
        'evolution-of-front-desk',
        'bilingual-support-excellence',
        'productivity-hacks-outsourcing',
        'bridging-the-gap-crm',
        'anatomy-of-perfect-greeting',
        'reducing-no-shows-reminders',
        'silent-growth-loud-support',
        'communication-trends-2026',
        'case-study-legal',
        'case-study-healthcare',
        'case-study-real-estate',
        'case-study-financial',
        'case-study-home-services',
        'case-study-tech-startup',
        'case-study-high-end-retail',
        'case-study-senior-living',
        'case-study-education',
        'case-study-marketing-agency'
    ];

    const articleUrls = articleSlugs.map(slug => `/resource-${slug}`);

    // 3. Combine URLs
    // Use yesterday's date to be safe
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const allUrls = [
        ...staticPages.map(url => ({
            loc: `${domain}${url}`,
            lastmod: yesterday,
            changefreq: url === '' ? 'daily' : 'weekly',
            priority: url === '' ? '1.0' : '0.8'
        })),
        ...articleUrls.map(url => ({
            loc: `${domain}${url}`,
            lastmod: yesterday,
            changefreq: 'monthly',
            priority: '0.6'
        }))
    ];

    // 4. Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // 5. Send Response
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).send(xml);
}
