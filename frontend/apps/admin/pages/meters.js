import { useState, useEffect } from "react";
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
} from "lucide-react";

export default function MetersModule() {
  const [meters, setMeters] = useState([]);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // 👈 New Edit Modal State

  // Form States
  const [searchTerm, setSearchTerm] = useState("");
  const [newMeter, setNewMeter] = useState({ serial_number: "", plant_id: "" });
  const [editingMeter, setEditingMeter] = useState(null); // 👈 State for the meter being edited
  const [plants, setPlants] = useState([]);

  // Assignment States
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    customer_id: "",
    installation_date: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // --- 📡 FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
      };

      const meterRes = await fetch(`${API_BASE_URL}/v1/meters`, { headers });
      const meterResult = await meterRes.json();
      if (meterResult.success) setMeters(meterResult.data);

      const plantRes = await fetch(`${API_BASE_URL}/v1/plants`, { headers });
      const plantResult = await plantRes.json();
      if (plantResult.success) setPlants(plantResult.data);

      const custRes = await fetch(`${API_BASE_URL}/v1/customers`, { headers });
      const custResult = await custRes.json();
      if (custResult.success) {
        const pending = custResult.data.filter(
          (c) => !c.meter_number || c.meter_number === "PENDING",
        );
        setPendingCustomers(pending);
      }
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 🚀 REGISTER NEW METER ---
  const handleRegisterMeter = async (e) => {
    e.preventDefault();
    if (!newMeter.plant_id) return alert("Bhai, Plant select karo!");
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/meters/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
        body: JSON.stringify(newMeter),
      });
      if ((await response.json()).success) {
        setShowAddModal(false);
        setNewMeter({ serial_number: "", plant_id: "" });
        fetchData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 📝 UPDATE METER DETAILS ---
  const handleUpdateMeter = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/meters/${editingMeter.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
          },
          body: JSON.stringify({
            serial_number: editingMeter.serial_number,
            status: editingMeter.status,
          }),
        },
      );

      const result = await response.json();
      if (result.success) {
        setShowEditModal(false);
        fetchData(); // Sync with DB
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 🔗 ASSIGN METER TO CUSTOMER ---
  const handleAssignMeter = async (e) => {
    e.preventDefault();
    if (!assignmentData.customer_id) return alert("Bhai, Kisan select karo!");

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/meters/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
        body: JSON.stringify({
          meter_id: selectedMeter.id,
          customer_id: assignmentData.customer_id,
          serial_number: selectedMeter.serial_number,
          installation_date: assignmentData.installation_date,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Hardware successfully linked to Customer!");
        setShowAssignModal(false);
        fetchData();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Assignment failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bhai, kya confirm hai? Meter permanently delete ho jayega.",
      )
    )
      return;

    try {
      const res = await fetch(`${API_BASE_URL}/v1/meters/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });

      const result = await res.json();

      if (result.success) {
        alert("Success: Meter removed from inventory.");
        fetchData(); // ✅ 'fetchMeters()' ki jagah 'fetchData()' kar diya
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Koshish nakam rahi, server check karein.");
    }
  };

  const filteredMeters = meters.filter(
    (m) =>
      m.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mb-10">
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
      </div>

      {/* --- SEARCH & ACTIONS --- */}
      <div className="px-8 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Serial or Customer..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-95 shadow-lg"
        >
          <Plus size={18} /> Register Meter
        </button>
      </div>

      {/* --- METERS TABLE --- */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-widest border-b border-neutral-50">
                <th className="px-8 py-6">Hardware Info</th>
                <th className="px-8 py-6">Plant / Stock</th>
                <th className="px-8 py-6">Assigned To</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : (
                filteredMeters.map((meter) => (
                  <tr
                    key={meter.id}
                    className="group hover:bg-neutral-50/50 transition-all"
                  >
                    <td className="px-8 py-6 font-black text-neutral-900">
                      {meter.serial_number}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-neutral-500">
                      {meter.plants?.name || "Global Stock"}
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
                          className="flex items-center gap-2 text-[10px] font-black text-primary uppercase bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
                        >
                          <UserPlus size={12} /> Assign Now
                        </button>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          meter.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : meter.status === "maintenance"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        {meter.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingMeter(meter);
                            setShowEditModal(true);
                          }}
                          className="p-2.5 text-neutral-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(meter.id)}
                          className="p-2.5 text-neutral-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 🛠️ MODAL: REGISTER NEW METER --- */}
      {showAddModal && (
        <Modal
          title="Register New Hardware"
          close={() => setShowAddModal(false)}
        >
          <form onSubmit={handleRegisterMeter} className="space-y-6">
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
              <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">
                Plant Unit
              </label>
              <select
                className="w-full p-4 bg-neutral-50 rounded-2xl border-none font-bold text-sm"
                value={newMeter.plant_id}
                onChange={(e) =>
                  setNewMeter({ ...newMeter, plant_id: e.target.value })
                }
              >
                <option value="">Select Plant...</option>
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

      {/* --- 🛠️ MODAL: EDIT METER DETAILS --- */}
      {showEditModal && editingMeter && (
        <Modal title="Edit Meter Info" close={() => setShowEditModal(false)}>
          <form onSubmit={handleUpdateMeter} className="space-y-6">
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
              <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">
                Update Status
              </label>
              <select
                className="w-full p-4 bg-neutral-50 rounded-2xl border-none font-bold text-sm"
                value={editingMeter.status}
                onChange={(e) =>
                  setEditingMeter({ ...editingMeter, status: e.target.value })
                }
              >
                <option value="available">Available (Stock)</option>
                <option value="active">Active (On Grid)</option>
                <option value="maintenance">Maintenance (Kharab)</option>
                <option value="inactive">Inactive (Band)</option>
              </select>
            </div>

            <SubmitButton loading={isSubmitting} label="SAVE CHANGES" />
          </form>
        </Modal>
      )}

      {/* --- 🛠️ MODAL: ASSIGN TO CUSTOMER --- */}
      {showAssignModal && (
        <Modal title="Assign Hardware" close={() => setShowAssignModal(false)}>
          <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-primary uppercase">
                Meter Selected
              </p>
              <h4 className="text-lg font-black text-neutral-900">
                {selectedMeter?.serial_number}
              </h4>
            </div>
            <ArrowRight className="text-primary opacity-30" />
          </div>

          <form onSubmit={handleAssignMeter} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">
                Select Pending Customer
              </label>
              <select
                className="w-full p-4 bg-neutral-50 rounded-2xl border-none font-bold text-sm"
                value={assignmentData.customer_id}
                onChange={(e) =>
                  setAssignmentData({
                    ...assignmentData,
                    customer_id: e.target.value,
                  })
                }
              >
                <option value="">Select Kisan...</option>
                {pendingCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.villages?.name})
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
    </div>
  );
}

// --- HELPER COMPONENTS ---
function StatItem({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}
      >
        {icon}
      </div>
      <div className="text-3xl font-black text-neutral-900">{value}</div>
      <div className="text-[10px] font-bold text-neutral-400 uppercase mt-1">
        {label}
      </div>
    </div>
  );
}

function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        onClick={close}
      />
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-neutral-900">{title}</h3>
          <button
            onClick={close}
            className="p-2 hover:bg-neutral-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({ label, icon, type = "text", ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300">
          {icon}
        </div>
        <input
          {...props}
          type={type}
          className="w-full pl-12 pr-5 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
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
      className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm hover:bg-neutral-900 transition-all flex items-center justify-center gap-3 mt-4"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <CheckCircle2 size={18} />
      )}
      {label}
    </button>
  );
}
