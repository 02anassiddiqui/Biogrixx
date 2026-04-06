import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock, Search, Filter, Loader2, Phone, MapPin } from "lucide-react";

export default function AdminComplaints() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/v1/complaints", {
        headers: { "x-admin-secret": localStorage.getItem("biogrix_admin_key") }
      });
      const result = await res.json();
      if (result.success) setTickets(result.data);
    } finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:4000/v1/complaints/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchTickets();
  };

  useEffect(() => { fetchTickets(); }, []);

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter">Support Grid</h1>
          <p className="text-neutral-400 font-medium mt-2">Manage and resolve consumer grievances</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-neutral-100 shadow-sm">
          {["All", "pending", "resolved"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? "bg-neutral-900 text-white" : "text-neutral-400"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.filter(t => filter === "All" || t.status === filter).map(ticket => (
          <div key={ticket.id} className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${ticket.issue_type === 'Leakage' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-neutral-50 text-neutral-500 border-neutral-100'}`}>
                {ticket.issue_type}
              </span>
              <span className="text-[10px] font-bold text-neutral-300">{new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
            
            <h3 className="text-xl font-black text-neutral-900 mb-2">{ticket.description}</h3>
            
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-600"><Phone size={14}/> {ticket.phone} ( {ticket.name} )</div>
              <div className="flex items-center gap-2 text-sm text-neutral-400"><MapPin size={14}/> {ticket.village}</div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-neutral-50">
              <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${ticket.status === 'pending' ? 'text-amber-500' : 'text-emerald-500'}`}>
                {ticket.status === 'pending' ? <Clock size={14}/> : <CheckCircle size={14}/>} {ticket.status}
              </div>
              {ticket.status === 'pending' && (
                <button onClick={() => updateStatus(ticket.id, 'resolved')} className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary active:scale-95 transition-all">Resolve Issue</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}