import { Router } from 'express';
import { StoreService } from '../services/store.service.js';
import { AutomationService } from '../services/automation.service.js';

export const automationRouter = Router();

automationRouter.get('/', (req, res) => {
  try {
    const settings = StoreService.getAutomation();
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

automationRouter.put('/', (req, res) => {
  try {
    const updated = StoreService.updateAutomation(req.body);
    AutomationService.initScheduler();
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

automationRouter.post('/trigger-now', async (req, res) => {
  try {
    const result = await AutomationService.executeDailyHarvest();
    const settings = StoreService.getAutomation();
    res.json({ success: true, result, settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
