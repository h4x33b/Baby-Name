import Link from 'next/link'
import { Baby, Book, Globe, Menu, Sparkles, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <Baby className="mr-2" />
          What Does My Baby Name Mean?
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/origins" className="flex items-center hover:underline">
            <Globe className="mr-1" size={18} />
            Origins
          </Link>
          <Link href="/meanings" className="flex items-center hover:underline">
            <Book className="mr-1" size={18} />
            Meanings
          </Link>
          <Link href="/popular" className="flex items-center hover:underline">
            <Sparkles className="mr-1" size={18} />
            Popular Names
          </Link>
          <Link href="/about" className="flex items-center hover:underline">
            <Info className="mr-1" size={18} />
            About
          </Link>
        </nav>
        <Button variant="ghost" className="md:hidden">
          <Menu />
        </Button>
      </div>
    </header>
  )
}