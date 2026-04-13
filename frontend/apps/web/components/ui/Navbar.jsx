import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Button } from './Button'
import { Menu, X, Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import Trans from '../ui/Trans'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/biogas-guide', label: 'Biogas Guide' },
  { href: '/calculator', label: 'Calculator' },
]

// 🌍 Updated with English Names
const languages = [
  { code: 'English', label: 'English', sub: 'English' },
  { code: 'Hindi', label: 'हिन्दी', sub: 'Hindi' },
  { code: 'Bengali', label: 'বাংলা', sub: 'Bengali' },
  { code: 'Telugu', label: 'తెలుగు', sub: 'Telugu' },
  { code: 'Marathi', label: 'मराठी', sub: 'Marathi' },
  { code: 'Tamil', label: 'தமிழ்', sub: 'Tamil' },
  { code: 'Gujarati', label: 'ગુજરાતી', sub: 'Gujarati' },
  { code: 'Kannada', label: 'ಕನ್ನಡ', sub: 'Kannada' },
  { code: 'Odia', label: 'ଓଡ଼ିଆ', sub: 'Odia' },
  { code: 'Punjabi', label: 'ਪੰਜਾਬੀ', sub: 'Punjabi' },
  { code: 'Malayalam', label: 'മലയാളം', sub: 'Malayalam' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const { lang, setLang } = useLanguage()
  const langMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-neutral-900 uppercase">
            Biogrix<span className='text-primary text-2xl font-black'>.</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-neutral-600 hover:text-primary transition-colors"
            >
              <Trans>{link.label}</Trans>
            </Link>
          ))}

          {/* 🚀 PROFESSIONAL DROPDOWN WITH SUB-NAMES */}
          <div className="relative" ref={langMenuRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-3 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100 hover:bg-white hover:shadow-md transition-all duration-300 min-w-[140px]"
            >
              <Globe size={16} className="text-primary shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[11px] font-black uppercase tracking-tight text-neutral-800">
                  {languages.find(l => l.code === lang)?.label}
                </span>
                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                  {languages.find(l => l.code === lang)?.sub}
                </span>
              </div>
              <ChevronDown size={14} className={`ml-auto text-neutral-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-100 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in duration-200">
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-50 transition-all group"
                    >
                      <div className="flex flex-col items-start leading-tight">
                        <span className={`text-[12px] font-black ${lang === l.code ? 'text-primary' : 'text-neutral-700'}`}>
                          {l.label}
                        </span>
                        <span className="text-[9px] font-bold text-neutral-400 group-hover:text-emerald-600/60 uppercase tracking-widest">
                          {l.sub}
                        </span>
                      </div>
                      {lang === l.code && <Check size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button href="/contact" className="py-2 px-5 text-sm">
            <Trans>Contact Us</Trans>
          </Button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button className="md:hidden p-2 text-neutral-700" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-6 flex flex-col gap-6 h-screen overflow-y-auto pb-32">
          
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
              <Trans>Select Language</Trans>
            </span>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border transition-all ${
                    lang === l.code 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-95' 
                    : 'bg-neutral-50 border-neutral-100 text-neutral-600 active:scale-95'
                  }`}
                >
                  <span className="text-[13px] font-black">{l.label}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-widest ${lang === l.code ? 'text-white/70' : 'text-neutral-400'}`}>
                    {l.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-neutral-100 w-full" />

          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-xl font-black text-neutral-900" onClick={() => setOpen(false)}>
              <Trans>{link.label}</Trans>
            </Link>
          ))}
          <Button href="/contact" onClick={() => setOpen(false)} className="w-full py-5 text-lg font-black">
            <Trans>Contact Us</Trans>
          </Button>
        </div>
      )}
    </header>
  )
}