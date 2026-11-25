import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, FileText, Tag, Building2, Briefcase } from 'lucide-react';
import axios from 'axios';
import { ResumeVersion, ResumeProfile } from '../types';

interface ResumeVersionsModalProps {
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const ResumeVersionsModal: React.FC<ResumeVersionsModalProps> = ({ profile, onClose }) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [tag, setTag] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState(profile?.targetRoles[0] || 'Software Engineer');
  const [resumeContent, setResumeContent] = useState(profile?.resumeSummary || '');

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/resume-versions');
      if (res.data?.success) {
        setVersions(res.data.versions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim() || !targetCompany.trim()) return;
    try {
      const res = await axios.post('/api/resume-versions', {
        versionTag: tag,
        targetCompany,
        targetRole,
        resumeContent,
        keyHighlights: profile?.coreSkills || []
      });
      if (res.data?.version) {
        setVersions([res.data.version, ...versions]);
        setTag('');
        setTargetCompany('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/resume-versions/${id}`);
      setVersions(versions.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Resume Version Control & Company Snapshots</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Save and track customized resume variations sent to specific companies (e.g. Stripe vs Google vs YC Startup)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Create Form */}
          <form onSubmit={handleCreateVersion} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Save New Tailored Resume Snapshot</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Version Tag (e.g. v2-Stripe-Frontend)"
                className="p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="Target Company (e.g. Stripe)"
                className="p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Role (e.g. Frontend Engineer)"
                className="p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <textarea
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              placeholder="Tailored summary or key highlights specific to this version..."
              rows={3}
              className="w-full p-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none font-mono"
            />

            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors"
            >
              Save Version Snapshot
            </button>
          </form>

          {/* Versions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Saved Versions ({versions.length})</h4>
            {versions.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">No tailored resume versions saved yet.</div>
            ) : (
              versions.map((v) => (
                <div key={v.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">{v.versionTag}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {v.targetCompany} • {v.targetRole}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {v.resumeContent && (
                      <p className="text-xs text-zinc-400 font-mono mt-1 line-clamp-2">{v.resumeContent}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-zinc-500 hover:text-red-400 p-1"
                    title="Delete version"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
