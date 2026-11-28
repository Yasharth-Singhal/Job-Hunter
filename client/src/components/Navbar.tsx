import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  Kanban, 
  User, 
  RefreshCw, 
  DollarSign, 
  FileText, 
  ChevronDown, 
  Plus, 
  Check, 
  BarChart3, 
  Building2, 
  Tag, 
  Keyboard, 
  Sun, 
  Moon,
  LayoutDashboard,
  Wrench,
  Calculator,
  FileSignature,
  Send
} from 'lucide-react';
import { AutomationSettings, ResumeProfile, UserAccount } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'jobs' | 'gigs' | 'tracker' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'jobs' | 'gigs' | 'tracker' | 'analytics') => void;
  jobCount: number;
  gigCount: number;
  trackerCount: number;
  profile: ResumeProfile | null;
  profiles: ResumeProfile[];
  automation: AutomationSettings | null;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenNewResumeUpload: () => void;
  onSelectProfile: (profileId: string) => void;
  onOpenAutomation: () => void;
  onOpenCompanyDossier: () => void;
  onOpenResumeVersions: () => void;
  onOpenInvoices: () => void;
  onOpenShortcuts: () => void;
  onOpenOfferCalc: () => void;
  onOpenContract: () => void;
  onSendTelegramTest: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLightMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  jobCount,
  gigCount,
  trackerCount,
  profile,
  profiles,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenNewResumeUpload,
  onSelectProfile,
  onOpenCompanyDossier,
  onOpenResumeVersions,
  onOpenInvoices,
  onOpenShortcuts,
  onOpenOfferCalc,
  onOpenContract,
  onSendTelegramTest,
  onRefresh,
  isRefreshing,
  isLightMode,
  onToggleTheme
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand & Resume Profile Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-zinc-950 font-extrabold text-sm shadow-sm shrink-0 cursor-pointer"
          >
            CH
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-left transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="max-w-[110px] sm:max-w-[160px]">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1 truncate">
                  <span className="truncate">{profile?.profileName || 'Active Profile'}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
                </div>
                <div className="text-[10px] text-zinc-500 font-mono leading-tight">
                  {profiles.length} Profile{profiles.length > 1 ? 's' : ''}
                </div>
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 z-50">
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 px-2 py-1 font-semibold">
                  Switch Active Resume Profile
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {profiles.map((p) => {
                    const isActive = p.id === profile?.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProfile(p.id);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-all ${
                          isActive
                            ? 'bg-zinc-800 text-white font-medium'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                      >
                        <span className="truncate">{p.profileName}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 mt-1 border-t border-zinc-800 space-y-1">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Edit Active Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenNewResumeUpload();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Another Resume</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Clean Single-Line Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span>Jobs</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
              activeTab === 'jobs' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-500'
            }`}>
              {jobCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gigs')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'gigs'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>WFH Gigs</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
              activeTab === 'gigs' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-500'
            }`}>
              {gigCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'tracker'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 shrink-0" />
            <span>Pipeline</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
              activeTab === 'tracker' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-500'
            }`}>
              {trackerCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Intel</span>
          </button>
        </nav>

        {/* Right: Clean Actions + Tools Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Tools Dropdown (Groups secondary tools cleanly) */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-lg transition-all whitespace-nowrap"
              title="Career Tools & Calculators"
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Tools</span>
              <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 z-50 space-y-0.5">
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 px-2.5 py-1 font-semibold">
                  Executive Toolkit
                </div>
                <button
                  onClick={() => { onOpenCompanyDossier(); setToolsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Company Dossier & Reviews</span>
                </button>
                <button
                  onClick={() => { onOpenOfferCalc(); setToolsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                >
                  <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Offer & In-Hand CTC Calc</span>
                </button>
                <button
                  onClick={() => { onOpenResumeVersions(); setToolsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Resume Version History</span>
                </button>
                <button
                  onClick={() => { onOpenInvoices(); setToolsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gig Earnings & Invoices</span>
                </button>
                <button
                  onClick={() => { onOpenContract(); setToolsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                >
                  <FileSignature className="w-3.5 h-3.5 text-purple-400" />
                  <span>Freelance Contract Gen</span>
                </button>
                <div className="my-1 border-t border-zinc-800" />
                <button
                  onClick={() => { onToggleTheme(); setToolsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 transition-colors text-left"
                >
                  {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isLightMode ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button
                  onClick={() => { onOpenShortcuts(); setToolsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 transition-colors text-left"
                >
                  <Keyboard className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Keyboard Shortcuts (?)</span>
                </button>
              </div>
            )}
          </div>

          {/* Telegram Bot Test */}
          <button
            onClick={onSendTelegramTest}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-blue-950/40 text-blue-400 border border-blue-500/30 rounded-lg transition-all whitespace-nowrap"
            title="Test Dispatch to Telegram Bot (@Job_huntet_bot)"
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Telegram</span>
          </button>

          {/* Refresh / Live Scan */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Live Scan for Fresh Jobs & Gigs Now"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition-all whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Scanning...' : 'Live Scan'}</span>
          </button>

          {/* User Auth */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap ${
              currentUser
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700'
            }`}
            title={currentUser ? `Logged in as ${currentUser.email}` : 'Sign in with Gmail & Password'}
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${currentUser ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            <span className="truncate max-w-[80px] sm:max-w-[110px]">
              {currentUser ? currentUser.name : 'Sign In'}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Navigation Bar */}
      <div className="lg:hidden border-t border-zinc-800/80 bg-zinc-950 px-3 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'jobs' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Jobs ({jobCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('gigs')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'gigs' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gigs ({gigCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'tracker' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
          }`}
        >
          <Kanban className="w-3.5 h-3.5" />
          <span>Pipeline ({trackerCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Intel</span>
        </button>
      </div>
    </header>
  );
};
