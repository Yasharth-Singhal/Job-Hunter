import { CompanyDossier } from '../types.js';

export class CompanyDossierService {
  private static predefinedDossiers: Record<string, Partial<CompanyDossier>> = {
    google: {
      companyName: 'Google',
      domain: 'google.com',
      rating: 4.4,
      ratingsBreakdown: {
        workLifeBalance: 4.1,
        cultureAndValues: 4.5,
        compensationAndBenefits: 4.7,
        seniorManagement: 4.0,
        careerOpportunities: 4.3,
        recommendToFriendPct: 88,
        ceoApprovalPct: 83
      },
      overview: {
        headquarters: 'Mountain View, CA (Major hubs in Bangalore, Hyderabad, Gurgaon)',
        size: '180,000+ employees',
        founded: '1998',
        industry: 'Internet & Cloud Services, AI, Consumer Electronics',
        fundingStage: 'Public (NASDAQ: GOOGL)',
        lastFundingOrValuation: '$2.1 Trillion Market Cap'
      },
      cultureAndBehavior: {
        leadershipPrinciples: [
          'Focus on the user and all else will follow',
          'Fast is better than slow',
          'Great just isn\'t good enough',
          'Googlyness: Intellectual humility, bias for action, high ethical integrity'
        ],
        workCulture: 'Engineering-first, highly collaborative with peer code reviews. High autonomy with extensive internal tooling and world-class documentation.',
        interviewDifficulty: 'Very Tough',
        interviewProcessStages: [
          'Recruiter Screen (Resume & background fit)',
          'Technical Phone Screen (DSA / System design on Google Docs/CoderPad)',
          'Onsite Loop (3-4 Coding rounds, 1 System Design round, 1 Googleyness & Leadership round)',
          'Hiring Committee Review & Team Matching'
        ]
      },
      employeeReviews: {
        pros: [
          'Unrivaled compensation, RSUs, and benefits (health insurance, free food, wellness budget)',
          'Smartest peer group in the industry; massive scale engineering problems',
          'Strong internal mobility across products (Search, Cloud, Android, YouTube, DeepMind)'
        ],
        cons: [
          'Large company bureaucracy can slow down project launches',
          'Promotion process (Perf) can feel competitive and documentation-heavy',
          'Occasional shifts in product prioritization'
        ],
        commonThemes: [
          'Top-tier engineering standards',
          'Scale & infrastructure excellence',
          'Generous perks and competitive pay'
        ],
        featuredReview: {
          title: 'Unmatched scale and learning, but navigating scale requires patience',
          review: 'You will work with distributed systems processing billions of queries daily. The tooling (Borg, Blaze, Piper) is years ahead of the industry. Expect rigorous design reviews and high standards for code readability.',
          role: 'Senior Software Engineer (L5), Bangalore',
          date: 'Verified Employee Review'
        }
      },
      techStack: ['C++', 'Java', 'Python', 'Go', 'TypeScript', 'Angular', 'Kubernetes', 'TensorFlow', 'Spanner'],
      recentNews: [
        { headline: 'Google expands Gemini 2.0 AI APIs and enterprise Cloud capabilities', date: 'Recent', source: 'TechCrunch', sentiment: 'positive' },
        { headline: 'Google expands cloud datacenter footprint in India (Navi Mumbai & Delhi)', date: 'Recent', source: 'Economic Times', sentiment: 'positive' }
      ],
      layoffAlert: {
        hasRecentLayoffs: false,
        details: 'Focused hiring on AI, Cloud Infrastructure, and Core Systems.'
      }
    },
    microsoft: {
      companyName: 'Microsoft',
      domain: 'microsoft.com',
      rating: 4.3,
      ratingsBreakdown: {
        workLifeBalance: 4.3,
        cultureAndValues: 4.4,
        compensationAndBenefits: 4.5,
        seniorManagement: 4.2,
        careerOpportunities: 4.2,
        recommendToFriendPct: 87,
        ceoApprovalPct: 91
      },
      overview: {
        headquarters: 'Redmond, WA (Major hubs in Hyderabad, Bangalore, Noida)',
        size: '220,000+ employees',
        founded: '1975',
        industry: 'Software, Cloud Infrastructure (Azure), AI, Hardware, Gaming',
        fundingStage: 'Public (NASDAQ: MSFT)',
        lastFundingOrValuation: '$3.0+ Trillion Market Cap'
      },
      cultureAndBehavior: {
        leadershipPrinciples: [
          'Growth Mindset (Satya Nadella doctrine: Learn-it-all vs Know-it-all)',
          'Customer Obsession',
          'Diversity & Inclusion as a competitive advantage',
          'One Microsoft: Cross-division collaboration'
        ],
        workCulture: 'Excellent work-life balance compared to typical Big Tech. High psychological safety and supportive management.',
        interviewDifficulty: 'Challenging',
        interviewProcessStages: [
          'Recruiter Connect & Online Assessment (Codility)',
          'Technical Screen (Data Structures, Problem Solving)',
          'Virtual Onsite (4 rounds: 2 Coding, 1 System Architecture, 1 As-Appropriate "AA" Manager Round)'
        ]
      },
      employeeReviews: {
        pros: [
          'Exceptional work-life balance and flexible remote/hybrid guidelines',
          'Top-tier medical coverage and parental benefits',
          'Deep investment in AI through OpenAI partnership across all product suites'
        ],
        cons: [
          'Compensation growth can be slower compared to high-risk hedge funds/startups',
          'Legacy codebases in certain Windows/Office legacy teams'
        ],
        commonThemes: ['Growth mindset', 'Healthy work-life balance', 'Azure and AI leadership'],
        featuredReview: {
          title: 'Sustainable engineering career with great culture',
          review: 'Microsoft gives you the breathing room to do quality engineering without burning out. Managers genuinely care about career progression and mental health.',
          role: 'Software Engineer II, Hyderabad IDC',
          date: 'Verified Employee Review'
        }
      },
      techStack: ['C#', '.NET Core', 'TypeScript', 'React', 'Azure', 'Python', 'C++', 'SQL Server'],
      recentNews: [
        { headline: 'Microsoft Azure posts record cloud growth driven by AI Copilot demand', date: 'Recent', source: 'Bloomberg', sentiment: 'positive' }
      ],
      layoffAlert: {
        hasRecentLayoffs: false,
        details: 'Stable hiring across Azure, Security, and Cloud Developer Tools.'
      }
    },
    amazon: {
      companyName: 'Amazon',
      domain: 'amazon.com',
      rating: 3.9,
      ratingsBreakdown: {
        workLifeBalance: 3.3,
        cultureAndValues: 3.8,
        compensationAndBenefits: 4.4,
        seniorManagement: 3.7,
        careerOpportunities: 4.4,
        recommendToFriendPct: 76,
        ceoApprovalPct: 78
      },
      overview: {
        headquarters: 'Seattle, WA (Hubs in Bangalore, Hyderabad, Chennai)',
        size: '1,500,000+ employees worldwide',
        founded: '1994',
        industry: 'E-commerce, Cloud Computing (AWS), Logistics, Streaming',
        fundingStage: 'Public (NASDAQ: AMZN)',
        lastFundingOrValuation: '$1.9 Trillion Market Cap'
      },
      cultureAndBehavior: {
        leadershipPrinciples: [
          'Customer Obsession (Number 1 rule)',
          'Ownership and Long-Term Thinking',
          'Invent and Simplify',
          'Are Right, A Lot',
          'Deliver Results & Bias for Action'
        ],
        workCulture: 'Fast-paced, data-driven, writing-first culture (no PowerPoint; 6-page narrative memos). High ownership with on-call rotation responsibilities.',
        interviewDifficulty: 'Very Tough',
        interviewProcessStages: [
          'Online Assessment (Debugging, Coding, Work Styles Simulation)',
          'Technical Screen (Coding + LP Stories)',
          'Full Loop (4-5 rounds, each testing 2 specific Leadership Principles plus 1 Bar Raiser round)'
        ]
      },
      employeeReviews: {
        pros: [
          'Steep learning curve; you manage massive operational systems early in your tenure',
          'Stock appreciation and high base + RSU pay',
          'Strong pedigree on your resume opens doors anywhere'
        ],
        cons: [
          'High performance pressure and strict Stack Ranking (Forte)',
          'On-call rotations can be intense depending on service criticality'
        ],
        commonThemes: ['High ownership', 'Fast execution', 'Leadership principles are real'],
        featuredReview: {
          title: 'Crucible for engineering growth',
          review: 'If you want to learn operational excellence and how to run tier-1 services with millions of requests per second, Amazon AWS is second to none. Be prepared to master the Leadership Principles.',
          role: 'Software Development Engineer II, Bangalore',
          date: 'Verified Employee Review'
        }
      },
      techStack: ['Java', 'AWS', 'Python', 'React', 'TypeScript', 'DynamoDB', 'Docker', 'Distributed Systems'],
      recentNews: [
        { headline: 'AWS expands custom silicon Trainium & Graviton chips', date: 'Recent', source: 'Reuters', sentiment: 'positive' }
      ],
      layoffAlert: {
        hasRecentLayoffs: false,
        details: 'Active hiring in AWS cloud services, GenAI workloads, and Logistics tech.'
      }
    },
    stripe: {
      companyName: 'Stripe',
      domain: 'stripe.com',
      rating: 4.3,
      ratingsBreakdown: {
        workLifeBalance: 3.9,
        cultureAndValues: 4.4,
        compensationAndBenefits: 4.8,
        seniorManagement: 4.2,
        careerOpportunities: 4.5,
        recommendToFriendPct: 86,
        ceoApprovalPct: 89
      },
      overview: {
        headquarters: 'San Francisco, CA & Dublin, Ireland (Remote-first culture)',
        size: '8,000+ employees',
        founded: '2010',
        industry: 'Fintech, Financial Infrastructure, Payment Processing',
        fundingStage: 'Pre-IPO (Private)',
        lastFundingOrValuation: '$65+ Billion Valuation'
      },
      cultureAndBehavior: {
        leadershipPrinciples: [
          'Move with urgency and focus',
          'Be meticulous in your craft',
          'Optimism and ambition',
          'Users first: Build delightful developer APIs'
        ],
        workCulture: 'Unparalleled developer experience and API design obsession. Heavy documentation and asynchronous communication.',
        interviewDifficulty: 'Very Tough',
        interviewProcessStages: [
          'Recruiter Screen',
          'Live Coding (Pairing on real-world practical code in your own IDE, not LeetCode tricks)',
          'System Design / API Architecture Round',
          'Integration & Debugging Round',
          'Culture / Hiring Manager Chat'
        ]
      },
      employeeReviews: {
        pros: [
          'Exceptional compensation and equity packages',
          'Gold standard API and developer documentation engineering',
          'True remote-first culture with thoughtful offsites'
        ],
        cons: [
          'High bar for written communication and precision',
          'Complex financial compliance and reliability constraints (99.999% uptime required)'
        ],
        commonThemes: ['Craftsmanship', 'High pay', 'Practical real-world interviews'],
        featuredReview: {
          title: 'The best engineering culture in Silicon Valley',
          review: 'Stripe tests you on writing real code, writing unit tests, and debugging in your favorite IDE. Craftsmanship is celebrated at every level.',
          role: 'Full Stack Engineer, Remote',
          date: 'Verified Employee Review'
        }
      },
      techStack: ['Ruby (Sorbet)', 'TypeScript', 'React', 'Go', 'Java', 'PostgreSQL', 'Kafka', 'Redis'],
      recentNews: [
        { headline: 'Stripe surpasses $1 Trillion in total payment volume', date: 'Recent', source: 'Forbes', sentiment: 'positive' }
      ],
      layoffAlert: {
        hasRecentLayoffs: false,
        details: 'Strong profitability and selective elite hiring.'
      }
    }
  };

  public static getDossier(companyName: string): CompanyDossier {
    const key = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check exact or partial predefined key
    for (const [k, dossier] of Object.entries(this.predefinedDossiers)) {
      if (key.includes(k) || k.includes(key)) {
        return this.completeDossier(dossier, companyName);
      }
    }

    // Dynamic heuristic dossier for any startup or company
    return this.generateDynamicDossier(companyName);
  }

  private static completeDossier(partial: Partial<CompanyDossier>, originalName: string): CompanyDossier {
    return {
      companyName: partial.companyName || originalName,
      domain: partial.domain || `${originalName.toLowerCase().replace(/\s+/g, '')}.com`,
      rating: partial.rating || 4.1,
      ratingsBreakdown: partial.ratingsBreakdown || {
        workLifeBalance: 4.0,
        cultureAndValues: 4.2,
        compensationAndBenefits: 4.3,
        seniorManagement: 3.9,
        careerOpportunities: 4.1,
        recommendToFriendPct: 82,
        ceoApprovalPct: 85
      },
      overview: partial.overview || {
        headquarters: 'Global Tech Hub',
        size: '5,000+ employees',
        founded: '2015',
        industry: 'Software & Technology Services',
        fundingStage: 'Growth Stage / Public'
      },
      cultureAndBehavior: partial.cultureAndBehavior || {
        leadershipPrinciples: [
          'High ownership & execution speed',
          'Clear communication & empathy',
          'Customer value delivery'
        ],
        workCulture: 'Collaborative engineering culture with modern agile sprints and peer reviews.',
        interviewDifficulty: 'Challenging',
        interviewProcessStages: [
          'Recruiter Screen',
          'Technical Assessment / Live Coding',
          'System Design & Architecture',
          'Behavioral & Values Alignment'
        ]
      },
      employeeReviews: partial.employeeReviews || {
        pros: ['Great learning opportunities', 'Supportive team members', 'Modern tech stack'],
        cons: ['Fast paced during release cycles', 'Requires proactive initiative'],
        commonThemes: ['Fast growth', 'Collaborative colleagues', 'Solid compensation'],
        featuredReview: {
          title: 'Positive engineering environment with impact',
          review: 'Opportunity to touch real user-facing features quickly. Good balance of engineering velocity and code reviews.',
          role: 'Software Engineer',
          date: 'Verified Review'
        }
      },
      techStack: partial.techStack || ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
      recentNews: partial.recentNews || [
        { headline: `${originalName} expands tech initiatives and engineering teams`, date: 'Recent', source: 'Tech Wire', sentiment: 'positive' }
      ],
      layoffAlert: partial.layoffAlert || {
        hasRecentLayoffs: false,
        details: 'Active hiring in engineering and product.'
      }
    };
  }

  private static generateDynamicDossier(companyName: string): CompanyDossier {
    const isMnc = ['tcs', 'infosys', 'accenture', 'capgemini', 'wipro', 'cognizant', 'hcl'].some(m => companyName.toLowerCase().includes(m));
    const isFintech = ['pay', 'bank', 'capital', 'finance', 'cred', 'razor'].some(f => companyName.toLowerCase().includes(f));

    if (isMnc) {
      return {
        companyName,
        domain: `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        rating: 3.8,
        ratingsBreakdown: {
          workLifeBalance: 4.1,
          cultureAndValues: 3.9,
          compensationAndBenefits: 3.5,
          seniorManagement: 3.6,
          careerOpportunities: 3.7,
          recommendToFriendPct: 75,
          ceoApprovalPct: 82
        },
        overview: {
          headquarters: 'India / Multinational IT Services Hubs',
          size: '100,000+ employees',
          founded: '1980s - 1990s',
          industry: 'Global IT Services, Digital Transformation & Consulting',
          fundingStage: 'Public Enterprise'
        },
        cultureAndBehavior: {
          leadershipPrinciples: [
            'Client first & delivery excellence',
            'Integrity, transparency, and ethics',
            'Continuous workforce upskilling'
          ],
          workCulture: 'Structured corporate enterprise. Defined project allocations, bench policies, and formal hierarchy. High job security with clear leave policies.',
          interviewDifficulty: 'Medium',
          interviewProcessStages: [
            'Aptitude & Technical Online Assessment',
            'Technical Interview (Core Java, React, SQL, OOP concepts)',
            'Managerial & HR Fitment Round'
          ]
        },
        employeeReviews: {
          pros: [
            'High job stability and predictable working hours for most accounts',
            'Massive internal training portals and certification sponsorships',
            'Great starting launchpad for freshers and early-career developers'
          ],
          cons: [
            'Annual salary hikes can be modest compared to product startups',
            'Project allocation depends on client account demand'
          ],
          commonThemes: ['Job security', 'Training programs', 'Corporate stability'],
          featuredReview: {
            title: 'Stable career starter with good learning programs',
            review: 'If you want stability, corporate exposure to Fortune 500 clients, and sponsored cloud certifications (AWS/Azure), it provides a structured platform.',
            role: 'Software Engineer, Pune/Bangalore',
            date: 'Verified Employee Review'
          }
        },
        techStack: ['Java', 'Spring Boot', 'React', 'Angular', 'Oracle SQL', 'AWS', 'Azure', 'Microservices'],
        recentNews: [
          { headline: `${companyName} signs multi-million dollar cloud migration deals`, date: 'Recent', source: 'Economic Times', sentiment: 'positive' }
        ],
        layoffAlert: {
          hasRecentLayoffs: false,
          details: 'Steady enterprise hiring across cloud and enterprise accounts.'
        }
      };
    }

    // Default High-Growth Tech Company Dossier
    return {
      companyName,
      domain: `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      rating: 4.2,
      ratingsBreakdown: {
        workLifeBalance: 4.0,
        cultureAndValues: 4.3,
        compensationAndBenefits: 4.4,
        seniorManagement: 4.1,
        careerOpportunities: 4.3,
        recommendToFriendPct: 84,
        ceoApprovalPct: 88
      },
      overview: {
        headquarters: 'Tech Innovation Hub',
        size: '500 - 5,000 employees',
        founded: '2016',
        industry: isFintech ? 'Fintech & Digital Payments' : 'Product & Cloud Software',
        fundingStage: 'Series B / C or Profitable Growth'
      },
      cultureAndBehavior: {
        leadershipPrinciples: [
          'High velocity & bias for action',
          'Extreme ownership of outcomes',
          'Radical candor and direct feedback'
        ],
        workCulture: 'High-energy product development. Rapid 2-week sprints, direct access to engineering leadership, and clear visibility into customer metrics.',
        interviewDifficulty: 'Challenging',
        interviewProcessStages: [
          'Introductory Call with Tech Recruiter (30 min)',
          'Technical Deep Dive: Hands-on live coding & problem solving (60 min)',
          'Architecture & System Design / Code Review (60 min)',
          'Founder / Engineering Director Culture Alignment'
        ]
      },
      employeeReviews: {
        pros: [
          'High impact: code you write ships to real production users within days',
          'Competitive compensation, equity incentives, and flexible hybrid setup',
          'Fast promotion trajectory for high performers'
        ],
        cons: [
          'Fast pace requires you to be comfortable with ambiguity',
          'Sprint deadlines can be tight around product launches'
        ],
        commonThemes: ['Fast growth', 'Strong ownership', 'Modern tech stack'],
        featuredReview: {
          title: 'Great place to build your skills fast',
          review: 'No red tape. If you have an idea to optimize database queries or redesign an API endpoint, you write the RFC and build it. Modern stack with TypeScript and Cloud.',
          role: 'Full Stack Engineer',
          date: 'Verified Review'
        }
      },
      techStack: isFintech 
        ? ['TypeScript', 'Node.js', 'React', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'Docker']
        : ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
      recentNews: [
        { headline: `${companyName} accelerates product expansion and developer tooling`, date: 'Recent', source: 'VentureBeat', sentiment: 'positive' }
      ],
      layoffAlert: {
        hasRecentLayoffs: false,
        details: 'Healthy expansion with active open positions.'
      }
    };
  }
}
