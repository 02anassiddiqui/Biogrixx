import { useState, useEffect } from "react";
import { apiRequest } from "../services/api"; // ✅ Centralized API Handler
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
} from "lucide-react";

export default function UsageHistoryModule() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("All");

  // --- 📡 1. FETCH DATA ---
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/gas-usage/history");
      if (res.success) {
        setReadings(res.data);
      } else {
        console.error("Backend error:", res.message);
      }
    } catch (err) {
      console.error("History fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- 🔍 2. FILTERING LOGIC ---

  // Unique Villages for Filter Dropdown
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
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      customerName.includes(search) ||
      meterSerial.includes(search) ||
      villageName.includes(search);

    const matchesVillage =
      selectedVillage === "All" ||
      r.customers?.villages?.name === selectedVillage;

    return matchesSearch && matchesVillage;
  });

  // --- 📊 3. STATS CALCULATION ---
  const totalConsumption = filteredReadings.reduce(
    (acc, curr) => acc + (curr.consumption || 0),
    0,
  );

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* 📊 SUMMARY STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mb-10">
        <StatCard
          icon={<History size={24} />}
          label="Total Readings"
          value={filteredReadings.length}
          theme="white"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Total Gas Consumed"
          value={`${totalConsumption.toFixed(2)} m³`}
          theme="dark"
        />
        <StatCard
          icon={<Zap size={24} />}
          label="Estimated Revenue (₹)"
          value={(totalConsumption * 45).toLocaleString("en-IN")}
          theme="white"
          accent="emerald"
        />
      </div>

      {/* 🔍 FILTERS & SEARCH BAR */}
      <div className="px-8 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Kisan, Meter or Village..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-medium text-sm"
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
              className="w-full pl-11 pr-4 py-4 bg-white border border-neutral-100 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer"
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

        <button className="bg-neutral-50 text-neutral-400 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-neutral-100 transition-all border border-neutral-100">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* 📑 READINGS TABLE SECTION */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-widest border-b border-neutral-50">
                <th className="px-8 py-6">Date & Time</th>
                <th className="px-8 py-6">Customer & Village</th>
                <th className="px-8 py-6">Meter ID</th>
                <th className="px-8 py-6">Readings (Prev → Curr)</th>
                <th className="px-8 py-6 text-right">Consumption</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" />
                    <p className="text-xs font-bold text-neutral-400 mt-2 uppercase tracking-widest">
                      Loading Records...
                    </p>
                  </td>
                </tr>
              ) : filteredReadings.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-20 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest"
                  >
                    No history records found.
                  </td>
                </tr>
              ) : (
                filteredReadings.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-neutral-50/50 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400">
                          <Calendar size={14} />
                        </div>
                        <span className="text-xs font-bold text-neutral-600">
                          {new Date(row.recorded_at).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-neutral-900">
                        {row.customers?.name || "Unknown Customer"}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-tighter mt-0.5">
                        <MapPin size={10} className="text-primary" />
                        {/* ✅ Village Check Logic */}
                        {row.customers?.villages?.name || "Village Not Linked"}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-neutral-400 text-xs tracking-widest">
                      {row.meters?.serial_number || "N/A"}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-neutral-500">
                      {row.previous_reading}{" "}
                      <span className="mx-2 text-neutral-200">→</span>{" "}
                      <span className="text-neutral-900">
                        {row.current_reading}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="bg-primary/5 text-primary px-4 py-2 rounded-xl font-black text-sm">
                        +{row.consumption} m³
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🎨 STAT CARD HELPER COMPONENT (To Keep Design Premium)
function StatCard({ icon, label, value, theme, accent }) {
  const isDark = theme === "dark";
  const isEmerald = accent === "emerald";

  return (
    <div
      className={`p-8 rounded-[2.5rem] border shadow-sm transition-all ${
        isDark
          ? "bg-neutral-900 border-neutral-800 text-white shadow-xl"
          : "bg-white border-neutral-100 text-neutral-900"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
          isDark
            ? "bg-primary text-white"
            : isEmerald
              ? "bg-emerald-50 text-emerald-600"
              : "bg-primary/10 text-primary"
        }`}
      >
        {icon}
      </div>
      <div
        className={`text-3xl font-black ${isDark ? "text-primary" : "text-neutral-900"}`}
      >
        {value}
      </div>
      <div className="text-[10px] font-bold text-neutral-400 uppercase mt-1 tracking-widest">
        {label}
      </div>
    </div>
  );
}
