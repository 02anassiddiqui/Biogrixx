import Head from "next/head";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import Trans from "../components/ui/Trans"; // 🚀 Import Trans
import { useLanguage } from "../context/LanguageContext";
import {
  Flame,
  Droplets,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Truck,
  Timer,
  MapPin,
  Info,
  Users,
  Shield,
  ChevronRight,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";

const QUICK_STATS = [
  { label: "1 Cow / Day", value: "10kg Dung" },
  { label: "Gas Yield", value: "0.04 m³ / kg" },
  { label: "Cooking Time", value: "2-3 Hours" },
  { label: "Water Ratio", value: "1 : 1 Mix" },
];

const PLANT_SIZES = [
  {
    size: "2 m³",
    houses: "1-2 Houses",
    cost: "₹25k - ₹35k",
    land: "250 sq ft",
  },
  {
    size: "4 m³",
    houses: "3-4 Houses",
    cost: "₹45k - ₹55k",
    land: "450 sq ft",
  },
  {
    size: "6 m³",
    houses: "5-6 Houses",
    cost: "₹65k - ₹80k",
    land: "600 sq ft",
  },
  {
    size: "10 m³",
    houses: "8-10 Houses",
    cost: "₹95k - ₹1.2L",
    land: "850 sq ft",
  },
];

const STEPS = [
  {
    title: "Collect Dung",
    desc: "Collect fresh dung from cattle shed. Ensure it is free of stones, plastic, or soil for best gas quality.",
    img: "/images/bio_image_9.jpeg",
  },
  {
    title: "Mix with Water (1:1)",
    desc: "Mix 1 bucket of dung with 1 bucket of water. Stir it until it becomes a smooth liquid (slurry).",
    img: "/images/bio_image_5.jpeg",
  },
  {
    title: "Feed the Digester",
    desc: "Pour the mix into the inlet tank. It flows down into the main underground digester naturally.",
    img: "/images/bio_image_3.jpeg",
  },
  {
    title: "Natural Gas Production",
    desc: "Wait for bacteria to work. Gas collects in the top dome, ready to be used anytime.",
    img: "/images/bio_image_1.jpeg",
  },
  {
    title: "Start Cooking",
    desc: "Open the gas valve. You get a clean, blue, smoke-free flame for your kitchen stove.",
    img: "/images/bio_image_2.jpeg",
  },
];

export default function BiogasGuide() {
  const { lang } = useLanguage();

  return (
    <div className="bg-white text-neutral-900 font-sans">
      <Head>
        <title>
          {lang === "Hindi"
            ? "Biogrix | बायोगैस मार्गदर्शिका"
            : lang === "Gujarati"
              ? "Biogrix | બાયોગેસ માર્ગદર્શિકા"
              : "Biogas Guide for Villages | Biogrix"}
        </title>
      </Head>

      {/* --- 1. HERO SECTION --- */}
      <Section className="bg-white pb-20 md:pb-40">
        <Container>
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-1.5 rounded-full bg-emerald-50 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100"
            >
              <Trans>Biogas Guide for Villages</Trans>
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-neutral-900 leading-[0.9] tracking-tighter mb-12">
              <Trans>Build Your Own</Trans> <br />
              <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                <Trans>Biogas from Dung.</Trans>
              </span>
            </h1>
            <p className="text-xl text-neutral-500 max-w-2xl leading-relaxed mb-12 ">
              <Trans>
                A practical handbook for farmers and village operators to
                achieve energy freedom.
              </Trans>
            </p>
            <div className="animate-bounce text-neutral-300 flex justify-center items-center">
              <ArrowDown size={32} />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 2. STATS BAR --- */}
      <div className="bg-neutral-900 py-12 -mt-10 relative z-20 mx-4 md:mx-12 rounded-[2rem] md:rounded-[3rem]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {QUICK_STATS.map((stat, i) => (
              <div key={i}>
                <div className="text-2xl md:text-4xl font-black text-white mb-1">
                  <Trans>{stat.value}</Trans>
                </div>
                <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                  <Trans>{stat.label}</Trans>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* --- 3. STRUCTURE --- */}
      <Section className="pt-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-neutral-100 bg-neutral-100 aspect-video">
              <img
                src="/images/bio_image_1.jpeg"
                alt="Biogas Plant Diagram"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm">
                <Trans>System Overview</Trans>
              </h2>
              <h3 className="text-4xl font-black text-neutral-900 leading-tight">
                <Trans>What is a Biogrix</Trans> <br />
                <Trans>Biogas Plant?</Trans>
              </h3>
              <p className="text-lg text-neutral-600 leading-relaxed">
                <Trans>
                  It is a simple brick or concrete tank built underground. You
                  feed it cow dung and water, and natural bacteria convert it
                  into methane gas. No electricity needed, just livestock.
                </Trans>
              </p>
              <div className="flex items-center gap-4 py-2">
                <div className="h-12 w-1 bg-emerald-500 rounded-full" />
                <p className="text-neutral-500 font-bold">
                  <Trans>
                    Works in all seasons. Provides gas 365 days a year.
                  </Trans>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 4. THE 5-STEP PROCESS --- */}
      <Section className="bg-neutral-50 py-24 md:py-32">
        <Container>
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              <Trans>How it works</Trans>
            </h2>
            <h3 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight leading-none">
              <Trans>Simple Steps to Free Fuel</Trans>
            </h3>
          </div>

          <div className="space-y-16 md:space-y-32">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6 bg-neutral-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl">
                        0{i + 1}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                    <Trans>Step</Trans> {i + 1}
                  </div>
                  <h4 className="text-3xl md:text-5xl font-black text-neutral-900 leading-tight">
                    <Trans>{step.title}</Trans>
                  </h4>
                  <p className="text-lg md:text-xl text-neutral-500 leading-relaxed font-medium">
                    <Trans>{step.desc}</Trans>
                  </p>
                  {i < STEPS.length - 1 && (
                    <div className="pt-4 hidden md:block">
                      <ArrowRight
                        className={`text-emerald-300 w-12 h-12 ${i % 2 !== 0 ? "rotate-180" : ""}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- 5. PLANT SIZE TABLE --- */}
      <Section>
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-tight uppercase mb-3 text-sm">
              <Trans>Sizing & Land</Trans>
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-neutral-900 leading-none">
              <Trans>Choose your plant capacity.</Trans>
            </h3>
          </div>

          <div className="overflow-hidden border border-neutral-100 rounded-[2.5rem] shadow-sm bg-white">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100">
                <tr>
                  <th className="p-8">
                    <Trans>Capacity</Trans>
                  </th>
                  <th className="p-8">
                    <Trans>Coverage</Trans>
                  </th>
                  <th className="p-8">
                    <Trans>Land Area</Trans>
                  </th>
                  <th className="p-8">
                    <Trans>Estimated Cost</Trans>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 text-sm font-medium text-neutral-600">
                {PLANT_SIZES.map((row, i) => (
                  <tr key={i} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-8 font-black text-neutral-900 text-xl tracking-tight">
                      <Trans>{row.size}</Trans>
                    </td>
                    <td className="p-8">
                      <Trans>{row.houses}</Trans>
                    </td>
                    <td className="p-8">
                      <Trans>{row.land}</Trans>
                    </td>
                    <td className="p-8 font-black text-primary text-lg">
                      <Trans>{row.cost}</Trans>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* --- 6. SAVINGS HIGHLIGHT --- */}
      <Section
        primary
        className="bg-gradient-to-br from-primary to-emerald-700 overflow-hidden relative"
      >
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                <Trans>10 Cows = 5 Houses.</Trans> <br />
                <Trans>The Village Math.</Trans>
              </h2>
              <p className="text-emerald-50 text-lg opacity-90 leading-relaxed">
                <Trans>
                  A community grid with 10 cows produces enough gas to save 5
                  families over ₹6,000 combined every month.
                </Trans>
              </p>
              <div className="flex items-center gap-4 py-4">
                <div className="h-12 w-1 bg-white/30 rounded-full" />
                <p className="text-emerald-100 font-bold uppercase text-xs tracking-widest">
                  <Trans>Verified Village Output</Trans>
                </p>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl relative z-10 text-center border-none">
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-4">
                  <Trans>Potential Yearly Savings</Trans>
                </p>
                <div className="text-6xl md:text-7xl font-black text-neutral-900 tracking-tighter mb-4">
                  ₹14k+
                </div>
                <p className="text-primary font-black text-lg mb-8 uppercase tracking-tight">
                  <Trans>Saved Per Household</Trans>
                </p>
                <div className="pt-8 border-t border-neutral-100 text-neutral-500 text-sm font-bold">
                  <Trans>Stop buying LPG. Start producing your own.</Trans>
                </div>
              </Card>
              <div className="absolute inset-0 bg-emerald-400 blur-[100px] opacity-20 -z-10" />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 7. BENEFITS --- */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              <Trans>Why switch?</Trans>
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-neutral-900">
              <Trans>Life-changing Benefits</Trans>
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Flame,
                title: "Smoke-Free Cooking",
                color: "emerald",
                desc: "Protects your eyes and lungs. No more wood smoke or soot on kitchen walls.",
              },
              {
                icon: Zap,
                title: "Organic Slurry",
                color: "blue",
                desc: "The leftover waste is a high-quality fertilizer that increases crop yield naturally.",
              },
              {
                icon: Truck,
                title: "LPG Independence",
                color: "primary",
                desc: "No more waiting for gas cylinders or worrying about rising market prices.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                hover
                className={`p-8 border-none bg-neutral-50 hover:bg-white border-t-4 border-t-${item.color === "primary" ? "primary" : item.color + "-500"} transition-all`}
              >
                <item.icon
                  className={`text-${item.color === "primary" ? "primary" : item.color + "-500"} mb-6`}
                  size={32}
                />
                <h4 className="text-xl font-black text-neutral-900 mb-3">
                  <Trans>{item.title}</Trans>
                </h4>
                <p className="text-neutral-600 leading-relaxed text-sm">
                  <Trans>{item.desc}</Trans>
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- 8. MISTAKES --- */}
      <Section
        dark
        className="rounded-[4rem] mx-4 md:mx-12 overflow-hidden mb-24"
      >
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-orange-500 font-bold uppercase tracking-widest text-sm">
                <Trans>Expert Advice</Trans>
              </h2>
              <h3 className="text-4xl font-black leading-tight text-white uppercase tracking-tighter">
                <Trans>Common Mistakes</Trans> <br />
                <Trans>to Avoid.</Trans>
              </h3>
              <p className="text-neutral-400 text-lg">
                <Trans>
                  Building a plant is easy, but maintaining it correctly is what
                  ensures gas production for 20+ years.
                </Trans>
              </p>

              <ul className="space-y-6">
                {[
                  {
                    title: "Water Ratio",
                    desc: "Never add more than 1 bucket of water to 1 bucket dung.",
                  },
                  {
                    title: "Daily Feeding",
                    desc: "Skipping feeding for even 2 days can stop the cycle.",
                  },
                  {
                    title: "Pipe Leaks",
                    desc: "Check joints with soap-water monthly to avoid gas loss.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex justify-center items-center flex-shrink-0 mt-1 bg-orange-500/20 w-10 h-10 rounded-lg">
                      <Shield size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white uppercase text-xs tracking-widest mb-1">
                        <Trans>{item.title}</Trans>
                      </h5>
                      <p className="text-neutral-500 text-sm">
                        <Trans>{item.desc}</Trans>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-[3rem] p-12 border border-neutral-800 text-center">
              <AlertTriangle
                className="text-orange-500 mx-auto mb-6"
                size={48}
              />
              <blockquote className="text-xl font-medium text-neutral-300 mb-8 leading-relaxed italic">
                "
                <Trans>
                  Most village plants stop working not because of technical
                  failure, but because farmers don't feed them daily.
                </Trans>
                "
              </blockquote>
              <p className="font-bold uppercase text-[10px] tracking-[0.2em] text-neutral-500">
                - <Trans>Senior Field Engineer</Trans>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 9. FINAL CTA --- */}
      <Section className="bg-white">
        <Container>
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/40">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative tracking-tight uppercase leading-none">
              <Trans>Stop Buying Gas.</Trans> <br />{" "}
              <Trans>Start Producing.</Trans>
            </h2>
            <p className="text-emerald-50 text-xl mb-12 max-w-xl mx-auto relative font-medium">
              <Trans>
                See exactly how much gas your cows can produce and what it will
                cost.
              </Trans>
            </p>

            <div className="flex justify-center relative">
              <Button
                href="/calculator"
                variant="white"
                className="h-20 px-16 text-xl shadow-xl font-black uppercase italic rounded-3xl group"
              >
                <Trans>Start Free Analysis</Trans>
                <ArrowRight
                  className="ml-2 group-hover:translate-x-2 transition-transform"
                  size={24}
                />
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
