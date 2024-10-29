import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateNameData } from '@/lib/processNames'

export async function generateMetadata({ params }: { params: { origin: string } }): Promise<Metadata> {
  const origin = params.origin.charAt(0).toUpperCase() + params.origin.slice(1)
  return {
    title: `${origin} Names | What Does My Baby Name Mean?`,
    description: `Explore baby names with ${origin.toLowerCase()} origins, their meanings, and cultural significance.`,
  }
}

export async function generateStaticParams() {
  const origins = [
    'african', 'arabic', 'celtic', 'chinese', 'english', 'french', 'german', 'greek',
    'hebrew', 'indian', 'irish', 'italian', 'japanese', 'latin', 'norse', 'persian',
    'russian', 'sanskrit', 'scandinavian', 'scottish', 'slavic', 'spanish', 'welsh'
  ]
  return origins.map((origin) => ({ origin }))
}

export default async function OriginPage({ params }: { params: { origin: string } }) {
  const names = await generateNameData()
  const origin = params.origin.charAt(0).toUpperCase() + params.origin.slice(1)
  
  const originNames = names.filter((name) => 
    name.aiDescription?.origin.toLowerCase().includes(params.origin.toLowerCase())
  ).slice(0, 100) // Limit to 100 names for performance

  if (originNames.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{origin} Names</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {originNames.map((name) => (
          <Card key={name.name}>
            <CardHeader>
              <CardTitle>{name.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{name.aiDescription?.meaning}</p>
              <Link href={`/name/${name.name.toLowerCase()}`} className="text-primary hover:underline">
                Learn more
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}