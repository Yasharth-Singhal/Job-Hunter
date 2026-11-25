import React, { useState } from 'react';
import axios from 'axios';
import { 
  X, 
  Clock, 
  Sparkles, 
  Check, 
  Play, 
  Calendar, 
  Terminal, 
  AlertCircle,
  Save
} from 'lucide-react';
import { AutomationSettings } from '../types';

interface AutomationModalProps {
  automation: AutomationSettings | null;
  onClose: () => void;
  onUpdate: (updated: AutomationSettings) => void;
  onTriggerNow: () => void;
  isTriggering: boolean;
}

export const AutomationModal: React.FC<AutomationModalProps> = ({
  automation,
  onClose,
  onUpdate,
  onTriggerNow,
  isTriggering
}) => {
  if (!automation) return null;

  const [formData, setFormData] = useState<AutomationSettings>({ ...automation });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('/api/automation', formData);
      if (res.data?.success && res.data?.settings) {
        onUpdate(res.data.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update automation settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Daily Scheduled Automation
              </h2>
              <p className="text-xs text-slate-400">
                Automated morning job harvesting, ATS parsing & HR discovery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Scheduler Status:</span>
              <span className={`font-semibold flex items-center gap-1.5 ${formData.enabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-2 h-2 rounded-full ${formData.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {formData.enabled ? 'Active (Cron Runner)' : 'Disabled'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Successful Harvest:</span>
              <span className="text-slate-300 font-mono">{formData.lastRun || 'Never run yet'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Next Scheduled Trigger:</span>
              <span className="text-indigo-300 font-mono">{formData.enabled ? `Daily at ${formData.time}` : 'Paused'}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Enable Daily Background Harvest</div>
                <div className="text-[11px] text-slate-400">Automatically scans Greenhouse, Lever, Ashby, and WFH boards every morning</div>
              </div>
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Daily Execution Time (24h)
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cadence
                </label>
                <select
                  value={formData.cadence}
                  onChange={(e) => setFormData({ ...formData, cadence: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="daily">Daily (Recommended)</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'Settings Saved' : saving ? 'Saving...' : 'Save Schedule Settings'}</span>
            </button>
          </form>

          {/* Manual Trigger Now */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onTriggerNow}
              disabled={isTriggering}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Play className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
              <span>{isTriggering ? 'Executing Harvest Right Now...' : 'Run Harvest Now (On-Demand)'}</span>
            </button>
          </div>

          {/* Antigravity CLI Integration Note */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Antigravity Autonomous Copilot</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              You can also trigger or inspect this daily via Antigravity in your terminal or chat:
              <br />
              <code className="text-indigo-300 font-mono text-[10px]">npm run dev</code> starts the background server on port 5001.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
