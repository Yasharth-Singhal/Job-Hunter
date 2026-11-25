import cron from 'node-cron';
import { StoreService } from './store.service.js';
import { AtsService } from './ats.service.js';
import { MncService } from './mnc.service.js';
import { GigService } from './gig.service.js';
import { MatchingService } from './matching.service.js';
import { EnricherService } from './enricher.service.js';
import { Job, Gig } from '../types.js';

export class AutomationService {
  private static scheduledTask: cron.ScheduledTask | null = null;
  private static isRunning = false;

  public static async executeDailyHarvest(): Promise<{ jobsFound: number; gigsFound: number }> {
    if (this.isRunning) {
      console.log('[Automation] Harvest already in progress, skipping duplicate run.');
      return { jobsFound: 0, gigsFound: 0 };
    }

    this.isRunning = true;
    console.log('[Automation] 🚀 Starting Autonomous Job & Gig Harvest (Unlimited verified direct listings)...');

    try {
      const profile = StoreService.getActiveProfile();
      const notInterestedIds = StoreService.getNotInterestedJobIds();

      // 1. Fetch ATS + MNC jobs + remote gigs
      const [atsJobs, mncJobs, remoteGigs] = await Promise.all([
        AtsService.harvestAllAtsJobs(),
        Promise.resolve(MncService.getMncJobs()),
        GigService.fetchAllGigs(profile as any)
      ]);

      const rawJobs: Job[] = [...atsJobs, ...mncJobs];

      // 2. Filter out jobs permanently marked as "Not Interested"
      const activeJobs = rawJobs.filter(j => !notInterestedIds.has(j.id));

      // 3. Enrich with HR contacts
      const enrichedJobs = activeJobs.map(job => ({
        ...job,
        hrContact: EnricherService.inferHrContact(job.company, job.companyDomain)
      }));

      // 4. Score and Rank according to active resume profile
      const scoredJobs = await MatchingService.scoreAndRankJobs(enrichedJobs, profile as any);

      // 5. UNLIMITED: Cache all matching verified jobs without arbitrary limits
      StoreService.setCachedJobs(scoredJobs);
      StoreService.setCachedGigs(remoteGigs);

      // Auto-dispatch to Telegram if enabled
      const autoSettings = StoreService.getAutomation();
      if (autoSettings.telegramEnabled && autoSettings.telegramBotToken && autoSettings.telegramChatId) {
        try {
          const { TelegramService } = await import('./telegram.service.js');
          await TelegramService.sendDailyDigest(scoredJobs, remoteGigs);
          // Instant VIP alert for 95%+ match opening
          const vipJob = scoredJobs.find(j => j.matchScore >= 95);
          if (vipJob) {
            await TelegramService.sendVipJobAlert(vipJob).catch(() => {});
          }
          console.log('[Automation] 📲 Dispatched morning digest to Telegram (@Job_huntet_bot).');
        } catch (tgErr) {
          console.error('[Automation] Telegram dispatch notice:', tgErr);
        }
      }

      const nowStr = new Date().toLocaleString();
      StoreService.updateAutomation({
        lastRun: nowStr,
        nextRun: 'Tomorrow at 09:00 AM'
      });

      console.log(`[Automation] ✅ Harvest complete! Curated ${scoredJobs.length} verified jobs and ${remoteGigs.length} WFH gigs.`);
      return { jobsFound: scoredJobs.length, gigsFound: remoteGigs.length };
    } catch (err: any) {
      console.error('[Automation] Error during harvest:', err);
      return { jobsFound: 0, gigsFound: 0 };
    } finally {
      this.isRunning = false;
    }
  }

  public static initScheduler(): void {
    const settings = StoreService.getAutomation();
    if (!settings.enabled) {
      console.log('[Automation] Daily scheduler is disabled in settings.');
      return;
    }

    const [hour, minute] = (settings.time || '09:00').split(':');
    const cronExpr = `${minute || '0'} ${hour || '9'} * * *`;

    if (this.scheduledTask) {
      this.scheduledTask.stop();
    }

    console.log(`[Automation] Initializing daily cron scheduler: "${cronExpr}"`);
    this.scheduledTask = cron.schedule(cronExpr, async () => {
      console.log('[Automation] Scheduled cron triggered!');
      await this.executeDailyHarvest();
    });
  }
}
