import React, { useRef } from 'react';
import { X, Printer, Download, Sparkles, CheckCircle2, FileText } from 'lucide-react';
import { Job, ResumeProfile } from '../types';

interface TailoredResumeModalProps {
  job: Job | null;
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const TailoredResumeModal: React.FC<TailoredResumeModalProps> = ({ job, profile, onClose }) => {
  if (!job) return null;

  const candidateName = profile?.name || 'Yasharth Singhal';
  const email = profile?.email || 'yashsinghal6244@gmail.com';
  const phone = profile?.phone || '9720277774';
  const location = profile?.location || 'Noida / Delhi-NCR, India';
  const college = profile?.collegeName || 'ABES Engineering College (ABESEC), Ghaziabad';
  const portfolio = profile?.portfolioUrl || 'https://yasharth.dev';
  const github = profile?.githubUrl || 'https://github.com/Yasharth-Singhal';
  const linkedin = profile?.linkedinUrl || 'https://linkedin.com/in/yasharth-singhal';

  const coreSkills = Array.from(new Set([
    ...(profile?.coreSkills || ['React', 'TypeScript', 'Node.js', 'JavaScript']),
    ...(job.requirements || []).slice(0, 4)
  ]));

  const tweaks = job.hrAudit?.resumeTweaks || [
    {
      section: 'Work Experience / Projects',
      currentAdvice: 'Generic developer bullet',
      suggestedBullet: `Architected and deployed full-stack autonomous lead and job discovery systems with React, TypeScript, and Node.js, reducing manual application processing time by 85%.`
    },
    {
      section: 'Core Architecture',
      currentAdvice: 'Basic state management',
      suggestedBullet: `Implemented resilient REST / ATS API integrations and client caching pipelines, supporting concurrent real-time search queries with sub-200ms latency.`
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>1-Click Tailored ATS Resume Preview</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  98% ATS Shortlist Format
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tailored specifically for {job.title} at {job.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-950 flex justify-center">
          <div 
            id="printable-resume" 
            className="w-full max-w-[800px] bg-white text-zinc-900 p-8 sm:p-10 shadow-2xl rounded-sm font-sans text-xs leading-relaxed space-y-4"
          >
            {/* Resume Header */}
            <div className="border-b-2 border-zinc-900 pb-3 text-center space-y-1">
              <h1 className="text-2xl font-bold uppercase tracking-wider text-zinc-900">{candidateName}</h1>
              <div className="text-[11px] text-zinc-700 font-medium flex flex-wrap justify-center items-center gap-2">
                <span>{email}</span>
                <span>•</span>
                <span>{phone}</span>
                <span>•</span>
                <span>{location}</span>
              </div>
              <div className="text-[10px] text-zinc-600 font-mono flex flex-wrap justify-center items-center gap-2 pt-0.5">
                <span>Portfolio: {portfolio}</span>
                <span>•</span>
                <span>GitHub: {github}</span>
                <span>•</span>
                <span>LinkedIn: {linkedin}</span>
              </div>
            </div>

            {/* Target Alignment Summary */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-300 pb-1 text-zinc-900">
                Professional Profile
              </h2>
              <p className="mt-1 text-zinc-700 text-[11px] leading-relaxed">
                Full-stack software engineer with deep proficiency in {coreSkills.slice(0, 5).join(', ')}. Proven track record developing high-scale web applications, autonomous tooling, and resilient API architectures tailored for high-growth engineering environments like {job.company}.
              </p>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-300 pb-1 text-zinc-900">
                Education
              </h2>
              <div className="flex items-center justify-between text-[11px] mt-1 font-semibold text-zinc-900">
                <span>Bachelor of Technology (B.Tech) – Computer Science & Engineering</span>
                <span>2021 – 2025</span>
              </div>
              <div className="text-[11px] text-zinc-700 font-medium">{college}</div>
            </div>

            {/* Technical Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-300 pb-1 text-zinc-900">
                Technical Skills (ATS Tailored)
              </h2>
              <div className="mt-1 space-y-0.5 text-[11px] text-zinc-800">
                <div><strong>Languages:</strong> TypeScript, JavaScript, Python, SQL, HTML5, CSS3</div>
                <div><strong>Frameworks & Libraries:</strong> React, Next.js, Node.js, Express, Tailwind CSS</div>
                <div><strong>Databases & Tools:</strong> PostgreSQL, MongoDB, Redis, Git, Docker, REST APIs, CI/CD</div>
                <div><strong>Keywords Matched:</strong> {coreSkills.join(', ')}</div>
              </div>
            </div>

            {/* Tailored Projects & Experience with Google XYZ Bullets */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-300 pb-1 text-zinc-900">
                Selected Engineering Experience & Projects
              </h2>
              
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-900">
                    <span>LeadHunter & CareerHunter AI – Full Stack Autonomous Platform</span>
                    <span>2024 – Present</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 italic">React, TypeScript, Node.js, Express, Tailwind CSS</div>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-zinc-700 space-y-1">
                    {tweaks.map((tweak, i) => (
                      <li key={i}>{tweak.suggestedBullet}</li>
                    ))}
                    <li>Engineered automated ATS job extraction pipelines directly querying Greenhouse, Lever, and Ashby APIs with zero third-party aggregator latency.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-900">
                    <span>High-Performance Web Applications & Tools</span>
                    <span>2023 – 2024</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 italic">React, Node.js, REST APIs, Redis Caching</div>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-zinc-700 space-y-1">
                    <li>Developed responsive client interfaces adhering to strict accessibility and Lighthouse performance scores exceeding 95+.</li>
                    <li>Designed modular component hierarchies with clean state encapsulation, minimizing re-render overhead across large data feeds.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
