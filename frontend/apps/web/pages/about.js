import Head from "next/head";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import Trans from "../components/ui/Trans"; // 🚀 Import Trans
import {
  BarChart3,
  Users,
  Zap,
  ShieldCheck,
  Network,
  ClipboardCheck,
  CheckCircle2,
  Target,
  ArrowDown,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { lang } = useLanguage();

  const pillars = [
    {
      icon: <BarChart3 className="text-primary" size={24} />,
      title: "Plant & Network Management",
      desc: "Manage your biogas plant and gas distribution network in one place. Track plant capacity, monitor performance, and ensure smooth gas supply to households.",
    },
    {
      icon: <Network className="text-primary" size={24} />,
      title: "Gas Usage Tracking",
      desc: "Track how much gas each household uses with a simple digital system. Replace manual records with accurate, real-time data.",
    },
    {
      icon: <ClipboardCheck className="text-primary" size={24} />,
      title: "Billing & Payments",
      desc: "Automatically generate bills based on gas usage and track payments easily. Reduce errors, save time, and ensure steady income from your plant.",
    },
    {
      icon: <ShieldCheck className="text-primary" size={24} />,
      title: "Maintenance & Support",
      desc: "Handle complaints, leakage issues, and maintenance requests from a single dashboard. Keep your system reliable and your customers satisfied.",
    },
  ];

  return (
    <>
      <Head>
        <title>
          {lang === "Hindi"
            ? "Biogrix | हमारे बारे में"
            : lang === "Gujarati"
              ? "Biogrix | અમારા વિશે"
              : "About | Biogrix Utility Management"}
        </title>
      </Head>

      {/* --- HERO --- */}
      <Section className="bg-slate-50 border-b border-neutral-100 pb-20 md:pb-40">
        <Container narrow className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <CheckCircle2 size={16} /> <Trans>Established 2026</Trans>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-neutral-900 leading-[0.9] mb-8 tracking-tighter">
            <Trans>About</Trans>{" "}
            <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
              Biogrix.
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed mb-4">
            <Trans>
              Biogrix helps communities and plant operators manage biogas
              production, gas distribution, and billing - all in one simple
              system.
            </Trans>
          </p>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-16">
            <Trans>
              From tracking gas usage to handling payments and maintenance,
              everything you need to run a reliable biogas network.
            </Trans>
          </p>
          <div className="animate-bounce text-neutral-300 flex justify-center items-center">
            <ArrowDown size={32} />
          </div>
        </Container>
      </Section>

      {/* --- PROBLEM/SOLUTION --- */}
      <Section primary>
        <Container className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">
              <Trans>Solving the Last-Mile Challenges of Biogas.</Trans>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              <Trans>
                Many biogas plants fail not because of technology, but because
                of poor management.
              </Trans>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "No proper usage tracking",
                "No billing system",
                "No maintenance records",
                "Consumer Trust",
              ].map((text) => (
                <div key={text} className="flex gap-2 items-center">
                  <div className="bg-white rounded-full p-1">
                    <Zap size={20} className="text-primary" />
                  </div>
                  <span className="text-base font-semibold text-white/80">
                    <Trans>{text}</Trans>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 bg-neutral-100 rounded-3xl aspect-square flex items-center justify-center text-neutral-300">
            <img
              src="/images/bio_image_10.jpeg"
              alt=""
              className="w-full h-full object-cover object-center rounded-3xl"
            />
          </div>
        </Container>
      </Section>

      {/* --- PILLARS --- */}
      <Section alt>
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              <Trans>Everything you need to run a biogas utility system</Trans>
            </h3>
            <h4 className="text-4xl font-bold text-neutral-900">
              <Trans>The Four Pillars of Biogrix</Trans>
            </h4>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card
                  hover
                  className="border-none shadow-sm p-8 flex flex-col h-full"
                >
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    {pillar.icon}
                  </div>
                  <h5 className="text-lg font-extrabold text-neutral-900 mb-3">
                    <Trans>{pillar.title}</Trans>
                  </h5>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    <Trans>{pillar.desc}</Trans>
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- MISSION --- */}
      <Section dark className="bg-neutral-950 py-32 text-center">
        <Container narrow>
          <Target className="text-primary mx-auto mb-10" size={64} />
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter italic leading-tight">
            "
            <Trans>
              Our goal is to make biogas plants easy to manage, so villages can
              produce and use their own energy.
            </Trans>
            "
          </h2>
          <p className="text-neutral-500 text-lg max-w-xl mx-auto">
            <Trans>
              By digitizing the biogas lifecycle, we reduce the cost of
              operations and increase reliability for thousands of households.
            </Trans>
          </p>
        </Container>
      </Section>

      {/* --- SCALE --- */}
      <Section alt>
        <Container className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">
              <Trans>Designed to grow with you.</Trans>
            </h3>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              <Trans>
                Biogrix grows with you. We provide clear records, fast
                reporting, and a system that works for both technical staff and
                field operators.
              </Trans>
            </p>
            <div className="space-y-4">
              {[
                "Clear records and audit trails",
                "Fast, automated reporting",
                "Field-operator friendly interface",
                "Scalable cloud architecture",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary" />
                  <span className="font-semibold text-neutral-700">
                    <Trans>{item}</Trans>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl rotate-2">
              <div className="bg-neutral-50 rounded-[2rem] p-12 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center">
                <Users size={64} className="text-primary/20 mb-4" />
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                  <Trans>Built for Field Teams & Plant Managers</Trans>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
