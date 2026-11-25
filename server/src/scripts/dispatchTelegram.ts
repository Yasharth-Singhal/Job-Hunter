import { AutomationService } from '../services/automation.service.js';

async function main() {
  console.log('[Script] Triggering automated Telegram harvest & dispatch...');
  const result = await AutomationService.executeDailyHarvest();
  console.log(`[Script] Completed: ${result.jobsFound} jobs, ${result.gigsFound} gigs evaluated.`);
  process.exit(0);
}

main().catch(err => {
  console.error('[Script] Error:', err);
  process.exit(1);
});
