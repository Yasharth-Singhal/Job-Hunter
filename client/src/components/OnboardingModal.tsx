import React, { useState } from 'react';
import axios from 'axios';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  ArrowRight, 
  X, 
  AlertCircle,
  Plus,
  Video,
  GraduationCap,
  PenTool,
  Code
} from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  onCompleted: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onCompleted }) => {
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [fileName, setFileName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State for review
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    profileName: '',
    fileName: '',
    filePath: '',
    uploadedAt: '',
    resumeText: '',
    isCompleted: false,
    name: '',
    email: '',
    phone: '',
    location: 'India (Open to Global Remote)',
    targetRoles: ['Software Engineer', 'Frontend Developer', 'Full Stack Developer'],
    coreSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    extracurriculars: ['Video Editing', 'Online Tutoring', 'Content Writing'],
    interests: ['Video Editing', 'Online Math & CS Tutoring', 'Technical Writing'],
    minHourlyRate: 20,
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resumeSummary: '',
    experienceLevel: 'Entry / Fresher',
    dailyQuota: 10,
    preferredWorkplace: 'all',
    preferredLocation: 'Nearby / Delhi-NCR'
  });

  const [roleInput, setRoleInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [saving, setSaving] = useState(false);

  // File drop/upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);

    // Read file text
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text || text.trim().length === 0) {
        setErrorMsg('Could not read text from this file. You can paste your resume text below directly.');
        return;
      }
      setResumeText(text);
      await triggerParse(file.name, text);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file. Please paste your resume text in the box below.');
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = async () => {
    if (!resumeText.trim()) {
      setErrorMsg('Please paste your resume text or upload a file first.');
      return;
    }
    await triggerParse(fileName || 'Pasted_Resume.txt', resumeText);
  };

  const triggerParse = async (fName: string, text: string) => {
    setParsing(true);
    setErrorMsg(null);
    try {
      const res = await axios.post('/api/profile/upload-resume', {
        fileName: fName,
        text
      });
      if (res.data?.success && res.data?.profile) {
        setFormData(res.data.profile);
        setStep('review');
      } else {
        setErrorMsg('Parsing failed. Please verify your resume details manually.');
        setStep('review');
      }
    } catch (err: any) {
      console.error('Parse error:', err);
      // Fallback: advance to review so user is not stuck
      setStep('review');
    } finally {
      setParsing(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Name and Email are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put('/api/profile', {
        ...formData,
        isCompleted: true
      });
      if (res.data?.success && res.data?.profile) {
        onCompleted(res.data.profile);
      }
    } catch (err: any) {
      setErrorMsg('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Step indicator header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Step {step === 'upload' ? '1 of 2' : '2 of 2'} — Setup Your Career Copilot
            </span>
            <div className="flex gap-1.5">
              <div className={`h-1.5 w-8 rounded-full ${step === 'upload' ? 'bg-zinc-100' : 'bg-emerald-500'}`} />
              <div className={`h-1.5 w-8 rounded-full ${step === 'review' ? 'bg-zinc-100' : 'bg-zinc-800'}`} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {step === 'upload' ? 'Upload Your Resume to Begin' : 'Review & Confirm Profile'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {step === 'upload' 
              ? 'To source verified direct apply jobs and curated side gigs (video editing, tutoring, writing, dev), please provide your resume once.' 
              : 'We extracted your key details. Add any non-resume skills (e.g. video editing, teaching) to unlock diverse WFH earning gigs.'}
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'upload' ? (
            <div className="space-y-5">
              {/* Dropzone */}
              <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-2xl cursor-pointer bg-zinc-950/50 hover:bg-zinc-950/80 transition-all group">
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="h-12 w-12 rounded-2xl bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-zinc-200 group-hover:text-white">
                  {fileName ? fileName : 'Click or drag resume file here'}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Supports PDF, TXT, Markdown, or Word documents
                </p>
              </label>

              {/* Paste Alternative */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400">
                    Or paste raw resume text / profile summary:
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">Quick auto-extract</span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Paste your education, skills, projects, or full resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePasteSubmit}
                  disabled={parsing || !resumeText.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white text-zinc-900 hover:bg-zinc-200 transition-all disabled:opacity-40"
                >
                  <span>{parsing ? 'Parsing Resume...' : 'Parse Resume & Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: REVIEW */
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
                    placeholder="e.g. Yasharth Singhal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
                    placeholder="e.g. yasharth@gmail.com"
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
                    placeholder="+91 9876543210"
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

              {/* Core Skills */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Core Skills (Detected from Resume)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. React, Node.js, Python)..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (skillInput.trim()) {
                          setFormData({ ...formData, coreSkills: [...formData.coreSkills, skillInput.trim()] });
                          setSkillInput('');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.coreSkills.map((s) => (
                    <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-zinc-800 text-zinc-200 border border-zinc-700">
                      {s}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, coreSkills: formData.coreSkills.filter(x => x !== s) })}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Non-Resume Interests / Gigs (Video Editing, Tutoring, etc.) */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Non-Resume Interests (For Diverse WFH Earning Gigs)</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Video, Tutoring, Writing</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Select or add non-coding hobbies where you can earn side money:
                </p>

                {/* Quick Add Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Video Editing (Reels/YouTube)',
                    'Online Tutoring (Math/Science)',
                    'English Conversation Practice',
                    'Content & Blog Writing',
                    'Canva Social Media Design',
                    'Virtual Assistant & Research'
                  ].map((preset) => {
                    const isSelected = (formData.interests || []).includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          const current = formData.interests || [];
                          if (isSelected) {
                            setFormData({ ...formData, interests: current.filter(x => x !== preset) });
                          } else {
                            setFormData({ ...formData, interests: [...current, preset] });
                          }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 font-medium'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  ← Back to Upload
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? 'Completing Setup...' : 'Complete Profile & Unlock Dashboard'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
