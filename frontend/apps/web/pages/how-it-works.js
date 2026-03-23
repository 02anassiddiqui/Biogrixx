import Head from "next/head";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { Factory, Gauge, Receipt, Wrench, CheckCircle2, ArrowDown } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Factory,
      title: "Plants & networks",
      subtitle: "Infrastructure Onboarding",
      text: "Register plants and distribution networks with detailed geographical tagging. Biogrix allows operators to track production capacity, storage levels, and real-time operational status across multiple grid locations in one centralized dashboard.",
    },
    {
      icon: Gauge,
      title: "Meters & usage",
      subtitle: "Consumption Monitoring",
      text: "Assign unique smart or analog meters to individual households. Field operators can record high-precision readings via the mobile interface, allowing the system to calculate daily consumption trends and detect potential leaks or illegal tapping.",
    },
    {
      icon: Receipt,
      title: "Billing & payments",
      subtitle: "Revenue Management",
      text: "Automate the entire billing cycle by generating invoices directly from verified usage data. Biogrix supports digital payment reconciliation, late fee calculations, and historical payment tracking to ensure a transparent financial ecosystem.",
    },
    {
      icon: Wrench,
      title: "Maintenance",
      subtitle: "Technical Support Lifecycle",
      text: "Log technical complaints and routine maintenance requests through a dedicated ticketing system. Assign tasks to field engineers, track repair progress, and maintain a complete service history for every node in your distribution network.",
    },
  ];

  return (
    <>
      <Head>
        <title>How It Works | Biogrix Management</title>
      </Head>

      {/* --- HERO SECTION --- */}
      <Section className="bg-slate-50 border-b border-neutral-100">
        <Container narrow className="text-center">
          <h1 className="text-6xl md:text-8xl font-black text-neutral-900 mb-6 leading-[0.9] tracking-tighter">
            How{" "}
            <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
              Biogrix.
            </span>{" "}
            Works
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed mb-12">
            Biogrix covers the full cycle of biogas distribution. From
            production monitoring to the final household payment, here is how
            our ecosystem streamlines your operations.
          </p>
          <div className="animate-bounce text-neutral-300 flex justify-center items-center">
            <ArrowDown size={32} />
          </div>
        </Container>
      </Section>

      {/* --- STEP BY STEP FLOW (Now Green) --- */}
      <Section
        primary
        className="rounded-t-[4rem] md:rounded-t-[6rem] -mt-12 relative z-10 bg-gradient-to-r from-primary to-emerald-600"
      >
        <Container>
          <div className="relative space-y-12 py-10">
            {/* The vertical line div is removed. 
               The background is now the primary green from the Section prop.
            */}

            {/* Background SVG Accent */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="transparent" strokeWidth="0.5" />
              </svg>
            </div>

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative flex flex-col md:flex-row gap-8 items-start group"
                >
                  {/* Step Number & Icon */}
                  <div className="relative z-10 flex-shrink-0 w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                    <Icon className="text-primary" size={32} />
                    {/* Darker badge for contrast against the white icon box */}
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Content Card - White background pops beautifully against green section */}
                  <Card
                    hover
                    className="flex-1 p-8 md:p-10 border-none shadow-2xl transition-all duration-500"
                  >
                    <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2 block">
                      {step.subtitle}
                    </span>
                    <h2 className="text-2xl font-black text-neutral-900 mt-1 mb-4">
                      {step.title}
                    </h2>
                    <p className="text-neutral-600 leading-relaxed max-w-3xl">
                      {step.text}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* --- INTEGRATION SUMMARY --- */}
      <Section alt>
        <Container className="bg-white border border-neutral-100 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-neutral-200/50">
          <h3 className="text-3xl font-bold mb-6 text-neutral-900">
            Unified Data Ecosystem
          </h3>
          <p className="max-w-2xl mx-auto text-neutral-600 text-lg mb-10">
            Every module in Biogrix talks to the others. When a meter reading is
            logged, the billing engine updates instantly, and maintenance alerts
            are triggered if usage drops unexpectedly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-bold border border-primary/10">
              <CheckCircle2 size={16} /> Data Synchronization
            </div>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-semibold border border-primary/10">
              <CheckCircle2 size={16} /> End-to-End Visibility
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
