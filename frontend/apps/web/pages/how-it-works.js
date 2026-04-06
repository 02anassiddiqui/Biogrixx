import Head from "next/head";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Trash2,
  Zap,
  Database,
  Truck,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Wallet,
  TrendingUp,
  Users,
  Tractor,
  Building2,
  Briefcase,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      title: "Waste Collection",
      subtitle: "Step 01: Waste Collection",
      text: "Daily cow dung and organic waste are collected from farms or households. This is not waste, but valuable raw material for clean energy production.",
      img: "/images/bio_image_7.jpeg",
      icon: Trash2,
    },
    {
      title: "Biogas Production",
      subtitle: "Step 02: Gas Production",
      text: "Dung is mixed with water and fed into an underground digester where anaerobic bacteria produce methane-rich biogas.",
      img: "/images/bio_image_5.jpeg",
      icon: Zap,
    },
    {
      title: "Storage & Processing",
      subtitle: "Step 03: Storage",
      text: "The gas is stored in a dome structure where pressure is maintained to ensure continuous supply.",
      img: "/images/bio_image_3.jpeg",
      icon: Database,
    },
    {
      title: "Gas Distribution",
      subtitle: "Step 04: Distribution",
      text: "Biogas is distributed through pipelines to connected households, creating a local energy grid..",
      img: "/images/bio_image_2.jpeg",
      icon: Truck,
    },
    {
      title: "Monitoring & Billing",
      subtitle: "Step 05: Monitoring & Billing",
      text: "Gas meters track usage. The system monitors consumption and generates automated monthly billing.",
      img: "/images/bio_image_1.jpeg",
      icon: Gauge,
    },
  ];

  return (
    <>
      <Head>
        <title>How It Works | Biogrix Digital Infrastructure</title>
      </Head>

      {/* --- 1. INTRODUCTION --- */}
      <Section className="bg-white">
        <Container narrow className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100 inline-block">
              Operational Roadmap
            </span>

            <h1 className="ext-6xl md:text-8xl font-black text-neutral-900 mb-8 leading-[0.9] tracking-tighter">
              How Biogas
              <br />
              <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                System Works.
              </span>
            </h1>

            <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mb-12 mx-auto">
              Biogrix helps communities convert organic waste into clean cooking
              gas and distribute it to households using a centralized, managed
              biogas grid system.
            </p>
            <br />
            <div className="animate-bounce text-neutral-300 flex justify-center items-center">
              <ArrowDown size={32} />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* --- 2. STEP PROCESS --- */}
      <Section
        primary
        className="rounded-t-[4rem] md:rounded-t-[6rem] from-primary to-emerald-700 overflow-hidden relative"
      >
        <Container>
          <div className="space-y-32">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 md:gap-20 items-center`}
              >
                {/* 🖼️ IMAGE: Ab ye 65% space lega (md:flex-[1.6]) */}
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="md:flex-[1.6] w-full"
                >
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-white/10 rounded-[3rem] blur-lg group-hover:bg-white/20 transition duration-500"></div>
                    <img
                      src={step.img}
                      alt={step.title}
                      className="relative rounded-[2.5rem] h-full w-full shadow-2xl object-cover aspect-video md:aspect-[16/9]"
                    />
                  </div>
                </motion.div>

                {/* 📝 TEXT: Ab ye 35% space lega (flex-1) */}
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex-1 space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-xl shrink-0">
                      <step.icon size={24} />
                    </div>
                    <span className="text-emerald-100 font-black uppercase tracking-[0.2em] text-[12px]">
                      {step.subtitle}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {step.title}
                  </h2>

                  <p className="text-emerald-50/80 text-lg leading-relaxed">
                    {step.text}
                  </p>

                  <div className="flex items-center gap-2 text-white/50 font-black text-[10px] uppercase tracking-widest">
                    <CheckCircle2 size={14} className="text-emerald-300" />{" "}
                    Real-Time System Monitoring
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- TRUST SECTION (NEW, NO UI BREAK) --- */}
      {/* <div alt className="bg-white pt-6">
        <Container>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="font-bold text-neutral-800">
              ✔ Supports 2–100 Households
            </div>
            <div className="font-bold text-neutral-800">
              ✔ Low Maintenance System
            </div>
            <div className="font-bold text-neutral-800">
              ✔ Proven Rural Deployment Model
            </div>
          </div>
        </Container>
      </div> */}

      {/* WHO SECTION */}
      <Section className="py-20">
        <Container>
          <h2 className="text-4xl font-bold text-center mb-12">
            Who Can Use This System?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {/* 🚀 FIXED: Icons pass karna bhul gaye the */}
            <SimpleCard icon={Users} title="Communities" />
            <SimpleCard icon={Truck} title="Farmers" />
            <SimpleCard icon={Building2} title="Projects" />
            <SimpleCard icon={Briefcase} title="Entrepreneurs" />
          </div>
        </Container>
      </Section>

      {/* --- SYSTEM FLOW --- */}
      <Section alt className="bg-neutral-900 py-24 overflow-hidden relative">
        <Container>
          <div className="text-center mb-16">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              Unified Ecosystem Flow
            </h3>
            <p className="text-4xl font-black text-white tracking-tight uppercase mb-3">
              Continuous Energy Lifecycle
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center">
            {[
              "Waste",
              "Digester",
              "Biogas",
              "Distribution",
              "Household",
              "Meter",
              "Billing",
            ].map((node, i) => (
              <React.Fragment key={i}>
                <div className="bg-gradient-to-bl from-primary via-primary/80 to-primary/60 p-6 rounded-3xl text-center">
                  <span className="text-white font-black text-xs uppercase tracking-widest">
                    {node}
                  </span>
                </div>
                {i < 6 && (
                  <div className="hidden md:flex justify-center text-neutral-700">
                    <ArrowRight size={20} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- BENEFITS --- */}
      {/* <Section alt className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard icon={Zap} title="Eliminate LPG Costs" text="Replace expensive LPG cylinders with locally produced clean energy." />
            <BenefitCard icon={Wallet} title="Financial Savings" text="Reduce monthly cooking fuel expenses for every connected household." />
            <BenefitCard icon={Leaf} title="Waste-to-Energy" text="Convert organic waste into valuable clean fuel." />
            <BenefitCard icon={TrendingUp} title="Rural Development" text="Support agriculture using organic bio-slurry fertilizer." />
            <BenefitCard icon={CheckCircle2} title="Safe & Clean" text="No smoke, no soot, and safer than LPG cylinders." />
            <BenefitCard icon={Database} title="Smart Management" text="Real-time monitoring ensures continuous supply and system safety." />
          </div>
        </Container>
      </Section> */}

      {/* --- CTA --- */}
      <Section>
        <Container className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-[4rem] p-10 md:p-15 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8 leading-tight">
            Ready to Build Your <br /> Community{" "}
            <span className="text-primary italic">Energy Grid?</span>
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link href="/calculator">
              <Button
                variant="primary"
                className="h-16 px-10 text-lg w-full sm:w-auto group"
              >
                Open Calculator{" "}
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>

            {/* <Link href="/contact">
              <Button variant="white" className="px-12 py-8 rounded-2xl h-auto text-lg">
                Contact Technical Team
              </Button>
            </Link> */}
          </div>
        </Container>
      </Section>
    </>
  );
}

function SimpleCard({ icon: Icon, title }) {
  return (
    <Card className="p-10 text-center border-none shadow-xl hover:shadow-2xl transition-all group">
      {Icon && (
        <Icon
          className="mx-auto mb-6 text-primary group-hover:scale-110 transition-transform"
          size={40}
        />
      )}
      <p className="font-black uppercase text-sm tracking-tight text-neutral-800">
        {title}
      </p>
    </Card>
  );
}

function BenefitCard({ icon: Icon, title, text }) {
  return (
    <Card className="p-10 border-neutral-100 hover:shadow-2xl transition-all duration-500 group">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <h4 className="text-xl font-black text-neutral-900 mb-4 tracking-tight">
        {title}
      </h4>
      <p className="text-neutral-600 leading-relaxed font-medium text-sm">
        {text}
      </p>
    </Card>
  );
}
