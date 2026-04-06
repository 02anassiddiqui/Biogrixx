import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { apiRequest } from "../../admin/services/api";
// import { supabase } from "../../../shared/lib/supabaseClient";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Home as HomeIcon,
  Baby,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function Contact() {
  // * 1. Form ka data store karne ke liye "State"
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    location_details: "",
    livestock_count: "",
    role: "farmer",
    message: "",
  });

  const [loading, setLoading] = useState(false); // *Loading dikhane ke liye

  // * 2. Type karte waqt data update karne wala function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const { data, error } = await supabase.from('contacts').insert([formData])
  //   if (error) console.error('Error:', error)
  //   else alert('Message sent!')
  // }

  // * 3. Supabase mein data bhejne waha function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Data prepare karo (Convert string to number)
    const submissionData = {
      ...formData,
      livestock_count: parseInt(formData.livestock_count) || 0
    };

    try {
      // 🚀 CHANGE 1: Localhost URL hata kar Environment Variable wala logic lagaya
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

      const response = await fetch(`${API_BASE_URL}/leads/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(
          "Badhiya! Aapki enquiry Professional Backend ke zariye save ho gayi hai.",
        );

        // Form reset logic
        setFormData({
          name: "",
          phone: "",
          village: "",
          location_details: "",
          livestock_count: "",
          role: "farmer",
          message: "",
        });
      } else {
        throw new Error(result.message || "Kuch galti hui hai!");
      }
    } catch (error) {
      alert("Error: " + error.message);
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | Biogrix Utility Management</title>
      </Head>

      {/* --- HERO SECTION --- */}
      <Section className="bg-white pt-24 pb-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter mb-8 leading-[0.9]">
              Start a <br />
              <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                Plant.
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed font-medium max-w-2xl">
              Ready to modernize your village energy? Fill out the feasibility
              form below, and our technical team will reach out.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* --- COMPACT FORM SECTION --- */}
      <Section
        primary
        className="overflow-hidden relative bg-gradient-to-r from-primary to-emerald-600 py-16"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* LEFT: ENHANCED FORM (7 Columns) */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Project Inquiry Form
                </h2>
                <p className="text-emerald-100/70 text-sm">
                  Typical response: 2-4 hours from our field engineers.
                </p>
              </div>

              {/* Row 1: Personal Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Location Info (Village & District) */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    Village / Community Name
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="Enter your village"
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    District & State
                  </label>
                  <input
                    type="text"
                    name="location_details"
                    value={formData.location_details}
                    onChange={handleChange}
                    placeholder="District, State"
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Row 3: Technical Context (Livestock Count) */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    Total Livestock (Cows/Buffaloes)
                  </label>
                  <input
                    type="number"
                    name="livestock_count"
                    value={formData.livestock_count}
                    onChange={handleChange}
                    placeholder="Total animal count"
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    I am a...
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-transparent text-lg text-white outline-none font-medium appearance-none cursor-pointer"
                  >
                    <option className="text-neutral-900" value="farmer">
                      Individual Farmer
                    </option>
                    <option className="text-neutral-900" value="entrepreneur">
                      Village Entrepreneur
                    </option>
                    <option className="text-neutral-900" value="ngo">
                      NGO / Cooperative
                    </option>
                    <option className="text-neutral-900" value="other">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              {/* Row 4: Message */}
              <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                  Additional Details
                </label>
                <textarea
                  rows={2}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your land area or current gas usage..."
                  className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none resize-none font-medium"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="white"
                className="h-14 px-10 text-md font-bold group rounded-full shadow-xl"
              >
                {loading ? "sending..." : "Request Feasibility Survey"}
                <Send
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={16}
                />
              </Button>
            </form>

            {/* RIGHT: DIRECT INFO (5 Columns) */}
            <div className="lg:col-span-5 lg:pl-12 space-y-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0">
              <div className="space-y-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase">
                      Enquiry Email
                    </p>
                    <a
                      href="mailto:village@biogrix.com"
                      className="font-bold hover:text-emerald-200"
                    >
                      village@biogrix.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase">
                      Project Helpline
                    </p>
                    <p className="font-bold">+91 98XXX XXX00</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase">
                      Operational Hub
                    </p>
                    <p className="font-bold text-sm">
                      Ahmedabad, Gujarat, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-5 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-4">
                <Clock className="text-primary shrink-0" size={24} />
                <p className="text-xs text-emerald-100 font-medium">
                  Field Support Active. <br />{" "}
                  <span className="font-bold text-white">
                    Direct callback in 2 hours.
                  </span>
                </p>
              </div>

              {/* 2. COMPLAINT BUTTON (Placed BOTTOM of the Status Badge) 🚀 */}
              <div className="pt-2 flex flex-col gap-3 px-2">
                <div className="text-left bg-red-600 hover:border-red-500/50 py-4 rounded-2xl transition-all group flex items-center justify-between px-6">
                  <p className="text-base font-bold text-white">
                    Register your Complaint
                  </p>
                  <AlertCircle
                    className="text-red-400 group-hover:scale-110 transition-transform"
                    size={20}
                  />
                </div>

                <Button
                  href="/customers_complaints"
                  variant="red"
                  className="px-10 text-base w-full sm:w-auto group"
                >
                  Register Here
                  <ArrowRight
                    className="ml-2 transition-transform group-hover:translate-x-1"
                    size={20}
                  />
                </Button>
              </div>
              
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
