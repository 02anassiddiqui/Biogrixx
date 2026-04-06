import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Sidebar } from "../components/ui/Sidebar";
import PlantsModule from "./plants";
import CustomersModule from "./customers";
import MetersModule from "./meters";
import UsageHistoryModule from "./gas-usage";
import BillingModule from "./billing";
import PaymentLedgerModule from "./payments";
import ComplaintsModule from "./complaints";
import MaintenanceModule from "./maintenance";
import ReportsModule from "./reports"; // ✅ Step 1: Import Reports Module
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
  Flame,
  IndianRupee,
  AlertCircle,
  Wrench,
  BarChart3, // Added for Reports header context
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

  const router = useRouter();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // --- LOGIC: FETCH DATA ---
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/leads`, {
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

  const fetchPlantsForConversion = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/plants`, {
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });
      const result = await response.json();
      if (result.success) setPlants(result.data);
    } catch (error) {
      console.error("Failed to fetch plants:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This lead will be permanently deleted."))
      return;
    try {
      const response = await fetch(`${API_BASE_URL}/v1/leads/${id}`, {
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
      console.error("Delete failed:", error.message);
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
      const response = await fetch(`${API_BASE_URL}/v1/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        setLeads(
          leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
        );
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleFinalConversion = async () => {
    if (!conversionData.plant_id) {
      alert("Please select a source plant unit.");
      return;
    }

    setIsConverting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/leads/${selectedLead.id}/convert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
          },
          body: JSON.stringify({ plant_id: conversionData.plant_id }),
        },
      );

      const result = await response.json();
      if (result.success) {
        setShowConvertModal(false);
        alert(
          "Success! The lead is now a customer. Please assign a meter ID in the Meters section.",
        );
        fetchLeads();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("biogrix_admin_key");
    router.push("/login");
  };

  useEffect(() => {
    const key = localStorage.getItem("biogrix_admin_key");
    if (!key) router.push("/login");
    else fetchLeads();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.villages?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-100">
      <Head>
        <title>Control Center | Biogrix Digital Infrastructure</title>
      </Head>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 min-w-0 overflow-y-auto h-screen no-scrollbar">
        {/* --- DYNAMIC HEADER SECTION --- */}
        <div className="bg-white pt-16 pb-10 px-12 border-b border-neutral-100 sticky top-0 z-30">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-primary text-[10px] font-bold uppercase tracking-wider mb-6 border border-emerald-100 inline-block">
                Infrastructure /{" "}
                {activeTab === "gas-usage" ? "Gas Usage" : activeTab}
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-neutral-900 leading-[0.9] tracking-tighter capitalize">
                {activeTab === "gas-usage"
                  ? "Gas Usage"
                  : activeTab === "payments"
                    ? "Payments"
                    : activeTab === "complaints"
                      ? "Complaints"
                      : activeTab === "maintenance"
                        ? "Maintenance"
                        : activeTab === "reports"
                          ? "Reports" // ✅ Added for Reports
                          : activeTab}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                  {activeTab === "leads"
                    ? "Management."
                    : activeTab === "plants"
                      ? "Infrastructure."
                      : activeTab === "meters"
                        ? "Inventory Control."
                        : activeTab === "gas-usage"
                          ? "Billing History."
                          : activeTab === "payments"
                            ? "Revenue Ledger."
                            : activeTab === "complaints"
                              ? "Consumer Grievances."
                              : activeTab === "maintenance"
                                ? "Field Operations."
                                : activeTab === "reports"
                                  ? "Business Intelligence." // ✅ Added for Reports
                                  : activeTab === "billing"
                                    ? "Invoice Engine."
                                    : "Consumer Grid."}
                </span>
              </h1>
            </div>

            {activeTab === "leads" && (
              <button
                onClick={fetchLeads}
                className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-5 rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-xl active:scale-95"
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
        </div>

        {/* --- 🚀 TAB SWITCHER LOGIC --- */}

        {activeTab === "leads" && (
          <div className="py-8 animate-in fade-in duration-500">
            <div className="bg-primary py-16 relative overflow-hidden mx-8 rounded-[3rem] shadow-2xl shadow-primary/20">
              <div className="max-w-7xl mx-auto px-10 relative z-10">
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px]" />
            </div>

            <div className="px-8 -mt-10 mb-24 relative z-20">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-8 border-b border-neutral-50 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Activity size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
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
                      placeholder="Quick Search..."
                      className="w-full pl-11 pr-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-4 text-center">
                      <Loader2
                        className="animate-spin text-primary"
                        size={48}
                      />
                      <p className="text-sm font-bold text-neutral-400">
                        Syncing Digital Core...
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 text-neutral-400 text-xs font-bold border-b border-neutral-50">
                          <th className="px-8 py-6">Farmer Profile</th>
                          <th className="px-8 py-6">
                            Village / District / State
                          </th>
                          <th className="px-8 py-6">Lead Status</th>
                          <th className="px-8 py-6">Livestock</th>
                          <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50">
                        {filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="hover:bg-neutral-50/50 transition-all group"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                  {getInitials(lead.name)}
                                </div>
                                <div>
                                  <div className="font-bold text-neutral-900 text-sm tracking-tight">
                                    {lead.name}
                                  </div>
                                  <div className="text-[11px] text-neutral-400 font-bold flex items-center gap-1 mt-0.5">
                                    <Phone size={10} className="text-primary" />{" "}
                                    {lead.phone}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col text-sm text-neutral-800 font-bold">
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} className="text-primary" />{" "}
                                  {lead.villages?.name || "Unassigned"}
                                </div>
                                <div className="text-[10px] text-neutral-400 ml-5 font-bold uppercase tracking-tight">
                                  {lead.villages?.district || "N/A"} •{" "}
                                  {lead.villages?.state || "N/A"}
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="relative inline-block w-40 group/select">
                                <select
                                  value={lead.status || "pending"}
                                  onChange={(e) =>
                                    handleStatusUpdate(lead.id, e.target.value)
                                  }
                                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer appearance-none border-none transition-all shadow-sm ${
                                    lead.status === "pending"
                                      ? "bg-amber-50 text-amber-600"
                                      : lead.status === "contacted"
                                        ? "bg-blue-50 text-blue-600"
                                        : lead.status === "converted"
                                          ? "bg-emerald-50 text-emerald-600"
                                          : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="converted">Converted</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  {lead.status === "pending" && (
                                    <Clock
                                      size={12}
                                      className="text-amber-600"
                                    />
                                  )}
                                  {lead.status === "contacted" && (
                                    <MessageSquare
                                      size={12}
                                      className="text-blue-600"
                                    />
                                  )}
                                  {lead.status === "converted" && (
                                    <CheckCircle2
                                      size={12}
                                      className="text-emerald-600"
                                    />
                                  )}
                                  {lead.status === "rejected" && (
                                    <XCircle
                                      size={12}
                                      className="text-red-600"
                                    />
                                  )}
                                </div>
                                <ChevronDown
                                  size={10}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"
                                />
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-sm font-bold text-neutral-900">
                                {lead.livestock_count}{" "}
                                <span className="text-[10px] text-neutral-400 font-normal ml-0.5 uppercase tracking-tighter">
                                  Heads
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-4">
                                <span className="text-[10px] font-bold text-neutral-300">
                                  {new Date(lead.created_at).toLocaleDateString(
                                    "en-GB",
                                    { day: "2-digit", month: "short" },
                                  )}
                                </span>
                                <button
                                  onClick={() => handleDelete(lead.id)}
                                  className="p-2.5 text-neutral-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
        )}

        {/* --- 🚀 MODULE SWITCHER --- */}
        {activeTab === "plants" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <PlantsModule />
          </div>
        )}
        {activeTab === "customers" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <CustomersModule />
          </div>
        )}
        {activeTab === "meters" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <MetersModule />
          </div>
        )}
        {activeTab === "gas-usage" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <UsageHistoryModule />
          </div>
        )}
        {activeTab === "billing" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <BillingModule />
          </div>
        )}
        {activeTab === "payments" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <PaymentLedgerModule />
          </div>
        )}
        {activeTab === "complaints" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <ComplaintsModule />
          </div>
        )}
        {activeTab === "maintenance" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <MaintenanceModule />
          </div>
        )}

        {/* ✅ Step 2: Reports Tab added to module switcher */}
        {activeTab === "reports" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <ReportsModule />
          </div>
        )}

        {/* --- 🛠️ CONVERSION MODAL --- */}
        {showConvertModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
              onClick={() => setShowConvertModal(false)}
            />
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-900">
                  Finalize Conversion
                </h3>
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="p-2 hover:bg-neutral-50 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-neutral-400 mb-8 font-medium">
                Assign grid infrastructure to <b>{selectedLead?.name}</b>
              </p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                    Source Plant Unit
                  </label>
                  <div className="relative">
                    <Factory
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                      size={16}
                    />
                    <select
                      className="w-full pl-12 pr-5 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm appearance-none"
                      value={conversionData.plant_id}
                      onChange={(e) =>
                        setConversionData({ plant_id: e.target.value })
                      }
                    >
                      <option value="">Select Local Plant...</option>
                      {plants.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.villages?.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  disabled={isConverting}
                  onClick={handleFinalConversion}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm hover:bg-neutral-900 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-4"
                >
                  {isConverting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  {isConverting ? "SYNCHRONIZING..." : "ACTIVATE CUSTOMER"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] flex flex-col justify-between h-44 group hover:bg-white/15 transition-all cursor-default overflow-hidden relative">
      <div className="text-emerald-200 group-hover:scale-110 transition-transform duration-500 z-10">
        {icon}
      </div>
      <div className="z-10">
        <div className="text-4xl font-bold text-white tracking-tighter mb-1.5">
          {value}
        </div>
        <div className="text-[10px] font-bold text-emerald-100/60 leading-none tracking-wider uppercase">
          {label}
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
    </div>
  );
}
