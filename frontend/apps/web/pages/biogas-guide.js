import Head from "next/head";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Flame,
  Droplets,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  Truck,
  Timer,
  MapPin,
  Info,
  Globe,
  Home
} from "lucide-react";
import Link from "next/link";

// --- 1. DATA DEFINITIONS (Defined outside to avoid ReferenceErrors) ---
const QUICK_FACTS = [
  { label: "1 Cow Yield", value: "10kg Dung / Day", icon: <Truck size={20} /> },
  { label: "Gas Production", value: "0.04 m³ / kg Dung", icon: <Zap size={20} /> },
  { label: "Cooking Time", value: "2-3 Hours / m³", icon: <Flame size={20} /> },
  { label: "Mix Ratio", value: "1:1 (Dung : Water)", icon: <Droplets size={20} /> },
];

const PLANT_SIZES = [
  { size: "2 m³", houses: "1-2 Houses", cost: "₹25k - ₹35k", land: "250 sq ft" },
  { size: "4 m³", houses: "3-4 Houses", cost: "₹45k - ₹55k", land: "450 sq ft" },
  { size: "6 m³", houses: "5-6 Houses", cost: "₹65k - ₹80k", land: "600 sq ft" },
  { size: "10 m³", houses: "8-10 Houses", cost: "₹95k - ₹1.2L", land: "850 sq ft" },
];

// ✅ FIXED: Added 'img' property to each step
const PROCESS_STEPS = [
  { 
    title: "Dung Collection", 
    desc: "Collect fresh dung daily from the cattle shed.",
    img: "/images/bio_image_7.jpeg" 
  },
  { 
    title: "Preparation", 
    desc: "Mix dung with an equal amount of water (1:1 ratio).",
    img: "/images/bio_image_5.jpeg" 
  },
  { 
    title: "Feeding", 
    desc: "Pour the slurry into the inlet tank of the digester.",
    img: "/images/bio_image_3.jpeg" 
  },
  { 
    title: "Production", 
    desc: "Wait 2-3 days for gas to start forming naturally.",
    img: "/images/bio_image_4.jpeg" 
  },
  { 
    title: "Usage", 
    desc: "Clean gas flows directly to your kitchen stove.",
    img: "/images/bio_image_2.jpeg" 
  },
];

export default function BiogasGuide() {
  return (
    <div className="bg-white text-neutral-900 font-sans">
      <Head>
        <title>Biogas Practical Guide | Biogrix</title>
      </Head>

      {/* --- 1. HERO SECTION --- */}
      <Section className="bg-white pb-0">
        <Container>
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-1.5 rounded-full bg-emerald-50 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100"
            >
              Biogas Guide for Villages
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black text-neutral-900 leading-[0.9] tracking-tighter mb-8">
              Build Your Own Gas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r italic from-primary to-emerald-600 ">
                System from Dung.
              </span>
            </h1>
            <p className="text-xl text-neutral-500 max-w-2xl leading-relaxed mb-12 font-medium">
              A practical handbook for farmers and village operators to achieve energy freedom.
            </p>
            <Link href="/calculator">
               <Button className="h-16 px-12 text-lg font-black  rounded-2xl shadow-xl uppercase tracking-tight">
                 Check Plant Feasibility
               </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* --- 2. QUICK FACTS --- */}
      <Section className="py-12 bg-neutral-50 border-y border-neutral-100">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {QUICK_FACTS.map((fact, i) => (
              <div key={i} className="space-y-2">
                <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{fact.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-neutral-900">{fact.value.split(' ')[0]}</span>
                  <span className="text-sm font-bold text-neutral-500">{fact.value.split(' ').slice(1).join(' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- 3. STRUCTURE (Image Heavy) --- */}
      <Section className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-[3.5rem] overflow-hidden shadow-2xl border border-neutral-100 bg-neutral-100 aspect-video">
              <img src="/images/bio_image_10.jpeg" alt="Biogas Plant Structure" className="w-full h-full object-cover" />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-black  uppercase tracking-tighter">What is a <span className="text-primary">Biogas Plant?</span></h2>
              <p className="text-lg text-neutral-500 leading-relaxed font-medium">
                It is a simple underground tank. When you mix dung and water, bacteria create gas that collects in the dome and goes to your kitchen through a pipe.
              </p>
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex gap-4">
                 <Info size={24} className="text-emerald-700 shrink-0" />
                 <p className="text-sm font-bold text-emerald-800 ">
                   Tip: Place the plant in a sunny spot. Heat helps bacteria produce gas faster.
                 </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 4. PROCESS (Vertical Flow with Images) --- */}
      <Section className="bg-neutral-950 py-24 rounded-[4rem] mx-4 md:mx-8">
        <Container narrow>
          <h2 className="text-4xl font-black  text-white uppercase tracking-tighter text-center mb-24">The 5-Step Process</h2>
          <div className="space-y-0 relative">
            {/* The vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
            
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-center justify-between mb-24 last:mb-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* ✅ FIXED: Image is now called from the array */}
                <div className="w-full md:w-5/12 rounded-[2.5rem] overflow-hidden border border-white/5 mb-8 md:mb-0 shadow-2xl">
                   <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="z-10 absolute left-0 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full border-4 border-neutral-950 flex items-center justify-center font-black text-white  shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  {i + 1}
                </div>

                <div className="w-full md:w-5/12 pl-16 md:pl-0 text-left md:text-left">
                  <h3 className="text-2xl font-black text-white  uppercase mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-neutral-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- 5. PLANT SIZE TABLE --- */}
      <Section className="py-24">
        <Container>
          <h2 className="text-4xl font-black  uppercase text-center mb-16 tracking-tighter">Compare Plant Sizes</h2>
          <div className="overflow-hidden border border-neutral-100 rounded-[2.5rem] shadow-xl">
            <table className="w-full text-left bg-white">
              <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 border-b">
                <tr>
                  <th className="p-8">Plant Capacity</th>
                  <th className="p-8">Houses Supported</th>
                  <th className="p-8">Cost Estimate</th>
                  <th className="p-8">Land Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {PLANT_SIZES.map((row, i) => (
                  <tr key={i} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-8 font-black  text-xl">{row.size}</td>
                    <td className="p-8 font-bold text-neutral-500">{row.houses}</td>
                    <td className="p-8 font-black text-emerald-600  text-lg">{row.cost}</td>
                    <td className="p-8 font-bold text-neutral-400">{row.land}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* --- 6. HIGHLIGHT BOX --- */}
      <Section className="py-12">
        <Container>
          <div className="bg-primary p-12 md:p-20 rounded-[4rem] text-white relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(16,185,129,0.4)]">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl font-black  uppercase tracking-tighter mb-6">Village Impact</h3>
                <div className="space-y-6">
                  <p className="text-5xl md:text-6xl font-black  tracking-tight">10 Cows = <br/> 5 Houses</p>
                  <p className="text-lg font-bold opacity-80 leading-relaxed">
                    A small village cluster can save up to ₹6,000 every month combined. No smoke, no soot, just clean energy.
                  </p>
                </div>
              </div>
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
                <img src="/images/bio_image_2.jpeg" alt="Village Biogas" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 7. BENEFITS & MISTAKES --- */}
      <Section className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-black  uppercase mb-10">Why Switch?</h2>
              <div className="space-y-6">
                {[
                  { t: "Save Money", d: "Zero monthly LPG bills." },
                  { t: "Clean Kitchen", d: "Healthy air for your family." },
                  { t: "Organic Slurry", d: "Natural fertilizer for your crops." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <CheckCircle2 className="text-primary shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-black  uppercase text-neutral-900 tracking-tight">{item.t}</p>
                      <p className="text-sm font-medium text-neutral-500">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-100 p-10 rounded-[3.5rem] self-start shadow-sm">
              <h3 className="flex items-center gap-3 text-orange-800 text-xl font-black  uppercase mb-8">
                <AlertTriangle size={24} /> Avoid Mistakes
              </h3>
              <ul className="space-y-5">
                <li className="flex gap-3 text-sm font-bold text-orange-900/80 ">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></div>
                  Mixing more than 1:1 water ruins gas production.
                </li>
                <li className="flex gap-3 text-sm font-bold text-orange-900/80 ">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></div>
                  Skipping a day of feeding stops the system cycle.
                </li>
                <li className="flex gap-3 text-sm font-bold text-orange-900/80 ">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></div>
                  Ignoring small pipe leaks wastes a full day's gas.
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 9. FINAL CTA --- */}
      <Section className="pb-24 pt-0">
        <Container>
          <div className="bg-neutral-950 rounded-[5rem] p-16 md:p-32 text-center text-white relative overflow-hidden group">
             <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <img src="/images/bio_image_3.jpeg" alt="Clean Kitchen Outcome" className="w-full h-full object-cover" />
             </div>
             <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-black  uppercase mb-12 tracking-tighter leading-none">
                  Calculate Your <br/> <span className="text-primary underline decoration-white decoration-2 underline-offset-8">Plant Size</span>
                </h2>
                <Link href="/calculator">
                  <Button variant="primary" className="h-20 px-16 text-xl font-black  rounded-3xl group shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                    Start Free Analysis <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
             </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}