import { useState, useEffect } from "react";
import { 
  Search, 
  Gauge, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  AlertCircle,
  LayoutGrid,
  ChevronLeft
} from "lucide-react";

export default function AgentModule() {
  const [activeTab, setActiveTab] = useState("pending"); 
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeter, setSelectedMeter] = useState(null);
  
  const [currentReading, setCurrentReading] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: Ensure this is http://localhost:4000/v1 in your .env
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  // --- 📡 FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ REMOVED: /v1 from strings (since it's in API_BASE_URL)
      const endpoint = activeTab === "pending" ? "/meters/pending" : "/meters";
      
      // ✅ REMOVED: Authentication headers to fix 401 error
      const res = await fetch(`${API_BASE_URL}${endpoint}`); 
      
      const result = await res.json();
      if (result.success) {
        const data = activeTab === "all" ? result.data.filter(m => m.status === 'active') : result.data;
        setMeters(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // --- 🚀 SUBMIT READING ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentReading) return alert("Bhai, reading toh dalo!");
    
    setIsSubmitting(true);
    try {
      // ✅ REMOVED: /v1 prefix
      const response = await fetch(`${API_BASE_URL}/gas-usage/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ✅ REMOVED: Admin secret header
        },
        body: JSON.stringify({
          meter_id: selectedMeter.id,
          current_reading: parseFloat(currentReading)
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Success: Reading recorded!");
        setSelectedMeter(null);
        setCurrentReading("");
        fetchData(); 
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (err) {
        alert("Server connection failed!");
    } finally { setIsSubmitting(false); }
  };

  const filtered = meters.filter(m => 
    m.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 pb-24 min-h-screen bg-neutral-50/30">
      
      {/* 1. HEADER & NAVIGATION */}
      {!selectedMeter && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-neutral-900">Biogrix Agent</h2>
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20">BA</div>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-neutral-100 shadow-sm">
            <button 
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400'}`}
            >
              <Clock size={14} /> Pending
            </button>
            <button 
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'all' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400'}`}
            >
              <LayoutGrid size={14} /> All Meters
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
            <input 
              type="text" 
              placeholder="Search Kisan..." 
              className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 2. METER LIST VIEW */}
      {!selectedMeter ? (
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <CheckCircle2 size={40} className="mx-auto text-emerald-400 opacity-20" />
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Everything is up-to-date!</p>
            </div>
          ) : (
            filtered.map(meter => (
              <div 
                key={meter.id} 
                onClick={() => setSelectedMeter(meter)}
                className="bg-white p-5 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'pending' ? 'bg-red-50 text-red-500' : 'bg-primary/5 text-primary'}`}>
                    <Gauge size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-neutral-800">{meter.customers?.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">{meter.serial_number}</span>
                      {activeTab === 'pending' && <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black uppercase">DUE</span>}
                    </div>
                  </div>
                </div>
                <ArrowRight size={18} className="text-neutral-200 group-hover:text-primary transition-colors" />
              </div>
            ))
          )}
        </div>
      ) : (
        /* 3. READING FORM VIEW */
        <div className="animate-in slide-in-from-bottom-10 duration-300">
          <button onClick={() => setSelectedMeter(null)} className="mb-6 flex items-center gap-2 text-xs font-black uppercase text-neutral-400 hover:text-primary transition-colors">
            <ChevronLeft size={16} /> Cancel Reading
          </button>
          
          <div className="bg-neutral-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] font-black text-primary uppercase mb-1 tracking-widest">Kisan Detail</p>
                <h3 className="text-2xl font-black leading-tight">{selectedMeter.customers?.name}</h3>
                <p className="text-xs text-neutral-500 font-bold mt-1">{selectedMeter.serial_number} • {selectedMeter.plants?.name}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-right">
                <p className="text-[8px] font-black uppercase text-neutral-500 mb-1">Last Reading</p>
                <p className="text-xl font-black text-primary tracking-tighter">{selectedMeter.last_reading || "0.00"}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-500 ml-1 tracking-widest">Enter New Reading</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="00.00"
                    autoFocus
                    className="w-full p-8 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-primary/20 font-black text-4xl text-center text-primary placeholder:text-neutral-800"
                    value={currentReading}
                    onChange={(e) => setCurrentReading(e.target.value)}
                  />
                  {currentReading && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-2xl border border-primary/20 text-center animate-in zoom-in">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">Total Consumption</p>
                      <p className="text-2xl font-black text-white">
                        {(parseFloat(currentReading) - (selectedMeter.last_reading || 0)).toFixed(2)} 
                        <span className="text-xs text-neutral-500 ml-1 font-bold">UNITS</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-neutral-400 font-bold leading-relaxed">
                  Make sure to double-check the meter number before submitting. Consumption will be billed automatically.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !currentReading}
                className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                SAVE & SYNC READING
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}