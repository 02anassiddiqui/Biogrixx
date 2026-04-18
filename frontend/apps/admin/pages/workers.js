// frontend/pages/workers.js
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  Users,
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  Loader2,
  Phone,
  Key,
  X,
  CheckCircle2,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";

// 🚀 Reusable Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

export default function WorkersModule({ syncTrigger }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [newWorker, setNewWorker] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [editingWorker, setEditingWorker] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/workers");
      if (res.success) setWorkers(res.data);
    } catch (error) {
      toast.error("Failed to sync agent records.");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, [syncTrigger]);

  const handleAddWorker = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadToast = toast.loading("Registering agent...");
    try {
      const res = await apiRequest("/workers/register", {
        method: "POST",
        body: newWorker,
      });
      if (res.success) {
        toast.success("Agent activated.", { id: loadToast });
        setShowAddModal(false);
        setNewWorker({ name: "", phone: "", password: "" });
        fetchData();
      } else {
        toast.error(res.message || "Failed.", { id: loadToast });
      }
    } catch (error) {
      toast.error("Error.", { id: loadToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWorker = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadToast = toast.loading("Syncing updates...");
    try {
      const res = await apiRequest(`/workers/${editingWorker.id}`, {
        method: "PATCH",
        body: {
          name: editingWorker.name,
          phone: editingWorker.phone,
          password: editingWorker.password,
        },
      });
      if (res.success) {
        toast.success("Agent profile updated.", { id: loadToast });
        setShowEditModal(false);
        fetchData();
      } else {
        toast.error(res.message || "Update failed.", { id: loadToast });
      }
    } catch (error) {
      toast.error("Network error.", { id: loadToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.phone.includes(searchTerm),
  );

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* HEADER & ACTIONS */}
      <div className="px-8 mb-10 flex flex-col md:flex-row gap-6 items-center justify-between font-sans">
        <div>
          <h2 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">
            Field Agents
          </h2>
          <p className="text-[10px] text-neutral-400 font-black tracking-[0.2em] uppercase mt-1">
            Managing {loading ? "..." : workers.length} Ground Personnel
          </p>
        </div>

        {/* 🚀 FIXED BUTTON UI */}
        <button
          onClick={() => setShowAddModal(true)}
          className="group flex items-center justify-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl shadow-neutral-200 whitespace-nowrap shrink-0"
        >
          <Plus
            size={18}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span>Add New Agent</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="px-8 mb-6">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Agent..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-100">
                <th className="px-8 py-6">Agent Name</th>
                <th className="px-8 py-6">Phone Number</th>
                <th className="px-8 py-6">Passcode</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading
                ? [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-8 py-6">
                        <Skeleton className="h-6 w-40" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-5 w-28" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-5 w-16" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-7 w-20 rounded-full" />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </td>
                    </tr>
                  ))
                : filtered.map((worker) => (
                    <tr
                      key={worker.id}
                      className="hover:bg-neutral-50/40 transition-all group font-bold"
                    >
                      <td className="px-8 py-6 font-black text-neutral-900 text-base">
                        {worker.name}
                      </td>
                      <td className="px-8 py-6 text-sm text-neutral-500 uppercase">
                        {worker.phone}
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-primary tracking-[0.2em]">
                        {worker.password}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${worker.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
                        >
                          {worker.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingWorker(worker);
                            setShowEditModal(true);
                          }}
                          className="p-2.5 text-neutral-300 hover:text-primary transition-all active:scale-90"
                        >
                          <Settings size={18} />
                        </button>
                        <button className="p-2.5 text-neutral-300 hover:text-red-500 transition-all active:scale-90">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-xl bg-neutral-900/40 animate-in fade-in">
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl animate-in zoom-in border border-neutral-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase">
                {showAddModal ? "Activate Agent" : "Update Profile"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="p-2 hover:bg-neutral-50 rounded-full text-neutral-400"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={showAddModal ? handleAddWorker : handleUpdateWorker}
              className="space-y-8"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <Users
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-neutral-50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 font-black text-xs uppercase"
                    value={showAddModal ? newWorker.name : editingWorker.name}
                    onChange={(e) =>
                      showAddModal
                        ? setNewWorker({ ...newWorker, name: e.target.value })
                        : setEditingWorker({
                            ...editingWorker,
                            name: e.target.value,
                          })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type="tel"
                    className="w-full pl-14 pr-6 py-5 bg-neutral-50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 font-black text-xs uppercase"
                    value={showAddModal ? newWorker.phone : editingWorker.phone}
                    onChange={(e) =>
                      showAddModal
                        ? setNewWorker({ ...newWorker, phone: e.target.value })
                        : setEditingWorker({
                            ...editingWorker,
                            phone: e.target.value,
                          })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                  System Passcode
                </label>
                <div className="relative">
                  <Key
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type={showPass ? "text" : "password"}
                    className="w-full pl-14 pr-14 py-5 bg-neutral-50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 font-black text-xs uppercase tracking-widest"
                    value={
                      showAddModal ? newWorker.password : editingWorker.password
                    }
                    onChange={(e) =>
                      showAddModal
                        ? setNewWorker({
                            ...newWorker,
                            password: e.target.value,
                          })
                        : setEditingWorker({
                            ...editingWorker,
                            password: e.target.value,
                          })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-primary"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                className="w-full bg-neutral-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
                {showAddModal ? "ACTIVATE AGENT" : "SAVE UPDATES"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
