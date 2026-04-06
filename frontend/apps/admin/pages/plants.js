import { useEffect, useState } from "react";
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
  UserCheck, // Added icon for installer
} from "lucide-react";

export default function PlantsModule() {
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
    installer_name: "", // ✅ Initialized
    status: "active",
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  // --- 1. Fetch Plants Data ---
  const fetchPlants = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/plants`, {
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });
      const result = await response.json();
      if (result.success) setPlants(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  // --- 2. Register New Plant ---
  const handleAddPlant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/plants/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
        body: JSON.stringify(newPlant),
      });
      const result = await response.json();
      if (result.success) {
        setShowAddForm(false);
        setNewPlant({
          name: "",
          village_name: "",
          capacity: "",
          installer_name: "",
          status: "active",
        });
        fetchPlants();
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. Delete Logic ---
  const handleDecommission = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });
      const result = await response.json();
      if (result.success) {
        setPlants(plants.filter((p) => p.id !== id));
        setConfirmingId(null);
      }
    } catch (error) {
      console.error("Decommission failed:", error);
    }
  };

  // --- 4. Update Status ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        setPlants(
          plants.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
        );
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const filteredPlants = plants.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.villages?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.installer_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="py-8 px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Plant <span className="text-primary">Infrastructure</span>
          </h2>
          <p className="text-sm text-neutral-500 mt-1 font-medium">
            Managing {plants.length} Biogas Production Units
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search Units or Installers..."
              className="w-full pl-11 pr-6 py-3 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-neutral-900 transition-all active:scale-95 shadow-lg shadow-primary/10"
          >
            <Plus size={16} /> Provision Plant
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-sm text-neutral-400 font-medium">
              Syncing With Remote Units...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs font-bold border-b border-neutral-100">
                  <th className="px-8 py-5">Unit Designation</th>
                  <th className="px-8 py-5">Village Hub</th>
                  <th className="px-8 py-5">Installer</th> {/* ✅ New Header */}
                  <th className="px-8 py-5">Capacity</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredPlants.map((plant) => (
                  <tr
                    key={plant.id}
                    className={`transition-colors ${confirmingId === plant.id ? "bg-red-50/50" : "hover:bg-neutral-50/50"}`}
                  >
                    {confirmingId === plant.id ? (
                      <td colSpan="6" className="px-8 py-4">
                        {" "}
                        {/* ✅ colSpan updated to 6 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-red-600 font-bold text-sm">
                            <AlertTriangle size={18} />
                            Decommission "{plant.name}" From The Grid?
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfirmingId(null)}
                              className="px-4 py-2 text-xs font-bold text-neutral-500 hover:bg-white rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDecommission(plant.id)}
                              className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              Confirm Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-100 text-neutral-600 rounded-xl flex items-center justify-center">
                              <Factory size={18} />
                            </div>
                            <div>
                              <div className="font-bold text-neutral-900 text-sm">
                                {plant.name}
                              </div>
                              <div className="text-[11px] text-neutral-400 font-medium">
                                ID: {plant.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm text-neutral-600 font-medium">
                            <MapPin size={14} className="text-primary" />
                            {plant.villages?.name || "Unassigned"}
                          </div>
                        </td>
                        <td className="px-8 py-6 italic text-sm text-neutral-500 font-medium">
                          {plant.installer_name || "Self-Install"}{" "}
                          {/* ✅ New Data Cell */}
                        </td>
                        <td className="px-8 py-6 font-bold text-sm text-neutral-900">
                          {plant.capacity}{" "}
                          <span className="text-[10px] text-neutral-400 font-normal">
                            m³/Day
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="relative inline-block">
                            <select
                              value={plant.status}
                              onChange={(e) =>
                                handleStatusChange(plant.id, e.target.value)
                              }
                              className={`pl-8 pr-4 py-1.5 rounded-full text-[11px] font-bold outline-none cursor-pointer border-none appearance-none transition-all ${
                                plant.status === "active"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : plant.status === "maintenance"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-red-50 text-red-600"
                              }`}
                            >
                              <option value="active">Active</option>
                              <option value="maintenance">Maintenance</option>
                              <option value="offline">Offline</option>
                            </select>
                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                              {plant.status === "active" && (
                                <CheckCircle2
                                  size={12}
                                  className="text-emerald-600"
                                />
                              )}
                              {plant.status === "maintenance" && (
                                <RotateCcw
                                  size={12}
                                  className="text-amber-600"
                                />
                              )}
                              {plant.status === "offline" && (
                                <AlertTriangle
                                  size={12}
                                  className="text-red-600"
                                />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => setConfirmingId(plant.id)}
                            className="p-2 text-neutral-300 hover:text-red-500 transition-all"
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
        )}
      </div>

      {/* Side Slide Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-neutral-900">
                New Plant Deployment
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-neutral-50 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPlant} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Plant Designation
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  placeholder="e.g. Mehsana Primary-01"
                  value={newPlant.name}
                  onChange={(e) =>
                    setNewPlant({ ...newPlant, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Village Hub
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  placeholder="Enter Village Name"
                  value={newPlant.village_name}
                  onChange={(e) =>
                    setNewPlant({ ...newPlant, village_name: e.target.value })
                  }
                />
              </div>

              {/* ✅ Added Installer Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Lead Installer / Entity
                </label>
                <div className="relative">
                  <UserCheck
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300"
                    size={16}
                  />
                  <input
                    required
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    placeholder="Contractor or Engineer Name"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Capacity (m³)
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    placeholder="0.00"
                    value={newPlant.capacity}
                    onChange={(e) =>
                      setNewPlant({ ...newPlant, capacity: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Initial Status
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium appearance-none"
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
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 shadow-lg mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Zap size={16} fill="currentColor" />
                )}
                Authorize Deployment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
