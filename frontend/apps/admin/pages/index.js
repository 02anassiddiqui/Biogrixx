// frontend/apps/admin/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import { Sidebar } from "../components/ui/Sidebar";
import ProfileModule from "./profile";
import PlantsModule from "./plants";
import CustomersModule from "./customers";
import WorkersModule from "./workers";
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
  ShieldAlert,
  ArrowRightLeft,
  Beef,
} from "lucide-react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, today: 0, livestock: 0 });
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

  // 🚀 Universal Sync Trigger State
  const [syncTrigger, setSyncTrigger] = useState(0);

  const router = useRouter();

  // 🚀 Step 1: Logic to handle sync for all tabs
  const handleGlobalSync = () => {
    if (activeTab === "leads") {
      fetchLeads();
    }
    // Increments counter to notify child modules to re-fetch their data
    setSyncTrigger((prev) => prev + 1);
  };

  const confirmDeleteLead = (id) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in zoom-in-95" : "animate-out fade-out zoom-out-95"} max-w-sm w-full bg-neutral-900 border border-white/10 shadow-2xl rounded-[2rem] p-6 backdrop-blur-xl flex flex-col`}
        >
          <div className="flex items-start gap-4">
            <div className="bg-red-500/10 p-3 rounded-2xl text-red-500">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-tight uppercase">
                Remove Lead?
              </h3>
              <p className="text-neutral-400 text-[11px] font-medium mt-1 leading-relaxed">
                This record will be permanently deleted from the system.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDelete(id);
              }}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-red-500/20"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-white/5 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  };

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
        const totalLivestock = result.data.reduce(
          (acc, curr) => acc + (Number(curr.livestock_count) || 0),
          0,
        );

        setStats({
          total: result.data.length,
          today: todayCount,
          livestock: totalLivestock,
        });
      }
    } catch (error) {
      toast.error("Sync failed.");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Purging lead...");
    try {
      const result = await apiRequest(`/leads/${id}`, { method: "DELETE" });
      if (result.success) {
        toast.success("Lead removed.");
        fetchLeads();
      }
    } catch (error) {
      toast.error("Action failed.");
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
    const loadingToast = toast.loading("Updating status...");
    try {
      const result = await apiRequest(`/leads/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      if (result.success) {
        toast.success(`Status updated to ${newStatus}`, { id: loadingToast });
        setLeads(
          leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
        );
      }
    } catch (error) {
      toast.error("Sync failed.");
    }
  };

  const handleFinalConversion = async () => {
    if (!conversionData.plant_id) {
      toast.error("Select plant!");
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
        toast.success("Node activated! Customer is now live.");
        fetchLeads();
      }
    } catch (error) {
      toast.error("Conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await apiRequest("/profile");
      if (res.success)
        setAdminData({
          name: res.data.name,
          profile_image: res.data.profile_image,
        });
    } catch (err) {}
  };

  const fetchPlantsForConversion = async () => {
    try {
      const result = await apiRequest("/plants");
      if (result.success) setPlants(result.data);
    } catch (error) {}
  };

  const handleLogout = () => {
    localStorage.removeItem("biogrix_auth_token");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("biogrix_auth_token");
    if (!token) router.push("/login");
    else {
      fetchLeads();
      fetchProfile();
    }
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const filteredLeads = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.villages?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-100 overflow-hidden text-neutral-900">
      <Head>
        <title>Control Center | Biogrix HQ</title>
      </Head>
      <Toaster />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 min-w-0 overflow-y-auto h-screen no-scrollbar relative flex flex-col">
        <header className="bg-white/80 backdrop-blur-xl border-b border-neutral-100 sticky top-0 z-40 px-12 shrink-0">
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
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-neutral-100 overflow-hidden flex items-center justify-center">
                {adminData.profile_image ? (
                  <img
                    src={adminData.profile_image}
                    className="w-full h-full object-cover"
                    alt="Admin"
                  />
                ) : (
                  <UserIcon size={20} className="text-neutral-400" />
                )}
              </div>
            </div>
          </div>

          <div className="pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100 inline-block">
                Infrastructure / {activeTab}
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.9] tracking-tighter capitalize">
                {activeTab} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                  {activeTab === "leads" ? "Management." : "Infrastructure."}
                </span>
              </h1>
            </div>

            {/* 🚀 Step 2: Global Sync Button (Visible on all relevant pages) */}
            {activeTab !== "reports" && activeTab !== "profile" && (
              <button
                onClick={handleGlobalSync}
                className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl shadow-neutral-200"
              >
                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : "group-hover:rotate-180 transition-transform duration-500"
                  }
                />
                Sync Grid
              </button>
            )}
          </div>
        </header>

        <div className="flex-1">
          {activeTab === "leads" && (
            <div className="py-8 animate-in fade-in duration-500">
              <div className="px-8 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {loading ? (
                    [1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="p-8 rounded-[2.5rem] bg-white border border-zinc-100 h-44 flex flex-col justify-between"
                      >
                        <Skeleton className="w-10 h-10" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <StatCard
                        label="Methane Network"
                        value={stats.total}
                        icon={<Users size={20} />}
                        theme="dark"
                      />
                      <StatCard
                        label="Active Intake"
                        value={stats.today}
                        icon={<Calendar size={20} />}
                        theme="light"
                      />
                      <StatCard
                        label="Total Livestock"
                        value={stats.livestock}
                        icon={<Beef size={20} />}
                        theme="light"
                      />
                      <StatCard
                        label="Grid Efficiency"
                        value="94%"
                        icon={<Zap size={20} />}
                        theme="light"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="px-8 mb-24">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
                  {/* ... Monitoring Header ... */}
                  <div className="p-8 border-b border-neutral-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Activity size={20} />
                      </div>
                      <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">
                        Pipeline Monitoring
                      </h2>
                    </div>
                    <div className="relative w-full md:w-80">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                        size={16}
                      />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search nodes..."
                        className="w-full pl-11 pr-6 py-4 bg-neutral-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 text-neutral-400 text-[10px] font-black border-b border-neutral-50 uppercase tracking-[0.2em] px-8">
                          <th className="px-8 py-6">Farmer Profile</th>
                          <th className="px-8 py-6">Area Node</th>
                          <th className="px-8 py-6">Stock Potential</th>
                          <th className="px-8 py-6 text-center">Status</th>
                          <th className="px-8 py-6 text-right">Protocol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50">
                        {loading
                          ? [1, 2, 3, 4, 5].map((i) => (
                              <tr key={i}>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <Skeleton className="w-10 h-10" />
                                    <div className="space-y-2">
                                      <Skeleton className="h-4 w-32" />
                                      <Skeleton className="h-3 w-20" />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <Skeleton className="h-4 w-24" />
                                </td>
                                <td className="px-8 py-6">
                                  <Skeleton className="h-4 w-16" />
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <Skeleton className="h-7 w-24 mx-auto rounded-lg" />
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <Skeleton className="h-8 w-8 ml-auto" />
                                </td>
                              </tr>
                            ))
                          : filteredLeads.map((lead) => (
                              <tr
                                key={lead.id}
                                className="hover:bg-neutral-50/50 transition-all group font-bold text-sm"
                              >
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-xs uppercase">
                                      {getInitials(lead.name)}
                                    </div>
                                    <div>
                                      <p className="font-black text-neutral-900">
                                        {lead.name}
                                      </p>
                                      <p className="text-[10px] text-neutral-400 uppercase">
                                        {lead.phone}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-[10px] font-black uppercase text-neutral-500">
                                  <div className="flex items-center gap-2">
                                    <MapPin
                                      size={14}
                                      className="text-primary"
                                    />{" "}
                                    {lead.villages?.name || "Independent"}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                                      <Beef size={14} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-neutral-900 leading-none">
                                        {lead.livestock_count || 0}
                                      </p>
                                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-1">
                                        Heads
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <select
                                    value={lead.status || "pending"}
                                    onChange={(e) =>
                                      handleStatusUpdate(
                                        lead.id,
                                        e.target.value,
                                      )
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border outline-none cursor-pointer ${lead.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" : lead.status === "converted" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : lead.status === "rejected" ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="converted">Convert</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <button
                                    onClick={() => confirmDeleteLead(lead.id)}
                                    className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🚀 Step 3: Pass syncTrigger to ALL modules for universal refresh */}
          {activeTab === "plants" && <PlantsModule syncTrigger={syncTrigger} />}
          {activeTab === "customers" && (
            <CustomersModule syncTrigger={syncTrigger} />
          )}
          {activeTab === "workers" && (
            <WorkersModule syncTrigger={syncTrigger} />
          )}
          {activeTab === "meters" && <MetersModule syncTrigger={syncTrigger} />}
          {activeTab === "gas-usage" && (
            <UsageHistoryModule syncTrigger={syncTrigger} />
          )}
          {activeTab === "billing" && (
            <BillingModule syncTrigger={syncTrigger} />
          )}
          {activeTab === "payments" && (
            <PaymentLedgerModule syncTrigger={syncTrigger} />
          )}
          {activeTab === "complaints" && (
            <ComplaintsModule syncTrigger={syncTrigger} />
          )}
          {activeTab === "maintenance" && (
            <MaintenanceModule syncTrigger={syncTrigger} />
          )}
          {activeTab === "reports" && (
            <ReportsModule syncTrigger={syncTrigger} />
          )}
        </div>

        {/* --- CONVERSION MODAL --- */}
        {showConvertModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-neutral-900/40 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl animate-in zoom-in border border-neutral-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase">
                  Activate Node
                </h3>
                <X
                  className="cursor-pointer text-neutral-300 hover:text-neutral-900"
                  onClick={() => setShowConvertModal(false)}
                />
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                    Assign Plant Infrastructure
                  </label>
                  <select
                    className="w-full p-5 bg-neutral-50 rounded-2xl font-black text-xs uppercase outline-none focus:ring-4 focus:ring-primary/5 appearance-none border-none shadow-inner"
                    value={conversionData.plant_id}
                    onChange={(e) =>
                      setConversionData({ plant_id: e.target.value })
                    }
                  >
                    <option value="">Select Target Unit...</option>
                    {plants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  disabled={isConverting}
                  onClick={handleFinalConversion}
                  className="w-full bg-neutral-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-neutral-200 hover:bg-primary transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  {isConverting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}{" "}
                  SYNCHRONIZING...
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showProfile && (
        <ProfileModule
          onExit={() => {
            setShowProfile(false);
            fetchProfile();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, theme }) {
  const isDark = theme === "dark";
  return (
    <div
      className={`p-8 rounded-[2.5rem] border shadow-sm transition-all flex flex-col justify-between h-44 ${isDark ? "bg-neutral-900 border-neutral-800 text-white shadow-xl" : "bg-white border-neutral-100 text-neutral-900 hover:shadow-lg"}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}
      >
        {icon}
      </div>
      <div>
        <div
          className={`text-5xl font-black tracking-tighter ${isDark ? "text-primary" : "text-neutral-900"}`}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="text-[9px] font-black text-neutral-400 uppercase mt-1 tracking-widest">
          {label}
        </div>
      </div>
    </div>
  );
}
