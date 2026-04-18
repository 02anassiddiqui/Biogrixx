// frontend/pages/meters.js
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  Activity,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Loader2,
  Hash,
  User,
  Settings,
  X,
  Calendar,
  UserPlus,
  ArrowRight,
  Users,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";

// 🚀 Step 1: Reusable Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

export default function MetersModule({ syncTrigger }) {
  // 🚀 Step 2: Receive syncTrigger
  const [meters, setMeters] = useState([]);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [newMeter, setNewMeter] = useState({ serial_number: "", plant_id: "" });
  const [editingMeter, setEditingMeter] = useState(null);
  const [plants, setPlants] = useState([]);

  const [selectedMeter, setSelectedMeter] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    customer_id: "",
    assigned_worker_id: "",
    installation_date: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const meterRes = await apiRequest("/meters");
      if (meterRes.success) setMeters(meterRes.data);

      const plantResult = await apiRequest("/plants");
      if (plantResult.success) setPlants(plantResult.data);

      const workerResult = await apiRequest("/workers");
      if (workerResult.success) setWorkers(workerResult.data);

      const custResult = await apiRequest("/customers");
      if (custResult.success) {
        const pending = custResult.data.filter(
          (c) => !c.meter_number || c.meter_number === "PENDING",
        );
        setPendingCustomers(pending);
      }
    } catch (error) {
      toast.error("Failed to sync inventory data.");
    } finally {
      // 🚀 Step 3: Smooth transition delay
      setTimeout(() => setLoading(false), 500);
    }
  };

  // 🚀 Step 4: Hook into universal Sync Grid
  useEffect(() => {
    fetchData();
  }, [syncTrigger]);

  const handleRegisterMeter = async (e) => {
    e.preventDefault();
    if (!newMeter.plant_id)
      return toast.error("Please select a target plant unit.");

    setIsSubmitting(true);
    const loadingToast = toast.loading("Registering hardware...");
    try {
      const result = await apiRequest("/meters/register", {
        method: "POST",
        body: newMeter,
      });
      if (result.success) {
        toast.success("Hardware registered successfully.", {
          id: loadingToast,
        });
        setShowAddModal(false);
        setNewMeter({ serial_number: "", plant_id: "" });
        fetchData();
      } else {
        toast.error(result.message || "Registration failed.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error("Critical server error.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMeter = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Saving changes...");
    try {
      const result = await apiRequest(`/meters/${editingMeter.id}`, {
        method: "PATCH",
        body: {
          serial_number: editingMeter.serial_number,
          status: editingMeter.status,
        },
      });
      if (result.success) {
        toast.success("Hardware info updated.", { id: loadingToast });
        setShowEditModal(false);
        fetchData();
      } else {
        toast.error(result.message || "Update failed.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network sync failed.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignMeter = async (e) => {
    e.preventDefault();
    if (!assignmentData.customer_id)
      return toast.error("Please select a target customer.");
    if (!assignmentData.assigned_worker_id)
      return toast.error("Assignment requires a field agent.");

    setIsSubmitting(true);
    const loadingToast = toast.loading("Linking hardware to consumer...");
    try {
      const result = await apiRequest("/meters/assign", {
        method: "PATCH",
        body: {
          meter_id: selectedMeter.id,
          customer_id: assignmentData.customer_id,
          assigned_worker_id: assignmentData.assigned_worker_id,
          serial_number: selectedMeter.serial_number,
          installation_date: assignmentData.installation_date,
        },
      });

      if (result.success) {
        toast.success("Assignment protocol complete.", { id: loadingToast });
        setShowAssignModal(false);
        setAssignmentData({
          customer_id: "",
          assigned_worker_id: "",
          installation_date: new Date().toISOString().split("T")[0],
        });
        fetchData();
      } else {
        toast.error(result.message || "Assignment rejected by grid.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error("Grid synchronization error.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div>
              <h3 className="text-white font-black text-lg tracking-tight uppercase">
                Remove Hardware?
              </h3>
              <p className="text-neutral-400 text-[11px] font-medium leading-relaxed mt-1">
                This will permanently delete this meter from the system
                inventory.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDelete(id);
              }}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-red-500/20"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-white/5 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Purging hardware records...");
    try {
      const result = await apiRequest(`/meters/${id}`, { method: "DELETE" });
      if (result.success) {
        toast.success("Hardware removed successfully.", { id: loadingToast });
        fetchData();
      }
    } catch (err) {
      toast.error("Server sync lost.", { id: loadingToast });
    }
  };

  const filteredMeters = meters.filter(
    (m) =>
      m.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* 📊 SUMMARY STATS WITH SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mb-10">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col justify-between h-44"
            >
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatItem
              icon={<Hash size={24} />}
              label="Total Inventory"
              value={meters.length}
              color="blue"
            />
            <StatItem
              icon={<CheckCircle2 size={24} />}
              label="Active on Grid"
              value={meters.filter((m) => m.status === "active").length}
              color="emerald"
            />
            <StatItem
              icon={<Activity size={24} />}
              label="Available Stock"
              value={meters.filter((m) => m.status === "available").length}
              color="amber"
            />
          </>
        )}
      </div>

      <div className="px-8 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Serial or Customer..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-xl active:scale-95 shrink-0"
        >
          <Plus size={18} /> Register Meter
        </button>
      </div>

      {/* 📑 GRID TABLE WITH SKELETON */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-100">
                <th className="px-8 py-6">Hardware Info</th>
                <th className="px-8 py-6">Assigned To (Customer)</th>
                <th className="px-8 py-6">Field Agent (Worker)</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading
                ? [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-8 py-6">
                        <Skeleton className="h-6 w-32" />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-7 w-20 rounded-xl" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Skeleton className="h-8 w-16 ml-auto rounded-xl" />
                      </td>
                    </tr>
                  ))
                : filteredMeters.map((meter) => (
                    <tr
                      key={meter.id}
                      className="group hover:bg-neutral-50/40 transition-all font-bold"
                    >
                      <td className="px-8 py-6 font-black text-neutral-900 text-sm tracking-tight">
                        {meter.serial_number}
                      </td>
                      <td className="px-8 py-6">
                        {meter.customers ? (
                          <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                            <User size={14} className="text-primary" />{" "}
                            {meter.customers.name}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedMeter(meter);
                              setShowAssignModal(true);
                            }}
                            className="flex items-center gap-2 text-[9px] font-black text-primary uppercase bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                          >
                            <UserPlus size={12} /> Assign Now
                          </button>
                        )}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-neutral-500">
                        {meter.workers ? (
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl w-fit">
                            <Users size={12} /> {meter.workers.name}
                          </div>
                        ) : (
                          "---"
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${meter.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : meter.status === "maintenance" ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                        >
                          {meter.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingMeter(meter);
                              setShowEditModal(true);
                            }}
                            className="p-2.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Settings size={16} />
                          </button>
                          <button
                            onClick={() => confirmDelete(meter.id)}
                            className="p-2.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS (Code Kept Original) --- */}
      {showAddModal && (
        <Modal
          title="Register New Hardware"
          close={() => setShowAddModal(false)}
        >
          <form onSubmit={handleRegisterMeter} className="space-y-8">
            <InputField
              label="Serial Number"
              icon={<Hash size={16} />}
              placeholder="e.g. BG-MET-001"
              value={newMeter.serial_number}
              onChange={(e) =>
                setNewMeter({ ...newMeter, serial_number: e.target.value })
              }
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                Plant Unit
              </label>
              <select
                className="w-full p-5 bg-neutral-50 rounded-2xl border-none outline-none font-bold text-sm focus:ring-4 focus:ring-primary/5 transition-all appearance-none"
                value={newMeter.plant_id}
                onChange={(e) =>
                  setNewMeter({ ...newMeter, plant_id: e.target.value })
                }
              >
                <option value="">Select Local Unit...</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <SubmitButton loading={isSubmitting} label="ADD TO INVENTORY" />
          </form>
        </Modal>
      )}

      {showAssignModal && (
        <Modal title="Assign Hardware" close={() => setShowAssignModal(false)}>
          <div className="mb-8 p-6 bg-primary/5 rounded-[1.5rem] border border-primary/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                Meter ID
              </p>
              <h4 className="text-xl font-black text-neutral-900">
                {selectedMeter?.serial_number}
              </h4>
            </div>
            <ArrowRight className="text-primary opacity-30" />
          </div>
          <form onSubmit={handleAssignMeter} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                Select Pending Customer
              </label>
              <select
                className="w-full p-5 bg-neutral-50 rounded-2xl border-none outline-none font-bold text-sm focus:ring-4 focus:ring-primary/5 appearance-none"
                value={assignmentData.customer_id}
                onChange={(e) =>
                  setAssignmentData({
                    ...assignmentData,
                    customer_id: e.target.value,
                  })
                }
              >
                <option value="">Select Consumer...</option>
                {pendingCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.villages?.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                Assign Field Agent
              </label>
              <select
                className="w-full p-5 bg-neutral-50 rounded-2xl border-none outline-none font-bold text-sm focus:ring-4 focus:ring-primary/5 appearance-none"
                value={assignmentData.assigned_worker_id}
                onChange={(e) =>
                  setAssignmentData({
                    ...assignmentData,
                    assigned_worker_id: e.target.value,
                  })
                }
              >
                <option value="">Select Agent...</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.phone})
                  </option>
                ))}
              </select>
            </div>
            <InputField
              type="date"
              label="Installation Date"
              icon={<Calendar size={16} />}
              value={assignmentData.installation_date}
              onChange={(e) =>
                setAssignmentData({
                  ...assignmentData,
                  installation_date: e.target.value,
                })
              }
            />
            <SubmitButton loading={isSubmitting} label="CONFIRM ASSIGNMENT" />
          </form>
        </Modal>
      )}

      {showEditModal && editingMeter && (
        <Modal title="Edit Meter Info" close={() => setShowEditModal(false)}>
          <form onSubmit={handleUpdateMeter} className="space-y-8">
            <InputField
              label="Meter Serial Number"
              icon={<Hash size={16} />}
              value={editingMeter.serial_number}
              onChange={(e) =>
                setEditingMeter({
                  ...editingMeter,
                  serial_number: e.target.value,
                })
              }
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                Update Node Status
              </label>
              <select
                className="w-full p-5 bg-neutral-50 rounded-2xl border-none outline-none font-bold text-sm focus:ring-4 focus:ring-primary/5 appearance-none"
                value={editingMeter.status}
                onChange={(e) =>
                  setEditingMeter({ ...editingMeter, status: e.target.value })
                }
              >
                <option value="available">Available (Stock)</option>
                <option value="active">Active (On Grid)</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <SubmitButton loading={isSubmitting} label="SAVE CHANGES" />
          </form>
        </Modal>
      )}
    </div>
  );
}

// Internal components kept identical but stylized for consistency
function StatItem({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm transition-all hover:shadow-md">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]} shadow-inner`}
      >
        {icon}
      </div>
      <div className="text-4xl font-black text-neutral-900 tracking-tighter">
        {value}
      </div>
      <div className="text-[10px] font-black text-neutral-400 uppercase mt-1 tracking-widest">
        {label}
      </div>
    </div>
  );
}

function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-xl bg-neutral-900/40 animate-in fade-in">
      <div className="relative bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl animate-in zoom-in border border-neutral-100">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase">
            {title}
          </h3>
          <button
            onClick={close}
            className="p-2 hover:bg-neutral-50 rounded-full transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({ label, icon, type = "text", ...props }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300">
          {icon}
        </div>
        <input
          {...props}
          type={type}
          className="w-full pl-14 pr-6 py-5 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/5 font-bold text-sm transition-all"
        />
      </div>
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-neutral-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-neutral-200 hover:bg-primary transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 mt-4"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <CheckCircle2 size={20} />
      )}{" "}
      {label}
    </button>
  );
}
