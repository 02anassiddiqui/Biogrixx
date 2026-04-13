import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { 
  Search, 
  IndianRupee, 
  Calendar, 
  ArrowDownLeft, 
  Loader2, 
  User,
  Filter
} from "lucide-react";

export default function PaymentLedger() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/payments/ledger");
      if (res.success) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error("Ledger fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  // Filter by Kisan Name or Transaction ID
  const filteredTxns = transactions.filter((t) =>
    t.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalReceived = transactions.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* --- 💰 REVENUE HEADER --- */}
      <div className="px-8 mb-10">
        <div className="bg-neutral-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-xl shadow-neutral-200">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Transaction Ledger</h1>
            <p className="text-neutral-400 font-medium">Official record of all gas utility collections</p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Total Collection</div>
            <div className="text-5xl font-black text-white flex items-center gap-2">
              <span className="text-2xl text-neutral-500">₹</span>
              {totalReceived.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* --- 🔍 FILTERS --- */}
      <div className="px-8 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
          <input
            type="text"
            placeholder="Search Kisan or Transaction ID..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-all shadow-sm">
          <Filter size={14} /> Filter by Date
        </button>
      </div>

      {/* --- 📑 THE LOG BOOK TABLE --- */}
      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 text-neutral-400 text-[10px] font-black uppercase tracking-widest border-b border-neutral-50">
                <th className="px-8 py-6">Reference & Date</th>
                <th className="px-8 py-6">Kisan Detail</th>
                <th className="px-8 py-6">Bill Link</th>
                <th className="px-8 py-6">Method</th>
                <th className="px-8 py-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
              ) : (
                filteredTxns.map((txn) => (
                  <tr key={txn.id} className="group hover:bg-neutral-50/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ArrowDownLeft size={20} />
                        </div>
                        <div>
                          <div className="font-black text-neutral-900 text-xs">#{txn.id.slice(0, 8).toUpperCase()}</div>
                          <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                            {new Date(txn.paid_at).toLocaleDateString()} • {new Date(txn.paid_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-neutral-900">{txn.customers?.name}</div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase">{txn.customers?.villages?.name || "Main Hub"}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[10px] font-black text-neutral-400 border border-neutral-100 px-2 py-1 rounded w-fit">
                        BILL: #{txn.bill_id.slice(0, 5).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {txn.payment_method}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-xl font-black text-emerald-600">+ ₹{txn.amount_paid?.toLocaleString("en-IN")}</div>
                      {txn.transaction_id && (
                        <div className="text-[8px] text-neutral-300 font-bold uppercase">{txn.transaction_id}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && filteredTxns.length === 0 && (
            <div className="py-32 text-center">
              <IndianRupee className="mx-auto text-neutral-100 mb-4" size={48} />
              <p className="text-neutral-400 font-bold italic text-sm">No transaction records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}