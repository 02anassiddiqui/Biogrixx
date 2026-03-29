import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🚀 Backend se password verify kar rahe hain
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passkey }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("biogrix_admin_key", result.token);
        router.push("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Server se connect nahi ho pa raha!");
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
            Control <br />{" "}
            <span className="text-emerald-500 italic">Access.</span>
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em]">
            Digital Infrastructure Node
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              type="password"
              required
              placeholder="ENTER MASTER PASSKEY"
              className="w-full pl-12 pr-4 py-5 bg-neutral-800/50 border border-neutral-700 rounded-2xl text-white font-black tracking-widest text-[10px] outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all uppercase placeholder:text-neutral-600"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
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
            Access Dashboard <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-neutral-600 text-[9px] font-black uppercase tracking-widest">
          © 2026 Biogrix Utility Management • Encryption Active
        </p>
      </div>
    </div>
  );
}
