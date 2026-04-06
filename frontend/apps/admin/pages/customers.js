import { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Zap,
  Search,
  Loader2,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Activity,
  Droplets,
  Factory,
} from "lucide-react";

export default function CustomersModule() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  // --- ✅ NEW: DELETE LOGIC ---
  const handleDeleteCustomer = async (id) => {
    if (
      !window.confirm(
        "Bhai, kya aap sure ho? Ye customer grid se permanent hat jayega!",
      )
    )
      return;

    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });
      const result = await response.json();
      if (result.success) {
        // Table se turant remove karne ke liye state update
        setCustomers(customers.filter((c) => c.id !== id));
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // --- 1. Fetch Customers Data ---
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });
      const result = await response.json();
      if (result.success) setCustomers(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.meter_number?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="py-8 px-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Active <span className="text-primary">Consumer Grid</span>
          </h2>
          <p className="text-sm text-neutral-500 mt-1 font-medium">
            Monitoring {customers.length} Household Connections
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Name, Phone or Meter ID..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <MiniStat
          label="Active Meters"
          value={customers.length}
          icon={<Zap size={16} />}
          color="bg-emerald-50 text-emerald-600"
        />
        <MiniStat
          label="Village Hubs"
          value={[...new Set(customers.map((c) => c.village_id))].length}
          icon={<MapPin size={16} />}
          color="bg-blue-50 text-blue-600"
        />
        <MiniStat
          label="Total Livestock"
          value={customers.reduce(
            (acc, curr) => acc + (Number(curr.livestock_count) || 0),
            0,
          )}
          icon={<Activity size={16} />}
          color="bg-amber-50 text-amber-600"
        />
        <MiniStat
          label="Grid Health"
          value="Stable"
          icon={<ShieldAlert size={16} />}
          color="bg-primary/10 text-primary"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-sm text-neutral-400 font-bold tracking-widest uppercase">
              Syncing Grid Nodes...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-neutral-100">
                  <th className="px-8 py-6">Consumer Profile</th>
                  <th className="px-8 py-6">Village Link</th>
                  <th className="px-8 py-6">Infrastructure</th>
                  <th className="px-8 py-6">Technical Specs</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-neutral-50/40 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-neutral-200">
                          {customer.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 text-base tracking-tight">
                            {customer.name}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-bold flex items-center gap-1 mt-0.5">
                            {customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <MapPin size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-800">
                            {customer.villages?.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-bold uppercase">
                            {customer.villages?.district}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <Factory size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-800">
                            {customer.plants?.name || "Independent"}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-bold uppercase">
                            Assigned Unit
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-neutral-300 uppercase w-12">
                            Meter
                          </span>
                          <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                            {customer.meter_number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-neutral-300 uppercase w-12">
                            Stock
                          </span>
                          <span className="text-xs font-bold text-neutral-700">
                            {customer.livestock_count} Heads
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <Users size={48} />
                        <p className="font-bold">
                          No active consumers found in this node.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <div className="text-lg font-black text-neutral-900 leading-none mb-1">
          {value}
        </div>
        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}
