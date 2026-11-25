import { HrContact } from '../types.js';

export class EnricherService {
  public static inferHrContact(companyName: string, companyDomain?: string): HrContact {
    const domain = companyDomain || `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const cleanCompany = companyName.replace(/[^a-zA-Z0-9 ]/g, '').trim();

    // Standard high-probability talent acquisition inboxes
    const defaultEmails = [
      `talent@${domain}`,
      `careers@${domain}`,
      `recruiting@${domain}`,
      `hr@${domain}`
    ];

    const linkedinSearchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
      `"Talent Acquisition" OR "Recruiter" OR "Engineering Manager" ${cleanCompany}`
    )}`;

    return {
      name: `${cleanCompany} Talent Acquisition Team`,
      role: 'Technical Recruiter / Talent Lead',
      email: defaultEmails[0],
      linkedin: linkedinSearchUrl,
      confidence: 85
    };
  }
}
