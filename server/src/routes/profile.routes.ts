import { Router, Request } from 'express';
import { StoreService } from '../services/store.service.js';
import { AutomationService } from '../services/automation.service.js';
import { AuthService } from '../services/auth.service.js';
import { UserAccount } from '../types.js';

export const profileRouter = Router();

function getReqUser(req: Request): UserAccount | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return AuthService.verifyToken(token);
}

profileRouter.get('/', (req, res) => {
  try {
    const user = getReqUser(req);
    const activeProfile = StoreService.getActiveProfileForUser(user);
    const profiles = StoreService.getProfilesForUser(user);
    res.json({
      success: true,
      profile: activeProfile,
      profiles,
      activeProfileId: activeProfile.id,
      isAuthenticated: !!user
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

profileRouter.put('/', (req, res) => {
  try {
    const user = getReqUser(req);
    const updated = StoreService.updateActiveProfileForUser(req.body, user);
    const profiles = StoreService.getProfilesForUser(user);
    res.json({ success: true, profile: updated, profiles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Select active profile
profileRouter.post('/select', async (req, res) => {
  try {
    const user = getReqUser(req);
    const { profileId } = req.body;
    if (!profileId) {
      return res.status(400).json({ success: false, error: 'profileId is required' });
    }

    const switched = StoreService.setActiveProfileForUser(profileId, user);
    if (!switched) {
      return res.status(404).json({ success: false, error: 'Profile not found for your account' });
    }

    res.json({
      success: true,
      message: `Active profile switched to "${switched.profileName}"`,
      profile: switched,
      profiles: StoreService.getProfilesForUser(user)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a profile
profileRouter.delete('/:id', (req, res) => {
  try {
    const user = getReqUser(req);
    const { id } = req.params;
    const deleted = StoreService.deleteProfileForUser(id, user);
    if (!deleted) {
      return res.status(400).json({ success: false, error: 'Cannot delete the only profile or unauthorized' });
    }
    res.json({
      success: true,
      profile: StoreService.getActiveProfileForUser(user),
      profiles: StoreService.getProfilesForUser(user)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Resume Upload: Creates a new named profile or updates existing
profileRouter.post('/upload-resume', async (req, res) => {
  try {
    const { fileName, text, profileName } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Resume text content is required' });
    }

    // 1. Physically persist the resume to disk in data/resumes/
    const savedPath = StoreService.saveResumeFile(fileName || 'resume.txt', text);

    // 2. Email extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const extractedEmail = emailMatch ? emailMatch[0] : '';

    // 3. Phone extraction
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91[\s-]?\d{10}/);
    const extractedPhone = phoneMatch ? phoneMatch[0] : '';

    // 4. Name extraction
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let extractedName = 'Candidate';
    if (lines.length > 0 && lines[0].length < 40 && !lines[0].toLowerCase().includes('resume') && !lines[0].toLowerCase().includes('curriculum')) {
      extractedName = lines[0].replace(/[#*]/g, '').trim();
    }

    // 5. Detected Location in Resume
    let extractedLocation = 'Noida / Delhi-NCR, India';
    const lower = text.toLowerCase();
    if (lower.includes('noida') || lower.includes('delhi') || lower.includes('gurgaon') || lower.includes('ncr')) {
      extractedLocation = 'Noida / Delhi-NCR, India';
    } else if (lower.includes('bengaluru') || lower.includes('bangalore')) {
      extractedLocation = 'Bengaluru, India';
    } else if (lower.includes('hyderabad')) {
      extractedLocation = 'Hyderabad, India';
    } else if (lower.includes('pune')) {
      extractedLocation = 'Pune, India';
    } else if (lower.includes('mumbai')) {
      extractedLocation = 'Mumbai, India';
    }

    // 6. Skills extraction dictionary
    const KNOWN_SKILLS = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Tailwind CSS',
      'HTML', 'CSS', 'Python', 'C++', 'Java', 'SQL', 'PostgreSQL', 'MongoDB',
      'Git', 'GitHub', 'Next.js', 'Redux', 'REST APIs', 'GraphQL', 'Docker',
      'AWS', 'Linux', 'Vite', 'Figma', 'Jest', 'Cheerio', 'Puppeteer'
    ];

    const detectedSkills = new Set<string>();
    for (const skill of KNOWN_SKILLS) {
      const regex = new RegExp(`\\b${skill.replace('+', '\\+')}\\b`, 'i');
      if (regex.test(text)) {
        detectedSkills.add(skill);
      }
    }

    // 7. Detect extracurriculars / non-coding interests
    const KNOWN_INTERESTS = [
      { key: 'Video Editing (Reels/YouTube)', keywords: ['video editing', 'premiere', 'davinci', 'capcut', 'after effects', 'reels', 'youtube'] },
      { key: 'Online Tutoring (Math/Science)', keywords: ['tutor', 'tutoring', 'teaching', 'mentor', 'instructor', 'education'] },
      { key: 'Content & Blog Writing', keywords: ['writing', 'blog', 'technical writer', 'documentation', 'content creator', 'copywriting'] },
      { key: 'Graphic Design & Branding', keywords: ['graphic design', 'photoshop', 'illustrator', 'canva', 'ui/ux', 'design'] },
      { key: 'Virtual Assistant & Research', keywords: ['virtual assistant', 'calendar', 'lead research', 'admin', 'assistant'] },
      { key: 'Website Performance Tuning', keywords: ['performance', 'lighthouse', 'web vitals', 'optimization', 'speed'] }
    ];

    const detectedInterests = new Set<string>();
    for (const item of KNOWN_INTERESTS) {
      if (item.keywords.some(kw => text.toLowerCase().includes(kw))) {
        detectedInterests.add(item.key);
      }
    }

    // 8. Experience level
    let expLevel: 'Entry / Fresher' | 'Junior (1-2 yrs)' | 'Mid-level (3-5 yrs)' | 'Senior' = 'Entry / Fresher';
    if (lower.includes('senior') || lower.includes('lead') || lower.includes('5+ years') || lower.includes('6+ years')) {
      expLevel = 'Senior';
    } else if (lower.includes('3 years') || lower.includes('4 years') || lower.includes('mid-level')) {
      expLevel = 'Mid-level (3-5 yrs)';
    } else if (lower.includes('1 year') || lower.includes('2 years') || lower.includes('junior')) {
      expLevel = 'Junior (1-2 yrs)';
    }

    const finalProfileName = profileName || (fileName ? `${extractedName} - ${fileName.replace(/\.[^.]+$/, '')}` : `${extractedName} - Resume`);

    const user = getReqUser(req);
    const newProfile = StoreService.createProfileForUser({
      profileName: finalProfileName,
      fileName: fileName || 'Uploaded_Resume.pdf',
      filePath: savedPath,
      name: extractedName,
      email: extractedEmail || user?.email || '',
      phone: extractedPhone || user?.phone || '',
      location: extractedLocation,
      targetRoles: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer (React / TypeScript)'],
      coreSkills: Array.from(detectedSkills),
      extracurriculars: Array.from(detectedInterests),
      interests: Array.from(detectedInterests),
      minHourlyRate: 20,
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      resumeSummary: text.substring(0, 300).replace(/[\r\n]+/g, ' ') + '...',
      resumeText: text.substring(0, 8000),
      experienceLevel: expLevel,
      preferredWorkplace: 'all',
      preferredLocation: 'Nearby / Delhi-NCR'
    }, user);

    res.json({
      success: true,
      message: `Profile "${newProfile.profileName}" created and activated!`,
      profile: newProfile,
      profiles: StoreService.getProfilesForUser(user)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
