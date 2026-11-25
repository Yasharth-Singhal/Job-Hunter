import { Job, ResumeProfile, HrResumeAudit, InterviewPrepGuide } from '../types.js';

export class HrAuditService {
  public static generateHrAudit(job: Job, profile: ResumeProfile): HrResumeAudit {
    const jobText = (job.title + ' ' + job.fullDescription + ' ' + (job.requirements || []).join(' ')).toLowerCase();
    const resumeText = (profile.resumeText + ' ' + profile.coreSkills.join(' ') + ' ' + profile.resumeSummary).toLowerCase();

    // Key tech terms dictionary
    const TECH_VOCABULARY = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Tailwind CSS',
      'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Docker', 'AWS', 'Next.js',
      'Redux', 'CI/CD', 'Git', 'Microservices', 'Unit Testing', 'Jest', 'Cheerio',
      'System Design', 'Performance Optimization', 'Security', 'Agile / Scrum'
    ];

    const matchedKeywords: string[] = [];
    const criticalMissing: string[] = [];

    for (const tech of TECH_VOCABULARY) {
      const inJob = jobText.includes(tech.toLowerCase());
      const inResume = resumeText.includes(tech.toLowerCase());

      if (inJob && inResume) {
        matchedKeywords.push(tech);
      } else if (inJob && !inResume) {
        criticalMissing.push(tech);
      }
    }

    // Calculate realistic ATS match score
    let atsScore = 65;
    if (matchedKeywords.length >= 4) atsScore += 18;
    else if (matchedKeywords.length >= 2) atsScore += 10;

    if (criticalMissing.length > 3) atsScore -= 8;
    else if (criticalMissing.length === 0) atsScore += 10;

    const finalAts = Math.min(96, Math.max(55, atsScore));

    const verdict: 'High Shortlist Probability' | 'Moderate Match (Needs Tweaks)' | 'Low Initial Match' = 
      finalAts >= 82 ? 'High Shortlist Probability' :
      finalAts >= 70 ? 'Moderate Match (Needs Tweaks)' : 'Low Initial Match';

    // Tailored bullet point improvements
    const primarySkill = matchedKeywords[0] || profile.coreSkills[0] || 'Modern Web Technologies';
    const missingHighlight = criticalMissing[0] || 'Scalable System Architecture';

    const resumeTweaks = [
      {
        section: 'Core Experience / Projects',
        currentAdvice: `Replace generic developer phrasing with measurable business impact featuring ${primarySkill}.`,
        suggestedBullet: `Architected and delivered scalable full-stack features using ${primarySkill} and ${profile.coreSkills[1] || 'Node.js'}, decreasing API response latency by 28% and ensuring 99.9% uptime.`
      },
      {
        section: 'Skills & Tools Section',
        currentAdvice: `Add these top missing ATS search terms to pass automated resume parsing for ${job.company}:`,
        suggestedBullet: `Skills: ${[...profile.coreSkills.slice(0, 5), ...criticalMissing.slice(0, 3)].join(' • ')}`
      },
      {
        section: 'Project Portfolio Highlights',
        currentAdvice: `Frame your LeadHunter AI or personal projects to directly solve ${job.company}'s engineering bottlenecks.`,
        suggestedBullet: `Engineered autonomous web automation pipelines handling multi-stage data discovery, automated auditing, and real-time alerts with zero external SaaS costs.`
      }
    ];

    const recruiterRedFlags: string[] = [];
    if (criticalMissing.length > 0) {
      recruiterRedFlags.push(`Missing keyword "${criticalMissing.slice(0, 2).join(', ')}" in your skills header.`);
    }
    if (profile.experienceLevel === 'Entry / Fresher' && job.experienceLevel === 'mid-senior') {
      recruiterRedFlags.push('Role asks for senior experience: compensate by heavily highlighting live production projects.');
    } else {
      recruiterRedFlags.push('Ensure your GitHub repositories contain clean README documentation and live deployment links.');
    }

    const hrSummary = `As an HR reviewer for ${job.company}, your resume shows strong foundations in ${matchedKeywords.slice(0, 3).join(', ')}. To maximize your shortlist odds, add "${criticalMissing.slice(0, 2).join(' & ')}" into your projects section before submitting.`;

    return {
      atsScore: finalAts,
      verdict,
      criticalKeywordsToAdd: criticalMissing.slice(0, 6),
      matchedKeywords,
      resumeTweaks,
      recruiterRedFlags,
      hrSummary
    };
  }

  public static generateInterviewHelper(job: Job, profile: ResumeProfile): InterviewPrepGuide {
    const mainSkill = profile.coreSkills[0] || 'React';
    const secondSkill = profile.coreSkills[1] || 'Node.js';

    return {
      technicalQuestions: [
        {
          question: `How do you optimize state management and avoid unnecessary component re-renders in ${mainSkill}?`,
          answerKey: `Discuss memoization (useMemo, useCallback, React.memo), state colocation, context splitting, and profiling with React DevTools.`,
          whatHrLooksFor: `Understanding of performance profiling rather than premature micro-optimizations.`
        },
        {
          question: `Explain how you design resilient RESTful APIs in ${secondSkill} with proper error handling and rate-limiting.`,
          answerKey: `Mention centralized error middleware, validation schemas (Zod/Joi), HTTP status conventions, and token-bucket rate limiting.`,
          whatHrLooksFor: `Production-readiness, security practices, and clean architecture.`
        },
        {
          question: `How do you handle asynchronous workflows and background job queues when scaling services?`,
          answerKey: `Reference message queues (Redis BullMQ, RabbitMQ, Kafka), worker concurrency, idempotency, and retry backoff policies.`,
          whatHrLooksFor: `System design maturity and handling distributed failure modes.`
        },
        {
          question: `Walk me through your database indexing strategy when query response times degrade on high-traffic tables.`,
          answerKey: `Explain EXPLAIN ANALYZE, compound indexes, B-tree mechanisms, avoiding full table scans, and read-replica strategies.`,
          whatHrLooksFor: `Hands-on database debugging competence.`
        },
        {
          question: `What security best practices do you implement against XSS, CSRF, and SSRF attacks in modern web applications?`,
          answerKey: `Mention CSP headers, HttpOnly SameSite cookies, input sanitization, and URL allowlist validation for outgoing requests.`,
          whatHrLooksFor: `Security-first mindset in web development.`
        }
      ],
      behavioralQuestions: [
        {
          question: `Tell me about a difficult technical roadblock you encountered in a recent project and how you resolved it.`,
          starStrategy: `STAR Method: Situation (LeadHunter/web project), Task (optimizing scraping/caching), Action (researched root cause, engineered fallback), Result (100% reliability, zero downtime).`,
          sampleAnswer: `When building my autonomous lead generation engine, third-party sites frequently throttled concurrent requests. I re-architected the fetcher with exponential backoff and localized JSON caching, eliminating timeouts and doubling throughput.`
        },
        {
          question: `How do you prioritize deliverables when faced with tight deadlines and competing technical requirements?`,
          starStrategy: `Focus on business impact, MVP scope containment, transparent communication with stakeholders, and technical debt trade-offs.`,
          sampleAnswer: `I categorize tasks by core user impact versus cosmetic enhancements. I deliver the robust critical path first, thoroughly test edge cases, and schedule secondary optimizations for the subsequent release.`
        },
        {
          question: `Describe a situation where you had to quickly learn an unfamiliar technology or framework to ship a feature.`,
          starStrategy: `Show intellectual agility, deep reading of official documentation, and building isolated proof-of-concept sandboxes.`,
          sampleAnswer: `To integrate Google Gemini Flash AI, I bypassed complex bloated SDKs, studied the REST endpoint specs directly, and built a custom Axios connector in 2 days that reduced bundle size and eliminated package conflicts.`
        }
      ],
      smartQuestionsToAskHr: [
        `"What does the engineering deployment pipeline look like at ${job.company}, and how often does the team ship to production?"`,
        `"What is the single biggest technical challenge the engineering team is focused on tackling over the next two quarters?"`,
        `"How does the engineering culture at ${job.company} balance rapid shipping velocity with test coverage and refactoring?"`
      ]
    };
  }
}
