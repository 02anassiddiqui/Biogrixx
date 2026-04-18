// frontend/pages/plants.js
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  Factory,
  MapPin,
  Zap,
  Plus,
  Search,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  RotateCcw,
  UserCheck,
  RefreshCw,
} from "lucide-react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

// 🚀 Step 3: Receive syncTrigger as prop
export default function PlantsModule({ syncTrigger }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);

  const [newPlant, setNewPlant] = useState({
    name: "",
    village_name: "",
    capacity: "",
    installer_name: "",
    status: "active",
  });

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("/plants");
      if (result.success) {
        setPlants(result.data);
      } else {
        toast.error("Failed to synchronize infrastructure data.");
      }
    } catch (error) {
      toast.error("Network error: Plant grid offline.");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // 🚀 Step 4: Add syncTrigger to dependencies
  useEffect(() => {
    fetchPlants();
  }, [syncTrigger]);

  const handleAddPlant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Authorizing plant deployment...");
    try {
      const result = await apiRequest("/plants/register", {
        method: "POST",
        body: newPlant,
      });
      if (result.success) {
        toast.success("Plant unit deployed to the grid.", { id: loadingToast });
        setShowAddForm(false);
        setNewPlant({
          name: "",
          village_name: "",
          capacity: "",
          installer_name: "",
          status: "active",
        });
        fetchPlants();
      } else {
        toast.error(result.message || "Registration failed.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error("Critical deployment error.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecommission = async (id) => {
    const loadingToast = toast.loading("Decommissioning unit...");
    try {
      const result = await apiRequest(`/plants/${id}`, { method: "DELETE" });
      if (result.success) {
        toast.success("Unit purged successfully.", { id: loadingToast });
        setPlants(plants.filter((p) => p.id !== id));
        setConfirmingId(null);
      }
    } catch (error) {
      toast.error("Sync failure.", { id: loadingToast });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const loadingToast = toast.loading(`Updating status...`);
    try {
      const result = await apiRequest(`/plants/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      if (result.success) {
        toast.success(`Unit status synced.`, { id: loadingToast });
        setPlants(
          plants.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
        );
      }
    } catch (error) {
      toast.error("Network error.", { id: loadingToast });
    }
  };

  const filteredPlants = plants.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.villages?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.installer_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="py-8 px-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">
            Plant <span className="text-primary">Infrastructure</span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 font-bold uppercase tracking-widest leading-none">
            Monitoring {loading ? "..." : plants.length} Production Units
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto items-center">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Units..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 🚀 Step 5: Provision button kept as primary action. Global Sync Grid button is in Header. */}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl shadow-neutral-200 shrink-0"
          >
            <Plus size={18} /> Provision
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-100">
                <th className="px-8 py-6">Unit Designation</th>
                <th className="px-8 py-6">Village Hub</th>
                <th className="px-8 py-6">Lead Installer</th>
                <th className="px-8 py-6">Capacity</th>
                <th className="px-8 py-6">Current Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading
                ? [1, 2, 3, 4, 5].map((i) => (
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
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-8 w-24 rounded-xl" />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Skeleton className="h-10 w-10 ml-auto rounded-xl" />
                      </td>
                    </tr>
                  ))
                : filteredPlants.map((plant) => (
                    <tr
                      key={plant.id}
                      className={`transition-all group ${confirmingId === plant.id ? "bg-red-50/50" : "hover:bg-neutral-50/40"}`}
                    >
                      {confirmingId === plant.id ? (
                        <td colSpan="6" className="px-8 py-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-red-600 font-black text-xs uppercase tracking-widest">
                              <AlertTriangle size={18} /> Decommission "
                              {plant.name}"?
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setConfirmingId(null)}
                                className="px-6 py-2.5 text-[10px] font-black uppercase text-neutral-400 hover:text-neutral-900 transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDecommission(plant.id)}
                                className="px-6 py-2.5 text-[10px] font-black uppercase bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg transition-all"
                              >
                                Confirm Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg uppercase font-black text-xs">
                                {plant.name.slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-black text-neutral-900 text-sm tracking-tight">
                                  {plant.name}
                                </div>
                                <div className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">
                                  ID: {plant.id.slice(0, 8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-xs font-black text-neutral-600 uppercase tracking-tight">
                              <MapPin size={14} className="text-primary" />{" "}
                              {plant.villages?.name || "Independent"}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-[10px] font-black uppercase text-neutral-400 tracking-widest italic">
                            {plant.installer_name || "Self-Managed"}
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-black text-sm text-neutral-900">
                              {plant.capacity}{" "}
                              <span className="text-[9px] text-neutral-400 uppercase ml-1">
                                m³/D
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="relative inline-block">
                              <select
                                value={plant.status}
                                onChange={(e) =>
                                  handleStatusChange(plant.id, e.target.value)
                                }
                                className={`pl-8 pr-10 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border-none appearance-none transition-all cursor-pointer shadow-sm ${plant.status === "active" ? "bg-emerald-50 text-emerald-600" : plant.status === "maintenance" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}
                              >
                                <option value="active">Active</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="offline">Offline</option>
                              </select>
                              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                {plant.status === "active" ? (
                                  <CheckCircle2 size={12} />
                                ) : plant.status === "maintenance" ? (
                                  <RotateCcw size={12} />
                                ) : (
                                  <AlertTriangle size={12} />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => setConfirmingId(plant.id)}
                              className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowAddForm(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-12 animate-in slide-in-from-right duration-500 border-l border-neutral-100">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
                New <br />
                Deployment
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-3 hover:bg-neutral-50 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddPlant} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] ml-1">
                  Plant Designation
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-6 py-5 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all"
                  placeholder="Mehsana Main Node"
                  value={newPlant.name}
                  onChange={(e) =>
                    setNewPlant({ ...newPlant, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] ml-1">
                  Village Hub
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-6 py-5 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all"
                  placeholder="Link to Village Node"
                  value={newPlant.village_name}
                  onChange={(e) =>
                    setNewPlant({ ...newPlant, village_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] ml-1">
                  Installation Authority
                </label>
                <div className="relative">
                  <UserCheck
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all uppercase tracking-widest"
                    placeholder="Lead Engineer"
                    value={newPlant.installer_name}
                    onChange={(e) =>
                      setNewPlant({
                        ...newPlant,
                        installer_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] ml-1">
                    Capacity (m³)
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full px-6 py-5 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/5 text-sm font-black transition-all"
                    placeholder="0.00"
                    value={newPlant.capacity}
                    onChange={(e) =>
                      setNewPlant({ ...newPlant, capacity: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] ml-1">
                    Status
                  </label>
                  <select
                    className="w-full px-6 py-5 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/5 text-xs font-black uppercase tracking-widest transition-all appearance-none"
                    value={newPlant.status}
                    onChange={(e) =>
                      setNewPlant({ ...newPlant, status: e.target.value })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-neutral-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-neutral-200 hover:bg-primary transition-all flex items-center justify-center gap-4 mt-6 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Zap size={18} fill="currentColor" />
                )}{" "}
                Authorize Deployment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
