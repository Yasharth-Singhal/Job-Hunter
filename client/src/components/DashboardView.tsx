import React from 'react';
import { 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  Kanban, 
  Mic, 
  ArrowRight, 
  TrendingUp, 
  GraduationCap, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Calculator, 
  Send, 
  Flame, 
  Building2, 
  RefreshCw,
  Award
} from 'lucide-react';
import { Job, Gig, ResumeProfile, TrackedApplication, AutomationSettings } from '../types';

interface DashboardViewProps {
  jobs: Job[];
  gigs: Gig[];
  profile: ResumeProfile | null;
  applications: TrackedApplication[];
  automation: AutomationSettings | null;
  onNavigateTab: (tab: 'dashboard' | 'jobs' | 'gigs' | 'tracker' | 'analytics') => void;
  onSelectJob: (job: Job) => void;
  onSelectGig: (gig: Gig) => void;
  onOpenVoiceInterview: (job?: Job) => void;
  onOpenOfferCalc: () => void;
  onOpenReferralFinder: () => void;
  onOpenAutomation: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  jobs,
  gigs,
  profile,
  applications,
  automation,
  onNavigateTab,
  onSelectJob,
  onSelectGig,
  onOpenVoiceInterview,
  onOpenOfferCalc,
  onOpenReferralFinder,
  onOpenAutomation,
  onRefresh,
  isRefreshing
}) => {
  const topJobs = [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  const highMatchCount = jobs.filter(j => j.matchScore >= 90).length;
  const interviewingCount = applications.filter(a => a.status === 'interviewing').length;
  const remoteJobsCount = jobs.filter(j => j.isRemote || j.workplaceType === 'remote').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Executive Candidate Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Automated Hunter
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                <Send className="w-3 h-3 text-sky-400" />
                Synced with @Job_huntet_bot
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">{profile?.name || 'Yasharth Singhal'}</span>!
            </h1>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Full Stack Engineer • <span className="text-zinc-300 font-medium">{profile?.collegeName || 'ABES Engineering College (ABESEC), Ghaziabad'}</span> (MCA 2026).
              Your automated pipeline is scanning 3,000+ verified career portals across Greenhouse, Lever, Ashby, Google, Amazon, and TCS.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {(profile?.coreSkills || ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Docker']).slice(0, 7).map(skill => (
                <span key={skill} className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => onOpenVoiceInterview()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mic className="w-4 h-4" />
              <span>Launch AI Interview</span>
            </button>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Scanning...' : 'Scan Openings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div 
          onClick={() => onNavigateTab('jobs')}
          className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Scraped Portals</span>
            <Briefcase className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{jobs.length.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">100% verified</span> ATS/MNC
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('jobs')}
          className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">High Match (&gt;90%)</span>
            <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{highMatchCount}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-orange-400 font-medium">Prime fit</span> for your resume
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('tracker')}
          className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Tracked Apps</span>
            <Kanban className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{applications.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-sky-400 font-medium">Active queue</span> & ghosting meter
          </div>
        </div>

        <div 
          onClick={() => onOpenVoiceInterview()}
          className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Active Interviews</span>
            <Award className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{interviewingCount}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-purple-400 font-medium">STAR Q&A ready</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('gigs')}
          className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">WFH Side Gigs</span>
            <DollarSign className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{gigs.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-teal-400 font-medium">Instant pitch</span> generator
          </div>
        </div>
      </div>

      {/* 3. Quick Action Power Bar */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Quick Launch Career Tools
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            onClick={() => onOpenVoiceInterview()}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-left transition-all"
          >
            <Mic className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">STAR Interview</div>
              <div className="text-[10px] text-zinc-500 truncate">Voice & Q&A</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('jobs')}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-sky-500/40 text-left transition-all"
          >
            <Briefcase className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">Remote Roles</div>
              <div className="text-[10px] text-zinc-500 truncate">{remoteJobsCount} WFH jobs</div>
            </div>
          </button>

          <button
            onClick={onOpenReferralFinder}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/40 text-left transition-all"
          >
            <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">ABESEC Alumni</div>
              <div className="text-[10px] text-zinc-500 truncate">LinkedIn search</div>
            </div>
          </button>

          <button
            onClick={onOpenOfferCalc}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/40 text-left transition-all"
          >
            <Calculator className="w-4 h-4 text-orange-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">CTC Calculator</div>
              <div className="text-[10px] text-zinc-500 truncate">In-hand take home</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('gigs')}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-teal-500/40 text-left transition-all"
          >
            <DollarSign className="w-4 h-4 text-teal-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">WFH Side Gigs</div>
              <div className="text-[10px] text-zinc-500 truncate">High payout</div>
            </div>
          </button>

          <button
            onClick={onOpenAutomation}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-left transition-all"
          >
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">Auto-Pilot</div>
              <div className="text-[10px] text-zinc-500 truncate">9:00 AM Cron</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Two-Column Layout: Top Recommendations & Live Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Match Recommendations (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Highest-Match Opportunities
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>View all {jobs.length} jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topJobs.map(job => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.matchScore}% Match
                    </span>
                    <span className="text-xs font-mono text-zinc-400 uppercase">
                      [{job.source}]
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white truncate hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => onSelectJob(job)}>
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                    <span className="font-medium text-zinc-300">{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{job.salary || 'Competitive'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                  >
                    Details & Bullets
                  </button>
                  <a
                    href={job.directApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>Apply ↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Application Pipeline & Ghosting Radar (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Kanban className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Application Radar
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('tracker')}
              className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <span>Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3.5">
            {applications.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                No active applications tracked yet.<br />
                Browse any job and tap "Save to Tracker" to track ghosting risk.
              </div>
            ) : (
              applications.slice(0, 4).map((app, idx) => {
                const days = Math.floor((Date.now() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24));
                const ghostingRisk = days > 14 ? 85 : days > 7 ? 50 : 15;
                const riskColor = ghostingRisk > 60 ? 'text-rose-400 bg-rose-500/10' : ghostingRisk > 30 ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10';

                return (
                  <div key={app.id || idx} className="flex items-center justify-between pb-3 border-b border-zinc-800/60 last:border-0 last:pb-0">
                    <div className="space-y-0.5 max-w-[65%]">
                      <div className="text-xs font-bold text-zinc-200 truncate">{app.jobTitle}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{app.company} • {days}d ago</div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${riskColor}`}>
                        {ghostingRisk}% risk
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('tracker')}
                className="w-full py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 text-xs font-medium text-center transition-colors"
              >
                Open Full Ghosting Matrix
              </button>
            </div>
          </div>

          {/* Telegram Sync Status Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/40 to-zinc-900 border border-sky-800/30 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Bot Live Integration</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Use <code>/dashboard</code>, <code>/ask</code>, or send voice notes anytime to practice interviews and check vacancies directly on your phone.
            </p>
            <div className="pt-1">
              <a
                href="https://t.me/Job_huntet_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                <span>Open @Job_huntet_bot</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
