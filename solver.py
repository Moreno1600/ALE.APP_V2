import streamlit as st
import pandas as pd
import google.generativeai as genai
import io

# 1
st.set_page_config(
    page_title="ALE | Accounting Logic Engine",
    page_icon="ale_logo.svg",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# 2
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800;900&display=swap');

    .stApp {
        background: radial-gradient(circle at top left, #1e293b, #0f172a);
        color: #f8fafc;
        font-family: 'Open Sans', sans-serif;
    }
    
    header[data-testid="stHeader"] {
        background-color: transparent !important;
        background: transparent !important;
    }
    
    .block-container {
        max-width: 1250px;
        margin: auto;
        padding-top: 2rem;
    }

    div.stButton > button {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white !important;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.95rem;
        height: auto !important;
        padding: 0.6rem 1rem !important;
        width: 100%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.2s;
    }
    
    div.stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
    }

    div.stButton {
        margin-bottom: 8px; 
    }
    
    div[data-testid="stChatInput"] {
        margin-top: 10px !important; 
        padding-top: 0px !important;
    }

    .section-label {
        font-size: 0.85rem;
        color: #94a3b8;
        margin-bottom: 8px;
        margin-top: 5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .stChatMessage {
        background-color: #1e293b;
        border: 1px solid #334155;
        border-radius: 10px;
    }
    div[data-testid="stChatMessageContent"] {
        color: #e2e8f0;
    }
    
    .header-container {
        display: flex;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        margin-bottom: 1rem;
    }
    .ale-logo-text {
        font-size: 3rem;
        font-weight: 900;
        background: linear-gradient(135deg, #ffffff 0%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        letter-spacing: -1px;
        margin-left: 1rem;
    }
    .main-title {
        font-size: 3.5rem;
        font-weight: 900;
        background: linear-gradient(to right, #ffffff, #60a5fa); 
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        letter-spacing: -2px;
    }
    .corporate-subtext {
        font-size: 1.1rem;
        color: #94a3b8;
        font-weight: 400;
    }
    
    .t-account-card {
        background-color: #1e293b;
        padding: 0.8rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        border: 1px solid #334155;
        border-left: 4px solid #3b82f6; 
        display: flex;
        justify-content: space-between;
    }
    .t-account-card.credit { border-left: 4px solid #10b981; }
    .acc-name { font-weight: 600; color: #f8fafc; font-size: 0.95rem; }
    .acc-val { font-family: 'Courier New', monospace; color: #cbd5e1; font-weight: 600; }

    .fs-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #334155; }
    .fs-header { font-weight: 800; color: #3b82f6; margin-top: 1rem; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }
    .fs-total { font-weight: 800; border-top: 2px solid #f8fafc; border-bottom: 4px double #f8fafc; padding: 0.8rem 0; margin-top: 0.5rem; }
    
    .balance-status {
        text-align: center;
        padding: 0.5rem;
        border-radius: 8px;
        margin-top: 1rem;
        font-weight: 700;
        font-size: 0.9rem;
    }
    .status-ok { background-color: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #10b981; }
    .status-err { background-color: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; }

    .ai-header {
        color: #a5b4fc;
        font-weight: 800;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        margin-bottom: 0.2rem;
    }
    
    .profile-card {
        background-color: #1e293b;
        padding: 3rem;
        border-radius: 12px;
        border: 1px solid #334155;
        margin-top: 1rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }
    .profile-header {
        color: #f8fafc;
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #3b82f6;
        display: inline-block;
        padding-bottom: 0.5rem;
    }
    .profile-text { font-size: 1.1rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 2rem; }
    .profile-subtext { color: #94a3b8; font-weight: 600; margin-bottom: 0.5rem; }
    </style>
    """, unsafe_allow_html=True)

# 3
if 'ledger' not in st.session_state:
    st.session_state.ledger = []
    
    st.session_state.ASSETS = ['Cash', 'Accounts Receivable', 'Inventory', 'Prepaid Expenses', 'Equipment', 'Land', 'Right-of-Use Asset', 'Investment in Securities']
    st.session_state.CONTRA_ASSETS = ['Accumulated Depreciation', 'Allowance for Doubtful Accounts', 'Discount on Notes Receivable']
    st.session_state.LIABILITIES = ['Accounts Payable', 'Unearned Revenue', 'Wages Payable', 'Interest Payable', 'Dividends Payable', 'Bonds Payable', 'Lease Liability', 'Warranty Liability', 'Payroll Tax Payable', 'Notes Payable']
    st.session_state.CONTRA_LIABS = ['Discount on Bonds Payable']
    st.session_state.EQUITY = ['Common Stock', 'Retained Earnings', 'APIC', 'Preferred Stock']
    st.session_state.CONTRA_EQUITY = ['Treasury Stock']
    st.session_state.REVENUE = ['Sales Revenue', 'Service Revenue', 'Interest Revenue', 'Gain on Disposal', 'Unrealized Gain on Trading Sec']
    st.session_state.EXPENSES = ['COGS', 'Wages Expense', 'Rent Expense', 'Interest Expense', 'Depreciation Expense', 'Bad Debt Expense', 'Warranty Expense', 'Loss on Impairment', 'General Expense', 'Payroll Tax Expense', 'Loss on Disposal', 'Unrealized Loss on Trading Sec']
    
    all_accs = (st.session_state.ASSETS + st.session_state.CONTRA_ASSETS + 
                st.session_state.LIABILITIES + st.session_state.CONTRA_LIABS + 
                st.session_state.EQUITY + st.session_state.CONTRA_EQUITY + 
                st.session_state.REVENUE + st.session_state.EXPENSES)
    st.session_state.accounts = {acc: 0.0 for acc in all_accs}

if "txn_amount" not in st.session_state: st.session_state.txn_amount = 0.0
if "success_flag" not in st.session_state: st.session_state.success_flag = False

if "messages" not in st.session_state:
    st.session_state.messages = []

# 4
def analyze_transaction(desc, amount):
    desc = desc.lower()
    entries = [] 
    logic_note = ""

    if "performed services for cash" in desc:
        entries = [("Cash", "Service Revenue", amount)]
        logic_note = "Revenue Rec: Obligation satisfied."
    elif "performed services on account" in desc:
        entries = [("Accounts Receivable", "Service Revenue", amount)]
        logic_note = "Accrual: Revenue earned, payment deferred."
    elif "collected cash in advance" in desc:
        entries = [("Cash", "Unearned Revenue", amount)]
        logic_note = "Deferral: Liability established."
    elif "purchase inventory on account" in desc:
        entries = [("Inventory", "Accounts Payable", amount)]
        logic_note = "Capitalization at cost."
    elif "sold inventory on account" in desc:
        entries = [("Accounts Receivable", "Sales Revenue", amount), ("COGS", "Inventory", amount * 0.6)]
        logic_note = "Matching Principle: Rev & COGS matched."
    elif "inventory impairment" in desc:
        entries = [("Loss on Impairment", "Inventory", amount)]
        logic_note = "LCM Conservatism: Write-down to market."
    elif "pay wages" in desc:
        entries = [("Wages Expense", "Cash", amount)]
        logic_note = "Expense Rec: Immediate outflow."
    elif "record payroll tax accrual" in desc:
        entries = [("Payroll Tax Expense", "Payroll Tax Payable", amount)]
        logic_note = "Matching: Accruing employer tax liability."
    elif "pay prepaid" in desc:
        entries = [("Prepaid Expenses", "Cash", amount)]
        logic_note = "Asset created (deferral)."
    elif "record bad debt estimate" in desc:
        entries = [("Bad Debt Expense", "Allowance for Doubtful Accounts", amount)]
        logic_note = "Matching: Estimating uncollectibles."
    elif "write-off uncollectible" in desc:
        entries = [("Allowance for Doubtful Accounts", "Accounts Receivable", amount)]
        logic_note = "Write-off: No P&L impact."
    elif "purchase equipment" in desc:
        entries = [("Equipment", "Cash", amount)]
        logic_note = "CapEx: Long-term asset."
    elif "record depreciation" in desc:
        entries = [("Depreciation Expense", "Accumulated Depreciation", amount)]
        logic_note = "Allocation over useful life."
    elif "sell equipment (gain)" in desc:
        bv = amount * 0.8 
        gain = amount - bv
        entries = [("Cash", "Equipment", bv), ("Cash", "Gain on Disposal", gain)]
        logic_note = "Disposal: Asset derecognized, Gain realized."
    elif "purchase trading securities" in desc:
        entries = [("Investment in Securities", "Cash", amount)]
        logic_note = "Asset: Recorded at cost."
    elif "fair value adj (gain)" in desc:
        entries = [("Investment in Securities", "Unrealized Gain on Trading Sec", amount)]
        logic_note = "Mark-to-Market: Value increase."
    elif "issue bonds at discount" in desc:
        entries = [("Cash", "Bonds Payable", amount * 0.9), ("Discount on Bonds Payable", "Bonds Payable", amount * 0.1)]
        logic_note = "Contra-Liability created."
    elif "issue common stock" in desc:
        entries = [("Cash", "Common Stock", amount)]
        logic_note = "Equity Financing."
    elif "purchase treasury stock" in desc:
        entries = [("Treasury Stock", "Cash", amount)]
        logic_note = "Contra-Equity: Reducing shares outstanding."
    elif "declare cash dividend" in desc:
        entries = [("Retained Earnings", "Dividends Payable", amount)]
        logic_note = "Equity Reduction on declaration."
    elif "pay cash dividend" in desc:
        entries = [("Dividends Payable", "Cash", amount)]
        logic_note = "Liab settlement."
    
    return entries, logic_note

def submit_transaction():
    selected_desc = st.session_state.trans_type
    amount = st.session_state.txn_amount
    valid = amount > 0

    if valid:
        je_list, note = analyze_transaction(selected_desc, amount)
        if not je_list: return 
        
        for dr, cr, amt in je_list:
            if dr in st.session_state.accounts: st.session_state.accounts[dr] += amt
            if cr in st.session_state.accounts: st.session_state.accounts[cr] += amt 
            
            st.session_state.ledger.append({
                "Event": selected_desc, 
                "Debit": dr, 
                "Credit": cr, 
                "Amount": amt, 
                "Logic": note
            })
        
        st.session_state.txn_amount = 0.0
        st.session_state.success_flag = True

def clear_ledger():
    st.session_state.ledger = []
    st.session_state.txn_amount = 0.0
    st.session_state.messages = [] 
    for k in st.session_state.accounts: st.session_state.accounts[k] = 0.0

def get_balance(acc):
    debit_sum = sum(txn['Amount'] for txn in st.session_state.ledger if txn['Debit'] == acc)
    credit_sum = sum(txn['Amount'] for txn in st.session_state.ledger if txn['Credit'] == acc)
    
    is_debit_normal = (acc in st.session_state.ASSETS or 
                       acc in st.session_state.EXPENSES or 
                       acc in st.session_state.CONTRA_LIABS or 
                       acc in st.session_state.CONTRA_EQUITY)
                       
    if is_debit_normal:
        return debit_sum - credit_sum 
    else:
        return credit_sum - debit_sum

def generate_financials():
    revs = sum(get_balance(k) for k in st.session_state.REVENUE)
    exps = sum(get_balance(k) for k in st.session_state.EXPENSES)
    net_income = revs - exps
    
    total_assets = sum(get_balance(k) for k in st.session_state.ASSETS) - sum(get_balance(k) for k in st.session_state.CONTRA_ASSETS)
    total_liabs = sum(get_balance(k) for k in st.session_state.LIABILITIES) - sum(get_balance(k) for k in st.session_state.CONTRA_LIABS)
    
    re_ledger_balance = get_balance('Retained Earnings') 
    re_ending = net_income + re_ledger_balance
    
    base_equity = sum(get_balance(k) for k in st.session_state.EQUITY if k != 'Retained Earnings')
    treasury_stock = sum(get_balance(k) for k in st.session_state.CONTRA_EQUITY)
    total_equity = base_equity + re_ending - treasury_stock
    
    return {
        "net_income": net_income,
        "total_rev": revs,
        "total_exp": exps,
        "total_assets": total_assets,
        "total_liabs": total_liabs,
        "total_equity": total_equity,
        "re_ending": re_ending,
        "cash_balance": get_balance("Cash")
    }

def safe_progress(val):
    if val < 0.0: return 0.0
    if val > 1.0: return 1.0
    return val

# 5
def generate_suggestions(fin):
    suggestions = []
    
    if fin['net_income'] < 0:
        suggestions.append("Why is Net Income negative?")
    elif fin['net_income'] > 0:
        suggestions.append("What is driving profitability?")
    else:
        suggestions.append("Analyze my performance")

    if fin['cash_balance'] < 0:
        suggestions.append("How to fix negative cash?")
    elif fin['cash_balance'] > fin['total_assets'] * 0.5:
        suggestions.append("Is my cash balance too high?")
    else:
        suggestions.append("Explain my Cash Flow")

    if fin['total_liabs'] == 0 and fin['total_assets'] > 0:
        suggestions.append("Why do I have no debt?")
    elif fin['total_liabs'] > fin['total_equity']:
        suggestions.append("Is my leverage too high?")
    else:
        suggestions.append("Analyze my Solvency")
        
    return suggestions[:3]

def handle_ai_query(user_query, fin_data):
    st.session_state.messages.append({"role": "user", "content": user_query})
    
    if "GEMINI_API_KEY" not in st.secrets:
        st.error("Please add GEMINI_API_KEY to secrets.toml")
        return

    try:
        genai.configure(api_key=st.secrets["GEMINI_API_KEY"])
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        context = f"""
        You are the CFO (Chief Financial Officer) for this company. 
        Here is the current REAL-TIME financial data from the General Ledger:
        - Net Income: ${fin_data['net_income']:,.2f}
        - Total Assets: ${fin_data['total_assets']:,.2f}
        - Total Liabilities: ${fin_data['total_liabs']:,.2f}
        - Total Equity: ${fin_data['total_equity']:,.2f}
        - Cash Balance: ${fin_data['cash_balance']:,.2f}
        
        User Question: {user_query}
        
        Answer concisely (under 3 sentences unless asked for more). Be professional but helpful. 
        Explain the 'Why' behind the numbers. Do NOT use LaTeX formatting.
        """
        
        with st.spinner("Analyzing books..."):
            response = model.generate_content(context)
            bot_reply = response.text.replace("$", "\\$")
            
        st.session_state.messages.append({"role": "assistant", "content": bot_reply})
        
    except Exception as e:
        st.error(f"AI Error: {str(e)}")

# 6
st.markdown("""
<div class="header-container">
    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M50 10 L10 90 L90 90 Z" fill="transparent" stroke="#3b82f6" stroke-width="8"/>
       <path d="M50 25 L25 75 L75 75 Z" fill="#3b82f6"/>
    </svg>
    <span class="ale-logo-text">ALE</span>
</div>
<div class="main-title">Accounting Logic Engine</div>
<div class="corporate-subtext">GAAP Compliant | Real time Financial Reporting | AI-Powered</div>
""", unsafe_allow_html=True)

tab_dash, tab_fs, tab_ratios, tab_about = st.tabs(["ENTRY DASHBOARD", "FINANCIAL STATEMENTS", "RATIO ANALYSIS", "ABOUT ME"])

# 7
with tab_dash:
    c1, c2 = st.columns([1, 2])
    with c1:
        st.subheader("Entry Engine")
        
        opts = [
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
        ]
        
        sel = st.selectbox("Select Event", opts, key="trans_type")
        st.number_input("Amount ($)", min_value=0.0, step=100.0, key="txn_amount")
        
        if "---" in sel:
            st.button("Post Entry", disabled=True)
        else:
            st.button("Post Entry", type="primary", on_click=submit_transaction)
        
        if st.session_state.success_flag:
            st.success("Posted to General Ledger")
            st.session_state.success_flag = False
            
        st.markdown("---")
        if st.session_state.ledger:
            df = pd.DataFrame(st.session_state.ledger)
            csv = df.to_csv(index=False).encode('utf-8')
            st.download_button("Download Ledger (CSV)", data=csv, file_name="ALE_General_Ledger.csv", mime="text/csv")
            
        st.button("Reset System", type="secondary", on_click=clear_ledger)
            
    with c2:
        st.subheader("Live T-Accounts")
        if not st.session_state.ledger:
            st.info("Awaiting Transactions...")
        else:
            t_col1, t_col2 = st.columns(2)
            with t_col1:
                st.markdown("**ASSETS & EXPENSES (Dr)**")
                dr_list = (st.session_state.ASSETS + st.session_state.EXPENSES + 
                           st.session_state.CONTRA_LIABS + st.session_state.CONTRA_EQUITY)
                for acc in dr_list:
                    bal = get_balance(acc)
                    if abs(bal) > 0:
                        st.markdown(f'<div class="t-account-card"><span class="acc-name">{acc}</span><span class="acc-val">${bal:,.2f}</span></div>', unsafe_allow_html=True)
            with t_col2:
                st.markdown("**LIABILITIES, EQUITY, REV (Cr)**")
                cr_list = (st.session_state.LIABILITIES + st.session_state.EQUITY + 
                           st.session_state.REVENUE + st.session_state.CONTRA_ASSETS)
                for acc in cr_list:
                    bal = get_balance(acc)
                    if abs(bal) > 0:
                        st.markdown(f'<div class="t-account-card credit"><span class="acc-name">{acc}</span><span class="acc-val">${bal:,.2f}</span></div>', unsafe_allow_html=True)

fin = generate_financials()

# 8
with tab_fs:
    col_fin, col_chat = st.columns([2, 1])

    with col_fin:
        col_is, col_bs, col_cf = st.columns(3)
        with col_is:
            st.markdown('<div class="fs-header">Income Statement</div>', unsafe_allow_html=True)
            st.markdown("**REVENUES**")
            for k in st.session_state.REVENUE:
                val = get_balance(k)
                if val != 0: st.markdown(f'<div class="fs-row"><span>{k}</span><span>${val:,.2f}</span></div>', unsafe_allow_html=True)
            st.markdown("<br>**EXPENSES**", unsafe_allow_html=True)
            for k in st.session_state.EXPENSES:
                val = get_balance(k)
                if val != 0: st.markdown(f'<div class="fs-row"><span>{k}</span><span>${val:,.2f}</span></div>', unsafe_allow_html=True)
            st.markdown(f'<div class="fs-total"><div class="fs-row"><span>NET INCOME</span><span>${fin["net_income"]:,.2f}</span></div></div>', unsafe_allow_html=True)

        with col_bs:
            st.markdown('<div class="fs-header">Balance Sheet</div>', unsafe_allow_html=True)
            st.markdown("**ASSETS**")
            for k in st.session_state.ASSETS:
                val = get_balance(k)
                if val != 0: st.markdown(f'<div class="fs-row"><span>{k}</span><span>${val:,.2f}</span></div>', unsafe_allow_html=True)
            for k in st.session_state.CONTRA_ASSETS:
                val = get_balance(k) 
                if val != 0: st.markdown(f'<div class="fs-row"><span>{k}</span><span>(${val:,.2f})</span></div>', unsafe_allow_html=True)
            st.markdown(f'<div class="fs-row" style="font-weight:bold; border-top:1px solid white;"><span>TOTAL ASSETS</span><span>${fin["total_assets"]:,.2f}</span></div>', unsafe_allow_html=True)
            
            st.markdown("<br>**LIABILITIES**", unsafe_allow_html=True)
            for k in st.session_state.LIABILITIES:
                val = get_balance(k)
                if val != 0: st.markdown(f'<div class="fs-row"><span>{k}</span><span>${val:,.2f}</span></div>', unsafe_allow_html=True)
            for k in st.session_state.CONTRA_LIABS:
                val = get_balance(k)
                if val != 0: st.markdown(f'<div class="fs-row"><span>{k}</span><span>(${val:,.2f})</span></div>', unsafe_allow_html=True)
            
            st.markdown("<br>**EQUITY**", unsafe_allow_html=True)
            st.markdown(f'<div class="fs-row"><span>Retained Earnings</span><span>${fin["re_ending"]:,.2f}</span></div>', unsafe_allow_html=True)
            for k in st.session_state.EQUITY:
                if k != "Retained Earnings": 
                    val = get_balance(k)
                    if val != 0: st.markdown(f'<div class="fs-row"><span>{k}</span><span>${val:,.2f}</span></div>', unsafe_allow_html=True)
            for k in st.session_state.CONTRA_EQUITY:
                val = get_balance(k)
                if val != 0: st.markdown(f'<div class="fs-row"><span>{k}</span><span>(${val:,.2f})</span></div>', unsafe_allow_html=True)
            
            st.markdown(f'<div class="fs-total"><div class="fs-row"><span>TOTAL LIAB & EQ</span><span>${(fin["total_liabs"] + fin["total_equity"]):,.2f}</span></div></div>', unsafe_allow_html=True)
            
            check_diff = fin["total_assets"] - (fin["total_liabs"] + fin["total_equity"])
            if round(check_diff, 2) == 0:
                st.markdown('<div class="balance-status status-ok"> BALANCED</div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="balance-status status-err"> UNBALANCED<br>Diff: ${check_diff:,.2f}</div>', unsafe_allow_html=True)

        with col_cf:
            st.markdown('<div class="fs-header">Statement of Cash Flows</div>', unsafe_allow_html=True)
            st.markdown("**OPERATING**")
            st.markdown(f'<div class="fs-row"><span>Net Income</span><span>${fin["net_income"]:,.2f}</span></div>', unsafe_allow_html=True)
            deprec = get_balance("Depreciation Expense")
            if deprec > 0: st.markdown(f'<div class="fs-row"><span>+ Depreciation</span><span>${deprec:,.2f}</span></div>', unsafe_allow_html=True)
            wc_change = 0
            ar_change = get_balance("Accounts Receivable")
            if ar_change > 0: 
                st.markdown(f'<div class="fs-row"><span>(Inc) in A/R</span><span>(${ar_change:,.2f})</span></div>', unsafe_allow_html=True)
                wc_change -= ar_change
            inv_change = get_balance("Inventory")
            if inv_change > 0: 
                st.markdown(f'<div class="fs-row"><span>(Inc) in Inventory</span><span>(${inv_change:,.2f})</span></div>', unsafe_allow_html=True)
                wc_change -= inv_change
            ap_change = get_balance("Accounts Payable")
            if ap_change > 0: 
                st.markdown(f'<div class="fs-row"><span>Inc in A/P</span><span>${ap_change:,.2f}</span></div>', unsafe_allow_html=True)
                wc_change += ap_change
            cfo = fin["net_income"] + deprec + wc_change
            st.markdown(f'<div class="fs-row" style="font-weight:bold; border-top:1px solid white;"><span>Net Cash from Ops</span><span>${cfo:,.2f}</span></div>', unsafe_allow_html=True)
            st.markdown("<br>**INVESTING**", unsafe_allow_html=True)
            cfi = 0
            equip = get_balance("Equipment")
            if equip > 0:
                st.markdown(f'<div class="fs-row"><span>Purchase Equip</span><span>(${equip:,.2f})</span></div>', unsafe_allow_html=True)
                cfi -= equip
            st.markdown("<br>**FINANCING**", unsafe_allow_html=True)
            cff = 0
            stock = get_balance("Common Stock")
            if stock > 0:
                st.markdown(f'<div class="fs-row"><span>Issue Stock</span><span>${stock:,.2f}</span></div>', unsafe_allow_html=True)
                cff += stock
            t_stock = get_balance("Treasury Stock")
            if t_stock > 0:
                 st.markdown(f'<div class="fs-row"><span>Buy Treasury</span><span>(${t_stock:,.2f})</span></div>', unsafe_allow_html=True)
                 cff -= t_stock
            divs_activity = get_balance("Retained Earnings") 
            if divs_activity < 0:
                 st.markdown(f'<div class="fs-row"><span>Divs Paid</span><span>(${abs(divs_activity):,.2f})</span></div>', unsafe_allow_html=True)
                 cff += divs_activity 
            net_cash = cfo + cfi + cff
            st.markdown(f'<div class="fs-total"><div class="fs-row"><span>NET INC IN CASH</span><span>${net_cash:,.2f}</span></div></div>', unsafe_allow_html=True)
    
    with col_chat:
        st.markdown('<div class="ai-header">AI Assistant</div>', unsafe_allow_html=True)
        st.caption("Ask questions about your live financial data.")

        chat_container = st.container()
        with chat_container:
            for message in st.session_state.messages:
                with st.chat_message(message["role"]):
                    st.markdown(message["content"])

        suggs = generate_suggestions(fin)
        
        st.markdown('<div class="section-label">SUGGESTED ACTIONS:</div>', unsafe_allow_html=True)
        
        if st.button(suggs[0], use_container_width=True):
            handle_ai_query(suggs[0], fin)
            st.rerun()
        if st.button(suggs[1], use_container_width=True):
            handle_ai_query(suggs[1], fin)
            st.rerun()
        if st.button(suggs[2], use_container_width=True):
            handle_ai_query(suggs[2], fin)
            st.rerun()

        if prompt := st.chat_input("Ask about your financials..."):
            handle_ai_query(prompt, fin)
            st.rerun()

# 9
with tab_ratios:
    st.subheader("Financial Ratios Dashboard")
    ca = get_balance("Cash") + get_balance("Accounts Receivable") + get_balance("Inventory") + get_balance("Prepaid Expenses")
    cl = get_balance("Accounts Payable") + get_balance("Unearned Revenue") + get_balance("Wages Payable") + get_balance("Interest Payable") + get_balance("Dividends Payable") + get_balance("Warranty Liability")
    r1, r2, r3 = st.columns(3)
    with r1:
        st.markdown("#### Current Ratio")
        st.caption("Liquidity Check (Target > 1.5)")
        ratio_curr = ca / cl if cl > 0 else 0.0
        st.metric("Ratio", f"{ratio_curr:.2f}")
        st.progress(safe_progress(ratio_curr / 3))
    with r2:
        st.markdown("#### Profit Margin")
        st.caption("Net Income / Net Sales")
        sales = fin["total_rev"]
        margin = (fin["net_income"] / sales * 100) if sales > 0 else 0.0
        st.metric("Margin", f"{margin:.1f}%")
        st.progress(safe_progress(margin / 100))
    with r3:
        st.markdown("#### Debt-to-Equity")
        st.caption("Leverage (Total Liabs / Total Equity)")
        dte = fin["total_liabs"] / fin["total_equity"] if fin["total_equity"] > 0 else 0.0
        st.metric("D/E Ratio", f"{dte:.2f}")
        st.progress(safe_progress(dte / 2))

# 10
with tab_about:
    st.markdown("""
    <div class="profile-card">
        <div class="profile-header">Hi, my name is Christian Reveles.</div>
        <div class="profile-text">
            I’m an accounting student at the University of Arkansas and I’m passionate about audit, financial reporting, and using technology to make accounting easier. I built <b>Accounting Logic Engine (ALE)</b> to better understand how accounting works in practice and to automate repetitive tasks so people can focus on the important stuff like analyzing numbers and identifying risk.
            <br><br>
            I added an AI assistant that lets users ask questions about live financial data. My goal is to explore how AI can support accountants and auditors, not replace them, and help them spend more time on judgment and decision making.
            <br><br>
            I enjoy using Python to turn complex accounting rules into practical systems and I’m aiming to work in a Big 4 environment focused on AI-enabled audit or accounting technology where I can help modernize how audits are done and continue learning as an accountant.
        </div>
        <div class="profile-subtext">Connect with me:</div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("###")
    col_links1, col_links2, _ = st.columns([1, 1, 2])
    with col_links1:
        st.link_button("LinkedIn: Christian Reveles", "https://www.linkedin.com/in/christian-reveles-373095324/") 
    with col_links2:
        st.link_button("Handshake: Christian Reveles", "https://uark.joinhandshake.com/profiles/christianreveles")