import { useState } from "react";
import { ShieldCheck, Lock, User, Loader2 } from "lucide-react";
import { useRouter } from 'next/router';
// Aapke components import karo
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
export default function AgentLogin() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Fake Delay for Demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/'); 
  };

  return (
    // Section "alt" variant use karke neutral-50 background dega
    <Section alt className="min-h-screen flex items-center justify-center">
      <Container narrow>
        <Card className="bg-white border border-emerald-100 shadow-2xl shadow-emerald-200/50">
          
          {/* Logo Area */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">
              Biogrix <span className="text-primary">Agent</span>
            </h1>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
              Field Operations Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Agent ID / Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="password"
                placeholder="Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                required
              />
            </div>

            {/* Aapka Button Component */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "ACCESS GRID"}
            </Button>
          </form>

          <p className="text-center text-[10px] text-neutral-400 mt-8 font-bold uppercase tracking-wider">
            Authorized Personnel Only <br /> GPS Tracking is Active
          </p>
        </Card>
      </Container>
    </Section>
  );
}