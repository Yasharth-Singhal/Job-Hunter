import { Job, ResumeProfile } from '../types.js';

export interface OutreachTouch {
  step: number;
  dayLabel: string;
  channel: 'Email' | 'LinkedIn Connection Note' | 'LinkedIn InMail / Email Follow-up';
  subject?: string;
  content: string;
  strategyNote: string;
}

export interface AlumniReferralIntel {
  collegeName: string;
  companyName: string;
  linkedinSearchUrl: string;
  referralPitchNote: string;
  quickTips: string[];
}

export class OutreachSequenceService {
  public static generate3TouchSequence(job: Job, profile: ResumeProfile): OutreachTouch[] {
    const candidateName = profile.name || 'Candidate';
    const topSkills = (profile.coreSkills || []).slice(0, 3).join(', ');
    const portfolio = profile.portfolioUrl || 'https://yasharth.dev';
    const github = profile.githubUrl || 'https://github.com/Yasharth-Singhal';

    return [
      {
        step: 1,
        dayLabel: 'Day 0 (Initial Direct Pitch)',
        channel: 'Email',
        subject: `Application & Quick Introduction: ${job.title} – ${candidateName}`,
        content: `Hi ${job.company} Hiring Team,

I submitted my direct application for the ${job.title} role today and wanted to connect directly.

I specialize in building reliable, full-stack systems using ${topSkills}. Recently, I developed autonomous pipeline tools focusing on high performance, clean API integration, and automated testing.

Two quick links to review my work:
• Portfolio: ${portfolio}
• GitHub Code: ${github}

Would love to discuss how I can contribute immediately to ${job.company}'s engineering roadmap.

Best regards,
${candidateName}
${profile.phone}`,
        strategyNote: 'Send within 30 minutes of submitting your application on the official ATS portal.'
      },
      {
        step: 2,
        dayLabel: 'Day 4 (Value-Add Insight & Follow-Up)',
        channel: 'LinkedIn InMail / Email Follow-up',
        subject: `Re: ${job.title} – Thought on ${job.company}'s tech stack`,
        content: `Hi ${job.company} Team,

Following up on my note from earlier this week regarding the ${job.title} opening.

While looking into ${job.company}'s recent technical initiatives, I was impressed by your work in scaling user workflows. In my recent full-stack projects, I resolved similar data synchronization and responsive UI performance challenges using optimized state caching and asynchronous queue patterns.

I would welcome 10 minutes to share my perspective and see if my technical background aligns with your current sprint priorities.

Warmly,
${candidateName}`,
        strategyNote: 'Polite reminder with concrete technical insight demonstrating you researched their product.'
      },
      {
        step: 3,
        dayLabel: 'Day 9 (Polite Breakup Message)',
        channel: 'Email',
        subject: `Final note re: ${job.title} – ${candidateName}`,
        content: `Hi ${job.company} Team,

I know you have a packed schedule and candidate priorities may have shifted for the ${job.title} position, so I will not crowd your inbox further.

If this role is already filled or you are moving forward with other profiles, no worries at all! If a relevant engineering role opens up in the future where ${topSkills} and full-stack ownership are needed, please feel free to reach out.

Wishing you and the ${job.company} team continued success!

Best,
${candidateName}`,
        strategyNote: 'Breakup emails generate the highest reply rate (over 35%) by removing pressure while leaving the door wide open.'
      }
    ];
  }

  public static generateAlumniReferralIntel(job: Job, profile: ResumeProfile): AlumniReferralIntel {
    const college = profile.collegeName || 'ABES Engineering College (ABESEC), Ghaziabad';
    const candidateName = profile.name || 'Candidate';
    const query = `site:linkedin.com/in ("ABES" OR "ABESEC" OR "ABES Engineering College") "${job.company}" ("Software" OR "Engineer" OR "Developer")`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    const referralPitchNote = `Hi [Alumni Name],

Hope you are doing well! I saw you graduated from ${college} and are now working at ${job.company}—inspiring to see fellow ABESEC alumni doing great work there!

I am currently applying for the open ${job.title} role at ${job.company}. My background is in ${(profile.coreSkills || ['React', 'Node.js', 'TypeScript']).slice(0, 3).join(', ')} and full-stack product development.

If your team is open to referrals, would you be open to sharing my resume internally, or could I ask for 5 minutes of your advice on the interview process?

Profile / Portfolio: ${profile.portfolioUrl || 'https://yasharth.dev'}

Thank you so much for your time and guidance!

Warm regards,
${candidateName}
${college}`;

    return {
      collegeName: college,
      companyName: job.company,
      linkedinSearchUrl: searchUrl,
      referralPitchNote,
      quickTips: [
        'Employees often get ₹50,000 to ₹1,50,000 INR referral bonuses when an engineer is hired, so they actively want to refer strong candidates!',
        'Check their recent LinkedIn posts and drop a like/comment before messaging to warm up the connection.',
        'Keep the note under 150 words and never ask for a referral aggressively on the first sentence.'
      ]
    };
  }
}
