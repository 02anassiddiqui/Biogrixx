import { useState } from "react";
import Trans from "../components/ui/Trans"; // 🚀 Import Trans
import { useLanguage } from "../context/LanguageContext"; // 👈 Context hook
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
  const { translate, lang } = useLanguage(); // 👈 For manual translations
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
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        const errorMsg =
          (await translate("Submission failed: ")) + (result.message || "");
        alert(errorMsg);
      }
    } catch (err) {
      const serverError = await translate(
        "A server error occurred. Please try again later.",
      );
      alert(serverError);
    } finally {
      setLoading(false);
    }
  };

  // --- ✅ SUCCESS SCREEN ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl max-w-md animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4">
            <Trans>Complaint Registered!</Trans>
          </h2>
          <p className="text-neutral-500 font-medium mb-8">
            <Trans>
              Your report has been successfully received. The Biogrix technical
              team will contact you shortly to resolve the issue.
            </Trans>
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all"
          >
            <Trans>Submit Another Report</Trans>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-xl mx-auto">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-2xl italic text-white shadow-lg">
            B
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">
            Biogrix{" "}
            <span className="text-primary text-sm uppercase tracking-widest ml-1">
              <Trans>Support</Trans>
            </span>
          </h1>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-neutral-100">
          <h2 className="text-2xl font-black text-neutral-900 mb-2">
            <Trans>Help Center</Trans>
          </h2>
          <p className="text-neutral-400 text-sm font-medium mb-10">
            <Trans>Please provide the details of your issue below.</Trans>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                <Trans>Full Name</Trans>
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder={lang === "English" ? "e.g. John Doe" : ""}
                  className="w-full pl-12 pr-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Phone & Village Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                  <Trans>Phone Number</Trans>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type="tel"
                    placeholder={
                      lang === "English" ? "10-digit mobile number" : ""
                    }
                    className="w-full pl-12 pr-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                  <Trans>Village</Trans>
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder={lang === "English" ? "Enter village name" : ""}
                    className="w-full pl-12 pr-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    value={formData.village}
                    onChange={(e) =>
                      setFormData({ ...formData, village: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Issue Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                <Trans>Issue Category</Trans>
              </label>
              <div className="relative">
                <AlertTriangle
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                  size={18}
                />
                <select
                  className="w-full pl-12 pr-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none cursor-pointer"
                  value={formData.issue_type}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_type: e.target.value })
                  }
                >
                  <option value="Gas Leakage">
                    {lang === "English" ? "Gas Leakage / Odor" : "Gas Leakage"}
                  </option>
                  <option value="Low Pressure">
                    {lang === "English" ? "Low Gas Pressure" : "Low Pressure"}
                  </option>
                  <option value="Billing Issue">
                    {lang === "English"
                      ? "Billing & Payments"
                      : "Billing Issue"}
                  </option>
                  <option value="Meter Issue">
                    {lang === "English"
                      ? "Meter / Hardware Issue"
                      : "Meter Issue"}
                  </option>
                  <option value="Other">
                    {lang === "English" ? "Other / Miscellaneous" : "Other"}
                  </option>
                </select>
                {/* Note: Select labels ko Gemini automatically handle karega through Trans if we wrap them, 
                    but options are better handled like this for logic stability */}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                <Trans>Detailed Description</Trans>
              </label>
              <textarea
                rows="4"
                placeholder={
                  lang === "English" ? "Describe your issue in detail..." : ""
                }
                className="w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-neutral-900 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
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
