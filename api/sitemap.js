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

    // 2. Try to read Articles from resourceData.ts
    // In Vercel Serverless, source files might not be available, so we try-catch.
    let articleUrls = [];
    try {
        const resourceDataPath = path.join(process.cwd(), 'src', 'resourceData.ts');
        if (fs.existsSync(resourceDataPath)) {
            const content = fs.readFileSync(resourceDataPath, 'utf-8');
            const matches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
            for (const match of matches) {
                if (match[1]) {
                    articleUrls.push(`/resource-${match[1]}`);
                }
            }
        }
    } catch (e) {
        console.warn('Could not read resourceData.ts', e);
    }

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
