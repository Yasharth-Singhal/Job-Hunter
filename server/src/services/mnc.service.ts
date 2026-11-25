import { Job, WorkplaceType, ExperienceTier } from '../types.js';

interface MncFeedTemplate {
  company: string;
  domain: string;
  portalUrl: string;
  salary: string;
  roles: Array<{
    title: string;
    location: string;
    city: string;
    workplaceType: WorkplaceType;
    experienceLevel: ExperienceTier;
    department: string;
    url: string;
    type: 'full-time' | 'internship';
    snippet: string;
    responsibilities: string[];
    requirements: string[];
  }>;
}

function buildMncHiringIntel(companyName: string, roleTitle: string, domain: string) {
  const clean = companyName.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  return {
    recruiterTitle: `${clean} Technical Recruiter / Talent Lead`,
    recruiterEmailPattern: `talent@${domain} or careers@${domain}`,
    linkedinRecruiterUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`"Recruiter" OR "Talent Acquisition" ${clean}`)}`,
    linkedinManagerUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`"Engineering Manager" OR "Software Manager" ${clean}`)}`,
    connectionNote: `Hi! I saw the ${roleTitle} opening at ${clean}. As a full-stack developer with experience in React, TypeScript, and modern distributed systems, I would love to connect and follow your team's engineering work.`
  };
}

export class MncService {
  private static MNC_LIST: MncFeedTemplate[] = [
    {
      company: 'Google',
      domain: 'google.com',
      portalUrl: 'https://www.google.com/about/careers/applications/jobs/results',
      salary: '₹24 - 42 LPA ($115,000 - $170,000)',
      roles: [
        {
          title: 'Software Engineer, Early Career / University Graduate',
          location: 'Bengaluru / Hyderabad, India / Remote',
          city: 'Bengaluru / Hyderabad',
          workplaceType: 'hybrid',
          experienceLevel: 'fresher',
          department: 'Core Engineering',
          url: 'https://www.google.com/about/careers/applications/jobs/results?q=Software%20Engineer',
          type: 'full-time',
          snippet: 'Build next-generation technologies that change how billions connect, explore, and interact.',
          responsibilities: [
            'Design and develop high-scale software solutions across Google products.',
            'Collaborate with global teams to optimize distributed computing systems.',
            'Maintain strict adherence to code health, test coverage, and security standards.'
          ],
          requirements: [
            'Bachelor’s degree in Computer Science, related technical field, or equivalent practical experience.',
            'Experience with software development in one or more general purpose programming languages (C++, Java, Python, JavaScript/TypeScript).',
            'Strong foundation in data structures, algorithms, and software design patterns.'
          ]
        },
        {
          title: 'Associate Software Developer (Web & Cloud)',
          location: 'Bengaluru, India',
          city: 'Bengaluru',
          workplaceType: 'hybrid',
          experienceLevel: 'junior',
          department: 'Google Cloud Platform',
          url: 'https://www.google.com/about/careers/applications/jobs/results?q=Google%20Cloud%20Developer',
          type: 'full-time',
          snippet: 'Design and develop cloud infrastructure, microservices, and client-facing web portals.',
          responsibilities: [
            'Build frontend interfaces and backend cloud microservices for enterprise cloud users.',
            'Optimize web bundle sizes, asset delivery pipelines, and Core Web Vitals.',
            'Partner with UX researchers to design accessible, enterprise-grade cloud dashboards.'
          ],
          requirements: [
            '1+ years of software development experience with React, TypeScript, or modern web frameworks.',
            'Understanding of cloud architectures, containerization, and REST / gRPC protocols.',
            'Passion for developer velocity and high-uptime production systems.'
          ]
        }
      ]
    },
    {
      company: 'Microsoft',
      domain: 'microsoft.com',
      portalUrl: 'https://careers.microsoft.com',
      salary: '₹22 - 38 LPA ($110,000 - $160,000)',
      roles: [
        {
          title: 'Software Engineer (Frontend / React / TypeScript)',
          location: 'Noida / Hyderabad / Bengaluru, India',
          city: 'Noida / Delhi-NCR',
          workplaceType: 'hybrid',
          experienceLevel: 'junior',
          department: 'Experiences & Devices / Azure',
          url: 'https://jobs.careers.microsoft.com/global/en/search?q=Software%20Engineer%20React',
          type: 'full-time',
          snippet: 'Work on cutting-edge enterprise cloud interfaces and web applications using modern React and TypeScript.',
          responsibilities: [
            'Architect scalable React component libraries with TypeScript and accessibility standards.',
            'Integrate telemetry and real-user monitoring to track client performance and error rates.',
            'Collaborate closely with designers and product managers to ship agile iterations.'
          ],
          requirements: [
            'Proficiency in React, TypeScript, CSS-in-JS, and modern frontend toolchains.',
            'Solid comprehension of asynchronous state management and cross-browser quirks.',
            'Track record of building responsive, performant user interfaces.'
          ]
        },
        {
          title: 'Full Stack Engineer - Cloud & AI Innovation',
          location: 'Bengaluru / Hyderabad, India / Hybrid',
          city: 'Bengaluru',
          workplaceType: 'hybrid',
          experienceLevel: 'mid-senior',
          department: 'Microsoft AI & Copilot',
          url: 'https://jobs.careers.microsoft.com/global/en/search?q=Full%20Stack%20Engineer',
          type: 'full-time',
          snippet: 'Collaborate with global teams to build AI-assisted developer tools and web platforms.',
          responsibilities: [
            'Develop end-to-end features integrating LLM capabilities into developer tooling.',
            'Design scalable microservices with caching, queue processing, and low-latency storage.',
            'Champion software craftsmanship and automated end-to-end testing.'
          ],
          requirements: [
            'Experience building full-stack applications with Node.js/C# and React/TypeScript.',
            'Familiarity with cloud platforms (Azure, AWS) and AI prompt engineering / API integration.',
            'Strong problem-solving capability in high-scale distributed environments.'
          ]
        }
      ]
    },
    {
      company: 'Amazon',
      domain: 'amazon.com',
      portalUrl: 'https://www.amazon.jobs',
      salary: '₹22 - 40 LPA ($110,000 - $165,000)',
      roles: [
        {
          title: 'Software Development Engineer I (SDE 1)',
          location: 'Gurgaon / Noida / Hyderabad / Bengaluru, India',
          city: 'Noida / Delhi-NCR',
          workplaceType: 'hybrid',
          experienceLevel: 'fresher',
          department: 'AWS / Retail Technology',
          url: 'https://www.amazon.jobs/en/search?base_query=SDE+I&loc_query=India',
          type: 'full-time',
          snippet: 'Solve high-scale distributed systems challenges, architect resilient REST services, and optimize web applications.',
          responsibilities: [
            'Write clean, maintainable code for distributed service components.',
            'Participate in on-call rotations, code reviews, and operational reviews.',
            'Implement automated tests and ensure operational excellence across service tiers.'
          ],
          requirements: [
            'Bachelor’s degree in Computer Science or related STEM field.',
            'Experience with Java, C++, Python, or TypeScript and object-oriented design.',
            'Strong understanding of algorithms, complexity analysis, and database fundamentals.'
          ]
        },
        {
          title: 'Front End Engineer (React / Next.js)',
          location: 'Bengaluru, India / Remote',
          city: 'Remote',
          workplaceType: 'remote',
          experienceLevel: 'junior',
          department: 'Amazon Consumer Web',
          url: 'https://www.amazon.jobs/en/search?base_query=Front+End+Engineer&loc_query=India',
          type: 'full-time',
          snippet: 'Craft rich, highly-accessible user experiences supporting millions of customer interactions daily.',
          responsibilities: [
            'Build frontend features optimized for high-traffic customer checkout and product detail pages.',
            'Optimize initial page load performance, Core Web Vitals, and responsive layouts.',
            'Build reusable, documented UI component libraries.'
          ],
          requirements: [
            'Experience with React, Next.js, Redux, and modern browser APIs.',
            'Demonstrated ability to write accessible HTML and CSS conforming to WCAG standards.',
            'Experience with performance profiling and unit testing frameworks.'
          ]
        }
      ]
    },
    {
      company: 'Accenture',
      domain: 'accenture.com',
      portalUrl: 'https://www.accenture.com/in-en/careers',
      salary: '₹6.5 - 14 LPA (Digital Specialization)',
      roles: [
        {
          title: 'Associate Software Engineer (ASE) - Digital & Cloud',
          location: 'Noida / Gurugram / Bengaluru / Pune, India',
          city: 'Noida / Delhi-NCR',
          workplaceType: 'hybrid',
          experienceLevel: 'fresher',
          department: 'Technology Centers of Excellence',
          url: 'https://www.accenture.com/in-en/careers/jobsearch?jk=Associate%20Software%20Engineer',
          type: 'full-time',
          snippet: 'Design, develop, and test software solutions across web, cloud, and modern JavaScript ecosystems.',
          responsibilities: [
            'Develop client-facing web applications and enterprise cloud integrations.',
            'Participate in sprint planning, agile standups, and QA validation.',
            'Document technical designs and software release notes.'
          ],
          requirements: [
            'Degree in engineering, IT, or related fields with strong programming fundamentals.',
            'Understanding of JavaScript, HTML/CSS, React or Angular, and SQL databases.',
            'Strong analytical thinking and willingness to learn emerging cloud platforms.'
          ]
        }
      ]
    },
    {
      company: 'Tata Consultancy Services (TCS)',
      domain: 'tcs.com',
      portalUrl: 'https://ibegin.tcs.com',
      salary: '₹7.0 - 15 LPA (TCS Digital Cadre)',
      roles: [
        {
          title: 'Digital Systems Engineer - React & Node.js',
          location: 'Delhi-NCR / Noida / Pune / Bengaluru',
          city: 'Noida / Delhi-NCR',
          workplaceType: 'hybrid',
          experienceLevel: 'junior',
          department: 'Digital Interactive Services',
          url: 'https://ibegin.tcs.com/iBegin/jobs/search',
          type: 'full-time',
          snippet: 'Develop customer-centric enterprise applications utilizing React, Node.js, and cloud services.',
          responsibilities: [
            'Build responsive single-page applications and RESTful backend microservices.',
            'Work closely with client technical architects on legacy modernization projects.',
            'Ensure software compliance with international security and accessibility guidelines.'
          ],
          requirements: [
            'Experience with React, Node.js, Express, and relational database systems.',
            'Understanding of software engineering lifecycle (SDLC) and Git version control.',
            'Good interpersonal communication and collaborative teamwork abilities.'
          ]
        }
      ]
    },
    {
      company: 'Infosys',
      domain: 'infosys.com',
      portalUrl: 'https://career.infosys.com',
      salary: '₹8.0 - 16 LPA (Specialist Programmer)',
      roles: [
        {
          title: 'Specialist Programmer (Full Stack Web & Cloud)',
          location: 'Chandigarh / Noida / Bengaluru / Pune, India',
          city: 'Noida / Delhi-NCR',
          workplaceType: 'hybrid',
          experienceLevel: 'junior',
          department: 'Infosys Digital Core',
          url: 'https://career.infosys.com/joblist',
          type: 'full-time',
          snippet: 'Design modern web applications, microservices architectures, and performance-critical systems.',
          responsibilities: [
            'Lead implementation of mission-critical full stack digital transformation features.',
            'Write clean, modular code with automated continuous integration and testing.',
            'Optimize database queries and cloud infrastructure resources.'
          ],
          requirements: [
            'Strong foundation in full stack development (React, Node.js, TypeScript, PostgreSQL).',
            'Solid comprehension of system design, caching patterns, and microservices.',
            'Demonstrated competitive programming or open-source software project contributions.'
          ]
        }
      ]
    },
    {
      company: 'Capgemini',
      domain: 'capgemini.com',
      portalUrl: 'https://www.capgemini.com/careers',
      salary: '₹7.5 - 14.5 LPA',
      roles: [
        {
          title: 'Software Developer - React & Full Stack Node.js',
          location: 'Noida / Gurugram / Mumbai / Pune, India',
          city: 'Noida / Delhi-NCR',
          workplaceType: 'hybrid',
          experienceLevel: 'junior',
          department: 'Cloud & Custom Applications',
          url: 'https://www.capgemini.com/in-en/careers/job-search/?search=React',
          type: 'full-time',
          snippet: 'Deliver modern web client solutions and API integrations for Fortune 500 digital transformation projects.',
          responsibilities: [
            'Develop modular React frontends paired with robust Node.js backend services.',
            'Coordinate with cross-geography engineering pods and product stakeholders.',
            'Participate in code reviews and automated testing automation.'
          ],
          requirements: [
            'Hands-on experience with React, TypeScript, Redux, and Node.js.',
            'Familiarity with SQL / NoSQL database design and RESTful endpoints.',
            'High adaptability to evolving project requirements in agile sprints.'
          ]
        }
      ]
    }
  ];

  public static getMncJobs(): Job[] {
    const jobs: Job[] = [];

    for (const mnc of this.MNC_LIST) {
      for (let i = 0; i < mnc.roles.length; i++) {
        const role = mnc.roles[i];
        jobs.push({
          id: `mnc_${mnc.company.toLowerCase().replace(/\s+/g, '')}_${i + 1}`,
          title: role.title,
          company: mnc.company,
          companyDomain: mnc.domain,
          location: role.location,
          city: role.city,
          isRemote: role.workplaceType === 'remote',
          workplaceType: role.workplaceType,
          experienceLevel: role.experienceLevel,
          type: role.type,
          source: 'mnc',
          directApplyUrl: role.url,
          descriptionSnippet: `${role.snippet} Direct official application on ${mnc.company} Careers portal.`,
          fullDescription: `### Career Opportunity at ${mnc.company}\n${role.snippet}\n\nJoin our world-class engineering team to work on projects that impact millions of users across the globe. We provide an environment where your engineering curiosity and initiative are supported with immense scale and mentorship.`,
          responsibilities: role.responsibilities,
          requirements: role.requirements,
          salary: mnc.salary,
          department: role.department,
          benefits: [
            'Comprehensive Health & Family Insurance',
            'Annual Performance Bonuses & Stock Units (RSUs)',
            'Tuition Reimbursement & Certification Sponsorship',
            'Subsidized Meals, Cab Transport & Wellness Subscriptions'
          ],
          postedAt: 'Active Today',
          matchScore: 0,
          matchReasons: [],
          hiringTeam: buildMncHiringIntel(mnc.company, role.title, mnc.domain),
          category: 'core-career',
          isVerifiedDirect: true
        });
      }
    }

    return jobs;
  }
}
