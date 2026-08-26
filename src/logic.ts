export const ASSETS = ['Cash', 'Accounts Receivable', 'Inventory', 'Prepaid Expenses', 'Equipment', 'Land', 'Right-of-Use Asset', 'Investment in Securities'];
export const CONTRA_ASSETS = ['Accumulated Depreciation', 'Allowance for Doubtful Accounts', 'Discount on Notes Receivable'];
export const LIABILITIES = ['Accounts Payable', 'Unearned Revenue', 'Wages Payable', 'Interest Payable', 'Dividends Payable', 'Bonds Payable', 'Lease Liability', 'Warranty Liability', 'Payroll Tax Payable', 'Notes Payable'];
export const CONTRA_LIABS = ['Discount on Bonds Payable'];
export const EQUITY = ['Common Stock', 'Retained Earnings', 'APIC', 'Preferred Stock'];
export const CONTRA_EQUITY = ['Treasury Stock'];
export const REVENUE = ['Sales Revenue', 'Service Revenue', 'Interest Revenue', 'Gain on Disposal', 'Unrealized Gain on Trading Sec'];
export const EXPENSES = ['COGS', 'Wages Expense', 'Rent Expense', 'Interest Expense', 'Depreciation Expense', 'Bad Debt Expense', 'Warranty Expense', 'Loss on Impairment', 'General Expense', 'Payroll Tax Expense', 'Loss on Disposal', 'Unrealized Loss on Trading Sec'];

export interface Transaction {
  Event: string;
  Debit: string;
  Credit: string;
  Amount: number;
  Logic: string;
}

export const analyzeTransaction = (desc: string, amount: number): { entries: [string, string, number][], logicNote: string } => {
  const d = desc.toLowerCase();
  let entries: [string, string, number][] = [];
  let logicNote = "";

  if (d.includes("performed services for cash")) {
    entries = [["Cash", "Service Revenue", amount]];
    logicNote = "Revenue Rec: Obligation satisfied.";
  } else if (d.includes("performed services on account")) {
    entries = [["Accounts Receivable", "Service Revenue", amount]];
    logicNote = "Accrual: Revenue earned, payment deferred.";
  } else if (d.includes("collected cash in advance")) {
    entries = [["Cash", "Unearned Revenue", amount]];
    logicNote = "Deferral: Liability established.";
  } else if (d.includes("purchase inventory on account")) {
    entries = [["Inventory", "Accounts Payable", amount]];
    logicNote = "Capitalization at cost.";
  } else if (d.includes("sold inventory on account")) {
    entries = [["Accounts Receivable", "Sales Revenue", amount], ["COGS", "Inventory", amount * 0.6]];
    logicNote = "Matching Principle: Rev & COGS matched.";
  } else if (d.includes("inventory impairment")) {
    entries = [["Loss on Impairment", "Inventory", amount]];
    logicNote = "LCM Conservatism: Write-down to market.";
  } else if (d.includes("pay wages")) {
    entries = [["Wages Expense", "Cash", amount]];
    logicNote = "Expense Rec: Immediate outflow.";
  } else if (d.includes("record payroll tax accrual")) {
    entries = [["Payroll Tax Expense", "Payroll Tax Payable", amount]];
    logicNote = "Matching: Accruing employer tax liability.";
  } else if (d.includes("pay prepaid")) {
    entries = [["Prepaid Expenses", "Cash", amount]];
    logicNote = "Asset created (deferral).";
  } else if (d.includes("record bad debt estimate")) {
    entries = [["Bad Debt Expense", "Allowance for Doubtful Accounts", amount]];
    logicNote = "Matching: Estimating uncollectibles.";
  } else if (d.includes("write-off uncollectible")) {
    entries = [["Allowance for Doubtful Accounts", "Accounts Receivable", amount]];
    logicNote = "Write-off: No P&L impact.";
  } else if (d.includes("purchase equipment")) {
    entries = [["Equipment", "Cash", amount]];
    logicNote = "CapEx: Long-term asset.";
  } else if (d.includes("record depreciation")) {
    entries = [["Depreciation Expense", "Accumulated Depreciation", amount]];
    logicNote = "Allocation over useful life.";
  } else if (d.includes("sell equipment (gain)")) {
    const bv = amount * 0.8;
    const gain = amount - bv;
    entries = [["Cash", "Equipment", bv], ["Cash", "Gain on Disposal", gain]];
    logicNote = "Disposal: Asset derecognized, Gain realized.";
  } else if (d.includes("purchase trading securities")) {
    entries = [["Investment in Securities", "Cash", amount]];
    logicNote = "Asset: Recorded at cost.";
  } else if (d.includes("fair value adj (gain)")) {
    entries = [["Investment in Securities", "Unrealized Gain on Trading Sec", amount]];
    logicNote = "Mark-to-Market: Value increase.";
  } else if (d.includes("issue bonds at discount")) {
    entries = [["Cash", "Bonds Payable", amount * 0.9], ["Discount on Bonds Payable", "Bonds Payable", amount * 0.1]];
    logicNote = "Contra-Liability created.";
  } else if (d.includes("issue common stock")) {
    entries = [["Cash", "Common Stock", amount]];
    logicNote = "Equity Financing.";
  } else if (d.includes("purchase treasury stock")) {
    entries = [["Treasury Stock", "Cash", amount]];
    logicNote = "Contra-Equity: Reducing shares outstanding.";
  } else if (d.includes("declare cash dividend")) {
    entries = [["Retained Earnings", "Dividends Payable", amount]];
    logicNote = "Equity Reduction on declaration.";
  } else if (d.includes("pay cash dividend")) {
    entries = [["Dividends Payable", "Cash", amount]];
    logicNote = "Liab settlement.";
  }

  return { entries, logicNote };
}
