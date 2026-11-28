import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  Search, 
  Globe2, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  DollarSign,
  Video,
  GraduationCap,
  PenTool,
  Palette,
  ClipboardList,
  Code2,
  Sparkles,
  Layers,
  MapPin,
  Building,
  UserCheck,
  LogOut,
  Bookmark,
  Send,
  Plus,
  Flame,
  RefreshCw
} from 'lucide-react';
import { Job, Gig, ResumeProfile, TrackedApplication, AutomationSettings, UserAccount } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { JobCard } from './components/JobCard';
import { GigCard } from './components/GigCard';
import { TrackerView } from './components/TrackerView';
import { ProfileModal } from './components/ProfileModal';
import { ColdEmailModal } from './components/ColdEmailModal';
import { AutomationModal } from './components/AutomationModal';
import { OnboardingModal } from './components/OnboardingModal';
import { JobDetailModal } from './components/JobDetailModal';
import { ProposalModal } from './components/ProposalModal';
import { CompanyDossierModal } from './components/CompanyDossierModal';
import { CoverLetterModal } from './components/CoverLetterModal';
import { AnalyticsView } from './components/AnalyticsView';
import { JobComparisonModal } from './components/JobComparisonModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ResumeVersionsModal } from './components/ResumeVersionsModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { VoiceInterviewModal } from './components/VoiceInterviewModal';
import { TailoredResumeModal } from './components/TailoredResumeModal';
import { ReferralFinderModal } from './components/ReferralFinderModal';
import { OutreachSequenceModal } from './components/OutreachSequenceModal';
import { OfferCalculatorModal } from './components/OfferCalculatorModal';
import { CodingSandboxModal } from './components/CodingSandboxModal';
import { ContractGeneratorModal } from './components/ContractGeneratorModal';
import { DashboardView } from './components/DashboardView';
import { InterviewPreparatoryChartModal } from './components/InterviewPreparatoryChartModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'gigs' | 'tracker' | 'analytics'>('dashboard');
  const [jobsSubFilter, setJobsSubFilter] = useState<'all' | 'bookmarked' | 'will-apply'>('all');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [profiles, setProfiles] = useState<ResumeProfile[]>([]);
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [automation, setAutomation] = useState<AutomationSettings | null>(null);

  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingGigs, setLoadingGigs] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters for jobs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [minScore, setMinScore] = useState(50);
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Filters for gigs
  const [gigCategory, setGigCategory] = useState<string>('all');
  const [onlyMatchedGigs, setOnlyMatchedGigs] = useState<boolean>(false);

  // Pagination
  const [jobsPage, setJobsPage] = useState<number>(1);
  const [gigsPage, setGigsPage] = useState<number>(1);
  const JOBS_PER_PAGE = 20;
  const GIGS_PER_PAGE = 12;

  // Bulk Selection & Comparison
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [comparedJobs, setComparedJobs] = useState<Job[]>([]);

  // Modals & session
  const [profileOpen, setProfileOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [automationOpen, setAutomationOpen] = useState(false);
  const [selectedJobForEmail, setSelectedJobForEmail] = useState<Job | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedGigForProposal, setSelectedGigForProposal] = useState<Gig | null>(null);
  const [selectedCompanyForDossier, setSelectedCompanyForDossier] = useState<string | null>(null);
  const [coverLetterJob, setCoverLetterJob] = useState<Job | null>(null);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [resumeVersionsOpen, setResumeVersionsOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [selectedJobForVoiceMock, setSelectedJobForVoiceMock] = useState<Job | null>(null);
  const [selectedJobForTailoredResume, setSelectedJobForTailoredResume] = useState<Job | null>(null);
  const [selectedJobForReferral, setSelectedJobForReferral] = useState<Job | null>(null);
  const [selectedJobForOutreachSequence, setSelectedJobForOutreachSequence] = useState<Job | null>(null);
  const [selectedJobForCodingSandbox, setSelectedJobForCodingSandbox] = useState<Job | null>(null);
  const [offerCalcOpen, setOfferCalcOpen] = useState(false);
  const [contractGeneratorOpen, setContractGeneratorOpen] = useState(false);
  const [selectedJobForPrepChart, setSelectedJobForPrepChart] = useState<Job | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('jobhunter_auth_token');
    if (!token) return;
    try {
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.user) {
        setCurrentUser(res.data.user);
      }
    } catch {
      localStorage.removeItem('jobhunter_auth_token');
      setCurrentUser(null);
    }
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('jobhunter_auth_token');
    setCurrentUser(null);
    showToast('Logged out of session');
  };

  const loadData = async () => {
    setLoadingJobs(true);
    setLoadingGigs(true);
    try {
      const [profileRes, autoRes, trackerRes, jobsRes, gigsRes] = await Promise.all([
        axios.get('/api/profile'),
        axios.get('/api/automation'),
        axios.get('/api/tracker'),
        axios.get('/api/jobs'),
        axios.get('/api/gigs')
      ]);

      if (profileRes.data?.profile) setProfile(profileRes.data.profile);
      if (profileRes.data?.profiles) setProfiles(profileRes.data.profiles);
      if (autoRes.data?.settings) setAutomation(autoRes.data.settings);
      if (trackerRes.data?.applications) setApplications(trackerRes.data.applications);
      if (jobsRes.data?.jobs) setJobs(jobsRes.data.jobs);
      if (gigsRes.data?.gigs) setGigs(gigsRes.data.gigs);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoadingJobs(false);
      setLoadingGigs(false);
    }
  };

  useEffect(() => {
    loadData();
    checkAuth();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await axios.post('/api/jobs/refresh');
      if (res.data?.jobs) {
        setJobs(res.data.jobs);
        showToast(`Refreshed ${res.data.count || res.data.jobs.length} direct apply jobs!`);
      }
      const gigsRes = await axios.get('/api/gigs');
      if (gigsRes.data?.gigs) setGigs(gigsRes.data.gigs);

      const autoRes = await axios.get('/api/automation');
      if (autoRes.data?.settings) setAutomation(autoRes.data.settings);
    } catch (err) {
      console.error('Refresh error:', err);
      showToast('Refresh encountered an issue. Re-trying...');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectProfile = async (profileId: string) => {
    try {
      showToast('Switching active resume profile & re-scoring...');
      const res = await axios.post('/api/profile/select', { profileId });
      if (res.data?.success) {
        setProfile(res.data.profile);
        if (res.data.profiles) setProfiles(res.data.profiles);
        // Reload fresh jobs scored for this profile
        const jobsRes = await axios.get('/api/jobs');
        if (jobsRes.data?.jobs) setJobs(jobsRes.data.jobs);
        showToast(`Active profile: "${res.data.profile.profileName}"`);
      }
    } catch (err) {
      console.error('Profile select error:', err);
    }
  };

  // NOT INTERESTED: Permanently hides job across refreshes
  const handleNotInterested = async (jobId: string) => {
    setJobs(jobs.filter(j => j.id !== jobId));
    try {
      await axios.post('/api/jobs/not-interested', { jobId });
      showToast('Job permanently removed. Will never show again.');
    } catch (err) {
      console.error('Not interested error:', err);
    }
  };

  // BOOKMARK: Toggles bookmark
  const handleBookmark = async (job: Job) => {
    const existing = applications.find(a => a.jobId === job.id);
    if (existing && existing.status === 'bookmarked') {
      try {
        await axios.delete(`/api/tracker/${existing.id}`);
        setApplications(applications.filter(a => a.id !== existing.id));
        showToast(`Removed "${job.title}" from bookmarks.`);
      } catch (err) {}
    } else {
      try {
        const res = await axios.post('/api/tracker', {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          directApplyUrl: job.directApplyUrl,
          status: 'bookmarked',
          type: 'full-time',
          notes: 'Bookmarked for later'
        });
        if (res.data?.application) {
          setApplications([res.data.application, ...applications.filter(a => a.jobId !== job.id)]);
          showToast(`Bookmarked "${job.title}"!`);
        }
      } catch (err) {}
    }
  };

  // WILL APPLY: Marks as will apply
  const handleWillApply = async (job: Job) => {
    try {
      const res = await axios.post('/api/tracker', {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        directApplyUrl: job.directApplyUrl,
        status: 'will-apply',
        type: 'full-time',
        notes: 'Will apply today'
      });
      if (res.data?.application) {
        setApplications([res.data.application, ...applications.filter(a => a.jobId !== job.id)]);
        showToast(`Marked "${job.title}" as Will Apply!`);
      }
    } catch (err) {}
  };

  const handleApplyClick = async (job: Job) => {
    const exists = applications.some(a => a.jobId === job.id);
    if (!exists) {
      try {
        const res = await axios.post('/api/tracker', {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          directApplyUrl: job.directApplyUrl,
          status: 'applied',
          type: 'full-time',
          notes: 'Opened direct application portal'
        });
        if (res.data?.application) {
          setApplications([res.data.application, ...applications]);
        }
      } catch (err) {}
    }
    showToast(`Opening ${job.company} Career Portal...`);
  };

  const handleTrackGig = async (gig: Gig) => {
    try {
      const res = await axios.post('/api/tracker', {
        jobId: gig.id,
        jobTitle: gig.title,
        company: gig.clientOrPlatform,
        directApplyUrl: gig.directApplyUrl,
        status: 'will-apply',
        type: 'wfh-gig',
        salary: gig.payout,
        notes: `Category: ${gig.category} - ${gig.estimatedHours}`
      });
      if (res.data?.application) {
        setApplications([res.data.application, ...applications.filter(a => a.jobId !== gig.id)]);
        showToast(`Saved "${gig.title}" to Tracker.`);
      }
    } catch (err) {
      console.error('Track error:', err);
    }
  };

  const handleMarkEmailed = async (job: Job) => {
    try {
      const res = await axios.post('/api/tracker', {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        directApplyUrl: job.directApplyUrl,
        status: 'cold-emailed',
        type: 'full-time',
        coldEmailSent: true,
        notes: 'Cold email prepared/dispatched'
      });
      if (res.data?.application) {
        setApplications([res.data.application, ...applications.filter(a => a.jobId !== job.id)]);
      }
    } catch (err) {}
    showToast(`Cold outreach recorded for ${job.company}!`);
  };

  const handleUpdateApplicationStatus = async (id: string, newStatus: any) => {
    try {
      await axios.put(`/api/tracker/${id}`, { status: newStatus });
      setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
      showToast(`Updated stage to ${newStatus}.`);
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleUpdateApplication = async (id: string, updates: Partial<TrackedApplication>) => {
    try {
      await axios.put(`/api/tracker/${id}`, updates);
      setApplications(applications.map(a => a.id === id ? { ...a, ...updates } : a));
      showToast('Application updated.');
    } catch (err) {
      console.error('Update app error:', err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await axios.delete(`/api/tracker/${id}`);
      setApplications(applications.filter(a => a.id !== id));
      showToast('Removed from tracker.');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSendTelegramTest = async () => {
    try {
      showToast('✈️ Dispatching alert to Telegram (@Job_huntet_bot)...');
      const res = await axios.post('/api/outreach/telegram-test');
      if (res.data?.success) {
        showToast('✅ Telegram alert delivered! Check your Telegram app.');
      } else {
        showToast(`Telegram status: ${res.data?.error || 'Check bot setup'}`);
      }
    } catch (err: any) {
      showToast(`Telegram notice: ${err.message}`);
    }
  };

  // Bulk Actions
  const handleToggleSelectJob = (jobId: string) => {
    const next = new Set(selectedJobIds);
    if (next.has(jobId)) next.delete(jobId);
    else next.add(jobId);
    setSelectedJobIds(next);
  };

  const handleSelectAllJobs = (filteredList: Job[]) => {
    if (selectedJobIds.size === filteredList.length) {
      setSelectedJobIds(new Set());
    } else {
      setSelectedJobIds(new Set(filteredList.map(j => j.id)));
    }
  };

  const handleBulkBookmark = async () => {
    const targetJobs = jobs.filter(j => selectedJobIds.has(j.id));
    for (const j of targetJobs) {
      await handleBookmark(j);
    }
    showToast(`Bulk bookmarked ${targetJobs.length} jobs.`);
    setSelectedJobIds(new Set());
  };

  const handleBulkWillApply = async () => {
    const targetJobs = jobs.filter(j => selectedJobIds.has(j.id));
    for (const j of targetJobs) {
      await handleWillApply(j);
    }
    showToast(`Marked ${targetJobs.length} jobs as Will Apply.`);
    setSelectedJobIds(new Set());
  };

  const handleBulkNotInterested = async () => {
    const ids = Array.from(selectedJobIds);
    try {
      await axios.post('/api/jobs/bulk-not-interested', { jobIds: ids });
      setJobs(jobs.filter(j => !selectedJobIds.has(j.id)));
      showToast(`Permanently dismissed ${ids.length} jobs.`);
      setSelectedJobIds(new Set());
    } catch (err) {
      console.error(err);
    }
  };

  // Compare Pin
  const handleToggleCompare = (job: Job) => {
    if (comparedJobs.some(j => j.id === job.id)) {
      setComparedJobs(comparedJobs.filter(j => j.id !== job.id));
    } else {
      if (comparedJobs.length >= 3) {
        showToast('You can compare up to 3 jobs side-by-side.');
        return;
      }
      setComparedJobs([...comparedJobs, job]);
      showToast(`Pinned "${job.company}" to comparison matrix.`);
    }
  };

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '?') {
        setShortcutsModalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setSelectedJobForDetails(null);
        setSelectedCompanyForDossier(null);
        setCoverLetterJob(null);
        setSelectedJobForEmail(null);
        setSelectedGigForProposal(null);
        setComparisonModalOpen(false);
        setInvoiceModalOpen(false);
        setResumeVersionsOpen(false);
        setShortcutsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper Maps
  const bookmarkedMap = new Set(applications.filter(a => a.status === 'bookmarked').map(a => a.jobId));
  const willApplyMap = new Set(applications.filter(a => a.status === 'will-apply').map(a => a.jobId));
  const appliedMap = new Set(applications.filter(a => a.status === 'applied').map(a => a.jobId));

  // Filtered jobs: UNLIMITED (no slice), respectful of subFilter
  const filteredJobs = jobs.filter(job => {
    // Sub filter: all vs bookmarked vs will-apply
    if (jobsSubFilter === 'bookmarked' && !bookmarkedMap.has(job.id)) return false;
    if (jobsSubFilter === 'will-apply' && !willApplyMap.has(job.id)) return false;

    const cleanQ = searchQuery.toLowerCase().trim();
    const matchesSearch = cleanQ === '' || 
      job.title.toLowerCase().includes(cleanQ) ||
      job.company.toLowerCase().includes(cleanQ) ||
      job.location.toLowerCase().includes(cleanQ) ||
      (job.requirements && job.requirements.some(r => r.toLowerCase().includes(cleanQ))) ||
      (job.descriptionSnippet && job.descriptionSnippet.toLowerCase().includes(cleanQ));

    const matchesSource = selectedSource === 'all' || job.source === selectedSource;
    const matchesScore = job.matchScore >= minScore;
    const matchesWorkplace = selectedWorkplace === 'all' || job.workplaceType === selectedWorkplace;

    let matchesExperience = true;
    if (selectedExperience === 'fresher') {
      matchesExperience = job.experienceLevel === 'fresher' || /fresher|intern|entry|0-1|associate|graduate/i.test(job.title + ' ' + (job.descriptionSnippet || ''));
    } else if (selectedExperience === 'junior') {
      matchesExperience = job.experienceLevel === 'junior' || /junior|jr\.|sde 1|sde-1|1-2|1-3|software engineer 1|frontend developer|full stack/i.test(job.title + ' ' + (job.descriptionSnippet || ''));
    } else if (selectedExperience === 'mid-senior') {
      matchesExperience = job.experienceLevel === 'mid-senior' || /senior|sr\.|lead|principal|staff|3\+|5\+/i.test(job.title + ' ' + (job.descriptionSnippet || ''));
    } else if (selectedExperience !== 'all') {
      matchesExperience = job.experienceLevel === selectedExperience;
    }

    let matchesLocation = true;
    if (selectedLocation === 'nearby') {
      const userLoc = (profile?.location || 'delhi').toLowerCase();
      matchesLocation = job.location.toLowerCase().includes('delhi') || 
                        job.location.toLowerCase().includes('noida') || 
                        job.location.toLowerCase().includes('gurgaon') || 
                        job.location.toLowerCase().includes('remote');
    } else if (selectedLocation !== 'all') {
      matchesLocation = job.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                        Boolean(job.city && job.city.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    return matchesSearch && matchesSource && matchesScore && matchesWorkplace && matchesExperience && matchesLocation;
  });

  // Filtered gigs
  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = searchQuery === '' ||
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.clientOrPlatform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.matchedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = gigCategory === 'all' || gig.category === gigCategory;
    const matchesProfile = !onlyMatchedGigs || gig.isProfileMatched;

    return matchesSearch && matchesCat && matchesProfile;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setJobsPage(1);
  }, [searchQuery, selectedSource, minScore, selectedWorkplace, selectedExperience, selectedLocation, jobsSubFilter]);

  useEffect(() => {
    setGigsPage(1);
  }, [searchQuery, gigCategory, onlyMatchedGigs]);

  const totalJobsPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const safeJobsPage = Math.min(jobsPage, totalJobsPages);
  const paginatedJobs = filteredJobs.slice((safeJobsPage - 1) * JOBS_PER_PAGE, safeJobsPage * JOBS_PER_PAGE);

  const totalGigsPages = Math.max(1, Math.ceil(filteredGigs.length / GIGS_PER_PAGE));
  const safeGigsPage = Math.min(gigsPage, totalGigsPages);
  const paginatedGigs = filteredGigs.slice((safeGigsPage - 1) * GIGS_PER_PAGE, safeGigsPage * GIGS_PER_PAGE);

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-xs shadow-2xl border border-zinc-300 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Onboarding / Upload New Resume Modal */}
      {onboardingOpen && (
        <OnboardingModal
          onCompleted={(newProf) => {
            setProfile(newProf);
            setOnboardingOpen(false);
            showToast(`Resume profile "${newProf.profileName}" saved!`);
            handleRefresh();
          }}
        />
      )}

      {/* Navbar with Profile Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        jobCount={filteredJobs.length}
        gigCount={filteredGigs.length}
        trackerCount={applications.length}
        profile={profile}
        profiles={profiles}
        automation={automation}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenNewResumeUpload={() => setOnboardingOpen(true)}
        onSelectProfile={handleSelectProfile}
        onOpenAutomation={() => setAutomationOpen(true)}
        onOpenCompanyDossier={() => setSelectedCompanyForDossier('Google')}
        onOpenResumeVersions={() => setResumeVersionsOpen(true)}
        onOpenInvoices={() => setInvoiceModalOpen(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onOpenOfferCalc={() => setOfferCalcOpen(true)}
        onOpenContract={() => setContractGeneratorOpen(true)}
        onSendTelegramTest={handleSendTelegramTest}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        isLightMode={isLightMode}
        onToggleTheme={() => setIsLightMode(!isLightMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 w-full space-y-6">
        {/* Tab 0: Unified Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            jobs={jobs}
            gigs={gigs}
            profile={profile}
            applications={applications}
            automation={automation}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectJob={(job) => setSelectedJobForDetails(job)}
            onSelectGig={(gig) => setSelectedGigForProposal(gig)}
            onOpenVoiceInterview={(job) => {
              setSelectedJobForVoiceMock(job || jobs[0] || null);
            }}
            onOpenOfferCalc={() => setOfferCalcOpen(true)}
            onOpenReferralFinder={() => setSelectedJobForReferral(jobs[0] || null)}
            onOpenAutomation={() => setAutomationOpen(true)}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        )}

        {/* Executive Header Banner with Active Profile Info (for jobs/gigs tabs) */}
        {(activeTab === 'jobs' || activeTab === 'gigs') && (
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Unlimited Verified Direct Sourcing
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Active Profile: <strong className="text-white">{profile?.profileName || 'Resume Profile'}</strong>
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  • {filteredJobs.length} Active Jobs Available
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {profile?.name ? `Opportunities for ${profile.name}` : 'Career & Earning Dashboard'}
              </h1>
              <p className="text-xs text-zinc-400 max-w-2xl">
                Every job is evaluated against your selected resume. Bookmark openings, mark "Will Apply", or click Not Interested to permanently remove them.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnboardingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Resume</span>
              </button>

              <button
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Edit Active Profile</span>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Tab 1: Full-Time & MNCs */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {/* Sub-tabs: All vs Bookmarked vs Will Apply */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setJobsSubFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    jobsSubFilter === 'all'
                      ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  All Verified Jobs ({jobs.length})
                </button>

                <button
                  onClick={() => setJobsSubFilter('bookmarked')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    jobsSubFilter === 'bookmarked'
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Bookmarked ({bookmarkedMap.size})</span>
                </button>

                <button
                  onClick={() => setJobsSubFilter('will-apply')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    jobsSubFilter === 'will-apply'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Will Apply ({willApplyMap.size})</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-400 font-mono">
                  Page {safeJobsPage} of {totalJobsPages} ({filteredJobs.length} openings)
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Scanning Live Portals...' : 'Refresh & Scan New'}</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Search query */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search title, company (Google, Stripe...), or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                {/* Source Filter */}
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
                  title="Source ATS Engine"
                >
                  <option value="all">All Sources</option>
                  <option value="greenhouse">Greenhouse Direct</option>
                  <option value="lever">Lever Direct</option>
                  <option value="ashby">Ashby Direct</option>
                  <option value="mnc">MNC Portals (Google, MSFT, Amazon, TCS...)</option>
                </select>

                {/* Location Select Box */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
                  title="Job Location"
                >
                  <option value="all">📍 All Locations</option>
                  <option value="nearby">📍 Nearby (Delhi-NCR / Noida / Gurgaon)</option>
                  <option value="Bengaluru">📍 Bengaluru / Karnataka</option>
                  <option value="Hyderabad">📍 Hyderabad / Telangana</option>
                  <option value="Pune">📍 Pune / Maharashtra</option>
                  <option value="Mumbai">📍 Mumbai / Maharashtra</option>
                  <option value="Remote">🌍 100% Remote Anywhere</option>
                </select>

                {/* Workplace Mode */}
                <select
                  value={selectedWorkplace}
                  onChange={(e) => setSelectedWorkplace(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
                  title="Workplace Mode"
                >
                  <option value="all">🏢 All Workplace Modes</option>
                  <option value="remote">🌍 Remote Only</option>
                  <option value="hybrid">⚡ Hybrid</option>
                  <option value="onsite">🏢 In-Office / On-site</option>
                </select>

                {/* Experience Tier Mode */}
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
                  title="Experience Level"
                >
                  <option value="all">🎯 All Experience Levels</option>
                  <option value="fresher">🎓 Fresher / Early Career (0-1 yrs)</option>
                  <option value="junior">💼 Junior (1-3 yrs)</option>
                  <option value="mid-senior">🚀 Mid-Senior (3+ yrs)</option>
                </select>

                {/* Save Smart Alert Button */}
                <button
                  type="button"
                  onClick={() => {
                    const ruleName = `${searchQuery || 'Target Roles'} (${selectedWorkplace !== 'all' ? selectedWorkplace : 'Any'} / ${selectedExperience !== 'all' ? selectedExperience : 'All exp'})`;
                    showToast(`🔔 Smart Alert Active: Monitoring new ${ruleName} openings!`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-amber-300 transition-colors"
                  title="Set smart alert rule for this filter"
                >
                  <span>🔔 Set Alert Rule</span>
                </button>
              </div>

              {/* Quick Tech Stack & Role Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/60">
                <span className="text-[11px] text-zinc-500 font-mono pr-1">⚡ Quick Filter:</span>
                {['React', 'Next.js', 'Node.js', 'TypeScript', 'Full Stack', 'Frontend', 'Python', 'AWS', 'Docker'].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setSearchQuery(searchQuery === tech ? '' : tech)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                      searchQuery === tech
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] text-zinc-400 hover:text-red-400 underline ml-1"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Job Grid */}
            {loadingJobs ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-7 h-7 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">Loading verified direct ATS listings for {profile?.name}...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="py-20 text-center space-y-3 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                <Briefcase className="w-9 h-9 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-semibold text-zinc-300">No jobs match your current filters</h3>
                <p className="text-xs text-zinc-500">Try switching your location or workplace mode.</p>
                <button
                  onClick={() => { 
                    setSearchQuery(''); 
                    setSelectedLocation('all'); 
                    setSelectedWorkplace('all'); 
                    setSelectedExperience('all');
                    setSelectedSource('all');
                    setJobsSubFilter('all');
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bulk Select Control Bar */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedJobIds.size > 0 && selectedJobIds.size === filteredJobs.length}
                      onChange={() => handleSelectAllJobs(filteredJobs)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <span>Select All Visible Jobs ({filteredJobs.length})</span>
                  </label>

                  {selectedJobIds.size > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{selectedJobIds.size} selected</span>
                      <button
                        onClick={handleBulkBookmark}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-medium"
                      >
                        Bookmark All
                      </button>
                      <button
                        onClick={handleBulkWillApply}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-300 font-medium"
                      >
                        Will Apply All
                      </button>
                      <button
                        onClick={handleBulkNotInterested}
                        className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/40 font-medium"
                      >
                        Dismiss All
                      </button>
                      <button
                        onClick={() => setSelectedJobIds(new Set())}
                        className="text-zinc-500 hover:text-white underline text-[11px]"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      profile={profile}
                      isSelected={selectedJobIds.has(job.id)}
                      onToggleSelect={handleToggleSelectJob}
                      isCompared={comparedJobs.some(c => c.id === job.id)}
                      onToggleCompare={handleToggleCompare}
                      onViewDetails={(j) => setSelectedJobForDetails(j)}
                      onOpenCoverLetter={(j) => setCoverLetterJob(j)}
                      onOpenCompanyDossier={(comp) => setSelectedCompanyForDossier(comp)}
                      onOpenVoiceMock={(j) => setSelectedJobForVoiceMock(j)}
                      onOpenTailoredResume={(j) => setSelectedJobForTailoredResume(j)}
                      onOpenReferral={(j) => setSelectedJobForReferral(j)}
                      onOpenOutreachSequence={(j) => setSelectedJobForOutreachSequence(j)}
                      onOpenCodingSandbox={(j) => setSelectedJobForCodingSandbox(j)}
                      onApply={handleApplyClick}
                      onOpenColdEmail={(j) => setSelectedJobForEmail(j)}
                      onBookmark={handleBookmark}
                      onWillApply={handleWillApply}
                      onNotInterested={handleNotInterested}
                      isBookmarked={bookmarkedMap.has(job.id)}
                      isWillApply={willApplyMap.has(job.id)}
                      isApplied={appliedMap.has(job.id)}
                    />
                  ))}
                </div>

                {/* Jobs Pagination Bar */}
                {totalJobsPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/80">
                    <div className="text-xs text-zinc-400 font-mono">
                      Showing {(safeJobsPage - 1) * JOBS_PER_PAGE + 1}–{Math.min(safeJobsPage * JOBS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length} jobs
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setJobsPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={safeJobsPage === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 disabled:opacity-40 transition-all"
                      >
                        ⬅️ Prev
                      </button>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
                        Page {safeJobsPage} / {totalJobsPages}
                      </span>
                      <button
                        onClick={() => { setJobsPage(p => Math.min(totalJobsPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={safeJobsPage === totalJobsPages}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 disabled:opacity-40 transition-all"
                      >
                        Next ➡️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: WFH Side Gigs */}
        {activeTab === 'gigs' && (
          <div className="space-y-4">
            {/* Category Filter Bar */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search gigs by title or keywords (e.g. reels, tutoring, python, writing)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                {/* Match toggle & Refresh */}
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyMatchedGigs}
                      onChange={(e) => setOnlyMatchedGigs(e.target.checked)}
                      className="w-3.5 h-3.5 accent-emerald-500 rounded"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Matched with My Profile Interests</span>
                  </label>

                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Fetching Live Gigs...' : 'Refresh & Fetch New Gigs'}</span>
                  </button>
                </div>
              </div>

              {/* Diverse Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { id: 'all', label: 'All Gigs', icon: Layers },
                  { id: 'video-editing', label: 'Video Editing & Shorts', icon: Video },
                  { id: 'tutoring', label: 'Online Tutoring & Teaching', icon: GraduationCap },
                  { id: 'content-writing', label: 'Content Writing & Copy', icon: PenTool },
                  { id: 'design', label: 'Design & Canva', icon: Palette },
                  { id: 'virtual-assistant', label: 'Virtual Assistant', icon: ClipboardList },
                  { id: 'web-dev', label: 'Web & Tech Fixes', icon: Code2 },
                ].map((cat) => {
                  const CatIcon = cat.icon;
                  const isActive = gigCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setGigCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
                          : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gigs Grid */}
            {loadingGigs ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-7 h-7 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">Loading verified WFH and side earning gigs...</p>
              </div>
            ) : filteredGigs.length === 0 ? (
              <div className="py-20 text-center space-y-3 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                <DollarSign className="w-9 h-9 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-semibold text-zinc-300">No gigs found under this category</h3>
                <p className="text-xs text-zinc-500">Uncheck "Matched with My Profile" to explore all open gigs.</p>
                <button
                  onClick={() => { setGigCategory('all'); setOnlyMatchedGigs(false); setSearchQuery(''); }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                >
                  Show All Gigs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedGigs.map((gig) => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      onTrack={handleTrackGig}
                      onOpenProposal={(g) => setSelectedGigForProposal(g)}
                      isTracked={willApplyMap.has(gig.id) || appliedMap.has(gig.id)}
                    />
                  ))}
                </div>

                {/* Gigs Pagination Bar */}
                {totalGigsPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/80">
                    <div className="text-xs text-zinc-400 font-mono">
                      Showing {(safeGigsPage - 1) * GIGS_PER_PAGE + 1}–{Math.min(safeGigsPage * GIGS_PER_PAGE, filteredGigs.length)} of {filteredGigs.length} gigs
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setGigsPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={safeGigsPage === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 disabled:opacity-40 transition-all"
                      >
                        ⬅️ Prev
                      </button>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
                        Page {safeGigsPage} / {totalGigsPages}
                      </span>
                      <button
                        onClick={() => { setGigsPage(p => Math.min(totalGigsPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={safeGigsPage === totalGigsPages}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 disabled:opacity-40 transition-all"
                      >
                        Next ➡️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Tracker Kanban */}
        {activeTab === 'tracker' && (
          <TrackerView
            applications={applications}
            onUpdateStatus={handleUpdateApplicationStatus}
            onDeleteApplication={handleDeleteApplication}
            onUpdateApplication={handleUpdateApplication}
          />
        )}

        {/* Tab 4: Market Intelligence & Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}
      </main>

      {/* Floating Compared Jobs Banner */}
      {comparedJobs.length > 0 && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900 border border-emerald-500/50 shadow-2xl text-xs text-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="font-semibold text-emerald-400">
            {comparedJobs.length} Job{comparedJobs.length > 1 ? 's' : ''} Pinned to Compare
          </span>
          <button
            onClick={() => setComparisonModalOpen(true)}
            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors"
          >
            Open Side-by-Side Matrix
          </button>
          <button
            onClick={() => setComparedJobs([])}
            className="text-zinc-500 hover:text-white text-[11px]"
          >
            Clear
          </button>
        </div>
      )}

      {/* Modals */}
      {profileOpen && (
        <ProfileModal
          profile={profile}
          onClose={() => setProfileOpen(false)}
          onUpdate={(updated) => {
            setProfile(updated);
            showToast('Profile updated.');
          }}
        />
      )}

      {automationOpen && (
        <AutomationModal
          automation={automation}
          onClose={() => setAutomationOpen(false)}
          onUpdate={(updated) => {
            setAutomation(updated);
            showToast('Automation schedule updated.');
          }}
          onTriggerNow={async () => {
            await handleRefresh();
            setAutomationOpen(false);
          }}
          isTriggering={isRefreshing}
        />
      )}

      {selectedJobForEmail && (
        <ColdEmailModal
          job={selectedJobForEmail}
          profile={profile}
          onClose={() => setSelectedJobForEmail(null)}
          onMarkEmailed={handleMarkEmailed}
        />
      )}

      {selectedJobForDetails && (
        <JobDetailModal
          job={selectedJobForDetails}
          profile={profile}
          onClose={() => setSelectedJobForDetails(null)}
          onApply={handleApplyClick}
          onBookmark={handleBookmark}
          onWillApply={handleWillApply}
          isBookmarked={Boolean(selectedJobForDetails && bookmarkedMap.has(selectedJobForDetails.id))}
          isWillApply={Boolean(selectedJobForDetails && willApplyMap.has(selectedJobForDetails.id))}
          onOpenPrepChart={(j) => setSelectedJobForPrepChart(j)}
        />
      )}

      {selectedJobForPrepChart && (
        <InterviewPreparatoryChartModal
          job={selectedJobForPrepChart}
          profile={profile}
          onClose={() => setSelectedJobForPrepChart(null)}
          onOpenVoiceInterview={(j) => setSelectedJobForVoiceMock(j)}
        />
      )}

      {selectedGigForProposal && (
        <ProposalModal
          gig={selectedGigForProposal}
          profile={profile}
          onClose={() => setSelectedGigForProposal(null)}
        />
      )}

      {selectedCompanyForDossier && (
        <CompanyDossierModal
          initialCompany={selectedCompanyForDossier}
          onClose={() => setSelectedCompanyForDossier(null)}
        />
      )}

      {coverLetterJob && (
        <CoverLetterModal
          job={coverLetterJob}
          profile={profile}
          onClose={() => setCoverLetterJob(null)}
        />
      )}

      {comparisonModalOpen && (
        <JobComparisonModal
          jobs={comparedJobs}
          onClose={() => setComparisonModalOpen(false)}
          onRemoveJob={(id) => setComparedJobs(comparedJobs.filter(j => j.id !== id))}
          onApply={handleApplyClick}
        />
      )}

      {invoiceModalOpen && (
        <InvoiceModal
          profile={profile}
          onClose={() => setInvoiceModalOpen(false)}
        />
      )}

      {resumeVersionsOpen && (
        <ResumeVersionsModal
          profile={profile}
          onClose={() => setResumeVersionsOpen(false)}
        />
      )}

      {shortcutsModalOpen && (
        <KeyboardShortcutsModal
          onClose={() => setShortcutsModalOpen(false)}
        />
      )}

      {selectedJobForVoiceMock && (
        <VoiceInterviewModal
          job={selectedJobForVoiceMock}
          profile={profile}
          onClose={() => setSelectedJobForVoiceMock(null)}
        />
      )}

      {selectedJobForTailoredResume && (
        <TailoredResumeModal
          job={selectedJobForTailoredResume}
          profile={profile}
          onClose={() => setSelectedJobForTailoredResume(null)}
        />
      )}

      {selectedJobForReferral && (
        <ReferralFinderModal
          job={selectedJobForReferral}
          profile={profile}
          onClose={() => setSelectedJobForReferral(null)}
        />
      )}

      {selectedJobForOutreachSequence && (
        <OutreachSequenceModal
          job={selectedJobForOutreachSequence}
          profile={profile}
          onClose={() => setSelectedJobForOutreachSequence(null)}
        />
      )}

      {selectedJobForCodingSandbox && (
        <CodingSandboxModal
          job={selectedJobForCodingSandbox}
          onClose={() => setSelectedJobForCodingSandbox(null)}
        />
      )}

      {offerCalcOpen && (
        <OfferCalculatorModal
          onClose={() => setOfferCalcOpen(false)}
        />
      )}

      {contractGeneratorOpen && (
        <ContractGeneratorModal
          profile={profile}
          onClose={() => setContractGeneratorOpen(false)}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </div>
  );
};
