// frontend/pages/maintenance.js
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  Wrench,
  Clock,
  CheckCircle2,
  User,
  MapPin,
  Plus,
  Search,
  Loader2,
  Calendar,
  AlertTriangle,
  X,
  Factory,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

export default function MaintenanceModule({ syncTrigger }) {
  const [data, setData] = useState([]);
  const [workers, setWorkers] = useState([]); // 🚀 State for Agents
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const [formData, setFormData] = useState({
    assigned_to: "",
    task_type: "Corrective",
    scheduled_date: "",
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  const fetchUnifiedData = async () => {
    setLoading(true);
    try {
      // Fetch Maintenance Logs
      const res = await apiRequest("/maintenance");
      if (res.success) setData(res.data);

      // 🚀 Fetch Actual Agents from Workers Module
      const workerRes = await apiRequest("/workers");
      if (workerRes.success)
        setWorkers(workerRes.data.filter((w) => w.status === "active"));
    } catch (err) {
      toast.error("Network error: Operations grid offline.");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchUnifiedData();
  }, [syncTrigger]);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!formData.assigned_to) return toast.error("Please select an agent.");

    const loadingToast = toast.loading("Activating field task...");
    try {
      const token = localStorage.getItem("biogrix_auth_token");
      const res = await fetch(`${API_BASE_URL}/maintenance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          complaint_id: selectedComplaint.id,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success("Work order created and assigned.", { id: loadingToast });
        setShowModal(false);
        setFormData({
          assigned_to: "",
          task_type: "Corrective",
          scheduled_date: "",
        });
        fetchUnifiedData();
      } else {
        toast.error(result.message || "Failed to assign task.", {
          id: loadingToast,
        });
      }
    } catch (err) {
      toast.error("Critical sync error.", { id: loadingToast });
    }
  };

  const updateStatus = async (logId, status) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      const token = localStorage.getItem("biogrix_auth_token");
      const res = await fetch(`${API_BASE_URL}/maintenance/${logId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Task marked as ${status}.`, { id: loadingToast });
        fetchUnifiedData();
      } else {
        toast.error("Status update failed.", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server connection lost.", { id: loadingToast });
    }
  };

  const filteredData = data.filter((item) => {
    const log = item.maintenance_logs?.[0];
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log?.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "All" || (log && log.status === filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="py-8 px-8 animate-in fade-in duration-500 font-sans">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
          Operations <span className="text-primary">Control</span>
        </h1>
        <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-3">
          Grid Intelligence & Field Task Management
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-8 rounded-[2.5rem] border border-neutral-100 bg-white h-44 flex items-center gap-6"
            >
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard
              icon={<AlertTriangle />}
              label="Total Reports"
              value={data.length}
              color="amber"
            />
            <StatCard
              icon={<Clock />}
              label="Pending Actions"
              value={
                data.filter(
                  (i) =>
                    !i.maintenance_logs?.[0] ||
                    i.maintenance_logs[0].status !== "completed",
                ).length
              }
              color="dark"
            />
            <StatCard
              icon={<CheckCircle2 />}
              label="Resolved Cases"
              value={
                data.filter(
                  (i) => i.maintenance_logs?.[0]?.status === "completed",
                ).length
              }
              color="emerald"
            />
          </>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 text-sm">
        <div className="relative w-full md:w-96 font-bold">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search operational node..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-neutral-100 shadow-sm">
          {["All", "Scheduled", "In-Progress", "Completed"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-900"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100">
              <th className="px-8 py-6">Complaint / Issue</th>
              <th className="px-8 py-6">Village / Node</th>
              <th className="px-8 py-6">Assigned Agent</th>
              <th className="px-8 py-6 text-right">Status / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 font-bold">
            {loading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-xl" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Skeleton className="h-10 w-32 ml-auto rounded-xl" />
                    </td>
                  </tr>
                ))
              : filteredData.map((item) => {
                  const log = item.maintenance_logs?.[0];
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-50/40 transition-all group font-bold"
                    >
                      <td className="px-8 py-6">
                        <div className="font-black text-neutral-900 text-sm tracking-tight">
                          {item.issue_type}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-bold uppercase mt-1">
                          Ref: {item.name}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                          <MapPin size={14} className="text-primary" />{" "}
                          {item.village}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {log ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-[10px] font-black shadow-sm uppercase">
                              {log.assigned_to[0]}
                            </div>
                            <span className="text-sm font-black text-neutral-800 tracking-tight">
                              {log.assigned_to}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-neutral-300 uppercase italic tracking-widest">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {log ? (
                          <div className="relative inline-block">
                            <select
                              value={log.status}
                              onChange={(e) =>
                                updateStatus(log.id, e.target.value)
                              }
                              className={`pl-4 pr-10 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer shadow-sm transition-all border-none ${log.status === "completed" ? "bg-emerald-50 text-emerald-600" : log.status === "in-progress" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <ChevronDown
                              size={12}
                              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedComplaint(item);
                              setShowModal(true);
                            }}
                            className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg shadow-neutral-200"
                          >
                            Schedule Repair
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* --- WORK ORDER MODAL (Now with Worker Dropdown) --- */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-xl bg-neutral-900/40 animate-in fade-in">
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl animate-in zoom-in border border-neutral-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
                Work <br />
                Order
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors text-neutral-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-8 p-6 bg-neutral-50 rounded-[1.5rem] border border-neutral-100">
              <p className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] mb-2">
                Issue Node
              </p>
              <p className="text-sm font-black text-neutral-800 tracking-tight">
                {selectedComplaint?.issue_type} in {selectedComplaint?.village}
              </p>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                  Assign Field Agent
                </label>
                <div className="relative">
                  <User
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  {/* 🚀 Changed to Select Dropdown */}
                  <select
                    required
                    className="w-full pl-14 pr-10 py-5 bg-neutral-50 rounded-2xl border-none outline-none font-black text-xs uppercase tracking-widest focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                    value={formData.assigned_to}
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_to: e.target.value })
                    }
                  >
                    <option value="">Select Agent...</option>
                    {workers.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name} ({w.phone})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                  Scheduled Date
                </label>
                <div className="relative font-bold text-sm">
                  <Calendar
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type="date"
                    className="w-full pl-14 pr-6 py-5 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/5 uppercase"
                    value={formData.scheduled_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduled_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-neutral-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:bg-primary transition-all active:scale-95"
              >
                Activate Field Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const styles = {
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    dark: "bg-neutral-900 text-white shadow-xl shadow-neutral-200 border-none",
  };
  return (
    <div
      className={`p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex items-center gap-6 transition-all hover:shadow-md ${color === "dark" ? styles.dark : "bg-white"}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${color !== "dark" ? styles[color] : "bg-white/10"}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-4xl font-black tracking-tighter leading-none">
          {value}
        </div>
        <div className="text-[9px] font-black uppercase tracking-[0.2em] mt-2 text-neutral-400">
          {label}
        </div>
      </div>
    </div>
  );
}
