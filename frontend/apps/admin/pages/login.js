import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
// 🚀 Eye aur EyeOff icons add kiye
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Password visibility state
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("biogrix_auth_token", result.token);
        router.push("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Server connection failed!");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 font-sans">
      <Head>
        <title>Secure Access | Biogrix Admin</title>
      </Head>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <ShieldCheck className="text-emerald-500" size={40} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">
            Secure <br />{" "}
            <span className="text-emerald-500 italic">Login.</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          {/* --- EMAIL FIELD --- */}
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              type="email"
              required
              placeholder="ADMIN EMAIL"
              className="w-full pl-12 pr-4 py-5 bg-neutral-800/50 border border-neutral-700 rounded-2xl text-white font-black tracking-widest text-[10px] outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* --- PASSWORD FIELD --- */}
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />

            <input
              // 🔄 Dynamic type: password ya text
              type={showPassword ? "text" : "password"}
              required
              placeholder="MASTER PASSKEY"
              className="w-full pl-12 pr-12 py-5 bg-neutral-800/50 border border-neutral-700 rounded-2xl text-white font-black tracking-widest text-[10px] outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁️ Eye Toggle Button */}
            <button
              type="button" // 👈 Important: taaki form submit na ho jaye
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-emerald-500 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-[10px] font-black uppercase text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-2xl active:scale-[0.98]"
          >
            Enter Dashboard <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
