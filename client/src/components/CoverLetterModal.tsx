import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileText, Download, Building2, Briefcase, Sparkles } from 'lucide-react';
import axios from 'axios';
import { Job, ResumeProfile, CoverLetter } from '../types';

interface CoverLetterModalProps {
  job: Job | null;
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ job, profile, onClose }) => {
  if (!job) return null;

  const [letterText, setLetterText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/cover-letter/generate', { jobId: job.id });
        if (res.data?.coverLetter) {
          setLetterText(res.data.coverLetter.letterText);
        }
      } catch (err) {
        // Fallback local template
        const candidateName = profile?.name || 'Candidate';
        const skills = (profile?.coreSkills || []).slice(0, 4).join(', ');
        setLetterText(`Dear ${job.company} Hiring Team,\n\nI am writing to express my strong enthusiasm for the ${job.title} role.\nWith experience in ${skills}, I specialize in building robust, performant software applications.\n\nWarm regards,\n${candidateName}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCoverLetter();
  }, [job, profile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([letterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${job.company.replace(/\s+/g, '_')}_${profile?.name?.replace(/\s+/g, '_') || 'Candidate'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Job-Specific Tailored Cover Letter</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Apply
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {job.title} at {job.company} • Mapped directly from your active resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Edit or customize before copying:</span>
            <span className="text-[11px] text-zinc-500 font-mono">100% ATS-friendly text format</span>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <textarea
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              rows={15}
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none shadow-inner"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Download .txt</span>
            </button>
          </div>

          <a
            href={job.directApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 transition-all shadow-sm"
          >
            <span>Proceed to Company Apply Page</span>
          </a>
        </div>
      </div>
    </div>
  );
};
