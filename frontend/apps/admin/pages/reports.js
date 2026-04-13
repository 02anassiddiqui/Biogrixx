import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  IndianRupee,
  Flame,
  Users,
  AlertCircle,
  TrendingUp,
  Download,
  Loader2,
  RefreshCcw,
} from "lucide-react";

export default function ReportsModule() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // ✅ Client-side render check

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest("/reports/summary");
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to fetch reports");
      }
    } catch (err) {
      console.error("Reports fetch failed:", err);
      setError("Server connection failed. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true); // ✅ Component mount hone par true hoga
    fetchReports();
  }, []);

  // 1. Loading State
  if (loading)
    return (
      <div className="py-32 text-center flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-bold text-neutral-400 animate-pulse uppercase tracking-widest">
          Generating Insights...
        </p>
      </div>
    );

  // 2. Error State
  if (error || !data)
    return (
      <div className="py-32 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <AlertCircle size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-neutral-900">
            Analysis Halted
          </h2>
          <p className="text-neutral-500 font-medium mt-1">
            {error || "Data is currently unavailable."}
          </p>
        </div>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
        >
          <RefreshCcw size={16} /> Retry Sync
        </button>
      </div>
    );

  const { stats, trends } = data;

  const efficiency =
    stats.complaints?.total > 0
      ? Math.round((stats.complaints.resolved / stats.complaints.total) * 100)
      : 0;

  return (
    <div className="py-8 px-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
            Intelligence
          </h1>
          <p className="text-neutral-400 font-medium">
            Real-time infrastructure and revenue analytics
          </p>
        </div>
        <button className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm hover:bg-neutral-50 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <ReportCard
          icon={<IndianRupee />}
          label="Revenue (30d)"
          value={`₹${(stats.revenue || 0).toLocaleString()}`}
          color="emerald"
        />
        <ReportCard
          icon={<Flame />}
          label="Gas Usage"
          value={`${stats.usage || 0} Units`}
          color="amber"
        />
        <ReportCard
          icon={<Users />}
          label="Consumer Base"
          value={stats.customers || 0}
          color="blue"
        />
        <ReportCard
          icon={<AlertCircle />}
          label="Active Grievances"
          value={
            (stats.complaints?.total || 0) - (stats.complaints?.resolved || 0)
          }
          color="red"
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usage Trend Chart Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-neutral-900 uppercase text-[10px] tracking-[0.2em]">
              Gas Consumption Trend
            </h3>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
              <TrendingUp size={16} /> Live Data
            </div>
          </div>

          {/* ✅ FIXED CONTAINER: Added min-h and min-w-0 */}
          <div className="h-[350px] w-full min-w-0 relative">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trends || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="units"
                    stroke="#10B981"
                    strokeWidth={4}
                    dot={{
                      r: 4,
                      fill: "#10B981",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Efficiency Chart Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="font-black text-neutral-900 uppercase text-[10px] tracking-[0.2em] mb-12 self-start">
            Resolution Efficiency
          </h3>
          <div className="relative flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-neutral-50"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={502}
                strokeDashoffset={502 - (502 * efficiency) / 100}
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col">
              <span className="text-5xl font-black text-neutral-900">
                {efficiency}%
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Resolved
              </span>
            </div>
          </div>
          <div className="flex gap-8 mt-12">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                Resolved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-100" />
              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ icon, label, value, color }) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    blue: "text-blue-600 bg-blue-50",
    red: "text-red-600 bg-red-50",
  };
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-neutral-100 transition-all group">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${colors[color]}`}
      >
        {icon}
      </div>
      <div className="text-3xl font-black text-neutral-900 tracking-tighter">
        {value}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-2">
        {label}
      </div>
    </div>
  );
}
