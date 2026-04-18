// frontend/pages/payments.js
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import toast from "react-hot-toast";
import {
  Search,
  IndianRupee,
  Calendar,
  ArrowDownLeft,
  Loader2,
  User,
  Filter,
  RefreshCw,
} from "lucide-react";

// 🚀 Step 1: Reusable Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-xl ${className}`} />
);

export default function PaymentLedger({ syncTrigger }) {
  // 🚀 Step 2: Receive syncTrigger
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/payments/ledger");
      if (res.success) {
        setTransactions(res.data);
      } else {
        toast.error("Failed to synchronize transaction ledger.");
      }
    } catch (err) {
      toast.error("Network error: Finance grid offline.");
      console.error("Ledger fetch failed:", err);
    } finally {
      // 🚀 Step 3: Smooth transition delay for skeletons
      setTimeout(() => setLoading(false), 500);
    }
  };

  // 🚀 Step 4: Hook into universal Sync Grid from Parent
  useEffect(() => {
    fetchLedger();
  }, [syncTrigger]);

  const filteredTxns = transactions.filter(
    (t) =>
      t.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalReceived = transactions.reduce(
    (acc, curr) => acc + (curr.amount_paid || 0),
    0,
  );

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* --- 💰 REVENUE HEADER --- */}
      <div className="px-8 mb-10">
        <div className="bg-neutral-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-xl shadow-neutral-200 border border-white/5">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
              Transaction Ledger
            </h1>
            <p className="text-neutral-400 font-medium">
              Official record of all gas utility collections
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
              Total Collection
            </div>
            <div className="text-5xl font-black text-white flex items-center gap-2 tracking-tighter">
              <span className="text-2xl text-neutral-500 font-bold">₹</span>
              {loading ? (
                <Skeleton className="h-12 w-40 bg-white/10" />
              ) : (
                totalReceived.toLocaleString("en-IN")
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- 🔍 FILTERS --- */}
      <div className="px-8 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Kisan or Transaction ID..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => toast.success("Filter parameters updated.")}
          className="flex items-center gap-2 px-8 py-4 bg-white border border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-all shadow-sm active:scale-95"
        >
          <Filter size={14} /> Filter by Date
        </button>
      </div>

      {/* --- 📑 THE LOG BOOK TABLE --- */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-100">
                <th className="px-8 py-6">Reference & Date</th>
                <th className="px-8 py-6">Consumer Detail</th>
                <th className="px-8 py-6">Grid Link</th>
                <th className="px-8 py-6">Method</th>
                <th className="px-8 py-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading
                ? // 🚀 Skeleton Table Rows
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-10 h-10 rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-7 w-20 rounded-lg" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-7 w-16 rounded-lg" />
                      </td>
                      <td className="px-8 py-6 text-right space-y-2">
                        <Skeleton className="h-5 w-24 ml-auto" />
                        <Skeleton className="h-3 w-12 ml-auto" />
                      </td>
                    </tr>
                  ))
                : filteredTxns.map((txn) => (
                    <tr
                      key={txn.id}
                      className="group hover:bg-neutral-50/30 transition-all font-bold"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <ArrowDownLeft size={20} />
                          </div>
                          <div>
                            <div className="font-black text-neutral-900 text-xs uppercase tracking-widest">
                              #{txn.id.slice(0, 8)}
                            </div>
                            <div className="text-[9px] text-neutral-400 font-black uppercase tracking-tighter mt-1">
                              {new Date(txn.paid_at).toLocaleDateString(
                                "en-GB",
                              )}{" "}
                              •{" "}
                              {new Date(txn.paid_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-neutral-900 text-sm">
                          {txn.customers?.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                          {txn.customers?.villages?.name || "Main Node"}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[9px] font-black text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10 w-fit uppercase tracking-widest">
                          INV: #{txn.bill_id.slice(0, 5)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          {txn.payment_method}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="text-xl font-black text-emerald-600 tracking-tighter">
                          + ₹{txn.amount_paid?.toLocaleString("en-IN")}
                        </div>
                        {txn.transaction_id && (
                          <div className="text-[8px] text-neutral-300 font-black uppercase tracking-[0.1em] mt-1">
                            {txn.transaction_id}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!loading && filteredTxns.length === 0 && (
            <div className="py-32 text-center">
              <IndianRupee
                className="mx-auto text-neutral-100 mb-4"
                size={48}
              />
              <p className="text-neutral-400 font-black uppercase text-[10px] tracking-widest">
                No transaction records found in grid history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
