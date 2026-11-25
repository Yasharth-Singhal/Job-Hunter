import { Router } from 'express';
import { StoreService } from '../services/store.service.js';
import { AnalyticsService } from '../services/analytics.service.js';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', (req, res) => {
  try {
    const jobs = StoreService.getCachedJobs();
    const applications = StoreService.getApplications();
    const profile = StoreService.getProfile();

    const funnel = AnalyticsService.getFunnelAnalytics(jobs, applications);
    const skillGap = AnalyticsService.getSkillGapAnalysis(jobs, profile);
    const targetRole = profile.targetRoles?.[0] || 'Software Engineer';
    const salaryIntel = AnalyticsService.getSalaryIntelligence(targetRole, profile.experienceLevel || 'Entry / Fresher');

    res.json({
      success: true,
      funnel,
      skillGap,
      salaryIntel
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

analyticsRouter.get('/salary', (req, res) => {
  try {
    const role = (req.query.role as string) || 'Software Engineer';
    const tier = (req.query.tier as string) || 'Junior';
    const salaryIntel = AnalyticsService.getSalaryIntelligence(role, tier);
    res.json({ success: true, salaryIntel });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
