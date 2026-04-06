import { useState, useEffect } from "react";
import autoTable from "jspdf-autotable";
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
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  doc.text(`Meter S/N: ${bill.meters?.serial_number}`, 120, 52);
  doc.text(`Status: ${bill.status.toUpperCase()}`, 120, 58);

  autoTable(doc, {
    startY: 75,
    head: [["Description", "Qty", "Rate", "Amount"]],
    body: [
      [
        "Biogas Consumption (m3)",
        bill.consumption,
        `${bill.rate_per_unit}/m3`,
        `INR ${bill.sub_total}`,
      ],
      [
        "GST Tax Amount",
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
  doc.setTextColor(0);
  doc.text(`GRAND TOTAL:`, 130, finalY);
  doc.text(`INR ${bill.total_amount?.toFixed(2)}`, 196, finalY, {
    align: "right",
  });

  doc.setLineWidth(0.5);
  doc.line(130, finalY + 2, 196, finalY + 2);

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for choosing green energy with Biogrix!", 14, 280);

  doc.save(`Invoice_${bill.customers?.name}_${bill.id.slice(0, 5)}.pdf`);
};

export default function BillingModule() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/billing`, {
        headers: {
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
      });
      const result = await res.json();
      if (result.success) setBills(result.data);
    } catch (err) {
      console.error("Billing fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ✅ UPDATED: Now calls the /payments POST route
  const handleMarkAsPaid = async (bill) => {
    if (!window.confirm("Bhai, kya payment mil gayi hai?")) return;

    setUpdatingId(bill.id);

    try {
      const paymentData = {
        bill_id: bill.id,
        customer_id: bill.customer_id,
        amount_paid: bill.total_amount,
        payment_method: "Cash", // Default method
        transaction_id: `CASH-${Date.now()}`, // Generating a unique reference
      };

      const res = await fetch(`${API_BASE_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
        },
        body: JSON.stringify(paymentData),
      });

      const result = await res.json();

      if (result.success) {
        // Update state locally
        setBills(
          bills.map((b) =>
            b.id === bill.id
              ? { ...b, status: "paid", paid_at: new Date() }
              : b,
          ),
        );
      } else {
        alert("Galti: " + result.message);
      }
    } catch (err) {
      console.error("Payment Processing Error:", err);
      alert("Server sync failed!");
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

  const totalCollected = bills
    .filter((b) => b.status === "paid")
    .reduce((acc, curr) => acc + curr.total_amount, 0);
  const totalPending = bills
    .filter((b) => b.status === "unpaid")
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mb-10">
        <StatCard
          icon={<IndianRupee />}
          label="Total Collected"
          value={totalCollected}
          color="primary"
        />
        <StatCard
          icon={<Clock />}
          label="Outstanding Dues"
          value={totalPending}
          color="amber"
        />
        <StatCard
          icon={<ArrowUpRight />}
          label="Recovery Rate"
          value={
            (
              (totalCollected / (totalCollected + totalPending || 1)) *
              100
            ).toFixed(1) + "%"
          }
          color="dark"
        />
      </div>

      {/* SEARCH & FILTERS */}
      <div className="px-8 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Kisan..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-medium text-sm"
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

      {/* BILLS TABLE */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-widest border-b border-neutral-50">
                <th className="px-8 py-6">Bill Info</th>
                <th className="px-8 py-6">Consumption</th>
                <th className="px-8 py-6">Total Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Action</th>
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
                filteredBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="group hover:bg-neutral-50/50 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="font-black text-neutral-900">
                        {bill.customers?.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase">
                        {bill.customers?.villages?.name}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-neutral-700">
                        {bill.consumption} m³
                      </div>
                      <div className="text-[10px] text-neutral-400 italic">
                        ₹{bill.rate_per_unit}/m³
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
                            onClick={() => handleMarkAsPaid(bill)} // ✅ Now passing the whole bill object
                            disabled={updatingId === bill.id}
                            className="bg-neutral-900 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-primary transition-all active:scale-95"
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
    dark: "bg-primary text-white",
  };
  return (
    <div
      className={`p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm ${color === "dark" ? "bg-neutral-900 text-white" : "bg-white"}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorStyles[color]}`}
      >
        {icon}
      </div>
      <div
        className={`text-3xl font-black ${color === "dark" ? "text-primary" : "text-neutral-900"}`}
      >
        {typeof value === "number"
          ? `₹${value.toLocaleString("en-IN")}`
          : value}
      </div>
      <div className="text-[10px] font-bold text-neutral-400 uppercase mt-1">
        {label}
      </div>
    </div>
  );
}
