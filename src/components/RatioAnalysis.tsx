import React from 'react';
import { Transaction } from '../logic';
import { getBalance, generateFinancials } from '../financials';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Percent, 
  Gauge 
} from 'lucide-react';

export default function RatioAnalysis({ ledger }: { ledger: Transaction[] }) {
  const fin = generateFinancials(ledger);
  
  const ca = getBalance("Cash", ledger) + getBalance("Accounts Receivable", ledger) + getBalance("Inventory", ledger) + getBalance("Prepaid Expenses", ledger);
  const cl = getBalance("Accounts Payable", ledger) + getBalance("Unearned Revenue", ledger) + getBalance("Wages Payable", ledger) + getBalance("Interest Payable", ledger) + getBalance("Dividends Payable", ledger) + getBalance("Warranty Liability", ledger);
  
  const currentRatio = cl > 0 ? ca / cl : (ca > 0 ? 99.9 : 0);
  const currentRatioProgress = Math.min(Math.max((currentRatio === 99.9 ? 3 : currentRatio) / 3, 0), 1) * 100;
  
  const sales = fin.totalRev;
  const margin = sales > 0 ? (fin.netIncome / sales * 100) : 0;
  const marginProgress = Math.min(Math.max(margin, 0), 100);
  
  const dte = fin.totalEquity > 0 ? (fin.totalLiabs / fin.totalEquity) : 0;
  const dteProgress = Math.min(Math.max(dte / 2, 0), 1) * 100;

  const quickAssets = getBalance("Cash", ledger) + getBalance("Accounts Receivable", ledger);
  const quickRatio = cl > 0 ? quickAssets / cl : (quickAssets > 0 ? 99.9 : 0);

  const roe = fin.totalEquity > 0 ? (fin.netIncome / fin.totalEquity) * 100 : 0;
  const roa = fin.totalAssets > 0 ? (fin.netIncome / fin.totalAssets) * 100 : 0;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#162233] border border-[#26374d] flex items-center justify-center text-[#86bc25]">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Financial Advisory & Ratio Benchmarks
            </h2>
            <p className="text-xs text-slate-400">Big 4 Management Consulting & Going Concern Health Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-[#090d14] px-3 py-1.5 rounded-lg border border-[#1f2d40]">
            Audit Framework: <strong>US GAAP Benchmarks</strong>
          </span>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Ratio Card */}
        <div className="bg-[#0f1724] rounded-xl p-6 border border-[#1f2d40] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Liquidity Index</h4>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                currentRatio >= 1.5 || currentRatio === 99.9
                  ? 'bg-[#86bc25]/10 text-[#86bc25] border-[#86bc25]/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {currentRatio >= 1.5 || currentRatio === 99.9 ? 'HEALTHY' : 'CONCERN'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Current Ratio</h3>
            <p className="text-xs text-slate-400 mt-1">Current Assets / Current Liabilities (Benchmark: &gt; 1.5x)</p>
            
            <div className="text-3xl font-mono font-black text-white my-4 tracking-tight">
              {currentRatio === 99.9 ? 'No ST Debt' : `${currentRatio.toFixed(2)}x`}
            </div>
          </div>

          <div>
            <div className="h-2 w-full bg-[#162232] rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-[#86bc25] transition-all duration-500" 
                style={{ width: `${currentRatioProgress}%` }} 
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.0x (Critical)</span>
              <span>1.5x (Target)</span>
              <span>3.0x+ (Robust)</span>
            </div>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-[#0f1724] rounded-xl p-6 border border-[#1f2d40] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Profitability</h4>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                margin >= 15 
                  ? 'bg-[#86bc25]/10 text-[#86bc25] border-[#86bc25]/30' 
                  : margin >= 0 
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {margin >= 15 ? 'STRONG' : margin >= 0 ? 'MODERATE' : 'LOSS'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Net Profit Margin</h3>
            <p className="text-xs text-slate-400 mt-1">Net Income / Net Sales (Benchmark: &gt; 10%)</p>
            
            <div className="text-3xl font-mono font-black text-white my-4 tracking-tight">
              {margin.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className="h-2 w-full bg-[#162232] rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-[#86bc25] transition-all duration-500" 
                style={{ width: `${marginProgress}%` }} 
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Breakeven)</span>
              <span>10% (Target)</span>
              <span>25%+ (Elite)</span>
            </div>
          </div>
        </div>

        {/* Debt-to-Equity Card */}
        <div className="bg-[#0f1724] rounded-xl p-6 border border-[#1f2d40] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Capital Structure</h4>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                dte <= 1.5 
                  ? 'bg-[#86bc25]/10 text-[#86bc25] border-[#86bc25]/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {dte <= 1.5 ? 'CONSERVATIVE' : 'LEVERAGED'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Debt-to-Equity (D/E)</h3>
            <p className="text-xs text-slate-400 mt-1">Total Liabilities / Total Stockholders' Equity (Target: &lt; 2.0x)</p>
            
            <div className="text-3xl font-mono font-black text-white my-4 tracking-tight">
              {dte.toFixed(2)}x
            </div>
          </div>

          <div>
            <div className="h-2 w-full bg-[#162232] rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-sky-500 transition-all duration-500" 
                style={{ width: `${dteProgress}%` }} 
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.0x (All Equity)</span>
              <span>1.0x (Balanced)</span>
              <span>2.0x+ (High Debt)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Secondary Supplementary Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Quick Ratio (Acid-Test)</span>
          <div className="text-xl font-mono font-bold text-white">
            {quickRatio === 99.9 ? 'N/A' : `${quickRatio.toFixed(2)}x`}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Excludes Inventory</span>
        </div>

        <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Return on Equity (ROE)</span>
          <div className="text-xl font-mono font-bold text-[#86bc25]">
            {roe.toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Net Income / Total Equity</span>
        </div>

        <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Return on Assets (ROA)</span>
          <div className="text-xl font-mono font-bold text-sky-400">
            {roa.toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Net Income / Total Assets</span>
        </div>

        <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Net Working Capital</span>
          <div className="text-xl font-mono font-bold text-white">
            ${(ca - cl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Current Assets - Current Liab</span>
        </div>

      </div>

      {/* Advisory Diagnostic Executive Summary Card */}
      <div className="bg-[#0c121d] border border-[#1f2d40] rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <ShieldCheck className="w-5 h-5 text-[#86bc25]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Auditor & Advisory Diagnostic Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#121a26] border border-[#1d2b3c] rounded-lg p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 block mb-1">Liquidity Evaluation</span>
            <p className="text-slate-300 leading-relaxed">
              {currentRatio >= 1.5 || currentRatio === 99.9
                ? "Adequate short-term liquidity buffer. Working capital covers short-term obligations comfortably."
                : "Tight working capital cushion. Monitor accounts payable aging and receivable collections cycle."}
            </p>
          </div>

          <div className="bg-[#121a26] border border-[#1d2b3c] rounded-lg p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#86bc25] block mb-1">Capital Structure</span>
            <p className="text-slate-300 leading-relaxed">
              {dte <= 1.5 
                ? "Conservative leverage profile. Strong equity base limits credit and refinancing risk."
                : "Elevated financial gearing. Debt service costs should be managed relative to cash flow."}
            </p>
          </div>

          <div className="bg-[#121a26] border border-[#1d2b3c] rounded-lg p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#86bc25] block mb-1">Earnings Quality</span>
            <p className="text-slate-300 leading-relaxed">
              {fin.netIncome >= 0 
                ? `Positive earnings accretion totaling $${fin.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`
                : "Current net loss position. Review operating expense structure and gross margins."}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

