import React from 'react';

export default function AboutMe() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl max-w-4xl">
        <h2 className="text-3xl font-extrabold text-slate-100 mb-6 border-b-2 border-blue-500 pb-2 inline-block">
          Hi, my name is Christian Reveles.
        </h2>
        
        <div className="text-lg leading-relaxed text-slate-300 space-y-6 mb-8">
          <p>
            I’m an accounting student at the University of Arkansas and I’m passionate about audit, financial reporting, and using technology to make accounting easier. I built <b>Accounting Logic Engine (ALE)</b> to better understand how accounting works in practice and to automate repetitive tasks so people can focus on the important stuff like analyzing numbers and identifying risk.
          </p>
          <p>
            I added an AI assistant that lets users ask questions about live financial data. My goal is to explore how AI can support accountants and auditors, not replace them, and help them spend more time on judgment and decision making.
          </p>
          <p>
            I enjoy using Python to turn complex accounting rules into practical systems and I’m aiming to work in a Big 4 environment focused on AI-enabled audit or accounting technology where I can help modernize how audits are done and continue learning as an accountant.
          </p>
        </div>
        
        <div>
          <div className="text-slate-400 font-semibold mb-4">Connect with me:</div>
          <div className="flex gap-4">
            <a 
              href="https://www.linkedin.com/in/christian-reveles-373095324/" 
              target="_blank" rel="noreferrer"
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              LinkedIn: Christian Reveles
            </a>
            <a 
              href="https://uark.joinhandshake.com/profiles/christianreveles" 
              target="_blank" rel="noreferrer"
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Handshake: Christian Reveles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
