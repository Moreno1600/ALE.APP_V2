import React, { useState } from 'react';
import { Transaction, analyzeTransaction, ASSETS, EXPENSES, CONTRA_LIABS, CONTRA_EQUITY, LIABILITIES, EQUITY, REVENUE, CONTRA_ASSETS } from '../logic';
import { getBalance } from '../financials';

const OPTIONS = [
  "--- REVENUE CYCLE ---",
  "Performed services for cash", "Performed services on account", "Collected cash in advance",
  "--- INVENTORY ---",
  "Purchase inventory on account", "Sold inventory on account", "Inventory impairment",
  "--- EXPENSES & PAYROLL ---",
  "Pay wages", "Record payroll tax accrual", "Pay prepaid",
  "--- ASSETS & INVESTMENTS ---",
  "Purchase equipment", "Record depreciation", "Sell equipment (gain)", 
  "Purchase trading securities", "Fair value adj (gain)",
  "--- BAD DEBT ---",
  "Record bad debt estimate", "Write-off uncollectible",
  "--- EQUITY & FINANCING ---",
  "Issue common stock", "Purchase treasury stock", "Declare cash dividend", 
  "Pay cash dividend", "Issue bonds at discount"
];

interface Props {
  ledger: Transaction[];
  setLedger: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export default function EntryDashboard({ ledger, setLedger }: Props) {
  const [selectedDesc, setSelectedDesc] = useState(OPTIONS[0]);
  const [amount, setAmount] = useState<number>(0);
  const [successFlag, setSuccessFlag] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || selectedDesc.includes("---")) return;

    const { entries, logicNote } = analyzeTransaction(selectedDesc, amount);
    if (!entries.length) return;

    const newTransactions = entries.map(([dr, cr, amt]) => ({
      Event: selectedDesc,
      Debit: dr,
      Credit: cr,
      Amount: amt,
      Logic: logicNote
    }));

    setLedger(prev => [...prev, ...newTransactions]);
    setAmount(0);
    setSuccessFlag(true);
    setTimeout(() => setSuccessFlag(false), 3000);
  };

  const handleClear = () => {
    setLedger([]);
    setAmount(0);
  };

  const drList = [...ASSETS, ...EXPENSES, ...CONTRA_LIABS, ...CONTRA_EQUITY];
  const crList = [...LIABILITIES, ...EQUITY, ...REVENUE, ...CONTRA_ASSETS];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-700 pb-2">Entry Engine</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Select Event</label>
            <select
              value={selectedDesc}
              onChange={e => setSelectedDesc(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {OPTIONS.map(opt => (
                <option key={opt} value={opt} disabled={opt.includes("---")}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Amount ($)</label>
            <input
              type="number"
              min="0"
              step="100"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={selectedDesc.includes("---") || amount <= 0}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Post Entry
          </button>
        </form>

        {successFlag && (
          <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg px-4 py-2 text-center font-semibold">
            Posted to General Ledger
          </div>
        )}

        <hr className="border-slate-700" />
        <button
          onClick={handleClear}
          className="w-full bg-slate-800 text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-700 transition-colors"
        >
          Reset System
        </button>
      </div>

      <div className="flex-[2] space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-700 pb-2">Live T-Accounts</h2>
        {!ledger.length ? (
          <div className="bg-slate-800/50 text-slate-400 border border-slate-700 rounded-lg p-8 text-center">
            Awaiting Transactions...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-slate-300 mb-4">ASSETS & EXPENSES (Dr)</h3>
              <div className="space-y-2">
                {drList.map(acc => {
                  const bal = getBalance(acc, ledger);
                  if (Math.abs(bal) === 0) return null;
                  return (
                    <div key={acc} className="flex justify-between items-center bg-slate-800 border border-slate-700 border-l-4 border-l-blue-500 rounded-lg p-3">
                      <span className="font-semibold text-sm text-slate-100">{acc}</span>
                      <span className="font-mono font-bold text-slate-300">
                        ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-300 mb-4">LIABILITIES, EQUITY, REV (Cr)</h3>
              <div className="space-y-2">
                {crList.map(acc => {
                  const bal = getBalance(acc, ledger);
                  if (Math.abs(bal) === 0) return null;
                  return (
                    <div key={acc} className="flex justify-between items-center bg-slate-800 border border-slate-700 border-l-4 border-l-emerald-500 rounded-lg p-3">
                      <span className="font-semibold text-sm text-slate-100">{acc}</span>
                      <span className="font-mono font-bold text-slate-300">
                        ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
