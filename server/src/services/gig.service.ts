import axios from 'axios';
import { Gig, UserProfile } from '../types.js';

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
}

export class GigService {
  private static DIVERSE_WFH_GIGS: Gig[] = [
    // 🎬 VIDEO EDITING & REELS
    {
      id: 'gig_video_1',
      title: 'YouTube Video Editor & Motion Graphics (Tech/Education Channel)',
      clientOrPlatform: 'Creator Media Network (Direct WFH)',
      category: 'video-editing',
      payout: '$250 - $500 / video',
      estimatedHours: '4 - 7 hours',
      difficulty: 'Medium',
      directApplyUrl: 'https://ytjobs.co',
      description: 'Edit 8-12 minute YouTube video essays with clean cuts, sound design, engaging zoom-ins, and animated lower thirds using Premiere Pro, DaVinci, or CapCut.',
      matchedSkills: ['Video Editing', 'Premiere Pro / CapCut', 'Storytelling', 'Sound Design'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_video_2',
      title: 'TikTok, Instagram Reels & YouTube Shorts Clip Editor',
      clientOrPlatform: 'Personal Brand Studio',
      category: 'video-editing',
      payout: '$25 - $45 / reel ($300/week batch)',
      estimatedHours: '1 - 2 hrs / reel',
      difficulty: 'Easy',
      directApplyUrl: 'https://contra.com/independent/opportunities',
      description: 'Cut long podcasts and webinar recordings into high-energy vertical shorts with dynamic captions (Hormozi style), emojis, and B-roll.',
      matchedSkills: ['Short-Form Video', 'CapCut', 'Subtitles / Captions', 'Motion Graphics'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_video_3',
      title: 'High-CTR YouTube Thumbnail & Cover Art Designer',
      clientOrPlatform: 'E-commerce & Gaming Channel',
      category: 'video-editing',
      payout: '$35 - $75 / thumbnail',
      estimatedHours: '1 - 2 hours',
      difficulty: 'Quick Task',
      directApplyUrl: 'https://ytjobs.co/talent',
      description: 'Design eye-catching, high click-through rate (CTR) thumbnails with expressive cutout portraits, contrasting lighting, and bold text hooks.',
      matchedSkills: ['Photoshop / Canva', 'Thumbnail Design', 'Color Grading', 'Visual Design'],
      postedAt: 'Active Today',
      requiresCoding: false
    },

    // 🎓 ONLINE TEACHING & TUTORING
    {
      id: 'gig_tutor_1',
      title: 'Online High School Math & Science Tutor (Algebra / Physics)',
      clientOrPlatform: 'Preply / Superprof Network',
      category: 'tutoring',
      payout: '$25 - $45 / hour',
      estimatedHours: '4 - 10 hrs / week',
      difficulty: 'Easy',
      directApplyUrl: 'https://preply.com/en/teach',
      description: 'Provide 1-on-1 virtual homework help and concept clarity for high school students in Mathematics, Algebra, Calculus, or introductory Physics via Zoom/Google Meet.',
      matchedSkills: ['Teaching / Tutoring', 'Mathematics', 'Communication', 'Patience'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_tutor_2',
      title: 'Conversational English & Fluency Practice Partner',
      clientOrPlatform: 'Cambly / Remote Language Hub',
      category: 'tutoring',
      payout: '$18 - $28 / hour',
      estimatedHours: 'Flexible (Choose your hours)',
      difficulty: 'Easy',
      directApplyUrl: 'https://www.cambly.com/en/tutors',
      description: 'Hold friendly, informal English conversation sessions with international working professionals and students looking to practice conversational fluency.',
      matchedSkills: ['English Fluency', 'Active Listening', 'Conversational Coaching'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_tutor_3',
      title: 'Kids & Beginner Coding Tutor (Scratch / Python / Web Basics)',
      clientOrPlatform: 'Outschool / Coding Academy',
      category: 'tutoring',
      payout: '$30 - $55 / hour',
      estimatedHours: '3 - 6 hrs / week',
      difficulty: 'Medium',
      directApplyUrl: 'https://outschool.com/teach',
      description: 'Teach beginner-friendly logic, simple game building in Scratch, or basic Python scripting to enthusiastic students aged 10-16 in small interactive batches.',
      matchedSkills: ['Coding Education', 'Python / Scratch', 'Interactive Teaching'],
      postedAt: 'Active Today',
      requiresCoding: true
    },

    // ✍️ CONTENT WRITING & COPYWRITING
    {
      id: 'gig_writing_1',
      title: 'Tech & AI Explainer Blog Article Writer',
      clientOrPlatform: 'Developer Publication & SaaS Blog',
      category: 'content-writing',
      payout: '$80 - $180 / article (1,200 words)',
      estimatedHours: '2 - 4 hours',
      difficulty: 'Easy',
      directApplyUrl: 'https://hashnode.com/paid-writing-programs',
      description: 'Draft practical, beginner-friendly how-to guides and architecture overviews on modern web frameworks, AI tools, or productivity workflows.',
      matchedSkills: ['Technical Writing', 'SEO Copywriting', 'Markdown', 'Research'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_writing_2',
      title: 'LinkedIn Ghostwriter & Weekly Newsletter Curator',
      clientOrPlatform: 'Tech Founder & Agency Executive',
      category: 'content-writing',
      payout: '$400 - $750 / month (Part-time retainer)',
      estimatedHours: '3 - 5 hrs / week',
      difficulty: 'Easy',
      directApplyUrl: 'https://contra.com/independent/opportunities',
      description: 'Turn voice memos and rough notes into 3 high-engagement LinkedIn posts and 1 weekly email digest for a tech startup founder.',
      matchedSkills: ['Social Media Copywriting', 'Storytelling', 'Executive Ghostwriting'],
      postedAt: 'Active Today',
      requiresCoding: false
    },

    // 🎨 GRAPHIC DESIGN & BRANDING
    {
      id: 'gig_design_1',
      title: 'Canva Social Media Carousels & Brand Asset Designer',
      clientOrPlatform: 'Digital Marketing Studio',
      category: 'design',
      payout: '$150 - $300 / 10 carousel pack',
      estimatedHours: '3 - 5 hours',
      difficulty: 'Quick Task',
      directApplyUrl: 'https://www.upwork.com/freelance-jobs/canva/',
      description: 'Create modern, clean, branded Instagram and LinkedIn carousel graphics using Canva or Figma based on pre-written copy slides.',
      matchedSkills: ['Canva', 'Figma', 'Typography & Layout', 'Social Media Design'],
      postedAt: 'Active Today',
      requiresCoding: false
    },
    {
      id: 'gig_design_2',
      title: 'Vector Logo Redraw & Minimalist Brand Identity Kit',
      clientOrPlatform: 'Small Business Launchpad',
      category: 'design',
      payout: '$100 - $250 / project',
      estimatedHours: '2 - 4 hours',
      difficulty: 'Easy',
      directApplyUrl: 'https://fiverr.com',
      description: 'Modernize low-resolution client logos into scalable SVG vectors and export brand color palettes with typography guidelines.',
      matchedSkills: ['Illustrator / Figma', 'Vector Graphics', 'Branding Basics'],
      postedAt: 'Active Today',
      requiresCoding: false
    },

    // 📋 VIRTUAL ASSISTANT & RESEARCH
    {
      id: 'gig_va_1',
      title: 'Remote Executive Virtual Assistant & Lead Researcher',
      clientOrPlatform: 'Consulting Practice',
      category: 'virtual-assistant',
      payout: '$18 - $28 / hour',
      estimatedHours: '5 - 10 hrs / week',
      difficulty: 'Easy',
      directApplyUrl: 'https://www.belayglobal.com/jobs/',
      description: 'Assist with calendar scheduling, screening incoming email pitches, organizing spreadsheets, and verifying prospective client contact details.',
      matchedSkills: ['Google Workspace', 'Spreadsheet Cleaning', 'Email Organization', 'Communication'],
      postedAt: 'Active Today',
      requiresCoding: false
    },

    // 💻 TECH & WEB FIXES
    {
      id: 'gig_tech_1',
      title: 'WordPress / Shopify PageSpeed & Layout Mobile Fixes',
      clientOrPlatform: 'E-commerce Store Owners',
      category: 'web-dev',
      payout: '$150 - $350 / site',
      estimatedHours: '3 - 5 hours',
      difficulty: 'Medium',
      directApplyUrl: 'https://freelancer.com/jobs/wordpress/',
      description: 'Troubleshoot slow mobile load times, compress images, fix broken CSS menu buttons, and optimize Core Web Vitals scores.',
      matchedSkills: ['CSS / HTML', 'WordPress / Shopify', 'Performance Optimization'],
      postedAt: 'Active Today',
      requiresCoding: true
    },
    {
      id: 'gig_tech_2',
      title: 'Web Application QA & Edge-Case Bug Hunter',
      clientOrPlatform: 'FinTech Startup Sandbox',
      category: 'qa-testing',
      payout: '$30 / hour (Flexible part-time)',
      estimatedHours: '5 - 10 hrs / week',
      difficulty: 'Easy',
      directApplyUrl: 'https://testlio.com/freelancers/',
      description: 'Test checkout flows, responsive navigation, and authentication flows on desktop and mobile browsers. Log concise bug reports with reproduction steps.',
      matchedSkills: ['QA Testing', 'Bug Hunting', 'Chrome DevTools', 'UI/UX Verification'],
      postedAt: 'Active Today',
      requiresCoding: true
    }
  ];

  public static async fetchAllGigs(profile?: UserProfile): Promise<Gig[]> {
    const gigs: Gig[] = [...this.DIVERSE_WFH_GIGS];

    try {
      // Also fetch live contract / freelance roles from Remotive
      const res = await axios.get<{ jobs: RemotiveJob[] }>('https://remotive.com/api/remote-jobs?category=software-dev&limit=10', { timeout: 5000 });
      const raw = res.data?.jobs || [];

      for (const item of raw) {
        if (item.job_type === 'contract' || item.title.toLowerCase().includes('part-time') || item.title.toLowerCase().includes('contract') || item.title.toLowerCase().includes('freelance')) {
          gigs.push({
            id: `remotive_${item.id}`,
            title: item.title,
            clientOrPlatform: item.company_name,
            category: 'web-dev',
            payout: item.salary || '$25 - $50 / hr (Contract)',
            estimatedHours: 'Flexible / Contract',
            difficulty: 'Medium',
            directApplyUrl: item.url,
            description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'Remote contract opportunity with direct company application.',
            matchedSkills: ['Remote', 'Software Development', 'Web Development'],
            postedAt: item.publication_date ? new Date(item.publication_date).toLocaleDateString() : 'Recently',
            requiresCoding: true
          });
        }
      }
    } catch (err: any) {
      // Quiet fallback to diverse curated catalog
    }

    // Flag profile matches if profile is provided
    if (profile && profile.coreSkills) {
      const allCandidateTokens = [
        ...profile.coreSkills,
        ...profile.extracurriculars,
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
