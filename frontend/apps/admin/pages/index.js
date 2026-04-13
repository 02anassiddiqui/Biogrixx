import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Sidebar } from "../components/ui/Sidebar";
import ProfileModule from "./profile"; 
import PlantsModule from "./plants";
import CustomersModule from "./customers";
import MetersModule from "./meters";
import UsageHistoryModule from "./gas-usage";
import BillingModule from "./billing";
import PaymentLedgerModule from "./payments";
import ComplaintsModule from "./complaints";
import MaintenanceModule from "./maintenance";
import ReportsModule from "./reports";
import { apiRequest } from "../services/api";

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
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  ChevronDown,
  Factory,
  X,
  User as UserIcon,
} from "lucide-react";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [plants, setPlants] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionData, setConversionData] = useState({ plant_id: "" });

  const [showProfile, setShowProfile] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "Biogrix Admin",
    profile_image: null,
  });

  const router = useRouter();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("/leads");
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

  const fetchProfile = async () => {
    try {
      const res = await apiRequest("/profile");
      if (res.success) {
        setAdminData({
          name: res.data.name,
          profile_image: res.data.profile_image,
        });
      }
    } catch (err) {
      console.error("Profile sync failed");
    }
  };

  const fetchPlantsForConversion = async () => {
    try {
      const result = await apiRequest("/plants");
      if (result.success) setPlants(result.data);
    } catch (error) {
      console.error("Failed to fetch plants:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, are you sure? Ye lead hamesha ke liye delete ho jayegi!")) return;
    try {
      const result = await apiRequest(`/leads/${id}`, { method: "DELETE" });
      if (result.success) {
        setLeads(leads.filter((l) => l.id !== id));
        setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (newStatus === "converted") {
      const lead = leads.find((l) => l.id === id);
      setSelectedLead(lead);
      setConversionData({ plant_id: "" });
      fetchPlantsForConversion();
      setShowConvertModal(true);
      return;
    }
    try {
      const result = await apiRequest(`/leads/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      if (result.success) {
        setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleFinalConversion = async () => {
    if (!conversionData.plant_id) {
      alert("Bhai, pehle plant select toh karo!");
      return;
    }
    setIsConverting(true);
    try {
      const result = await apiRequest(`/leads/${selectedLead.id}/convert`, {
        method: "POST",
        body: { plant_id: conversionData.plant_id },
      });
      if (result.success) {
        setShowConvertModal(false);
        alert("Mubarak Ho! Lead ab customer ban chuki hai.");
        fetchLeads();
      }
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("biogrix_auth_token");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("biogrix_auth_token");
    if (!token) {
      router.push("/login");
    } else {
      fetchLeads();
      fetchProfile();
    }
  }, []);

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.villages?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-100 overflow-hidden">
      <Head>
        <title>Control Center | Biogrix Digital Infrastructure</title>
      </Head>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 min-w-0 overflow-y-auto h-screen no-scrollbar relative flex flex-col">
        
        {/* --- 🛠️ REFINED HEADER (Compact but Professional) --- */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-neutral-100 sticky top-0 z-40 px-12 shrink-0">
          
          {/* 🚀 TOP ROW: Balanced Profile Trigger */}
          <div className="flex justify-end py-6">
            <div
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-4 cursor-pointer hover:bg-neutral-50 p-2 px-4 rounded-[2rem] transition-all group border border-transparent hover:border-neutral-100 bg-white/50 shadow-sm"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-neutral-900 group-hover:text-primary transition-colors leading-none uppercase tracking-tighter">
                  {adminData.name}
                </p>
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                  System Administrator
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-neutral-100 overflow-hidden flex items-center justify-center group-hover:border-primary transition-all">
                {adminData.profile_image ? (
                  <img
                    src={adminData.profile_image}
                    className="w-full h-full object-cover"
                    alt="Admin"
                  />
                ) : (
                  <UserIcon
                    size={20}
                    className="text-neutral-400 group-hover:text-primary transition-colors"
                  />
                )}
              </div>
              <ChevronDown
                size={12}
                className="text-neutral-300 group-hover:text-primary transition-transform group-hover:translate-y-0.5"
              />
            </div>
          </div>

          {/* 🚀 BOTTOM ROW: Page Titles */}
          <div className="pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100 inline-block">
                Infrastructure / {activeTab === "gas-usage" ? "Gas Usage" : activeTab}
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.9] tracking-tighter capitalize">
                {activeTab === "gas-usage" ? "Gas Usage" : activeTab}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                  {activeTab === "leads" ? "Management." : "Infrastructure."}
                </span>
              </h1>
            </div>

            {activeTab === "leads" && (
              <button
                onClick={fetchLeads}
                className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-xl active:scale-95"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                Sync Grid
              </button>
            )}
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1">
          {activeTab === "leads" && (
            <div className="py-8 animate-in fade-in duration-500">
              <div className="bg-primary py-16 relative overflow-hidden mx-8 rounded-[3rem] shadow-2xl shadow-primary/20">
                <div className="max-w-7xl mx-auto px-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard label="Methane Network" value={stats.total} icon={<Users size={22} />} />
                    <StatCard label="Active Intake" value={stats.today} icon={<Calendar size={22} />} />
                    <StatCard label="Grid Efficiency" value="94%" icon={<Zap size={22} />} />
                  </div>
                </div>
              </div>

              <div className="px-8 -mt-10 mb-24 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
                  <div className="p-8 border-b border-neutral-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Activity size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Pipeline Monitoring</h2>
                    </div>
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-11 pr-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {loading ? (
                      <div className="py-32 flex flex-col items-center justify-center gap-4 text-center">
                        <Loader2 className="animate-spin text-primary" size={48} />
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 text-neutral-400 text-xs font-bold border-b border-neutral-50 uppercase tracking-widest px-8">
                            <th className="px-8 py-6">Farmer</th>
                            <th className="px-8 py-6">Village</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 font-bold text-sm">
                          {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-neutral-50/50 transition-all group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">{getInitials(lead.name)}</div>
                                  <div><p>{lead.name}</p><p className="text-[11px] text-neutral-400">{lead.phone}</p></div>
                                </div>
                              </td>
                              <td className="px-8 py-6"><div className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {lead.villages?.name || "Unassigned"}</div></td>
                              <td className="px-8 py-6">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider ${lead.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>{lead.status || "pending"}</span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <button onClick={() => handleDelete(lead.id)} className="text-neutral-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
          )}

          {activeTab === "plants" && <PlantsModule />}
          {activeTab === "customers" && <CustomersModule />}
          {activeTab === "meters" && <MetersModule />}
          {activeTab === "gas-usage" && <UsageHistoryModule />}
          {activeTab === "billing" && <BillingModule />}
          {activeTab === "payments" && <PaymentLedgerModule />}
          {activeTab === "complaints" && <ComplaintsModule />}
          {activeTab === "maintenance" && <MaintenanceModule />}
          {activeTab === "reports" && <ReportsModule />}
        </div>

        {/* --- MODALS --- */}
        {showConvertModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-neutral-900/40">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in">
              <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold">Activate Grid</h3><X className="cursor-pointer" onClick={() => setShowConvertModal(false)} /></div>
              <div className="space-y-6">
                <select className="w-full p-4 bg-neutral-50 rounded-2xl font-bold text-sm" value={conversionData.plant_id} onChange={(e) => setConversionData({ plant_id: e.target.value })}>
                  <option value="">Select Local Plant...</option>
                  {plants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button disabled={isConverting} onClick={handleFinalConversion} className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3">
                  {isConverting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} {isConverting ? "SYNCHRONIZING..." : "CONFIRM"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showProfile && (
        <ProfileModule onExit={() => { setShowProfile(false); fetchProfile(); }} />
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] flex flex-col justify-between h-44 group hover:bg-white/15 transition-all">
      <div className="text-emerald-200">{icon}</div>
      <div>
        <div className="text-4xl font-bold text-white tracking-tighter mb-1.5">{value}</div>
        <div className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}