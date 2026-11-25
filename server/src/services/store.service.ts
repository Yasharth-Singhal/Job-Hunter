import fs from 'fs';
import path from 'path';
import { 
  ResumeProfile, 
  TrackedApplication, 
  AutomationSettings, 
  Job, 
  Gig, 
  ResumeVersion, 
  FreelanceGigEarning, 
  GigInvoice, 
  CustomJobAlert, 
  CoverLetter,
  UserAccount 
} from '../types.js';

interface StorageData {
  profiles: ResumeProfile[];
  activeProfileId: string;
  applications: TrackedApplication[];
  notInterestedJobIds: string[];
  savedJobs: Job[];
  cachedJobs: Job[];
  cachedGigs: Gig[];
  automation: AutomationSettings;
  resumeVersions?: ResumeVersion[];
  earnings?: FreelanceGigEarning[];
  invoices?: GigInvoice[];
  customAlerts?: CustomJobAlert[];
  jobNotes?: Record<string, string>;
  coverLetters?: CoverLetter[];
  users?: UserAccount[];
}

const ROOT_DIR = process.cwd().endsWith('server') ? path.resolve(process.cwd(), '..') : process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const RESUMES_DIR = path.join(DATA_DIR, 'resumes');
const DATA_FILE = path.join(DATA_DIR, 'storage.json');

const DEFAULT_PROFILE: ResumeProfile = {
  id: 'profile_default',
  profileName: 'Yasharth Singhal - Full Stack Engineer',
  fileName: 'Yasharth_Singhal_Resume.pdf',
  filePath: '',
  uploadedAt: new Date().toISOString(),
  name: 'Yasharth Singhal',
  email: 'yashsinghal6244@gmail.com',
  phone: '9720277774',
  location: 'Noida / Delhi-NCR, India',
  targetRoles: [
    'Full Stack Engineer',
    'Full Stack Developer',
    'Frontend Developer (React / Next.js)',
    'Backend Engineer (Node.js / Express)',
    'Software Engineer'
  ],
  coreSkills: [
    'React.js',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'Python',
    'SQL',
    'Tailwind CSS',
    'Docker',
    'AWS (IAM, S3, EC2)',
    'Socket.IO',
    'WebRTC',
    'Firebase',
    'REST APIs',
    'GraphQL',
    'FastAPI',
    'Git',
    'Vercel',
    'Render',
    'Shopify Hydrogen'
  ],
  extracurriculars: [
    'Video Editing & Reels Creation',
    'Online Tutoring / Teaching',
    'Content Writing & Documentation',
    'Graphic Design & Thumbnails',
    'Website Speed Tuning & Bug Fixing'
  ],
  interests: [
    'Real-time Systems (WebSockets, WebRTC)',
    'Cloud Architecture (AWS, Docker, Vercel)',
    'Headless Commerce (Shopify, GraphQL)',
    'Full Stack Product Engineering'
  ],
  minHourlyRate: 25,
  githubUrl: 'https://github.com/Yasharth-Singhal',
  linkedinUrl: 'https://linkedin.com/in/yasharth-singhal',
  portfolioUrl: 'https://yasharth.dev',
  resumeSummary: 'Full-Stack Software Engineer specializing in React.js, Next.js, Node.js, Express.js, TypeScript, MongoDB, and PostgreSQL. Experienced in building and deploying production web applications, REST APIs, real-time communication systems, and AI-powered workflows. Hands-on experience with authentication, WebSockets, WebRTC, payment integrations, cloud deployment, and scalable backend architecture.',
  resumeText: `YASHARTH SINGHAL
Full Stack Engineer
9720277774 | yashsinghal6244@gmail.com | linkedin.com/in/yasharth-singhal

SUMMARY
Full-Stack Software Engineer specializing in React.js, Next.js, Node.js, Express.js, TypeScript, MongoDB, and PostgreSQL. Experienced in building and deploying production web applications, REST APIs, real-time communication systems, and AI-powered workflows. Hands-on experience with authentication, WebSockets, WebRTC, payment integrations, cloud deployment, and scalable backend architecture.

SKILLS
• Languages: JavaScript, TypeScript, Python, SQL
• Web Technologies: React.js, Next.js, HTML5, CSS3, Tailwind CSS, Bootstrap, Node.js, Express.js, FastAPI, REST APIs, Socket.IO, WebRTC, Firebase
• Databases: MongoDB, PostgreSQL, MySQL
• Tools & Cloud: Docker, Git, GitHub, AWS (IAM, S3, EC2), Vercel, Render, Shopify, Antigravity, GitHub Copilot, Codex

EXPERIENCE
Full Stack Developer | Startappss System India Pvt. Ltd, Noida | Jan 2026 – Present
• Developed and maintained MERN stack applications across frontend, backend, database, and API layers.
• Built responsive React.js interfaces and reusable components integrated with RESTful APIs.
• Developed backend APIs and business logic with MongoDB, CRUD operations, and data modeling.
• Debugged full-stack issues and improved application reliability, performance, and maintainability using Git/GitHub workflows.

Data Analyst Intern | Wakencode Technologies | Sept 2023 – Oct 2023
• Assisted with Salesforce CRM configuration, data handling, and basic CRM workflows.
• Supported data management and configuration tasks within Salesforce-based business processes.

PROJECTS
Headless E-Commerce Platform
Shopify Hydrogen | React | TypeScript | GraphQL | Node.js | Shopify Oxygen | Vercel
• Built a headless e-commerce storefront with 34 routes, 27 reusable components, and 15+ GraphQL operations, covering product catalog, search, cart, checkout, and customer account workflows.
• Developed a custom headless checkout flow supporting Cash on Delivery and CC Avenue prepaid payments, including order creation and payment workflows.
• Implemented passwordless OTP authentication, customer account management, real-time inventory validation, and transactional email workflows.
• Implemented server-side rendering and edge rendering and deployed the storefront using Shopify Oxygen and Vercel, with TypeScript across the application.

TeamSync | Project Management & Team Collaboration Platform
Next.js | React | TypeScript | Node.js | Express.js | MongoDB | Socket.IO | WebRTC | Firebase
• Built a full-stack project management platform with 50+ REST APIs and 14 MongoDB models, supporting Kanban issue tracking, sprint management, analytics, and multi-workspace RBAC.
• Implemented real-time WebSocket communication and WebRTC peer-to-peer audio/video calling, with Firebase authentication, JWT-based sessions, and Zod request validation.
• Developed responsive dashboards and collaboration workflows for team, project, issue, and communication management.

Car Service Management Admin Panel
Full Stack | React.js | Node.js | REST API | Database | Vercel
• Built and deployed a full-stack service management dashboard on Vercel, covering job cards, bookings, quotations, appointments, customers, vehicles, services, payments, revenue, expenses, overdue jobs, and reminders with responsive admin workflows.

ConnectX | Real-Time Communication Platform
MERN Stack | React.js | Node.js | Express.js | MongoDB | Socket.io | Firebase | WebRTC
• Built a real-time communication platform with MERN, Socket.IO, Firebase, and React.js, supporting one-to-one/group messaging, reusable UI components, user management, and real-time message synchronization.
• Implemented Firebase Authentication, JWT-based sessions, and WebRTC peer-to-peer audio/video calling, enabling secure authentication and real-time communication workflows.

EDUCATION
• Master of Computer Applications (MCA) — ABES Engineering College, Ghaziabad | 2026
• Bachelor of Computer Applications (BCA) — RVHET Institute, GB Nagar | 2024

CERTIFICATIONS
• AWS Cloud Practitioner — Udemy
• Salesforce CRM — Wakencode Technologies`,
  experienceLevel: 'Junior (1-2 yrs)',
  preferredWorkplace: 'all',
  preferredLocation: 'Nearby / Delhi-NCR',
  collegeName: 'ABES Engineering College (ABESEC), Ghaziabad'
};

const DEFAULT_AUTOMATION: AutomationSettings = {
  enabled: true,
  cadence: 'daily',
  time: '09:00',
  autoDraftColdEmails: true,
  lastRun: undefined,
  nextRun: 'Tomorrow at 09:00 AM',
  telegramBotToken: '9233664453:AAGU7w4GUhsXyLM1weCEl1N8qK39iEeFNSs',
  telegramChatId: '6817458694',
  telegramEnabled: true
};

export class StoreService {
  private static data: StorageData | null = null;

  public static ensureDirectories(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(RESUMES_DIR)) {
      fs.mkdirSync(RESUMES_DIR, { recursive: true });
    }
  }

  private static ensureDataFile(): void {
    this.ensureDirectories();
    if (!fs.existsSync(DATA_FILE)) {
      const initial: StorageData = {
        profiles: [DEFAULT_PROFILE],
        activeProfileId: DEFAULT_PROFILE.id,
        applications: [],
        notInterestedJobIds: [],
        savedJobs: [],
        cachedJobs: [],
        cachedGigs: [],
        automation: DEFAULT_AUTOMATION
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      this.data = initial;
    }
  }

  private static readData(): StorageData {
    this.ensureDataFile();
    if (!this.data) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);

        // Migrate legacy single profile structure to profiles array if needed
        if (parsed.profile && (!parsed.profiles || parsed.profiles.length === 0)) {
          const migrated: ResumeProfile = {
            id: 'profile_' + Date.now(),
            profileName: parsed.profile.name ? `${parsed.profile.name} - Resume` : 'My Resume Profile',
            fileName: parsed.profile.resumeFileName || 'Resume.pdf',
            filePath: parsed.profile.resumeFilePath || '',
            uploadedAt: new Date().toISOString(),
            name: parsed.profile.name || DEFAULT_PROFILE.name,
            email: parsed.profile.email || DEFAULT_PROFILE.email,
            phone: parsed.profile.phone || DEFAULT_PROFILE.phone,
            location: parsed.profile.location || DEFAULT_PROFILE.location,
            targetRoles: parsed.profile.targetRoles || DEFAULT_PROFILE.targetRoles,
            coreSkills: parsed.profile.coreSkills || DEFAULT_PROFILE.coreSkills,
            extracurriculars: parsed.profile.extracurriculars || DEFAULT_PROFILE.extracurriculars,
            interests: parsed.profile.interests || DEFAULT_PROFILE.interests,
            minHourlyRate: parsed.profile.minHourlyRate || 20,
            githubUrl: parsed.profile.githubUrl || '',
            linkedinUrl: parsed.profile.linkedinUrl || '',
            portfolioUrl: parsed.profile.portfolioUrl || '',
            resumeSummary: parsed.profile.resumeSummary || '',
            resumeText: parsed.profile.resumeText || '',
            experienceLevel: parsed.profile.experienceLevel || 'Entry / Fresher',
            preferredWorkplace: parsed.profile.preferredWorkplace || 'all',
            preferredLocation: parsed.profile.preferredLocation || 'Nearby / Delhi-NCR'
          };
          parsed.profiles = [migrated];
          parsed.activeProfileId = migrated.id;
        }

        if (!parsed.profiles || parsed.profiles.length === 0) {
          parsed.profiles = [DEFAULT_PROFILE];
          parsed.activeProfileId = DEFAULT_PROFILE.id;
        }

        if (!parsed.activeProfileId && parsed.profiles.length > 0) {
          parsed.activeProfileId = parsed.profiles[0].id;
        }

        // Migrate dismissedJobIds to notInterestedJobIds
        if (parsed.dismissedJobIds && !parsed.notInterestedJobIds) {
          parsed.notInterestedJobIds = parsed.dismissedJobIds;
        }
        if (!parsed.notInterestedJobIds) {
          parsed.notInterestedJobIds = [];
        }

        this.data = parsed;
      } catch (err) {
        console.error('Failed to read storage.json, initializing defaults:', err);
        this.data = {
          profiles: [DEFAULT_PROFILE],
          activeProfileId: DEFAULT_PROFILE.id,
          applications: [],
          notInterestedJobIds: [],
          savedJobs: [],
          cachedJobs: [],
          cachedGigs: [],
          automation: DEFAULT_AUTOMATION
        };
      }
    }
    return this.data!;
  }

  private static saveData(): void {
    if (!this.data) return;
    try {
      this.ensureDataFile();
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write storage.json:', err);
    }
  }

  public static getProfiles(): ResumeProfile[] {
    return this.readData().profiles || [];
  }

  public static getActiveProfile(): ResumeProfile {
    const data = this.readData();
    const active = data.profiles.find(p => p.id === data.activeProfileId);
    return active || data.profiles[0] || DEFAULT_PROFILE;
  }

  public static getProfile(): ResumeProfile {
    return this.getActiveProfile();
  }

  public static setActiveProfile(profileId: string): ResumeProfile | null {
    const data = this.readData();
    const target = data.profiles.find(p => p.id === profileId);
    if (target) {
      data.activeProfileId = target.id;
      this.saveData();
      return target;
    }
    return null;
  }

  public static createProfile(profileData: Omit<ResumeProfile, 'id' | 'uploadedAt'>): ResumeProfile {
    const data = this.readData();
    const newProfile: ResumeProfile = {
      ...profileData,
      id: 'profile_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      uploadedAt: new Date().toISOString()
    };
    data.profiles.unshift(newProfile);
    data.activeProfileId = newProfile.id;
    this.saveData();
    return newProfile;
  }

  public static updateActiveProfile(updates: Partial<ResumeProfile>): ResumeProfile {
    const data = this.readData();
    const index = data.profiles.findIndex(p => p.id === data.activeProfileId);
    if (index !== -1) {
      data.profiles[index] = { ...data.profiles[index], ...updates };
      this.saveData();
      return data.profiles[index];
    } else {
      const active = this.getActiveProfile();
      const updated = { ...active, ...updates };
      data.profiles.push(updated);
      data.activeProfileId = updated.id;
      this.saveData();
      return updated;
    }
  }

  public static deleteProfile(profileId: string): boolean {
    const data = this.readData();
    if (data.profiles.length <= 1) return false; // Prevent deleting the last profile
    data.profiles = data.profiles.filter(p => p.id !== profileId);
    if (data.activeProfileId === profileId) {
      data.activeProfileId = data.profiles[0].id;
    }
    this.saveData();
    return true;
  }

  public static saveResumeFile(fileName: string, content: string | Buffer): string {
    this.ensureDirectories();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetPath = path.join(RESUMES_DIR, `${Date.now()}_${safeName}`);
    fs.writeFileSync(targetPath, content);
    return targetPath;
  }

  public static getApplications(): TrackedApplication[] {
    return this.readData().applications || [];
  }

  public static addApplication(app: Omit<TrackedApplication, 'id'>): TrackedApplication {
    const data = this.readData();
    // Check if already in applications
    const existingIndex = data.applications.findIndex(a => a.jobId === app.jobId);
    if (existingIndex !== -1) {
      data.applications[existingIndex] = { ...data.applications[existingIndex], ...app };
      this.saveData();
      return data.applications[existingIndex];
    }

    const newApp: TrackedApplication = {
      ...app,
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
    };
    data.applications.unshift(newApp);
    this.saveData();
    return newApp;
  }

  public static updateApplication(id: string, updates: Partial<TrackedApplication>): TrackedApplication | null {
    const data = this.readData();
    const index = data.applications.findIndex(a => a.id === id);
    if (index === -1) return null;
    data.applications[index] = { ...data.applications[index], ...updates };
    this.saveData();
    return data.applications[index];
  }

  public static deleteApplication(id: string): boolean {
    const data = this.readData();
    const initialLen = data.applications.length;
    data.applications = data.applications.filter(a => a.id !== id);
    this.saveData();
    return data.applications.length < initialLen;
  }

  // Not Interested (Never Show Again)
  public static getNotInterestedJobIds(): Set<string> {
    return new Set(this.readData().notInterestedJobIds || []);
  }

  public static markNotInterested(jobId: string): void {
    const data = this.readData();
    if (!data.notInterestedJobIds.includes(jobId)) {
      data.notInterestedJobIds.push(jobId);
      // Remove from cachedJobs too
      data.cachedJobs = data.cachedJobs.filter(j => j.id !== jobId);
      this.saveData();
    }
  }

  public static getCachedJobs(): Job[] {
    return this.readData().cachedJobs || [];
  }

  public static setCachedJobs(jobs: Job[]): void {
    const data = this.readData();
    data.cachedJobs = jobs;
    this.saveData();
  }

  public static getCachedGigs(): Gig[] {
    return this.readData().cachedGigs || [];
  }

  public static setCachedGigs(gigs: Gig[]): void {
    const data = this.readData();
    data.cachedGigs = gigs;
    this.saveData();
  }

  public static getAutomation(): AutomationSettings {
    return this.readData().automation;
  }

  public static updateAutomation(settings: Partial<AutomationSettings>): AutomationSettings {
    const data = this.readData();
    data.automation = { ...data.automation, ...settings };
    this.saveData();
    return data.automation;
  }

  // --- Resume Versions ---
  public static getResumeVersions(profileId?: string): ResumeVersion[] {
    const data = this.readData();
    const versions = data.resumeVersions || [];
    if (profileId) {
      return versions.filter(v => v.profileId === profileId);
    }
    return versions;
  }

  public static addResumeVersion(version: ResumeVersion): ResumeVersion {
    const data = this.readData();
    if (!data.resumeVersions) data.resumeVersions = [];
    data.resumeVersions.unshift(version);
    this.saveData();
    return version;
  }

  public static deleteResumeVersion(id: string): boolean {
    const data = this.readData();
    if (!data.resumeVersions) return false;
    const initial = data.resumeVersions.length;
    data.resumeVersions = data.resumeVersions.filter(v => v.id !== id);
    this.saveData();
    return data.resumeVersions.length < initial;
  }

  // --- Freelance Gig Earnings ---
  public static getEarnings(): FreelanceGigEarning[] {
    return this.readData().earnings || [];
  }

  public static addEarning(earning: FreelanceGigEarning): FreelanceGigEarning {
    const data = this.readData();
    if (!data.earnings) data.earnings = [];
    data.earnings.unshift(earning);
    this.saveData();
    return earning;
  }

  // --- Invoices ---
  public static getInvoices(): GigInvoice[] {
    return this.readData().invoices || [];
  }

  public static addInvoice(invoice: GigInvoice): GigInvoice {
    const data = this.readData();
    if (!data.invoices) data.invoices = [];
    data.invoices.unshift(invoice);
    this.saveData();
    return invoice;
  }

  // --- Private Job Notes ---
  public static getJobNotes(): Record<string, string> {
    return this.readData().jobNotes || {};
  }

  public static saveJobNote(jobId: string, note: string): void {
    const data = this.readData();
    if (!data.jobNotes) data.jobNotes = {};
    data.jobNotes[jobId] = note;
    this.saveData();
  }

  // --- Cover Letters ---
  public static getCoverLetters(): CoverLetter[] {
    return this.readData().coverLetters || [];
  }

  public static saveCoverLetter(letter: CoverLetter): CoverLetter {
    const data = this.readData();
    if (!data.coverLetters) data.coverLetters = [];
    data.coverLetters.unshift(letter);
    this.saveData();
    return letter;
  }

  // --- Custom Job Alerts ---
  public static getCustomAlerts(): CustomJobAlert[] {
    return this.readData().customAlerts || [];
  }

  public static addCustomAlert(alert: CustomJobAlert): CustomJobAlert {
    const data = this.readData();
    if (!data.customAlerts) data.customAlerts = [];
    data.customAlerts.unshift(alert);
    this.saveData();
    return alert;
  }

  public static deleteCustomAlert(id: string): boolean {
    const data = this.readData();
    if (!data.customAlerts) return false;
    const initial = data.customAlerts.length;
    data.customAlerts = data.customAlerts.filter(a => a.id !== id);
    this.saveData();
    return data.customAlerts.length < initial;
  }

  // --- User Accounts ---
  public static getUsers(): UserAccount[] {
    const data = this.readData();
    if (!data.users) data.users = [];
    return data.users;
  }

  public static getUserByEmail(email: string): UserAccount | undefined {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public static getUserById(id: string): UserAccount | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  public static getUserByTelegramChatId(chatId: string): UserAccount | undefined {
    return this.getUsers().find(u => u.telegramChatId === String(chatId));
  }

  public static saveUser(user: UserAccount): UserAccount {
    const data = this.readData();
    if (!data.users) data.users = [];
    const index = data.users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...user };
    } else {
      data.users.push(user);
    }
    this.saveData();
    return user;
  }

  public static updateUser(id: string, updates: Partial<UserAccount>): UserAccount | null {
    const data = this.readData();
    if (!data.users) data.users = [];
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    data.users[index] = { ...data.users[index], ...updates };
    this.saveData();
    return data.users[index];
  }
}
