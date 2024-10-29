import fs from 'fs'
import path from 'path'
import { generateNameData } from '../lib/processNames'

const SITE_URL = 'https://whatdoesmybabynamemean.com'
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap')

async function generateSitemap() {
  const names = await generateNameData()
  const origins = [...new Set(names.map(name => name.aiDescription?.origin.toLowerCase()))]

  const staticPages = [
    '/',
    '/about',
    '/contact',
    '/origins',
    '/meanings',
    '/popular',
  ]

  const namePages = names.map(name => `/name/${name.name.toLowerCase()}`)
  const originPages = origins.map(origin => `/origins/${origin}`)

  const allPages = [...staticPages, ...namePages, ...originPages]

  const sitemaps = []
  const URLS_PER_SITEMAP = 5000

  for (let i = 0; i < allPages.length; i += URLS_PER_SITEMAP) {
    const sitemapUrls = allPages.slice(i, i + URLS_PER_SITEMAP)
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapUrls.map(url => `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  `).join('')}
</urlset>`

    const sitemapFileName = `sitemap-${Math.floor(i / URLS_PER_SITEMAP) + 1}.xml`
    fs.writeFileSync(path.join(SITEMAP_PATH, sitemapFileName), sitemapContent)
    sitemaps.push(sitemapFileName)
  }

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${SITE_URL}/${sitemap}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  `).join('')}
</sitemapindex>`

  fs.writeFileSync(path.join(SITEMAP_PATH, 'sitemap.xml'), sitemapIndex)
  console.log(`Generated ${sitemaps.length} sitemaps and sitemap index.`)
}

generateSitemap()