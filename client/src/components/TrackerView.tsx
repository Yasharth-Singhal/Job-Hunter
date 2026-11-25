import React, { useState } from 'react';
import { 
  Kanban, 
  ExternalLink, 
  Trash2, 
  Building2, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  Clock, 
  Bell, 
  FileText, 
  Send,
  X 
} from 'lucide-react';
import { TrackedApplication, ApplicationStatus } from '../types';

interface TrackerViewProps {
  applications: TrackedApplication[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onDeleteApplication: (id: string) => void;
  onUpdateApplication?: (id: string, updates: Partial<TrackedApplication>) => void;
}

const COLUMNS: Array<{ id: ApplicationStatus; label: string; color: string; border: string }> = [
  { id: 'discovered', label: 'Saved / Bookmarked', color: 'text-zinc-400 bg-zinc-800/60', border: 'border-zinc-800' },
  { id: 'will-apply', label: 'Will Apply Today', color: 'text-blue-400 bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'applied', label: 'Applied (Direct Link)', color: 'text-emerald-400 bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'cold-emailed', label: 'Cold Emailed HR', color: 'text-cyan-400 bg-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'interviewing', label: 'Interviewing', color: 'text-purple-400 bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'offer', label: 'Offers & Accepted', color: 'text-amber-400 bg-amber-500/10', border: 'border-amber-500/30' },
];

export const TrackerView: React.FC<TrackerViewProps> = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onUpdateApplication
}) => {
  const [scheduleModalApp, setScheduleModalApp] = useState<TrackedApplication | null>(null);

  const setFollowUp = (daysAhead: number) => {
    if (!scheduleModalApp || !onUpdateApplication) return;
    const dueDate = new Date(Date.now() + daysAhead * 86400000).toISOString().split('T')[0];
    onUpdateApplication(scheduleModalApp.id, {
      followUpDue: dueDate,
      followUpCount: (scheduleModalApp.followUpCount || 0) + 1
    });
    setScheduleModalApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Kanban className="w-5 h-5 text-emerald-400" />
            <span>Job & Gig Application Tracker</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track direct ATS submissions, follow-up reminders (Day 3/7/14), and interview pipelines
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
            Total Pipeline: <span className="font-bold text-emerald-400">{applications.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
            Active: <span className="font-bold">{applications.filter(a => ['applied', 'cold-emailed', 'interviewing', 'will-apply'].includes(a.status)).length}</span>
          </div>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl bg-zinc-900/40 border border-zinc-800 p-3 min-h-[500px]"
            >
              {/* Column header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-mono text-zinc-500 font-bold">
                  {colApps.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colApps.length === 0 ? (
                  <div className="h-28 flex items-center justify-center text-xs text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                    Empty
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2.5 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs text-white leading-snug">
                          {app.jobTitle}
                        </div>
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-all"
                          title="Remove from tracker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <Building2 className="w-3 h-3 text-zinc-500" />
                        <span className="text-zinc-300 font-medium">{app.company}</span>
                      </div>

                      {/* Follow-up reminder badge */}
                      {app.followUpDue && (
                        <div className="flex items-center justify-between text-[10px] px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 font-mono">
                          <span className="flex items-center gap-1">
                            <Bell className="w-3 h-3 text-amber-400" />
                            <span>Follow up: {app.followUpDue}</span>
                          </span>
                          <a
                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Follow-up: ' + app.jobTitle + ' at ' + app.company)}&details=${encodeURIComponent('Follow up with recruiter for ' + app.jobTitle + ' application.\nURL: ' + app.directApplyUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:text-white underline ml-1"
                            title="Add reminder to Google Calendar"
                          >
                            + GCal
                          </a>
                        </div>
                      )}

                      {/* Interview GCal Sync */}
                      {app.status === 'interviewing' && (
                        <a
                          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Interview: ' + app.jobTitle + ' at ' + app.company)}&details=${encodeURIComponent('Interview with ' + app.company + ' for ' + app.jobTitle + '.\nDirect Job Link: ' + app.directApplyUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 text-[10px] py-1 px-2 rounded bg-purple-950/50 border border-purple-500/30 text-purple-300 hover:text-white transition-colors"
                        >
                          <Calendar className="w-3 h-3 text-purple-400" />
                          <span>Sync to Google Calendar</span>
                        </a>
                      )}

                      {/* Ghosting Probability Meter */}
                      {(() => {
                        if (!['applied', 'cold-emailed'].includes(app.status)) return null;
                        const appliedTime = new Date(app.appliedDate).getTime();
                        const days = !isNaN(appliedTime) 
                          ? Math.max(1, Math.floor((Date.now() - appliedTime) / 86400000))
                          : 8;
                        if (days < 4) return null;
                        const prob = Math.min(94, Math.max(20, Math.round((days / 18) * 100)));
                        return (
                          <div className="flex items-center justify-between text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono">
                            <span className="text-zinc-400">👻 Stagnancy Risk:</span>
                            <span className={prob >= 60 ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                              {prob}% ({days}d no response)
                            </span>
                          </div>
                        );
                      })()}

                      {/* Resume version & notes info */}
                      {app.resumeVersionUsed && (
                        <div className="text-[10px] text-zinc-400 font-mono truncate">
                          📄 {app.resumeVersionUsed}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {app.appliedDate}
                        </span>
                        <button
                          type="button"
                          onClick={() => setScheduleModalApp(app)}
                          className="text-zinc-400 hover:text-amber-300 flex items-center gap-1"
                          title="Set follow-up reminder"
                        >
                          <Clock className="w-3 h-3" />
                          <span>Remind</span>
                        </button>
                      </div>

                      {/* Direct Link & Stage Selector */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-900">
                        {app.directApplyUrl && app.directApplyUrl !== '#' ? (
                          <a
                            href={app.directApplyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 underline"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : <span />}

                        {/* Status change select */}
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                          className="text-[10px] px-1.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="discovered">Saved</option>
                          <option value="will-apply">Will Apply</option>
                          <option value="applied">Applied (Link)</option>
                          <option value="cold-emailed">Cold Emailed</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offer">Offer / Done</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Follow-up Reminder Modal */}
      {scheduleModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Schedule Recruiter Follow-Up Reminder
              </h3>
              <button onClick={() => setScheduleModalApp(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              When should we remind you to send a follow-up email/LinkedIn message for <strong>{scheduleModalApp.jobTitle}</strong> at <strong>{scheduleModalApp.company}</strong>?
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFollowUp(3)}
                className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 hover:border-emerald-500"
              >
                In 3 Days
              </button>
              <button
                onClick={() => setFollowUp(7)}
                className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 hover:border-emerald-500"
              >
                In 7 Days
              </button>
              <button
                onClick={() => setFollowUp(14)}
                className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 hover:border-emerald-500"
              >
                In 14 Days
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
