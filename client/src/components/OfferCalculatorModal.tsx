import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  PieChart, 
  Sparkles, 
  ArrowUpRight,
  Calculator
} from 'lucide-react';

interface OfferCalculatorModalProps {
  onClose: () => void;
}

export const OfferCalculatorModal: React.FC<OfferCalculatorModalProps> = ({ onClose }) => {
  const [baseSalaryLPA, setBaseSalaryLPA] = useState<number>(18); // 18 LPA
  const [joiningBonusLakhs, setJoiningBonusLakhs] = useState<number>(2); // 2 Lakhs
  const [variableBonusPct, setVariableBonusPct] = useState<number>(10); // 10%
  const [stockGrantUSD, setStockGrantUSD] = useState<number>(25000); // $25,000 USD RSUs
  const [annualStockGrowthPct, setAnnualStockGrowthPct] = useState<number>(15); // 15% YoY growth
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');

  const usdToInr = 85;
  const baseINR = baseSalaryLPA * 100000;
  const joiningINR = joiningBonusLakhs * 100000;
  const variableINR = (baseINR * variableBonusPct) / 100;
  
  // 4-year standard 25% annual vesting
  const annualStockUSD = stockGrantUSD / 4;
  const annualStockINR = annualStockUSD * usdToInr;

  const firstYearTC_INR = baseINR + joiningINR + variableINR + annualStockINR;

  // Approximate Monthly In-Hand Salary under Indian New Tax Regime (Section 115BAC)
  const calculateMonthlyInHand = (annualBase: number) => {
    // New regime slabs: 0-3L 0%, 3-6L 5%, 6-9L 10%, 9-12L 15%, 12-15L 20%, >15L 30% + standard deduction 75k
    const taxable = Math.max(0, annualBase - 75000);
    let tax = 0;
    if (taxable > 1500000) tax += (taxable - 1500000) * 0.30 + 150000;
    else if (taxable > 1200000) tax += (taxable - 1200000) * 0.20 + 90000;
    else if (taxable > 900000) tax += (taxable - 900000) * 0.15 + 45000;
    else if (taxable > 600000) tax += (taxable - 600000) * 0.10 + 15000;
    else if (taxable > 300000) tax += (taxable - 300000) * 0.05;

    // 4% cess + PF deduction approx 1.8k/mo
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const annualNet = annualBase - totalTax - (21600); // 1800*12 PF
    return Math.round(annualNet / 12);
  };

  const monthlyTakeHomeINR = calculateMonthlyInHand(baseINR);

  // 4-Year Projected Total Wealth with Stock Appreciation
  const projected4YearTotalUSD = stockGrantUSD * Math.pow(1 + annualStockGrowthPct / 100, 4);
  const projected4YearTotalINR = (baseINR * 4) + joiningINR + (variableINR * 4) + (projected4YearTotalUSD * usdToInr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Offer Letter, CTC & Equity (RSU/ESOP) Simulator</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  Indian Tax & Equity Model
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Calculate total CTC, real in-hand monthly take-home, and 4-year stock projections
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Top High-Level Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
              <span className="text-[11px] text-zinc-400">First Year Total CTC</span>
              <div className="text-2xl font-bold font-mono text-white">
                ₹{(firstYearTC_INR / 100000).toFixed(2)} LPA
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Base + Bonus + 25% RSU</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 text-center space-y-1">
              <span className="text-[11px] text-zinc-400">Monthly In-Hand Take-Home</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                ₹{monthlyTakeHomeINR.toLocaleString()}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">After TDS & PF (New Tax Regime)</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
              <span className="text-[11px] text-zinc-400">4-Year Projected Wealth</span>
              <div className="text-2xl font-bold font-mono text-purple-400">
                ₹{(projected4YearTotalINR / 10000000).toFixed(2)} Cr
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">With {annualStockGrowthPct}% Stock Growth</span>
            </div>
          </div>

          {/* Interactive Sliders & Inputs */}
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Tune Your Offer Parameters
            </h3>

            <div className="space-y-4 text-xs">
              {/* Base Salary */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Base Fixed Salary:</span>
                  <span className="font-mono font-bold text-white text-sm">{baseSalaryLPA} LPA (₹{(baseINR / 100000).toFixed(1)}L)</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="60"
                  step="1"
                  value={baseSalaryLPA}
                  onChange={(e) => setBaseSalaryLPA(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Joining Bonus */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Joining / Sign-on Bonus:</span>
                  <span className="font-mono font-bold text-white text-sm">₹{joiningBonusLakhs} Lakhs</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={joiningBonusLakhs}
                  onChange={(e) => setJoiningBonusLakhs(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* RSU Grant */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Total 4-Year RSU / ESOP Grant:</span>
                  <span className="font-mono font-bold text-purple-400 text-sm">
                    ${stockGrantUSD.toLocaleString()} USD (₹{((stockGrantUSD * usdToInr) / 100000).toFixed(1)}L)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120000"
                  step="5000"
                  value={stockGrantUSD}
                  onChange={(e) => setStockGrantUSD(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Stock YoY Growth */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Projected Annual Stock Growth (% YoY):</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">{annualStockGrowthPct}% YoY</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={annualStockGrowthPct}
                  onChange={(e) => setAnnualStockGrowthPct(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Based on Indian FY 2025-26 New Tax Regime (Section 115BAC)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
