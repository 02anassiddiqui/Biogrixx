import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { 
  Search, 
  Gauge, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  AlertCircle,
  LayoutGrid,
  ChevronLeft,
  Camera, 
  Send,   
  MapPin,
  Activity
} from "lucide-react";

export default function AgentModule() {
  const [activeTab, setActiveTab] = useState("pending"); 
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeter, setSelectedMeter] = useState(null);
  
  const [currentReading, setCurrentReading] = useState("");
  const [image, setImage] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "pending" ? "/meters/pending" : "/meters";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentReading) return alert("Bhai, reading toh dalo!");
    if (!image) return alert("Bhai, photo kheenchna zaroori hai (Evidence)!");
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gas-usage/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meter_id: selectedMeter.id,
          current_reading: parseFloat(currentReading),
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Success: Reading & Photo Synchronized!");
        setSelectedMeter(null);
        setCurrentReading("");
        setImage(null);
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
    <div className="max-w-md mx-auto h-screen flex flex-col bg-neutral-50/30 overflow-hidden font-sans">
      
      <style jsx global>{`
        .primary-scrollbar::-webkit-scrollbar { width: 4px; }
        .primary-scrollbar::-webkit-scrollbar-thumb { background: #16a34a; border-radius: 20px; }
      `}</style>
      
      {/* 1. FIXED HEADER */}
      {!selectedMeter && (
        <div className="p-6 space-y-6 shrink-0 bg-neutral-50/30 z-10 border-b border-neutral-100/50">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tighter"><span className="uppercase">Biogrix</span ><span className='text-primary'>.</span><span className="ml-4 text-primary">Agent</span></h2>
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20">BA</div>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-neutral-100 shadow-sm">
            <button onClick={() => setActiveTab("pending")} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400'}`}>
              <Clock size={14} /> Pending
            </button>
            <button onClick={() => setActiveTab("all")} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'all' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400'}`}>
              <LayoutGrid size={14} /> All Meters
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
            <input type="text" placeholder="Search Kisan..." className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-bold text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      )}

      {/* 2. SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-6 primary-scrollbar">
        {!selectedMeter ? (
          /* --- METER LIST --- */
          <div className="space-y-4 py-4">
            {loading ? (
              <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <CheckCircle2 size={40} className="mx-auto text-emerald-400 opacity-20" />
                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Everything is up-to-date!</p>
              </div>
            ) : (
              filtered.map(meter => (
                <div key={meter.id} onClick={() => setSelectedMeter(meter)} className="bg-white p-5 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'pending' ? 'bg-red-50 text-red-500' : 'bg-primary/5 text-primary'}`}><Gauge size={24} /></div>
                    <div>
                      <h4 className="font-black text-neutral-800 text-sm">{meter.customers?.name}</h4>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">{meter.serial_number}</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-neutral-200 group-hover:text-primary transition-colors" />
                </div>
              ))
            )}
            <div className="h-20" />
          </div>
        ) : (
          /* --- READING ENTRY FORM --- */
          <div className="animate-in slide-in-from-bottom-10 duration-300 py-6">
            <button onClick={() => {setSelectedMeter(null); setImage(null);}} className="mb-6 flex items-center gap-2 text-xs font-black uppercase text-neutral-400 hover:text-primary transition-colors">
              <ChevronLeft size={16} /> Back to List
            </button>
            
            <div className="bg-neutral-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden mb-10 border border-neutral-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase mb-1 tracking-widest">Active Meter</p>
                  <h3 className="text-2xl font-black leading-tight tracking-tight">{selectedMeter.customers?.name}</h3>
                  <div className="flex flex-col gap-1 mt-2">
                     <p className="text-[10px] text-neutral-400 font-black flex items-center gap-1 uppercase"><MapPin size={10} /> {selectedMeter.serial_number}</p>
                     <p className="text-[10px] text-emerald-500 font-black flex items-center gap-1 uppercase"><Activity size={10} /> Grid Link Active</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-right">
                  <p className="text-[8px] font-black uppercase text-neutral-500 mb-1">Previous</p>
                  <p className="text-xl font-black text-primary tracking-tighter">{selectedMeter.last_reading || "0.00"}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                
                {/* PHOTO PROOF SECTION */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-neutral-500 ml-1 tracking-widest">Evidence / Photo Proof</label>
                  <input type="file" accept="image/*" capture="environment" className="hidden" id="meter-photo-agent" onChange={(e) => setImage(e.target.files[0])} />
                  <label htmlFor="meter-photo-agent" className="block cursor-pointer">
                    <div className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all ${image ? 'border-primary bg-primary/10' : 'border-neutral-800 bg-white/5 hover:border-primary'}`}>
                      {image ? (
                        <div className="text-center">
                           <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-primary/20"><CheckCircle2 className="text-white" size={32} /></div>
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">Captured: {image.name.slice(0, 10)}...</span>
                        </div>
                      ) : (
                        <>
                          <Camera size={32} className="text-neutral-600 mb-2" />
                          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Tap to Scan Meter Image</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* READING INPUT */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-neutral-500 ml-1 tracking-widest">Enter New Reading (m³)</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.01" placeholder="00.00" autoFocus
                      className="w-full p-8 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-primary/20 font-black text-5xl text-center text-primary placeholder:text-neutral-800"
                      value={currentReading}
                      onChange={(e) => setCurrentReading(e.target.value)}
                    />
                  </div>
                  
                  {/* 🚀 ADDED: TOTAL CONSUMPTION CALCULATION */}
                  {currentReading && (
                    <div className="mt-4 p-5 bg-primary/10 rounded-2xl border border-primary/20 text-center animate-in zoom-in">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">Total Consumption</p>
                      <p className="text-3xl font-black text-white">
                        {(parseFloat(currentReading) - (selectedMeter.last_reading || 0)).toFixed(2)} 
                        <span className="text-xs text-neutral-500 ml-2 font-bold uppercase">Units</span>
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !currentReading}
                  className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  SYNC TO GRID CORE
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}