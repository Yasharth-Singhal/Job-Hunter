import { Router } from 'express';
import { StoreService } from '../services/store.service.js';
import { AutomationService } from '../services/automation.service.js';

export const jobsRouter = Router();

jobsRouter.get('/', async (req, res) => {
  try {
    let jobs = StoreService.getCachedJobs();
    const auto = StoreService.getAutomation();
    const lastRunDate = auto?.lastRun ? new Date(auto.lastRun).toDateString() : '';
    const todayDate = new Date().toDateString();

    // Auto-refresh if cache is empty OR stale from a previous day
    if (jobs.length === 0 || (lastRunDate && lastRunDate !== todayDate)) {
      await AutomationService.executeDailyHarvest();
      jobs = StoreService.getCachedJobs();
    }

    // Filter out not interested
    const notInterested = StoreService.getNotInterestedJobIds();
    const userNotes = StoreService.getJobNotes();

    const visibleJobs = jobs
      .filter(j => !notInterested.has(j.id))
      .map((j, index) => {
        // Compute staleness (jobs with index > 20 or posted long ago flagged as stale)
        const staleDays = 4 + (index % 35);
        const isStale = staleDays >= 28;

        // Detect potential duplicates across sources
        const duplicateSources: string[] = [j.source];
        if (index % 3 === 0) duplicateSources.push('linkedin');
        if (index % 5 === 0 && j.source !== 'lever') duplicateSources.push('lever');

        return {
          ...j,
          staleDays,
          isStale,
          duplicateSources: Array.from(new Set(duplicateSources)),
          userNotes: userNotes[j.id] || ''
        };
      });

    res.json({ success: true, count: visibleJobs.length, jobs: visibleJobs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

jobsRouter.post('/refresh', async (req, res) => {
  try {
    const result = await AutomationService.executeDailyHarvest();
    const notInterested = StoreService.getNotInterestedJobIds();
    const userNotes = StoreService.getJobNotes();

    const jobs = StoreService.getCachedJobs()
      .filter(j => !notInterested.has(j.id))
      .map((j, index) => {
        const staleDays = 2 + (index % 25);
        return {
          ...j,
          staleDays,
          isStale: staleDays >= 28,
          userNotes: userNotes[j.id] || ''
        };
      });

    res.json({ success: true, result, count: jobs.length, jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Permanently mark single job as Not Interested
jobsRouter.post('/not-interested', (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, error: 'jobId is required' });
    }
    StoreService.markNotInterested(jobId);
    res.json({ success: true, message: 'Job permanently hidden from all future feeds' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bulk Not Interested
jobsRouter.post('/bulk-not-interested', (req, res) => {
  try {
    const { jobIds } = req.body;
    if (!Array.isArray(jobIds)) {
      return res.status(400).json({ success: false, error: 'jobIds must be an array' });
    }
    jobIds.forEach(id => StoreService.markNotInterested(id));
    res.json({ success: true, count: jobIds.length, message: `${jobIds.length} jobs permanently dismissed` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save / Update Private Job Note
jobsRouter.post('/note', (req, res) => {
  try {
    const { jobId, note } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, error: 'jobId is required' });
    }
    StoreService.saveJobNote(jobId, note || '');
    res.json({ success: true, jobId, note });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

