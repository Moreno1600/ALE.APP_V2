import React from 'react';
import { Transaction } from '../logic';
import { getBalance, generateFinancials } from '../financials';

export default function RatioAnalysis({ ledger }: { ledger: Transaction[] }) {
  const fin = generateFinancials(ledger);
  
  const ca = getBalance("Cash", ledger) + getBalance("Accounts Receivable", ledger) + getBalance("Inventory", ledger) + getBalance("Prepaid Expenses", ledger);
  const cl = getBalance("Accounts Payable", ledger) + getBalance("Unearned Revenue", ledger) + getBalance("Wages Payable", ledger) + getBalance("Interest Payable", ledger) + getBalance("Dividends Payable", ledger) + getBalance("Warranty Liability", ledger);
  
  const currentRatio = cl > 0 ? ca / cl : 0;
  const currentRatioProgress = Math.min(Math.max(currentRatio / 3, 0), 1) * 100;
  
  const sales = fin.totalRev;
  const margin = sales > 0 ? (fin.netIncome / sales * 100) : 0;
  const marginProgress = Math.min(Math.max(margin, 0), 100);
  
  const dte = fin.totalEquity > 0 ? (fin.totalLiabs / fin.totalEquity) : 0;
  const dteProgress = Math.min(Math.max(dte / 2, 0), 1) * 100;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-700 pb-2">Financial Ratios Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 className="text-lg font-bold text-slate-200">Current Ratio</h4>
          <p className="text-sm text-slate-400 mb-4">Liquidity Check (Target &gt; 1.5)</p>
          <div className="text-3xl font-mono font-bold mb-4">{currentRatio.toFixed(2)}</div>
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${currentRatioProgress}%` }} />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 className="text-lg font-bold text-slate-200">Profit Margin</h4>
          <p className="text-sm text-slate-400 mb-4">Net Income / Net Sales</p>
          <div className="text-3xl font-mono font-bold mb-4">{margin.toFixed(1)}%</div>
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${marginProgress}%` }} />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 className="text-lg font-bold text-slate-200">Debt-to-Equity</h4>
          <p className="text-sm text-slate-400 mb-4">Leverage (Total Liabs / Total Equity)</p>
          <div className="text-3xl font-mono font-bold mb-4">{dte.toFixed(2)}</div>
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${dteProgress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
