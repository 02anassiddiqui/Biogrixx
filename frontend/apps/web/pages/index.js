import Head from "next/head";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import Trans from "../components/ui/Trans"; // 🚀 Import Trans Component
import {
  Flame,
  Zap,
  Shield,
  Leaf,
  ArrowRight,
  Users,
  Globe,
  CheckCircle2,
  Wallet,
  Tractor,
  Smartphone,
  Truck,
  Coins,
  Home as HomeIcon,
  Factory,
  GitCommit,
  Gauge,
  FileText,
  ArrowDown,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { lang } = useLanguage();
  return (
    <>
      <Head>
        {/* ✅ FIXED: Title mein component nahi, string use karein */}
        <title>
          {lang === "Hindi"
            ? "Biogrix | हर गाँव के लिए स्वच्छ ऊर्जा" :
            lang === "Gujarati" ? "Biogrix | દરેક ગામ માટે સ્વચ્છ ઉર્જા":
            "Biogrix | Clean Energy for Every Village"}
        </title>
        <meta
          name="description"
          content="Manage your village biogas network easily with Biogrix."
        />
      </Head>

      {/* --- PREMIUM HERO SECTION --- */}
      <Section className="relative overflow-hidden pt-12 pb-40 md:pt-20 md:pb-48 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-white to-white border-b border-neutral-100">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <Container>
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 text-emerald-700 text-sm font-bold mb-8 shadow-sm">
              <CheckCircle2 size={16} className="text-primary" />
              <Trans>Trusted by 50+ Regional Bio-Plants</Trans>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-neutral-900 leading-[0.9] tracking-tighter mb-8">
              <Trans>Turn Cow Dung</Trans> <br />
              <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                <Trans>Into Cooking Gas for Your Village.</Trans>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-10 leading-relaxed max-w-2xl">
              <Trans>
                Biogrix Run your village gas network, streamlines gas
                distribution, track usage, automates household billing, and
                optimizes plant operations—all in one powerful platform.
              </Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full">
              <Button
                href="/how-it-works"
                variant="primary"
                className="h-16 px-10 text-lg w-full sm:w-auto group"
              >
                <Trans>See How Biogrix Works</Trans>
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
                <Trans>Calculator</Trans>
                <ArrowRight
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  size={20}
                />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- SAVINGS HIGHLIGHT --- */}
      <Section
        primary
        className="bg-gradient-to-br from-primary to-emerald-700 overflow-hidden relative"
      >
        <Container>
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                <Trans>Stop Spending Heavily on LPG Cylinders.</Trans>
              </h2>
              <p className="text-emerald-50 text-lg opacity-90 leading-relaxed">
                <Trans>
                  Producing your own gas is cheaper than buying cylinders. It
                  saves money for a family of 4–5 members and keeps your kitchen
                  smoke-free.
                </Trans>
              </p>
              <div className="flex items-center gap-4 py-4">
                <div className="h-12 w-1 bg-white/30 rounded-full" />
                <p className="text-emerald-100 font-bold uppercase text-xs tracking-widest">
                  <Trans>Low Cost. High Production. Zero Smoke.</Trans>
                </p>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl relative z-10 text-center border-none">
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-4">
                  <Trans>Monthly Family Savings</Trans>
                </p>
                <div className="text-6xl md:text-7xl font-black text-neutral-900 tracking-tighter mb-4">
                  ₹600{" "}
                  <span className="text-2xl tracking-tighter font-bold">
                    <Trans>to</Trans>
                  </span>{" "}
                  ₹1200
                </div>
                <p className="text-primary font-black text-lg mb-8 uppercase tracking-tight">
                  <Trans>Per Month / Per Family</Trans>
                </p>
                <div className="pt-8 border-t border-neutral-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-medium">
                      <Trans>LPG Cylinder Price</Trans>
                    </span>
                    <span className="text-red-500 font-bold line-through">
                      ₹1100+
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-medium">
                      <Trans>Biogas Cost</Trans>
                    </span>
                    <span className="text-primary font-bold">~₹400-500</span>
                  </div>
                </div>
              </Card>
              <div className="absolute inset-0 bg-emerald-400 blur-[100px] opacity-20 -z-10" />
            </div>
          </div>
        </Container>
      </Section>

      {/* --- WHO IS THIS FOR --- */}
      <Section className="bg-neutral-50 pb-16">
        <Container>
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black text-neutral-900">
              <Trans>Who can start a Biogrix system?</Trans>
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card
              hover
              className="p-8 border-none shadow-sm hover:shadow-xl bg-white transition-all"
            >
              <Truck className="text-primary mb-6" size={32} />
              <h4 className="text-xl font-bold mb-2">
                <Trans>Cow Owners</Trans>
              </h4>
              <p className="text-neutral-500 text-sm">
                <Trans>
                  Turn cow dung into monthly cash. Use what you need and sell
                  the extra gas to your neighbors.
                </Trans>
              </p>
            </Card>
            <Card
              hover
              className="p-8 border-none shadow-sm hover:shadow-xl bg-white transition-all"
            >
              <Wallet className="text-emerald-500 mb-6" size={32} />
              <h4 className="text-xl font-bold mb-2">
                <Trans>Local Operators</Trans>
              </h4>
              <p className="text-neutral-500 text-sm">
                <Trans>
                  Start a small business in your village. Manage gas meters and
                  collect payments easily through your phone.
                </Trans>
              </p>
            </Card>
            <Card
              hover
              className="p-8 border-none shadow-sm hover:shadow-xl bg-white transition-all"
            >
              <Shield className="text-blue-500 mb-6" size={32} />
              <h4 className="text-xl font-bold mb-2">
                <Trans>Community Groups</Trans>
              </h4>
              <p className="text-neutral-500 text-sm">
                <Trans>
                  Help your village become self-reliant. Reduce fuel costs and
                  provide clean energy to every household.
                </Trans>
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- HOW IT WORKS FLOW --- */}
      <Section className="bg-white py-24 border-t border-neutral-100">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              <Trans>The Process</Trans>
            </h2>
            <h3 className="text-4xl font-black text-neutral-900">
              <Trans>How it works in 4 simple steps</Trans>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            {[
              {
                title: "1. Collect Dung",
                desc: "Collect waste from your cows daily.",
                icon: <Truck size={28} />,
              },
              {
                title: "2. Produce Gas",
                desc: "The bio-plant creates clean gas naturally.",
                icon: <Flame size={28} />,
              },
              {
                title: "3. Supply Homes",
                desc: "Gas flows to kitchens through pipelines.",
                icon: <HomeIcon size={28} />,
              },
              {
                title: "4. Earn Income",
                desc: "Collect payments for the gas you supply.",
                icon: <Coins size={28} />,
              },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center">
                <div className="flex flex-col items-center text-center group w-full">
                  <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-black text-neutral-900 mb-2 tracking-tight">
                    <Trans>{step.title}</Trans>
                  </h4>
                  <p className="text-neutral-500 text-sm px-4 leading-relaxed font-medium">
                    <Trans>{step.desc}</Trans>
                  </p>
                </div>

                {i < 3 && (
                  <>
                    <div className="hidden md:block absolute top-10 -right-4 text-emerald-200">
                      <ArrowRight size={24} strokeWidth={3} />
                    </div>
                    <div className="md:hidden flex justify-center my-6 text-emerald-200">
                      <ArrowDown size={24} strokeWidth={3} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- SYSTEM DIAGRAM --- */}
      <Section className="bg-white py-24 border-t border-neutral-100">
        <Container>
          <div className="text-center mb-20">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              <Trans>Infrastructure</Trans>
            </h2>
            <h3 className="text-4xl font-black text-neutral-900 leading-tight">
              <Trans>Technical Setup: Cow Dung to Cooking Gas</Trans>
            </h3>
            <p className="text-neutral-500 font-medium mt-4 max-w-2xl mx-auto">
              <Trans>
                Our digital infrastructure connects every point of your village
                gas network seamlessly.
              </Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-2 relative">
            {[
              {
                label: "Plant",
                sub: "Production Unit",
                icon: <Factory size={28} />,
              },
              {
                label: "Pipeline",
                sub: "Safe Distribution",
                icon: <GitCommit size={28} />,
              },
              {
                label: "House",
                sub: "Kitchen Connection",
                icon: <HomeIcon size={28} />,
              },
              {
                label: "Meter",
                sub: "Digital Tracking",
                icon: <Gauge size={28} />,
              },
              {
                label: "Billing",
                sub: "Monthly Income",
                icon: <FileText size={28} />,
              },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center">
                <div className="flex flex-col items-center text-center group w-full">
                  <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-black text-neutral-900 mb-1 tracking-tight">
                    <Trans>{item.label}</Trans>
                  </h4>
                  <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    <Trans>{item.sub}</Trans>
                  </p>
                </div>

                {i < 4 && (
                  <>
                    <div className="hidden md:block absolute top-10 -right-4 text-emerald-200">
                      <ArrowRight size={20} strokeWidth={3} />
                    </div>
                    <div className="md:hidden flex justify-center my-6 text-emerald-200">
                      <ArrowDown size={20} strokeWidth={3} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 pt-8 border-t border-neutral-50 flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
              <Trans>Real-time Infrastructure Monitoring Active</Trans>
            </p>
          </div>
        </Container>
      </Section>

      {/* --- CORE CAPABILITIES --- */}
      <Section>
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-tight uppercase mb-3 text-sm">
              <Trans>Simple Tools</Trans>
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900">
              <Trans>Easy to use for every village operator.</Trans>
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card
              hover
              className="p-8 border-none bg-neutral-50 hover:bg-white border-t-4 border-t-primary transition-all"
            >
              <Smartphone className="text-primary mb-6" size={32} />
              <h4 className="text-xl font-bold mb-3">
                <Trans>Easy Registration</Trans>
              </h4>
              <p className="text-neutral-600 leading-relaxed text-sm">
                <Trans>
                  Register a new family in seconds. No complex paperwork.
                  Everything is stored safely on your phone.
                </Trans>
              </p>
            </Card>
            <Card
              hover
              className="p-8 border-none bg-neutral-50 hover:bg-white border-t-4 border-t-emerald-500 transition-all"
            >
              <Zap className="text-emerald-500 mb-6" size={32} />
              <h4 className="text-xl font-bold mb-3">
                <Trans>Automatic Bills</Trans>
              </h4>
              <p className="text-neutral-600 leading-relaxed text-sm">
                <Trans>
                  The system calculates the bill based on gas used. No mistakes,
                  no arguments—just fair and clear prices.
                </Trans>
              </p>
            </Card>
            <Card
              hover
              className="p-8 border-none bg-neutral-50 hover:bg-white border-t-4 border-t-blue-500 transition-all"
            >
              <Globe className="text-blue-500 mb-6" size={32} />
              <h4 className="text-xl font-bold mb-3">
                <Trans>See Daily Gas Production</Trans>
              </h4>
              <p className="text-neutral-600 leading-relaxed text-sm">
                <Trans>
                  See how much gas your plant is making daily. Know exactly when
                  you need more waste or maintenance.
                </Trans>
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* --- THE BIOGRIX DIFFERENCE --- */}
      <Section dark className="overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                <Trans>Built for Reliable Village Life</Trans>
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                <Trans>
                  We know that technology in villages must be simple and tough.
                  Biogrix is built to work every single day, even without a
                  constant internet connection.
                </Trans>
              </p>
              <ul className="space-y-6">
                {[
                  {
                    title: "Works Offline",
                    desc: "Take readings even when there is no internet. The data syncs automatically later.",
                  },
                  {
                    title: "Secure Records",
                    desc: "Every gram of gas and every rupee collected is recorded. Never lose your accounts.",
                  },
                  {
                    title: "Monthly Reports",
                    desc: "Get a simple summary of your earnings and gas production at the end of every month.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex justify-center items-center flex-shrink-0 mt-1 bg-primary/20 w-10 h-10 rounded-lg">
                      <Shield size={18} className="text-primary" />
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
            <div className="bg-neutral-900 rounded-[2rem] p-1 border border-neutral-800 shadow-2xl">
              <div className="bg-neutral-950 rounded-[1.8rem] p-8 md:p-12 text-center">
                <Flame className="text-primary mx-auto mb-6" size={48} />
                <blockquote className="text-xl font-medium text-neutral-300 mb-8 leading-relaxed italic">
                  "
                  <Trans>
                    Biogrix made it easy for us to sell gas to 20 houses nearby.
                    We now have a fixed monthly income from our dairy farm
                    waste.
                  </Trans>
                  "
                </blockquote>
                <div className="space-y-1 text-center">
                  <p className="font-bold text-white text-lg tracking-tight uppercase">
                    <Trans>Ramesh Patel, Dairy Farmer</Trans>
                  </p>
                  <p className="text-neutral-500 uppercase tracking-[0.2em] text-[10px] font-bold">
                    <Trans>Gujarat Region</Trans>
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
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative tracking-tight leading-none">
              <Trans>Stop Buying Gas Cylinders.</Trans> <br />{" "}
              <Trans>Start Producing Your Own Biogas.</Trans>
            </h2>
            <p className="text-emerald-50 text-xl mb-12 max-w-xl mx-auto relative font-medium">
              <Trans>
                Start your own community gas grid today. Works for 3–50
                households. Contact us for a free survey of your location.
              </Trans>
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center relative">
              <Button
                href="/about"
                variant="white"
                className="h-16 px-12 text-lg shadow-xl font-bold"
              >
                <Trans>See About Us</Trans>
              </Button>
              <Button
                href="/how-it-works"
                variant="black"
                className="h-16 px-12 text-lg font-bold"
              >
                <Trans>See How We Works</Trans>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
