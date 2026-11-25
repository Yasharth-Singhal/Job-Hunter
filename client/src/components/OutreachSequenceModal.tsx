import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import axios from 'axios';
import { Job, ResumeProfile } from '../types';

interface OutreachSequenceModalProps {
  job: Job | null;
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const OutreachSequenceModal: React.FC<OutreachSequenceModalProps> = ({ job, profile, onClose }) => {
  if (!job) return null;

  const [sequence, setSequence] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchSequence = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/outreach/sequence', { job });
        if (res.data?.sequence) {
          setSequence(res.data.sequence);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSequence();
  }, [job]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentTouch = sequence[activeStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>3-Step High-Conversion Outreach Sequence</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  35%+ Reply Rate
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {job.title} at {job.company} • Multi-touch recruiter cadence
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cadence Step Selector */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800 bg-zinc-950/40">
          {[
            { step: 0, label: 'Touch 1 (Day 0)', desc: 'Initial Pitch' },
            { step: 1, label: 'Touch 2 (Day 4)', desc: 'Value-Add Insight' },
            { step: 2, label: 'Touch 3 (Day 9)', desc: 'Polite Breakup' }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`flex-1 p-2 rounded-lg text-left transition-all border ${
                activeStep === item.step
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="text-xs font-bold leading-tight">{item.label}</div>
              <div className="text-[10px] text-zinc-500">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-zinc-400">Drafting 3-touch outreach sequence for {job.company}...</p>
            </div>
          ) : !currentTouch ? (
            <div className="py-12 text-center text-xs text-zinc-500">No sequence generated.</div>
          ) : (
            <>
              {/* Timing & Channel Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <strong>Timing:</strong> {currentTouch.dayLabel} via {currentTouch.channel}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {currentTouch.strategyNote}
                </span>
              </div>

              {/* Subject Line */}
              {currentTouch.subject && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-300">Subject Line:</span>
                    <button
                      onClick={() => copyText(currentTouch.subject, 'subj')}
                      className="text-xs text-emerald-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'subj' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'subj' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-xs font-mono text-zinc-200">{currentTouch.subject}</div>
                </div>
              )}

              {/* Email Content Body */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Outreach Message Body:</span>
                  <button
                    onClick={() => copyText(currentTouch.content, 'body')}
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                  >
                    {copiedKey === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                    <span>{copiedKey === 'body' ? 'Copied Email!' : 'Copy Body'}</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  value={currentTouch.content}
                  rows={10}
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 leading-relaxed resize-none focus:outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Never send more than 3 follow-ups to preserve professional reputation.
          </span>
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
