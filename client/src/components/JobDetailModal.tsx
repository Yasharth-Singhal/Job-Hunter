import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Linkedin, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  Building2, 
  MapPin, 
  DollarSign, 
  Send, 
  HelpCircle, 
  ShieldCheck, 
  MessageSquare,
  Bookmark,
  Share2,
  TrendingUp
} from 'lucide-react';
import { Job, ResumeProfile } from '../types';

interface JobDetailModalProps {
  job: Job | null;
  profile: ResumeProfile | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  onBookmark: (job: Job) => void;
  onWillApply: (job: Job) => void;
  isBookmarked: boolean;
  isWillApply: boolean;
  onOpenPrepChart?: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  profile,
  onClose,
  onApply,
  onBookmark,
  onWillApply,
  isBookmarked,
  isWillApply,
  onOpenPrepChart
}) => {
  if (!job) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'audit' | 'interview' | 'recruiter'>('details');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const audit = job.hrAudit;
  const interview = job.interviewPrep;
  const hiring = job.hiringTeam;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                  {job.source} Verified
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize">
                  {job.workplaceType}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize">
                  {job.experienceLevel} Tier
                </span>
                {job.salary && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-950 text-emerald-400 border border-zinc-800 font-mono">
                    💰 {job.salary}
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {job.title}
              </h2>

              <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-200 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  {job.company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {job.location}
                </span>
              </div>

              {/* Resume & Profile Match Banner */}
              <div className="mt-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-emerald-400 font-mono">{job.matchScore}% Match</span>
                    <span className="text-xs text-zinc-300 font-medium">with {profile?.name || 'Your Profile'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      {job.matchScore >= 90 ? '🔥 High Probability Interview Call' : 'Solid Profile Alignment'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Calculated from your tech stack ({profile?.coreSkills?.slice(0, 5).join(', ')}), {profile?.experienceLevel || 'Junior'} experience tier, and target roles.
                  </p>
                </div>
                <div className="w-full sm:w-48 shrink-0">
                  <div className="flex justify-between text-[10px] text-zinc-500 mb-1 font-mono">
                    <span>ATS Readiness</span>
                    <span className="text-emerald-400 font-bold">{job.matchScore}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${job.matchScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                activeTab === 'details'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Description & Salary</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                activeTab === 'audit'
                  ? 'bg-zinc-800 text-emerald-400 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>HR Resume Roaster & ATS Changes</span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                activeTab === 'interview'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Interview Helper (STAR Q&A)</span>
            </button>

            <button
              onClick={() => setActiveTab('recruiter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                activeTab === 'recruiter'
                  ? 'bg-zinc-800 text-blue-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              <span>Recruiter & LinkedIn Intel</span>
            </button>

            {onOpenPrepChart && (
              <button
                onClick={() => onOpenPrepChart(job)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>📊 Prep Roadmap Chart</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* TAB 1: FULL JOB DESCRIPTION & COMPENSATION */}
          {activeTab === 'details' && (
            <div className="space-y-5 leading-relaxed text-zinc-300">
              {/* Compensation Card */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase font-mono tracking-wider font-semibold">
                    Compensation & CTC Band
                  </div>
                  <div className="text-base font-bold text-white mt-0.5 font-mono">
                    {job.salary || 'Competitive Industry Benchmark'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={job.directApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onApply(job)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 transition-all shadow-md"
                  >
                    <span>Direct Apply on {job.company}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Role Overview</h3>
                <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
                  {job.fullDescription}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Core Responsibilities</h3>
                  <ul className="space-y-1.5">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-300">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Technical Qualifications</h3>
                  <ul className="space-y-1.5">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-300">
                        <span className="text-zinc-500 font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <h3 className="text-xs font-bold text-white mb-2 uppercase font-mono tracking-wider">
                    Company Benefits & Culture
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
                    {job.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HR RESUME ROASTER & ATS CHANGES */}
          {activeTab === 'audit' && audit && (
            <div className="space-y-5">
              {/* Verdict Banner */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ATS Match Score: {audit.atsScore}%
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {audit.verdict}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 max-w-xl">
                    {audit.hrSummary}
                  </p>
                </div>
              </div>

              {/* Missing Keywords To Add Before Applying */}
              {audit.criticalKeywordsToAdd.length > 0 && (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-300 font-semibold text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Missing Keywords To Insert In Your Resume Before Applying:</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Adding these exact terms to your skills section will prevent automated ATS filtering:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {audit.criticalKeywordsToAdd.map((kw, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-red-950/60 text-red-300 border border-red-800/60 text-xs font-mono font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Exact Suggested Bullet Points */}
              <div>
                <h3 className="text-xs font-bold text-white mb-2 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exact Resume Tweaks To Copy-Paste (Before/After)</span>
                </h3>
                <div className="space-y-3">
                  {audit.resumeTweaks.map((tweak, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-200 text-xs">{tweak.section}</span>
                        <button
                          onClick={() => copyText(tweak.suggestedBullet, `bullet_${i}`)}
                          className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          {copiedKey === `bullet_${i}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === `bullet_${i}` ? 'Copied' : 'Copy Bullet'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400 italic">
                        Advice: {tweak.currentAdvice}
                      </p>
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-[11px] leading-relaxed select-all">
                        "{tweak.suggestedBullet}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags / Filters to Watch */}
              {audit.recruiterRedFlags.length > 0 && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-300 text-xs">
                    Recruiter Screening Red Flags
                  </div>
                  {audit.recruiterRedFlags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2 text-zinc-400 text-[11px]">
                      <span className="text-amber-400">⚠️</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INTERVIEW PREP & STAR QUESTIONS */}
          {activeTab === 'interview' && interview && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-white mb-2 uppercase font-mono tracking-wider">
                  Top 5 Technical Questions For {job.title}
                </h3>
                <div className="space-y-3">
                  {interview.technicalQuestions.map((q, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                      <div className="font-semibold text-white text-xs">
                        Q{i + 1}: {q.question}
                      </div>
                      <div className="text-[11px] text-emerald-400">
                        <strong>Key Concepts to Mention:</strong> {q.answerKey}
                      </div>
                      <div className="text-[11px] text-zinc-400 italic">
                        <strong>What the Interviewer Evaluates:</strong> {q.whatHrLooksFor}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white mb-2 uppercase font-mono tracking-wider">
                  Behavioral Questions (Using STAR Method)
                </h3>
                <div className="space-y-3">
                  {interview.behavioralQuestions.map((q, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                      <div className="font-semibold text-white text-xs">
                        {q.question}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        <strong>Strategy:</strong> {q.starStrategy}
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono">
                        "{q.sampleAnswer}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <h4 className="font-semibold text-white text-xs">
                  Smart Questions For You To Ask The Interviewer:
                </h4>
                {interview.smartQuestionsToAskHr.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-zinc-300 text-[11px]">
                    <span className="text-amber-400">💬</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RECRUITER & LINKEDIN INTEL */}
          {activeTab === 'recruiter' && hiring && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn Recruiter & Hiring Manager Intel</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Bypass the generic careers email by connecting directly with the talent team and engineering managers on LinkedIn:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href={hiring.linkedinRecruiterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-medium transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      <span>Search Talent Leads at {job.company}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  </a>

                  <a
                    href={hiring.linkedinManagerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-medium transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      <span>Search Engineering Managers</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  </a>
                </div>
              </div>

              {/* Pre-written connection note */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-200">
                    LinkedIn Connection Request Note (Under 300 Chars):
                  </label>
                  <button
                    onClick={() => copyText(hiring.connectionNote, 'conn_note')}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedKey === 'conn_note' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'conn_note' ? 'Copied' : 'Copy Note'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200 font-mono leading-relaxed select-all">
                  "{hiring.connectionNote}"
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookmark(job)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isBookmarked
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Job'}</span>
            </button>

            <button
              onClick={() => onWillApply(job)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isWillApply
                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                  : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>{isWillApply ? 'Marked Will Apply' : 'Will Apply'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={job.directApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onApply(job)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-zinc-200 text-zinc-950 transition-all shadow-md"
            >
              <span>Direct Apply on Company Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
