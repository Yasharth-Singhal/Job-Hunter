import React, { useState } from 'react';
import { 
  ExternalLink, 
  Mail, 
  Bookmark, 
  X, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Globe2, 
  Copy, 
  Check, 
  Zap, 
  Ban, 
  Send, 
  Sparkles, 
  FileText, 
  Scale, 
  AlertTriangle, 
  Layers, 
  StickyNote, 
  Search 
} from 'lucide-react';
import { Job, UserProfile } from '../types';
import axios from 'axios';

interface JobCardProps {
  job: Job;
  profile: UserProfile | null;
  isSelected?: boolean;
  onToggleSelect?: (jobId: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (job: Job) => void;
  onViewDetails?: (job: Job) => void;
  onOpenCoverLetter?: (job: Job) => void;
  onOpenCompanyDossier?: (companyName: string) => void;
  onOpenVoiceMock?: (job: Job) => void;
  onOpenTailoredResume?: (job: Job) => void;
  onOpenReferral?: (job: Job) => void;
  onOpenOutreachSequence?: (job: Job) => void;
  onOpenCodingSandbox?: (job: Job) => void;
  onApply: (job: Job) => void;
  onOpenColdEmail: (job: Job) => void;
  onBookmark: (job: Job) => void;
  onWillApply: (job: Job) => void;
  onNotInterested: (jobId: string) => void;
  isBookmarked: boolean;
  isWillApply: boolean;
  isApplied: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  profile,
  isSelected = false,
  onToggleSelect,
  isCompared = false,
  onToggleCompare,
  onViewDetails,
  onOpenCoverLetter,
  onOpenCompanyDossier,
  onOpenVoiceMock,
  onOpenTailoredResume,
  onOpenReferral,
  onOpenOutreachSequence,
  onOpenCodingSandbox,
  onApply,
  onOpenColdEmail,
  onBookmark,
  onWillApply,
  onNotInterested,
  isBookmarked,
  isWillApply,
  isApplied
}) => {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState(job.userNotes || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveNote = async () => {
    try {
      await axios.post('/api/jobs/note', { jobId: job.id, note: noteText });
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'greenhouse':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Greenhouse Direct</span>;
      case 'lever':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Lever Direct</span>;
      case 'ashby':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Ashby Direct</span>;
      case 'mnc':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">MNC Career Portal</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">Official Direct</span>;
    }
  };

  const getWorkplaceBadge = (type: string) => {
    switch (type) {
      case 'remote':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-200 border border-zinc-700"><Globe2 className="w-3 h-3 text-emerald-400" /> Remote</span>;
      case 'hybrid':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">Hybrid</span>;
      case 'onsite':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">On-site</span>;
      default:
        return null;
    }
  };

  const getExpBadge = (exp: string) => {
    switch (exp) {
      case 'fresher':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">Fresher (0-1 yrs)</span>;
      case 'junior':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">Junior (1-3 yrs)</span>;
      case 'mid-senior':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">Mid-Senior (3+ yrs)</span>;
      default:
        return null;
    }
  };

  const tailoredNote = `Hi ${job.company} Team,\n\nI am applying for the ${job.title} role. With experience in ${(profile?.coreSkills || []).slice(0, 4).join(', ')}, I build high-performance web applications and autonomous tools. My portfolio: ${profile?.portfolioUrl || 'yasharth.dev'} | GitHub: ${profile?.githubUrl || 'github.com/Yasharth-Singhal'}.\n\nLooking forward to contributing to your roadmap!`;

  return (
    <div className={`group rounded-xl border bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 p-5 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-lg ${
      isSelected ? 'border-emerald-500/60 ring-1 ring-emerald-500/40' : 'border-zinc-800'
    }`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          {/* Checkbox for bulk actions & main info */}
          <div className="flex items-start gap-2.5 flex-1">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(job.id)}
                className="mt-1 w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                title="Select for bulk action"
              />
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {getSourceBadge(job.source)}
                {getWorkplaceBadge(job.workplaceType)}
                {getExpBadge(job.experienceLevel)}

                {/* Stale Alert Badge */}
                {job.isStale && (
                  <span className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Likely Closing Soon ({job.staleDays}d)</span>
                  </span>
                )}

                {/* Duplicate Merged Badge */}
                {job.duplicateSources && job.duplicateSources.length > 1 && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>Merged: {job.duplicateSources.slice(1).join(', ')}</span>
                  </span>
                )}

                {job.city && (
                  <span className="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                    📍 {job.city}
                  </span>
                )}
              </div>

              <h3 
                onClick={() => onViewDetails && onViewDetails(job)}
                className="text-sm font-semibold text-white hover:text-emerald-400 cursor-pointer transition-colors leading-snug flex items-center gap-1.5"
              >
                <span>{job.title}</span>
              </h3>

              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-zinc-400">
                <button
                  type="button"
                  onClick={() => onOpenCompanyDossier && onOpenCompanyDossier(job.company)}
                  className="font-medium text-zinc-200 hover:text-emerald-400 flex items-center gap-1 transition-colors group/comp"
                  title="View Glassdoor Rating & Culture Dossier"
                >
                  <Building2 className="w-3.5 h-3.5 text-zinc-400 group-hover/comp:text-emerald-400" />
                  <span>{job.company}</span>
                  <span className="text-[10px] text-emerald-400 font-mono underline ml-0.5">Dossier</span>
                </button>
                <span>•</span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                {job.salary && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-emerald-400 font-bold">{job.salary}</span>
                  </>
                )}
              </div>

              {/* Resume & Profile Match Percentage Bar */}
              <div className="mt-2.5 p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span><b>{job.matchScore}%</b> Match with {profile?.name || 'Your Profile'}</span>
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    job.matchScore >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    job.matchScore >= 80 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {job.matchScore >= 90 ? 'VIP Match' : job.matchScore >= 80 ? 'Strong Fit' : 'Good Fit'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      job.matchScore >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                      job.matchScore >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-400' :
                      'bg-gradient-to-r from-amber-500 to-yellow-400'
                    }`}
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Match Score Badge, Compare & Dismiss */}
          <div className="flex items-center gap-1.5">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(job)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isCompared 
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400' 
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
                title={isCompared ? 'Remove from Comparison' : 'Pin to Compare'}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg border border-zinc-800 bg-zinc-950">
              <span className="text-xs font-bold text-emerald-400 font-mono">{job.matchScore}%</span>
              <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider">Fit</span>
            </div>

            <button
              onClick={() => onNotInterested(job.id)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
              title="Not Interested (Permanently hide)"
            >
              <Ban className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Snippet */}
        <p className="mt-3 text-xs text-zinc-300 line-clamp-2 leading-relaxed">
          {job.descriptionSnippet}
        </p>

        {/* Match Reasons */}
        {job.matchReasons && job.matchReasons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
            {job.matchReasons.map((reason, idx) => (
              <span key={idx} className="flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* Private Job Notes Drawer */}
        {notesOpen && (
          <div className="mt-3.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                <span>Private Job Notes</span>
              </span>
              <button onClick={() => setNotesOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Private notes (e.g., recruiter reached out on LinkedIn, salary discussed, interview dates)..."
              rows={3}
              className="w-full p-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">Persisted locally in storage</span>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors"
              >
                {noteSaved ? 'Saved!' : 'Save Note'}
              </button>
            </div>
          </div>
        )}

        {/* Quick Application Copilot Drawer */}
        {copilotOpen && (
          <div className="mt-3.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Form Autofill Data</span>
              </span>
              <button onClick={() => setCopilotOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => copyToClipboard(profile?.name || '', 'name')}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-left"
              >
                <span>Name: {profile?.name || 'N/A'}</span>
                {copiedField === 'name' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(profile?.phone || '', 'phone')}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-left"
              >
                <span>Phone: {profile?.phone || 'N/A'}</span>
                {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(profile?.linkedinUrl || '', 'linkedin')}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-left"
              >
                <span>LinkedIn URL</span>
                {copiedField === 'linkedin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(profile?.githubUrl || '', 'github')}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-left"
              >
                <span>GitHub URL</span>
                {copiedField === 'github' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(tailoredNote, 'note')}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300"
            >
              <span className="font-medium text-emerald-400">Copy Pre-written Cover Note</span>
              {copiedField === 'note' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
            </button>
          </div>
        )}
        {/* Sub-Action Helper Chips */}
        <div className="mt-3.5 pt-2.5 border-t border-zinc-800/60 flex flex-wrap items-center gap-1.5">
          {onOpenReferral && (
            <button
              type="button"
              onClick={() => onOpenReferral(job)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 transition-colors"
              title="Search ABESEC alumni at this company"
            >
              🎓 ABESEC Referral
            </button>
          )}

          {onOpenVoiceMock && (
            <button
              type="button"
              onClick={() => onOpenVoiceMock(job)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 hover:bg-zinc-800 text-purple-400 border border-zinc-800 transition-colors"
              title="Practice answering with your microphone"
            >
              🎙️ Voice Mock
            </button>
          )}

          {onOpenTailoredResume && (
            <button
              type="button"
              onClick={() => onOpenTailoredResume(job)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 hover:bg-zinc-800 text-cyan-400 border border-zinc-800 transition-colors"
              title="Preview and export 1-click tailored ATS resume PDF"
            >
              📄 ATS Resume PDF
            </button>
          )}

          {onOpenCodingSandbox && (
            <button
              type="button"
              onClick={() => onOpenCodingSandbox(job)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 hover:bg-zinc-800 text-amber-300 border border-zinc-800 transition-colors"
              title="Practice company coding questions in-browser"
            >
              💻 DSA Sandbox
            </button>
          )}

          {onOpenOutreachSequence && (
            <button
              type="button"
              onClick={() => onOpenOutreachSequence(job)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 hover:bg-zinc-800 text-blue-400 border border-zinc-800 transition-colors"
              title="View 3-touch recruiter outreach sequence"
            >
              📬 3-Touch Cadence
            </button>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-5 pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Bookmark Button */}
          <button
            onClick={() => onBookmark(job)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isBookmarked
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark Job'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>

          {/* Will Apply Button */}
          <button
            onClick={() => onWillApply(job)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isWillApply
                ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
            }`}
            title="Mark as Will Apply"
          >
            <Send className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Will Apply</span>
          </button>

          {/* Quick Copy Data Drawer */}
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              copilotOpen ? 'bg-zinc-800 text-white border-zinc-600' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            title="Quick Form Autofill Data"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Private Note Toggle */}
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              notesOpen || job.userNotes ? 'bg-zinc-800 text-amber-300 border-amber-500/30' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            title="Private Job Notes"
          >
            <StickyNote className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Cover Letter Generator */}
          {onOpenCoverLetter && (
            <button
              onClick={() => onOpenCoverLetter(job)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all"
              title="Generate tailored cover letter"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Cover Letter</span>
            </button>
          )}

          {/* HR Audit & Complete Details */}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(job)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-amber-300 border border-zinc-800 hover:border-amber-500/30 transition-all"
              title="View Complete Job Description, HR Resume Audit & Interview Helper"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">HR Audit</span>
            </button>
          )}

          {/* Cold Outreach to Recruiter */}
          <button
            onClick={() => onOpenColdEmail(job)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all"
            title="Cold Email HR / Recruiter"
          >
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Pitch</span>
          </button>

          {/* Direct Apply Button */}
          <a
            href={job.directApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onApply(job)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 shadow-sm transition-all"
          >
            <span>Direct Apply</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
