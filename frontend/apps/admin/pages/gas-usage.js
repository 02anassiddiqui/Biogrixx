import { useState, useEffect } from "react";
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

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  //   const fetchHistory = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${API_BASE_URL}/gas-usage/history`);
  //       const result = await res.json();
  //       if (result.success) setReadings(result.data);
  //     } catch (err) {
  //       console.error("History fetch failed:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/gas-usage/history`, {
        // ✅ Ye headers jodd do
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });

      const result = await res.json();
      if (result.success) {
        setReadings(result.data);
      } else {
        console.error("Backend error:", result.message);
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

  // Unique Villages for Filter Dropdown
  const villages = [
    "All",
    ...new Set(
      readings.map((r) => r.customers?.villages?.name).filter(Boolean),
    ),
  ];

  // Logic: Search + Village Filter
  const filteredReadings = readings.filter((r) => {
    const matchesSearch =
      r.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.meters?.serial_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVillage =
      selectedVillage === "All" ||
      r.customers?.villages?.name === selectedVillage;
    return matchesSearch && matchesVillage;
  });

  // Calculate Total Stats
  const totalConsumption = filteredReadings.reduce(
    (acc, curr) => acc + (curr.consumption || 0),
    0,
  );

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* 📊 SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
            <History size={24} />
          </div>
          <div className="text-3xl font-black text-neutral-900">
            {filteredReadings.length}
          </div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase mt-1">
            Total Readings Taken
          </div>
        </div>

        <div className="bg-neutral-900 p-8 rounded-[2.5rem] shadow-xl text-white">
          <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <div className="text-3xl font-black text-primary">
            {totalConsumption.toFixed(2)}{" "}
            <span className="text-sm text-neutral-500 font-bold">m³</span>
          </div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase mt-1">
            Total Gas Consumed
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <div className="text-3xl font-black text-neutral-900">
            {(totalConsumption * 45).toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase mt-1">
            Estimated Revenue (₹)
          </div>
        </div>
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
              placeholder="Search Kisan or Meter..."
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

      {/* 📑 READINGS TABLE */}
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
                  </td>
                </tr>
              ) : filteredReadings.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-20 text-center text-neutral-400 font-bold"
                  >
                    No history found.
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
                        {row.customers?.name}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                        <MapPin size={10} />{" "}
                        {row.customers?.villages?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-neutral-400 text-xs tracking-widest">
                      {row.meters?.serial_number}
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
