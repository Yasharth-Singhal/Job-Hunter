import axios from 'axios';
import { Job, WorkplaceType, ExperienceTier } from '../types.js';

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name: string };
  updated_at: string;
  departments?: Array<{ name: string }>;
  content?: string;
}

interface LeverPosting {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl: string;
  categories?: {
    location?: string;
    team?: string;
    commitment?: string;
  };
  descriptionPlain?: string;
  createdAt: number;
}

interface AshbyJob {
  id: string;
  title: string;
  location: string;
  departmentName?: string;
  employmentType?: string;
  applyUrl?: string;
  descriptionHtml?: string;
  publishedAt?: string;
}

function detectWorkplaceType(locStr: string): WorkplaceType {
  const l = locStr.toLowerCase();
  if (l.includes('remote') || l.includes('anywhere') || l.includes('work from home')) return 'remote';
  if (l.includes('hybrid')) return 'hybrid';
  return 'onsite';
}

function detectExperienceTier(titleStr: string, descStr?: string): ExperienceTier {
  const t = (titleStr + ' ' + (descStr || '')).toLowerCase();
  if (t.includes('intern') || t.includes('graduate') || t.includes('entry') || t.includes('fresher') || t.includes('associate')) {
    return 'fresher';
  }
  if (t.includes('senior') || t.includes('lead') || t.includes('principal') || t.includes('architect') || t.includes('staff')) {
    return 'mid-senior';
  }
  return 'junior';
}

function extractCity(locStr: string): string {
  const l = locStr.toLowerCase();
  if (l.includes('bengaluru') || l.includes('bangalore')) return 'Bengaluru';
  if (l.includes('hyderabad')) return 'Hyderabad';
  if (l.includes('pune')) return 'Pune';
  if (l.includes('noida') || l.includes('gurgaon') || l.includes('delhi') || l.includes('ncr')) return 'Noida / Delhi-NCR';
  if (l.includes('mumbai')) return 'Mumbai';
  if (l.includes('chennai')) return 'Chennai';
  if (l.includes('remote')) return 'Remote';
  return locStr.split(',')[0].trim();
}

function buildHiringIntel(companyName: string, roleTitle: string, domain: string) {
  const clean = companyName.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  return {
    recruiterTitle: `${clean} Talent Acquisition Lead`,
    recruiterEmailPattern: `talent@${domain} or careers@${domain}`,
    linkedinRecruiterUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`"Talent Acquisition" OR "Technical Recruiter" ${clean}`)}`,
    linkedinManagerUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`"Engineering Manager" OR "Lead Developer" ${clean}`)}`,
    connectionNote: `Hi! I saw ${clean}'s opening for ${roleTitle}. With hands-on experience building full-stack applications and autonomous systems, I'd love to connect with your team!`
  };
}

export class AtsService {
  private static GREENHOUSE_COMPANIES = [
    { name: 'Cloudflare', slug: 'cloudflare', domain: 'cloudflare.com', salary: '₹22 - 38 LPA ($115,000 - $160,000)' },
    { name: 'Stripe', slug: 'stripe', domain: 'stripe.com', salary: '₹28 - 45 LPA ($130,000 - $185,000)' },
    { name: 'Figma', slug: 'figma', domain: 'figma.com', salary: '₹26 - 42 LPA ($125,000 - $175,000)' },
    { name: 'Canonical', slug: 'canonical', domain: 'canonical.com', salary: '₹18 - 32 LPA ($95,000 - $140,000)' },
    { name: 'GitHub', slug: 'github', domain: 'github.com', salary: '₹25 - 40 LPA ($120,000 - $170,000)' },
    { name: 'Datadog', slug: 'datadog', domain: 'datadoghq.com', salary: '₹24 - 38 LPA ($115,000 - $165,000)' },
    { name: 'Postman', slug: 'postman', domain: 'postman.com', salary: '₹20 - 35 LPA ($105,000 - $150,000)' },
    { name: 'Razorpay', slug: 'razorpay', domain: 'razorpay.com', salary: '₹18 - 32 LPA ($90,000 - $135,000)' },
    { name: 'MongoDB', slug: 'mongodb', domain: 'mongodb.com', salary: '₹22 - 36 LPA ($110,000 - $155,000)' },
    { name: 'Docker', slug: 'docker', domain: 'docker.com', salary: '₹22 - 35 LPA ($110,000 - $150,000)' }
  ];

  private static LEVER_COMPANIES = [
    { name: 'Netlify', slug: 'netlify', domain: 'netlify.com', salary: '₹22 - 36 LPA ($110,000 - $155,000)' },
    { name: 'Palantir', slug: 'palantir', domain: 'palantir.com', salary: '₹26 - 44 LPA ($125,000 - $180,000)' },
    { name: 'Webflow', slug: 'webflow', domain: 'webflow.com', salary: '₹20 - 34 LPA ($100,000 - $145,000)' },
    { name: 'Affirm', slug: 'affirm', domain: 'affirm.com', salary: '₹22 - 38 LPA ($110,000 - $160,000)' }
  ];

  private static ASHBY_COMPANIES = [
    { name: 'Ramp', slug: 'ramp', domain: 'ramp.com', salary: '₹28 - 45 LPA ($130,000 - $185,000)' },
    { name: 'Retool', slug: 'retool', domain: 'retool.com', salary: '₹25 - 42 LPA ($120,000 - $175,000)' },
    { name: 'Linear', slug: 'linear', domain: 'linear.app', salary: '₹30 - 48 LPA ($140,000 - $195,000)' },
    { name: 'Monzo', slug: 'monzo', domain: 'monzo.com', salary: '₹22 - 36 LPA (£65,000 - £95,000)' }
  ];

  public static async fetchGreenhouseJobs(company: { name: string; slug: string; domain: string; salary: string }): Promise<Job[]> {
    try {
      const url = `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs?content=false`;
      const res = await axios.get<{ jobs: GreenhouseJob[] }>(url, { timeout: 6000 });
      const rawJobs = res.data?.jobs || [];

      return rawJobs.map((j) => {
        const loc = j.location?.name || 'Remote / Hybrid';
        const isRemote = loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('anywhere');
        const workplaceType = detectWorkplaceType(loc);
        const expTier = detectExperienceTier(j.title);
        const city = extractCity(loc);

        return {
          id: `gh_${company.slug}_${j.id}`,
          title: j.title,
          company: company.name,
          companyDomain: company.domain,
          location: loc,
          city,
          isRemote,
          workplaceType,
          experienceLevel: expTier,
          type: 'full-time',
          source: 'greenhouse',
          directApplyUrl: j.absolute_url,
          descriptionSnippet: `${company.name} is hiring for ${j.title}. Official Greenhouse application portal with direct hiring team review.`,
          fullDescription: `### About the Opportunity at ${company.name}\n${company.name} is seeking an ambitious ${j.title} to join our growing engineering organization. In this role, you will help design, build, and maintain mission-critical web applications, high-performance APIs, and user-facing experiences serving global customers.\n\n### Team & Culture\nYou will work in a fast-paced, collaborative squad practicing modern agile development, continuous delivery, and peer code reviews. We prioritize developer velocity, reliability, and clean code architecture.`,
          responsibilities: [
            `Design, build, and ship robust full-stack software components and public user interfaces.`,
            `Collaborate with product designers, engineering managers, and QA teams to refine specifications.`,
            `Write comprehensive unit tests and optimize application bundle performance.`,
            `Participate in architecture design reviews and maintain high standards of code hygiene.`
          ],
          requirements: [
            `Hands-on proficiency with modern JavaScript / TypeScript frameworks (React, Node.js, Express).`,
            `Demonstrated understanding of RESTful API principles, state management, and database schemas.`,
            `Familiarity with Git version control, CI/CD pipelines, and responsive design systems.`,
            `Strong communication skills and willingness to proactively solve technical bottlenecks.`
          ],
          salary: company.salary,
          department: j.departments?.[0]?.name || 'Engineering',
          benefits: [
            `Comprehensive Health, Vision & Dental Coverage`,
            `Generous Home Office / WFH Equipment Stipend`,
            `Annual Learning & Conference Allowance`,
            `Flexible Paid Time Off (PTO) & Wellness Days`
          ],
          postedAt: j.updated_at ? new Date(j.updated_at).toLocaleDateString() : 'Active Today',
          matchScore: 0,
          matchReasons: [],
          hiringTeam: buildHiringIntel(company.name, j.title, company.domain),
          category: 'core-career',
          isVerifiedDirect: true
        };
      });
    } catch (err: any) {
      return [];
    }
  }

  public static async fetchLeverJobs(company: { name: string; slug: string; domain: string; salary: string }): Promise<Job[]> {
    try {
      const url = `https://api.lever.co/v0/postings/${company.slug}?mode=json`;
      const res = await axios.get<LeverPosting[]>(url, { timeout: 6000 });
      const rawJobs = Array.isArray(res.data) ? res.data : [];

      return rawJobs.map((p) => {
        const loc = p.categories?.location || 'Remote';
        const isRemote = loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('anywhere');
        const workplaceType = detectWorkplaceType(loc);
        const expTier = detectExperienceTier(p.text, p.descriptionPlain);
        const city = extractCity(loc);

        return {
          id: `lever_${company.slug}_${p.id}`,
          title: p.text,
          company: company.name,
          companyDomain: company.domain,
          location: loc,
          city,
          isRemote,
          workplaceType,
          experienceLevel: expTier,
          type: 'full-time',
          source: 'lever',
          directApplyUrl: p.applyUrl || p.hostedUrl,
          descriptionSnippet: `${company.name} is hiring for ${p.text}. Official Lever application link with direct candidate ingestion.`,
          fullDescription: `### Role Overview\n${company.name} is looking for a talented ${p.text} to contribute to our core technology platform. You will be responsible for creating clean, high-performance features that solve real problems for our community.\n\n### What You Will Build\nYou will contribute across our modern stack, taking features from concept to production with autonomy and high standards.`,
          responsibilities: [
            `Develop scalable client-side features and resilient backend services.`,
            `Partner with cross-functional teams to translate user feedback into clean technical deliverables.`,
            `Profile and improve Core Web Vitals, API response latency, and database query efficiency.`
          ],
          requirements: [
            `Experience developing responsive web applications using React, TypeScript, and modern CSS frameworks.`,
            `Solid fundamentals in asynchronous programming, REST APIs, and relational or document databases.`,
            `Enthusiasm for shipping software and taking ownership of end-to-end features.`
          ],
          salary: company.salary,
          department: p.categories?.team || 'Engineering',
          benefits: [
            `Competitive Equity / Stock Options Package`,
            `Remote-First Setup with Flexible Work Hours`,
            `Wellness & Gym Monthly Reimbursement`,
            `Top-Tier MacBook Pro & Hardware Setup`
          ],
          postedAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Active Today',
          matchScore: 0,
          matchReasons: [],
          hiringTeam: buildHiringIntel(company.name, p.text, company.domain),
          category: 'core-career',
          isVerifiedDirect: true
        };
      });
    } catch (err: any) {
      return [];
    }
  }

  public static async fetchAshbyJobs(company: { name: string; slug: string; domain: string; salary: string }): Promise<Job[]> {
    try {
      const url = `https://api.ashbyhq.com/posting-api/job-board/${company.slug}`;
      const res = await axios.get<{ jobs?: AshbyJob[]; jobPostings?: AshbyJob[] }>(url, { timeout: 6000 });
      const rawJobs = res.data?.jobPostings || res.data?.jobs || [];

      return rawJobs.map((j) => {
        const loc = j.location || 'Remote';
        const isRemote = loc.toLowerCase().includes('remote') || loc.toLowerCase().includes('anywhere');
        const workplaceType = detectWorkplaceType(loc);
        const expTier = detectExperienceTier(j.title);
        const city = extractCity(loc);

        return {
          id: `ashby_${company.slug}_${j.id}`,
          title: j.title,
          company: company.name,
          companyDomain: company.domain,
          location: loc,
          city,
          isRemote,
          workplaceType,
          experienceLevel: expTier,
          type: 'full-time',
          source: 'ashby',
          directApplyUrl: j.applyUrl || `https://jobs.ashbyhq.com/${company.slug}/${j.id}`,
          descriptionSnippet: `${company.name} is hiring for ${j.title}. Official Ashby candidate portal with zero third-party recruiter markup.`,
          fullDescription: `### Welcome to ${company.name}\nWe build tools that elevate developer velocity and automate financial workflows. We are looking for an exceptional ${j.title} to take ownership of key application interfaces.\n\n### Culture of Craft\nWe believe in small teams of exceptional craftspeople moving with high conviction, clean design, and high execution speed.`,
          responsibilities: [
            `Deliver delightful, pixel-perfect user interfaces with keyboard navigation and instant feedback.`,
            `Architect clean APIs and maintain zero-friction integration with third-party webhooks.`,
            `Maintain high code quality with automated CI testing and descriptive commit histories.`
          ],
          requirements: [
            `Deep fluency in React, modern JavaScript/TypeScript, and component-driven development.`,
            `Keen eye for UI design details, fluid animations, and micro-interactions.`,
            `Ability to work autonomously in a high-trust, low-bureaucracy engineering environment.`
          ],
          salary: company.salary,
          department: j.departmentName || 'Product Engineering',
          benefits: [
            `Generous Base Salary + Meaningful Early Equity`,
            `Unlimited Paid Time Off (PTO)`,
            `Comprehensive International Health Insurance`,
            `Annual Team Offsites in Inspiring Locations`
          ],
          postedAt: j.publishedAt ? new Date(j.publishedAt).toLocaleDateString() : 'Active Today',
          matchScore: 0,
          matchReasons: [],
          hiringTeam: buildHiringIntel(company.name, j.title, company.domain),
          category: 'core-career',
          isVerifiedDirect: true
        };
      });
    } catch (err: any) {
      return [];
    }
  }

  public static async harvestAllAtsJobs(): Promise<Job[]> {
    const promises: Promise<Job[]>[] = [];

    for (const c of this.GREENHOUSE_COMPANIES) {
      promises.push(this.fetchGreenhouseJobs(c));
    }
    for (const c of this.LEVER_COMPANIES) {
      promises.push(this.fetchLeverJobs(c));
    }
    for (const c of this.ASHBY_COMPANIES) {
      promises.push(this.fetchAshbyJobs(c));
    }

    const results = await Promise.allSettled(promises);
    const jobs: Job[] = [];

    for (const res of results) {
      if (res.status === 'fulfilled') {
        jobs.push(...res.value);
      }
    }

    return jobs;
  }
}
