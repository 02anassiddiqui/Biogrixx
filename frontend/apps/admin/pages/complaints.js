// frontend/apps/admin/complaints.js
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Loader2,
  Phone,
  MapPin,
  XCircle,
  RefreshCw,
} from "lucide-react";

// 🚀 Step 1: Reusable Skeleton Component for Ticket Cards
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

export default function AdminComplaints({ syncTrigger }) {
  // 🚀 Step 2: Receive syncTrigger
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/complaints");
      if (res.success) {
        setTickets(res.data);
      } else {
        toast.error("Failed to sync support grid.");
      }
    } catch (err) {
      toast.error("Network error: Support grid offline.");
    } finally {
      // 🚀 Step 3: Smooth transition delay for shimmer effect
      setTimeout(() => setLoading(false), 500);
    }
  };

  const updateStatus = async (id, status) => {
    const loadingToast = toast.loading("Updating ticket status...");
    try {
      const res = await apiRequest(`/complaints/${id}/status`, {
        method: "PATCH",
        body: { status },
      });

      if (res.success) {
        toast.success(`Ticket marked as ${status}.`, { id: loadingToast });
        fetchTickets();
      } else {
        toast.error(res.message || "Update failed.", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server error occurred.", { id: loadingToast });
    }
  };

  // 🚀 Step 4: Hook into the Universal Sync Grid trigger from Parent
  useEffect(() => {
    fetchTickets();
  }, [syncTrigger]);

  const filteredTickets = tickets.filter(
    (t) => filter === "All" || t.status === filter,
  );

  return (
    <div className="p-8 animate-in fade-in duration-500 font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
            Support <span className="text-primary">Grid</span>
          </h1>
          <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-3">
            Grievance Redressal & Network Monitoring
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-neutral-100 shadow-sm">
          {["All", "pending", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          // 🚀 Step 5: Skeleton Cards Loading State
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 space-y-6 h-80 flex flex-col justify-between shadow-sm"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-2/3" />
              </div>
              <div className="bg-neutral-50/50 p-5 rounded-3xl space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-32 rounded-2xl" />
              </div>
            </div>
          ))
        ) : filteredTickets.length === 0 ? (
          <div className="col-span-full py-32 text-center">
            <XCircle className="mx-auto text-neutral-100 mb-4" size={64} />
            <p className="text-neutral-400 font-black uppercase text-[10px] tracking-widest">
              No active tickets found in the selected grid sector.
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span
                    className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${ticket.issue_type === "Leakage" || ticket.issue_type === "Gas Leakage" ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                  >
                    {ticket.issue_type}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
                    {new Date(ticket.created_at).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <h3 className="text-xl font-black text-neutral-900 mb-6 tracking-tight leading-tight">
                  {ticket.description}
                </h3>

                <div className="space-y-3 mb-8 bg-neutral-50 p-5 rounded-3xl border border-neutral-100/50">
                  <div className="flex items-center gap-3 text-sm font-bold text-neutral-700">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                      <Phone size={14} />
                    </div>
                    {ticket.phone}{" "}
                    <span className="text-neutral-300 font-medium">|</span>{" "}
                    {ticket.name}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-neutral-500">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-neutral-400">
                      <MapPin size={14} />
                    </div>
                    {ticket.village}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-neutral-50 mt-auto">
                <div
                  className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.1em] ${ticket.status === "pending" ? "text-amber-500" : "text-emerald-500"}`}
                >
                  {ticket.status === "pending" ? (
                    <Clock size={14} />
                  ) : (
                    <CheckCircle size={14} />
                  )}{" "}
                  {ticket.status}
                </div>
                {ticket.status === "pending" && (
                  <button
                    onClick={() => updateStatus(ticket.id, "resolved")}
                    className="bg-neutral-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary active:scale-95 transition-all shadow-xl shadow-neutral-200"
                  >
                    Resolve Issue
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
