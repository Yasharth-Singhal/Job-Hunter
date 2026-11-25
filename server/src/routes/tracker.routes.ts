import { Router } from 'express';
import { StoreService } from '../services/store.service.js';

export const trackerRouter = Router();

trackerRouter.get('/', (req, res) => {
  try {
    const applications = StoreService.getApplications();
    res.json({ success: true, count: applications.length, applications });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

trackerRouter.post('/', (req, res) => {
  try {
    const { jobId, jobTitle, company, directApplyUrl, status, type, salary, notes, coldEmailSent } = req.body;
    if (!jobTitle || !company) {
      return res.status(400).json({ success: false, error: 'jobTitle and company are required' });
    }

    const application = StoreService.addApplication({
      jobId: jobId || 'manual_' + Date.now(),
      jobTitle,
      company,
      directApplyUrl: directApplyUrl || '#',
      status: status || 'applied',
      appliedDate: new Date().toLocaleDateString(),
      type: type || 'full-time',
      salary: salary || '',
      notes: notes || 'Applied via direct career link',
      coldEmailSent: !!coldEmailSent
    });

    res.json({ success: true, application });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

trackerRouter.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = StoreService.updateApplication(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, application: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

trackerRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = StoreService.deleteApplication(id);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
