import { Router } from 'express';
import { StoreService } from '../services/store.service.js';
import { CoverLetterService } from '../services/coverLetter.service.js';

export const coverLetterRouter = Router();

coverLetterRouter.post('/generate', (req, res) => {
  try {
    const { jobId } = req.body;
    const profile = StoreService.getProfile();
    const jobs = StoreService.getCachedJobs();
    const job = jobs.find(j => j.id === jobId);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const coverLetter = CoverLetterService.generate(job, profile);
    StoreService.saveCoverLetter(coverLetter);

    res.json({ success: true, coverLetter });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

coverLetterRouter.get('/all', (req, res) => {
  try {
    const letters = StoreService.getCoverLetters();
    res.json({ success: true, letters });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
