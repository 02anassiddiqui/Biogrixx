import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  KeyRound,
  Percent,
  Trash2,
  X,
  Save,
  Loader2,
  Camera,
  ShieldAlert,
  ChevronRight,
  Activity,
  ShieldCheck,
} from "lucide-react";

// 🛠️ Keep existing Logic - Image Compression
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function ProfileModule({ onExit }) {
  const fileInputRef = useRef(null);
  const [activeSubTab, setActiveSubTab] = useState("edit-profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showGSTPopup, setShowGSTPopup] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profile_image: "",
  });
  const [gstValue, setGstValue] = useState(18);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiRequest("/profile");
        if (res.success) {
          setProfile({
            name: res.data.name || "",
            email: res.data.email || "",
            profile_image: res.data.profile_image || "",
          });
          setGstValue(res.data.gst_percentage || 18);
        }
      } catch (err) {
        toast.error("Core sync failed.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setProfile((prev) => ({ ...prev, profile_image: compressedBase64 }));
        toast.success("Photo optimized!");
      } catch (err) {
        toast.error("Process failed.");
      }
    }
  };

  const handleFinalSave = async () => {
    setSaving(true);
    try {
      if (activeSubTab === "edit-profile") {
        const cleanData = {
          name: profile.name,
          email: profile.email,
          profile_image: profile.profile_image,
        };
        await apiRequest("/profile/update", {
          method: "PATCH",
          body: cleanData,
        });
        toast.success("Identity synchronized.");
      }
      if (activeSubTab === "password") {
        if (passwords.new !== passwords.confirm)
          throw new Error("Mismatch detected.");
        await apiRequest("/profile/password", {
          method: "PATCH",
          body: { currentPassword: passwords.old, newPassword: passwords.new },
        });
        toast.success("Passkey updated.");
        setPasswords({ old: "", new: "", confirm: "" });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGSTUpdate = async () => {
    try {
      await apiRequest("/profile/gst", {
        method: "PATCH",
        body: { gst: Number(gstValue) },
      });
      toast.success(`Tax grid updated: ${gstValue}%`);
      setShowGSTPopup(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("CRITICAL: Terminate account?")) return;
    try {
      await apiRequest("/profile/terminate", { method: "DELETE" });
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );

  return (
    <div className="fixed inset-0 z-[150] bg-slate-50 flex flex-col animate-in fade-in duration-300 font-sans selection:bg-emerald-100">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* --- PREMIUM TOP BAR --- */}
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-primary p-2 rounded-xl">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
              Control <span className="text-primary">Profile</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Management Core / v2.1
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="group uppercase flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-primary transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          <X size={16} className="group-hover:rotate-90 transition-transform" />{" "}
          Exit Profile
        </button>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* --- LEFT NAVIGATION --- */}
        <aside className="w-80 bg-white border-r border-slate-200 p-8 space-y-3 overflow-y-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
            Primary Settings
          </p>
          <SubTabBtn
            active={activeSubTab === "edit-profile"}
            onClick={() => setActiveSubTab("edit-profile")}
            icon={<User size={18} />}
            label="Profile"
          />
          <SubTabBtn
            active={false}
            onClick={() => setShowGSTPopup(true)}
            icon={<Percent size={18} />}
            label="Taxation/GST Grid"
          />
          <SubTabBtn
            active={activeSubTab === "password"}
            onClick={() => setActiveSubTab("password")}
            icon={<KeyRound size={18} />}
            label="Password"
          />

          <div className="pt-8 mt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
              Danger Zone
            </p>
            <SubTabBtn
              active={activeSubTab === "delete"}
              onClick={() => setActiveSubTab("delete")}
              icon={<Trash2 size={18} />}
              label="Delete Account"
              danger
            />
          </div>
        </aside>

        {/* --- MAIN WORKSPACE --- */}
        <main className="flex-1 p-16 overflow-y-auto bg-[#FDFDFD]">
          <div className="max-w-3xl mx-auto">
            {activeSubTab === "edit-profile" && (
              <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-500">
                <div className="flex items-center gap-10">
                  <div
                    onClick={handleImageClick}
                    className="group w-40 h-40 rounded-[3rem] bg-white border-2 border-slate-100 shadow-2xl flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-primary transition-all ring-8 ring-slate-50"
                  >
                    {profile.profile_image ? (
                      <img
                        src={profile.profile_image}
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                        alt="Profile"
                      />
                    ) : (
                      <div className="text-slate-200">
                        <User size={64} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <Camera size={28} />
                      <span className="text-[10px] font-black mt-2 uppercase tracking-tighter">
                        Upload New
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                      Administrator
                    </h3>
                    <p className="text-slate-400 font-bold text-sm tracking-tight flex items-center gap-2">
                      <ShieldCheck size={16} className="text-primary" />{" "}
                      Authorized Biogrix Personnel
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  <InputField
                    label="Full Access Name"
                    value={profile.name}
                    onChange={(v) => setProfile({ ...profile, name: v })}
                    placeholder="Master Admin"
                  />
                  <InputField
                    label="Registered Email"
                    value={profile.email}
                    onChange={(v) => setProfile({ ...profile, email: v })}
                    placeholder="root@biogrix.com"
                  />
                </div>
              </div>
            )}

            {activeSubTab === "password" && (
              <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-500">
                <div className="space-y-2">
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                    Security Grid
                  </h3>
                  <p className="text-slate-400 font-bold">
                    Manage encrypted access credentials.
                  </p>
                </div>
                <div className="grid gap-8 pt-4">
                  <InputField
                    type="password"
                    label="Verification Current Passkey"
                    value={passwords.old}
                    onChange={(v) => setPasswords({ ...passwords, old: v })}
                  />
                  <div className="grid grid-cols-2 gap-8">
                    <InputField
                      type="password"
                      label="New Security Key"
                      value={passwords.new}
                      onChange={(v) => setPasswords({ ...passwords, new: v })}
                    />
                    <InputField
                      type="password"
                      label="Confirm New Key"
                      value={passwords.confirm}
                      onChange={(v) =>
                        setPasswords({ ...passwords, confirm: v })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === "delete" && (
              <div className="bg-white p-16 rounded-[4rem] border-2 border-red-50 shadow-2xl shadow-red-100 space-y-8 animate-in zoom-in-95 duration-500 text-center">
                <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-600 mx-auto border-2 border-red-100 shadow-inner">
                  <ShieldAlert size={48} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                    Emergency Termination
                  </h3>
                  <p className="text-slate-500 font-bold max-w-md mx-auto">
                    This action will permanently revoke your digital signature
                    and wipe local session data.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs hover:bg-slate-900 transition-all shadow-xl shadow-red-200"
                >
                  CONFIRM ROOT WIPEOUT
                </button>
              </div>
            )}

            {activeSubTab !== "delete" && (
              <div className="mt-20 pt-10 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleFinalSave}
                  disabled={saving}
                  className="group bg-slate-900 text-white px-14 py-6 rounded-[2.5rem] font-black text-xs flex items-center gap-4 shadow-2xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                  )}
                  {saving ? "SYNCHRONIZING..." : "SAVE CHANGES"}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* --- RIGHT STATUS PANEL --- */}
        <aside className="w-96 border-l border-slate-200 p-10 flex flex-col items-center justify-center bg-white space-y-12">
          <div className="relative">
            <svg className="w-48 h-48 -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-slate-50"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray="552.92"
                strokeDashoffset={552.92 * (1 - 0.85)}
                className="text-primary transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">
                85%
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Reliability
              </span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 hover:border-emerald-200 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-black text-xs">
                A1
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Infrastructure Role
                </p>
                <p className="text-sm font-black text-slate-900">
                  System Architect
                </p>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Security Level
                </p>
                <p className="text-sm font-black text-slate-900">
                  Encrypted Root
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* --- GST MODAL --- */}
      {showGSTPopup && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[4rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <X
                className="cursor-pointer text-slate-300 hover:text-slate-900"
                onClick={() => setShowGSTPopup(false)}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter">
                Tax Grid Update
              </h4>
              <p className="text-sm font-bold text-slate-400">
                Modify global GST parameters.
              </p>
            </div>
            <div className="flex items-center gap-6 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
              <input
                type="number"
                value={gstValue}
                onChange={(e) => setGstValue(e.target.value)}
                className="text-7xl font-black w-full bg-transparent text-primary outline-none tracking-tighter"
              />
              <span className="text-4xl font-black text-slate-200">%</span>
            </div>
            <button
              onClick={handleGSTUpdate}
              className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-xs hover:bg-primary transition-all shadow-2xl shadow-slate-200"
            >
              CONFIRM GRID UPDATES
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function SubTabBtn({ active, onClick, icon, label, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between group px-6 py-5 rounded-3xl text-sm font-black transition-all ${
        active
          ? "bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-[1.02]"
          : danger
            ? "text-red-500 hover:bg-red-50"
            : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className="tracking-tight uppercase text-[11px] font-black">
          {label}
        </span>
      </div>
      {active && <ChevronRight size={14} className="text-emerald-400" />}
    </button>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
        {label}
      </label>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-8 py-6 bg-white border-2 border-slate-100 rounded-[2.5rem] outline-none focus:border-primary/30 focus:ring-8 focus:ring-primary/5 font-black text-slate-900 transition-all placeholder:text-slate-200"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </div>
      </div>
    </div>
  );
}
