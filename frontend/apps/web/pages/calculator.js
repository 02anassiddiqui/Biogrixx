'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Zap, 
  Leaf, 
  TrendingUp, 
  Info, 
  ArrowRight,
  Database
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function BiogasCalculator() {
  const [weight, setWeight] = useState(50);
  const [feedstock, setFeedstock] = useState('poultry');
  
  // Professional Yield Data (m3 of biogas per kg of fresh matter)
  const yields = {
    food: 0.18,    // High energy content
    cow: 0.04,     // High volume, lower concentration
    poultry: 0.09, // Highly efficient
    pig: 0.06      // Moderate yield
  };

  const biogas = (weight * yields[feedstock]).toFixed(2);
  const electricity = (biogas * 2.1).toFixed(1); // 1m3 ~ 2.1 kWh
  const fertilizer = (weight * 0.9).toFixed(1); // 90% becomes digestate

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* --- INPUT PANEL (4 Columns) --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Database size={20} />
              </div>
              <h3 className="font-black tracking-tight text-xl">Input Parameters</h3>
            </div>

            <div className="space-y-10">
              {/* Feedstock Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Substrate Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(yields).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFeedstock(type)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold capitalize transition-all border-2 ${
                        feedstock === type 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-neutral-800 border-transparent text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {type} Waste
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Daily Volume</label>
                  <span className="text-3xl font-black text-primary italic">{weight}<span className="text-sm not-italic ml-1 text-neutral-500 font-bold uppercase">kg</span></span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="1000" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-bold text-neutral-600 uppercase">
                  <span>1kg</span>
                  <span>1,000kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100 flex gap-4">
            <Info className="text-primary shrink-0" size={20} />
            <p className="text-xs text-neutral-500 leading-relaxed italic">
              Estimates are based on 15% Total Solids (TS) content. Actual yields may vary by temperature.
            </p>
          </div>
        </div>

        {/* --- OUTPUT DASHBOARD (8 Columns) --- */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Stat Card: Biogas */}
          <Card className="md:col-span-2 p-10 bg-white border-none shadow-2xl shadow-neutral-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Flame size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-4">
                <Flame size={14} /> Energy Production
              </div>
              <h4 className="text-sm font-bold text-neutral-400 mb-2">Estimated Daily Biogas</h4>
              <div className="text-7xl md:text-8xl font-black text-neutral-900 tracking-tighter mb-6">
                {biogas}<span className="text-2xl font-bold ml-2 text-neutral-300 tracking-normal">m³/day</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-primary text-xs font-bold flex items-center gap-2">
                  <TrendingUp size={14} /> Efficiency: {yields[feedstock] * 100}% Yield Rate
                </div>
              </div>
            </div>
          </Card>

          {/* Secondary Stats */}
          <Card hover className="p-8 border-none bg-neutral-900 text-white relative overflow-hidden">
            <Zap className="text-primary mb-6" size={32} />
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Electrical Equivalence</p>
            <h5 className="text-4xl font-black">{electricity} <span className="text-lg font-bold text-neutral-600">kWh</span></h5>
            <p className="mt-4 text-[11px] text-neutral-400 leading-relaxed">
              Enough to power {Math.floor(electricity / 0.5)} typical household LED bulbs for 24 hours.
            </p>
          </Card>

          <Card hover className="p-8 border-none bg-primary">
            <Leaf className="text-primary mb-6" size={32} />
            <p className="text-[10px] font-bold  uppercase tracking-widest mb-2 text-white/70">Organic Byproduct</p>
            <h5 className="text-4xl font-black">{fertilizer} <span className="text-lg font-bold  text-white/50">kg</span></h5>
            <p className="mt-4 text-[11px] text-emerald-50 leading-relaxed">
              High-quality bio-slurry fertilizer produced daily for agricultural application.
            </p>
          </Card>

          <div className="md:col-span-2 flex items-center justify-between p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100">
            <div>
              <p className="text-lg font-bold text-neutral-900">Ready for a full audit?</p>
              <p className="text-sm text-neutral-500">Get a detailed engineering report for your specific plant location.</p>
            </div>
            <Button variant="primary" className="rounded-full px-8 group">
              Get Report <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}