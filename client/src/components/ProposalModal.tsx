import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Send, ExternalLink, DollarSign, Clock } from 'lucide-react';
import { Gig, ResumeProfile } from '../types';
import axios from 'axios';

interface ProposalModalProps {
  gig: Gig | null;
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ gig, profile, onClose }) => {
  if (!gig) return null;

  const [proposal, setProposal] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/gigs/proposal', { gigId: gig.id });
        if (res.data?.proposal) {
          setProposal(res.data.proposal);
        }
      } catch (err) {
        // Fallback local template
        const candidateName = profile?.name || 'Candidate';
        setProposal(`Hi there,\n\nI saw your posting for "${gig.title}" and would love to work on this with you.\n\nWith experience in ${gig.matchedSkills.join(', ')}, I can deliver top quality results quickly.\nPortfolio: ${profile?.portfolioUrl || 'https://yasharth.dev'}\n\nLooking forward to speaking with you!\n\nBest,\n${candidateName}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [gig, profile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-semibold text-white">Custom Freelance Pitch / Proposal</h2>
              <p className="text-xs text-zinc-400 mt-0.5">{gig.title} • {gig.clientOrPlatform}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gig Info Bar */}
        <div className="px-5 py-2.5 bg-zinc-950/50 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300">
          <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
            <DollarSign className="w-3.5 h-3.5" /> Payout: {gig.payout}
          </span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Clock className="w-3.5 h-3.5" /> Timeline: {gig.estimatedHours}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono capitalize">
            {gig.category.replace('-', ' ')}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Tailored Pitch (Ready to paste on Upwork / Freelancer / Direct Message):</span>
            <span className="text-[11px] text-zinc-500">Editable below</span>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              rows={12}
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-600 leading-relaxed resize-none shadow-inner"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Proposal'}</span>
          </button>

          <a
            href={gig.directApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 transition-all shadow-sm"
          >
            <span>Open Gig Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
