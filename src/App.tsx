import React, { useState } from 'react';
import EntryDashboard from './components/EntryDashboard';
import FinancialStatements from './components/FinancialStatements';
import RatioAnalysis from './components/RatioAnalysis';
import AboutMe from './components/AboutMe';
import { Transaction, analyzeTransaction } from './logic';
import { generateFinancials } from './financials';
import { 
  FileText, 
  BarChart3, 
  Layers, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function App() {
  // Initialize with balanced enterprise sample case study so showcase viewers see live data immediately
  const [ledger, setLedger] = useState<Transaction[]>(() => {
    const sampleEvents: [string, number][] = [
      ["Issue common stock", 100000],
      ["Purchase equipment", 25000],
      ["Purchase inventory on account", 30000],
      ["Sold inventory on account", 45000],
      ["Pay wages", 12000],
      ["Record depreciation", 2500],
      ["Collected cash in advance", 8000],
      ["Pay prepaid", 4000],
      ["Record bad debt estimate", 1500]
    ];

    const generated: Transaction[] = [];
    sampleEvents.forEach(([desc, amt]) => {
      const { entries, logicNote } = analyzeTransaction(desc, amt);
      entries.forEach(([dr, cr, val]) => {
        generated.push({
          Event: desc,
          Debit: dr,
          Credit: cr,
          Amount: val,
          Logic: logicNote
        });
      });
    });

    return generated;
  });
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const financials = generateFinancials(ledger);
  const isBalanced = Math.abs(financials.totalAssets - (financials.totalLiabs + financials.totalEquity)) < 0.01;

  const loadSampleCaseStudy = () => {
    const sampleEvents: [string, number][] = [
      ["Issue common stock", 100000],
      ["Purchase equipment", 25000],
      ["Purchase inventory on account", 30000],
      ["Sold inventory on account", 45000],
      ["Pay wages", 12000],
      ["Record depreciation", 2500],
      ["Collected cash in advance", 8000],
      ["Pay prepaid", 4000],
      ["Record bad debt estimate", 1500]
    ];

    const generated: Transaction[] = [];
    sampleEvents.forEach(([desc, amt]) => {
      const { entries, logicNote } = analyzeTransaction(desc, amt);
      entries.forEach(([dr, cr, val]) => {
        generated.push({
          Event: desc,
          Debit: dr,
          Credit: cr,
          Amount: val,
          Logic: logicNote
        });
      });
    });

    setLedger(generated);
  };

  const tabs = [
    { id: 'DASHBOARD', label: 'Journal Entry Engine', number: '01', icon: Layers },
    { id: 'FS', label: 'Financial Statements', number: '02', icon: FileText },
    { id: 'RATIOS', label: 'Advisory & Ratio Analytics', number: '03', icon: BarChart3 },
    { id: 'ABOUT', label: 'Consultant Profile & Insights', number: '04', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#080c13] text-slate-100 flex flex-col selection:bg-[#86bc25]/30 selection:text-[#86bc25]">
      
      {/* Top Advisory Utility Bar */}
      <div className="border-b border-[#1b2533] bg-[#0b0f17] text-xs px-4 py-2 font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-sans font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#86bc25] animate-pulse"></span>
              ENTERPRISE AUDIT & ASSURANCE ENGINE
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">US GAAP / FASB STANDARDS</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">REAL-TIME DOUBLE ENTRY GL</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#86bc25]" />
              <span className={isBalanced ? "text-[#86bc25] font-semibold" : "text-amber-400 font-semibold"}>
                {ledger.length === 0 ? "LEDGER IDLE" : isBalanced ? "GL EQUILIBRIUM VERIFIED" : "EQUILIBRIUM VARIANCE"}
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">CFO AI COPILOT: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Executive Banner */}
      <header className="border-b border-[#1f2d3f] bg-gradient-to-b from-[#0e141f] to-[#0a0e16] px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#141d2b] border border-[#233044] flex items-center justify-center shadow-inner">
                <span className="font-mono font-black text-xl text-white tracking-tighter">
                  A<span className="text-[#86bc25]">L</span>E
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-white">ALE</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#86bc25] inline-block mb-1"></span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold ml-2 border-l border-slate-700 pl-2">
                  Accounting Logic Engine
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl font-normal">
              Autonomous Double-Entry General Ledger, GAAP Financial Reporting, and Generative AI Audit Advisory.
            </p>
          </div>

          {/* Quick Metrics & Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {ledger.length === 0 ? (
              <button
                onClick={loadSampleCaseStudy}
                className="flex items-center gap-2 bg-[#141d2b] hover:bg-[#1a2638] text-slate-200 border border-[#26374d] hover:border-[#86bc25] text-xs font-semibold px-4 py-2.5 rounded-md transition-all shadow-sm group cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-[#86bc25] group-hover:scale-110 transition-transform" />
                Load Enterprise Audit Sample
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-[#111824] border border-[#1f2d3f] rounded-lg px-4 py-2">
                <div className="text-left border-r border-[#233044] pr-4">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Assets</div>
                  <div className="text-sm font-mono font-bold text-white">
                    ${financials.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-left border-r border-[#233044] pr-4">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Net Income</div>
                  <div className={`text-sm font-mono font-bold ${financials.netIncome >= 0 ? 'text-[#86bc25]' : 'text-rose-400'}`}>
                    ${financials.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <button
                  onClick={loadSampleCaseStudy}
                  title="Reload audit benchmark data"
                  className="text-xs text-slate-400 hover:text-white transition-colors p-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Big 4 Executive Tab Navigation Bar */}
      <nav className="border-b border-[#1b2533] bg-[#090d14] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-5 py-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#86bc25] text-white bg-[#101723]/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#101723]/30'
                }`}
              >
                <span className={`text-[11px] font-mono font-bold transition-colors ${
                  isActive ? 'text-[#86bc25]' : 'text-slate-500 group-hover:text-slate-400'
                }`}>
                  {tab.number}
                </span>
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#86bc25]' : 'text-slate-500 group-hover:text-slate-400'
                }`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === 'DASHBOARD' && <EntryDashboard ledger={ledger} setLedger={setLedger} />}
        {activeTab === 'FS' && <FinancialStatements ledger={ledger} />}
        {activeTab === 'RATIOS' && <RatioAnalysis ledger={ledger} />}
        {activeTab === 'ABOUT' && <AboutMe />}
      </main>

      {/* Executive Footer */}
      <footer className="border-t border-[#1a2433] bg-[#090d15] text-slate-500 text-xs py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ALE.</span>
            <span>Accounting Logic Engine | Built for Big 4 Audit Innovation</span>
          </div>
          <div className="flex items-center gap-6">
            <span>FASB / GAAP Conceptual Framework</span>
            <span>Double-Entry Verification</span>
            <span className="text-slate-400">Christian Reveles • University of Arkansas</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

