import React from 'react';
import { 
  UserCheck, 
  ExternalLink, 
  GraduationCap, 
  Briefcase, 
  Award,
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function AboutMe() {
  const competencies = [
    { title: "US GAAP & FASB Codification", desc: "Balance sheet reconciliation, 3-statement modeling, accruals, and deferrals." },
    { title: "Autonomous Accounting Systems", desc: "Double-entry rules engine, general ledger transaction processing & validation." },
    { title: "AI-Augmented Audit & Assurance", desc: "Generative AI copilots for going concern evaluation and variance triage." },
    { title: "Financial Ratio Analytics", desc: "Solvency, liquidity, efficiency, and capital structure benchmarking." }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Executive Bio Card */}
      <div className="bg-[#0f1724] rounded-2xl p-8 border border-[#1f2d40] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#86bc25]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#1f2d40]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a293d] to-[#0c1420] border-2 border-[#86bc25] flex items-center justify-center text-white shadow-lg">
              <span className="font-mono text-2xl font-black">CR</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Christian Reveles</h1>
                <span className="w-2.5 h-2.5 rounded-full bg-[#86bc25]"></span>
              </div>
              <p className="text-xs font-mono text-[#86bc25] uppercase tracking-wider font-semibold">
                Accounting & Audit Innovation • University of Arkansas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-300 bg-[#141e2c] px-3.5 py-1.5 rounded-lg border border-[#24364c] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#86bc25]" />
              Sam M. Walton College of Business
            </span>
          </div>
        </div>

        {/* Narrative */}
        <div className="py-6 space-y-4 text-sm leading-relaxed text-slate-300">
          <p>
            I am an accounting scholar at the <strong className="text-white">University of Arkansas</strong> passionate about audit, financial assurance, and leveraging modern software engineering to reinvent traditional accounting workflows. I engineered the <strong className="text-white">Accounting Logic Engine (ALE)</strong> to demonstrate how systematic, programmatic rule engines eliminate repetitive general ledger operations—empowering audit professionals to focus on material risks, strategic advisory, and professional skepticism.
          </p>
          <p>
            By integrating an autonomous double-entry ledger with an enterprise-grade <strong className="text-white">AI CFO & Audit Copilot</strong>, this platform highlights how generative intelligence can serve as a trusted decision-support tool in accounting—accelerating ratio analysis, footnote checks, and GAAP compliance audits.
          </p>
          <p>
            My professional objective is to contribute to a <strong className="text-white">Big 4 Audit & Advisory</strong> practice specializing in digital audit transformation, AI implementation, and technology-driven assurance services.
          </p>
        </div>

        {/* Core Competencies Matrix */}
        <div className="pt-6 border-t border-[#1f2d40]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#86bc25]" />
            Core Focus Areas & Methodologies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencies.map(comp => (
              <div key={comp.title} className="bg-[#090d14] border border-[#1b2636] rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#86bc25] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{comp.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{comp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connect CTAs */}
        <div className="mt-8 pt-6 border-t border-[#1f2d40] flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-mono text-slate-400">Professional Networks:</span>
          <div className="flex flex-wrap gap-3">
            <a 
              href="https://www.linkedin.com/in/christian-reveles-373095324/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#006097] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            
            <a 
              href="https://uark.joinhandshake.com/profiles/christianreveles" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#1a2636] hover:bg-[#233348] text-slate-200 border border-[#2b3e57] hover:border-[#86bc25] text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#86bc25]" />
              <span>Handshake Profile</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}


