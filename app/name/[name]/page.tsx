import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateNameData } from '@/lib/processNames'
import { Baby, Book, Globe, Heart, Sparkles, User } from 'lucide-react'

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const name = params.name.charAt(0).toUpperCase() + params.name.slice(1)
  return {
    title: `${name} - Name Meaning and Origin | What Does My Baby Name Mean?`,
    description: `Discover the meaning, origin, and significance of the name ${name}. Learn about its popularity, characteristics, and cultural importance.`,
  }
}

export async function generateStaticParams() {
  const names = await generateNameData()
  return names.map((name) => ({ name: name.name.toLowerCase() }))
}

export default async function NamePage({ params }: { params: { name: string } }) {
  const names = await generateNameData()
  const name = names.find((n) => n.name.toLowerCase() === params.name.toLowerCase())

  if (!name) {
    notFound()
  }

  const { aiDescription } = name

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{name.name}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="mr-2" />
              Meaning and Origin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong>Meaning:</strong> {aiDescription?.meaning}</p>
            <p><strong>Origin:</strong> {aiDescription?.origin}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2" />
              Cultural Significance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {aiDescription?.culturalSignificance.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" />
              Notable Bearers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {aiDescription?.notableBearers.map((bearer, index) => (
                <li key={index}>{bearer}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2" />
              Popularity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{aiDescription?.popularity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2" />
              Characteristics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {aiDescription?.characteristics.map((trait, index) => (
                <li key={index}>{trait}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Baby className="mr-2" />
              Variants and Pronunciation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong>Variants:</strong> {aiDescription?.variants.join(', ')}</p>
            <p><strong>Pronunciation:</strong> {aiDescription?.pronunciation}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}