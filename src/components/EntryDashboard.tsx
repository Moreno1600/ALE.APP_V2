import React, { useState } from 'react';
import { 
  Transaction, 
  analyzeTransaction, 
  ASSETS, 
  EXPENSES, 
  CONTRA_LIABS, 
  CONTRA_EQUITY, 
  LIABILITIES, 
  EQUITY, 
  REVENUE, 
  CONTRA_ASSETS 
} from '../logic';
import { getBalance } from '../financials';
import { 
  PlusCircle, 
  RotateCcw, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  DollarSign,
  Scale,
  Sparkles,
  Zap
} from 'lucide-react';

const TRANSACTION_CATEGORIES = [
  {
    category: "Revenue & Sales Cycle",
    items: [
      { label: "Performed services for cash", desc: "Immediate cash receipt for services performed (Revenue Rec)." },
      { label: "Performed services on account", desc: "Invoiced client with 30-day deferred payment terms (Accrual)." },
      { label: "Collected cash in advance", desc: "Customer deposit creating unearned revenue liability (Deferral)." }
    ]
  },
  {
    category: "Inventory & Cost of Goods Sold",
    items: [
      { label: "Purchase inventory on account", desc: "Commercial inventory purchase capitalized at gross invoice cost." },
      { label: "Sold inventory on account", desc: "Two-step entry: Revenue recognition + COGS / Inventory derecognition." },
      { label: "Inventory impairment", desc: "Conservatism principle: Lower of Cost or Market (LCM) write-down." }
    ]
  },
  {
    category: "Operating Expenses & Payroll",
    items: [
      { label: "Pay wages", desc: "Immediate wage disbursement settling current period labor expense." },
      { label: "Record payroll tax accrual", desc: "Accrued employer FICA & unemployment tax obligation." },
      { label: "Pay prepaid", desc: "Advance disbursement creating future economic benefit asset." }
    ]
  },
  {
    category: "Capital Assets & Investments",
    items: [
      { label: "Purchase equipment", desc: "Capital expenditure (CapEx) establishing productive PPE asset." },
      { label: "Record depreciation", desc: "Systematic allocation of historical cost over estimated useful life." },
      { label: "Sell equipment (gain)", desc: "PPE derecognition with net proceeds exceeding net book value." },
      { label: "Purchase trading securities", desc: "Marketable security portfolio investment at fair market acquisition." },
      { label: "Fair value adj (gain)", desc: "FASB ASC 820 mark-to-market upward fair value adjustment." }
    ]
  },
  {
    category: "Credit & Bad Debt Reserves",
    items: [
      { label: "Record bad debt estimate", desc: "Allowance method: Matching anticipated credit losses against revenue." },
      { label: "Write-off uncollectible", desc: "Specific write-off against AFDA with zero direct P&L effect." }
    ]
  },
  {
    category: "Equity Financing & Capital Structure",
    items: [
      { label: "Issue common stock", desc: "Primary equity capital raise increasing paid-in contributed capital." },
      { label: "Purchase treasury stock", desc: "Contra-equity open market share repurchase reducing outstanding equity." },
      { label: "Declare cash dividend", desc: "Formal board declaration establishing dividends payable liability." },
      { label: "Pay cash dividend", desc: "Cash disbursement settling outstanding dividend payable obligation." },
      { label: "Issue bonds at discount", desc: "Corporate debt financing issued below par with discount contra-liability." }
    ]
  }
];

interface Props {
  ledger: Transaction[];
  setLedger: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export default function EntryDashboard({ ledger, setLedger }: Props) {
  const [selectedDesc, setSelectedDesc] = useState("Performed services for cash");
  const [amount, setAmount] = useState<number>(10000);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const preview = amount > 0 ? analyzeTransaction(selectedDesc, amount) : { entries: [], logicNote: "" };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

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
    setSuccessNote(`Posted ${entries.length} line item(s) to General Ledger`);
    setTimeout(() => setSuccessNote(null), 4000);
  };

  const handleClear = () => {
    setLedger([]);
    setAmount(10000);
  };

  const quickAmounts = [2500, 10000, 25000, 50000, 100000];

  const drAccounts = [...ASSETS, ...EXPENSES, ...CONTRA_LIABS, ...CONTRA_EQUITY];
  const crAccounts = [...LIABILITIES, ...EQUITY, ...REVENUE, ...CONTRA_ASSETS];

  const activeDrAccounts = drAccounts.filter(acc => Math.abs(getBalance(acc, ledger)) > 0);
  const activeCrAccounts = crAccounts.filter(acc => Math.abs(getBalance(acc, ledger)) > 0);

  return (
    <div className="space-y-8">

      {/* Grid: Entry Station & T-Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Transaction Entry Terminal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#86bc25]/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-[#1f2d40] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#162335] border border-[#2a3c53] flex items-center justify-center text-[#86bc25]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Transaction Engine
                  </h2>
                  <p className="text-xs text-slate-400">Autonomous Double-Entry Posting</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#86bc25] bg-[#86bc25]/10 px-2 py-0.5 rounded border border-[#86bc25]/30">
                GAAP ASC-READY
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Event Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Accounting Event
                </label>
                <select
                  value={selectedDesc}
                  onChange={e => setSelectedDesc(e.target.value)}
                  className="w-full bg-[#090d14] border border-[#26374d] hover:border-[#384f6d] focus:border-[#86bc25] rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition-colors"
                >
                  {TRANSACTION_CATEGORIES.map(cat => (
                    <optgroup key={cat.category} label={`── ${cat.category.toUpperCase()} ──`} className="bg-[#0f1724] text-slate-400 font-semibold py-1">
                      {cat.items.map(item => (
                        <option key={item.label} value={item.label} className="text-slate-100 py-1">
                          {item.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Amount Input & Quick Chips */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    2. Notional Transaction Amount ($)
                  </label>
                  <span className="text-xs font-mono text-slate-400">USD</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={amount || ''}
                    onChange={e => setAmount(Number(e.target.value))}
                    placeholder="Enter amount..."
                    className="w-full bg-[#090d14] border border-[#26374d] hover:border-[#384f6d] focus:border-[#86bc25] rounded-lg pl-8 pr-4 py-2.5 text-base font-mono font-bold text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {quickAmounts.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded transition-all cursor-pointer ${
                        amount === val
                          ? 'bg-[#86bc25] text-black font-bold'
                          : 'bg-[#141e2d] hover:bg-[#1a283c] text-slate-300 border border-[#26374d]'
                      }`}
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Double-Entry Preview Box */}
              {preview.entries.length > 0 && (
                <div className="bg-[#090d15] border border-[#1d2b3c] rounded-lg p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span className="uppercase font-semibold">Mechanics Preview:</span>
                    <span className="text-[#86bc25] font-semibold">{preview.logicNote}</span>
                  </div>
                  <div className="space-y-1 pt-1 font-mono">
                    {preview.entries.map(([dr, cr, val], idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-300 bg-[#121a26] px-2.5 py-1.5 rounded">
                        <span>
                          <span className="text-sky-400 font-bold">DR</span> {dr} / <span className="text-[#86bc25] font-bold">CR</span> {cr}
                        </span>
                        <span className="font-bold text-white">
                          ${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Button */}
              <button
                type="submit"
                disabled={amount <= 0}
                className="w-full bg-[#86bc25] hover:bg-[#77a91f] text-[#090e15] font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#86bc25]/20 cursor-pointer disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                Post to General Ledger
              </button>

            </form>

            {successNote && (
              <div className="mt-4 bg-[#86bc25]/10 border border-[#86bc25]/40 text-[#86bc25] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successNote}</span>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#1f2d40] flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Posted Entries: <strong className="text-white font-mono">{ledger.length}</strong></span>
              {ledger.length > 0 && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset GL System
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Live T-Accounts & Balance Station */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-6 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between border-b border-[#1f2d40] pb-4 mb-6 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#162335] border border-[#2a3c53] flex items-center justify-center text-sky-400">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Live T-Account Balances
                  </h2>
                  <p className="text-xs text-slate-400">Normal Balance Matrix & General Ledger Feeds</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1 text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  DR = Normal Debit
                </span>
                <span className="flex items-center gap-1 text-[#86bc25] bg-[#86bc25]/10 px-2 py-0.5 rounded border border-[#86bc25]/20">
                  CR = Normal Credit
                </span>
              </div>
            </div>

            {ledger.length === 0 ? (
              <div className="border border-dashed border-[#233044] rounded-xl p-12 text-center bg-[#0a0e16]/50">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-300">General Ledger Awaiting Postings</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Post transactions using the entry engine on the left, or click "Load Enterprise Audit Sample" in the header.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Debit Column (Assets & Expenses) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-sky-500/30">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      Debit-Normal (Assets & Exp)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{activeDrAccounts.length} Active</span>
                  </div>

                  {activeDrAccounts.length === 0 ? (
                    <div className="text-xs text-slate-500 py-6 text-center italic bg-[#0a0e16] rounded-lg">
                      No active debit-side balances
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeDrAccounts.map(acc => {
                        const bal = getBalance(acc, ledger);
                        const isAsset = ASSETS.includes(acc);
                        return (
                          <div 
                            key={acc} 
                            className="flex justify-between items-center bg-[#0a0e16] hover:bg-[#121926] border border-[#1b2636] border-l-4 border-l-sky-500 rounded-lg p-3 transition-colors"
                          >
                            <div>
                              <div className="font-semibold text-xs text-slate-100">{acc}</div>
                              <div className="text-[10px] text-slate-400 uppercase font-mono">
                                {isAsset ? 'Asset / CapEx' : 'Expense / Loss'}
                              </div>
                            </div>
                            <div className="text-right font-mono">
                              <span className="text-sm font-bold text-sky-300">
                                ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Credit Column (Liabilities, Equity & Revenue) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#86bc25]/30">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#86bc25] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#86bc25]"></span>
                      Credit-Normal (Liab, Eq, Rev)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{activeCrAccounts.length} Active</span>
                  </div>

                  {activeCrAccounts.length === 0 ? (
                    <div className="text-xs text-slate-500 py-6 text-center italic bg-[#0a0e16] rounded-lg">
                      No active credit-side balances
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeCrAccounts.map(acc => {
                        const bal = getBalance(acc, ledger);
                        const isLiab = LIABILITIES.includes(acc);
                        const isRev = REVENUE.includes(acc);
                        return (
                          <div 
                            key={acc} 
                            className="flex justify-between items-center bg-[#0a0e16] hover:bg-[#121926] border border-[#1b2636] border-l-4 border-l-[#86bc25] rounded-lg p-3 transition-colors"
                          >
                            <div>
                              <div className="font-semibold text-xs text-slate-100">{acc}</div>
                              <div className="text-[10px] text-slate-400 uppercase font-mono">
                                {isLiab ? 'Liability' : isRev ? 'Revenue / Gain' : 'Equity / Capital'}
                              </div>
                            </div>
                            <div className="text-right font-mono">
                              <span className="text-sm font-bold text-[#86bc25]">
                                ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* General Ledger Journal Trail */}
      {ledger.length > 0 && (
        <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#1f2d40] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#86bc25]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                General Ledger Audit Trail (Double-Entry Log)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{ledger.length} Record(s)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090d14] text-slate-400 font-mono uppercase tracking-wider border-b border-[#1f2d40]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Event Description</th>
                  <th className="py-2.5 px-3 text-sky-400">Debit Account (Dr)</th>
                  <th className="py-2.5 px-3 text-[#86bc25]">Credit Account (Cr)</th>
                  <th className="py-2.5 px-3 text-right">Amount ($)</th>
                  <th className="py-2.5 px-3">FASB / GAAP Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172230] font-sans">
                {ledger.map((entry, i) => (
                  <tr key={i} className="hover:bg-[#131d2b] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{String(i + 1).padStart(2, '0')}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{entry.Event}</td>
                    <td className="py-2.5 px-3 font-mono text-sky-300">{entry.Debit}</td>
                    <td className="py-2.5 px-3 font-mono text-[#86bc25]">{entry.Credit}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-right text-white">
                      ${entry.Amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">{entry.Logic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

