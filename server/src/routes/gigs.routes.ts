import { Router } from 'express';
import { StoreService } from '../services/store.service.js';
import { GigService } from '../services/gig.service.js';
import { ProposalService } from '../services/proposal.service.js';

export const gigsRouter = Router();

gigsRouter.get('/', async (req, res) => {
  try {
    const profile = StoreService.getProfile();
    const gigs = await GigService.fetchAllGigs(profile);
    StoreService.setCachedGigs(gigs);
    res.json({ success: true, count: gigs.length, gigs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

gigsRouter.post('/proposal', (req, res) => {
  try {
    const { gigId } = req.body;
    const profile = StoreService.getProfile();
    const gigs = StoreService.getCachedGigs();
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) {
      return res.status(404).json({ success: false, error: 'Gig not found' });
    }
    const proposal = ProposalService.generateProposal(gig, profile);
    res.json({ success: true, proposal, gig });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

