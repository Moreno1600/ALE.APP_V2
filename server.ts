import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured. Please add it in the AI Studio Settings menu.' });
      }
      
      const { query, financials } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const context = `
You are the CFO (Chief Financial Officer) for this company. 
Here is the current REAL-TIME financial data from the General Ledger:
- Net Income: $${financials.netIncome.toLocaleString('en-US', {minimumFractionDigits: 2})}
- Total Assets: $${financials.totalAssets.toLocaleString('en-US', {minimumFractionDigits: 2})}
- Total Liabilities: $${financials.totalLiabs.toLocaleString('en-US', {minimumFractionDigits: 2})}
- Total Equity: $${financials.totalEquity.toLocaleString('en-US', {minimumFractionDigits: 2})}
- Cash Balance: $${financials.cashBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}

User Question: ${query}

Answer concisely (under 3 sentences unless asked for more). Be professional but helpful. 
Explain the 'Why' behind the numbers. Do NOT use LaTeX formatting.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: context,
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      let errorMsg = error.message || 'Unknown error';
      if (errorMsg.includes('API key not valid') || errorMsg.includes('API_KEY_INVALID') || (error as any).status === 400) {
        errorMsg = 'Invalid Gemini API Key. Please update your GEMINI_API_KEY in the AI Studio Settings menu.';
      } else {
        console.error("AI Error:", error);
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
