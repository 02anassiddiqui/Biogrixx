import Head from "next/head";
import {
  ShieldCheck,
  Lock,
  Eye,
  Users,
  Cookie,
  Mail,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const lastUpdated = "April 06, 2026"; // 👈 Date update kar lena

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-emerald-100">
      <Head>
        <title>Privacy Policy | Biogrix</title>
      </Head>

      {/* --- SIMPLE NAV --- */}
      <nav className="border-b border-neutral-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-bold uppercase tracking-widest">
              Back to Home
            </span>
          </Link>
          <div className="text-sm font-black text-neutral-900 tracking-tighter uppercase">
            Biogrix<span className="text-primary">.</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        {/* --- HEADER --- */}
        <header className="mb-16">
          <div className="w-16 h-16 bg-emerald-50 text-primary rounded-3xl flex items-center justify-center mb-6 border border-emerald-100">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-neutral-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-neutral-400 font-medium">
            Last Updated on{" "}
            <span className="text-neutral-900">{lastUpdated}</span>
          </p>
        </header>

        <article className="space-y-12 leading-relaxed">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-neutral-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-neutral-200" /> 1. Introduction
            </h2>
            <p className="text-neutral-500 font-medium">
              Welcome to <strong>Biogrix</strong>. We provide a platform
              designed to help communities manage biogas plants, track usage,
              and handle operations efficiently. Your privacy is paramount to
              us, and this document explains how we protect it.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100">
            <h2 className="text-xl font-black uppercase tracking-widest text-neutral-900 mb-6 flex items-center gap-3">
              <Eye size={20} className="text-primary" /> 2. Information We
              Collect
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
                  Personal Data
                </h4>
                <ul className="space-y-2 text-sm font-bold text-neutral-600">
                  <li>• Name & Phone Number</li>
                  <li>• Email Address</li>
                  <li>• Village/Location Details</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">
                  Usage Data
                </h4>
                <ul className="space-y-2 text-sm font-bold text-neutral-600">
                  <li>• Device & Browser Info</li>
                  <li>• Time spent on site</li>
                  <li>• Calculator & Form usage</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Use Data */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-neutral-900 mb-4 flex items-center gap-3">
              3. Data Usage
            </h2>
            <p className="text-neutral-500 font-medium mb-4">
              We process your information to provide biogas-related services,
              specifically:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Service Delivery",
                "Support Requests",
                "Generating Leads",
                "UI/UX Improvement",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-bold text-neutral-700"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Security */}
          <section className="border-l-4 border-primary pl-8 py-2">
            <h2 className="text-xl font-black uppercase tracking-widest text-neutral-900 mb-4 flex items-center gap-3">
              <Lock size={20} className="text-primary" /> 4. Security
            </h2>
            <p className="text-neutral-500 font-medium">
              Your data is stored on secure <strong>Supabase</strong> backend
              systems with restricted access. We use encryption where applicable
              to ensure your infrastructure details remain confidential.
            </p>
          </section>

          {/* 5. Sharing */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-neutral-900 mb-4 flex items-center gap-3">
              5. Data Sharing
            </h2>
            <p className="text-neutral-500 font-medium">
              We do <strong>NOT</strong> sell your personal data. We only share
              information with hosting providers or legal authorities when
              absolutely necessary to comply with the law.
            </p>
          </section>

          {/* 6. Cookies */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-widest text-neutral-900 mb-4 flex items-center gap-3">
              <Cookie size={20} className="text-primary" /> 6. Cookies
            </h2>
            <p className="text-neutral-500 font-medium">
              We use cookies to improve performance and analyze user behavior.
              You can disable them in your browser, though some features of the
              dashboard may not function correctly.
            </p>
          </section>

          <hr className="border-neutral-100" />

          {/* 12. Contact */}
          <section className="bg-neutral-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-neutral-200">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="text-primary" />
              <h2 className="text-xl font-black uppercase tracking-widest">
                Questions?
              </h2>
            </div>
            <p className="text-neutral-400 font-medium mb-8">
              If you have any questions about this policy or your data rights,
              feel free to reach out.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
                  Email Support
                </span>
                <span className="text-lg font-bold">
                  support@biogrix.example.com
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
                  Office
                </span>
                <span className="text-lg font-bold">
                  Biogrix HQ, Sustainable Park, Gujarat
                </span>
              </div>
            </div>
          </section>
        </article>

        <footer className="mt-20 pt-10 border-t border-neutral-100 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300">
            &copy; 2026 Biogrix Management System. All Rights Reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
