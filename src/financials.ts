import { Transaction, ASSETS, EXPENSES, CONTRA_LIABS, CONTRA_EQUITY, REVENUE, LIABILITIES, CONTRA_ASSETS, EQUITY } from './logic';

export const getBalance = (acc: string, ledger: Transaction[]) => {
  const debitSum = ledger.filter(t => t.Debit === acc).reduce((sum, t) => sum + t.Amount, 0);
  const creditSum = ledger.filter(t => t.Credit === acc).reduce((sum, t) => sum + t.Amount, 0);

  const isDebitNormal = ASSETS.includes(acc) || EXPENSES.includes(acc) || CONTRA_LIABS.includes(acc) || CONTRA_EQUITY.includes(acc);

  return isDebitNormal ? debitSum - creditSum : creditSum - debitSum;
};

export const generateFinancials = (ledger: Transaction[]) => {
  const sumList = (list: string[]) => list.reduce((sum, acc) => sum + getBalance(acc, ledger), 0);

  const revs = sumList(REVENUE);
  const exps = sumList(EXPENSES);
  const netIncome = revs - exps;

  const totalAssets = sumList(ASSETS) - sumList(CONTRA_ASSETS);
  const totalLiabs = sumList(LIABILITIES) - sumList(CONTRA_LIABS);

  const reLedgerBalance = getBalance('Retained Earnings', ledger);
  const reEnding = netIncome + reLedgerBalance;

  const baseEquity = EQUITY.filter(k => k !== 'Retained Earnings').reduce((sum, acc) => sum + getBalance(acc, ledger), 0);
  const treasuryStock = sumList(CONTRA_EQUITY);
  const totalEquity = baseEquity + reEnding - treasuryStock;

  return {
    netIncome,
    totalRev: revs,
    totalExp: exps,
    totalAssets,
    totalLiabs,
    totalEquity,
    reEnding,
    cashBalance: getBalance("Cash", ledger)
  };
};

export const generateSuggestions = (fin: ReturnType<typeof generateFinancials>) => {
  const suggestions = [];
  
  if (fin.netIncome < 0) {
    suggestions.push("Why is Net Income negative?");
  } else if (fin.netIncome > 0) {
    suggestions.push("What is driving profitability?");
  } else {
    suggestions.push("Analyze my performance");
  }

  if (fin.cashBalance < 0) {
    suggestions.push("How to fix negative cash?");
  } else if (fin.cashBalance > fin.totalAssets * 0.5) {
    suggestions.push("Is my cash balance too high?");
  } else {
    suggestions.push("Explain my Cash Flow");
  }

  if (fin.totalLiabs === 0 && fin.totalAssets > 0) {
    suggestions.push("Why do I have no debt?");
  } else if (fin.totalLiabs > fin.totalEquity) {
    suggestions.push("Is my leverage too high?");
  } else {
    suggestions.push("Analyze my Solvency");
  }
      
  return suggestions.slice(0, 3);
};
