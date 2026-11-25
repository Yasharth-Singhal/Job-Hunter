import { Router } from 'express';
import { StoreService } from '../services/store.service.js';
import { ResumeVersion } from '../types.js';

export const resumeVersionsRouter = Router();

resumeVersionsRouter.get('/', (req, res) => {
  try {
    const profile = StoreService.getProfile();
    const versions = StoreService.getResumeVersions(profile.id);
    res.json({ success: true, versions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

resumeVersionsRouter.post('/', (req, res) => {
  try {
    const { versionTag, targetCompany, targetRole, resumeContent, keyHighlights } = req.body;
    const profile = StoreService.getProfile();

    const version: ResumeVersion = {
      id: `ver_${Date.now()}`,
      profileId: profile.id,
      versionTag: versionTag || `v${Date.now().toString().slice(-4)}`,
      targetCompany: targetCompany || 'General Tech',
      targetRole: targetRole || profile.targetRoles[0] || 'Software Engineer',
      resumeContent: resumeContent || profile.resumeText || '',
      keyHighlights: Array.isArray(keyHighlights) ? keyHighlights : (profile.coreSkills || []),
      createdAt: new Date().toISOString()
    };

    const saved = StoreService.addResumeVersion(version);
    res.json({ success: true, version: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

resumeVersionsRouter.delete('/:id', (req, res) => {
  try {
    const success = StoreService.deleteResumeVersion(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
