// frontend/apps/web/customers_complaints.js
import { useState } from "react";
import Trans from "../components/ui/Trans";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast"; // 🚀 Added Toast
import {
  Send,
  Phone,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function PublicComplaint() {
  const { translate, lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    issue_type: "Gas Leakage",
    description: "",
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Registering your report...");

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Complaint submitted successfully.", {
          id: loadingToast,
        });
        setSubmitted(true);
      } else {
        toast.error(result.message || "Failed to submit report.", {
          id: loadingToast,
        });
      }
    } catch (err) {
      toast.error("Connection error. Please try again later.", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-md animate-in zoom-in duration-500 border border-emerald-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4 tracking-tighter">
            <Trans>Complaint Registered!</Trans>
          </h2>
          <p className="text-neutral-500 font-medium mb-10 leading-relaxed">
            <Trans>
              Your report has been successfully received. The Biogrix technical
              team will contact you shortly to resolve the issue.
            </Trans>
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Trans>Submit Another Report</Trans>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-14 h-14 bg-primary rounded-[1.25rem] flex items-center justify-center font-black text-2xl italic text-white shadow-xl shadow-primary/20">
            B
          </div>
          <h1 className="text-4xl font-black text-neutral-900 tracking-tighter">
            Biogrix{" "}
            <span className="text-primary text-xs uppercase tracking-[0.3em] ml-2 font-bold bg-primary/5 px-3 py-1 rounded-lg">
              <Trans>Support</Trans>
            </span>
          </h1>
        </div>

        <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-neutral-100">
          <h2 className="text-3xl font-black text-neutral-900 mb-2 tracking-tight">
            <Trans>Help Center</Trans>
          </h2>
          <p className="text-neutral-400 text-sm font-medium mb-12">
            <Trans>Please provide the details of your issue below.</Trans>
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                <Trans>Full Name</Trans>
              </label>
              <div className="relative">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                  size={20}
                />
                <input
                  required
                  type="text"
                  placeholder={lang === "English" ? "e.g. John Doe" : ""}
                  className="w-full pl-14 pr-6 py-5 bg-neutral-50 rounded-[1.25rem] border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                  <Trans>Phone Number</Trans>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={20}
                  />
                  <input
                    required
                    type="tel"
                    className="w-full pl-14 pr-6 py-5 bg-neutral-50 rounded-[1.25rem] border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                  <Trans>Village</Trans>
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={20}
                  />
                  <input
                    required
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-neutral-50 rounded-[1.25rem] border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold"
                    value={formData.village}
                    onChange={(e) =>
                      setFormData({ ...formData, village: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                <Trans>Issue Category</Trans>
              </label>
              <div className="relative">
                <AlertTriangle
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                  size={20}
                />
                <select
                  className="w-full pl-14 pr-12 py-5 bg-neutral-50 rounded-[1.25rem] border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold appearance-none cursor-pointer"
                  value={formData.issue_type}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_type: e.target.value })
                  }
                >
                  <option value="Gas Leakage">Gas Leakage / Odor</option>
                  <option value="Low Pressure">Low Gas Pressure</option>
                  <option value="Billing Issue">Billing & Payments</option>
                  <option value="Meter Issue">Meter / Hardware Issue</option>
                  <option value="Other">Other / Miscellaneous</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                <Trans>Detailed Description</Trans>
              </label>
              <textarea
                rows="4"
                className="w-full px-6 py-5 bg-neutral-50 rounded-[1.25rem] border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.25em] shadow-2xl shadow-primary/20 hover:bg-neutral-900 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <Trans>Submitting...</Trans>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <Trans>Submit Complaint</Trans>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
