import Head from "next/head";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CustomerComplaints() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    location_details: "",
    role: "farmer",
    complaint: "", // Replaced 'message'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";
      const response = await fetch(`${API_BASE_URL}/customers/complaint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("Shikayat darj ho gayi hai. Hamari team jaldi sampark karegi.");
        setFormData({ name: "", phone: "", village: "", location_details: "", role: "farmer", complaint: "" });
      } else {
        throw new Error(result.message || "Error submitting complaint.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Customer Complaints | Biogrix Support</title>
      </Head>

      <Section className="bg-white pt-24 pb-12">
        <Container>
          <Link href="/contact" className="flex items-center gap-2 text-neutral-400 hover:text-primary mb-8 transition-all font-bold uppercase text-[10px] tracking-widest">
            <ArrowLeft size={14} /> Back to Contact
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter mb-8 leading-[0.9]">
              Report <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
                An Issue.
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed font-medium max-w-2xl">
              Facing issues with your plant or billing? Let us know. Biogrix support is active 24/7 for emergency repairs.
            </p>
          </motion.div>
        </Container>
      </Section>

      <section className="bg-neutral-900 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Complaint Registration</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1 block">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full bg-transparent text-lg text-white outline-none" required />
                </div>
                <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1 block">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" className="w-full bg-transparent text-lg text-white outline-none" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1 block">Village / Community</label>
                  <input type="text" name="village" value={formData.village} onChange={handleChange} placeholder="Village Name" className="w-full bg-transparent text-lg text-white outline-none" required />
                </div>
                <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1 block">I am a...</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-transparent text-lg text-white outline-none appearance-none cursor-pointer">
                    <option value="farmer" className="text-neutral-900">Individual Farmer</option>
                    <option value="entrepreneur" className="text-neutral-900">Village Entrepreneur</option>
                    <option value="ngo" className="text-neutral-900">NGO / Cooperative</option>
                    <option value="other" className="text-neutral-900">Other</option>
                  </select>
                </div>
              </div>

              <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1 block">Your Complaint</label>
                <textarea rows={3} name="complaint" value={formData.complaint} onChange={handleChange} placeholder="Describe the problem you are facing in detail..." className="w-full bg-transparent text-lg text-white outline-none resize-none" required />
              </div>

              <Button variant="black" type="submit" disabled={loading} className="h-14 px-10 text-md font-bold bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl">
                {loading ? "Registering..." : "Submit Complaint"}
                <AlertCircle className="ml-2" size={18} />
              </Button>
            </form>

            <div className="lg:col-span-5 lg:pl-12 space-y-8 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0">
               <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-red-500" /> Resolution Time
                  </h4>
                  <ul className="space-y-4">
                    <li className="text-neutral-400 text-sm italic font-medium border-l-2 border-red-500/30 pl-4">Gas Leak: Immediate Response (Under 1 hour)</li>
                    <li className="text-neutral-400 text-sm italic font-medium border-l-2 border-red-500/30 pl-4">Billing Issue: 24-48 Hours</li>
                    <li className="text-neutral-400 text-sm italic font-medium border-l-2 border-red-500/30 pl-4">Pressure Drop: Under 4 hours</li>
                  </ul>
               </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}