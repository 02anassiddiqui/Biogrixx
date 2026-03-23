import Head from 'next/head'
import { motion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { Button } from '../components/ui/Button'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us | Biogrix Utility Management</title>
      </Head>

      {/* --- HERO SECTION (Unchanged) --- */}
      <Section className="bg-white pt-24 pb-12">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter mb-8 leading-[0.9]">
              Contact <br />
              <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Biogrix.</span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed font-medium max-w-2xl">
              Our team is ready to assist you with platform demos, technical support, 
              or partnership inquiries.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* --- COMPACT FORM SECTION --- */}
      <Section primary className="overflow-hidden relative bg-gradient-to-r from-primary to-emerald-600 py-16">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: MINIMAL FORM (7 Columns) */}
            <form className="lg:col-span-7 space-y-8">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-white tracking-tight">Send a Message</h2>
                <p className="text-emerald-100/70 text-sm">Typical response: 2-4 hours.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">Name</label>
                  <input type="text" placeholder="Full name" className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium" />
                </div>
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">Email</label>
                  <input type="email" placeholder="name@company.com" className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium" />
                </div>
              </div>

              <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">How can we help?</label>
                <textarea rows={3} placeholder="Briefly describe your needs..." className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none resize-none font-medium" />
              </div>

              <Button variant="white" className="h-14 px-10 text-md font-bold group rounded-full shadow-xl">
                Send Message
                <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
            </form>

            {/* RIGHT: DIRECT INFO (5 Columns) */}
            <div className="lg:col-span-5 lg:pl-12 space-y-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0">
              <div className="space-y-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase">Email</p>
                    <a href="mailto:contact@biogrix.com" className="font-bold hover:text-emerald-200">contact@biogrix.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase">Direct Line</p>
                    <p className="font-bold">+1 (555) 000-BIOGRIX</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase">Location</p>
                    <p className="font-bold text-sm">Tech District, CA 94043</p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-5 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-4">
                <Clock className="text-primary shrink-0" size={24} />
                <p className="text-xs text-emerald-100 font-medium">
                  Utility support active. <br/> <span className="font-bold text-white">2-4h response window.</span>
                </p>
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </>
  )
}