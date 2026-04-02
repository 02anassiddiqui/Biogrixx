import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Phone,
  MapPin,
  Loader2,
  Trash2,
  Users,
  Calendar,
  Activity,
  RefreshCw,
  Search,
  Zap,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // 🚀 CHANGE 1: Maine yahan API_BASE_URL ko define kiya hai
  // Taaki ye Vercel se aapka Render URL utha sake, ya local par localhost:4000 use kare.
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.village?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // 🚀 CHANGE 2: Yahan localhost:4000 ki jagah `${API_BASE_URL}/customers` use kiya hai.
      // Dhyan rakhein ki variable mein agar pehle se /v1 hai, toh yahan dobara mat likhna.
      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
        const today = new Date().toISOString().split("T")[0];
        const todayCount = result.data.filter((l) =>
          l.created_at.startsWith(today),
        ).length;
        setStats({ total: result.data.length, today: todayCount });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, delete kar dein?")) return;
    try {
      // 🚀 CHANGE 3: Yahan DELETE request mein bhi localhost hata kar API_BASE_URL daal diya hai.
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });
      const result = await response.json();
      if (result.success) {
        setLeads(leads.filter((l) => l.id !== id));
        setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("biogrix_admin_key");
    router.push("/login");
  };

  useEffect(() => {
    const key = localStorage.getItem("biogrix_admin_key");
    if (!key) {
      router.push("/login");
    } else {
      fetchLeads();
    }
  }, []);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??"
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      <Head>
        <title>Control Center | Biogrix Digital Infrastructure</title>
      </Head>

      {/* --- HEADER SECTION --- */}
      <div className="bg-white pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100 inline-block">
                Digital Infrastructure
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-neutral-900 leading-[0.9] tracking-tighter">
                Lead <br />
                <span className="text-transparent italic bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">
                  Warehouse.
                </span>
              </h1>
            </div>

            <div className="flex gap-4 mt-8 md:mt-0">
              <button
                onClick={fetchLeads}
                className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all shadow-2xl active:scale-95"
              >
                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : "group-hover:rotate-180 transition-transform duration-500"
                  }
                />
                Sync Infrastructure
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center bg-emerald-500 px-8 py-5 rounded-2xl gap-2 text-white hover:bg-red-600 font-black uppercase text-[10px] tracking-widest transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 py-16 relative overflow-hidden rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              label="Methane Network"
              value={stats.total}
              icon={<Users size={22} />}
            />
            <StatCard
              label="Active Intake"
              value={stats.today}
              icon={<Calendar size={22} />}
            />
            <StatCard
              label="Grid Efficiency"
              value="94%"
              icon={<Zap size={22} />}
            />
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 mb-24 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 overflow-hidden">
          <div className="p-8 border-b border-neutral-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Activity size={20} />
              </div>
              <h2 className="text-lg font-black text-neutral-900 tracking-tight italic uppercase">
                Lead Monitoring
              </h2>
            </div>
            <div className="relative w-full md:w-72">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                size={16}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="QUICK SEARCH..."
                className="w-full pl-11 pr-6 py-3 bg-neutral-50 border-none rounded-xl text-[10px] font-black tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all uppercase"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Loading Infrastructure...
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/50 text-neutral-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    <th className="px-6 py-5">Farmer</th>
                    <th className="px-6 py-5">Village</th>
                    <th className="px-6 py-5">Livestock</th>
                    <th className="px-6 py-5">Note</th>
                    <th className="px-6 py-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-emerald-50/10 transition-all group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-[10px]">
                            {getInitials(lead.name)}
                          </div>
                          <div>
                            <div className="font-black text-neutral-900 uppercase text-xs tracking-tight">
                              {lead.name}
                            </div>
                            <div className="text-[9px] text-neutral-400 font-bold flex items-center gap-1 mt-0.5">
                              <Phone size={8} className="text-emerald-500" />{" "}
                              {lead.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-emerald-500" />
                          <span className="text-[11px] font-black text-neutral-700 uppercase">
                            {lead.village}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-end gap-1">
                          <span className="text-xl font-black text-neutral-900 leading-none">
                            {lead.livestock_count}
                          </span>
                          <span className="text-[8px] font-black text-emerald-500 uppercase mb-0.5 tracking-tighter">
                            Heads
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[10px] text-neutral-500 italic truncate max-w-[150px]">
                          {lead.message || "---"}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <span className="text-[9px] font-black text-neutral-300 uppercase italic">
                            {new Date(lead.created_at).toLocaleDateString(
                              "en-GB",
                              { day: "2-digit", month: "short" },
                            )}
                          </span>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-2 text-neutral-200 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] flex flex-col justify-between h-44 group hover:bg-white/15 transition-all">
      <div className="text-emerald-200">{icon}</div>
      <div>
        <div className="text-4xl font-black text-white tracking-tighter mb-1.5">
          {value}
        </div>
        <div className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-100/60 leading-none">
          {label}
        </div>
      </div>
    </div>
  );
}
