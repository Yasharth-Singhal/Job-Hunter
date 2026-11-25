import nodemailer, { Transporter } from 'nodemailer';
import { Job, UserProfile } from '../types.js';

export interface GeneratedEmailPitch {
  subject: string;
  body: string;
  gmailDraftUrl: string;
  mailtoUrl: string;
}

export class MailService {
  private static transporter: Transporter | null = null;

  public static generatePitch(
    job: Job,
    profile: UserProfile,
    framework: 'direct' | 'builder' | 'value' = 'builder'
  ): GeneratedEmailPitch {
    let subject = '';
    let body = '';

    const hrName = job.hrContact?.name || `${job.company} Hiring Team`;
    const toEmail = job.hrContact?.email || `talent@${job.companyDomain || 'company.com'}`;

    if (framework === 'builder') {
      subject = `Application: ${job.title} — ${profile.name} (Full Stack / AI Builder)`;
      body = `Hi ${hrName},

I noticed ${job.company}'s opening for the ${job.title} role and wanted to reach out directly.

As a full-stack developer specializing in ${profile.coreSkills.slice(0, 4).join(', ')}, I love building production-grade software that solves real operational bottlenecks. For example, I recently engineered LeadHunter AI—an autonomous lead discovery, website auditing, and multi-channel pipeline system built with modern React, TypeScript, and Google Gemini.

Key highlights I bring to ${job.company}:
• Production experience with ${profile.coreSkills.slice(0, 3).join(', ')}
• Rapid prototyping, clean architecture, and performance optimization
• Open-source mindset and fast autonomous delivery

You can explore my code and live work here:
• GitHub: ${profile.githubUrl}
• Portfolio: ${profile.portfolioUrl}

I have attached my resume and would welcome a brief 10-minute chat to discuss how I can contribute to ${job.company}'s engineering goals.

Best regards,
${profile.name}
${profile.phone} | ${profile.email}
${profile.linkedinUrl}`;
    } else if (framework === 'direct') {
      subject = `${job.title} Application — ${profile.name}`;
      body = `Hi ${hrName},

I am writing to express my strong interest in the ${job.title} position at ${job.company}.

With hands-on experience in ${profile.coreSkills.slice(0, 5).join(', ')}, I am confident in my ability to hit the ground running on your team. I thrive in fast-paced environments where code quality, reliability, and speed matter.

Relevant links:
• Portfolio: ${profile.portfolioUrl}
• GitHub: ${profile.githubUrl}
• LinkedIn: ${profile.linkedinUrl}

Are you open to a brief conversation this week to discuss my background and the team's roadmap?

Best regards,
${profile.name}
${profile.phone} | ${profile.email}`;
    } else {
      subject = `Ideas for ${job.company} & ${job.title} role — ${profile.name}`;
      body = `Hi ${hrName},

I follow ${job.company}'s engineering updates and was excited to see your posting for ${job.title}.

Having worked extensively on high-speed web apps and automation using ${profile.coreSkills.slice(0, 4).join(', ')}, I see several exciting opportunities to enhance user experience and developer velocity.

I would love to share a few actionable thoughts on your current tech challenges and see if my background matches your immediate roadmap.

Portfolio & Projects: ${profile.portfolioUrl}
GitHub: ${profile.githubUrl}

Looking forward to connecting!

Sincerely,
${profile.name}
${profile.email}`;
    }

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const gmailDraftUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodedSubject}&body=${encodedBody}`;

    return {
      subject,
      body,
      gmailDraftUrl,
      mailtoUrl
    };
  }

  public static async sendDirectSmtp(options: {
    to: string;
    subject: string;
    body: string;
  }): Promise<{ success: boolean; message: string }> {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return {
        success: false,
        message: 'SMTP credentials not configured in .env. Use 1-Click Gmail Draft instead!'
      };
    }

    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
    }

    try {
      await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Job Hunter Candidate'}" <${user}>`,
        to: options.to,
        subject: options.subject,
        text: options.body
      });
      return { success: true, message: `Email successfully dispatched to ${options.to}` };
    } catch (err: any) {
      return { success: false, message: `SMTP dispatch error: ${err.message}` };
    }
  }
}
