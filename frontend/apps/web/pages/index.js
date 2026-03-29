import Head from "next/head";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  Flame,
  Zap,
  Shield,
  Leaf,
  ArrowRight,
  BarChart3,
  Users,
  Globe,
  Play,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Biogrix | Enterprise Biogas Management</title>
        <meta
          name="description"
          content="Modernizing biogas distribution for a sustainable future with the Biogrix platform."
        />
      </Head>

      {/* --- PREMIUM HERO SECTION (Centered Impact) --- */}
      <Section className="relative overflow-hidden pt-12 pb-40 md:pt-20 md:pb-48 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-white to-white border-b border-neutral-100">
        {/* Animated Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <Container>
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 text-emerald-700 text-sm font-bold mb-8 shadow-sm">
              <CheckCircle2 size={16} className="text-primary" />
              Trusted by 50+ Regional Bio-Plants
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-neutral-900 leading-[0.9] tracking-tighter mb-8">
              The Digital Pulse of <br />
              <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                Sustainable Energy.
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-xl md:text-2xl text-neutral-600 mb-10 leading-relaxed max-w-2xl">
              Biogrix Run your village gas network, streamlines gas
              distribution, track usage, automates household billing, and
              optimizes plant operations—all in one powerful platform.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full">
              <Button
                href="/how-it-works"
                variant="primary"
                className="h-16 px-10 text-lg w-full sm:w-auto group"
              >
                See How Biogrix Works
                <ArrowRight
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  size={20}
                />
              </Button>

              <Button
                href="/calculator"
                variant="secondary"
                className="h-16 px-10 text-lg w-full sm:w-auto group bg-white/50 backdrop-blur-sm"
              >
                {/* <Play className="mr-2 fill-neutral-900" size={18} /> */}
                Calculator
                <ArrowRight
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  size={20}
                />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- STATS BAR --- */}
      <div className="bg-neutral-900 py-12">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Communities Impacted", value: "50+" },
              { label: "Meters Managed", value: "12k+" },
              { label: "Uptime Reliability", value: "99.9%" },
              { label: "Carbon Offset", value: "2.4k Tons" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-neutral-500 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* --- WHO IS THIS FOR --- */}
      <Section className="bg-neutral-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Community Impact</h2>
            <h3 className="text-4xl font-black text-neutral-900">Who can start a Biogrix network?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 border-none shadow-sm hover:shadow-xl bg-white transition-all">
              <Users className="text-primary mb-6" size={32} />
              <h4 className="text-xl font-bold mb-2">Dairy Farmers</h4>
              <p className="text-neutral-500 text-sm">Convert cow dung into a regular monthly income by selling gas to neighbors.</p>
            </Card>
            <Card className="p-8 border-none shadow-sm hover:shadow-xl bg-white transition-all">
              <Globe className="text-emerald-500 mb-6" size={32} />
              <h4 className="text-xl font-bold mb-2">Village Entrepreneurs</h4>
              <p className="text-neutral-500 text-sm">Run a clean energy utility business and provide jobs in your local area.</p>
            </Card>
            <Card className="p-8 border-none shadow-sm hover:shadow-xl bg-white transition-all">
              <Leaf className="text-blue-500 mb-6" size={32} />
              <h4 className="text-xl font-bold mb-2">NGOs & Cooperatives</h4>
              <p className="text-neutral-500 text-sm">Build sustainable, carbon-neutral villages while reducing household costs.</p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- SAVINGS HIGHLIGHT --- */}
      <Section
        primary
        className="bg-gradient-to-br from-primary to-emerald-700 overflow-hidden relative"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 100 Q 50 0 100 100" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Stop Wasting Money <br />
                on LPG Cylinders.
              </h2>
              <p className="text-emerald-50 text-lg opacity-90 leading-relaxed">
                Switching to Biogrix-managed biogas isn't just eco-friendly—it's
                a smart financial move for every household in your network.
              </p>
              <div className="flex items-center gap-4 py-4">
                <div className="h-12 w-1 bg-white/30 rounded-full" />
                <p className="italic text-emerald-100 font-medium">
                  Verified by regional pilot plants across India.
                </p>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl relative z-10 text-center">
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-4">
                  Potential Monthly Savings
                </p>
                <div className="text-6xl md:text-7xl font-black text-neutral-900 tracking-tighter mb-4">
                  ₹500{" "}
                  <span className="text-2xl text-neutral-300 font-bold">
                    to
                  </span>{" "}
                  ₹1500
                </div>
                <p className="text-primary font-black text-lg mb-8 italic">
                  Saved Every Month Per Household
                </p>

                <div className="pt-8 border-t border-neutral-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-medium">
                      LPG Market Price
                    </span>
                    <span className="text-red-500 font-bold strike-through">
                      ₹1100+
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-medium">
                      Biogrix Network Price
                    </span>
                    <span className="text-primary font-bold">~₹400-600</span>
                  </div>
                </div>
              </Card>
              {/* Glow effect behind the card */}
              <div className="absolute inset-0 bg-emerald-400 blur-[100px] opacity-20 -z-10" />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- CORE CAPABILITIES --- */}
      <Section>
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-tight uppercase mb-3">
              Core Capabilities
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Everything you need to scale biogas distribution.
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card
              hover
              className="p-8 border-none bg-neutral-50 hover:bg-white border-t-4 border-t-primary"
            >
              <Users className="text-primary mb-6" size={32} />
              <h4 className="text-xl font-bold mb-3">Consumer Management</h4>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Seamlessly onboard households, manage digital profiles, and
                maintain direct communication with every consumer.
              </p>
            </Card>

            <Card
              hover
              className="p-8 border-none bg-neutral-50 hover:bg-white border-t-4 border-t-emerald-500"
            >
              <Zap className="text-emerald-500 mb-6" size={32} />
              <h4 className="text-xl font-bold mb-3">Smart Billing Engine</h4>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Automated invoice generation based on real-time meter readings.
                Reconcile payments instantly with zero paperwork.
              </p>
            </Card>

            <Card
              hover
              className="p-8 border-none bg-neutral-50 hover:bg-white border-t-4 border-t-blue-500"
            >
              <Globe className="text-blue-500 mb-6" size={32} />
              <h4 className="text-xl font-bold mb-3">Network Analytics</h4>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Monitor plant health and distribution efficiency across multiple
                geographical locations from one central dashboard.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- THE BIOGRIX DIFFERENCE (Dark Mode Section) --- */}
      <Section dark>
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                Why Industry Leaders Choose Biogrix
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                We replace fragmented spreadsheets and manual labor with a
                unified, enterprise-grade platform built for the unique
                challenges of bio-energy.
              </p>

              <ul className="space-y-6">
                {[
                  {
                    title: "Zero Data Loss",
                    desc: "Secure cloud backups for all meter and financial records.",
                  },
                  {
                    title: "Offline-First Ready",
                    desc: "Capture readings in remote areas even without internet.",
                  },
                  {
                    title: "Audit-Ready Reports",
                    desc: "Generate revenue and usage reports in one click.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex justify-center items-center flex-shrink-0 mt-1 bg-primary/20 w-10 rounded-lg ">
                      <Shield size={18} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white">{item.title}</h5>
                      <p className="text-neutral-500 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-[2rem] p-1 border border-neutral-800 shadow-2xl">
              <div className="bg-neutral-950 rounded-[1.8rem] p-8 md:p-12 text-center">
                <Flame className="text-primary mx-auto mb-6" size={48} />
                <blockquote className="text-xl font-medium italic text-neutral-300 mb-8 leading-relaxed">
                  "Switching to Biogrix reduced our billing errors by 94% and
                  allowed us to expand our community network by double within
                  six months."
                </blockquote>
                <div className="space-y-1">
                  <p className="font-bold text-white text-lg tracking-tight">
                    Senior Plant Manager
                  </p>
                  <p className="text-neutral-500 uppercase tracking-[0.2em] text-[10px] font-bold">
                    GreenGrid Renewables
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- FINAL CALL TO ACTION --- */}
      <Section className="bg-white">
        <Container>
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/40">
            {/* Background SVG Accent */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg
                className="h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 100 C 20 0 50 0 100 100"
                  stroke="white"
                  fill="transparent"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative tracking-tight">
              Ready to modernize your <br />
              biogas utility?
            </h2>
            <p className="text-emerald-50 text-xl mb-12 max-w-xl mx-auto relative font-medium">
              Join dozens of communities optimizing their distribution with
              Biogrix. Schedule a platform demo today.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center relative">
              {/* Main Action: Contact/Demo */}
              <Button
                href="/contact"
                variant="white"
                className="h-16 px-12 text-lg shadow-xl font-bold"
              >
                Contact Us
              </Button>

              {/* Secondary Action: Calculator */}
              <Button
                href="/calculator"
                variant="black"
                className="h-16 px-12 text-lg font-bold"
              >
                Try the Calculator
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
