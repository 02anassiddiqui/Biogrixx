'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Zap, Leaf, TrendingUp, Info, ArrowRight,
  Database, CheckCircle2, XCircle, Wallet, Clock, Droplets
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function BiogasCalculator() {
  const [cows, setCows] = useState(10);
  const [households, setHouseholds] = useState(5);

  // --- 🔒 LOGIC: STRICTLY UNCHANGED ---
  const DUNG_PER_COW = 10;
  const GAS_YIELD = 0.04;
  const LPG_EQUIVALENT = 21;
  const HH_DEMAND = 0.4;
  const TEMP_FACTOR = 0.9;
  const LOSS_FACTOR = 0.9;
  const SAFETY_FACTOR = 0.9;
  const COST_PER_M3 = 22000;

  const totalDung = cows * DUNG_PER_COW;
  const rawGas = totalDung * GAS_YIELD;
  const usableGas = rawGas * TEMP_FACTOR * LOSS_FACTOR * SAFETY_FACTOR;
  const demand = households * HH_DEMAND;
  const feasible = usableGas >= demand;
  const surplus = usableGas - demand;
  const plantSize = Math.ceil(usableGas);
  const cylindersSaved = (usableGas * 30) / LPG_EQUIVALENT;
  const monthlySavings = Math.round(cylindersSaved * 1100);
  const cookingHours = (usableGas * 2.2) / households;
  const waterRequired = totalDung;
  const plantCost = plantSize * COST_PER_M3;
  const yearlySavings = monthlySavings * 12;
  const payback = yearlySavings > 0 ? (plantCost / yearlySavings).toFixed(1) : 'N/A';

  return (
    <div className="max-w-6xl mx-auto font-sans p-4 md:p-0 py-3 md:py-6">
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* --- LEFT PANEL (Input + Status + CTA) --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Input Section */}
          <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Database size={20} />
              </div>
              <h3 className="font-black tracking-tight text-xl">Input Node</h3>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Houses Served</label>
                <div className="grid grid-cols-2 gap-3">
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => setHouseholds(num)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border-2 ${
                        households === num 
                        ? 'bg-gradient-to-r from-primary to-emerald-600 border-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-neutral-800 border-transparent text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {num} Households
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Total Animals</label>
                  <span className="text-3xl font-black text-primary ">
                    {cows}<span className="text-sm not- ml-1 text-neutral-500 font-bold uppercase">Heads</span>
                  </span>
                </div>
                <input 
                  type="range" min="1" max="100" value={cows}
                  onChange={(e) => setCows(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* 2. Feasibility Indicator */}
          <div className={`p-6 rounded-[2rem] border-2 flex items-center gap-4 ${
            feasible ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
          }`}>
            {feasible ? <CheckCircle2 className="text-primary" /> : <XCircle className="text-red-500" />}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${feasible ? 'text-emerald-700' : 'text-red-700'}`}>
                {feasible ? 'Feasibility: High' : 'Feasibility: Low'}
              </p>
              <p className="text-[11px] text-neutral-500 font-medium ">
                {feasible ? 'Supply meets community demand.' : 'Need more livestock for this grid.'}
              </p>
            </div>
          </div>

          {/* 🚀 NEW PLACEMENT: CTA Bar (Under Indicator) */}
          <div className="bg-white rounded-[2.5rem] p-8 flex flex-col gap-6">
            {/* <div>
              <p className="text-sm font-black  uppercase tracking-tight">Technical Audit</p>
              <p className="text-[11px] text-neutral-500 font-medium leading-tight mt-1">Request a professional site survey for your village grid.</p>
            </div> */}
            <Button variant="primary" className="w-full rounded-full h-14 group bg-gradient-to-r from-primary to-emerald-600">
              Get Full Report <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </div>

        </div>


        {/* --- RIGHT PANEL (Dashboard Outputs) --- */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card className="md:col-span-2 p-10  bg-gradient-to-r from-primary to-emerald-600 border-none shadow-2xl shadow-neutral-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Zap size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white/70 font-black uppercase tracking-widest text-[10px] mb-4">
                <Zap size={14} fill="currentColor" /> Infrastructure Recommendation
              </div>
              <h4 className="text-sm font-bold text-white/70 mb-2 uppercase">Suggested Plant Capacity</h4>
              <div className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-6 ">
                {plantSize}<span className="text-2xl font-bold ml-2 text-neutral-300 tracking-normal uppercase">m³ Plant</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                 <div className="px-4 py-2 rounded-full bg-neutral-900 text-white">
                   Estimated Capex: ₹{plantCost.toLocaleString()}
                 </div>
              </div>
            </div>
          </Card>

          <Card hover className="p-8 border-none bg-neutral-900 text-white relative overflow-hidden">
            <Flame className="text-primary mb-6" size={32} />
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Cooking Utility</p>
            <h5 className="text-4xl font-black ">{cookingHours.toFixed(1)} <span className="text-lg font-bold text-neutral-600">Hrs/Day</span></h5>
            <p className="mt-4 text-[11px] text-neutral-400 leading-relaxed ">
              Enough methane to support daily kitchen operations for {households} families.
            </p>
          </Card>

          <Card hover className="p-8 border-none bg-gradient-to-r from-primary to-emerald-600">
            <Wallet className="text-white mb-6" size={32} />
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-white/70">Financial Impact</p>
            <h5 className="text-4xl text-white font-black ">₹{monthlySavings.toLocaleString()} <span className="text-lg font-bold text-white/50">/Mo</span></h5>
            <p className="mt-4 text-[11px] text-emerald-50 leading-relaxed font-medium">
              Based on {cylindersSaved.toFixed(1)} LPG cylinders saved across the grid.
            </p>
          </Card>

          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-neutral-900 rounded-[1.5rem] border border-neutral-100">
            <ResourceInfo label="Daily Dung" value={`${totalDung}kg`} icon={<Database size={14} />} />
            <ResourceInfo label="Daily Water" value={`${waterRequired}L`} icon={<Droplets size={14} />} />
            <ResourceInfo label="Gas Yield" value={`${usableGas.toFixed(1)}m³`} icon={<Flame size={14} />} />
            <ResourceInfo label="Payback" value={`${payback}Yrs`} icon={<TrendingUp size={14} />} />
          </div>

        </div>
      </div>
    </div>
  );
}

function ResourceInfo({ label, value, icon }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 text-[9px] font-black text-white uppercase tracking-widest mb-1">
        {icon} {label}
      </div>
      <div className="text-xl font-black text-white  tracking-tighter">{value}</div>
    </div>
  );
}