import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Check, 
  Star, 
  TrendingUp, 
  Send 
} from 'lucide-react';
import axios from 'axios';
import { FreelanceGigEarning, GigInvoice, ResumeProfile } from '../types';

interface InvoiceModalProps {
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ profile, onClose }) => {
  const [activeTab, setActiveTab] = useState<'earnings' | 'create-invoice' | 'invoices'>('earnings');
  const [earnings, setEarnings] = useState<FreelanceGigEarning[]>([]);
  const [invoices, setInvoices] = useState<GigInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  // New Earning State
  const [newClient, setNewClient] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newAmountINR, setNewAmountINR] = useState(5000);
  const [newRating, setNewRating] = useState(5);
  const [newNotes, setNewNotes] = useState('');

  // Invoice Form State
  const [invClientName, setInvClientName] = useState('');
  const [invClientEmail, setInvClientEmail] = useState('');
  const [invCurrency, setInvCurrency] = useState<'INR' | 'USD'>('INR');
  const [invItems, setInvItems] = useState([
    { description: 'Video Editing & Thumbnail Batch (10 Videos)', hours: 15, ratePerHour: 500, amount: 7500 }
  ]);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/earnings');
      if (res.data?.success) {
        setEarnings(res.data.earnings || []);
        setInvoices(res.data.invoices || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const handleAddEarning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newProject.trim()) return;
    try {
      const res = await axios.post('/api/earnings/earning', {
        clientName: newClient,
        projectTitle: newProject,
        amountINR: newAmountINR,
        amountUSD: Math.round(newAmountINR / 85),
        status: 'paid',
        clientRating: newRating,
        clientNotes: newNotes
      });
      if (res.data?.earning) {
        setEarnings([res.data.earning, ...earnings]);
        setNewClient('');
        setNewProject('');
        setNewNotes('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClientName.trim()) return;
    try {
      const res = await axios.post('/api/earnings/invoice', {
        clientName: invClientName,
        clientEmail: invClientEmail,
        items: invItems,
        currency: invCurrency,
        dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
      });
      if (res.data?.invoice) {
        setInvoices([res.data.invoice, ...invoices]);
        setActiveTab('invoices');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalEarnedINR = earnings.reduce((acc, e) => acc + (e.amountINR || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Freelance Gig Income & Invoice Hub</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Track side earnings, rate clients, and generate printable PDF/HTML invoices
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-800 bg-zinc-950/40">
          {[
            { id: 'earnings', label: `Earnings Log (₹${totalEarnedINR.toLocaleString()})` },
            { id: 'create-invoice', label: '+ Create Invoice' },
            { id: 'invoices', label: `Invoices (${invoices.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'earnings' && (
            <div className="space-y-4">
              {/* Add Earning Form */}
              <form onSubmit={handleAddEarning} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Log New Paid Gig / Earning</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="Client or Platform (e.g. YouTube Creator / Upwork)"
                    className="p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="Project (e.g. 5 Tech Reels Edit)"
                    className="p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newAmountINR}
                      onChange={(e) => setNewAmountINR(Number(e.target.value))}
                      placeholder="Amount INR"
                      className="w-full p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors shrink-0"
                    >
                      Log
                    </button>
                  </div>
                </div>
              </form>

              {/* Earnings List */}
              <div className="space-y-2">
                {earnings.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">No freelance earnings logged yet.</div>
                ) : (
                  earnings.map((earn) => (
                    <div key={earn.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">{earn.projectTitle}</div>
                        <span className="text-[11px] text-zinc-400">{earn.clientName} • {earn.completedDate}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-emerald-400">₹{earn.amountINR.toLocaleString()}</div>
                        <span className="text-[10px] text-zinc-500 font-mono">≈ ${earn.amountUSD} USD</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'create-invoice' && (
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={invClientName}
                  onChange={(e) => setInvClientName(e.target.value)}
                  placeholder="Client or Company Name"
                  className="p-3 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500"
                  required
                />
                <input
                  type="email"
                  value={invClientEmail}
                  onChange={(e) => setInvClientEmail(e.target.value)}
                  placeholder="Client Email"
                  className="p-3 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-300 font-semibold">
                  <span>Line Items</span>
                  <button
                    type="button"
                    onClick={() => setInvItems([...invItems, { description: 'New Milestone Item', hours: 5, ratePerHour: 500, amount: 2500 }])}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                {invItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const next = [...invItems];
                        next[idx].description = e.target.value;
                        setInvItems(next);
                      }}
                      className="flex-1 p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200"
                    />
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => {
                        const next = [...invItems];
                        next[idx].amount = Number(e.target.value);
                        setInvItems(next);
                      }}
                      className="w-28 p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 font-mono"
                    />
                    {invItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setInvItems(invItems.filter((_, i) => i !== idx))}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Generate & Save Professional Invoice
              </button>
            </form>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-3">
              {invoices.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">No invoices generated yet.</div>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{inv.invoiceNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono">
                          Due: {inv.dueDate}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">Billed to: {inv.clientName} ({inv.clientEmail})</p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-400">
                        {inv.currency === 'INR' ? '₹' : '$'}{inv.totalAmount.toLocaleString()}
                      </div>
                      <button
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          if (printWindow) {
                            printWindow.document.write(`
                              <html>
                                <head><title>Invoice ${inv.invoiceNumber}</title></head>
                                <body style="font-family: sans-serif; padding: 40px; color: #111;">
                                  <h2>INVOICE: ${inv.invoiceNumber}</h2>
                                  <p><strong>From:</strong> ${inv.candidateName} (${inv.candidateEmail})</p>
                                  <p><strong>To:</strong> ${inv.clientName} (${inv.clientEmail})</p>
                                  <p><strong>Due Date:</strong> ${inv.dueDate}</p>
                                  <hr/>
                                  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                    <tr><th style="text-align: left;">Item</th><th style="text-align: right;">Amount</th></tr>
                                    ${inv.items.map(it => `<tr><td>${it.description}</td><td style="text-align: right;">${inv.currency} ${it.amount}</td></tr>`).join('')}
                                  </table>
                                  <hr/>
                                  <h3>Total Due: ${inv.currency} ${inv.totalAmount}</h3>
                                  <p><em>${inv.notes}</em></p>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }
                        }}
                        className="text-[11px] text-zinc-400 hover:text-white underline mt-1 block"
                      >
                        Print / Save as PDF
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
