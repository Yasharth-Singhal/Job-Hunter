import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'J / K', action: 'Navigate to Next / Previous Job card' },
    { key: 'Enter', action: 'Open Full Job Details, Salary & HR Audit' },
    { key: 'B', action: 'Bookmark / Unbookmark Active Job' },
    { key: 'W', action: 'Mark Active Job as "Will Apply"' },
    { key: 'A', action: 'Open Direct Apply Link in New Tab' },
    { key: 'C', action: 'Generate Tailored Cover Letter' },
    { key: 'I', action: 'Open Company Research Dossier & Employee Reviews' },
    { key: 'D', action: 'Dismiss / Mark as Not Interested (Permanently hide)' },
    { key: '?', action: 'Toggle Keyboard Shortcuts Modal' },
    { key: 'Esc', action: 'Close any active modal' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Keyboard Shortcuts Cheat Sheet</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs">
              <span className="text-zinc-300">{s.action}</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 font-mono text-emerald-400 text-[11px] font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-zinc-800 bg-zinc-950/40 text-center text-[11px] text-zinc-500 font-mono">
          Press <kbd className="text-zinc-300">Esc</kbd> anytime to close
        </div>
      </div>
    </div>
  );
};
