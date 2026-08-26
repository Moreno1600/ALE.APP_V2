import React, { useState, useEffect, useRef } from 'react';
import { 
  Transaction, 
  ASSETS, 
  EXPENSES, 
  REVENUE, 
  LIABILITIES, 
  CONTRA_ASSETS, 
  CONTRA_LIABS, 
  EQUITY, 
  CONTRA_EQUITY 
} from '../logic';
import { getBalance, generateFinancials, generateSuggestions } from '../financials';
import { 
  Bot, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  FileSpreadsheet, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  Building2,
  Info
} from 'lucide-react';

interface Props {
  ledger: Transaction[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FinancialStatements({ ledger }: Props) {
  const fin = generateFinancials(ledger);
  const checkDiff = fin.totalAssets - (fin.totalLiabs + fin.totalEquity);
  const isBalanced = Math.abs(checkDiff) < 0.01;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello, I am your ALE AI Audit & CFO Copilot. I'm connected directly to your live General Ledger. Ask me to assess going concern, interpret financial ratios, analyze revenue recognition, or pinpoint accounting variances."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const suggs = generateSuggestions(fin);

  const handleAiQuery = async (query: string) => {
    if (!query.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: query } as Message];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, financials: fin })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Server error');
      
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setMessages([...newMessages, { role: 'assistant', content: `${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const FsRow = ({ 
    label, 
    value, 
    parens = false, 
    bold = false, 
    isHeader = false,
    borderTop = false, 
    doubleUnderline = false,
    accent = false,
    indent = false
  }: { 
    label: string; 
    value?: number; 
    parens?: boolean; 
    bold?: boolean; 
    isHeader?: boolean;
    borderTop?: boolean; 
    doubleUnderline?: boolean;
    accent?: boolean;
    indent?: boolean;
  }) => {
    if (value === undefined && isHeader) {
      return (
        <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider pt-3 pb-1 border-b border-[#1f2d40]">
          {label}
        </div>
      );
    }

    if (value === 0 && !bold && !doubleUnderline) return null;
    const num = value || 0;
    const formatted = Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const displayValue = parens || num < 0 ? `(${formatted})` : formatted;
    
    return (
      <div className={`flex justify-between items-center py-1.5 text-xs transition-colors ${
        indent ? 'pl-3' : ''
      } ${
        bold ? 'font-bold text-white' : 'text-slate-300'
      } ${
        borderTop ? 'border-t border-[#233044] pt-2 mt-1' : ''
      } ${
        doubleUnderline ? 'border-b-4 border-b-double border-[#86bc25] pb-2 mt-2 pt-2 border-t border-[#233044]' : 'border-b border-[#141c28]'
      }`}>
        <span className={accent ? 'text-[#86bc25] font-semibold' : ''}>{label}</span>
        <span className={`font-mono ${accent ? 'text-[#86bc25] font-bold' : ''}`}>
          ${displayValue}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* Financial Statements Section (9 cols on wide screens) */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-5 shadow-xl flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#15202f] border border-[#27374d] flex items-center justify-center text-[#86bc25]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                GAAP 3-Statement Reporting Suite
              </h2>
              <p className="text-xs text-slate-400">Integrated Income Statement, Balance Sheet & Cash Flows</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {isBalanced ? (
              <span className="flex items-center gap-1.5 bg-[#86bc25]/10 text-[#86bc25] border border-[#86bc25]/30 px-3 py-1 rounded-full font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                BALANCE SHEET EQUILIBRIUM VERIFIED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                VARIANCE: ${Math.abs(checkDiff).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        </div>

        {/* 3 Statements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Income Statement */}
          <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-sky-500 pb-2 mb-3">
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-widest block">STATEMENT 01</span>
                <h3 className="font-bold text-sm text-white uppercase">Income Statement</h3>
                <span className="text-[10px] text-slate-400 font-mono">For the Period Ended</span>
              </div>

              <div className="space-y-0.5">
                <FsRow label="Revenues" isHeader />
                {REVENUE.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} indent />)}
                <FsRow label="Total Revenues" value={fin.totalRev} bold borderTop />

                <FsRow label="Operating Expenses" isHeader />
                {EXPENSES.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} indent />)}
                <FsRow label="Total Operating Expenses" value={fin.totalExp} bold borderTop />
              </div>
            </div>

            <div className="mt-6">
              <FsRow 
                label="NET INCOME / (LOSS)" 
                value={fin.netIncome} 
                bold 
                doubleUnderline 
                accent={fin.netIncome >= 0}
              />
            </div>
          </div>

          {/* Balance Sheet */}
          <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-[#86bc25] pb-2 mb-3">
                <span className="text-[10px] font-mono text-[#86bc25] font-bold uppercase tracking-widest block">STATEMENT 02</span>
                <h3 className="font-bold text-sm text-white uppercase">Balance Sheet</h3>
                <span className="text-[10px] text-slate-400 font-mono">As of Reporting Date</span>
              </div>

              <div className="space-y-0.5">
                <FsRow label="Assets & Resources" isHeader />
                {ASSETS.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} indent />)}
                {CONTRA_ASSETS.map(acc => <FsRow key={acc} label={`Less: ${acc}`} value={getBalance(acc, ledger)} parens indent />)}
                <FsRow label="TOTAL ASSETS" value={fin.totalAssets} bold borderTop accent />

                <FsRow label="Liabilities & Obligations" isHeader />
                {LIABILITIES.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} indent />)}
                {CONTRA_LIABS.map(acc => <FsRow key={acc} label={`Less: ${acc}`} value={getBalance(acc, ledger)} parens indent />)}
                <FsRow label="Total Liabilities" value={fin.totalLiabs} bold borderTop />

                <FsRow label="Stockholders' Equity" isHeader />
                <FsRow label="Retained Earnings (Ending)" value={fin.reEnding} indent />
                {EQUITY.filter(k => k !== 'Retained Earnings').map(acc => (
                  <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} indent />
                ))}
                {CONTRA_EQUITY.map(acc => <FsRow key={acc} label={`Less: ${acc}`} value={getBalance(acc, ledger)} parens indent />)}
                <FsRow label="Total Stockholders' Equity" value={fin.totalEquity} bold borderTop />
              </div>
            </div>

            <div className="mt-6">
              <FsRow 
                label="TOTAL LIAB. & EQUITY" 
                value={fin.totalLiabs + fin.totalEquity} 
                bold 
                doubleUnderline 
                accent 
              />
            </div>
          </div>

          {/* Statement of Cash Flows */}
          <div className="bg-[#0f1724] border border-[#1f2d40] rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-indigo-500 pb-2 mb-3">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest block">STATEMENT 03</span>
                <h3 className="font-bold text-sm text-white uppercase">Cash Flows (Indirect)</h3>
                <span className="text-[10px] text-slate-400 font-mono">Reconciliation of Cash</span>
              </div>

              <div className="space-y-0.5">
                <FsRow label="Operating Activities" isHeader />
                <FsRow label="Net Income" value={fin.netIncome} indent />
                {getBalance("Depreciation Expense", ledger) > 0 && (
                  <FsRow label="+ Depreciation Non-Cash" value={getBalance("Depreciation Expense", ledger)} indent />
                )}
                {getBalance("Accounts Receivable", ledger) > 0 && (
                  <FsRow label="(Increase) in Receivables" value={getBalance("Accounts Receivable", ledger)} parens indent />
                )}
                {getBalance("Inventory", ledger) > 0 && (
                  <FsRow label="(Increase) in Inventory" value={getBalance("Inventory", ledger)} parens indent />
                )}
                {getBalance("Accounts Payable", ledger) > 0 && (
                  <FsRow label="Increase in Payables" value={getBalance("Accounts Payable", ledger)} indent />
                )}
                
                <FsRow 
                  label="Net Cash from Operations" 
                  value={
                    fin.netIncome + 
                    getBalance("Depreciation Expense", ledger) - 
                    getBalance("Accounts Receivable", ledger) - 
                    getBalance("Inventory", ledger) + 
                    getBalance("Accounts Payable", ledger)
                  } 
                  bold 
                  borderTop 
                />

                <FsRow label="Investing Activities" isHeader />
                {getBalance("Equipment", ledger) > 0 ? (
                  <FsRow label="CapEx / Equipment Purchases" value={getBalance("Equipment", ledger)} parens indent />
                ) : (
                  <div className="text-[11px] text-slate-500 italic pl-3 py-1 font-mono">No CapEx investments</div>
                )}

                <FsRow label="Financing Activities" isHeader />
                {getBalance("Common Stock", ledger) > 0 && <FsRow label="Common Stock Issuance" value={getBalance("Common Stock", ledger)} indent />}
                {getBalance("Treasury Stock", ledger) > 0 && <FsRow label="Treasury Share Repurchase" value={getBalance("Treasury Stock", ledger)} parens indent />}
                {getBalance("Retained Earnings", ledger) < 0 && <FsRow label="Dividends Paid" value={Math.abs(getBalance("Retained Earnings", ledger))} parens indent />}
              </div>
            </div>

            <div className="mt-6">
              <FsRow 
                label="ENDING CASH BALANCE" 
                value={fin.cashBalance} 
                bold 
                doubleUnderline 
                accent 
              />
            </div>
          </div>

        </div>
      </div>
      
      {/* Right Column: Deloitte AI Audit & CFO Copilot (4 cols) */}
      <div className="xl:col-span-4 flex flex-col bg-[#0f1724] rounded-xl border border-[#1f2d40] shadow-xl overflow-hidden h-[760px]">
        
        {/* Copilot Header */}
        <div className="p-4 border-b border-[#1f2d40] bg-[#0c121d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#86bc25]/10 border border-[#86bc25]/30 flex items-center justify-center text-[#86bc25]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">ALE Audit Copilot</span>
                <span className="w-2 h-2 rounded-full bg-[#86bc25] animate-pulse"></span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Gemini 2.5 • Live Ledger Context</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-[#162130] px-2 py-0.5 rounded border border-[#25364b]">
            Big 4 Mode
          </span>
        </div>
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-[#182a40] text-white border border-[#2c4769]' 
                  : 'bg-[#090d14] text-slate-200 border border-[#1c293a] shadow-inner'
              }`}>
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#86bc25] mb-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Auditor Insight
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#090d14] text-slate-400 border border-[#1c293a] rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#86bc25] animate-ping"></span>
                <span>Synthesizing GL telemetry & audit rules...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
        
        {/* Suggested Prompts & Input Station */}
        <div className="p-3.5 bg-[#0a0e16] border-t border-[#1f2d40] space-y-3">
          <div>
            <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Info className="w-3 h-3 text-[#86bc25]" />
              Audit Advisory Suggestions:
            </div>
            <div className="flex flex-col gap-1.5">
              {suggs.map(sugg => (
                <button 
                  key={sugg} 
                  onClick={() => handleAiQuery(sugg)}
                  className="text-left px-2.5 py-1.5 text-[11px] bg-[#121b29] hover:bg-[#1a273b] hover:text-white border border-[#223348] hover:border-[#86bc25] rounded-md text-slate-300 transition-all truncate cursor-pointer"
                  disabled={loading}
                >
                  ⚡ {sugg}
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={e => { e.preventDefault(); handleAiQuery(input); }} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask CFO Copilot about your ledger..."
              className="flex-1 bg-[#101724] border border-[#26374d] hover:border-[#384f6d] focus:border-[#86bc25] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-[#86bc25] hover:bg-[#74a51e] text-[#090d14] font-bold px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

