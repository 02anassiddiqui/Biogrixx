// frontend/apps/web/contact.js
import Head from "next/head";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Trans from "../components/ui/Trans";
import { useLanguage } from "../context/LanguageContext";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function Contact() {
  const { translate, lang } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    location_details: "",
    livestock_count: "",
    role: "farmer",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Submitting your inquiry...");

    // --- 🛠️ STEP 1: VALIDATIONS ---

    if (!formData.name || formData.name.length < 3) {
      toast.error("Full Name is required (minimum 3 characters).", {
        id: loadingToast,
      });
      setLoading(false);
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.", {
        id: loadingToast,
      });
      setLoading(false);
      return;
    }

    if (!formData.village) {
      toast.error("Please provide your Village or Community name.", {
        id: loadingToast,
      });
      setLoading(false);
      return;
    }

    if (!formData.location_details) {
      toast.error("District and State information is required.", {
        id: loadingToast,
      });
      setLoading(false);
      return;
    }

    if (!formData.livestock_count || parseInt(formData.livestock_count) <= 0) {
      toast.error("Please provide a valid livestock count.", {
        id: loadingToast,
      });
      setLoading(false);
      return;
    }

    if (!formData.message || formData.message.length < 10) {
      toast.error(
        "Please provide at least 10 characters in Additional Details.",
        { id: loadingToast },
      );
      setLoading(false);
      return;
    }

    const submissionData = {
      ...formData,
      livestock_count: parseInt(formData.livestock_count) || 0,
    };

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

      const response = await fetch(`${API_BASE_URL}/leads/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Project inquiry submitted successfully!", {
          id: loadingToast,
        });
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
        throw new Error(result.message || "Server rejected the request.");
      }
    } catch (error) {
      toast.error("Inquiry Failed: " + error.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {lang === "Hindi"
            ? "Biogrix | संपर्क करें"
            : lang === "Gujarati"
              ? "Biogrix | સંપર્ક કરો"
              : "Contact Us | Biogrix Utility Management"}
        </title>
      </Head>

      {/* Toaster uses global style from _app.js */}
      <Toaster />

      <Section className="bg-white pt-24 pb-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter mb-8 leading-[0.9]">
              <Trans>Start a</Trans> <br />
              <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                <Trans>Plant.</Trans>
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed font-medium max-w-2xl">
              <Trans>
                Ready to modernize your village energy? Fill out the feasibility
                form below, and our technical team will reach out.
              </Trans>
            </p>
          </motion.div>
        </Container>
      </Section>

      <Section
        primary
        className="overflow-hidden relative bg-gradient-to-r from-primary to-emerald-600 py-16"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  <Trans>Project Inquiry Form</Trans>
                </h2>
                <p className="text-emerald-100/70 text-sm font-medium">
                  <Trans>Typical response: 2-4 hours from our engineers.</Trans>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    <Trans>Full Name</Trans>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={lang === "English" ? "e.g. Rajesh Kumar" : ""}
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    <Trans>Phone Number</Trans>
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

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    <Trans>Village Name</Trans>
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder={lang === "English" ? "Enter your village" : ""}
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    <Trans>District & State</Trans>
                  </label>
                  <input
                    type="text"
                    name="location_details"
                    value={formData.location_details}
                    onChange={handleChange}
                    placeholder={lang === "English" ? "District, State" : ""}
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    <Trans>Total Livestock</Trans>
                  </label>
                  <input
                    type="number"
                    name="livestock_count"
                    value={formData.livestock_count}
                    onChange={handleChange}
                    placeholder={lang === "English" ? "Total animal count" : ""}
                    className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none font-medium"
                  />
                </div>
                <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                    <Trans>I am a...</Trans>
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

              <div className="relative border-b border-emerald-300/40 focus-within:border-white transition-all py-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 block">
                  <Trans>Additional Details</Trans>
                </label>
                <textarea
                  rows={2}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={
                    lang === "English"
                      ? "Tell us about your requirements..."
                      : ""
                  }
                  className="w-full bg-transparent text-lg text-white placeholder:text-emerald-300/50 outline-none resize-none font-medium"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="white"
                className="h-14 px-10 text-md font-bold group rounded-full shadow-xl"
              >
                {loading ? (
                  <Trans>Sending...</Trans>
                ) : (
                  <Trans>Request Feasibility Survey</Trans>
                )}
                <Send
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={16}
                />
              </Button>
            </form>

            <div className="lg:col-span-5 lg:pl-12 space-y-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0">
              <div className="space-y-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase">
                      <Trans>Enquiry Email</Trans>
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
                      <Trans>Project Helpline</Trans>
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
                      <Trans>Operational Hub</Trans>
                    </p>
                    <p className="font-bold text-sm">
                      <Trans>Ahmedabad, Gujarat, India</Trans>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-4">
                <Clock className="text-primary shrink-0" size={24} />
                <p className="text-xs text-emerald-100 font-medium">
                  <Trans>Field Support Active.</Trans> <br />
                  <span className="font-bold text-white">
                    <Trans>Direct callback in 2 hours.</Trans>
                  </span>
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3 px-2">
                <div className="text-left bg-red-600 py-4 rounded-2xl group flex items-center justify-between px-6">
                  <p className="text-base font-bold text-white">
                    <Trans>Register your Complaint</Trans>
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
                  <Trans>Register Here</Trans>
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
