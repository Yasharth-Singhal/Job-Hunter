import { Router } from 'express';
import { CompanyDossierService } from '../services/companyDossier.service.js';

export const companyRouter = Router();

companyRouter.get('/dossier', (req, res) => {
  try {
    const companyName = (req.query.name as string) || 'Tech Company';
    const dossier = CompanyDossierService.getDossier(companyName);
    res.json({ success: true, dossier });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
