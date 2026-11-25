import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  BookOpen, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { ApplicationFunnelAnalytics, SkillGapAnalysis, SalaryIntelligence } from '../types';

export const AnalyticsView: React.FC = () => {
  const [funnel, setFunnel] = useState<ApplicationFunnelAnalytics | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(null);
  const [salaryIntel, setSalaryIntel] = useState<SalaryIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'funnel' | 'skillgap' | 'salary' | 'heatmap'>('funnel');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/analytics/overview');
        if (res.data?.success) {
          setFunnel(res.data.funnel);
          setSkillGap(res.data.skillGap);
          setSalaryIntel(res.data.salaryIntel);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const copyWeeklyReport = () => {
    if (!funnel?.weeklySummaryReport) return;
    navigator.clipboard.writeText(funnel.weeklySummaryReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const copyScript = () => {
    if (!salaryIntel?.negotiationScript) return;
    navigator.clipboard.writeText(salaryIntel.negotiationScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400">Aggregating market intelligence & application funnel analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Sub Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Market Intelligence & Application Analytics</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time pipeline funnel, skill gap diagnosis, market heatmap & salary benchmarks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'funnel', label: 'Application Funnel' },
            { id: 'skillgap', label: 'Skill Gap Analyzer' },
            { id: 'salary', label: 'Salary Intelligence' },
            { id: 'heatmap', label: 'Market Demand Heatmap' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Application Funnel */}
      {activeTab === 'funnel' && funnel && (
        <div className="space-y-5">
          {/* Funnel KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Discovered', val: funnel.totalDiscovered, color: 'text-zinc-200', border: 'border-zinc-800' },
              { label: 'Bookmarked', val: funnel.totalBookmarked, color: 'text-amber-400', border: 'border-amber-500/20' },
              { label: 'Will Apply', val: funnel.totalWillApply, color: 'text-blue-400', border: 'border-blue-500/20' },
              { label: 'Direct Applied', val: funnel.totalApplied, color: 'text-emerald-400', border: 'border-emerald-500/20' },
              { label: 'Interviewing', val: funnel.totalInterviewing, color: 'text-purple-400', border: 'border-purple-500/20' },
              { label: 'Offers', val: funnel.totalOffers, color: 'text-emerald-300', border: 'border-emerald-400/30' },
            ].map((kpi, i) => (
              <div key={i} className={`p-4 rounded-xl bg-zinc-900 border ${kpi.border} text-center space-y-1`}>
                <span className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.val}</span>
                <p className="text-[11px] text-zinc-400 font-medium">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Conversion Visual Pipeline */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Pipeline Progression & Conversion Velocity</h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {funnel.conversionRateAppliedToInterview}% Applied → Interview Rate
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Jobs Discovered & Analyzed', count: funnel.totalDiscovered, pct: 100, color: 'bg-zinc-600' },
                { label: 'Target Queued (Bookmarked + Will Apply)', count: funnel.totalBookmarked + funnel.totalWillApply, pct: Math.min(100, Math.round(((funnel.totalBookmarked + funnel.totalWillApply) / Math.max(1, funnel.totalDiscovered)) * 100)), color: 'bg-blue-500' },
                { label: 'Verified Direct Applications', count: funnel.totalApplied, pct: Math.min(100, Math.round((funnel.totalApplied / Math.max(1, funnel.totalDiscovered)) * 100)), color: 'bg-emerald-500' },
                { label: 'Interviews & Screening Loops', count: funnel.totalInterviewing, pct: Math.min(100, Math.round((funnel.totalInterviewing / Math.max(1, funnel.totalDiscovered)) * 100)), color: 'bg-purple-500' },
              ].map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>{step.label}</span>
                    <span className="font-mono text-zinc-400">{step.count} ({step.pct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div className={`${step.color} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.max(4, step.pct)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Summary Report Card */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Sunday Weekly Progress Brief</h3>
              </div>
              <button
                onClick={copyWeeklyReport}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copiedReport ? 'Copied Brief' : 'Copy Summary'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {funnel.weeklySummaryReport}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Skill Gap Analyzer */}
      {activeTab === 'skillgap' && skillGap && (
        <div className="space-y-5">
          {/* Missing Skills Warning Banner */}
          {skillGap.missingCriticalSkills.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300">
                  Critical Skill Gaps Detected from Live ATS Postings
                </h4>
                <p className="text-xs text-zinc-300 mt-1">
                  Adding verifiable projects or keywords for these top missing technologies can increase your shortlist odds by up to <strong>45%</strong>:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skillGap.missingCriticalSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-950 text-amber-300 border border-amber-500/40">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Skills Table */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                In-Demand Skills Frequency vs Your Active Resume
              </h3>
              <span className="text-[11px] text-zinc-500 font-mono">Ranked by ATS frequency</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 font-mono text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="py-2.5 px-4">Technology</th>
                    <th className="py-2.5 px-4">Demand in Open Jobs</th>
                    <th className="py-2.5 px-4">In Your Resume?</th>
                    <th className="py-2.5 px-4 text-right">Official Free Learning Doc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {skillGap.topInDemandSkills.map((s, idx) => (
                    <tr key={idx} className="hover:bg-zinc-950/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white font-mono flex items-center gap-2">
                        <span>{s.skill}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${s.demandPercentage}%` }} />
                          </div>
                          <span className="font-mono text-[11px] text-zinc-300">{s.demandPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {s.candidateHasSkill ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={s.learningResourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors"
                        >
                          <BookOpen className="w-3 h-3 text-cyan-400" />
                          <span>{s.documentationName}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Salary Intelligence */}
      {activeTab === 'salary' && salaryIntel && (
        <div className="space-y-5">
          {/* Compensation Percentile Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: '25th Percentile (Entry Tier)', val: salaryIntel.p25INR, sub: 'Conservative Base' },
              { label: '50th Percentile (Market Avg)', val: salaryIntel.marketAvgINR, sub: 'Industry Benchmark' },
              { label: '75th Percentile (Target Range)', val: salaryIntel.p75INR, sub: 'High Match Target' },
              { label: '90th Percentile (Top Tier)', val: salaryIntel.p90INR, sub: 'Elite / Tier 1 Standard' }
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 font-medium">{p.label}</span>
                <div className="text-xl font-bold font-mono text-emerald-400">{p.val}</div>
                <span className="text-[10px] text-zinc-500 font-mono">{p.sub}</span>
              </div>
            ))}
          </div>

          {/* Regional Tech Hubs */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              City-Wise Tech Compensation Benchmarks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {salaryIntel.topPayingCities.map((c, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{c.city}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {c.costOfLivingTier}
                    </span>
                  </div>
                  <div className="text-sm font-bold font-mono text-emerald-400">{c.avgSalary}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Negotiation Script */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  High-Leverage Counter-Offer & Negotiation Script
                </h3>
              </div>
              <button
                onClick={copyScript}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copiedScript ? 'Copied Script' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {salaryIntel.negotiationScript}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Market Demand Heatmap */}
      {activeTab === 'heatmap' && skillGap && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Fastest Growing Tech Demand (Month-over-Month Growth)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skillGap.marketTrendingHeatmap.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs font-mono">{item.technology}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-zinc-400 bg-zinc-900 border border-zinc-800">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                    <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {item.growthMoM}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.status === 'Surging' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
