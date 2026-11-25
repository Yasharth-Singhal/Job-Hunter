import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Printer, 
  FileCheck2, 
  DollarSign, 
  Check, 
  Copy, 
  Building 
} from 'lucide-react';
import { ResumeProfile } from '../types';

interface ContractGeneratorModalProps {
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const ContractGeneratorModal: React.FC<ContractGeneratorModalProps> = ({ profile, onClose }) => {
  const [clientName, setClientName] = useState('Client Organization / Individual');
  const [clientEmail, setClientEmail] = useState('client@example.com');
  const [projectTitle, setProjectTitle] = useState('Video Editing / Full-Stack Web Development Deliverable');
  const [totalFeeINR, setTotalFeeINR] = useState(20000);
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [copied, setCopied] = useState(false);

  const candidateName = profile?.name || 'Yasharth Singhal';
  const candidateEmail = profile?.email || 'yashsinghal6244@gmail.com';
  const candidatePhone = profile?.phone || '9720277774';

  const depositINR = Math.round(totalFeeINR * 0.5);
  const finalINR = totalFeeINR - depositINR;

  const contractText = `FREELANCE SERVICES & MILESTONE AGREEMENT

Effective Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

PARTIES:
1. Service Provider: ${candidateName} (${candidateEmail} | ${candidatePhone})
2. Client: ${clientName} (${clientEmail})

PROJECT SCOPE:
The Service Provider agrees to deliver the following services:
• Project: ${projectTitle}
• Estimated Timeline: ${deliveryDays} Business Days from receipt of upfront milestone deposit.
• Revisions: Includes up to two (2) rounds of reasonable revisions within the agreed scope. Additional scope changes will be billed at standard hourly rates.

COMPENSATION & PAYMENT SCHEDULE:
Total Project Fee: ₹${totalFeeINR.toLocaleString()} INR
1. Milestone 1 (Upfront Deposit): ₹${depositINR.toLocaleString()} INR (50%), payable prior to project commencement.
2. Milestone 2 (Final Delivery): ₹${finalINR.toLocaleString()} INR (50%), payable upon final project review and before source file handover.

INTELLECTUAL PROPERTY & OWNERSHIP:
Upon receipt of 100% full payment, all intellectual property rights, source code, edits, and final deliverables shall transfer entirely to the Client. The Service Provider reserves the right to showcase the work in their professional portfolio.

CONFIDENTIALITY:
Both parties agree to treat proprietary information, credentials, and non-public materials as strictly confidential.

AGREED & ACCEPTED:

Service Provider:
Signature: ${candidateName}
Date: ${new Date().toISOString().split('T')[0]}

Client:
Signature: __________________________ (${clientName})
Date: __________________________`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Freelance Agreement - ${clientName}</title></head>
          <body style="font-family: serif; padding: 50px; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto;">
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 13px;">${contractText}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Freelance Client Contract & Milestone Agreement</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  50% Upfront Guarantee
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Protect your freelance earnings, scope limits, and payment milestones
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Quick Input Parameters */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client / Company Name"
              className="p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Project Title"
              className="p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={totalFeeINR}
                onChange={(e) => setTotalFeeINR(Number(e.target.value))}
                placeholder="Total Fee (INR)"
                className="w-full p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Agreement Preview Box */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Legal-Safe Milestone Contract Text:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {contractText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            Includes 50% upfront deposit and 2 revision rounds cap
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF Agreement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
