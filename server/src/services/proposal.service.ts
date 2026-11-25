import { Gig, ResumeProfile } from '../types.js';

export class ProposalService {
  public static generateProposal(gig: Gig, profile: ResumeProfile): string {
    const skillsList = gig.matchedSkills.slice(0, 3).join(', ');
    const candidateName = profile.name || 'Candidate';

    if (gig.category === 'video-editing') {
      return `Hi there,

I reviewed your project for "${gig.title}" and would love to help you produce clean, engaging, high-retention video content.

What I bring to this project:
• Fast, high-energy pacing with smooth zoom-ins, sound design, and animated captions (CapCut / Premiere Pro / DaVinci)
• Experience crafting high-CTR thumbnails and vertical shorts formatted for maximum YouTube/TikTok engagement
• Quick 24-48 hour turnaround with 100% satisfaction revisions

You can review my past creative work and editing portfolio:
• Portfolio / Work: ${profile.portfolioUrl || 'https://yasharth.dev'}

I'm ready to begin immediately and can deliver a 30-second sample cut from your raw footage so you can test the quality. Looking forward to collaborating!

Best regards,
${candidateName}`;
    }

    if (gig.category === 'tutoring') {
      return `Hello,

I am excited about the opportunity for "${gig.title}". Teaching concepts with patience, clarity, and real-world intuition is something I deeply enjoy.

Why I am a great fit:
• Clear step-by-step breakdown of complex problems into digestible building blocks
• Interactive, engaging teaching style tailored to the student's individual learning speed
• Strong command over fundamentals with interactive digital whiteboard exercises

I offer flexible session hours and can start with an introductory concept review to outline a custom learning roadmap.

Warm regards,
${candidateName}
${profile.email}`;
    }

    // Default Tech / Freelance Proposal
    return `Hi there,

I came across your posting for "${gig.title}" and would love to tackle this for you.

Having built production-grade full-stack systems and autonomous tools (like LeadHunter AI) using ${skillsList}, I know how to deliver clean, maintainable solutions without unnecessary complexity.

How I will deliver this for you:
1. Quick requirements check & architectural plan
2. Rapid execution with clean code and thorough edge-case testing
3. Clear documentation & ongoing handover support

Relevant Links:
• Portfolio: ${profile.portfolioUrl || 'https://yasharth.dev'}
• GitHub: ${profile.githubUrl || 'https://github.com/Yasharth-Singhal'}

I can start right away and ensure this is completed within your estimated timeline of ${gig.estimatedHours}. Let me know if we can discuss the details!

Best,
${candidateName}`;
  }
}
