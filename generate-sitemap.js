import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mocking the resource data since we can't easily import TS in a simple node script without ts-node
// I will read the file and extract the IDs using regex to avoid dependency issues on Render
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourceDataPath = path.join(__dirname, 'src', 'resourceData.ts');
const resourceDataContent = fs.readFileSync(resourceDataPath, 'utf-8');

// Extract IDs from the resources array
const idRegex = /id:\s*'([^']*)'/g;
const ids = [];
let match;
while ((match = idRegex.exec(resourceDataContent)) !== null) {
    ids.push(match[1]);
}

const domain = 'https://smartreceptionai.xyz';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
    '',
    '/resource-hub',
    '/service-ai-chat',
    '/service-ai-voice',
    '/service-automation',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/terms-conditions'
];

const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const xmlFooter = `</urlset>`;

const staticUrls = staticPages.map(page => `
  <url>
    <loc>${domain}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

const dynamicUrls = ids.map(id => `
  <url>
    <loc>${domain}/resource-${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

const sitemapContent = `${xmlHeader}${staticUrls}${dynamicUrls}
${xmlFooter}`;

const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemapContent);

console.log(`Successfully generated sitemap with ${staticPages.length + ids.length} URLs at ${outputPath}`);
