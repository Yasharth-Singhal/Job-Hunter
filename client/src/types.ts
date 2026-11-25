export type JobType = 'full-time' | 'contract' | 'part-time' | 'internship';
export type JobSource = 'greenhouse' | 'lever' | 'ashby' | 'remotive' | 'mnc' | 'linkedin' | 'workday' | 'direct';
export type WorkplaceType = 'remote' | 'hybrid' | 'onsite' | 'flexible';
export type ExperienceTier = 'fresher' | 'junior' | 'mid-senior' | 'all';

export interface HrContact {
  name?: string;
  role?: string;
  email?: string;
  linkedin?: string;
  confidence: number;
}

export interface HiringTeamIntel {
  recruiterTitle: string;
  recruiterEmailPattern: string;
  linkedinRecruiterUrl: string;
  linkedinManagerUrl: string;
  connectionNote: string;
}

export interface HrResumeAudit {
  atsScore: number;
  verdict: 'High Shortlist Probability' | 'Moderate Match (Needs Tweaks)' | 'Low Initial Match';
  criticalKeywordsToAdd: string[];
  matchedKeywords: string[];
  resumeTweaks: Array<{
    section: string;
    currentAdvice: string;
    suggestedBullet: string;
  }>;
  recruiterRedFlags: string[];
  hrSummary: string;
}

export interface InterviewPrepGuide {
  technicalQuestions: Array<{
    question: string;
    answerKey: string;
    whatHrLooksFor: string;
  }>;
  behavioralQuestions: Array<{
    question: string;
    starStrategy: string;
    sampleAnswer: string;
  }>;
  smartQuestionsToAskHr: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyDomain?: string;
  location: string;
  city?: string;
  isRemote: boolean;
  workplaceType: WorkplaceType;
  experienceLevel: ExperienceTier;
  type: JobType;
  source: JobSource;
  directApplyUrl: string;
  companyLogo?: string;
  descriptionSnippet: string;
  fullDescription: string;
  responsibilities: string[];
  requirements: string[];
  salary: string;
  department?: string;
  benefits: string[];
  postedAt: string;
  matchScore: number;
  matchReasons: string[];
  missingKeywords?: string[];
  hrContact?: HrContact;
  hiringTeam: HiringTeamIntel;
  category: 'core-career' | 'wfh-gig';
  isVerifiedDirect: boolean;
  hrAudit?: HrResumeAudit;
  interviewPrep?: InterviewPrepGuide;
  isStale?: boolean;
  staleDays?: number;
  duplicateSources?: string[];
  userNotes?: string;
}

export interface CompanyDossier {
  companyName: string;
  domain: string;
  rating: number;
  ratingsBreakdown: {
    workLifeBalance: number;
    cultureAndValues: number;
    compensationAndBenefits: number;
    seniorManagement: number;
    careerOpportunities: number;
    recommendToFriendPct: number;
    ceoApprovalPct: number;
  };
  overview: {
    headquarters: string;
    size: string;
    founded: string;
    industry: string;
    fundingStage: string;
    lastFundingOrValuation?: string;
  };
  cultureAndBehavior: {
    leadershipPrinciples: string[];
    workCulture: string;
    interviewDifficulty: 'Easy' | 'Medium' | 'Challenging' | 'Very Tough';
    interviewProcessStages: string[];
  };
  employeeReviews: {
    pros: string[];
    cons: string[];
    commonThemes: string[];
    featuredReview: {
      title: string;
      review: string;
      role: string;
      date: string;
    };
  };
  techStack: string[];
  recentNews: Array<{
    headline: string;
    date: string;
    source: string;
    sentiment: 'positive' | 'neutral' | 'caution';
  }>;
  layoffAlert: {
    hasRecentLayoffs: boolean;
    details?: string;
  };
}

export interface CoverLetter {
  id: string;
  jobId: string;
  company: string;
  jobTitle: string;
  letterText: string;
  createdAt: string;
}

export interface ResumeVersion {
  id: string;
  profileId: string;
  versionTag: string;
  targetCompany: string;
  targetRole: string;
  resumeContent: string;
  keyHighlights: string[];
  createdAt: string;
}

export interface SalaryIntelligence {
  role: string;
  experienceTier: string;
  marketAvgINR: string;
  p25INR: string;
  p75INR: string;
  p90INR: string;
  marketAvgUSD: string;
  topPayingCities: Array<{
    city: string;
    avgSalary: string;
    costOfLivingTier: string;
  }>;
  negotiationScript: string;
}

export interface SkillGapAnalysis {
  topInDemandSkills: Array<{
    skill: string;
    count: number;
    demandPercentage: number;
    candidateHasSkill: boolean;
    learningResourceUrl: string;
    documentationName: string;
  }>;
  missingCriticalSkills: string[];
  marketTrendingHeatmap: Array<{
    technology: string;
    category: 'Frontend' | 'Backend' | 'Cloud & DevOps' | 'AI & Data' | 'Tools';
    growthMoM: string;
    status: 'Surging' | 'Stable' | 'Essential';
  }>;
}

export interface ApplicationFunnelAnalytics {
  totalDiscovered: number;
  totalBookmarked: number;
  totalWillApply: number;
  totalApplied: number;
  totalInterviewing: number;
  totalOffers: number;
  conversionRateAppliedToInterview: number;
  weeklyActivity: Array<{
    day: string;
    applied: number;
    bookmarked: number;
  }>;
  weeklySummaryReport: string;
}

export interface FreelanceGigEarning {
  id: string;
  gigId?: string;
  clientName: string;
  projectTitle: string;
  amountINR: number;
  amountUSD: number;
  status: 'paid' | 'pending' | 'draft';
  completedDate: string;
  clientRating?: number;
  clientNotes?: string;
}

export interface GigInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  items: Array<{
    description: string;
    hours: number;
    ratePerHour: number;
    amount: number;
  }>;
  totalAmount: number;
  currency: 'INR' | 'USD';
  dueDate: string;
  createdAt: string;
  notes: string;
}

export interface CustomJobAlert {
  id: string;
  titleQuery: string;
  minSalaryINR: number;
  workplaceType: 'remote' | 'hybrid' | 'onsite' | 'all';
  createdDate: string;
  active: boolean;
}

export type GigCategory = 
  | 'video-editing' 
  | 'tutoring' 
  | 'content-writing' 
  | 'design' 
  | 'web-dev' 
  | 'automation' 
  | 'virtual-assistant' 
  | 'qa-testing';

export interface Gig {
  id: string;
  title: string;
  clientOrPlatform: string;
  category: GigCategory;
  payout: string;
  estimatedHours: string;
  difficulty: 'Easy' | 'Medium' | 'Quick Task';
  directApplyUrl: string;
  description: string;
  matchedSkills: string[];
  postedAt: string;
  requiresCoding: boolean;
  isProfileMatched?: boolean;
  generatedProposal?: string;
}

export interface ResumeProfile {
  id: string;
  profileName: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
  isCompleted?: boolean;
  name: string;
  email: string;
  phone: string;
  location: string;
  targetRoles: string[];
  coreSkills: string[];
  extracurriculars: string[];
  interests: string[];
  minHourlyRate: number;
  monthlyEarningGoal?: number;
  currentMonthlyEarnings?: number;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeSummary: string;
  resumeFileName?: string;
  resumeText: string;
  dailyQuota?: number;
  experienceLevel: 'Entry / Fresher' | 'Junior (1-2 yrs)' | 'Mid-level (3-5 yrs)' | 'Senior';
  preferredWorkplace: WorkplaceType | 'all';
  preferredLocation: string;
  collegeName?: string;
}

export type ApplicationStatus = 'discovered' | 'bookmarked' | 'will-apply' | 'applied' | 'cold-emailed' | 'interviewing' | 'rejected' | 'offer';

export interface TrackedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  directApplyUrl: string;
  status: ApplicationStatus;
  appliedDate: string;
  type: 'full-time' | 'wfh-gig';
  salary?: string;
  notes: string;
  coldEmailSent?: boolean;
  followUpDue?: string;
  followUpCount?: number;
  resumeVersionUsed?: string;
}

export interface AutomationSettings {
  enabled: boolean;
  cadence: 'daily' | 'hourly';
  time: string;
  notifyEmail?: string;
  autoDraftColdEmails: boolean;
  lastRun?: string;
  nextRun?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  telegramEnabled?: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  collegeName: string;
  phone?: string;
  telegramChatId?: string;
  telegramUsername?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthResponse {
  user: UserAccount;
  token: string;
}

export type UserProfile = ResumeProfile;
