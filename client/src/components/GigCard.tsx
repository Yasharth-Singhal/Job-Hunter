import React from 'react';
import { 
  DollarSign, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Laptop,
  Check,
  Video,
  GraduationCap,
  PenTool,
  Palette,
  ClipboardList,
  Code2,
  Sparkles
} from 'lucide-react';
import { Gig, GigCategory } from '../types';

interface GigCardProps {
  gig: Gig;
  onTrack: (gig: Gig) => void;
  onOpenProposal?: (gig: Gig) => void;
  isTracked: boolean;
}

export const GigCard: React.FC<GigCardProps> = ({ gig, onTrack, onOpenProposal, isTracked }) => {
  const getCategoryDetails = (cat: GigCategory) => {
    switch (cat) {
      case 'video-editing':
        return { label: 'Video Editing', icon: Video, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
      case 'tutoring':
        return { label: 'Online Tutoring', icon: GraduationCap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'content-writing':
        return { label: 'Content Writing', icon: PenTool, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
      case 'design':
        return { label: 'Design & Canva', icon: Palette, color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' };
      case 'virtual-assistant':
        return { label: 'Virtual Assistant', icon: ClipboardList, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'web-dev':
        return { label: 'Web & Tech', icon: Code2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'qa-testing':
        return { label: 'QA & Testing', icon: Laptop, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      default:
        return { label: 'WFH Side Gig', icon: Laptop, color: 'text-zinc-400 bg-zinc-800 border-zinc-700' };
    }
  };

  const catDetails = getCategoryDetails(gig.category);
  const IconComponent = catDetails.icon;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 p-5 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-lg">
      <div>
        {/* Category Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${catDetails.color}`}>
              <IconComponent className="w-3.5 h-3.5" />
              <span>{catDetails.label}</span>
            </span>

            {gig.isProfileMatched && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Matches Interest</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold text-xs font-mono">
            <span>{gig.payout}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white group-hover:text-zinc-100 leading-snug">
          {gig.title}
        </h3>

        {/* Client & Hours */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400">
          <span className="text-zinc-300 font-medium">{gig.clientOrPlatform}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            {gig.estimatedHours}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-zinc-300 line-clamp-3 leading-relaxed">
          {gig.description}
        </p>

        {/* Skills & tags */}
        <div className="mt-3.5 pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
          {gig.matchedSkills.map((skill, idx) => (
            <span key={idx} className="text-[11px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
        <span className="text-[11px] text-zinc-500 font-mono">
          Posted: {gig.postedAt}
        </span>

        <div className="flex items-center gap-2">
          {onOpenProposal && (
            <button
              onClick={() => onOpenProposal(gig)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-amber-300 hover:border-amber-500/30 transition-all"
              title="Generate tailored freelance proposal"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Proposal</span>
            </button>
          )}

          <button
            onClick={() => onTrack(gig)}
            disabled={isTracked}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isTracked
                ? 'bg-zinc-800 border-zinc-700 text-zinc-400 cursor-default'
                : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
            }`}
          >
            {isTracked ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            <span>{isTracked ? 'Tracked' : 'Save'}</span>
          </button>

          <a
            href={gig.directApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 transition-all shadow-sm"
          >
            <span>Apply to Gig</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
