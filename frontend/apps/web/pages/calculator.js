"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Zap,
  Leaf,
  TrendingUp,
  Info,
  ArrowRight,
  Database,
  CheckCircle2,
  XCircle,
  Wallet,
  Clock,
  Droplets,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import Trans from "../components/ui/Trans"; // 🚀 Import Trans
import { useLanguage } from "../context/LanguageContext";

export default function BiogasCalculator() {
  const [cows, setCows] = useState(0);
  const [households, setHouseholds] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);
  const { lang } = useLanguage();

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
  const cookingHours = households > 0 ? (usableGas * 2.2) / households : 0;
  const waterRequired = totalDung;
  const plantCost = plantSize * COST_PER_M3;
  const yearlySavings = monthlySavings * 12;
  const payback =
    yearlySavings > 0 ? (plantCost / yearlySavings).toFixed(1) : "N/A";

  const handleCalculate = () => {
    if (cows > 0 && households > 0) {
      setIsCalculated(true);
    } else {
      // Bhai, alert ko bhi multilingual hona chahiye (optional improvement)
      alert("Please enter both number of households and livestock.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans p-4 md:p-0 py-3 md:py-6">
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* --- LEFT PANEL (Input Section) --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Database size={20} />
              </div>
              <h3 className="font-black tracking-tight text-xl">
                <Trans>Input Details</Trans>
              </h3>
            </div>

            <div className="space-y-8">
              {/* Household Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  <Trans>Total Households</Trans>
                </label>
                <input
                  type="number"
                  placeholder={lang === "English" ? "e.g. 5" : ""}
                  value={households || ""}
                  onChange={(e) => {
                    setHouseholds(Number(e.target.value));
                    setIsCalculated(false);
                  }}
                  className="w-full bg-neutral-800 border-2 border-transparent focus:border-primary rounded-2xl p-4 text-white font-bold outline-none transition-all"
                />
              </div>

              {/* Livestock Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  <Trans>Total Livestock</Trans>
                </label>
                <input
                  type="number"
                  placeholder={lang === "English" ? "e.g. 10" : ""}
                  value={cows || ""}
                  onChange={(e) => {
                    setCows(Number(e.target.value));
                    setIsCalculated(false);
                  }}
                  className="w-full bg-neutral-800 border-2 border-transparent focus:border-primary rounded-2xl p-4 text-white font-bold outline-none transition-all"
                />
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full rounded-2xl h-14 bg-primary hover:bg-emerald-600 text-white font-black text-base tracking-widest transition-all"
              >
                <Trans>Calculate Results</Trans>
              </Button>
            </div>
          </div>

          {/* Feasibility Indicator */}
          {isCalculated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-[2rem] border-2 flex items-center gap-4 ${
                feasible
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-red-50 border-red-100"
              }`}
            >
              {feasible ? (
                <CheckCircle2 className="text-primary" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              <div>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${feasible ? "text-emerald-700" : "text-red-700"}`}
                >
                  {feasible ? (
                    <Trans>Feasibility: High</Trans>
                  ) : (
                    <Trans>Feasibility: Low</Trans>
                  )}
                </p>
                <p className="text-[11px] text-neutral-500 font-medium ">
                  {feasible ? (
                    <Trans>Supply meets community demand.</Trans>
                  ) : (
                    <Trans>Need more livestock for this grid.</Trans>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* --- RIGHT PANEL (Results) --- */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {isCalculated ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Card className="md:col-span-2 p-10 bg-gradient-to-r from-primary to-emerald-600 border-none shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Zap size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white/70 font-black uppercase tracking-widest text-[10px] mb-4">
                      <Zap size={14} fill="currentColor" />{" "}
                      <Trans>Infrastructure Recommendation</Trans>
                    </div>
                    <h4 className="text-sm font-bold text-white/70 mb-2 uppercase">
                      <Trans>Suggested Plant Capacity</Trans>
                    </h4>
                    <div className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-6 ">
                      {plantSize}
                      <span className="text-2xl font-bold ml-2 text-neutral-300 tracking-normal uppercase">
                        <Trans>m³ Plant</Trans>
                      </span>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-neutral-900 text-white inline-block text-[11px] font-black uppercase tracking-widest">
                      <Trans>Estimated Capex:</Trans> ₹
                      {plantCost.toLocaleString()}
                    </div>
                  </div>
                </Card>

                <Card
                  hover
                  className="p-8 border-none bg-neutral-900 text-white"
                >
                  <Flame className="text-primary mb-6" size={32} />
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                    <Trans>Cooking Utility</Trans>
                  </p>
                  <h5 className="text-4xl font-black ">
                    {cookingHours.toFixed(1)}{" "}
                    <span className="text-lg font-bold text-neutral-600">
                      <Trans>Hrs/Day</Trans>
                    </span>
                  </h5>
                  <p className="mt-4 text-[11px] text-neutral-400 leading-relaxed ">
                    <Trans>
                      Enough methane to support daily kitchen operations for
                    </Trans>{" "}
                    {households} <Trans>families.</Trans>
                  </p>
                </Card>

                <Card
                  hover
                  className="p-8 border-none bg-gradient-to-r from-primary to-emerald-600"
                >
                  <Wallet className="text-white mb-6" size={32} />
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-white/70">
                    <Trans>Financial Impact</Trans>
                  </p>
                  <h5 className="text-4xl text-white font-black ">
                    ₹{monthlySavings.toLocaleString()}{" "}
                    <span className="text-lg font-bold text-white/50">
                      <Trans>/Mo</Trans>
                    </span>
                  </h5>
                  <p className="mt-4 text-[11px] text-emerald-50 leading-relaxed font-medium">
                    <Trans>Based on</Trans> {cylindersSaved.toFixed(1)}{" "}
                    <Trans>LPG cylinders saved across the grid.</Trans>
                  </p>
                </Card>

                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-neutral-900 rounded-[1.5rem] border border-neutral-100">
                  <ResourceInfo
                    label={<Trans>Daily Dung</Trans>}
                    value={`${totalDung}kg`}
                    icon={<Database size={14} />}
                  />
                  <ResourceInfo
                    label={<Trans>Daily Water</Trans>}
                    value={`${waterRequired}L`}
                    icon={<Droplets size={14} />}
                  />
                  <ResourceInfo
                    label={<Trans>Gas Yield</Trans>}
                    value={`${usableGas.toFixed(1)}m³`}
                    icon={<Flame size={14} />}
                  />
                  <ResourceInfo
                    label={<Trans>Payback</Trans>}
                    value={`${payback}Yrs`}
                    icon={<TrendingUp size={14} />}
                  />
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-neutral-50 rounded-[2.5rem] border-2 border-dashed border-neutral-200 p-12">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="text-neutral-400" size={40} />
                </div>
                <h3 className="text-2xl font-black text-neutral-800 mb-2">
                  <Trans>Ready to Calculate</Trans>
                </h3>
                <p className="text-neutral-500 max-w-sm">
                  <Trans>
                    Enter the household and animal details on the left to see
                    your biogas plant recommendations.
                  </Trans>
                </p>
              </div>
            )}
          </AnimatePresence>
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
      <div className="text-xl font-black text-white tracking-tighter">
        {value}
      </div>
    </div>
  );
}
