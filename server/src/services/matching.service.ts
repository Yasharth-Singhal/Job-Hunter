import axios from 'axios';
import { Job, ResumeProfile } from '../types.js';
import { HrAuditService } from './hrAudit.service.js';

export class MatchingService {
  public static scoreJobLocally(job: Job, profile: ResumeProfile): { score: number; reasons: string[]; missing: string[] } {
    let score = 55;
    const reasons: string[] = [];
    const missing: string[] = [];

    const jobText = (job.title + ' ' + (job.descriptionSnippet || '') + ' ' + (job.department || '')).toLowerCase();

    // 1. Target Role Matching
    const roleMatched = profile.targetRoles.some((role: string) => {
      const parts = role.toLowerCase().split(/[\s/()]+/).filter((p: string) => p.length > 2);
      return parts.some((part: string) => jobText.includes(part));
    });
    if (roleMatched) {
      score += 18;
      reasons.push('Title aligns with your target career track');
    }

    // 2. Core Skills Matching
    let matchedSkillsCount = 0;
    for (const skill of profile.coreSkills) {
      if (jobText.includes(skill.toLowerCase())) {
        matchedSkillsCount++;
      }
    }

    if (matchedSkillsCount > 0) {
      const skillBonus = Math.min(22, matchedSkillsCount * 6);
      score += skillBonus;
      reasons.push(`Direct tech stack overlap (${matchedSkillsCount} key skills found)`);
    }

    // 3. Remote / Location Preferences
    if (job.isRemote) {
      score += 10;
      reasons.push('100% Remote friendly');
    } else if (job.location.toLowerCase().includes('delhi') || job.location.toLowerCase().includes('noida') || job.location.toLowerCase().includes('india')) {
      score += 6;
      reasons.push('Location matches regional preferred hub');
    }

    // 4. Source credibility
    if (job.source === 'greenhouse' || job.source === 'lever' || job.source === 'ashby') {
      score += 4;
      reasons.push('Direct official ATS listing (Verified)');
    } else if (job.source === 'mnc') {
      score += 4;
      reasons.push('Official MNC Career Portal');
    }

    const finalScore = Math.min(98, Math.max(60, score));

    return {
      score: finalScore,
      reasons: reasons.slice(0, 3),
      missing: missing.slice(0, 2)
    };
  }

  public static async scoreWithGemini(job: Job, profile: ResumeProfile, apiKey: string): Promise<{ score: number; reasons: string[] }> {
    try {
      const prompt = `You are an executive talent recruiter. Evaluate the fit between this candidate profile and this job opening.
Candidate:
- Roles: ${profile.targetRoles.join(', ')}
- Skills: ${profile.coreSkills.join(', ')}
- Experience: ${profile.experienceLevel}

Job:
- Title: ${job.title}
- Company: ${job.company}
- Snippet: ${job.descriptionSnippet}

Return ONLY a valid JSON object in this format:
{"score": 85, "reasons": ["Reason 1", "Reason 2"]}
Do not include backticks, markdown, or commentary.`;

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        },
        { timeout: 5000 }
      );

      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          score: Math.min(99, Math.max(50, parsed.score || 80)),
          reasons: Array.isArray(parsed.reasons) ? parsed.reasons : ['Skills match candidate criteria']
        };
      }
    } catch (err) {}

    const fallback = this.scoreJobLocally(job, profile);
    return { score: fallback.score, reasons: fallback.reasons };
  }

  public static async scoreAndRankJobs(jobs: Job[], profile: ResumeProfile): Promise<Job[]> {
    const apiKey = process.env.GEMINI_API_KEY;

    const scoredJobs = await Promise.all(
      jobs.map(async (job) => {
        let result: { score: number; reasons: string[]; missing?: string[] };
        if (apiKey && apiKey.trim() !== '') {
          result = await this.scoreWithGemini(job, profile, apiKey);
        } else {
          result = this.scoreJobLocally(job, profile);
        }

        // Attach HR Resume Audit & Interview Helper
        const hrAudit = HrAuditService.generateHrAudit(job, profile);
        const interviewPrep = HrAuditService.generateInterviewHelper(job, profile);

        return {
          ...job,
          matchScore: result.score,
          matchReasons: result.reasons,
          missingKeywords: hrAudit.criticalKeywordsToAdd,
          hrAudit,
          interviewPrep
        };
      })
    );

    // Sort descending by match score
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    return scoredJobs;
  }
}
