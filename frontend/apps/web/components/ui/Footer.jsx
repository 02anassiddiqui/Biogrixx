import Link from 'next/link'
import { useState, useEffect } from 'react' // 🚀 Added useEffect for Hydration fix
import { Factory, Mail, Globe, ShieldCheck, Twitter, Linkedin, Github } from 'lucide-react'
import Trans from '../ui/Trans'

const navigation = {
  platform: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Biogas Guide', href: '/biogas-guide' },
    { label: 'Calculator', href: '/calculator' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' }, // ✅ Fixed: pages/privacy.js ke liye
  ],
}

export function Footer() {
  const [year, setYear] = useState(null)

  // 🚀 Hydration Fix: Year ko client-side par hi set karenge
  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* BRAND COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Factory size={24} />
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">Biogrix</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-neutral-500 font-medium">
              <Trans>Enterprise-grade utility management for sustainable biogas networks.</Trans>{" "}
              <Trans>Digitizing the future of community clean energy.</Trans>
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-neutral-800/50 hover:text-primary transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-neutral-800/50 hover:text-primary transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-neutral-800/50 hover:text-primary transition-colors"><Github size={18} /></a>
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <div className="lg:col-span-6 grid grid-cols-2">
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
                <Trans>Platform</Trans>
              </h4>
              <ul className="space-y-4">
                {navigation.platform.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors font-medium">
                      <Trans>{link.label}</Trans>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
                <Trans>Company</Trans>
              </h4>
              <ul className="space-y-4">
                {navigation.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors font-medium">
                      <Trans>{link.label}</Trans>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* STATUS COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
              <Trans>System Status</Trans>
            </h4>
            <div className="p-4 bg-neutral-800/30 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-2 text-primary mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  <Trans>Network Live</Trans>
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                <Trans>Monitoring nodes active across global infrastructure.</Trans>
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-neutral-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <a href="mailto:contact@biogrix.com" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-primary transition-colors">
              <Mail size={14} /> contact@biogrix.com
            </a>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
              <Globe size={14} />
              v2.4.0 <Trans>Deployment</Trans>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" />
              <Trans>ISO 27001 Certified</Trans>
            </div>
            <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-widest">
              © {year} <Trans>Biogrix Inc.</Trans>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}