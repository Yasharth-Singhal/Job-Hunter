import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Download, 
  ExternalLink, 
  FileText, 
  Layers, 
  Lightbulb, 
  Mic, 
  Milestone, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Target, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { Job, ResumeProfile } from '../types';

interface InterviewPreparatoryChartModalProps {
  job: Job | null;
  profile: ResumeProfile | null;
  onClose: () => void;
  onOpenVoiceInterview?: (job: Job) => void;
}

export const InterviewPreparatoryChartModal: React.FC<InterviewPreparatoryChartModalProps> = ({
  job,
  profile,
  onClose,
  onOpenVoiceInterview
}) => {
  if (!job) return null;

  const [activePhase, setActivePhase] = useState<number>(1);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set(['kw_1', 'res_1']));

  const toggleCheck = (id: string) => {
    setCompletedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Readiness Calculation
  const totalChecklistItems = 8;
  const readinessPercentage = Math.min(100, Math.round((completedItems.size / totalChecklistItems) * 100));

  // Determine Company Tier & Difficulty
  const compLower = job.company.toLowerCase();
  const isBigTech = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'stripe', 'netflix'].some(b => compLower.includes(b));
  const isMnc = ['tcs', 'infosys', 'accenture', 'capgemini', 'wipro', 'cognizant', 'hcl'].some(m => compLower.includes(m));
  const difficulty = isBigTech ? 'Very Tough' : isMnc ? 'Medium' : 'Challenging';
  const difficultyColor = isBigTech ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : isMnc ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  const keywords = job.hrAudit?.criticalKeywordsToAdd || job.requirements?.slice(0, 5) || ['React', 'Node.js', 'PostgreSQL', 'TypeScript'];
  const prep = job.interviewPrep;
  const techQ = prep?.technicalQuestions?.[0];
  const starQ = prep?.behavioralQuestions?.[0];

  // Calendar Export (.ics)
  const handleExportIcs = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 3);
    startDate.setHours(15, 0, 0, 0);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const formatDate = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CareerHunter AI//Interview Preparatory Roadmap//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:Technical Interview: ${job.company} (${job.title})`,
      `DESCRIPTION:Interview Preparation Roadmap for ${job.company}. Focus: ${keywords.slice(0, 3).join(', ')}. Target match fit: ${job.matchScore}%.`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `LOCATION:${job.isRemote ? 'Google Meet / Zoom' : job.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.company.replace(/\s+/g, '_')}_Interview_Prep.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Targeted Preparation Roadmap
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${difficultyColor}`}>
                  {difficulty} Loop
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {job.matchScore}% ATS Fit
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Interview Preparatory Chart: <span className="text-emerald-400">{job.company}</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Tailored 5-Phase Prep Plan for {job.title} • {job.location} ({job.workplaceType})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Print / Save PDF Roadmap"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Readiness Meter & Milestones Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-semibold text-zinc-400">Candidate Readiness Status</div>
              <div className="text-2xl font-black text-white flex items-center gap-2 mt-0.5">
                <span>{readinessPercentage}% Prepared</span>
                <span className="text-xs font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {readinessPercentage >= 75 ? 'Shortlist Ready' : 'In Progress'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportIcs}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Add to Calendar (.ics)</span>
              </button>
              {onOpenVoiceInterview && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenVoiceInterview(job);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Launch Voice Mock</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${readinessPercentage}%` }}
            />
          </div>

          {/* Phase Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5">
            {[
              { id: 1, label: 'Phase 1: ATS & Keywords', day: 'Day 1' },
              { id: 2, label: 'Phase 2: Tech Drills', day: 'Days 2-3' },
              { id: 3, label: 'Phase 3: Architecture', day: 'Days 4-5' },
              { id: 4, label: 'Phase 4: STAR Stories', day: 'Day 6' },
              { id: 5, label: 'Phase 5: Reverse Qs', day: 'Day 7' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  activePhase === p.id
                    ? 'bg-zinc-800 border-emerald-500/50 shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className="text-[10px] font-mono text-emerald-400 font-semibold">{p.day}</div>
                <div className="text-xs font-bold text-white leading-tight truncate mt-0.5">{p.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Phase Details Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[50vh] overflow-y-auto">
          {/* Phase 1: ATS & Keywords Alignment */}
          {activePhase === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Phase 1: Resume Keyword Calibration & Recruiter Screen Prep</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Before your first technical screen with {job.company}, calibrate your conversational vocabulary to include the high-frequency requirements found in their job posting.
              </p>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-zinc-200">Critical Keywords Checklist for {job.company}:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {keywords.map((kw, i) => {
                    const id = `kw_${i}`;
                    const isChecked = completedItems.has(id);
                    return (
                      <div 
                        key={id}
                        onClick={() => toggleCheck(id)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${isChecked ? 'text-emerald-400' : 'text-zinc-600'}`} />
                        <span className="text-xs font-mono font-medium">{kw}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {job.hrAudit?.resumeTweaks?.[0] && (
                <div className="p-4 rounded-xl bg-zinc-850/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Google XYZ Formula Transformation for {job.company}:</span>
                  </div>
                  <div className="text-xs text-rose-300/80 line-through">
                    "{job.hrAudit.resumeTweaks[0].currentAdvice}"
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">
                    "{job.hrAudit.resumeTweaks[0].suggestedBullet}"
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Phase 2: Technical Drills */}
          {activePhase === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <Code2 className="w-4 h-4" />
                <span>Phase 2: Core Stack Deep Dive & Live Coding Rounds</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Expect live coding, syntax trade-offs, and state profiling tailored to {job.company}'s tech stack.
              </p>

              {techQ ? (
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">High-Probability Technical Question:</div>
                  <div className="text-sm font-semibold text-white">"{techQ.question}"</div>
                  
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="text-[11px] font-bold text-zinc-400">🔑 Staff Engineer Model Answer:</div>
                    <div className="text-xs text-zinc-300 leading-relaxed">{techQ.answerKey}</div>
                  </div>

                  <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span><b>What evaluators look for:</b> {techQ.whatHrLooksFor}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400">
                  Focus on asynchronous error handling, React component re-rendering optimization (useMemo, useCallback), and database connection pooling.
                </div>
              )}
            </div>
          )}

          {/* Phase 3: System Design & Architecture */}
          {activePhase === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>Phase 3: System Design, Distributed Scaling & Data Architecture</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Prepare to whiteboard scalability bottlenecks, database schemas, and concurrency for {job.company}.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>In-Memory Caching & Latency</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Explain Redis cache-aside strategies, TTL expiration, cache stampede mitigation, and write-through patterns.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>Database Indexing & Query Profiling</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Walk through PostgreSQL B-Tree compound indexes, running EXPLAIN ANALYZE, and avoiding full table scans.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Asynchronous Job Queues</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Highlight BullMQ / RabbitMQ for offloading heavy tasks with idempotency keys and exponential backoff retries.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Resilient API Design</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Centralized error handling, Zod validation schemas, rate-limiting tokens, and graceful degradation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 4: STAR Stories */}
          {activePhase === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4" />
                <span>Phase 4: Behavioral Leadership & STAR Framework Mastery</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Deliver structured stories based on your actual Full-Stack engineering projects (Situation, Task, Action, Result).
              </p>

              {starQ ? (
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Target Behavioral Question:</div>
                  <div className="text-sm font-semibold text-white">"{starQ.question}"</div>
                  
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="text-[11px] font-bold text-zinc-400">📐 Recommended Strategy:</div>
                    <div className="text-xs text-zinc-300 leading-relaxed">{starQ.starStrategy}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                    <div className="text-[11px] font-bold text-emerald-400">🗣️ Model Response (Yasharth Singhal):</div>
                    <div className="text-xs text-zinc-300 italic leading-relaxed">"{starQ.sampleAnswer}"</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400">
                  Focus on resolving technical disagreements constructively, meeting tight MVP deadlines, and handling production bugs with blameless post-mortems.
                </div>
              )}
            </div>
          )}

          {/* Phase 5: Reverse Questions */}
          {activePhase === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Phase 5: The Reverse Interview (Questions to Ask the Team)</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Asking senior, insightful questions signals high competence and strategic curiosity to your interviewers at {job.company}.
              </p>

              <div className="space-y-2.5">
                {(prep?.smartQuestionsToAskHr || [
                  `"What does the engineering deployment pipeline look like at ${job.company}, and how often does the team ship to production?"`,
                  `"What is the single biggest technical bottleneck or architecture challenge the team is focused on over the next two quarters?"`,
                  `"How does the engineering leadership balance shipping new product features versus tackling technical debt and refactoring?"`
                ]).map((q, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                    <span className="font-bold text-teal-400 font-mono">Q{i + 1}:</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/60">
          <div className="text-xs text-zinc-500">
            Exported for <b>{profile?.name || 'Yasharth Singhal'}</b> • Auto-synced with Telegram bot
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Close Roadmap
            </button>
            <a
              href={job.directApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors"
            >
              <span>Direct Apply on {job.company} ↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
