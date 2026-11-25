import { Router } from 'express';
import { MailService } from '../services/mail.service.js';
import { StoreService } from '../services/store.service.js';
import { OutreachSequenceService } from '../services/outreachSequence.service.js';
import { TelegramService } from '../services/telegram.service.js';

export const outreachRouter = Router();

outreachRouter.post('/generate', (req, res) => {
  try {
    const { job, framework } = req.body;
    if (!job) {
      return res.status(400).json({ success: false, error: 'Job payload is required' });
    }

    const profile = StoreService.getProfile();
    const pitch = MailService.generatePitch(job, profile, framework || 'builder');

    res.json({ success: true, pitch });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3-Touch Cold Outreach Drip Sequence
outreachRouter.post('/sequence', (req, res) => {
  try {
    const { job } = req.body;
    if (!job) {
      return res.status(400).json({ success: false, error: 'Job is required' });
    }
    const profile = StoreService.getProfile();
    const sequence = OutreachSequenceService.generate3TouchSequence(job, profile);
    res.json({ success: true, sequence });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Alumni & Employee Referral Finder for ABESEC Ghaziabad
outreachRouter.post('/alumni', (req, res) => {
  try {
    const { job } = req.body;
    if (!job) {
      return res.status(400).json({ success: false, error: 'Job is required' });
    }
    const profile = StoreService.getProfile();
    const alumniIntel = OutreachSequenceService.generateAlumniReferralIntel(job, profile);
    res.json({ success: true, alumniIntel });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Telegram Test Notification
outreachRouter.post('/telegram-test', async (req, res) => {
  try {
    const result = await TelegramService.testNotification();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Telegram Daily Digest Dispatch
outreachRouter.post('/telegram-digest', async (req, res) => {
  try {
    const jobs = StoreService.getCachedJobs();
    const gigs = StoreService.getCachedGigs();
    const result = await TelegramService.sendDailyDigest(jobs, gigs);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

outreachRouter.post('/send', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ success: false, error: 'to, subject, and body are required' });
    }

    const result = await MailService.sendDirectSmtp({ to, subject, body });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

