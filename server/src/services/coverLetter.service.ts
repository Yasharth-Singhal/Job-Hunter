import { Job, ResumeProfile, CoverLetter } from '../types.js';

export class CoverLetterService {
  public static generate(job: Job, profile: ResumeProfile): CoverLetter {
    const candidateName = profile.name || 'Candidate';
    const candidateEmail = profile.email || '';
    const candidatePhone = profile.phone || '';
    const candidatePortfolio = profile.portfolioUrl || 'yasharth.dev';
    const candidateGithub = profile.githubUrl || 'github.com/Yasharth-Singhal';

    const topSkills = (profile.coreSkills || []).slice(0, 4).join(', ');
    const firstReq = job.requirements?.[0] || 'modern software engineering principles';
    const firstResp = job.responsibilities?.[0] || 'delivering high quality, maintainable systems';

    const letterText = `${candidateName}
${candidateEmail} | ${candidatePhone}
Portfolio: ${candidatePortfolio} | GitHub: ${candidateGithub}
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Hiring Team / Engineering Leadership
${job.company}
${job.location}

Subject: Application for ${job.title} – ${candidateName}

Dear ${job.company} Hiring Team,

I am writing to express my strong enthusiasm for the ${job.title} role at ${job.company}. Having followed ${job.company}'s work in building high-scale, reliable products, I am excited by the opportunity to contribute directly to your engineering team.

With a strong foundation in ${topSkills}, I specialize in building responsive, performant full-stack systems with clean architecture and strict testing standards. In my past work, I have architected and deployed autonomous tools and interactive applications—focusing heavily on ${firstResp}.

Why I am a strong match for ${job.company}:
• Alignment with Technical Stack: Your team values proficiency in ${job.requirements?.slice(0, 3).join(', ') || topSkills}. I have hands-on experience building and deploying production-grade systems using these exact technologies.
• Execution & Ownership: I bring a disciplined approach to software craft—translating complex product requirements like "${firstReq}" into intuitive, well-documented code.
• Collaborative Engineering: I excel in environments with high standards for code reviews, automated CI/CD pipelines, and proactive cross-functional communication.

I would welcome the opportunity to discuss how my technical skills, engineering discipline, and enthusiasm can add immediate value to ${job.company}'s roadmap. You can explore my live portfolio and repositories at ${candidatePortfolio} and ${candidateGithub}.

Thank you for your time and consideration.

Warm regards,

${candidateName}
${candidateEmail}
${candidatePhone}`;

    return {
      id: `cl_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      jobId: job.id,
      company: job.company,
      jobTitle: job.title,
      letterText,
      createdAt: new Date().toISOString()
    };
  }
}
