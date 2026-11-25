import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
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
  LayoutDashboard 
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
  automation,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenNewResumeUpload,
  onSelectProfile,
  onOpenAutomation,
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Resume Profile Dropdown */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
            CH
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-left transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="max-w-[140px] sm:max-w-[200px]">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1 truncate">
                  <span className="truncate">{profile?.profileName || 'Active Resume Profile'}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  {profiles.length} Profile{profiles.length > 1 ? 's' : ''} saved
                </div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in duration-100">
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

                <div className="pt-1.5 mt-1 border-t border-zinc-800">
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

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'jobs'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>MNC & Core Jobs</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'jobs' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-500'
            }`}>
              {jobCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gigs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'gigs'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>WFH Side Gigs</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'gigs' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-500'
            }`}>
              {gigCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'tracker'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Pipeline</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'tracker' ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-500'
            }`}>
              {trackerCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Market Intel</span>
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Company Dossier Modal Trigger */}
          <button
            onClick={onOpenCompanyDossier}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition-all"
            title="Search Any Company Reviews & Culture"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Company Dossier</span>
          </button>

          {/* Resume Versions */}
          <button
            onClick={onOpenResumeVersions}
            className="p-2 rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all"
            title="Resume Version Control Snapshots"
          >
            <Tag className="w-3.5 h-3.5" />
          </button>

          {/* Invoices & Gig Earnings */}
          <button
            onClick={onOpenInvoices}
            className="p-2 rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all"
            title="Gig Earnings & Invoices"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Offer & RSU Calculator */}
          <button
            onClick={onOpenOfferCalc}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition-all"
            title="Offer Letter & RSU Equity Calculator"
          >
            <span>Offer CTC</span>
          </button>

          {/* Freelance Milestone Contract */}
          <button
            onClick={onOpenContract}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition-all"
            title="Freelance Client Agreement & Contract"
          >
            <span>Contract</span>
          </button>

          {/* Telegram Dispatch Test */}
          <button
            onClick={onSendTelegramTest}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-blue-950/40 text-blue-400 border border-blue-500/30 rounded-lg transition-all"
            title="Test Dispatch to Telegram Bot (@Job_huntet_bot)"
          >
            <span>✈️ Telegram</span>
          </button>

          {/* Shortcuts Cheat Sheet */}
          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-all"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          {/* Refresh harvest button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Scan for new jobs & gigs now"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">{isRefreshing ? 'Scanning...' : 'Scan'}</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-all"
            title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Edit profile */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-lg transition-all"
          >
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* User Auth & Telegram Account Sync */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              currentUser
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700'
            }`}
            title={currentUser ? `Logged in as ${currentUser.email}` : 'Sign in with Gmail & Password'}
          >
            <div className={`w-2 h-2 rounded-full ${currentUser ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            <span className="truncate max-w-[90px] sm:max-w-[130px]">
              {currentUser ? currentUser.name : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
