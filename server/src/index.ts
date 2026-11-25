import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { jobsRouter } from './routes/jobs.routes.js';
import { gigsRouter } from './routes/gigs.routes.js';
import { profileRouter } from './routes/profile.routes.js';
import { trackerRouter } from './routes/tracker.routes.js';
import { outreachRouter } from './routes/outreach.routes.js';
import { automationRouter } from './routes/automation.routes.js';
import { companyRouter } from './routes/company.routes.js';
import { coverLetterRouter } from './routes/coverLetter.routes.js';
import { analyticsRouter } from './routes/analytics.routes.js';
import { earningsRouter } from './routes/earnings.routes.js';
import { resumeVersionsRouter } from './routes/resumeVersions.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { AutomationService } from './services/automation.service.js';
import { TelegramBotService } from './services/telegramBot.service.js';
import { AuthService } from './services/auth.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/gigs', gigsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/tracker', trackerRouter);
app.use('/api/outreach', outreachRouter);
app.use('/api/automation', automationRouter);
app.use('/api/company', companyRouter);
app.use('/api/cover-letter', coverLetterRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/earnings', earningsRouter);
app.use('/api/resume-versions', resumeVersionsRouter);

// Telegram Webhook Endpoint (24/7 cloud webhook support)
app.post('/api/telegram/webhook', async (req, res) => {
  try {
    await TelegramBotService.handleUpdate(req.body);
  } catch (err: any) {
    console.error('[Telegram Webhook Error]:', err.message);
  }
  res.sendStatus(200);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CareerHunter AI Server',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files if built
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`⚡ CareerHunter Server listening on port ${PORT}`);
  // Initialize Auth defaults
  AuthService.ensureInitialized();
  // Initialize daily cron scheduler
  AutomationService.initScheduler();
  // Start interactive Telegram long polling (for local or cloud instance without webhook)
  TelegramBotService.startPolling();
});
