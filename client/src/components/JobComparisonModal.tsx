import React from 'react';
import { X, ExternalLink, CheckCircle2, Building2, MapPin, DollarSign, Star, Sparkles } from 'lucide-react';
import { Job } from '../types';

interface JobComparisonModalProps {
  jobs: Job[];
  onClose: () => void;
  onRemoveJob: (jobId: string) => void;
  onApply: (job: Job) => void;
}

export const JobComparisonModal: React.FC<JobComparisonModalProps> = ({
  jobs,
  onClose,
  onRemoveJob,
  onApply
}) => {
  if (jobs.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Side-by-Side Job Comparison Matrix</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Comparing {jobs.length} target positions across salary, fit score, work mode and requirements
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

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        {job.source}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{job.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveJob(job.id)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Match Score</span>
                      <span className="font-bold font-mono text-emerald-400">{job.matchScore}%</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Salary / CTC</span>
                      <span className="font-bold font-mono text-white">{job.salary || 'Competitive'}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Workplace Mode</span>
                      <span className="capitalize text-zinc-200">{job.workplaceType}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Location</span>
                      <span className="text-zinc-300">{job.location}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Experience Tier</span>
                      <span className="capitalize text-zinc-300">{job.experienceLevel}</span>
                    </div>

                    {/* Requirements sample */}
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Core Requirements
                      </span>
                      <div className="space-y-1">
                        {(job.requirements || []).slice(0, 3).map((req, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={job.directApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onApply(job)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 transition-colors shadow-sm"
                >
                  <span>Apply on Company Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
