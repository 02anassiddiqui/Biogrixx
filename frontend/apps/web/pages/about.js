import Head from "next/head";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import {
  BarChart3,
  Users,
  Zap,
  ShieldCheck,
  Network,
  ClipboardCheck,
  CheckCircle2,
  Target,
} from "lucide-react";

export default function About() {
  const pillars = [
    {
      icon: <BarChart3 className="text-primary" size={24} />,
      title: "Utility Infrastructure",
      desc: "Built for plants, distribution networks, and households to run gas supply reliably.",
    },
    {
      icon: <Network className="text-primary" size={24} />,
      title: "Meter Tracking",
      desc: "Digital systems to track usage accurately, replacing error-prone manual records.",
    },
    {
      icon: <ClipboardCheck className="text-primary" size={24} />,
      title: "Automated Billing",
      desc: "Seamlessly issue bills and collect payments with less paperwork and fewer errors.",
    },
    {
      icon: <ShieldCheck className="text-primary" size={24} />,
      title: "Maintenance Hub",
      desc: "Centralized logs to handle maintenance requests and technical support instantly.",
    },
  ];

  return (
    <>
      <Head>
        <title>About | Biogrix Utility Management</title>
      </Head>

      {/* --- HERO --- */}
      <Section className="bg-slate-50 border-b border-neutral-100 pt-16 pb-40 md:pt-48 md:pb-72">
        <Container narrow className="text-center">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <CheckCircle2 size={16} /> Established 2026
          </div> */}
          <h1 className="text-6xl md:text-8xl font-black text-neutral-900 leading-[0.9] mb-8 tracking-tighter">
            About <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Biogrix.</span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed font-medium">
            A biogas utility management platform built for plants, distribution
            networks, and households. We help communities run their gas supply
            more reliably.
          </p>
        </Container>
      </Section>

      {/* --- PROBLEM/SOLUTION --- */}
      <Section>
        <Container className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">
              Solving the Last-Mile Challenges of Biogas.
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-8">
              While biogas technology has advanced rapidly, the{" "}
              <strong>management of distribution</strong> has remained stuck in
              the past. Manual paper logs and untracked maintenance lead to
              revenue loss and frustration.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Eliminating Manual Error",
                "Real-Time Data Access",
                "Scalable Infrastructure",
                "Consumer Trust",
              ].map((text) => (
                <div key={text} className="flex gap-2 items-center">
                  <div className="bg-emerald-100 rounded-full p-1">
                    <Zap size={12} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 bg-neutral-100 rounded-3xl aspect-square flex items-center justify-center border border-neutral-200 text-neutral-300">
            {/* <Network size={120} /> */}
            <img src="images/image_2.jpeg" alt="" className='w-full h-full object-cover object-center rounded-3xl'/>
          </div>
        </Container>
      </Section>

      {/* --- PILLARS --- */}
      <Section alt>
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              Platform Architecture
            </h3>
            <h4 className="text-4xl font-bold text-neutral-900">
              The Four Pillars of Biogrix
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
                  key={i}
                  hover
                  className="border-none shadow-sm p-8 flex flex-col h-full"
                >
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    {pillar.icon}
                  </div>
                  <h5 className="text-lg font-extrabold text-neutral-900 mb-3">
                    {pillar.title}
                  </h5>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {pillar.desc}
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
            "Our mission is to empower communities with the tools to manage
            their own energy future."
          </h2>
          <p className="text-neutral-500 text-lg max-w-xl mx-auto">
            By digitizing the biogas lifecycle, we reduce the cost of operations
            and increase reliability for thousands of households.
          </p>
        </Container>
      </Section>

      {/* --- SCALE --- */}
      <Section alt>
        <Container className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">
              Designed to grow with you.
            </h3>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Biogrix grows with you. We provide clear records, fast reporting,
              and a system that works for both **technical staff** and **field
              operators**.
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
                  <span className="font-semibold text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl rotate-2">
              <div className="bg-neutral-50 rounded-[2rem] p-12 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center">
                <Users size={64} className="text-primary/20 mb-4" />
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                  Built for Field Teams & Plant Managers
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

// import Head from "next/head";
// import { motion } from "framer-motion";
// import { Container } from "../components/ui/Container";
// import { Section } from "../components/ui/Section";
// import { Card } from "../components/ui/Card";
// import {
//   BarChart3,
//   Users,
//   Zap,
//   ShieldCheck,
//   Network,
//   ClipboardCheck,
//   CheckCircle2,
//   Target,
//   ArrowRight,
// } from "lucide-react";

// export default function About() {
//   const pillars = [
//     {
//       icon: <BarChart3 className="text-primary" size={24} />,
//       title: "Plant & Distribution Management",
//       desc: "Manage biogas plants, pipelines, and household connections in one system.",
//     },
//     {
//       icon: <Network className="text-primary" size={24} />,
//       title: "Meter Tracking",
//       desc: "Track gas usage accurately with digital meter monitoring instead of manual logs.",
//     },
//     {
//       icon: <ClipboardCheck className="text-primary" size={24} />,
//       title: "Automated Billing",
//       desc: "Generate and manage bills automatically based on real consumption data.",
//     },
//     {
//       icon: <ShieldCheck className="text-primary" size={24} />,
//       title: "Maintenance Hub",
//       desc: "Handle complaints, leakages, and maintenance with centralized tracking.",
//     },
//   ];

//   const workflow = [
//     "Collect cow dung and organic waste",
//     "Feed into biogas plant (digester)",
//     "Produce biogas through anaerobic digestion",
//     "Distribute gas via pipelines to households",
//     "Track usage using meters",
//     "Generate billing and manage payments",
//   ];

//   return (
//     <>
//       <Head>
//         <title>About | Biogrix Utility Management</title>
//       </Head>

//       {/* --- HERO --- */}
//       <Section className="bg-slate-50 border-b border-neutral-100 pt-16 pb-40 md:pt-48 md:pb-72">
//         <Container narrow className="text-center">
//           <h1 className="text-6xl md:text-8xl font-black text-neutral-900 leading-[0.9] mb-8 tracking-tighter">
//             About{" "}
//             <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
//               Biogrix.
//             </span>
//           </h1>
//           <p className="text-xl text-neutral-600 leading-relaxed font-medium">
//             Biogrix is a platform that helps communities generate, distribute,
//             and manage biogas efficiently — from plant setup to household usage
//             and billing.
//           </p>
//         </Container>
//       </Section>

//       {/* --- PROBLEM/SOLUTION --- */}
//       <Section>
//         <Container className="grid lg:grid-cols-2 gap-20 items-center">
//           <div className="order-2 lg:order-1">
//             <h2 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">
//               Solving the Last-Mile Challenges of Biogas.
//             </h2>
//             <p className="text-neutral-600 leading-relaxed mb-8">
//               While biogas technology has advanced, the{" "}
//               <strong>management of distribution</strong> is still manual and
//               inefficient. This leads to gas leakage, billing errors, and
//               revenue loss.
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {[
//                 "Eliminating Manual Error",
//                 "Real-Time Data Access",
//                 "Scalable Infrastructure",
//                 "Consumer Trust",
//               ].map((text) => (
//                 <div key={text} className="flex gap-2 items-center">
//                   <div className="bg-emerald-100 rounded-full p-1">
//                     <Zap size={12} className="text-primary" />
//                   </div>
//                   <span className="text-sm font-semibold text-neutral-700">
//                     {text}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="order-1 lg:order-2 bg-neutral-100 rounded-3xl aspect-square flex items-center justify-center border border-neutral-200 text-neutral-300">
//             <img
//               src="images/image_2.jpeg"
//               alt=""
//               className="w-full h-full object-cover object-center rounded-3xl"
//             />
//           </div>
//         </Container>
//       </Section>

//       {/* --- WORKFLOW (NEW SECTION - VERY IMPORTANT) --- */}
//       <Section alt>
//         <Container>
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
//               How It Works
//             </h3>
//             <h4 className="text-4xl font-bold text-neutral-900">
//               From Waste to Energy
//             </h4>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {workflow.map((step, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: i * 0.1 }}
//               >
//                 <Card className="p-6 h-full">
//                   <div className="flex items-start gap-4">
//                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
//                       {i + 1}
//                     </div>
//                     <p className="text-neutral-700 font-medium leading-relaxed">
//                       {step}
//                     </p>
//                   </div>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </Container>
//       </Section>

//       {/* --- PILLARS --- */}
//       <Section alt>
//         <Container>
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
//               Platform Architecture
//             </h3>
//             <h4 className="text-4xl font-bold text-neutral-900">
//               The Four Pillars of Biogrix
//             </h4>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {pillars.map((pillar, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: i * 0.1 }}
//               >
//                 <Card className="border-none shadow-sm p-8 flex flex-col h-full">
//                   <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
//                     {pillar.icon}
//                   </div>
//                   <h5 className="text-lg font-extrabold text-neutral-900 mb-3">
//                     {pillar.title}
//                   </h5>
//                   <p className="text-neutral-500 text-sm leading-relaxed">
//                     {pillar.desc}
//                   </p>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </Container>
//       </Section>

//       {/* --- MISSION --- */}
//       <Section dark className="bg-neutral-950 py-32 text-center">
//         <Container narrow>
//           <Target className="text-primary mx-auto mb-10" size={64} />
//           <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter italic leading-tight">
//             "Our mission is to make clean energy accessible and manageable for
//             every community."
//           </h2>
//           <p className="text-neutral-500 text-lg max-w-xl mx-auto">
//             By digitizing the biogas lifecycle, we reduce operational costs and
//             improve reliability for households.
//           </p>
//         </Container>
//       </Section>

//       {/* --- SCALE --- */}
//       <Section alt>
//         <Container className="flex flex-col md:flex-row items-center gap-16">
//           <div className="flex-1">
//             <h3 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">
//               Designed to grow with you.
//             </h3>
//             <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
//               From small village setups to large community plants, Biogrix
//               scales with your needs.
//             </p>

//             <div className="space-y-4">
//               {[
//                 "Clear records and audit trails",
//                 "Fast, automated reporting",
//                 "Field-operator friendly interface",
//                 "Scalable cloud architecture",
//               ].map((item) => (
//                 <div key={item} className="flex items-center gap-3">
//                   <CheckCircle2 size={20} className="text-primary" />
//                   <span className="font-semibold text-neutral-700">
//                     {item}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex-1">
//             <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl rotate-2">
//               <div className="bg-neutral-50 rounded-[2rem] p-12 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center">
//                 <Users size={64} className="text-primary/20 mb-4" />
//                 <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
//                   Built for Field Teams & Plant Managers
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Container>
//       </Section>
//     </>
//   );
// }