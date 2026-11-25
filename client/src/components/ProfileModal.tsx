import React, { useState } from 'react';
import axios from 'axios';
import { 
  X, 
  User, 
  UploadCloud, 
  Save, 
  Check, 
  Sparkles,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onUpdate: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onUpdate
}) => {
  if (!profile) return null;

  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [skillInput, setSkillInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [reuploading, setReuploading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('/api/profile', {
        ...formData,
        isCompleted: true
      });
      if (res.data?.success && res.data?.profile) {
        onUpdate(res.data.profile);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReuploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        try {
          const res = await axios.post('/api/profile/upload-resume', {
            fileName: file.name,
            text
          });
          if (res.data?.success && res.data?.profile) {
            setFormData(res.data.profile);
            onUpdate(res.data.profile);
          }
        } catch (err) {
          console.error('Re-upload error:', err);
        }
      }
      setReuploading(false);
    };
    reader.readAsText(file);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.coreSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        coreSkills: [...formData.coreSkills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      coreSkills: formData.coreSkills.filter(s => s !== skill)
    });
  };

  const addRole = () => {
    if (roleInput.trim() && !formData.targetRoles.includes(roleInput.trim())) {
      setFormData({
        ...formData,
        targetRoles: [...formData.targetRoles, roleInput.trim()]
      });
      setRoleInput('');
    }
  };

  const removeRole = (role: string) => {
    setFormData({
      ...formData,
      targetRoles: formData.targetRoles.filter(r => r !== role)
    });
  };

  const addInterest = () => {
    if (interestInput.trim() && !(formData.interests || []).includes(interestInput.trim())) {
      setFormData({
        ...formData,
        interests: [...(formData.interests || []), interestInput.trim()]
      });
      setInterestInput('');
    }
  };

  const removeInterest = (item: string) => {
    setFormData({
      ...formData,
      interests: (formData.interests || []).filter(x => x !== item)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Talent & Extracurricular Profile
              </h2>
              <p className="text-xs text-zinc-400">
                Powers MNC job matching and WFH side gig recommendations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Resume Upload Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-white">
                  {formData.resumeFileName ? `Current Resume: ${formData.resumeFileName}` : 'No resume uploaded yet'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Upload a new resume anytime to re-sync skills and experience
                </div>
              </div>
            </div>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer border border-zinc-700 transition-all">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{reuploading ? 'Parsing...' : 'Re-upload Resume'}</span>
              <input
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx"
                onChange={handleResumeFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Basic info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Target Roles */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Target Roles (MNCs & Startups)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Software Engineer, React Developer..."
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRole(); } }}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
              <button
                type="button"
                onClick={addRole}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.targetRoles.map((role) => (
                <span
                  key={role}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-zinc-800 text-zinc-200 border border-zinc-700"
                >
                  {role}
                  <button type="button" onClick={() => removeRole(role)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Core Technical Stack */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Core Technical Skills (Used for Full-Time Scoring)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. React, Node.js, TypeScript..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.coreSkills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-zinc-800 text-zinc-200 border border-zinc-700"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Diverse Extracurriculars & Non-Coding Interests */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <label className="block text-xs font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Non-Resume Interests (Video Editing, Tutoring, Writing, Design)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Video Editing, Online Math Tutoring, Content Writing..."
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.interests || []).map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                >
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Quota slider */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Daily Curated Feed Quota: <span className="text-white font-bold">{formData.dailyQuota} jobs/day</span>
            </label>
            <input
              type="range"
              min={5}
              max={25}
              value={formData.dailyQuota}
              onChange={(e) => setFormData({ ...formData, dailyQuota: Number(e.target.value) })}
              className="w-full accent-white"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Portfolio</label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
