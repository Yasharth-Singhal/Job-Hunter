import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  ExternalLink, 
  Copy, 
  Check, 
  GraduationCap, 
  Building2, 
  Sparkles, 
  Lightbulb, 
  Search 
} from 'lucide-react';
import axios from 'axios';
import { Job, ResumeProfile } from '../types';

interface ReferralFinderModalProps {
  job: Job | null;
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const ReferralFinderModal: React.FC<ReferralFinderModalProps> = ({ job, profile, onClose }) => {
  if (!job) return null;

  const [alumniIntel, setAlumniIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/outreach/alumni', { job });
        if (res.data?.alumniIntel) {
          setAlumniIntel(res.data.alumniIntel);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, [job]);

  const handleCopy = () => {
    if (!alumniIntel?.referralPitchNote) return;
    navigator.clipboard.writeText(alumniIntel.referralPitchNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Alumni & Employee Referral Finder</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  4x-8x Higher Odds
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Targeting alumni from <strong>ABESEC Ghaziabad</strong> currently working at <strong>{job.company}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-zinc-400">Searching ABESEC alumni networks for {job.company} engineers...</p>
            </div>
          ) : (
            <>
              {/* LinkedIn Search Action Banner */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-cyan-400" />
                      1-Click LinkedIn Alumni Search Query
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Click below to open LinkedIn filtered to verified Software Engineers at <strong>{job.company}</strong> who graduated from <strong>ABESEC</strong>:
                    </p>
                  </div>
                  <a
                    href={alumniIntel?.linkedinSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm shrink-0"
                  >
                    <span>Search Alumni on LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Pre-written Referral Pitch Note */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">
                    High-Converting Alumni Referral Message:
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                    <span>{copied ? 'Copied Note!' : 'Copy Message'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={alumniIntel?.referralPitchNote}
                  rows={8}
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* Insider Referral Strategy Tips */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Why This Works (The Referral Incentive)
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  {(alumniIntel?.quickTips || []).map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
