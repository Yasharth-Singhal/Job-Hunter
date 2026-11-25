import { Router } from 'express';
import { StoreService } from '../services/store.service.js';
import { FreelanceGigEarning, GigInvoice } from '../types.js';

export const earningsRouter = Router();

earningsRouter.get('/', (req, res) => {
  try {
    const earnings = StoreService.getEarnings();
    const invoices = StoreService.getInvoices();
    res.json({ success: true, earnings, invoices });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

earningsRouter.post('/earning', (req, res) => {
  try {
    const { clientName, projectTitle, amountINR, amountUSD, status, clientRating, clientNotes } = req.body;
    const earning: FreelanceGigEarning = {
      id: `earn_${Date.now()}`,
      clientName: clientName || 'Client',
      projectTitle: projectTitle || 'Freelance Milestone',
      amountINR: Number(amountINR) || 0,
      amountUSD: Number(amountUSD) || 0,
      status: status || 'paid',
      completedDate: new Date().toISOString().split('T')[0],
      clientRating: Number(clientRating) || 5,
      clientNotes: clientNotes || ''
    };
    const saved = StoreService.addEarning(earning);
    res.json({ success: true, earning: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

earningsRouter.post('/invoice', (req, res) => {
  try {
    const { clientName, clientEmail, items, currency, dueDate, notes } = req.body;
    const profile = StoreService.getProfile();

    const invoiceItems = Array.isArray(items) ? items : [
      { description: 'Freelance Design / Web Project Milestone', hours: 10, ratePerHour: 25, amount: 250 }
    ];

    const totalAmount = invoiceItems.reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);

    const invoice: GigInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      clientName: clientName || 'Client Organization',
      clientEmail: clientEmail || 'billing@client.com',
      candidateName: profile.name,
      candidateEmail: profile.email,
      candidatePhone: profile.phone,
      items: invoiceItems,
      totalAmount,
      currency: currency || 'INR',
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      notes: notes || 'Thank you for your business. Payment via UPI / Bank Transfer.'
    };

    const saved = StoreService.addInvoice(invoice);
    res.json({ success: true, invoice: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
