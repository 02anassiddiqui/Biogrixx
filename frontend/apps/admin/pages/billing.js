// frontend/pages/billing.js
import { useState, useEffect } from "react";
import autoTable from "jspdf-autotable";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Loader2,
  IndianRupee,
  ArrowUpRight,
  TrendingDown,
  XCircle,
  Download,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import jsPDF from "jspdf";

// 🚀 REUSABLE SKELETON COMPONENT
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200 rounded-2xl ${className}`} />
);

// --- 📄 PDF GENERATION FUNCTION ---
const generateInvoice = (bill) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setTextColor(16, 185, 129);
  doc.text("BIOGRIX", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Biogas Utility Management System", 14, 26);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);
  doc.text(`Invoice #: ${bill.id.slice(0, 8).toUpperCase()}`, 150, 26);
  doc.line(14, 32, 196, 32);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 14, 45);
  doc.setFont("helvetica", "normal");
  doc.text(`Kisan: ${bill.customers?.name}`, 14, 52);
  doc.text(`Village: ${bill.customers?.villages?.name || "N/A"}`, 14, 58);
  doc.text(`Phone: ${bill.customers?.phone}`, 14, 64);

  doc.text("HARDWARE:", 120, 45);
  doc.text(`Meter S/N: ${bill.meters?.serial_number || "N/A"}`, 120, 52);
  doc.text(`Status: ${bill.status.toUpperCase()}`, 120, 58);

  autoTable(doc, {
    startY: 75,
    head: [["Description", "Qty", "Rate", "Total"]],
    body: [
      [
        "Biogas Consumption (m3)",
        `${bill.consumption} m3`,
        `INR ${bill.rate_per_unit}`,
        `INR ${bill.sub_total}`,
      ],
      [
        "Taxes & GST",
        "-",
        `${bill.tax_rate}%`,
        `INR ${bill.tax_amount?.toFixed(2)}`,
      ],
    ],
    headStyles: { fillColor: [16, 185, 129] },
  });

  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`GRAND TOTAL:`, 130, finalY);
  doc.text(`INR ${bill.total_amount?.toFixed(2)}`, 196, finalY, {
    align: "right",
  });

  doc.save(`Invoice_${bill.customers?.name}_${bill.id.slice(0, 5)}.pdf`);
  toast.success("Invoice downloaded successfully!");
};

export default function BillingModule() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/billing");
      if (res.success) setBills(res.data);
    } catch (err) {
      toast.error("Failed to load billing records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const confirmPayment = (billId) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-in fade-in zoom-in-95" : "animate-out fade-out zoom-out-95"} max-w-sm w-full bg-neutral-900 border border-white/10 shadow-2xl rounded-[2rem] p-6 backdrop-blur-xl flex flex-col`}
        >
          <div className="flex items-start gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 shrink-0">
              <IndianRupee size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-lg tracking-tight uppercase">
                Confirm Payment
              </h3>
              <p className="text-neutral-400 text-[11px] font-medium leading-relaxed mt-1">
                Mark this invoice as paid? This will update the system-wide
                revenue grid.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleMarkAsPaid(billId);
              }}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
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

  const handleMarkAsPaid = async (billId) => {
    setUpdatingId(billId);
    const processingToast = toast.loading("Updating records...");
    try {
      const res = await apiRequest(`/billing/${billId}/status`, {
        method: "PATCH",
        body: { status: "paid" },
      });
      if (res.success) {
        toast.success("Payment recorded!", { id: processingToast });
        setBills(
          bills.map((b) =>
            b.id === billId ? { ...b, status: "paid", paid_at: new Date() } : b,
          ),
        );
      } else {
        toast.error(res.message || "Sync error.", { id: processingToast });
      }
    } catch (err) {
      toast.error("Server failure.", { id: processingToast });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBills = bills.filter((b) => {
    const matchesSearch = b.customers?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || b.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    collected: bills
      .filter((b) => b.status === "paid")
      .reduce((acc, curr) => acc + curr.total_amount, 0),
    pending: bills
      .filter((b) => b.status === "unpaid")
      .reduce((acc, curr) => acc + curr.total_amount, 0),
  };

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* 🚀 STATS SECTION WITH SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mb-10">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-8 rounded-[2.5rem] bg-white border border-neutral-100 space-y-4"
            >
              <Skeleton className="w-12 h-12" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              icon={<IndianRupee />}
              label="Total Revenue"
              value={stats.collected}
              color="primary"
            />
            <StatCard
              icon={<Clock />}
              label="Pending Payments"
              value={stats.pending}
              color="amber"
            />
            <StatCard
              icon={<ArrowUpRight />}
              label="Collection Efficiency"
              value={
                (
                  (stats.collected / (stats.collected + stats.pending || 1)) *
                  100
                ).toFixed(1) + "%"
              }
              color="dark"
            />
          </>
        )}
      </div>

      {/* SEARCH, FILTERS & SYNC GRID */}
      <div className="px-8 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search customer name..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-neutral-100 shadow-sm">
            {["All", "Unpaid", "Paid"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === tab ? "bg-neutral-900 text-white shadow-md" : "text-neutral-400"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 🚀 SYNC GRID BUTTON */}
        <button
          onClick={fetchBills}
          className="flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl shadow-neutral-200"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Sync
          Grid
        </button>
      </div>

      {/* BILLS TABLE WITH SKELETON ROWS */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-50">
                <th className="px-8 py-6">Customer Details</th>
                <th className="px-8 py-6">Usage Summary</th>
                <th className="px-8 py-6">Net Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-6 w-20" />
                    </td>
                    <td className="px-8 py-6">
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredBills.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-20 text-center font-black text-neutral-300 uppercase text-xs tracking-widest"
                  >
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="group hover:bg-neutral-50/40 transition-all font-bold"
                  >
                    <td className="px-8 py-6">
                      <div className="font-black text-neutral-900 text-sm">
                        {bill.customers?.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                        {bill.customers?.villages?.name || "No Village"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-neutral-700">
                        {bill.consumption} m³
                      </div>
                      <div className="text-[10px] text-neutral-400 italic">
                        Rate: ₹{bill.rate_per_unit}/m³
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-neutral-900">
                      ₹{bill.total_amount?.toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${bill.status === "paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => generateInvoice(bill)}
                          className="p-2.5 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          title="Download Receipt"
                        >
                          <Download size={18} />
                        </button>
                        {bill.status === "unpaid" && (
                          <button
                            onClick={() => confirmPayment(bill.id)}
                            disabled={updatingId === bill.id}
                            className="bg-neutral-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-primary transition-all active:scale-95"
                          >
                            {updatingId === bill.id ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (
                              "Mark Paid"
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-50 text-amber-600",
    dark: "bg-primary text-white shadow-lg shadow-primary/20",
  };
  return (
    <div
      className={`p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm transition-all hover:shadow-md ${color === "dark" ? "bg-neutral-900 text-white" : "bg-white"}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorStyles[color]} shadow-inner`}
      >
        {icon}
      </div>
      <div
        className={`text-4xl font-black ${color === "dark" ? "text-primary" : "text-neutral-900"} tracking-tighter`}
      >
        {typeof value === "number"
          ? `₹${value.toLocaleString("en-IN")}`
          : value}
      </div>
      <div className="text-[9px] font-black text-neutral-400 uppercase mt-1 tracking-widest">
        {label}
      </div>
    </div>
  );
}
