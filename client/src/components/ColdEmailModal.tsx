import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Linkedin,
  AlertCircle
} from 'lucide-react';
import { Job, UserProfile } from '../types';

interface ColdEmailModalProps {
  job: Job | null;
  profile: UserProfile | null;
  onClose: () => void;
  onMarkEmailed: (job: Job) => void;
}

export const ColdEmailModal: React.FC<ColdEmailModalProps> = ({
  job,
  profile,
  onClose,
  onMarkEmailed
}) => {
  if (!job) return null;

  const [framework, setFramework] = useState<'builder' | 'direct' | 'value'>('builder');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [gmailDraftUrl, setGmailDraftUrl] = useState('');
  const [mailtoUrl, setMailtoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendingSmtp, setSendingSmtp] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<string | null>(null);

  const fetchPitch = async (selectedFramework: 'builder' | 'direct' | 'value') => {
    setLoading(true);
    setSmtpStatus(null);
    try {
      const res = await axios.post('/api/outreach/generate', {
        job,
        framework: selectedFramework
      });
      if (res.data?.success && res.data?.pitch) {
        setSubject(res.data.pitch.subject);
        setBody(res.data.pitch.body);
        setGmailDraftUrl(res.data.pitch.gmailDraftUrl);
        setMailtoUrl(res.data.pitch.mailtoUrl);
      }
    } catch (err) {
      console.error('Failed to generate pitch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPitch(framework);
  }, [job, framework]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGmail = () => {
    window.open(gmailDraftUrl, '_blank');
    onMarkEmailed(job);
  };

  const handleSendSmtp = async () => {
    setSendingSmtp(true);
    setSmtpStatus(null);
    try {
      const toEmail = job.hrContact?.email || `talent@${job.companyDomain || 'company.com'}`;
      const res = await axios.post('/api/outreach/send', {
        to: toEmail,
        subject,
        body
      });
      if (res.data?.success) {
        setSmtpStatus('✅ Dispatched successfully via SMTP!');
        onMarkEmailed(job);
      } else {
        setSmtpStatus(`⚠️ ${res.data?.message || 'SMTP failed. Use 1-Click Gmail Draft instead.'}`);
      }
    } catch (err: any) {
      setSmtpStatus(`⚠️ Error: ${err.message}. Open in Gmail Draft instead.`);
    } finally {
      setSendingSmtp(false);
    }
  };

  const toEmail = job.hrContact?.email || `talent@${job.companyDomain || 'company.com'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Recruiter Outreach Copilot</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  {job.company}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tailored pitch for {job.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Recruiter info banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Target Recruiter:</span>
              <span className="font-semibold text-slate-200 font-mono">{toEmail}</span>
            </div>

            {job.hrContact?.linkedin && (
              <a
                href={job.hrContact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>Search Recruiters on LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Framework selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pitch Strategy Framework
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFramework('builder')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                  framework === 'builder'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="font-semibold">🛠️ Project Showcase</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Highlights LeadHunter & code</div>
              </button>

              <button
                type="button"
                onClick={() => setFramework('direct')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                  framework === 'direct'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="font-semibold">⚡ Direct & Punchy</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Short 3-paragraph format</div>
              </button>

              <button
                type="button"
                onClick={() => setFramework('value')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                  framework === 'value'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="font-semibold">💡 Problem Solver</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Focuses on technical value</div>
              </button>
            </div>
          </div>

          {/* Subject field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email Body field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Email Body
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              rows={11}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {smtpStatus && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              {smtpStatus}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Full Pitch'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendSmtp}
              disabled={sendingSmtp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Dispatches via SMTP if configured in .env"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendingSmtp ? 'Sending...' : 'Direct SMTP'}</span>
            </button>

            {/* 1-Click Gmail Draft (Safest & Best) */}
            <button
              type="button"
              onClick={handleOpenGmail}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Open in Gmail (1-Click Draft)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
