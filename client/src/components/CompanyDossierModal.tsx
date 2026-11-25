import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Building2, 
  Star, 
  ThumbsUp, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Compass, 
  Briefcase, 
  Newspaper, 
  Layers,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { CompanyDossier } from '../types';

interface CompanyDossierModalProps {
  initialCompany?: string;
  onClose: () => void;
}

export const CompanyDossierModal: React.FC<CompanyDossierModalProps> = ({ 
  initialCompany = 'Google', 
  onClose 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialCompany);
  const [dossier, setDossier] = useState<CompanyDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reviews' | 'culture' | 'interview' | 'tech'>('reviews');

  const fetchDossier = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/company/dossier?name=${encodeURIComponent(name)}`);
      if (res.data?.dossier) {
        setDossier(res.data.dossier);
      }
    } catch (err) {
      console.error('Failed to load dossier:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossier(initialCompany);
  }, [initialCompany]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDossier(searchTerm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header & Search Bar */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Company Intel & Employee Review Dossier</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    Verified
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Glassdoor employee scores, engineering culture, interview stages, pros/cons & tech stack
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

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative mt-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search any company (e.g. Google, Microsoft, Amazon, Stripe, TCS, Razorpay)..."
              className="w-full pl-9 pr-24 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Preset Company Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-zinc-500 font-mono">Quick dossiers:</span>
            {['Google', 'Microsoft', 'Amazon', 'Stripe', 'TCS', 'Infosys'].map((comp) => (
              <button
                key={comp}
                type="button"
                onClick={() => {
                  setSearchTerm(comp);
                  fetchDossier(comp);
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                  dossier?.companyName.toLowerCase() === comp.toLowerCase()
                    ? 'bg-zinc-100 text-zinc-950 font-semibold border-white'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-zinc-400">Loading company intelligence and employee ratings...</p>
            </div>
          ) : !dossier ? (
            <div className="py-16 text-center text-zinc-500 text-xs">No company data available.</div>
          ) : (
            <>
              {/* Company Summary Banner */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{dossier.companyName}</h3>
                    <a
                      href={`https://${dossier.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <span>{dossier.domain}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <p className="text-xs text-zinc-400 mt-1">
                    {dossier.overview.industry} • {dossier.overview.headquarters}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-zinc-300">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono">
                      👥 {dossier.overview.size}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono">
                      📅 Founded {dossier.overview.founded}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-emerald-400">
                      💰 {dossier.overview.fundingStage}
                    </span>
                  </div>
                </div>

                {/* Main Rating Score Card */}
                <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-2xl font-mono">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span>{dossier.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">Glassdoor Avg</span>
                  </div>

                  <div className="h-9 w-px bg-zinc-800" />

                  <div className="space-y-1 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="w-3 h-3 text-emerald-400" />
                      <span><strong>{dossier.ratingsBreakdown.recommendToFriendPct}%</strong> recommend</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span><strong>{dossier.ratingsBreakdown.ceoApprovalPct}%</strong> CEO approval</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                {[
                  { id: 'reviews', label: 'Employee Reviews & Pros/Cons' },
                  { id: 'culture', label: 'Culture & Behavioral Norms' },
                  { id: 'interview', label: 'Interview Stages & Difficulty' },
                  { id: 'tech', label: 'Tech Stack & News' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Reviews & Pros/Cons */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Category Ratings Bar Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { label: 'Work-Life Balance', val: dossier.ratingsBreakdown.workLifeBalance },
                      { label: 'Culture & Values', val: dossier.ratingsBreakdown.cultureAndValues },
                      { label: 'Comp & Benefits', val: dossier.ratingsBreakdown.compensationAndBenefits },
                      { label: 'Senior Leadership', val: dossier.ratingsBreakdown.seniorManagement }
                    ].map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">{m.label}</span>
                          <span className="font-bold text-white font-mono">{m.val.toFixed(1)} / 5</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full" 
                            style={{ width: `${(m.val / 5) * 100}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pros & Cons Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-950/40 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Top Employee Pros
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-300">
                        {dossier.employeeReviews.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950 border border-rose-950/40 space-y-2">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Employee Cons to Watch
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-300">
                        {dossier.employeeReviews.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Featured In-Depth Review */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-200">
                        ⭐ "{dossier.employeeReviews.featuredReview.title}"
                      </span>
                      <span className="font-mono text-[11px]">{dossier.employeeReviews.featuredReview.date}</span>
                    </div>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                      "{dossier.employeeReviews.featuredReview.review}"
                    </p>
                    <div className="text-[11px] text-emerald-400 font-mono">
                      — {dossier.employeeReviews.featuredReview.role}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Culture & Behavioral Norms */}
              {activeTab === 'culture' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-400" />
                      Day-to-Day Work Culture
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {dossier.cultureAndBehavior.workCulture}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Leadership Principles & Values Looked for in Candidates
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dossier.cultureAndBehavior.leadershipPrinciples.map((lp, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
                          <span className="text-amber-400 font-bold font-mono">0{idx + 1}.</span>
                          <span>{lp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Interview Stages & Difficulty */}
              {activeTab === 'interview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-xs text-zinc-300 font-medium">Glassdoor Reported Interview Difficulty:</span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-zinc-900 border border-zinc-700 text-amber-300">
                      {dossier.cultureAndBehavior.interviewDifficulty}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                      Standard Interview Loop Stages
                    </h4>
                    <div className="space-y-2.5">
                      {dossier.cultureAndBehavior.interviewProcessStages.map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                          <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold font-mono text-[11px] text-emerald-400 shrink-0">
                            {idx + 1}
                          </span>
                          <span>{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Tech Stack & News */}
              {activeTab === 'tech' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                    <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Core Technology Stack (Languages & Frameworks)
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {dossier.techStack.map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                    <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Newspaper className="w-4 h-4 text-emerald-400" />
                      Recent News & Growth Trajectory
                    </h4>
                    <div className="space-y-2">
                      {dossier.recentNews.map((news, i) => (
                        <div key={i} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-white">{news.headline}</p>
                            <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">{news.source} • {news.date}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {news.sentiment}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-400">
          <span>Glassdoor & AmbitionBox verified intelligence</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
