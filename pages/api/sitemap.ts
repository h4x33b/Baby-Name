import { NextApiRequest, NextApiResponse } from 'next'
import { generateNameData } from '@/lib/processNames'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const names = await generateNameData()
    const origins = [...new Set(names.map(name => name.aiDescription?.origin.toLowerCase()))]

    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/contact', changefreq: 'monthly', priority: 0.8 },
      { url: '/origins', changefreq: 'weekly', priority: 0.9 },
      { url: '/meanings', changefreq: 'weekly', priority: 0.9 },
      { url: '/popular', changefreq: 'daily', priority: 0.9 },
    ]

    const namePages = names.map(name => ({
      url: `/name/${name.name.toLowerCase()}`,
      changefreq: 'monthly',
      priority: 0.7,
    }))

    const originPages = origins.map(origin => ({
      url: `/origins/${origin}`,
      changefreq: 'weekly',
      priority: 0.8,
    }))

    const allPages = [...staticPages, ...namePages, ...originPages]

    const stream = new SitemapStream({ hostname: 'https://whatdoesmybabynamemean.com' })
    const xmlString = await streamToPromise(
      Readable.from(allPages).pipe(stream)
    ).then((data) => data.toString())

    res.writeHead(200, {
      'Content-Type': 'application/xml',
    })
    res.end(xmlString)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error generating sitemap' })
  }
}