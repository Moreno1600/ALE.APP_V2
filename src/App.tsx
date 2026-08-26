import React, { useState } from 'react';
import EntryDashboard from './components/EntryDashboard';
import FinancialStatements from './components/FinancialStatements';
import RatioAnalysis from './components/RatioAnalysis';
import AboutMe from './components/AboutMe';
import { Transaction } from './logic';

export default function App() {
  const [ledger, setLedger] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const tabs = [
    { id: 'DASHBOARD', label: 'ENTRY DASHBOARD' },
    { id: 'FS', label: 'FINANCIAL STATEMENTS' },
    { id: 'RATIOS', label: 'RATIO ANALYSIS' },
    { id: 'ABOUT', label: 'ABOUT ME' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="mb-8 border-b border-slate-700/50 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L10 90 L90 90 Z" fill="transparent" stroke="#3b82f6" strokeWidth="8"/>
            <path d="M50 25 L25 75 L75 75 Z" fill="#3b82f6"/>
          </svg>
          <span className="text-5xl font-black bg-gradient-to-br from-white to-blue-500 bg-clip-text text-transparent tracking-tighter">
            ALE
          </span>
        </div>
        <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight mt-2">
          Accounting Logic Engine
        </div>
        <div className="text-slate-400 text-lg mt-2">
          GAAP Compliant | Real time Financial Reporting | AI-Powered
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-700 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'DASHBOARD' && <EntryDashboard ledger={ledger} setLedger={setLedger} />}
        {activeTab === 'FS' && <FinancialStatements ledger={ledger} />}
        {activeTab === 'RATIOS' && <RatioAnalysis ledger={ledger} />}
        {activeTab === 'ABOUT' && <AboutMe />}
      </div>

    </div>
  );
}
