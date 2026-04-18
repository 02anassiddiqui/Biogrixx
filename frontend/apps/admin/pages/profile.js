// frontend/pages/profile.js
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
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

// 🛠️ Logic - Image Compression (Kept as is)
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
        resolve(canvas.toDataURL("image/jpeg", 0.7));
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
        toast.error("Profile sync offline.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const loadToast = toast.loading("Optimizing identity photo...");
      try {
        const compressedBase64 = await compressImage(file);
        setProfile((prev) => ({ ...prev, profile_image: compressedBase64 }));
        toast.success("Photo optimized.", { id: loadToast });
      } catch (err) {
        toast.error("Process failed.", { id: loadToast });
      }
    }
  };

  const handleFinalSave = async () => {
    const loadToast = toast.loading("Syncing credentials...");
    setSaving(true);
    try {
      if (activeSubTab === "edit-profile") {
        await apiRequest("/profile/update", {
          method: "PATCH",
          body: {
            name: profile.name,
            email: profile.email,
            profile_image: profile.profile_image,
          },
        });
        toast.success("Identity updated.", { id: loadToast });
      }
      if (activeSubTab === "password") {
        if (passwords.new !== passwords.confirm)
          throw new Error("Key mismatch detected.");
        await apiRequest("/profile/password", {
          method: "PATCH",
          body: { currentPassword: passwords.old, newPassword: passwords.new },
        });
        toast.success("Security keys rotated.", { id: loadToast });
        setPasswords({ old: "", new: "", confirm: "" });
      }
    } catch (err) {
      toast.error(err.message || "Synchronization failed.", { id: loadToast });
    } finally {
      setSaving(false);
    }
  };

  const handleGSTUpdate = async () => {
    const loadToast = toast.loading("Updating tax grid...");
    try {
      await apiRequest("/profile/gst", {
        method: "PATCH",
        body: { gst: Number(gstValue) },
      });
      toast.success(`GST set to ${gstValue}%`, { id: loadToast });
      setShowGSTPopup(false);
    } catch (err) {
      toast.error(err.message, { id: loadToast });
    }
  };

  const confirmTerminate = () => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in zoom-in-95" : "animate-out fade-out zoom-out-95"} max-w-sm w-full bg-zinc-900 border border-white/10 shadow-2xl rounded-[2rem] p-6 flex flex-col`}
        >
          <div className="flex items-start gap-4">
            <div className="bg-red-500/10 p-3 rounded-2xl text-red-500">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-tight uppercase">
                Terminate Root?
              </h3>
              <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                This will permanently purge your digital signature from the
                system.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await apiRequest("/profile/terminate", { method: "DELETE" });
                  window.location.href = "/login";
                } catch (e) {
                  toast.error("Action denied.");
                }
              }}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-zinc-800 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { position: "top-center" },
    );
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <div className="fixed inset-0 z-[150] bg-zinc-50 flex flex-col animate-in fade-in duration-500 selection:bg-primary/10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* --- TOP NAVIGATION --- */}
      <nav className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-12 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">
              Admin <span className="text-primary">Console</span>
            </h2>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              Management Node
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <X size={14} /> Exit System
        </button>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* --- LEFT SIDEBAR --- */}
        <aside className="w-80 bg-white border-r border-zinc-200 p-10 space-y-2 shrink-0">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">
            System Configuration
          </p>
          <SubTabBtn
            active={activeSubTab === "edit-profile"}
            onClick={() => setActiveSubTab("edit-profile")}
            icon={<User size={18} />}
            label="Identity"
          />
          <SubTabBtn
            active={false}
            onClick={() => setShowGSTPopup(true)}
            icon={<Percent size={18} />}
            label="Taxation Grid"
          />
          <SubTabBtn
            active={activeSubTab === "password"}
            onClick={() => setActiveSubTab("password")}
            icon={<KeyRound size={18} />}
            label="Security Keys"
          />

          <div className="pt-8 mt-8 border-t border-zinc-100">
            <SubTabBtn
              active={activeSubTab === "delete"}
              onClick={() => setActiveSubTab("delete")}
              icon={<Trash2 size={18} />}
              label="Purge Account"
              danger
            />
          </div>
        </aside>

        {/* --- MAIN WORKSPACE --- */}
        <main className="flex-1 p-20 overflow-y-auto bg-white/40">
          <div className="max-w-3xl mx-auto">
            {activeSubTab === "edit-profile" && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-12">
                <div className="flex items-center gap-10">
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="group relative w-32 h-32 rounded-[2.5rem] bg-white border-4 border-zinc-100 shadow-2xl overflow-hidden cursor-pointer transition-all hover:scale-105"
                  >
                    {profile.profile_image ? (
                      <img
                        src={profile.profile_image}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-200">
                        <User size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white backdrop-blur-sm">
                      <Camera size={24} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">
                      Administrator
                    </h3>
                    <p className="text-zinc-400 text-sm font-bold flex items-center gap-2 tracking-tight uppercase">
                      <ShieldCheck size={14} className="text-primary" />{" "}
                      Verified Biogrix Root Access
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10 pt-6">
                  <InputField
                    label="Admin Designation"
                    value={profile.name}
                    onChange={(v) => setProfile({ ...profile, name: v })}
                    placeholder="Master Admin"
                  />
                  <InputField
                    label="System Email"
                    value={profile.email}
                    onChange={(v) => setProfile({ ...profile, email: v })}
                    placeholder="admin@biogrix.com"
                  />
                </div>
              </div>
            )}

            {activeSubTab === "password" && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-10">
                <h3 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">
                  Access Encryption
                </h3>
                <div className="grid gap-10">
                  {/* 🚀 EYE ICON added here in 'old password' field */}
                  <InputField
                    type="password"
                    allowToggle
                    label="Current Security Key"
                    value={passwords.old}
                    onChange={(v) => setPasswords({ ...passwords, old: v })}
                    placeholder="••••••••"
                  />

                  <div className="grid grid-cols-2 gap-10">
                    <InputField
                      type="password"
                      label="New Security Key"
                      value={passwords.new}
                      onChange={(v) => setPasswords({ ...passwords, new: v })}
                      placeholder="••••••••"
                    />
                    <InputField
                      type="password"
                      label="Verify Key"
                      value={passwords.confirm}
                      onChange={(v) =>
                        setPasswords({ ...passwords, confirm: v })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === "delete" && (
              <div className="bg-white p-16 rounded-[3.5rem] border border-red-50 text-center space-y-8 shadow-2xl shadow-red-100/50">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-red-100">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">
                  Root Termination
                </h3>
                <p className="text-zinc-500 text-sm font-bold max-w-xs mx-auto leading-relaxed">
                  Danger: This will permanently wipe your digital identity and
                  session keys from the grid node.
                </p>
                <button
                  onClick={confirmTerminate}
                  className="bg-red-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-xl shadow-red-100"
                >
                  Initialize Wipeout
                </button>
              </div>
            )}

            {activeSubTab !== "delete" && (
              <div className="mt-24 pt-10 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={handleFinalSave}
                  disabled={saving}
                  className="bg-zinc-900 text-white px-14 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-3 shadow-2xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}{" "}
                  {saving ? "Synchronizing..." : "Commit Changes"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- GST MODAL --- */}
      {showGSTPopup && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-zinc-900/40 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-12 shadow-2xl space-y-10 relative border border-zinc-100">
            <button
              className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-900 transition-colors"
              onClick={() => setShowGSTPopup(false)}
            >
              <X size={20} />
            </button>
            <div className="space-y-1 text-center">
              <h4 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase italic">
                Taxation Grid
              </h4>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                Global GST Configuration
              </p>
            </div>
            <div className="flex items-center gap-4 bg-zinc-100 p-10 rounded-[2.5rem] border border-zinc-200 shadow-inner">
              <input
                type="number"
                value={gstValue}
                onChange={(e) => setGstValue(e.target.value)}
                className="text-7xl font-black w-full bg-transparent text-primary outline-none tracking-tighter"
              />
              <span className="text-4xl font-black text-zinc-300">%</span>
            </div>
            <button
              onClick={handleGSTUpdate}
              className="w-full bg-zinc-900 text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl"
            >
              Push Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 Minimalist Navigation Button
function SubTabBtn({ active, onClick, icon, label, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200" : danger ? "text-red-500 hover:bg-red-50" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900"}`}
    >
      <div className="flex items-center gap-4">
        {icon} <span>{label}</span>
      </div>
      {active && <ChevronRight size={12} className="text-primary" />}
    </button>
  );
}

// 🎨 Smart InputField with Toggle Support
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  allowToggle = false,
}) {
  const [show, setShow] = useState(false);
  const inputType = allowToggle ? (show ? "text" : "password") : type;

  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-5 bg-zinc-100 border border-zinc-200 rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/5 font-bold text-zinc-900 transition-all text-sm shadow-sm"
        />
        {allowToggle && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-primary transition-colors p-1"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
