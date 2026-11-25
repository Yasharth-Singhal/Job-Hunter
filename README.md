# 🎯 CareerHunter AI — Autonomous Job & WFH Gig Operating System

> **Autonomous AI-powered career copilot that sources verified direct apply links (bypassing job board aggregator spam), curates flexible WFH/part-time earning gigs matched to your extracurricular skills, discovers recruiter contacts, and stages personalized cold outreach.**

---

## ⚡ Why CareerHunter AI?

Most job search portals (Naukri, Indeed, Shine, LinkedIn scrapers) trap applicants in expired reposts, endless redirects, and opaque tracking walls. Meanwhile, auto-apply bots blindly spam generic resumes and get blacklisted by ATS firewalls.

**CareerHunter AI** changes the game:
1. **Direct-to-Source ATS Harvester**: Queries public endpoints for **Greenhouse, Lever, Ashby, and MNC career portals** to extract canonical application forms with zero intermediate redirects.
2. **Dual-Track Sourcing**:
   - 🏢 **Core Full-Time / MNC Careers**: Top engineering and software roles scored ($0–100\%$) against your resume and tech stack.
   - 💰 **Part-Time / WFH Gigs**: Monetizable side gigs (React fixes, Core Web Vitals performance tuning, scrapers, QA bug hunting, technical docs) matched with your extracurricular strengths so you earn money while building products.
3. **Review & Copilot Mode (Smart Applying)**: Eliminates blind spray-and-pray. Delivers a daily curated quota (e.g. 10 top jobs + 5 side gigs) with 1-click direct apply links or Antigravity browser autofill on your command.
4. **Recruiter Outreach Copilot**: Generates tailored cold pitches highlighting your actual builder projects (e.g., LeadHunter AI) and launches a **1-Click Gmail Web Draft** with subject and body pre-filled.
5. **Autonomous Daily Harvest**: Runs in the background via cron (e.g., 09:00 AM daily) to seed your morning feed without manual effort.

---

## 🏗️ Architecture & Tech Stack

```
Job Hunter /
├── client/                     # Vite + React 18/19 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Header, tabs, refresh trigger, daily quota
│   │   │   ├── JobCard.tsx            # ATS direct link cards with match breakdown
│   │   │   ├── GigCard.tsx            # Part-time & WFH gig cards with payout
│   │   │   ├── ColdEmailModal.tsx     # 1-Click Gmail Draft & Recruiter Finder
│   │   │   ├── ProfileModal.tsx       # Resume, target roles & extracurriculars editor
│   │   │   ├── AutomationModal.tsx    # Daily cron schedule & manual trigger
│   │   │   └── TrackerView.tsx        # Kanban application tracking pipeline
│   │   ├── App.tsx                    # Main interactive dashboard
│   │   └── types.ts                   # Unified TypeScript schemas
├── server/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── services/
│   │   │   ├── ats.service.ts         # Greenhouse, Lever & Ashby direct API fetcher
│   │   │   ├── mnc.service.ts         # Google, Microsoft, Amazon, TCS, Infosys, etc.
│   │   │   ├── gig.service.ts         # Remotive & curated WFH micro-task fetcher
│   │   │   ├── matching.service.ts    # AI scoring engine (Gemini Flash + local fallback)
│   │   │   ├── enricher.service.ts    # Talent acquisition & recruiter contact locator
│   │   │   ├── mail.service.ts        # Pitch generation, 1-Click Gmail Draft, SMTP
│   │   │   ├── automation.service.ts  # node-cron morning automation scheduler
│   │   │   └── store.service.ts       # Zero-cost local JSON storage with deduplication
│   │   ├── routes/                    # REST API endpoints
│   │   └── index.ts                   # Server entrypoint (Port 5001)
└── data/                       # Local database & cache (storage.json)
```

---

## 🚀 Quick Start

### 1. Start Both Frontend and Backend Concurrently
From the root folder (`E:\Personal Projects\Job Hunter`):

```bash
npm run dev
```

* **Frontend Dashboard**: [http://localhost:5174](http://localhost:5174)
* **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 🛠️ Key Capabilities

### 1. Direct ATS Link Verification
Bypasses spam aggregators by connecting directly to:
* **Greenhouse**: `boards-api.greenhouse.io` (Cloudflare, Stripe, Figma, Canonical, GitHub, Datadog, Razorpay, etc.)
* **Lever**: `api.lever.co` (Netlify, Palantir, Webflow, Affirm, etc.)
* **Ashby**: `api.ashbyhq.com` (Ramp, Retool, Linear, Monzo, etc.)
* **MNC Direct Portals**: Official career portals for Google, Microsoft, Amazon, Infosys, TCS, Accenture, Capgemini.

### 2. Extracurricular WFH Gigs
Matches non-full-time projects with your hobbies and skills:
* **Web Dev & Landing Pages**: React / Tailwind styling fixes.
* **Core Web Vitals & Speed**: Lighthouse audits and performance optimization.
* **Scrapers & Bots**: Data extraction and webhook automations.
* **QA & Bug Hunting**: Functional testing on staging web applications.
* **Technical Writing**: Markdown documentation and API guides.

### 3. Recruiter Outreach Copilot
* Generates 3 customizable pitch frameworks:
  - 🛠️ **Project Showcase**: Highlights LeadHunter AI and full-stack software mastery.
  - ⚡ **Direct & Punchy**: 3-paragraph format for quick skim.
  - 💡 **Problem Solver**: Consultative value proposition.
* **1-Click Gmail Draft Launcher**: Launches Gmail in your browser with recipient, subject, and body fully formatted. You review and click Send.

---

## ⚙️ Configuration & Environment

Configuration is stored in `server/.env`:

```env
PORT=5001

# Optional: Google Gemini Flash API Key (100% Free at https://aistudio.google.com/)
# If omitted, CareerHunter uses intelligent local semantic keyword scoring
GEMINI_API_KEY=

# Optional: Direct SMTP credentials (If you want direct sending instead of Gmail Drafts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM_NAME=Yasharth Singhal
```

---

## 🤖 Antigravity Autonomous Workflow

You can run CareerHunter as a scheduled sidecar in Antigravity or execute on command:
- Say: *"Check today's job digest and show me high-match React roles"*
- Say: *"Apply to job #1 using the direct link"*
- Say: *"Draft a cold email to the recruiter at Stripe"*
