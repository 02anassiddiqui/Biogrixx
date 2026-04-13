import {
  Users, Factory, Wallet, Flame, Gauge,
  FileText, Activity, Wrench, AlertCircle,
  BarChart3, LayoutDashboard, LogOut, ChevronRight, UserCheck
} from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: "leads", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "plants", label: "Plants", icon: <Factory size={18} /> },
    { id: "customers", label: "Customers", icon: <UserCheck size={18} /> },
    { id: "meters", label: "Meters", icon: <Gauge size={18} /> },
    { id: "gas-usage", label: "Gas Usage", icon: <Flame size={18} /> },
    { id: "billing", label: "Billing", icon: <FileText size={18} /> },
    { id: "payments", label: "Payments", icon: <Wallet size={18} /> },
    { id: "complaints", label: "Complaints", icon: <AlertCircle size={18} /> },
    // { id: "health", label: "Health", icon: <Activity size={18} /> },
    { id: "maintenance", label: "Maintenance", icon: <Wrench size={18} /> },
    { id: "reports", label: "Reports", icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside className="w-72 bg-neutral-900 text-white flex flex-col sticky top-0 h-screen border-r border-white/5 z-50 shadow-2xl">
      <div className="p-8">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-primary/20">B</div>
          <div className="font-black text-xl tracking-tighter uppercase">Biogrix<span className="text-primary text-xs ml-1 font-bold">HQ</span></div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar pr-2">
          <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em] mb-4 pl-4">Digital Grid</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${activeTab === item.id
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${activeTab === item.id ? "text-white" : "text-emerald-500/60 group-hover:text-primary"}`}>
                  {item.icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout at Bottom */}
      <div className="mt-auto p-8 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl font-black text-[11px] uppercase tracking-widest"
        >
          <LogOut size={16} /> Logout System
        </button>
      </div>
    </aside>
  );
};