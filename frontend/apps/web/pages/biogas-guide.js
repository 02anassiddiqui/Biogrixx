import Head from 'next/head';
import { motion } from 'framer-motion';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { 
  Leaf, 
  Flame, 
  Droplets, 
  Wind, 
  CheckCircle2, 
  ArrowDown,
  ArrowRight, // Added for the lifecycle connectors
  Globe,
  Zap,
  Info
} from 'lucide-react';

export default function BiogasGuide() {
  const stats = [
    { label: "Methane Purity", value: "65%", icon: <Wind size={20} /> },
    { label: "Renewable Nature", value: "100%", icon: <Leaf size={20} /> },
    { label: "Carbon Impact", value: "Net Zero", icon: <Globe size={20} /> },
    { label: "Energy Efficiency", value: "High", icon: <Zap size={20} /> },
  ];

  const processSteps = [
    {
      title: "Feedstock Collection",
      desc: "Organic matter such as crop residues and livestock manure is collected.",
      icon: <Leaf className="text-emerald-600" size={24} />
    },
    {
      title: "Anaerobic Digestion",
      desc: "Bacteria break down waste in oxygen-free digesters to produce gas.",
      icon: <Droplets className="text-blue-600" size={24} />
    },
    {
      title: "Gas Scrubbing",
      desc: "Raw gas is treated to remove impurities and increase methane purity.",
      icon: <Wind className="text-sky-600" size={24} />
    },
    {
      title: "Distribution",
      desc: "Clean gas is sent through Biogrix-monitored grids to household burners.",
      icon: <Flame className="text-orange-600" size={24} />
    }
  ];

  return (
    <>
      <Head>
        <title>Biogas Guide | Biogrix Digital Infrastructure</title>
      </Head>

      {/* --- HERO SECTION --- */}
      <Section className="bg-white pb-0">
        <Container>
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-1.5 rounded-full bg-emerald-50 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100"
            >
              The Science of Clean Energy
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-neutral-900 leading-[0.9] tracking-tighter mb-8">
              Turning Waste <br />
              <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Into Wealth.</span>
            </h1>
            <p className="text-xl text-neutral-500 max-w-2xl leading-relaxed mb-12">
              A comprehensive deep-dive into the anaerobic digestion cycle and the digital systems that make distribution possible.
            </p>
            <div className="animate-bounce text-neutral-300">
              <ArrowDown size={32} />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- DEFINITION BLOCK (Green) --- */}
      <Section primary className="rounded-t-[4rem] md:rounded-t-[6rem] -mt-12 relative z-10 bg-gradient-to-r from-primary to-emerald-600">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Background SVG Accent */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="transparent" strokeWidth="0.5" />
              </svg>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                What exactly is <br />Biogas?
              </h2>
              <p className="text-emerald-50/80 text-lg leading-relaxed">
                Biogas is a carbon-neutral fuel produced through **Anaerobic Digestion**. It occurs when organic matter—like crop residues, animal manure, or food scraps—is broken down by bacteria in an oxygen-free environment.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
                    <div className="text-emerald-300 mb-2">{stat.icon}</div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-200/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-[3rem] p-10 shadow-3xl">
                <blockquote className="text-2xl font-bold text-neutral-900 italic leading-snug">
                  "Biogas is a closed-loop energy source. The carbon it releases was already part of the natural cycle, unlike fossil fuels."
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                   <div className="w-12 h-1 bg-primary rounded-full" />
                   <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-center">Scientific Consensus</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- THE DISTRIBUTION PROCESS (Updated Section) --- */}
      <Section alt className="rounded-[3rem] mx-4 md:mx-8 relative z-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">The Lifecycle</h3>
            <h4 className="text-4xl font-bold text-neutral-900">From Digester to Burner</h4>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>
                <h5 className="text-lg font-extrabold text-neutral-900 mb-3">{step.title}</h5>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                {/* Visual arrow connector for large screens */}
                {i < 3 && (
                  <ArrowRight className="hidden lg:block absolute -right-6 top-6 text-neutral-200" size={20} />
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- DARK IMPACT SECTION --- */}
      <Section dark>
        <Container>
          <div className="bg-neutral-900 rounded-[3rem] p-12 md:p-20 overflow-hidden relative">

            {/* Background SVG Accent */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="transparent" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            
            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <h3 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Why Biogrix <br />Infrastructure?</h3>
                <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                  Management is the missing link in the biogas chain. Without Biogrix, plants suffer from data gaps, revenue loss, and maintenance delays.
                </p>
                <ul className="space-y-4">
                  {["99.9% Meter Accuracy", "Automated Revenue Recovery", "Digital Maintenance Logs"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-white">
                      <CheckCircle2 className="text-primary" size={20} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary blur-[80px] opacity-20" />
                  <div className="relative bg-neutral-950 border border-neutral-800 p-8 rounded-3xl text-center">
                    <p className="text-5xl font-black text-white mb-2">94%</p>
                    <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Reduction in Billing Errors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}