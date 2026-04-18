// frontend/pages/gas-usage.js
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  History,
  Search,
  Filter,
  Download,
  Loader2,
  MapPin,
  Calendar,
  Zap,
  TrendingUp,
  User,
  Image as ImageIcon,
  X,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

// 🚀 Step 1: Reusable Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

export default function UsageHistoryModule({ syncTrigger }) {
  // 🚀 Step 2: Receive syncTrigger
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/gas-usage/history");
      if (res.success) {
        setReadings(res.data);
      } else {
        toast.error(res.message || "Failed to sync usage history.");
      }
    } catch (err) {
      toast.error("Network error: Unable to connect to Biogrix Grid.");
    } finally {
      // 🚀 Step 3: Smooth transition delay for skeletons
      setTimeout(() => setLoading(false), 500);
    }
  };

  // 🚀 Step 4: Hook into universal Sync Grid from Dashboard
  useEffect(() => {
    fetchHistory();
  }, [syncTrigger]);

  const villages = [
    "All",
    ...new Set(
      readings.map((r) => r.customers?.villages?.name).filter(Boolean),
    ),
  ];

  const filteredReadings = readings.filter((r) => {
    const customerName = r.customers?.name?.toLowerCase() || "";
    const meterSerial = r.meters?.serial_number?.toLowerCase() || "";
    const villageName = r.customers?.villages?.name?.toLowerCase() || "";
    const agentName = r.workers?.name?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      customerName.includes(search) ||
      meterSerial.includes(search) ||
      villageName.includes(search) ||
      agentName.includes(search);

    const matchesVillage =
      selectedVillage === "All" ||
      r.customers?.villages?.name === selectedVillage;

    return matchesSearch && matchesVillage;
  });

  const totalConsumption = filteredReadings.reduce(
    (acc, curr) => acc + (curr.consumption || 0),
    0,
  );

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* 📊 SUMMARY STATS WITH SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mb-10">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-10 rounded-[2.5rem] border border-neutral-100 bg-white shadow-sm h-52 flex flex-col justify-between"
            >
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard
              icon={<History size={24} />}
              label="Total Logs Recorded"
              value={filteredReadings.length}
              theme="white"
            />
            <StatCard
              icon={<TrendingUp size={24} />}
              label="Cumulative Consumption"
              value={`${totalConsumption.toFixed(2)} m³`}
              theme="dark"
            />
            <StatCard
              icon={<Zap size={24} />}
              label="Revenue Projection (₹)"
              value={(totalConsumption * 45).toLocaleString("en-IN")}
              theme="white"
              accent="emerald"
            />
          </>
        )}
      </div>

      {/* 🔍 FILTERS & SEARCH */}
      <div className="px-8 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Customer, Agent or Meter ID..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 font-bold text-xs shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-48">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
              size={16}
            />
            <select
              className="w-full pl-11 pr-4 py-4 bg-white border border-neutral-100 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
            >
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => toast.success("Exporting data to CSV...")}
          className="bg-neutral-50 text-neutral-400 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-100 transition-all border border-neutral-100 active:scale-95"
        >
          <Download size={18} /> Export Data
        </button>
      </div>

      {/* 📑 READINGS TABLE WITH SKELETON */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse font-bold">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-100">
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6">Customer & Village</th>
                <th className="px-8 py-6">Field Agent</th>
                <th className="px-8 py-6">Evidence</th>
                <th className="px-8 py-6">Volume</th>
                <th className="px-8 py-6 text-right">Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                // 🚀 Skeleton Table Rows
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-8 py-6">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-7 w-24 rounded-xl" />
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-8 w-24 rounded-xl" />
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-8 w-20 rounded-xl" />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Skeleton className="h-6 w-6 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredReadings.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-20 text-center text-neutral-300 font-black uppercase text-[10px] tracking-widest"
                  >
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredReadings.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-neutral-50/40 transition-all font-bold"
                  >
                    <td className="px-8 py-6 text-[11px] font-black text-neutral-500 uppercase">
                      {new Date(row.recorded_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-neutral-900 text-sm tracking-tight">
                        {row.customers?.name}
                      </div>
                      <div className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">
                        {row.customers?.villages?.name || "System Node"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-xl w-fit">
                        <User size={12} /> {row.workers?.name || "Admin"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {row.image_url ? (
                        <button
                          onClick={() => setPreviewImage(row.image_url)}
                          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                          <ImageIcon size={14} /> View Proof
                        </button>
                      ) : (
                        <span className="text-neutral-200 text-[9px] font-black uppercase italic tracking-widest">
                          No Data
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-xs border border-emerald-100/50">
                        +{row.consumption} m³
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-neutral-200 hover:text-primary transition-colors active:scale-90">
                        <MapPin size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 IMAGE PREVIEW MODAL (Kept Original) */}
      {previewImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-neutral-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative max-w-4xl w-full bg-white rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/10">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-8 right-8 p-4 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md z-10 transition-all active:scale-90"
            >
              <X size={24} />
            </button>
            <div className="bg-neutral-950 flex items-center justify-center min-h-[450px]">
              <img
                src={previewImage}
                alt="Evidence"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-10 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter italic">
                  Verification Node
                </h3>
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.3em] mt-2">
                  Metadata: Cryptographic Evidence Log
                </p>
              </div>
              <a
                href={previewImage}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-neutral-900 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:shadow-xl transition-all active:scale-95"
              >
                <ExternalLink size={16} /> Raw View
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, theme, accent }) {
  const isDark = theme === "dark";
  const isEmerald = accent === "emerald";
  return (
    <div
      className={`p-10 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-md ${isDark ? "bg-neutral-900 border-neutral-800 text-white shadow-xl" : "bg-white border-neutral-100 text-neutral-900"}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${isDark ? "bg-primary text-white" : isEmerald ? "bg-emerald-50 text-emerald-600" : "bg-primary/10 text-primary"}`}
      >
        {icon}
      </div>
      <div
        className={`text-4xl font-black tracking-tighter ${isDark ? "text-primary" : "text-neutral-900"}`}
      >
        {value}
      </div>
      <div className="text-[10px] font-black text-neutral-400 uppercase mt-2 tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}
