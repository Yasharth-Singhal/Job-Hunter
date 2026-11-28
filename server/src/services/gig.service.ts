import axios from 'axios';
import { Gig, UserProfile } from '../types.js';

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
}

export class GigService {
  private static DIVERSE_WFH_GIGS: Gig[] = [
    // 💻 TECH, WEB & AI TRAINING (HIGH-PAYING INR / GLOBAL)
    {
      id: 'gig_tech_mern_1',
      title: 'Part-Time MERN / Next.js Freelance Developer (WFH)',
      clientOrPlatform: 'Internshala / Startup Studio India',
      category: 'web-dev',
      payout: '₹18,000 - ₹35,000 / month',
      estimatedHours: '15 - 20 hrs / week',
      difficulty: 'Medium',
      directApplyUrl: 'https://internshala.com/internships/work-from-home-web-development-jobs/',
      description: 'Build responsive React/Next.js frontend dashboards and Node.js REST APIs for fast-moving Indian SaaS startups. 100% remote with flexible evening/weekend hours.',
      matchedSkills: ['React.js', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
      postedAt: 'Active Today',
      requiresCoding: true
    },
    {
      id: 'gig_ai_trainer_1',
      title: 'AI Code & Reasoning Evaluator (JavaScript / Python / React)',
      clientOrPlatform: 'Outlier AI / Scale AI (India Remote)',
      category: 'web-dev',
      payout: '₹1,400 - ₹2,800 / hour',
      estimatedHours: 'Flexible (10 - 25 hrs / week)',
      difficulty: 'Medium',
      directApplyUrl: 'https://outlier.ai/opportunities',
      description: 'Review and rank AI-generated React, TypeScript, and Python code snippets, write clean unit tests, and explain edge cases to train next-gen coding models.',
      matchedSkills: ['JavaScript', 'TypeScript', 'React', 'Python', 'Code Review'],
      postedAt: 'Active Today',
      requiresCoding: true
    },
    {
      id: 'gig_tech_landing_1',
      title: 'SaaS Landing Page & UI Implementation (React + Tailwind)',
      clientOrPlatform: 'Contra / Wellfound Freelance',
      category: 'web-dev',
      payout: '₹12,000 - ₹28,000 / project',
      estimatedHours: '8 - 14 hours',
      difficulty: 'Medium',
      directApplyUrl: 'https://contra.com/independent/opportunities',
      description: 'Convert a clean Figma landing page design into a responsive, fast-loading React + Tailwind CSS site with smooth animations and contact form integration.',
      matchedSkills: ['React', 'Tailwind CSS', 'TypeScript', 'Responsive UI'],
      postedAt: 'Active Today',
      requiresCoding: true
    },
    {
      id: 'gig_tech_1',
      title: 'WordPress / Shopify PageSpeed & Mobile Layout Fixes',
      clientOrPlatform: 'Indian D2C E-commerce Brands',
      category: 'web-dev',
      payout: '₹6,000 - ₹15,000 / store',
      estimatedHours: '3 - 6 hours',
      difficulty: 'Medium',
      directApplyUrl: 'https://www.freelancer.in/jobs/shopify/',
      description: 'Troubleshoot slow mobile load times, compress images, fix broken CSS checkout buttons, and optimize Core Web Vitals scores for D2C stores.',
      matchedSkills: ['CSS / HTML', 'Shopify', 'WordPress', 'Performance Optimization'],
      postedAt: 'Active Today',
      requiresCoding: true
    },
    {
      id: 'gig_tech_2',
      title: 'Web & Mobile App QA Bug Hunter (Exploratory Testing)',
      clientOrPlatform: 'Testlio / uTest (India Remote)',
      category: 'qa-testing',
      payout: '₹850 - ₹1,600 / hour',
      estimatedHours: '5 - 12 hrs / week',
      difficulty: 'Easy',
      directApplyUrl: 'https://testlio.com/freelancers/',
      description: 'Test checkout flows, UPI/payment edge cases, and responsive navigation on desktop and Android browsers. Log clear bug reports with screenshots.',
      matchedSkills: ['QA Testing', 'Bug Hunting', 'Chrome DevTools', 'UI/UX Verification'],
      postedAt: 'Active Today',
      requiresCoding: true
    },
    {
      id: 'gig_tech_unstop_1',
      title: 'Freelance Full-Stack Hackathon Mentor & Code Reviewer',
      clientOrPlatform: 'Unstop / Coding Ninjas India',
      category: 'web-dev',
      payout: '₹1,000 - ₹1,800 / hour',
      estimatedHours: 'Weekend Batches (4 - 8 hrs)',
      difficulty: 'Medium',
      directApplyUrl: 'https://unstop.com/jobs',
      description: 'Guide college teams on MERN stack architecture, Git workflows, deployment on Vercel/Render, and API debugging during weekend hackathons.',
      matchedSkills: ['MERN Stack', 'Git', 'REST APIs', 'Mentoring'],
      postedAt: 'Active Today',
      requiresCoding: true
    },

    // 🎓 ONLINE TEACHING & TUTORING (INR)
    {
      id: 'gig_tutor_chegg',
      title: 'Computer Science & Programming Q&A Expert (WFH)',
      clientOrPlatform: 'Chegg India (Subject Matter Expert)',
      category: 'tutoring',
      payout: '₹15,000 - ₹45,000 / month (Per Question)',
      estimatedHours: 'Flexible (Work anytime)',
      difficulty: 'Easy',
      directApplyUrl: 'https://www.cheggindia.com/qa-experts-sign-up/',
      description: 'Solve Computer Science, DBMS, Data Structures, Java, Python, and Web Development doubts online at your own schedule. Instant bank payout in INR.',
      matchedSkills: ['Computer Science', 'SQL / DBMS', 'Python', 'Data Structures'],
      postedAt: 'Active Today',
      requiresCoding: true
    },
    {
      id: 'gig_tutor_1',
      title: 'Online High School Math & Science Tutor (CBSE / ICSE / JEE Basics)',
      clientOrPlatform: 'Vedantu / Superprof India',
      category: 'tutoring',
      payout: '₹600 - ₹1,200 / hour',
      estimatedHours: '4 - 10 hrs / week',
      difficulty: 'Easy',
      directApplyUrl: 'https://www.vedantu.com/become-a-teacher',
      description: 'Provide 1-on-1 virtual homework help and concept clarity for school students in Mathematics, Algebra, or Physics via Zoom/Google Meet.',
      matchedSkills: ['Teaching / Tutoring', 'Mathematics', 'Communication', 'Patience'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_tutor_2',
      title: 'Conversational English & Interview Fluency Partner',
      clientOrPlatform: 'Cambly / Clapingo India',
      category: 'tutoring',
      payout: '₹500 - ₹950 / hour',
      estimatedHours: 'Flexible (Choose your slots)',
      difficulty: 'Easy',
      directApplyUrl: 'https://www.cambly.com/en/tutors',
      description: 'Hold friendly, informal English conversation sessions with Indian & international students looking to practice interview fluency.',
      matchedSkills: ['English Fluency', 'Active Listening', 'Conversational Coaching'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_tutor_3',
      title: 'Kids & Beginner Coding Tutor (Python / Web / Scratch)',
      clientOrPlatform: 'BrightCHAMPS / Outschool',
      category: 'tutoring',
      payout: '₹750 - ₹1,500 / hour',
      estimatedHours: '4 - 8 hrs / week',
      difficulty: 'Medium',
      directApplyUrl: 'https://outschool.com/teach',
      description: 'Teach beginner-friendly logic, simple game building in Scratch, or HTML/CSS/Python scripting to students aged 10-16 in small interactive batches.',
      matchedSkills: ['Coding Education', 'Python / Scratch', 'HTML/CSS', 'Interactive Teaching'],
      postedAt: 'Active Today',
      requiresCoding: true
    },

    // 🎬 VIDEO EDITING & REELS (INR)
    {
      id: 'gig_video_1',
      title: 'YouTube Tech & Coding Channel Video Editor',
      clientOrPlatform: 'Indian Tech Creators Network (WFH)',
      category: 'video-editing',
      payout: '₹4,000 - ₹10,000 / video',
      estimatedHours: '4 - 7 hours',
      difficulty: 'Medium',
      directApplyUrl: 'https://ytjobs.co',
      description: 'Edit 8-12 minute YouTube tech explainers with clean screen recordings, sound design, engaging zoom-ins, and animated lower thirds.',
      matchedSkills: ['Video Editing', 'Premiere Pro / CapCut', 'Storytelling', 'Sound Design'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_video_2',
      title: 'Instagram Reels & YouTube Shorts Clip Editor',
      clientOrPlatform: 'Personal Brand Studio India',
      category: 'video-editing',
      payout: '₹800 - ₹1,500 / reel (₹15k/wk batch)',
      estimatedHours: '1 - 2 hrs / reel',
      difficulty: 'Easy',
      directApplyUrl: 'https://internshala.com/internships/work-from-home-video-editing-jobs/',
      description: 'Cut long podcasts and webinar recordings into high-energy vertical shorts with dynamic captions (Hormozi style), emojis, and B-roll.',
      matchedSkills: ['Short-Form Video', 'CapCut', 'Subtitles / Captions', 'Motion Graphics'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_video_3',
      title: 'High-CTR YouTube Thumbnail & Cover Designer',
      clientOrPlatform: 'EdTech & Tech YouTubers',
      category: 'video-editing',
      payout: '₹1,000 - ₹2,500 / thumbnail',
      estimatedHours: '1 - 2 hours',
      difficulty: 'Quick Task',
      directApplyUrl: 'https://ytjobs.co/talent',
      description: 'Design eye-catching, high click-through rate (CTR) thumbnails with clean typography, contrasting lighting, and bold text hooks.',
      matchedSkills: ['Photoshop / Canva', 'Thumbnail Design', 'Color Grading', 'Visual Design'],
      postedAt: 'Active Today',
      requiresCoding: false
    },

    // ✍️ CONTENT WRITING & COPYWRITING (INR)
    {
      id: 'gig_writing_1',
      title: 'Technical Blog & Developer Guide Writer (React / Node / AI)',
      clientOrPlatform: 'Hashnode / GeeksforGeeks / SaaS Blogs',
      category: 'content-writing',
      payout: '₹3,000 - ₹8,500 / article',
      estimatedHours: '2 - 4 hours',
      difficulty: 'Easy',
      directApplyUrl: 'https://www.geeksforgeeks.org/write-for-us/',
      description: 'Write practical, step-by-step developer tutorials and architecture overviews on React, TypeScript, Node.js, or AI workflows.',
      matchedSkills: ['Technical Writing', 'Markdown', 'React / Node.js', 'Research'],
      postedAt: 'Active Today',
      requiresCoding: true
    },
    {
      id: 'gig_writing_2',
      title: 'LinkedIn Ghostwriter & SaaS Newsletter Copywriter',
      clientOrPlatform: 'Indian Startup Founders',
      category: 'content-writing',
      payout: '₹15,000 - ₹30,000 / month (Part-Time)',
      estimatedHours: '4 - 6 hrs / week',
      difficulty: 'Easy',
      directApplyUrl: 'https://internshala.com/internships/work-from-home-content-writing-jobs/',
      description: 'Craft engaging LinkedIn carousel scripts, founder thought-leadership posts, and weekly SaaS newsletters.',
      matchedSkills: ['Copywriting', 'LinkedIn Growth', 'Storytelling', 'Editing'],
      postedAt: 'Active Today',
      requiresCoding: false
    },

    // 🎨 DESIGN & CANVA (INR)
    {
      id: 'gig_design_1',
      title: 'Startup Pitch Deck & Investor Presentation Designer',
      clientOrPlatform: 'Early-Stage Founders (India / Global)',
      category: 'design',
      payout: '₹5,000 - ₹14,000 / deck',
      estimatedHours: '4 - 6 hours',
      difficulty: 'Medium',
      directApplyUrl: 'https://www.fiverr.com/categories/graphics-design/presentation-design',
      description: 'Transform rough bullet points into clean, modern, investor-ready slide decks in Figma, Canva, or PowerPoint.',
      matchedSkills: ['Canva / Figma', 'Visual Hierarchy', 'Pitch Decks', 'Layout Design'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_design_2',
      title: 'Social Media Carousel & Brand Kit Designer',
      clientOrPlatform: 'D2C & SaaS Marketing Teams',
      category: 'design',
      payout: '₹1,500 - ₹3,500 / carousel',
      estimatedHours: '1.5 - 3 hours',
      difficulty: 'Quick Task',
      directApplyUrl: 'https://www.behance.net/joblist',
      description: 'Create crisp Instagram/LinkedIn educational carousels using brand fonts and clean minimalist templates in Canva or Figma.',
      matchedSkills: ['Canva', 'Figma', 'Typography', 'Social Media Design'],
      postedAt: 'Active Today',
      requiresCoding: false
    },

    // 📋 VIRTUAL ASSISTANT & OPERATIONS (INR)
    {
      id: 'gig_va_1',
      title: 'Notion Workspace & Operations Assistant (WFH)',
      clientOrPlatform: 'Tech Startup Founders',
      category: 'virtual-assistant',
      payout: '₹16,000 - ₹28,000 / month',
      estimatedHours: '10 - 15 hrs / week',
      difficulty: 'Easy',
      directApplyUrl: 'https://www.upwork.com/nx/search/jobs/?q=notion%20assistant',
      description: 'Organize Notion project boards, automate simple CRM entries, schedule client demos, and prepare clean weekly summary docs.',
      matchedSkills: ['Notion', 'Google Workspace', 'Organization', 'Communication'],
      postedAt: 'Active Today',
      requiresCoding: false
    }
  ];

  public static async fetchAllGigs(profile?: UserProfile): Promise<Gig[]> {
    const gigs: Gig[] = [...this.DIVERSE_WFH_GIGS];
    const seenUrls = new Set<string>(gigs.map(g => g.directApplyUrl));

    // Fetch live real-time gigs/contracts in parallel from public APIs
    const liveFetches = await Promise.allSettled([
      // 1. Remotive live remote software/design/writing gigs
      axios.get<{ jobs: RemotiveJob[] }>('https://remotive.com/api/remote-jobs?limit=25', { timeout: 6000 }),
      // 2. Jobicy live remote jobs
      axios.get<{ jobs: any[] }>('https://jobicy.com/api/v2/remote-jobs?count=15', { timeout: 6000 }),
      // 3. RemoteOK live remote gigs
      axios.get<any[]>('https://remoteok.com/api', {
        headers: { 'User-Agent': 'CareerHunterAI/1.0' },
        timeout: 6000
      })
    ]);

    // Process Remotive Live Jobs
    if (liveFetches[0].status === 'fulfilled') {
      const raw = liveFetches[0].value.data?.jobs || [];
      for (const item of raw.slice(0, 15)) {
        if (seenUrls.has(item.url)) continue;
        seenUrls.add(item.url);

        const catLower = (item.category || '').toLowerCase();
        let mappedCat: Gig['category'] = 'web-dev';
        if (catLower.includes('design')) mappedCat = 'design';
        else if (catLower.includes('writing') || catLower.includes('marketing')) mappedCat = 'content-writing';
        else if (catLower.includes('qa')) mappedCat = 'qa-testing';

        gigs.push({
          id: `remotive_live_${item.id}`,
          title: `${item.title} (${item.job_type === 'contract' ? 'Contract' : 'Remote'})`,
          clientOrPlatform: `${item.company_name} (Live Feed)`,
          category: mappedCat,
          payout: item.salary || '₹1,500 - ₹3,500 / hr (Global Remote)',
          estimatedHours: item.job_type === 'contract' ? 'Flexible / Contract' : 'Full/Part-Time Remote',
          difficulty: 'Medium',
          directApplyUrl: item.url,
          description: (item.description || '').replace(/<[^>]*>/g, '').slice(0, 190).trim() + '...',
          matchedSkills: [item.category || 'Remote', 'Global WFH', item.candidate_required_location || 'Worldwide'],
          postedAt: item.publication_date ? new Date(item.publication_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Live Today',
          requiresCoding: mappedCat === 'web-dev' || mappedCat === 'qa-testing'
        });
      }
    }

    // Process Jobicy Live Jobs
    if (liveFetches[1].status === 'fulfilled') {
      const raw = liveFetches[1].value.data?.jobs || [];
      for (const item of raw.slice(0, 10)) {
        const url = item.url || '';
        if (!url || seenUrls.has(url)) continue;
        seenUrls.add(url);

        const salaryText = (item.annualSalaryMin && item.annualSalaryMax)
          ? `$${Math.round(item.annualSalaryMin / 1000)}k - $${Math.round(item.annualSalaryMax / 1000)}k / yr`
          : 'Competitive Remote Pay';

        gigs.push({
          id: `jobicy_live_${item.id}`,
          title: item.jobTitle,
          clientOrPlatform: `${item.companyName} (Jobicy Live)`,
          category: 'web-dev',
          payout: salaryText,
          estimatedHours: item.jobType?.[0] || 'Remote Flexible',
          difficulty: 'Medium',
          directApplyUrl: url,
          description: (item.jobExcerpt || '').replace(/<[^>]*>/g, '').slice(0, 190).trim() + '...',
          matchedSkills: Array.isArray(item.jobIndustry) ? item.jobIndustry.slice(0, 3) : ['Remote Tech'],
          postedAt: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Live Today',
          requiresCoding: true
        });
      }
    }

    // Process RemoteOK Live Jobs
    if (liveFetches[2].status === 'fulfilled' && Array.isArray(liveFetches[2].value.data)) {
      const raw = liveFetches[2].value.data.slice(1, 12); // index 0 is legal notice
      for (const item of raw) {
        const url = item.url || '';
        if (!url || !item.position || seenUrls.has(url)) continue;
        seenUrls.add(url);

        const salaryText = (item.salary_min && item.salary_max)
          ? `$${Math.round(item.salary_min / 1000)}k - $${Math.round(item.salary_max / 1000)}k / yr`
          : 'Global Remote Rate';

        gigs.push({
          id: `remoteok_live_${item.id}`,
          title: item.position,
          clientOrPlatform: `${item.company || 'RemoteOK'} (Live)`,
          category: 'web-dev',
          payout: salaryText,
          estimatedHours: 'Remote Asynchronous',
          difficulty: 'Medium',
          directApplyUrl: url,
          description: (item.description || '').replace(/<[^>]*>/g, '').slice(0, 190).trim() + '...',
          matchedSkills: Array.isArray(item.tags) ? item.tags.slice(0, 4) : ['Remote', 'Tech'],
          postedAt: item.date ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Live Today',
          requiresCoding: true
        });
      }
    }

    // Flag profile matches if profile is provided
    if (profile && profile.coreSkills) {
      const allCandidateTokens = [
        ...profile.coreSkills,
        ...(profile.extracurriculars || []),
        ...(profile.interests || [])
      ].map(s => s.toLowerCase());

      return gigs.map(g => {
        const gigText = (g.title + ' ' + g.category + ' ' + g.matchedSkills.join(' ')).toLowerCase();
        const isMatched = allCandidateTokens.some((token: string) => {
          const words = token.split(/[\s/()]+/).filter((w: string) => w.length > 2);
          return words.some((w: string) => gigText.includes(w));
        });

        return {
          ...g,
          isProfileMatched: isMatched
        };
      });
    }

    return gigs;
  }
}
