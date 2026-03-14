import Link from 'next/link'
import { Factory, Mail } from 'lucide-react'

const links = [
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/biogas-guide', label: 'Biogas Guide' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-500">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-2">
            <Factory className="text-primary" size={24} />
            <span className="text-white font-bold text-lg">Biogrix</span>
          </div>
          <div className="flex flex-wrap gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-400 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center gap-4">
          <a
            href="mailto:contact@biogrix.com"
            className="flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors"
          >
            <Mail size={18} />
            contact@biogrix.com
          </a>
          <span className="text-sm text-neutral-600">
            Biogas utility management platform. Clean energy for communities.
          </span>
        </div>
      </div>
    </footer>
  )
}
