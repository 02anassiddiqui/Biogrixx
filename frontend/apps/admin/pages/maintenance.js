import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import {
  Wrench,
  Clock,
  CheckCircle2,
  User,
  MapPin,
  Plus,
  Search,
  Loader2,
  MoreVertical,
  Calendar,
  AlertTriangle,
  X,
  Factory,
  ChevronDown,
} from "lucide-react";

export default function MaintenanceModule() {
  const [data, setData] = useState([]); // Unified array of Complaints + Logs
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  // Modal Form State
  const [formData, setFormData] = useState({
    assigned_to: "",
    task_type: "Corrective",
    scheduled_date: "",
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  // Fetches Unified Data: All complaints with their linked maintenance logs
  const fetchUnifiedData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/maintenance");
      if (res.success) setData(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnifiedData();
  }, []);

  // Creates a log and links it to the complaint
  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/maintenance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": localStorage.getItem("biogrix_auth_token"),
        },
        body: JSON.stringify({
          ...formData,
          complaint_id: selectedComplaint.id,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          assigned_to: "",
          task_type: "Corrective",
          scheduled_date: "",
        });
        fetchUnifiedData(); // Table refreshes to show the assigned agent
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Triggers the Backend Sync: "Completed" status in Maintenance -> "Resolved" in Complaints
  const updateStatus = async (logId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/maintenance/${logId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": localStorage.getItem("biogrix_auth_token"),
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchUnifiedData(); // Re-fetch ensures both maintenance & complaint statuses are synced in the UI
    } catch (err) {
      console.error(err);
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
    <div className="py-8 px-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
          Operations Control
        </h1>
        <p className="text-neutral-400 font-medium">
          Monitor incoming complaints and manage field repair assignments.
        </p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
            data.filter((i) => i.maintenance_logs?.[0]?.status === "completed")
              .length
          }
          color="emerald"
        />
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, village or agent..."
            className="w-full pl-11 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-neutral-100 shadow-sm">
          {["All", "Scheduled", "In-Progress", "Completed"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? "bg-neutral-900 text-white shadow-md" : "text-neutral-400 hover:text-neutral-900"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* --- UNIFIED OPERATION TABLE --- */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
              <th className="px-8 py-6">Complaint / Issue</th>
              <th className="px-8 py-6">Village / Plant</th>
              <th className="px-8 py-6">Assigned Agent</th>
              <th className="px-8 py-6 text-right">Status / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-primary" />
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                const log = item.maintenance_logs?.[0];
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/50 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="font-bold text-neutral-900 text-sm">
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
                          <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                            {log.assigned_to[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-neutral-800">
                            {log.assigned_to}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-neutral-300 italic">
                          No Agent Assigned
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {log ? (
                        <select
                          value={log.status}
                          onChange={(e) => updateStatus(log.id, e.target.value)}
                          className={`pl-4 pr-8 py-2 rounded-xl text-[10px] font-black uppercase outline-none appearance-none cursor-pointer shadow-sm transition-all ${
                            log.status === "completed"
                              ? "bg-emerald-50 text-emerald-600"
                              : log.status === "in-progress"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedComplaint(item);
                            setShowModal(true);
                          }}
                          className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg"
                        >
                          Schedule Repair
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- FIELD TASK ASSIGNMENT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-neutral-900">
                Create Work Order
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-neutral-50 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-8 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-1">
                Issue Overview
              </p>
              <p className="text-sm font-bold text-neutral-800">
                {selectedComplaint?.issue_type} reported in{" "}
                {selectedComplaint?.village}
              </p>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                  Field Technician
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Enter technician name"
                    className="w-full pl-12 pr-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none font-bold"
                    value={formData.assigned_to}
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_to: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                  Scheduled Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type="date"
                    className="w-full pl-12 pr-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none font-bold"
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
                className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-all"
              >
                ACTIVATE FIELD TASK
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
    dark: "bg-neutral-900 text-white",
  };
  return (
    <div
      className={`p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex items-center gap-6 ${color === "dark" ? styles.dark : "bg-white"}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color !== "dark" ? styles[color] : "bg-white/10"}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-3xl font-black tracking-tight">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-widest mt-1 text-neutral-400">
          {label}
        </div>
      </div>
    </div>
  );
}
