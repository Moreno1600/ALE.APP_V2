import React, { useState, useEffect, useRef } from 'react';
import { Transaction, ASSETS, EXPENSES, REVENUE, LIABILITIES, CONTRA_ASSETS, CONTRA_LIABS, EQUITY, CONTRA_EQUITY } from '../logic';
import { getBalance, generateFinancials, generateSuggestions } from '../financials';

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
  
  const [messages, setMessages] = useState<Message[]>([]);
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
      setMessages([...newMessages, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const FsRow = ({ label, value, parens = false, bold = false, borderTop = false }: { label: string, value: number, parens?: boolean, bold?: boolean, borderTop?: boolean }) => {
    if (value === 0 && !bold) return null;
    const formatted = Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const displayValue = parens || value < 0 ? `($${formatted})` : `$${formatted}`;
    
    return (
      <div className={`flex justify-between py-2 border-b border-slate-700 ${bold ? 'font-bold' : ''} ${borderTop ? 'border-t-2 border-t-slate-100' : ''}`}>
        <span>{label}</span>
        <span className="font-mono">{displayValue}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-[2] grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Income Statement */}
        <div className="space-y-4">
          <h3 className="font-bold text-blue-500 uppercase tracking-wider text-sm border-b border-slate-700 pb-2">Income Statement</h3>
          <div>
            <div className="font-semibold text-slate-400 mb-2">REVENUES</div>
            {REVENUE.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} />)}
          </div>
          <div className="mt-4">
            <div className="font-semibold text-slate-400 mb-2">EXPENSES</div>
            {EXPENSES.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} />)}
          </div>
          <div className="mt-4 pt-2 border-t-2 border-t-slate-100 border-b-4 border-b-double border-b-slate-100">
            <FsRow label="NET INCOME" value={fin.netIncome} bold />
          </div>
        </div>

        {/* Balance Sheet */}
        <div className="space-y-4">
          <h3 className="font-bold text-blue-500 uppercase tracking-wider text-sm border-b border-slate-700 pb-2">Balance Sheet</h3>
          <div>
            <div className="font-semibold text-slate-400 mb-2">ASSETS</div>
            {ASSETS.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} />)}
            {CONTRA_ASSETS.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} parens />)}
            <FsRow label="TOTAL ASSETS" value={fin.totalAssets} bold borderTop />
          </div>
          <div className="mt-4">
            <div className="font-semibold text-slate-400 mb-2">LIABILITIES</div>
            {LIABILITIES.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} />)}
            {CONTRA_LIABS.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} parens />)}
          </div>
          <div className="mt-4">
            <div className="font-semibold text-slate-400 mb-2">EQUITY</div>
            <FsRow label="Retained Earnings" value={fin.reEnding} />
            {EQUITY.filter(k => k !== 'Retained Earnings').map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} />)}
            {CONTRA_EQUITY.map(acc => <FsRow key={acc} label={acc} value={getBalance(acc, ledger)} parens />)}
            <div className="mt-4 pt-2 border-t-2 border-t-slate-100 border-b-4 border-b-double border-b-slate-100">
              <FsRow label="TOTAL LIAB & EQ" value={fin.totalLiabs + fin.totalEquity} bold />
            </div>
          </div>
          
          <div className={`mt-6 p-3 rounded-lg text-center font-bold text-sm border ${Math.abs(checkDiff) < 0.01 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-red-500/20 text-red-400 border-red-500'}`}>
            {Math.abs(checkDiff) < 0.01 ? 'BALANCED' : `UNBALANCED\nDiff: $${checkDiff.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </div>
        </div>

        {/* Statement of Cash Flows */}
        <div className="space-y-4">
          <h3 className="font-bold text-blue-500 uppercase tracking-wider text-sm border-b border-slate-700 pb-2">Statement of Cash Flows</h3>
          <div>
            <div className="font-semibold text-slate-400 mb-2">OPERATING</div>
            <FsRow label="Net Income" value={fin.netIncome} />
            
            {/* Logic simplified for CF */}
            {getBalance("Depreciation Expense", ledger) > 0 && <FsRow label="+ Depreciation" value={getBalance("Depreciation Expense", ledger)} />}
            {getBalance("Accounts Receivable", ledger) > 0 && <FsRow label="(Inc) in A/R" value={getBalance("Accounts Receivable", ledger)} parens />}
            {getBalance("Inventory", ledger) > 0 && <FsRow label="(Inc) in Inventory" value={getBalance("Inventory", ledger)} parens />}
            {getBalance("Accounts Payable", ledger) > 0 && <FsRow label="Inc in A/P" value={getBalance("Accounts Payable", ledger)} />}
            
            <FsRow label="Net Cash from Ops" value={
              fin.netIncome + 
              getBalance("Depreciation Expense", ledger) - 
              getBalance("Accounts Receivable", ledger) - 
              getBalance("Inventory", ledger) + 
              getBalance("Accounts Payable", ledger)
            } bold borderTop />
          </div>
          
          <div className="mt-4">
            <div className="font-semibold text-slate-400 mb-2">INVESTING</div>
            {getBalance("Equipment", ledger) > 0 && <FsRow label="Purchase Equip" value={getBalance("Equipment", ledger)} parens />}
          </div>
          
          <div className="mt-4">
            <div className="font-semibold text-slate-400 mb-2">FINANCING</div>
            {getBalance("Common Stock", ledger) > 0 && <FsRow label="Issue Stock" value={getBalance("Common Stock", ledger)} />}
            {getBalance("Treasury Stock", ledger) > 0 && <FsRow label="Buy Treasury" value={getBalance("Treasury Stock", ledger)} parens />}
            {getBalance("Retained Earnings", ledger) < 0 && <FsRow label="Divs Paid" value={Math.abs(getBalance("Retained Earnings", ledger))} parens />}
            
            <div className="mt-4 pt-2 border-t-2 border-t-slate-100 border-b-4 border-b-double border-b-slate-100">
              <FsRow label="NET INC IN CASH" value={fin.cashBalance} bold />
            </div>
          </div>
        </div>

      </div>
      
      {/* AI Assistant */}
      <div className="flex-[1] flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden h-[800px]">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="font-bold text-indigo-400 text-xl">AI Assistant</h3>
          <p className="text-sm text-slate-400">Ask questions about your live financial data.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-2 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200 border border-slate-600'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-400 border border-slate-600 rounded-lg px-4 py-2">
                Analyzing books...
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
        
        <div className="p-4 bg-slate-800/50 border-t border-slate-700">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Actions:</div>
          <div className="space-y-2 mb-4">
            {suggs.map(sugg => (
              <button 
                key={sugg} 
                onClick={() => handleAiQuery(sugg)}
                className="w-full text-left px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-md text-slate-200 transition-colors"
                disabled={loading}
              >
                {sugg}
              </button>
            ))}
          </div>
          
          <form onSubmit={e => { e.preventDefault(); handleAiQuery(input); }} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your financials..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
