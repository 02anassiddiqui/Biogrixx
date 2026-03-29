import Link from 'next/link'
import { useState } from 'react'
import { Button } from './Button'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/biogas-guide', label: 'Biogas Guide' },
  { href: '/calculator', label: 'Calculator' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
             <span className="text-white font-black text-xl">B</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-neutral-900">Biogrix</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-neutral-600 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/contact" className="py-2 px-5 text-sm">
            Contact Us
          </Button>
        </div>

        <button className="md:hidden p-2 text-neutral-700" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-lg font-medium text-neutral-700" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Button href="/contact" onClick={() => setOpen(false)}>Contact Us</Button>
        </div>
      )}
    </header>
  )
}
