import Head from "next/head";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin 
} from "lucide-react";
import Link from "next/link";

export default function CustomerComplaints() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    role: "farmer",
    complaint: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Success state handle karne ke liye

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
        setSubmitted(true);
        setFormData({ name: "", phone: "", village: "", role: "farmer", complaint: "" });
      } else {
        throw new Error(result.message || "Error submitting complaint.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Section className="min-h-screen flex items-center justify-center bg-white">
        <Container className="text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl font-black text-neutral-900 mb-4 uppercase italic">Shikayat Darj Ho Gayi!</h2>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">Hamari technical team agle 2 ghante mein aapko call karegi. Emergency support dispatched hai.</p>
          <Button onClick={() => setSubmitted(false)} variant="primary" className="italic font-bold">New Complaint</Button>
        </Container>
      </Section>
    );
  }

  return (
    <div className="bg-white">
      <Head>
        <title>Report an Issue | Biogrix Support</title>
      </Head>

      {/* --- HERO SECTION --- */}
      <Section className="pt-24 pb-12">
        <Container>
          <Link href="/contact" className="flex items-center gap-2 text-neutral-400 hover:text-primary mb-8 transition-all font-bold uppercase text-[10px] tracking-widest">
            <ArrowLeft size={14} /> Back to Contact
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter mb-8 leading-[0.9]">
              Report <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 italic">
                An Issue.
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed font-medium max-w-2xl">
              Facing issues with your plant or billing? Let us know. Biogrix support is active 24/7 for emergency repairs.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* --- FORM SECTION (Corrected lowercase section tag) --- */}
      <Section dark className="bg-neutral-900 py-20 relative overflow-hidden rounded-t-[4rem]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase italic underline decoration-red-500 decoration-4 underline-offset-8">Complaint Registration</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1 block group-focus-within:text-red-500">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full bg-transparent text-lg text-white outline-none" required />
                </div>
                <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1 block group-focus-within:text-red-500">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" className="w-full bg-transparent text-lg text-white outline-none" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1 block group-focus-within:text-red-500">Village / Community</label>
                  <input type="text" name="village" value={formData.village} onChange={handleChange} placeholder="Village Name" className="w-full bg-transparent text-lg text-white outline-none" required />
                </div>
                <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1 block group-focus-within:text-red-500">I am a...</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-transparent text-lg text-white outline-none appearance-none cursor-pointer">
                    <option value="farmer" className="text-neutral-900">Individual Farmer</option>
                    <option value="entrepreneur" className="text-neutral-900">Village Entrepreneur</option>
                    <option value="ngo" className="text-neutral-900">NGO / Cooperative</option>
                    <option value="other" className="text-neutral-900">Other</option>
                  </select>
                </div>
              </div>

              <div className="relative border-b border-white/10 focus-within:border-red-500 transition-all py-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1 block group-focus-within:text-red-500">Your Complaint</label>
                <textarea rows={3} name="complaint" value={formData.complaint} onChange={handleChange} placeholder="Describe the problem in detail (e.g. Gas leak, meter issue)..." className="w-full bg-transparent text-lg text-white outline-none resize-none font-medium" required />
              </div>

              <Button type="submit" disabled={loading} className="h-14 px-10 text-md font-bold bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-all active:scale-95">
                {loading ? "Registering..." : "Submit Complaint"}
                <AlertCircle className="ml-2" size={18} />
              </Button>
            </form>

            {/* --- SIDEBAR INFO --- */}
            <div className="lg:col-span-5 lg:pl-12 space-y-8 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0">
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                    <Clock size={16} className="text-red-500" /> Response Times
                  </h4>
                  <ul className="space-y-6">
                    <li className="group">
                      <p className="text-[10px] font-black text-red-500 uppercase mb-1">Critical Issues</p>
                      <p className="text-white text-sm font-bold">Gas Leak / Fire Hazard: Under 1 Hour</p>
                    </li>
                    <li className="group">
                      <p className="text-[10px] font-black text-neutral-500 uppercase mb-1">Technical Issues</p>
                      <p className="text-white text-sm font-bold">Pressure Drop / Meter Fault: 4-6 Hours</p>
                    </li>
                    <li className="group">
                      <p className="text-[10px] font-black text-neutral-500 uppercase mb-1">Administrative</p>
                      <p className="text-white text-sm font-bold">Billing / Ownership: 24-48 Hours</p>
                    </li>
                  </ul>
               </div>

               <div className="p-8 border border-white/5 rounded-[2.5rem] bg-gradient-to-br from-red-500/10 to-transparent">
                  <p className="text-xs text-neutral-400 leading-relaxed italic">
                    "Management is the missing link. Biogrix ensures that your complaint is tracked from submission to field resolution."
                  </p>
               </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}