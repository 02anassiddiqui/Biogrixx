// frontend/pages/customers.js
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  Users,
  MapPin,
  Zap,
  Search,
  Loader2,
  Trash2,
  ShieldAlert,
  Activity,
  Factory,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// 🚀 Reusable Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

export default function CustomersModule({ syncTrigger }) {
  // 🚀 Step 1: prop accept kiya
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("/customers");
      if (result.success) setCustomers(result.data);
    } catch (error) {
      toast.error("Failed to synchronize consumer records.");
    } finally {
      // 🚀 Step 2: Smooth shimmer delay
      setTimeout(() => setLoading(false), 500);
    }
  };

  // 🚀 Step 3: Global sync listener
  useEffect(() => {
    fetchCustomers();
  }, [syncTrigger]);

  const confirmDelete = (id) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in zoom-in-95" : "animate-out fade-out zoom-out-95"} max-w-sm w-full bg-neutral-900 border border-white/10 shadow-2xl rounded-[2rem] p-6 backdrop-blur-xl flex flex-col`}
        >
          <div className="flex items-start gap-4">
            <div className="bg-red-500/10 p-3 rounded-2xl text-red-500 shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-lg tracking-tight uppercase">
                Confirm Removal
              </h3>
              <p className="text-neutral-400 text-[11px] font-medium leading-relaxed mt-1">
                This action is irreversible. Purge this node from core grid?
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDeleteCustomer(id);
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-red-500/20"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  };

  const handleDeleteCustomer = async (id) => {
    const loadingToast = toast.loading("Executing grid removal protocol...");
    try {
      const token = localStorage.getItem("biogrix_auth_token");
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Consumer purged from grid successfully.", {
          id: loadingToast,
        });
        setCustomers(customers.filter((c) => c.id !== id));
      } else {
        toast.error(result.message || "Unauthorized: Access Denied.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error("Network error.", { id: loadingToast });
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.meter_number?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="py-8 px-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">
            Consumer <span className="text-primary">Grid</span>
          </h2>
          <p className="text-[10px] text-neutral-400 mt-1 font-black uppercase tracking-[0.2em]">
            Monitoring {loading ? "..." : customers.length} Active Node
            Connections
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Filter by name, phone or meter..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <MiniStat
          label="Active Meters"
          value={loading ? "..." : customers.length}
          icon={<Zap size={16} />}
          color="bg-emerald-50 text-emerald-600"
        />
        <MiniStat
          label="Village Hubs"
          value={
            loading
              ? "..."
              : [...new Set(customers.map((c) => c.village_id))].length
          }
          icon={<MapPin size={16} />}
          color="bg-blue-50 text-blue-600"
        />
        <MiniStat
          label="Total Livestock"
          value={
            loading
              ? "..."
              : customers.reduce(
                  (acc, curr) => acc + (Number(curr.livestock_count) || 0),
                  0,
                )
          }
          icon={<Activity size={16} />}
          color="bg-amber-50 text-amber-600"
        />
        <MiniStat
          label="Grid Health"
          value="Stable"
          icon={<ShieldAlert size={16} />}
          color="bg-primary/10 text-primary"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-100">
                <th className="px-8 py-6">Consumer Profile</th>
                <th className="px-8 py-6">Village Link</th>
                <th className="px-8 py-6">Infrastructure</th>
                <th className="px-8 py-6">Technical Specs</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 font-bold">
              {loading
                ? // 🚀 Step 4: Table Skeleton rows
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-12 h-12 rounded-2xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-8 h-8 rounded-lg" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-8 h-8 rounded-lg" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Skeleton className="h-10 w-10 ml-auto rounded-xl" />
                      </td>
                    </tr>
                  ))
                : filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-neutral-50/40 transition-all group font-bold"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-xs shadow-lg uppercase">
                            {customer.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-black text-neutral-900 text-sm tracking-tight">
                              {customer.name}
                            </div>
                            <div className="text-[10px] text-neutral-400 uppercase">
                              {customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <MapPin size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-black text-neutral-800 uppercase">
                              {customer.villages?.name}
                            </div>
                            <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.1em]">
                              {customer.villages?.district}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Factory size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-black text-neutral-800 uppercase">
                              {customer.plants?.name || "Independent"}
                            </div>
                            <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.1em]">
                              Assigned Unit
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-neutral-300 uppercase w-10">
                              Meter
                            </span>
                            <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10 tracking-widest">
                              {customer.meter_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-neutral-300 uppercase w-10">
                              Stock
                            </span>
                            <span className="text-[10px] font-black text-neutral-700 uppercase">
                              {customer.livestock_count} Units
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => confirmDelete(customer.id)}
                          className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
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
  );
}

function MiniStat({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[2.25rem] border border-neutral-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all">
      <div className={`p-4 rounded-2xl ${color} shadow-inner`}>{icon}</div>
      <div>
        <div className="text-xl font-black text-neutral-900 leading-none mb-1 tracking-tighter">
          {value}
        </div>
        <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none">
          {label}
        </div>
      </div>
    </div>
  );
}
