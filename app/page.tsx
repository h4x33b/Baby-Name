import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Baby, Book, Globe, Heart, Info, List, Mail, Sparkles, User } from "lucide-react"
import Image from "next/image"

export default function Homepage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover the Meaning of Your Baby's Name</h1>
        <p className="text-xl text-muted-foreground mb-6">Explore meanings, origins, and popularity of thousands of names</p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2" />
              Name Origins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Explore names from various cultural backgrounds and their historical significance.</p>
            <Button variant="link" className="mt-2">
              View Origins
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="mr-2" />
              Name Meanings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Discover the hidden meanings and symbolism behind thousands of names.</p>
            <Button variant="link" className="mt-2">
              Explore Meanings
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2" />
              Popular Names
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>See trending names and their popularity over time across different regions.</p>
            <Button variant="link" className="mt-2">
              View Popular Names
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Explore Name Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Biblical', 'Nature', 'Vintage', 'Modern', 'Royal', 'Mythological', 'Literary', 'Celestial'].map((category) => (
            <Link href={`/category/${category.toLowerCase()}`} key={category} className="bg-muted p-4 rounded-lg text-center hover:bg-muted/80 transition-colors">
              <h3 className="font-semibold mb-2">{category} Names</h3>
              <p className="text-sm text-muted-foreground">Explore {category.toLowerCase()} inspired names</p>
            </Link>
          ))}
        
        </div>
      </section>

      <section className="bg-primary text-primary-foreground p-6 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">Name Trivia</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-primary-foreground text-primary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2" />
                Did You Know?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>The most popular baby names often change every decade, reflecting cultural shifts and trends.</p>
            </CardContent>
          </Card>
          <Card className="bg-primary-foreground text-primary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2" />
                Global Names
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Some names, like Maria and Mohammed, are popular across many different cultures and countries.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted p-6 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">Featured Names</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Sophia', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan'].map((name) => (
            <Link href={`/name/${name.toLowerCase()}`} key={name} className="bg-background p-4 rounded shadow hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{name}</h3>
              <p className="text-sm text-muted-foreground">Click to learn more about the name {name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}