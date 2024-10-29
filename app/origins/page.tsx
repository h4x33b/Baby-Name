import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Name Origins | What Does My Baby Name Mean?',
  description: 'Explore baby names by their origins and cultural backgrounds.',
}

const origins = [
  'African', 'Arabic', 'Celtic', 'Chinese', 'English', 'French', 'German', 'Greek',
  'Hebrew', 'Indian', 'Irish', 'Italian', 'Japanese', 'Latin', 'Norse', 'Persian',
  'Russian', 'Sanskrit', 'Scandinavian', 'Scottish', 'Slavic', 'Spanish', 'Welsh'
]

export default function OriginsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Name Origins</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {origins.map((origin) => (
          <Card key={origin}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2" />
                {origin} Names
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Discover names with {origin.toLowerCase()} origins and their meanings.</p>
              <Link href={`/origins/${origin.toLowerCase()}`} className="text-primary hover:underline">
                Explore {origin} Names
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}