import axios from 'axios';
import { StoreService } from './store.service.js';
import { AuthService } from './auth.service.js';
import { AutomationService } from './automation.service.js';
import { CompanyDossierService } from './companyDossier.service.js';
import { CoverLetterService } from './coverLetter.service.js';
import { OutreachSequenceService } from './outreachSequence.service.js';
import { ProposalService } from './proposal.service.js';
import { AnalyticsService } from './analytics.service.js';
import { HrAuditService } from './hrAudit.service.js';
import { InterviewAiService } from './interviewAi.service.js';
import { Job, Gig, UserAccount } from '../types.js';

export class TelegramBotService {
  private static isPolling = false;
  private static lastUpdateId = 0;
  private static pollingTimeout: NodeJS.Timeout | null = null;
  private static commandsConfigured = false;
  private static lastActiveMenuMap: Map<string, number> = new Map();
  private static activeCommandVersion: Map<string, number> = new Map();

  // Cancel any old command & its menu so only the new command is active
  public static cancelPreviousCommand(chatId: string | number): number {
    const key = String(chatId);
    const nextVer = (this.activeCommandVersion.get(key) || 0) + 1;
    this.activeCommandVersion.set(key, nextVer);

    // Cancel old active menu message by deleting it so stale outputs don't linger
    const oldMsgId = this.lastActiveMenuMap.get(key);
    if (oldMsgId) {
      this.deleteMessage(chatId, oldMsgId).catch(() => {});
      this.lastActiveMenuMap.delete(key);
    }
    return nextVer;
  }

  public static isCommandCancelled(chatId: string | number, version: number): boolean {
    const key = String(chatId);
    return this.activeCommandVersion.get(key) !== version;
  }

  private static getBotToken(): string {
    const auto = StoreService.getAutomation();
    return process.env.TELEGRAM_BOT_TOKEN || auto?.telegramBotToken || '';
  }

  private static getApiUrl(method: string): string {
    return `https://api.telegram.org/bot${this.getBotToken()}/${method}`;
  }

  // --- Core API Helpers ---
  public static async callApi(method: string, data: any) {
    try {
      const res = await axios.post(this.getApiUrl(method), data, { timeout: 15000 });
      return res.data;
    } catch (err: any) {
      console.error(`[TelegramBot] API error on ${method}:`, err.response?.data?.description || err.message);
      return null;
    }
  }

  public static async answerCallback(callbackQueryId: string, text?: string) {
    await this.callApi('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text: text || ''
    });
  }

  public static async deleteMessage(chatId: number | string, messageId: number) {
    return await this.callApi('deleteMessage', {
      chat_id: chatId,
      message_id: messageId
    });
  }

  public static async editMessage(chatId: number | string, messageId: number, text: string, replyMarkup?: any) {
    const key = String(chatId);
    this.lastActiveMenuMap.set(key, messageId);
    return await this.callApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: replyMarkup
    });
  }

  public static async sendMenu(chatId: number | string, text: string, replyMarkup?: any, replacePrevious = true) {
    const key = String(chatId);
    if (replacePrevious) {
      const oldMsgId = this.lastActiveMenuMap.get(key);
      if (oldMsgId) {
        await this.deleteMessage(chatId, oldMsgId).catch(() => {});
        this.lastActiveMenuMap.delete(key);
      }
    }

    const res = await this.callApi('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: replyMarkup
    });

    if (res?.result?.message_id) {
      this.lastActiveMenuMap.set(key, res.result.message_id);
    }
    return res;
  }

  // Clear Chat: deletes recent bot & user messages and resets to clean menu
  public static async clearChat(chatId: number | string, latestMessageId: number) {
    const deletePromises: Promise<any>[] = [];
    for (let i = 0; i < 25; i++) {
      const msgId = latestMessageId - i;
      if (msgId > 0) {
        deletePromises.push(this.deleteMessage(chatId, msgId));
      }
    }
    await Promise.allSettled(deletePromises);

    const user = AuthService.getUserByTelegramChatId(chatId);
    const isLoggedIn = !!user;

    const text = `🧹 <b>Chat Cleared & Screen Refreshed!</b>\n\n` +
      `<i>All previous message history has been wiped. Here is your pristine Executive Dashboard:</i>\n\n` +
      this.getMainMenuText(user);

    await this.sendMenu(chatId, text, this.getMainMenuMarkup(isLoggedIn));
  }

  // Set Telegram Native "/" Commands Menu
  public static async setBotCommands() {
    if (this.commandsConfigured) return;
    this.commandsConfigured = true;
    const commands = [
      { command: 'start', description: '🚀 Open Executive Main Menu' },
      { command: 'dashboard', description: '📊 Unified Executive Career Dashboard' },
      { command: 'chart', description: '📊 5-Phase Interview Preparatory Roadmap' },
      { command: 'clear', description: '🧹 Clear Chat & Refresh Screen' },
      { command: 'jobs', description: '💼 Browse All Verified Jobs' },
      { command: 'topjobs', description: '🔥 Top 3 Highest Match Jobs (95%+)' },
      { command: 'remote', description: '🏠 100% Remote / WFH Jobs' },
      { command: 'junior', description: '🎓 Early Career & Junior Roles (0-2 Yrs)' },
      { command: 'mnc', description: '🏛️ Big Tech & MNC Portals' },
      { command: 'search', description: '🔍 Search by Keyword: /search react' },
      { command: 'gigs', description: '💰 High-Payout WFH Side Gigs' },
      { command: 'tracker', description: '📋 Application Tracker & Ghosting' },
      { command: 'interview', description: '🎙️ STAR Behavioral & Tech Prep' },
      { command: 'ask', description: '💬 Ask Custom Question: /ask ...' },
      { command: 'audit', description: '📝 HR Resume Audit & ATS Bullets' },
      { command: 'skills', description: '🎯 Skill Gap Analysis & Resources' },
      { command: 'stats', description: '📈 Application Funnel Analytics' },
      { command: 'salary', description: '📊 Tech CTC & Salary Intel' },
      { command: 'alumni', description: '🎓 ABESEC Ghaziabad Alumni Referrals' },
      { command: 'calc', description: '🧮 In-Hand CTC Take-Home Calculator' },
      { command: 'dossier', description: '🏢 Company Reviews & Culture' },
      { command: 'profile', description: '👤 Candidate Profile & Credentials' },
      { command: 'login', description: '🔐 Login: /login email password' },
      { command: 'logout', description: '🚪 Log out from Telegram bot' },
      { command: 'help', description: '❓ Complete Command Guide' }
    ];
    await this.callApi('setMyCommands', { commands });
  }

  // --- Main Menu Views (Authenticated vs Guest) ---

  public static getMainMenuMarkup(isLoggedIn = true) {
    if (!isLoggedIn) {
      return {
        inline_keyboard: [
          [
            { text: '🔐 Login with Gmail & Password', callback_data: 'auth_login_prompt' }
          ],
          [
            { text: '📊 Executive Dashboard', callback_data: 'nav_dashboard' },
            { text: '💼 Browse Jobs (Guest Mode)', callback_data: 'nav_jobs_p_0' }
          ],
          [
            { text: '💰 Side Gigs', callback_data: 'nav_gigs' },
            { text: '📊 Salary Intel', callback_data: 'nav_salary' }
          ],
          [
            { text: '❓ Help & Commands', callback_data: 'nav_help' }
          ]
        ]
      };
    }

    return {
      inline_keyboard: [
        [
          { text: '📊 Executive Career Dashboard', callback_data: 'nav_dashboard' }
        ],
        [
          { text: '💼 Verified Jobs (ATS)', callback_data: 'nav_jobs_p_0' },
          { text: '🏛️ Big Tech MNCs', callback_data: 'nav_mnc' }
        ],
        [
          { text: '🔥 Top 3 Matches (95%+)', callback_data: 'nav_topjobs' },
          { text: '🏠 100% Remote Roles', callback_data: 'nav_remote' }
        ],
        [
          { text: '💰 WFH Side Gigs', callback_data: 'nav_gigs' },
          { text: '📊 Salary Intelligence', callback_data: 'nav_salary' }
        ],
        [
          { text: '🏢 Company Dossiers', callback_data: 'nav_dossiers' },
          { text: '🎓 ABESEC Alumni Search', callback_data: 'nav_alumni' }
        ],
        [
          { text: '📋 My Application Tracker', callback_data: 'nav_tracker' },
          { text: '🧮 In-Hand CTC Calculator', callback_data: 'nav_calc' }
        ],
        [
          { text: '🎯 Skill Gap Analyzer', callback_data: 'nav_skills' },
          { text: '🎙️ STAR Interview Prep', callback_data: 'nav_interview' }
        ],
        [
          { text: '🧹 Clear Chat', callback_data: 'nav_clear' },
          { text: '⚡ Scan Latest Openings', callback_data: 'nav_refresh' }
        ],
        [
          { text: '👤 My Profile & Account', callback_data: 'nav_profile' },
          { text: '🚪 Logout', callback_data: 'auth_logout' }
        ]
      ]
    };
  }

  public static getMainMenuText(user?: UserAccount | null) {
    if (!user) {
      return `🚀 <b>CareerHunter Executive Bot</b>\n` +
        `🔒 <b>Status:</b> <i>Not Authenticated</i>\n\n` +
        `Welcome! Please log in with your Gmail and password to unlock personalized resume scoring, ABESEC alumni networks, and direct application tracking:\n\n` +
        `👉 <b>To Log In, send:</b>\n<code>/login your-email@gmail.com your-password</code>`;
    }

    return `🚀 <b>CareerHunter Executive Portal</b>\n` +
      `🟢 <b>Authenticated Candidate:</b> <b>${user.name}</b>\n` +
      `🎓 <b>College:</b> <b>${user.collegeName}</b>\n` +
      `💼 <b>Role:</b> Full Stack Engineer\n\n` +
      `<i>Tap any module below to browse verified openings, inspect detailed CTC & descriptions, review HR ATS roast bullets, prepare STAR interview answers, or search ABESEC alumni!</i>`;
  }

  // --- Sub-View: Unified Executive Career Dashboard ---
  public static getDashboardContent(user?: UserAccount | null) {
    const jobs = StoreService.getCachedJobs();
    const gigs = StoreService.getCachedGigs();
    const apps = StoreService.getApplications();
    const profile = StoreService.getProfile();
    const candName = user?.name || profile.name || 'Yasharth Singhal';
    const college = user?.collegeName || profile.collegeName || 'ABES Engineering College (ABESEC)';

    const highMatchCount = jobs.filter(j => j.matchScore >= 90).length;
    const remoteCount = jobs.filter(j => j.isRemote || j.workplaceType === 'remote').length;
    const interviewingCount = apps.filter(a => a.status === 'interviewing').length;

    const topJob = [...jobs].sort((a, b) => b.matchScore - a.matchScore)[0];
    const topJobIdx = topJob ? jobs.findIndex(j => j.id === topJob.id) : 0;

    let text = `📊 <b>Executive Career & Intelligence Dashboard</b>\n\n`;
    text += `👤 <b>Candidate:</b> <b>${candName}</b>\n`;
    text += `🎓 <b>Institution:</b> ${college} (MCA 2026)\n`;
    text += `💼 <b>Target Role:</b> Full Stack Engineer\n`;
    text += `📱 <b>Session Sync:</b> 🟢 Active Web & Telegram Synchronized\n\n`;

    text += `📈 <b>Live Pipeline Analytics:</b>\n`;
    text += `• 🌐 <b>Verified Portals Scanned:</b> <b>${jobs.length.toLocaleString()}</b> openings\n`;
    text += `• 🔥 <b>High-Match Opportunities (&gt;90%):</b> <b>${highMatchCount}</b>\n`;
    text += `• 🏠 <b>100% Remote Roles:</b> <b>${remoteCount}</b>\n`;
    text += `• 💰 <b>Curated WFH Gigs:</b> <b>${gigs.length}</b>\n`;
    text += `• 📋 <b>Active Applications Tracked:</b> <b>${apps.length}</b>\n`;
    text += `• 🎙️ <b>Active Interview Loops:</b> <b>${interviewingCount}</b>\n\n`;

    if (topJob) {
      text += `⭐ <b>Top Recommended Role for You:</b>\n`;
      text += `👉 <b>${topJob.title}</b> at <b>${topJob.company}</b>\n`;
      text += `   🎯 Match: <b>${topJob.matchScore}%</b> • 💰 ${topJob.salary || 'Competitive'}\n`;
      text += `   🔗 <b>Direct Apply:</b> <a href="${topJob.directApplyUrl}">Open Official Portal ↗️</a>\n\n`;
    }

    text += `💡 <i>Tap any quick button below to jump into direct applications, interview simulation, or salary intel:</i>`;

    const keyboard = [
      [
        { text: `👀 View Top Job (${topJob?.company || 'Top'})`, callback_data: `job_view_${topJobIdx}` },
        { text: '🌐 1-Click Apply ↗️', url: topJob?.directApplyUrl || 'https://google.com' }
      ],
      [
        { text: '🔥 Top Matches (95%+)', callback_data: 'nav_topjobs' },
        { text: '🏠 100% Remote', callback_data: 'nav_remote_p_0' }
      ],
      [
        { text: '💼 Verified Jobs (ATS)', callback_data: 'nav_jobs_p_0' },
        { text: '💰 WFH Gigs', callback_data: 'nav_gigs_p_0' }
      ],
      [
        { text: '🎙️ STAR Interview Prep', callback_data: 'nav_interview' },
        { text: '💬 Ask Question', callback_data: 'nav_inter_custom_prompt' }
      ],
      [
        { text: '📋 Application Tracker', callback_data: 'nav_tracker' },
        { text: '🧮 CTC Calculator', callback_data: 'nav_calc' }
      ],
      [
        { text: '⚡ Scan Live Openings', callback_data: 'nav_refresh' },
        { text: '⬅️ Main Menu', callback_data: 'nav_main' }
      ]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Top 3 Jobs (Highest Match) ---
  public static getTopJobsContent() {
    const jobs = StoreService.getCachedJobs();
    const sorted = [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

    let text = `🔥 <b>Top 3 Highest-Match Opportunities for Your Profile:</b>\n\n`;

    const keyboard: any[] = [];
    sorted.forEach((j, i) => {
      text += `<b>${i + 1}. ${j.title}</b> at <b>${j.company}</b>\n`;
      text += `   🎯 Fit Score: <b>${j.matchScore}%</b> • 💰 ${j.salary || 'Competitive'}\n`;
      text += `   📍 ${j.location} • 🏛️ Portal: [${j.source.toUpperCase()}]\n`;
      text += `   🔗 <b>Direct Apply:</b> <a href="${j.directApplyUrl}">Official ${j.company} Portal ↗️</a>\n\n`;

      const globalIdx = jobs.findIndex(x => x.id === j.id);
      keyboard.push([
        {
          text: `👀 #${i + 1} ${j.company} (${j.matchScore}%)`,
          callback_data: `job_view_${globalIdx !== -1 ? globalIdx : 0}`
        },
        {
          text: '🌐 Apply ↗️',
          url: j.directApplyUrl
        }
      ]);
    });

    keyboard.push([
      { text: '💼 View All Jobs', callback_data: 'nav_jobs_p_0' },
      { text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }
    ]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Remote Jobs Only (Paginated) ---
  public static getRemoteJobsContent(page = 0) {
    const jobs = StoreService.getCachedJobs();
    const remote = jobs.filter(j => j.isRemote || j.workplaceType === 'remote');
    const pageSize = 5;
    const totalPages = Math.ceil(remote.length / pageSize) || 1;
    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const startIdx = safePage * pageSize;
    const visible = remote.slice(startIdx, startIdx + pageSize);

    let text = `🏠 <b>100% Verified Remote / Work-From-Home Openings:</b>\n`;
    text += `<i>Page ${safePage + 1} of ${totalPages} • Total: ${remote.length} remote vacancies available</i>\n`;
    text += `<i>Tap Details for ATS audit & interview prep, or tap Apply to open official job portal:</i>\n\n`;

    const keyboard: any[] = [];
    visible.forEach((j, i) => {
      const itemNum = startIdx + i + 1;
      text += `${itemNum}. <b>${j.title}</b> at <b>${j.company}</b>\n`;
      text += `   💰 ${j.salary || 'Competitive'} • 🎯 Match: <b>${j.matchScore}%</b>\n`;
      text += `   🔗 <b>Direct Apply:</b> <a href="${j.directApplyUrl}">Apply on ${j.company} ↗️</a>\n\n`;

      const globalIdx = jobs.findIndex(x => x.id === j.id);
      keyboard.push([
        {
          text: `👀 ${j.company} - ${j.title.slice(0, 18)}...`,
          callback_data: `job_view_${globalIdx !== -1 ? globalIdx : 0}`
        },
        {
          text: '🌐 Apply ↗️',
          url: j.directApplyUrl
        }
      ]);
    });

    const navRow: any[] = [];
    if (safePage > 0) {
      navRow.push({ text: '⬅️ Prev Page', callback_data: `nav_remote_p_${safePage - 1}` });
    }
    if (safePage < totalPages - 1) {
      navRow.push({ text: 'Next Page ➡️', callback_data: `nav_remote_p_${safePage + 1}` });
    }
    if (navRow.length > 0) {
      keyboard.push(navRow);
    }

    keyboard.push([
      { text: '💼 Browse All Jobs', callback_data: 'nav_jobs_p_0' },
      { text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }
    ]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: MNCs & Big Tech (Paginated) ---
  public static getMncJobsContent(page = 0) {
    const jobs = StoreService.getCachedJobs();
    const mncList = ['google', 'microsoft', 'amazon', 'stripe', 'tcs', 'infosys', 'swiggy', 'flipkart'];
    const mncs = jobs.filter(j => 
      j.source === 'mnc' || mncList.some(m => j.company.toLowerCase().includes(m))
    );
    const pageSize = 5;
    const totalPages = Math.ceil(mncs.length / pageSize) || 1;
    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const startIdx = safePage * pageSize;
    const visible = mncs.slice(startIdx, startIdx + pageSize);

    let text = `🏛️ <b>Big Tech & MNC Verified Careers:</b>\n`;
    text += `<i>Page ${safePage + 1} of ${totalPages} • Total: ${mncs.length} MNC vacancies available</i>\n`;
    text += `<i>Direct official career portals (Workday, Microsoft, Google, TCS, Amazon):</i>\n\n`;

    const keyboard: any[] = [];
    visible.forEach((j, i) => {
      const itemNum = startIdx + i + 1;
      text += `${itemNum}. <b>${j.title}</b> at <b>${j.company}</b>\n`;
      text += `   💰 ${j.salary || 'Competitive'} • 🎯 Match: <b>${j.matchScore}%</b>\n`;
      text += `   🔗 <b>Direct Apply:</b> <a href="${j.directApplyUrl}">Official Career Portal ↗️</a>\n\n`;

      const globalIdx = jobs.findIndex(x => x.id === j.id);
      keyboard.push([
        {
          text: `👀 ${j.company} - ${j.title.slice(0, 18)}...`,
          callback_data: `job_view_${globalIdx !== -1 ? globalIdx : 0}`
        },
        {
          text: '🌐 Apply ↗️',
          url: j.directApplyUrl
        }
      ]);
    });

    const navRow: any[] = [];
    if (safePage > 0) {
      navRow.push({ text: '⬅️ Prev Page', callback_data: `nav_mnc_p_${safePage - 1}` });
    }
    if (safePage < totalPages - 1) {
      navRow.push({ text: 'Next Page ➡️', callback_data: `nav_mnc_p_${safePage + 1}` });
    }
    if (navRow.length > 0) {
      keyboard.push(navRow);
    }

    keyboard.push([
      { text: '💼 Browse All Jobs', callback_data: 'nav_jobs_p_0' },
      { text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }
    ]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Search by Keyword (Paginated) ---
  public static searchJobsContent(query: string, page = 0) {
    const jobs = StoreService.getCachedJobs();
    const cleanQ = query.trim().toLowerCase();

    const matches = jobs.filter(j => 
      j.title.toLowerCase().includes(cleanQ) ||
      j.company.toLowerCase().includes(cleanQ) ||
      (j.requirements && j.requirements.some(r => r.toLowerCase().includes(cleanQ)))
    );

    let text = `🔍 <b>Search Results for "<code>${query}</code>":</b>\n`;

    if (matches.length === 0) {
      text += `\n<i>No matching jobs found for "${query}". Try searching for:</i>\n` +
        `• <code>/search react</code>\n` +
        `• <code>/search node</code>\n` +
        `• <code>/search python</code>\n` +
        `• <code>/search frontend</code>\n\n`;
      return {
        text,
        markup: { inline_keyboard: [[{ text: '💼 Browse All Jobs', callback_data: 'nav_jobs_p_0' }]] }
      };
    }

    const pageSize = 5;
    const totalPages = Math.ceil(matches.length / pageSize) || 1;
    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const startIdx = safePage * pageSize;
    const visible = matches.slice(startIdx, startIdx + pageSize);

    text += `<i>Page ${safePage + 1} of ${totalPages} • Total: ${matches.length} matching openings</i>\n\n`;

    const keyboard: any[] = [];
    visible.forEach((j, i) => {
      const itemNum = startIdx + i + 1;
      text += `${itemNum}. <b>${j.title}</b> at <b>${j.company}</b>\n`;
      text += `   💰 ${j.salary || 'Competitive'} • 🎯 Match: <b>${j.matchScore}%</b>\n`;
      text += `   🔗 <b>Direct Apply:</b> <a href="${j.directApplyUrl}">Official Career Portal ↗️</a>\n\n`;

      const globalIdx = jobs.findIndex(x => x.id === j.id);
      keyboard.push([
        {
          text: `👀 ${j.company} - ${j.title.slice(0, 18)}...`,
          callback_data: `job_view_${globalIdx !== -1 ? globalIdx : 0}`
        },
        {
          text: '🌐 Apply ↗️',
          url: j.directApplyUrl
        }
      ]);
    });

    const navRow: any[] = [];
    const encodedQ = encodeURIComponent(query);
    if (safePage > 0) {
      navRow.push({ text: '⬅️ Prev Page', callback_data: `nav_search_p_${safePage - 1}_${encodedQ}` });
    }
    if (safePage < totalPages - 1) {
      navRow.push({ text: 'Next Page ➡️', callback_data: `nav_search_p_${safePage + 1}_${encodedQ}` });
    }
    if (navRow.length > 0) {
      keyboard.push(navRow);
    }

    keyboard.push([
      { text: '💼 All Jobs', callback_data: 'nav_jobs_p_0' },
      { text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }
    ]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Skill Gap Analysis ---
  public static getSkillsAnalysisContent() {
    const jobs = StoreService.getCachedJobs();
    const profile = StoreService.getProfile();
    const analysis = AnalyticsService.getSkillGapAnalysis(jobs, profile);

    let text = `🎯 <b>Skill Gap Analysis for Yasharth Singhal:</b>\n\n`;
    text += `✅ <b>Top Skills on Your Resume:</b>\n`;
    profile.coreSkills.slice(0, 6).forEach(s => text += `• ${s}\n`);

    text += `\n⚠️ <b>Top Missing Skills Found Across Active Job Postings:</b>\n`;
    analysis.missingCriticalSkills.slice(0, 4).forEach(ms => {
      text += `• <code>${ms}</code>\n`;
    });

    text += `\n📈 <b>Trending High-Demand Technologies:</b>\n`;
    analysis.marketTrendingHeatmap.slice(0, 3).forEach(t => {
      text += `• <b>${t.technology}</b> (${t.category}) — Growth: <b>${t.growthMoM}</b> [${t.status}]\n`;
    });

    const keyboard = [
      [{ text: '💼 Matching Jobs', callback_data: 'nav_jobs_p_0' }],
      [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Application Funnel Stats ---
  public static getStatsContent() {
    const jobs = StoreService.getCachedJobs();
    const applications = StoreService.getApplications();
    const stats = AnalyticsService.getFunnelAnalytics(jobs, applications);

    let text = `📈 <b>Executive Application Funnel Analytics:</b>\n\n`;
    text += `• <b>Total Discovered Portals:</b> ${stats.totalDiscovered}\n`;
    text += `• <b>Bookmarked:</b> ${stats.totalBookmarked}\n`;
    text += `• <b>Will Apply Queue:</b> ${stats.totalWillApply}\n`;
    text += `• <b>Applied & Submitted:</b> <b>${stats.totalApplied}</b>\n`;
    text += `• <b>Active Interviews:</b> <b>${stats.totalInterviewing}</b>\n`;
    text += `• <b>Offers Received:</b> <b>${stats.totalOffers}</b>\n`;
    text += `• <b>Applied ➡️ Interview Conversion:</b> <b>${stats.conversionRateAppliedToInterview.toFixed(1)}%</b>\n\n`;
    text += `<i>${stats.weeklySummaryReport}</i>`;

    const keyboard = [
      [{ text: '📋 View Tracker', callback_data: 'nav_tracker' }],
      [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: User Profile ---
  public static getUserProfileContent(user?: UserAccount | null) {
    const profile = StoreService.getProfile();
    const apps = StoreService.getApplications();

    if (!user) {
      return {
        text: `👤 <b>My Profile & Account Status</b>\n\n` +
          `🔒 <b>Status:</b> <i>Not Logged In</i>\n\n` +
          `Send: <code>/login your-email@gmail.com your-password</code> to sign in!`,
        markup: {
          inline_keyboard: [
            [{ text: '🔐 Log In', callback_data: 'auth_login_prompt' }],
            [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
          ]
        }
      };
    }

    const rawPhone = user.phone || profile.phone || '9720277774';
    const maskedPhone = rawPhone.length >= 10 ? rawPhone.slice(0, 3) + '*****' + rawPhone.slice(-2) : rawPhone;

    let text = `👤 <b>Executive Candidate Profile:</b>\n\n`;
    text += `• <b>Name:</b> ${user.name}\n`;
    text += `• <b>Role:</b> Full Stack Engineer\n`;
    text += `• <b>Email:</b> <code>${user.email}</code>\n`;
    text += `• <b>Phone:</b> ${maskedPhone}\n`;
    text += `• <b>College:</b> ${user.collegeName}\n`;
    text += `• <b>Target Roles:</b> ${(profile.targetRoles || []).join(', ')}\n`;
    text += `• <b>Core Stack:</b> ${(profile.coreSkills || []).slice(0, 6).join(', ')}\n`;
    text += `• <b>Applications Tracked:</b> ${apps.length} active\n`;
    text += `• <b>Telegram Account:</b> Linked (@${user.telegramUsername || 'User'})\n\n`;
    text += `<i>Your web and mobile sessions are fully synced.</i>`;

    const keyboard = [
      [{ text: '📋 View Application Tracker', callback_data: 'nav_tracker' }],
      [{ text: '💼 Browse Matching Jobs', callback_data: 'nav_jobs_p_0' }],
      [{ text: '🚪 Log Out of Telegram', callback_data: 'auth_logout' }],
      [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Help & Command Center ---
  public static getHelpContent() {
    let text = `❓ <b>CareerHunter Bot Command Center:</b>\n\n`;
    text += `<b>Available Commands:</b>\n`;
    text += `• <code>/start</code> — Open executive main menu\n`;
    text += `• <code>/dashboard</code> — 📊 Unified Executive Career Dashboard\n`;
    text += `• <code>/clear</code> — 🧹 Wipe chat & refresh to clean dashboard\n`;
    text += `• <code>/topjobs</code> — 🔥 Top 3 highest match opportunities\n`;
    text += `• <code>/remote</code> — 🏠 100% Remote / WFH Software Engineer jobs\n`;
    text += `• <code>/mnc</code> — 🏛️ Big Tech & MNC Portals (Google, MSFT, Amazon)\n`;
    text += `• <code>/search keyword</code> — 🔍 Search jobs by keyword (e.g. /search react)\n`;
    text += `• <code>/jobs</code> — 💼 Browse verified direct ATS & MNC jobs\n`;
    text += `• <code>/gigs</code> — 💰 High-payout WFH side gigs & pitches\n`;
    text += `• <code>/tracker</code> — 📋 Applied jobs & ghosting risk meter\n`;
    text += `• <code>/interview</code> — 🎙️ STAR Behavioral Q&A & Tech answer key\n`;
    text += `• <code>/ask question</code> — 💬 Ask ANY custom technical or behavioral question\n`;
    text += `• 🎙️ <b>Voice Chat:</b> Hold the mic button in Telegram to ask questions by voice!\n`;
    text += `• <code>/setgemini key</code> — 🔑 Link free Google Gemini key for live AI\n`;
    text += `• <code>/audit</code> — 📝 HR Resume ATS Roast & Google XYZ bullets\n`;
    text += `• <code>/skills</code> — 🎯 Skill gap analysis & documentation\n`;
    text += `• <code>/stats</code> — 📈 Application funnel conversion rates\n`;
    text += `• <code>/salary</code> — 📊 Tech compensation benchmarks across cities\n`;
    text += `• <code>/alumni</code> — 🎓 ABESEC Ghaziabad LinkedIn alumni referral queries\n`;
    text += `• <code>/calc</code> — 🧮 In-hand CTC monthly take-home calculator\n`;
    text += `• <code>/dossier</code> — 🏢 Glassdoor culture & interview difficulty\n`;
    text += `• <code>/profile</code> — 👤 View your profile & credentials\n`;
    text += `• <code>/login email pass</code> — 🔐 Link your account securely\n`;
    text += `• <code>/logout</code> — 🚪 Disconnect your Telegram session\n\n`;
    text += `💡 <i>Tip: You can use the inline buttons on any screen to navigate back and forth without typing!</i>`;

    const keyboard = [
      [{ text: '💼 Browse Jobs Now', callback_data: 'nav_jobs_p_0' }],
      [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Paginated Jobs List Navigation ---
  public static getJobsListContent(page = 0) {
    const jobs = StoreService.getCachedJobs();
    const pageSize = 5;
    const totalPages = Math.ceil(jobs.length / pageSize) || 1;
    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const startIdx = safePage * pageSize;
    const visible = jobs.slice(startIdx, startIdx + pageSize);

    let text = `💼 <b>Verified Direct ATS & MNC Openings:</b> (Page ${safePage + 1}/${totalPages})\n`;
    text += `<i>Total: ${jobs.length} verified vacancies. Tap Details for ATS audit & interview prep, or tap Apply to open official portal:</i>\n\n`;

    const keyboard: any[] = [];

    visible.forEach((j, i) => {
      const globalIdx = startIdx + i;
      text += `${globalIdx + 1}. <b>${j.title}</b> at <b>${j.company}</b>\n`;
      text += `   💰 ${j.salary || 'Competitive'} • 📍 ${j.location}\n`;
      text += `   🎯 Match Fit: <b>${j.matchScore}%</b> • 🏛️ [${j.source.toUpperCase()}]\n`;
      text += `   🔗 <b>Direct Apply:</b> <a href="${j.directApplyUrl}">Apply on ${j.company} ↗️</a>\n\n`;

      keyboard.push([
        {
          text: `👀 ${j.company} - ${j.title.slice(0, 18)}...`,
          callback_data: `job_view_${globalIdx}`
        },
        {
          text: '🌐 Apply ↗️',
          url: j.directApplyUrl
        }
      ]);
    });

    const navRow: any[] = [];
    if (safePage > 0) {
      navRow.push({ text: '⬅️ Prev Page', callback_data: `nav_jobs_p_${safePage - 1}` });
    }
    if (safePage < totalPages - 1) {
      navRow.push({ text: 'Next Page ➡️', callback_data: `nav_jobs_p_${safePage + 1}` });
    }
    if (navRow.length > 0) {
      keyboard.push(navRow);
    }

    keyboard.push([
      { text: '⚡ Refresh Listings', callback_data: 'nav_refresh' },
      { text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }
    ]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Single Job Details View ---
  public static getJobDetailContent(jobIdx: number) {
    const jobs = StoreService.getCachedJobs();
    const job = jobs[jobIdx] || jobs[0];

    if (!job) {
      return {
        text: 'Job not found.',
        markup: { inline_keyboard: [[{ text: '⬅️ Back to Jobs List', callback_data: 'nav_jobs_p_0' }]] }
      };
    }

    let text = `💼 <b>${job.title}</b>\n`;
    text += `🏢 <b>Company:</b> ${job.company}\n`;
    text += `💰 <b>Salary / CTC:</b> ${job.salary || 'Competitive / Market Standard'}\n`;
    text += `📍 <b>Location:</b> ${job.location} (${job.workplaceType.toUpperCase()})\n`;
    text += `🎯 <b>ATS Resume Fit Score:</b> <b>${job.matchScore}%</b>\n`;
    text += `🏛️ <b>Verified Direct Portal:</b> ${job.source.toUpperCase()}\n`;
    text += `📅 <b>Posted:</b> ${job.postedAt || 'Recently'}\n\n`;
    text += `🔗 <b>Official Apply Link:</b> <a href="${job.directApplyUrl}">Click Here to Open Direct Application ↗️</a>\n\n`;

    text += `📝 <b>Role Responsibilities:</b>\n`;
    (job.responsibilities || []).slice(0, 3).forEach(r => {
      text += `• ${r}\n`;
    });

    text += `\n🛠️ <b>Core Requirements & Tech Stack:</b>\n`;
    (job.requirements || []).slice(0, 4).forEach(req => {
      text += `• ${req}\n`;
    });

    if (job.hrContact?.name) {
      text += `\n👤 <b>Hiring Recruiter:</b> ${job.hrContact.name} (${job.hrContact.role || 'HR / Talent Lead'})\n`;
    } else if (job.hiringTeam?.recruiterTitle) {
      text += `\n👤 <b>Recruiter Role:</b> ${job.hiringTeam.recruiterTitle}\n`;
    }

    const keyboard = [
      [
        { text: '🌐 1-Click Direct Apply (Official Portal) ↗️', url: job.directApplyUrl }
      ],
      [
        { text: '📊 Prep Roadmap Chart', callback_data: `job_chart_${jobIdx}` },
        { text: '🎙️ STAR Interview Prep', callback_data: `job_star_${jobIdx}` }
      ],
      [
        { text: '📝 HR Resume Audit & Bullets', callback_data: `job_audit_${jobIdx}` },
        { text: '✉️ Tailored Cover Letter', callback_data: `job_letter_${jobIdx}` }
      ],
      [
        { text: '🎓 ABESEC Referral', callback_data: `job_alumni_${jobIdx}` },
        { text: '🏢 Glassdoor & Culture', callback_data: `job_dossier_${jobIdx}_${encodeURIComponent(job.company)}` }
      ],
      [
        { text: '📬 3-Touch Outreach Cadence', callback_data: `job_cadence_${jobIdx}` },
        { text: '📌 Save to Tracker', callback_data: `job_track_${jobIdx}` }
      ],
      [
        { text: '⬅️ Back to Jobs List', callback_data: 'nav_jobs_p_0' }
      ]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Interview Preparatory Chart / Roadmap for Specific Job ---
  public static getJobPrepChartContent(jobIdx: number) {
    const jobs = StoreService.getCachedJobs();
    const job = jobs[jobIdx];
    if (!job) return this.getJobsListContent();

    const profile = StoreService.getProfile();
    const prep = job.interviewPrep || HrAuditService.generateInterviewHelper(job, profile);
    const keywords = (job.hrAudit?.criticalKeywordsToAdd && job.hrAudit.criticalKeywordsToAdd.length > 0)
      ? job.hrAudit.criticalKeywordsToAdd
      : job.requirements.slice(0, 4);

    let text = `📊 <b>Interview Preparatory Roadmap Chart: ${job.company}</b>\n\n`;
    text += `💼 <b>Role:</b> ${job.title} (${job.location})\n`;
    text += `🎯 <b>ATS Match Score:</b> <b>${job.matchScore}%</b> • 💰 ${job.salary || 'Competitive'}\n\n`;

    text += `🗓️ <b>Phase 1: Resume Calibration (Day 1)</b>\n`;
    text += `• Infiltrate keywords into your intro: <code>${keywords.slice(0, 3).join(', ')}</code>\n`;
    if (job.hrAudit?.resumeTweaks?.[0]) {
      text += `• Recommended bullet: <i>"${job.hrAudit.resumeTweaks[0].suggestedBullet}"</i>\n`;
    }

    text += `\n💻 <b>Phase 2: Technical Drills (Days 2-3)</b>\n`;
    if (prep.technicalQuestions?.[0]) {
      text += `• <b>Focus Question:</b> "${prep.technicalQuestions[0].question}"\n`;
      text += `• <b>Key:</b> <i>${prep.technicalQuestions[0].answerKey.slice(0, 140)}...</i>\n`;
    }

    text += `\n🏛️ <b>Phase 3: Architecture & Scaling (Days 4-5)</b>\n`;
    text += `• Focus: Redis cache-aside, PostgreSQL B-tree indexing, BullMQ distributed queues, and resilient API error middleware.\n`;

    text += `\n⭐ <b>Phase 4: STAR Behavioral Loop (Day 6)</b>\n`;
    if (prep.behavioralQuestions?.[0]) {
      text += `• <b>Scenario:</b> "${prep.behavioralQuestions[0].question}"\n`;
      text += `• <b>Strategy:</b> <i>${prep.behavioralQuestions[0].starStrategy}</i>\n`;
    }

    text += `\n❓ <b>Phase 5: Reverse Interview Round (Day 7)</b>\n`;
    if (prep.smartQuestionsToAskHr?.[0]) {
      text += `• <b>Ask Manager:</b> "${prep.smartQuestionsToAskHr[0]}"\n`;
    }

    const keyboard = [
      [
        { text: '🎙️ Launch STAR Interview Q&A', callback_data: `job_star_${jobIdx}_overview_0` },
        { text: '🌐 Direct Apply ↗️', url: job.directApplyUrl }
      ],
      [
        { text: '📝 HR Resume Audit', callback_data: `job_audit_${jobIdx}` },
        { text: '🎓 ABESEC Referral', callback_data: `job_alumni_${jobIdx}` }
      ],
      [
        { text: '⬅️ Back to Job Details', callback_data: `job_view_${jobIdx}` },
        { text: '💼 Back to Jobs List', callback_data: 'nav_jobs_p_0' }
      ]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: HR Resume Audit & ATS Roast ---
  public static getJobAuditContent(jobIdx: number) {
    const jobs = StoreService.getCachedJobs();
    const job = jobs[jobIdx];
    if (!job) return this.getJobsListContent();

    const audit = job.hrAudit;
    let text = `📝 <b>HR Resume Audit & ATS Roast for ${job.company}:</b>\n\n`;
    text += `🎯 <b>ATS Match Score:</b> <b>${audit?.atsScore || job.matchScore}%</b>\n`;
    text += `📋 <b>Recruiter Verdict:</b> ${audit?.verdict || 'Moderate Match (Needs Tweaks)'}\n\n`;

    text += `⚠️ <b>Critical Keywords to Add Before Submitting:</b>\n`;
    const keywords = (audit?.criticalKeywordsToAdd && audit.criticalKeywordsToAdd.length > 0)
      ? audit.criticalKeywordsToAdd
      : job.requirements.slice(0, 4);
    keywords.forEach(kw => {
      text += `• <code>${kw}</code>\n`;
    });

    text += `\n✨ <b>Google XYZ Formula Before & After Bullets:</b>\n`;
    (audit?.resumeTweaks || []).slice(0, 2).forEach(tweak => {
      text += `\n❌ <i>Weak/Generic:</i> "${tweak.currentAdvice}"\n`;
      text += `✅ <b>High-Impact:</b> "${tweak.suggestedBullet}"\n`;
    });

    if (audit?.recruiterRedFlags && audit.recruiterRedFlags.length > 0) {
      text += `\n🚩 <b>Red Flags to Avoid:</b>\n`;
      audit.recruiterRedFlags.slice(0, 2).forEach(rf => text += `• ${rf}\n`);
    }

    const keyboard = [
      [{ text: '⬅️ Back to Job Details', callback_data: `job_view_${jobIdx}` }],
      [{ text: '💼 Back to Jobs List', callback_data: 'nav_jobs_p_0' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Master Interview Prep Hub ---
  public static getInterviewHubContent() {
    const profile = StoreService.getProfile();
    let text = `🎙️ <b>AI Technical & STAR Interview Prep Center:</b>\n\n`;
    text += `Welcome <b>${profile.name}</b>! Master your Full-Stack engineering rounds, system design, and high-impact STAR behavioral answers.\n\n`;
    text += `<b>Available Practice Modules:</b>\n`;
    text += `• 💡 <b>Technical Round Q&A:</b> 5 core full-stack topics (React re-render profiling, Node.js REST API security, Distributed message queues, DB indexing, Web security).\n`;
    text += `• ⭐ <b>STAR Behavioral Scenarios:</b> Model answers for handling roadblocks, tight deadlines & fast technology acquisition.\n`;
    text += `• 🏛️ <b>Big Tech Interview Loops:</b> Google, Microsoft, Amazon, TCS & Stripe interview stages & difficulty ratings.\n`;
    text += `• ❓ <b>Smart Questions to Ask HR:</b> Reverse-interview questions to stand out at the end of each round.\n\n`;
    text += `<i>Tap an option below to start your interview simulation:</i>`;

    const keyboard = [
      [
        { text: '💬 Ask Custom Question', callback_data: 'nav_inter_custom_prompt' },
        { text: '🎙️ Send Voice Note', callback_data: 'nav_inter_voice_prompt' }
      ],
      [
        { text: '💡 Technical Q&A (5 Topics)', callback_data: 'nav_inter_tech_0' },
        { text: '⭐ STAR Behavioral Q&A', callback_data: 'nav_inter_star_0' }
      ],
      [
        { text: '🏛️ Big Tech Interview Loops', callback_data: 'nav_inter_loops_google' },
        { text: '❓ Questions to Ask HR', callback_data: 'nav_inter_ask' }
      ],
      [
        { text: '💼 Practice on Top Job', callback_data: 'job_star_0_overview_0' },
        { text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }
      ]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Technical Round Q&A (Paginated 1 to 5) ---
  public static getInterviewTechContent(qIdx = 0) {
    const jobs = StoreService.getCachedJobs();
    const profile = StoreService.getProfile();
    const helper = jobs[0]?.interviewPrep || HrAuditService.generateInterviewHelper(jobs[0] || ({} as any), profile);
    const questions = helper.technicalQuestions || [];
    const total = questions.length || 5;
    const safeIdx = Math.max(0, Math.min(qIdx, total - 1));
    const q = questions[safeIdx];

    let text = `💡 <b>Technical Interview Question (${safeIdx + 1} of ${total}):</b>\n\n`;
    if (q) {
      text += `<b>Q:</b> <i>"${q.question}"</i>\n\n`;
      text += `🔑 <b>Model Answer Key:</b>\n${q.answerKey}\n\n`;
      text += `🎯 <b>What Evaluators Look For:</b>\n${q.whatHrLooksFor}\n`;
    }

    const keyboard: any[] = [];
    const navRow: any[] = [];
    if (safeIdx > 0) {
      navRow.push({ text: '⬅️ Prev Question', callback_data: `nav_inter_tech_${safeIdx - 1}` });
    }
    if (safeIdx < total - 1) {
      navRow.push({ text: 'Next Question ➡️', callback_data: `nav_inter_tech_${safeIdx + 1}` });
    }
    if (navRow.length > 0) keyboard.push(navRow);

    keyboard.push([
      { text: '⭐ Switch to STAR Behavioral', callback_data: 'nav_inter_star_0' },
      { text: '🎙️ Interview Hub', callback_data: 'nav_interview' }
    ]);
    keyboard.push([{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: STAR Behavioral Scenarios (Paginated 1 to 3) ---
  public static getInterviewStarContent(qIdx = 0) {
    const jobs = StoreService.getCachedJobs();
    const profile = StoreService.getProfile();
    const helper = jobs[0]?.interviewPrep || HrAuditService.generateInterviewHelper(jobs[0] || ({} as any), profile);
    const questions = helper.behavioralQuestions || [];
    const total = questions.length || 3;
    const safeIdx = Math.max(0, Math.min(qIdx, total - 1));
    const q = questions[safeIdx];

    let text = `⭐ <b>STAR Behavioral Interview Scenario (${safeIdx + 1} of ${total}):</b>\n\n`;
    if (q) {
      text += `<b>Q:</b> <i>"${q.question}"</i>\n\n`;
      text += `📐 <b>STAR Framework Strategy:</b>\n${q.starStrategy}\n\n`;
      text += `🗣️ <b>Sample Answer (Full-Stack Engineer):</b>\n<pre>${q.sampleAnswer}</pre>\n`;
    }

    const keyboard: any[] = [];
    const navRow: any[] = [];
    if (safeIdx > 0) {
      navRow.push({ text: '⬅️ Prev Scenario', callback_data: `nav_inter_star_${safeIdx - 1}` });
    }
    if (safeIdx < total - 1) {
      navRow.push({ text: 'Next Scenario ➡️', callback_data: `nav_inter_star_${safeIdx + 1}` });
    }
    if (navRow.length > 0) keyboard.push(navRow);

    keyboard.push([
      { text: '💡 Switch to Technical Q&A', callback_data: 'nav_inter_tech_0' },
      { text: '🎙️ Interview Hub', callback_data: 'nav_interview' }
    ]);
    keyboard.push([{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Big Tech Interview Loops & Stages ---
  public static getInterviewLoopsContent(companyKey = 'google') {
    const dossier = CompanyDossierService.getDossier(companyKey);
    const stages = dossier.cultureAndBehavior.interviewProcessStages || [];

    let text = `🏛️ <b>${dossier.companyName} Interview Loop & Difficulty:</b>\n\n`;
    text += `🎯 <b>Interview Difficulty:</b> <b>${dossier.cultureAndBehavior.interviewDifficulty}</b>\n`;
    text += `📈 <b>Employee Culture:</b> ${dossier.cultureAndBehavior.workCulture.slice(0, 180)}...\n\n`;
    text += `📋 <b>Typical Interview Rounds:</b>\n`;
    stages.forEach((stage, i) => {
      text += `<b>Round ${i + 1}:</b> ${stage}\n`;
    });

    const keyboard = [
      [
        { text: 'Google', callback_data: 'nav_inter_loops_google' },
        { text: 'Microsoft', callback_data: 'nav_inter_loops_microsoft' },
        { text: 'Amazon', callback_data: 'nav_inter_loops_amazon' }
      ],
      [
        { text: 'TCS', callback_data: 'nav_inter_loops_tcs' },
        { text: 'Stripe', callback_data: 'nav_inter_loops_stripe' },
        { text: 'Swiggy', callback_data: 'nav_inter_loops_swiggy' }
      ],
      [
        { text: '🎙️ Back to Interview Hub', callback_data: 'nav_interview' },
        { text: '⬅️ Main Menu', callback_data: 'nav_main' }
      ]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Questions to Ask Interviewer ---
  public static getInterviewAskContent() {
    const jobs = StoreService.getCachedJobs();
    const profile = StoreService.getProfile();
    const helper = jobs[0]?.interviewPrep || HrAuditService.generateInterviewHelper(jobs[0] || ({} as any), profile);
    const questions = helper.smartQuestionsToAskHr || [];

    let text = `❓ <b>Smart Questions to Ask Your Interviewer:</b>\n`;
    text += `<i>Never say "I don't have any questions". Asking insightful questions proves deep interest and seniority:</i>\n\n`;

    questions.forEach((q, i) => {
      text += `<b>${i + 1}.</b> <i>${q}</i>\n\n`;
    });

    const keyboard = [
      [
        { text: '💡 Technical Q&A', callback_data: 'nav_inter_tech_0' },
        { text: '⭐ STAR Behavioral Q&A', callback_data: 'nav_inter_star_0' }
      ],
      [
        { text: '🎙️ Back to Interview Hub', callback_data: 'nav_interview' },
        { text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }
      ]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: STAR Interview Prep for Specific Job ---
  public static getJobStarContent(jobIdx: number, mode: 'overview' | 'tech' | 'star' | 'ask' = 'overview', qIdx = 0) {
    const jobs = StoreService.getCachedJobs();
    const job = jobs[jobIdx];
    if (!job) return this.getJobsListContent();

    const profile = StoreService.getProfile();
    const prep = job.interviewPrep || HrAuditService.generateInterviewHelper(job, profile);

    let text = `🎙️ <b>Interview Preparation for ${job.company} (${job.title}):</b>\n\n`;

    const keyboard: any[] = [];

    if (mode === 'tech') {
      const questions = prep.technicalQuestions || [];
      const total = questions.length || 1;
      const safeIdx = Math.max(0, Math.min(qIdx, total - 1));
      const q = questions[safeIdx];

      text += `💡 <b>Technical Round Question (${safeIdx + 1}/${total}):</b>\n`;
      if (q) {
        text += `<b>Q:</b> "${q.question}"\n\n`;
        text += `🔑 <b>Answer Key:</b> <i>${q.answerKey}</i>\n\n`;
        text += `🎯 <b>What Evaluators Look For:</b> ${q.whatHrLooksFor}\n`;
      }

      const navRow: any[] = [];
      if (safeIdx > 0) {
        navRow.push({ text: '⬅️ Prev Q', callback_data: `job_star_${jobIdx}_tech_${safeIdx - 1}` });
      }
      if (safeIdx < total - 1) {
        navRow.push({ text: 'Next Q ➡️', callback_data: `job_star_${jobIdx}_tech_${safeIdx + 1}` });
      }
      if (navRow.length > 0) keyboard.push(navRow);
      keyboard.push([
        { text: '⭐ View STAR Behavioral', callback_data: `job_star_${jobIdx}_star_0` },
        { text: '📋 Back to Overview', callback_data: `job_star_${jobIdx}_overview_0` }
      ]);
    } else if (mode === 'star') {
      const questions = prep.behavioralQuestions || [];
      const total = questions.length || 1;
      const safeIdx = Math.max(0, Math.min(qIdx, total - 1));
      const q = questions[safeIdx];

      text += `⭐ <b>STAR Behavioral Question (${safeIdx + 1}/${total}):</b>\n`;
      if (q) {
        text += `<b>Q:</b> "${q.question}"\n\n`;
        text += `📐 <b>Strategy:</b> ${q.starStrategy}\n\n`;
        text += `🗣️ <b>Sample Answer:</b> <i>${q.sampleAnswer}</i>\n`;
      }

      const navRow: any[] = [];
      if (safeIdx > 0) {
        navRow.push({ text: '⬅️ Prev Q', callback_data: `job_star_${jobIdx}_star_${safeIdx - 1}` });
      }
      if (safeIdx < total - 1) {
        navRow.push({ text: 'Next Q ➡️', callback_data: `job_star_${jobIdx}_star_${safeIdx + 1}` });
      }
      if (navRow.length > 0) keyboard.push(navRow);
      keyboard.push([
        { text: '💡 View Technical Qs', callback_data: `job_star_${jobIdx}_tech_0` },
        { text: '📋 Back to Overview', callback_data: `job_star_${jobIdx}_overview_0` }
      ]);
    } else if (mode === 'ask') {
      text += `❓ <b>Smart Questions to Ask Interviewer at ${job.company}:</b>\n\n`;
      (prep.smartQuestionsToAskHr || []).forEach((q, i) => {
        text += `<b>${i + 1}.</b> <i>${q}</i>\n\n`;
      });
      keyboard.push([
        { text: '💡 Technical Qs', callback_data: `job_star_${jobIdx}_tech_0` },
        { text: '⭐ STAR Questions', callback_data: `job_star_${jobIdx}_star_0` }
      ]);
    } else {
      // Overview
      const techQ = prep.technicalQuestions?.[0];
      const starQ = prep.behavioralQuestions?.[0];

      if (techQ) {
        text += `💡 <b>Sample Technical Question:</b>\n"${techQ.question}"\n\n`;
      }
      if (starQ) {
        text += `⭐ <b>Sample Behavioral Scenario:</b>\n"${starQ.question}"\n\n`;
      }
      if (prep.smartQuestionsToAskHr?.[0]) {
        text += `❓ <b>Smart Reverse Question:</b>\n"${prep.smartQuestionsToAskHr[0]}"\n\n`;
      }

      keyboard.push([
        { text: '💡 Full Technical Q&A (5 Qs)', callback_data: `job_star_${jobIdx}_tech_0` },
        { text: '⭐ STAR Behavioral (3 Qs)', callback_data: `job_star_${jobIdx}_star_0` }
      ]);
      keyboard.push([
        { text: '❓ Questions to Ask Interviewer', callback_data: `job_star_${jobIdx}_ask_0` }
      ]);
    }

    keyboard.push([
      { text: '⬅️ Back to Job Details', callback_data: `job_view_${jobIdx}` },
      { text: '💼 Back to Jobs List', callback_data: 'nav_jobs_p_0' }
    ]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Tailored Cover Letter ---
  public static getJobCoverLetterContent(jobIdx: number) {
    const jobs = StoreService.getCachedJobs();
    const job = jobs[jobIdx];
    const profile = StoreService.getProfile();
    if (!job) return this.getJobsListContent();

    const coverLetter = CoverLetterService.generate(job, profile);

    let text = `✉️ <b>Tailored Cover Letter for ${job.company}:</b>\n\n`;
    text += `<pre>${coverLetter.letterText.slice(0, 950)}...</pre>\n`;

    const keyboard = [
      [{ text: '🌐 Apply with Letter on Portal', url: job.directApplyUrl }],
      [{ text: '⬅️ Back to Job Details', callback_data: `job_view_${jobIdx}` }],
      [{ text: '💼 Back to Jobs List', callback_data: 'nav_jobs_p_0' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: 3-Touch Recruiter Outreach Cadence ---
  public static getJobCadenceContent(jobIdx: number) {
    const jobs = StoreService.getCachedJobs();
    const job = jobs[jobIdx];
    const profile = StoreService.getProfile();
    if (!job) return this.getJobsListContent();

    const sequence = OutreachSequenceService.generate3TouchSequence(job, profile);

    let text = `📬 <b>3-Touch Recruiter Cadence for ${job.company}:</b>\n\n`;

    sequence.forEach((touch, i) => {
      text += `<b>Touch ${i + 1} • ${touch.dayLabel} (${touch.channel}):</b>\n`;
      if (touch.subject) text += `<b>Subject:</b> <code>${touch.subject}</code>\n`;
      text += `<pre>${touch.content.slice(0, 300)}...</pre>\n`;
      text += `<i>Strategy: ${touch.strategyNote}</i>\n\n`;
    });

    const keyboard = [
      [{ text: '⬅️ Back to Job Details', callback_data: `job_view_${jobIdx}` }],
      [{ text: '💼 Back to Jobs List', callback_data: 'nav_jobs_p_0' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Company Dossier ---
  public static getCompanyDossierContent(companyName: string, fromJobIdx?: number) {
    const dossier = CompanyDossierService.getDossier(companyName);

    let text = `🏢 <b>${dossier.companyName} Intelligence Dossier</b>\n`;
    text += `⭐ <b>Glassdoor Score:</b> <b>${dossier.rating.toFixed(1)} / 5.0</b> (${dossier.ratingsBreakdown.recommendToFriendPct}% recommend)\n`;
    text += `👥 <b>Size & HQ:</b> ${dossier.overview.size} • ${dossier.overview.headquarters}\n`;
    text += `💰 <b>Funding / Stage:</b> ${dossier.overview.fundingStage}\n`;
    text += `🎯 <b>Interview Difficulty:</b> ${dossier.cultureAndBehavior.interviewDifficulty}\n\n`;

    text += `👍 <b>Top Employee Pros:</b>\n`;
    dossier.employeeReviews.pros.slice(0, 2).forEach(p => text += `• ${p}\n`);

    text += `\n⚠️ <b>Employee Cons to Watch:</b>\n`;
    dossier.employeeReviews.cons.slice(0, 2).forEach(c => text += `• ${c}\n`);

    text += `\n🏛️ <b>Work Culture:</b>\n${dossier.cultureAndBehavior.workCulture.slice(0, 220)}...\n`;

    const keyboard: any[] = [];
    if (fromJobIdx !== undefined) {
      keyboard.push([{ text: '⬅️ Back to Job Details', callback_data: `job_view_${fromJobIdx}` }]);
    }
    keyboard.push(
      [{ text: '🏢 All Companies Directory', callback_data: 'nav_dossiers' }],
      [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
    );

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Company Directory ---
  public static getCompanyDirectoryContent() {
    const companies = ['Google', 'Microsoft', 'Amazon', 'Stripe', 'TCS', 'Infosys', 'Flipkart', 'Swiggy'];
    let text = `🏢 <b>Company Culture & Glassdoor Dossier Directory:</b>\n`;
    text += `<i>Inspect verified employee sentiment, interview difficulty loops, pros/cons, and work culture before applying:</i>\n\n`;

    const keyboard: any[] = [];
    for (let i = 0; i < companies.length; i += 2) {
      const row = [
        { text: `🏢 ${companies[i]}`, callback_data: `job_dossier_x_${encodeURIComponent(companies[i])}` }
      ];
      if (companies[i + 1]) {
        row.push({ text: `🏢 ${companies[i + 1]}`, callback_data: `job_dossier_x_${encodeURIComponent(companies[i + 1])}` });
      }
      keyboard.push(row);
    }
    keyboard.push([{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: ABESEC Alumni Search ---
  public static getAlumniReferralContent(jobIdx?: number) {
    const jobs = StoreService.getCachedJobs();
    const job = (jobIdx !== undefined ? jobs[jobIdx] : null) || jobs[0];

    const targetCompany = job?.company || 'Google / Microsoft / Amazon';
    const query = `site:linkedin.com/in ("ABES" OR "ABESEC" OR "ABES Engineering College") "${targetCompany}" ("Software" OR "Engineer" OR "Developer")`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    let text = `🎓 <b>ABESEC Ghaziabad Alumni & Referral Finder:</b>\n\n`;
    text += `🏢 Target Company: <b>${targetCompany}</b>\n`;
    text += `🎓 College: <b>ABES Engineering College (ABESEC), Ghaziabad</b>\n\n`;
    text += `💡 <b>Why ask for referrals?</b>\nEmployees receive ₹50k to ₹1.5 Lakh referral bonuses for hiring strong engineers, so fellow ABESEC alumni are actively eager to refer you!\n\n`;
    text += `📝 <b>Copyable Alumni Outreach Message:</b>\n`;
    text += `<pre>Hi [Name], saw you graduated from ABESEC and are now at ${targetCompany}! Inspiring to see fellow alumni doing great work there. I'm applying for the Software Engineer role—would you be open to sharing my resume internally? My portfolio: https://yasharth.dev</pre>`;

    const keyboard: any[] = [
      [{ text: '🔎 Search ABESEC Alumni on LinkedIn', url: searchUrl }]
    ];
    if (jobIdx !== undefined) {
      keyboard.push([{ text: '⬅️ Back to Job Details', callback_data: `job_view_${jobIdx}` }]);
    }
    keyboard.push([{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Action: Save Job to Tracker ---
  public static saveJobToTracker(jobIdx: number) {
    const jobs = StoreService.getCachedJobs();
    const job = jobs[jobIdx];

    if (!job) return this.getJobsListContent();

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 3);

    StoreService.addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      directApplyUrl: job.directApplyUrl,
      status: 'applied',
      appliedDate: new Date().toISOString(),
      type: 'full-time',
      salary: job.salary,
      notes: 'Applied via Telegram Executive Bot with tailored resume & cover letter.',
      coldEmailSent: false,
      followUpDue: followUpDate.toISOString(),
      followUpCount: 0
    });

    let text = `✅ <b>Saved to Application Tracker!</b>\n\n`;
    text += `💼 <b>Role:</b> ${job.title}\n`;
    text += `🏢 <b>Company:</b> ${job.company}\n`;
    text += `📅 <b>Follow-Up Due:</b> ${followUpDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} (Day 3)\n\n`;
    text += `<i>Your tracker now tracks stagnancy, ghosting risk, and follow-up reminders automatically.</i>`;

    const keyboard = [
      [{ text: '📋 View My Application Tracker', callback_data: 'nav_tracker' }],
      [{ text: '⬅️ Back to Job Details', callback_data: `job_view_${jobIdx}` }],
      [{ text: '💼 Back to Jobs List', callback_data: 'nav_jobs_p_0' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Application Tracker & Ghosting Risk ---
  public static getTrackerContent() {
    const applications = StoreService.getApplications();

    let text = `📋 <b>My Application Tracker & Ghosting Risk:</b>\n\n`;

    if (applications.length === 0) {
      text += `<i>No applications tracked yet. Open any job and tap "Save to Tracker" to track your applications and follow-up deadlines!</i>\n\n`;
    } else {
      applications.slice(0, 6).forEach((app, i) => {
        const days = Math.floor((Date.now() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24));
        const ghostingRisk = days > 14 ? 85 : days > 7 ? 50 : 15;
        const riskEmoji = ghostingRisk > 60 ? '🔴' : ghostingRisk > 30 ? '🟡' : '🟢';

        text += `${i + 1}. <b>${app.jobTitle}</b> at <b>${app.company}</b>\n`;
        text += `   Status: <b>${app.status.toUpperCase()}</b> • Applied: ${days} days ago\n`;
        text += `   ${riskEmoji} Ghosting Risk: <b>${ghostingRisk}%</b>\n\n`;
      });
    }

    const keyboard = [
      [{ text: '💼 Browse Jobs & Apply', callback_data: 'nav_jobs_p_0' }],
      [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: In-Hand CTC & Tax Calculator ---
  public static getCtcCalculatorContent(band = '25') {
    const ctcLakhs = parseInt(band, 10) || 25;
    const baseLakhs = Math.round(ctcLakhs * 0.70);
    const rsuLakhs = Math.round(ctcLakhs * 0.20);
    const bonusLakhs = Math.round(ctcLakhs * 0.10);

    const grossMonthly = (baseLakhs * 100000) / 12;
    const taxMonthly = baseLakhs > 15 ? grossMonthly * 0.18 : grossMonthly * 0.10;
    const inHandMonthly = Math.round(grossMonthly - taxMonthly);

    let text = `🧮 <b>In-Hand CTC & Indian New Tax Regime Calculator:</b>\n\n`;
    text += `💰 <b>Offered Total CTC:</b> <b>₹${ctcLakhs} Lakhs / annum</b>\n\n`;
    text += `• <b>Base Salary:</b> ₹${baseLakhs} Lakhs\n`;
    text += `• <b>RSU / ESOP Grant:</b> ₹${rsuLakhs} Lakhs / year\n`;
    text += `• <b>Performance Bonus:</b> ₹${bonusLakhs} Lakhs\n\n`;
    text += `💵 <b>Estimated In-Hand Monthly Take-Home:</b>\n`;
    text += `👉 <b>₹${inHandMonthly.toLocaleString('en-IN')} / month</b> (Post-tax)\n\n`;
    text += `<i>Calculated under Indian New Tax Regime FY 2025-26 with Standard Deduction. Select another offer band below:</i>`;

    const keyboard = [
      [
        { text: '₹12L CTC', callback_data: 'calc_b_12' },
        { text: '₹18L CTC', callback_data: 'calc_b_18' },
        { text: '₹25L CTC', callback_data: 'calc_b_25' }
      ],
      [
        { text: '₹35L CTC', callback_data: 'calc_b_35' },
        { text: '₹50L CTC', callback_data: 'calc_b_50' }
      ],
      [
        { text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }
      ]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: WFH Side Gigs (Paginated) ---
  public static getGigsListContent(page = 0) {
    const gigs = StoreService.getCachedGigs();
    const pageSize = 5;
    const totalPages = Math.ceil(gigs.length / pageSize) || 1;
    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const startIdx = safePage * pageSize;
    const visible = gigs.slice(startIdx, startIdx + pageSize);

    let text = `💰 <b>Verified Flexible WFH Side Gigs:</b>\n`;
    text += `<i>Page ${safePage + 1} of ${totalPages} • Total: ${gigs.length} high-payout gigs available</i>\n`;
    text += `<i>Tap Details for pitch generator, or tap Apply to open gig portal directly:</i>\n\n`;

    const keyboard: any[] = [];
    visible.forEach((g, i) => {
      const itemNum = startIdx + i + 1;
      const globalIdx = startIdx + i;
      text += `${itemNum}. <b>${g.title}</b> (${g.clientOrPlatform})\n`;
      text += `   💵 <b>${g.payout}</b> • ⏱ ${g.estimatedHours}\n`;
      text += `   🔗 <b>Direct Apply:</b> <a href="${g.directApplyUrl}">Open Gig Portal ↗️</a>\n\n`;

      keyboard.push([
        { 
          text: `👀 ${g.title.slice(0, 18)}... (${g.payout})`, 
          callback_data: `gig_view_${globalIdx}` 
        },
        {
          text: '🌐 Apply ↗️',
          url: g.directApplyUrl
        }
      ]);
    });

    const navRow: any[] = [];
    if (safePage > 0) {
      navRow.push({ text: '⬅️ Prev Page', callback_data: `nav_gigs_p_${safePage - 1}` });
    }
    if (safePage < totalPages - 1) {
      navRow.push({ text: 'Next Page ➡️', callback_data: `nav_gigs_p_${safePage + 1}` });
    }
    if (navRow.length > 0) {
      keyboard.push(navRow);
    }

    keyboard.push([{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]);

    return { text, markup: { inline_keyboard: keyboard } };
  }

  public static getGigDetailContent(gigIdx: number) {
    const gigs = StoreService.getCachedGigs();
    const gig = gigs[gigIdx] || gigs[0];
    const profile = StoreService.getProfile();

    if (!gig) return this.getGigsListContent();

    const proposal = ProposalService.generateProposal(gig, profile);

    let text = `💰 <b>${gig.title}</b>\n`;
    text += `🏢 <b>Client / Platform:</b> ${gig.clientOrPlatform}\n`;
    text += `💵 <b>Payout:</b> ${gig.payout}\n`;
    text += `⏱ <b>Estimated Time:</b> ${gig.estimatedHours}\n`;
    text += `🏷️ <b>Category:</b> ${gig.category.toUpperCase()}\n\n`;
    text += `🔗 <b>Direct Apply Link:</b> <a href="${gig.directApplyUrl}">Click Here to Apply on ${gig.clientOrPlatform} ↗️</a>\n\n`;

    text += `📝 <b>Description:</b>\n${gig.description}\n\n`;
    text += `✨ <b>Tailored Freelance Pitch:</b>\n<pre>${proposal.slice(0, 450)}...</pre>\n`;

    const keyboard = [
      [{ text: '🌐 1-Click Direct Apply on Gig Portal ↗️', url: gig.directApplyUrl }],
      [{ text: '⬅️ Back to Gigs List', callback_data: 'nav_gigs_p_0' }],
      [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Sub-View: Salary Intel ---
  public static getSalaryIntelContent() {
    const profile = StoreService.getProfile();
    const salary = AnalyticsService.getSalaryIntelligence(
      profile.targetRoles?.[0] || 'Software Engineer',
      profile.experienceLevel || 'Junior (1-2 yrs)'
    );

    let text = `📊 <b>Tech Compensation Benchmarks (India & Global USD):</b>\n\n`;
    text += `• <b>25th Percentile:</b> ${salary.p25INR}\n`;
    text += `• <b>Market Average:</b> <b>${salary.marketAvgINR}</b>\n`;
    text += `• <b>75th Percentile (Target):</b> <b>${salary.p75INR}</b>\n`;
    text += `• <b>90th Percentile:</b> ${salary.p90INR}\n`;
    text += `• <b>US Remote Equivalent:</b> ${salary.marketAvgUSD}\n\n`;

    text += `🏙️ <b>City-Wise Averages:</b>\n`;
    salary.topPayingCities.slice(0, 4).forEach(c => {
      text += `• <b>${c.city}:</b> ${c.avgSalary}\n`;
    });

    const keyboard = [
      [{ text: '💼 View Matching Jobs', callback_data: 'nav_jobs_p_0' }],
      [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
    ];

    return { text, markup: { inline_keyboard: keyboard } };
  }

  // --- Dispatcher: Handle Incoming Webhook Updates & Button Callbacks ---
  public static async handleUpdate(update: any) {
    if (!update) return;

    // 1. Handle Callback Button Taps
    if (update.callback_query) {
      const cb = update.callback_query;
      const data: string = cb.data;
      const chatId = cb.message.chat.id;
      const messageId = cb.message.message_id;

      await this.answerCallback(cb.id);

      const user = AuthService.getUserByTelegramChatId(chatId);
      const isLoggedIn = !!user;

      try {
        if (data === 'nav_main') {
          await this.editMessage(chatId, messageId, this.getMainMenuText(user), this.getMainMenuMarkup(isLoggedIn));
        } else if (data === 'nav_dashboard') {
          const { text, markup } = this.getDashboardContent(user);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_clear') {
          await this.clearChat(chatId, messageId);
        } else if (data === 'nav_topjobs') {
          const { text, markup } = this.getTopJobsContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('nav_remote_p_')) {
          const page = parseInt(data.replace('nav_remote_p_', ''), 10) || 0;
          const { text, markup } = this.getRemoteJobsContent(page);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_remote') {
          const { text, markup } = this.getRemoteJobsContent(0);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('nav_mnc_p_')) {
          const page = parseInt(data.replace('nav_mnc_p_', ''), 10) || 0;
          const { text, markup } = this.getMncJobsContent(page);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_mnc') {
          const { text, markup } = this.getMncJobsContent(0);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('nav_gigs_p_')) {
          const page = parseInt(data.replace('nav_gigs_p_', ''), 10) || 0;
          const { text, markup } = this.getGigsListContent(page);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_gigs') {
          const { text, markup } = this.getGigsListContent(0);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('nav_search_p_')) {
          const parts = data.replace('nav_search_p_', '').split('_');
          const page = parseInt(parts[0], 10) || 0;
          const query = decodeURIComponent(parts.slice(1).join('_'));
          const { text, markup } = this.searchJobsContent(query, page);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_skills') {
          const { text, markup } = this.getSkillsAnalysisContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_interview') {
          const { text, markup } = this.getInterviewHubContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('nav_inter_tech_')) {
          const qIdx = parseInt(data.replace('nav_inter_tech_', ''), 10) || 0;
          const { text, markup } = this.getInterviewTechContent(qIdx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('nav_inter_star_')) {
          const qIdx = parseInt(data.replace('nav_inter_star_', ''), 10) || 0;
          const { text, markup } = this.getInterviewStarContent(qIdx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('nav_inter_loops_')) {
          const comp = data.replace('nav_inter_loops_', '');
          const { text, markup } = this.getInterviewLoopsContent(comp);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_inter_ask') {
          const { text, markup } = this.getInterviewAskContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_inter_custom_prompt') {
          const text = `💬 <b>Ask Any Custom Interview Question:</b>\n\n` +
            `Type your question directly with the <code>/ask</code> command, for example:\n` +
            `• <code>/ask How does useEffect cleanup work?</code>\n` +
            `• <code>/ask Explain SQL vs NoSQL trade-offs</code>\n` +
            `• <code>/ask Tell me about a time you handled a tight deadline</code>\n` +
            `• <code>/ask Explain Kafka vs RabbitMQ message queues</code>\n\n` +
            `💡 <i>Our AI interviewer will break down the answer key, model verbal pitch, and evaluator expectations instantly!</i>`;
          const markup = {
            inline_keyboard: [
              [{ text: '🎙️ Send Voice Question Instead', callback_data: 'nav_inter_voice_prompt' }],
              [{ text: '🎙️ Back to Interview Hub', callback_data: 'nav_interview' }],
              [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
            ]
          };
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_inter_voice_prompt') {
          const text = `🎙️ <b>Voice Chat Interview Mode:</b>\n\n` +
            `You can speak directly to the bot using Telegram's microphone button!\n\n` +
            `<b>How it works:</b>\n` +
            `1. Hold down the 🎙️ <b>microphone icon</b> in Telegram.\n` +
            `2. Ask your technical or behavioral question aloud, or practice answering a prompt.\n` +
            `3. Release to send the voice note.\n` +
            `4. The bot listens, transcribes your speech, and delivers a Senior Interviewer feedback & answer key!\n\n` +
            `💡 <i>Tip: Powered by Google Gemini Multimodal Audio AI. Send <code>/setgemini YOUR_KEY</code> to enable or update your key anytime.</i>`;
          const markup = {
            inline_keyboard: [
              [{ text: '💬 Ask as Text Instead', callback_data: 'nav_inter_custom_prompt' }],
              [{ text: '🎙️ Back to Interview Hub', callback_data: 'nav_interview' }],
              [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
            ]
          };
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'auth_login_prompt') {
          const text = `🔐 <b>Login to CareerHunter:</b>\n\n` +
            `To securely link your account, reply with:\n` +
            `<code>/login your-email@gmail.com your-password</code>`;
          const markup = {
            inline_keyboard: [
              [{ text: '💼 Browse as Guest', callback_data: 'nav_jobs_p_0' }],
              [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
            ]
          };
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'auth_logout') {
          AuthService.logoutTelegram(chatId);
          const text = `🚪 <b>Logged Out Successfully</b>\n\nYour Telegram session has been disconnected.\n\nSend <code>/login your-email@gmail.com your-password</code> anytime to sign back in.`;
          const markup = {
            inline_keyboard: [
              [{ text: '🔐 Log In Again', callback_data: 'auth_login_prompt' }],
              [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
            ]
          };
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_profile') {
          const { text, markup } = this.getUserProfileContent(user);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_help') {
          const { text, markup } = this.getHelpContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('nav_jobs_p_')) {
          const page = parseInt(data.replace('nav_jobs_p_', ''), 10) || 0;
          const { text, markup } = this.getJobsListContent(page);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_jobs') {
          const { text, markup } = this.getJobsListContent(0);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_view_')) {
          const idx = parseInt(data.replace('job_view_', ''), 10);
          const { text, markup } = this.getJobDetailContent(idx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_chart_')) {
          const idx = parseInt(data.replace('job_chart_', ''), 10) || 0;
          const { text, markup } = this.getJobPrepChartContent(idx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_audit_')) {
          const idx = parseInt(data.replace('job_audit_', ''), 10);
          const { text, markup } = this.getJobAuditContent(idx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_star_')) {
          const parts = data.replace('job_star_', '').split('_');
          const idx = parseInt(parts[0], 10) || 0;
          const mode = (parts[1] as any) || 'overview';
          const qIdx = parseInt(parts[2], 10) || 0;
          const { text, markup } = this.getJobStarContent(idx, mode, qIdx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_letter_')) {
          const idx = parseInt(data.replace('job_letter_', ''), 10);
          const { text, markup } = this.getJobCoverLetterContent(idx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_cadence_')) {
          const idx = parseInt(data.replace('job_cadence_', ''), 10);
          const { text, markup } = this.getJobCadenceContent(idx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_alumni_')) {
          const idx = parseInt(data.replace('job_alumni_', ''), 10);
          const { text, markup } = this.getAlumniReferralContent(idx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_dossier_')) {
          const parts = data.replace('job_dossier_', '').split('_');
          const idxStr = parts[0];
          const comp = decodeURIComponent(parts.slice(1).join('_'));
          const fromJobIdx = idxStr !== 'x' ? parseInt(idxStr, 10) : undefined;
          const { text, markup } = this.getCompanyDossierContent(comp, fromJobIdx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('job_track_')) {
          const idx = parseInt(data.replace('job_track_', ''), 10);
          const { text, markup } = this.saveJobToTracker(idx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_tracker') {
          const { text, markup } = this.getTrackerContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_calc') {
          const { text, markup } = this.getCtcCalculatorContent('25');
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('calc_b_')) {
          const band = data.replace('calc_b_', '');
          const { text, markup } = this.getCtcCalculatorContent(band);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data.startsWith('gig_view_')) {
          const idx = parseInt(data.replace('gig_view_', ''), 10);
          const { text, markup } = this.getGigDetailContent(idx);
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_salary') {
          const { text, markup } = this.getSalaryIntelContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_alumni') {
          const { text, markup } = this.getAlumniReferralContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_dossiers') {
          const { text, markup } = this.getCompanyDirectoryContent();
          await this.editMessage(chatId, messageId, text, markup);
        } else if (data === 'nav_refresh') {
          const cmdVer = this.cancelPreviousCommand(chatId);
          await this.editMessage(chatId, messageId, '⚡ <i>Scanning live ATS portals for fresh openings...</i>');
          await AutomationService.executeDailyHarvest();
          if (this.isCommandCancelled(chatId, cmdVer)) return;
          const { text, markup } = this.getJobsListContent(0);
          await this.editMessage(chatId, messageId, text, markup);
        }
      } catch (err: any) {
        console.error('[TelegramBot] Callback processing error:', err.message);
      }
      return;
    }

    // 2. Handle Voice Notes (Audio Voice Chat)
    if (update.message?.voice) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const voice = msg.voice;

      this.cancelPreviousCommand(chatId);
      const loadingMsg = await this.callApi('sendMessage', {
        chat_id: chatId,
        text: `🎙️ <i>Listening to your voice note (${voice.duration}s) & analyzing with AI...</i>`,
        parse_mode: 'HTML'
      });

      try {
        const fileRes = await axios.get(this.getApiUrl('getFile'), {
          params: { file_id: voice.file_id }
        });

        const filePath = fileRes.data?.result?.file_path;
        if (filePath) {
          const fileUrl = `https://api.telegram.org/file/bot${this.getBotToken()}/${filePath}`;
          const audioRes = await axios.get(fileUrl, { responseType: 'arraybuffer' });
          const audioBuffer = Buffer.from(audioRes.data);

          const profile = StoreService.getProfile();
          const result = await InterviewAiService.processVoiceQuestion(audioBuffer, voice.mime_type || 'audio/ogg', profile);

          if (loadingMsg?.result?.message_id) {
            await this.deleteMessage(chatId, loadingMsg.result.message_id).catch(() => {});
          }

          const keyboard = [
            [{ text: '💬 Ask Another Question', callback_data: 'nav_inter_custom_prompt' }],
            [{ text: '🎙️ Interview Prep Hub', callback_data: 'nav_interview' }],
            [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
          ];
          await this.sendMenu(chatId, result.answer, { inline_keyboard: keyboard });
          return;
        }
      } catch (err: any) {
        if (loadingMsg?.result?.message_id) {
          await this.deleteMessage(chatId, loadingMsg.result.message_id).catch(() => {});
        }
        await this.sendMenu(chatId, `❌ <i>Could not process voice audio. You can ask directly as text:</i>\n<code>/ask Your question here</code>`);
      }
      return;
    }

    // 3. Handle Text Commands
    if (update.message?.text) {
      const msg = update.message;
      const rawText = msg.text.trim();
      const text = rawText.toLowerCase();
      const chatId = msg.chat.id;
      const messageId = msg.message_id;
      const username = msg.from?.username;

      const user = AuthService.getUserByTelegramChatId(chatId);
      const isLoggedIn = !!user;

      // New command given -> Cancel previous command & replace previous menu
      const cmdVer = this.cancelPreviousCommand(chatId);

      try {
        // Command: /dashboard or /dash
        if (text === '/dashboard' || text === '/dash') {
          const { text: dashText, markup } = this.getDashboardContent(user);
          await this.sendMenu(chatId, dashText, markup);
          return;
        }

        // Command: /clear or /clearchat
        if (text === '/clear' || text === '/clearchat') {
          await this.clearChat(chatId, messageId);
          return;
        }

        // Command: /topjobs or /top
        if (text === '/topjobs' || text === '/top') {
          const { text: topText, markup } = this.getTopJobsContent();
          await this.sendMenu(chatId, topText, markup);
          return;
        }

        // Command: /remote
        if (text === '/remote') {
          const { text: remText, markup } = this.getRemoteJobsContent();
          await this.sendMenu(chatId, remText, markup);
          return;
        }

        // Command: /mnc
        if (text === '/mnc') {
          const { text: mncText, markup } = this.getMncJobsContent();
          await this.sendMenu(chatId, mncText, markup);
          return;
        }

        // Command: /junior or /fresher
        if (text === '/junior' || text === '/fresher' || text === '/early') {
          const { text: jText, markup } = this.searchJobsContent('engineer');
          await this.sendMenu(chatId, `🎓 <b>Junior & Early Career Openings (0-2 Yrs):</b>\n\n` + jText, markup);
          return;
        }

        // Command: /search <keyword>
        if (text.startsWith('/search')) {
          const query = rawText.replace(/^\/search\s*/i, '').trim();
          if (!query) {
            await this.sendMenu(chatId, '🔍 <i>Please specify a keyword to search, e.g.:</i>\n<code>/search react</code>\n<code>/search node</code>\n<code>/search python</code>');
            return;
          }
          const { text: searchResultText, markup } = this.searchJobsContent(query);
          await this.sendMenu(chatId, searchResultText, markup);
          return;
        }

        // Command: /interview or /star
        if (text.startsWith('/interview') || text.startsWith('/star')) {
          const arg = rawText.replace(/^\/(interview|star)\s*/i, '').trim().toLowerCase();
          if (arg === 'tech' || arg === 'technical' || arg === 'react' || arg === 'node' || arg === 'dsa') {
            const { text: tText, markup } = this.getInterviewTechContent(0);
            await this.sendMenu(chatId, tText, markup);
          } else if (arg === 'behavioral' || arg === 'hr' || arg.includes('star')) {
            const { text: sText, markup } = this.getInterviewStarContent(0);
            await this.sendMenu(chatId, sText, markup);
          } else if (['google', 'microsoft', 'amazon', 'tcs', 'stripe', 'swiggy'].includes(arg)) {
            const { text: lText, markup } = this.getInterviewLoopsContent(arg);
            await this.sendMenu(chatId, lText, markup);
          } else if (arg === 'ask') {
            const { text: aText, markup } = this.getInterviewAskContent();
            await this.sendMenu(chatId, aText, markup);
          } else {
            const { text: hubText, markup } = this.getInterviewHubContent();
            await this.sendMenu(chatId, hubText, markup);
          }
          return;
        }

        // Command: /chart or /roadmap or /prep [jobIndex]
        if (text.startsWith('/chart') || text.startsWith('/roadmap') || text.startsWith('/prep')) {
          const parts = rawText.split(/\s+/);
          const jobIdx = parseInt(parts[1], 10) || 0;
          const { text: chartText, markup } = this.getJobPrepChartContent(jobIdx);
          await this.sendMenu(chatId, chartText, markup);
          return;
        }

        // Command: /ask <question> (Custom AI Interview Q&A)
        if (text.startsWith('/ask')) {
          const query = rawText.replace(/^\/ask\s*/i, '').trim();
          if (!query) {
            const promptText = `💬 <b>Ask Any Custom Interview Question:</b>\n\n` +
              `Please type your question after <code>/ask</code>, e.g.:\n` +
              `• <code>/ask How does useEffect cleanup work?</code>\n` +
              `• <code>/ask Explain SQL indexing and B-Trees</code>\n` +
              `• <code>/ask Tell me about a time you handled a difficult client</code>`;
            await this.sendMenu(chatId, promptText, {
              inline_keyboard: [
                [{ text: '🎙️ Send Voice Note Instead', callback_data: 'nav_inter_voice_prompt' }],
                [{ text: '🎙️ Back to Interview Hub', callback_data: 'nav_interview' }]
              ]
            });
            return;
          }

          const profile = StoreService.getProfile();
          const answer = await InterviewAiService.answerCustomQuestion(query, profile);
          const keyboard = [
            [{ text: '💬 Ask Another Question', callback_data: 'nav_inter_custom_prompt' }],
            [{ text: '🎙️ Interview Prep Hub', callback_data: 'nav_interview' }],
            [{ text: '⬅️ Back to Main Menu', callback_data: 'nav_main' }]
          ];
          await this.sendMenu(chatId, answer, { inline_keyboard: keyboard });
          return;
        }

        // Command: /setgemini <key>
        if (text.startsWith('/setgemini')) {
          const key = rawText.replace(/^\/setgemini\s*/i, '').trim();
          if (!key) {
            await this.sendMenu(chatId, `🔑 <b>Google Gemini API Key Setup:</b>\n\nTo link your key, send:\n<code>/setgemini YOUR_KEY</code>\n\n<i>Get your free key with 0 credit card at <a href="https://aistudio.google.com/">aistudio.google.com</a>.</i>`);
            return;
          }
          InterviewAiService.setGeminiKey(key);
          await this.sendMenu(chatId, `✅ <b>Google Gemini API Key Configured!</b>\n\nReal-time multimodal speech-to-text, audio analysis, and live custom interview answers are now active.\n\nTry sending a 🎙️ voice note or typing <code>/ask any question</code>!`);
          return;
        }

        // Command: /audit
        if (text === '/audit') {
          const { text: auditText, markup } = this.getJobAuditContent(0);
          await this.sendMenu(chatId, auditText, markup);
          return;
        }

        // Command: /skills
        if (text === '/skills') {
          const { text: skillsText, markup } = this.getSkillsAnalysisContent();
          await this.sendMenu(chatId, skillsText, markup);
          return;
        }

        // Command: /stats
        if (text === '/stats') {
          const { text: statsText, markup } = this.getStatsContent();
          await this.sendMenu(chatId, statsText, markup);
          return;
        }

        // Command: /login <email> <password>
        if (text.startsWith('/login')) {
          const parts = rawText.split(/\s+/);
          if (parts.length < 3) {
            const helpText = `🔐 <b>How to Log In:</b>\n\n` +
              `Please provide your Gmail address and password:\n` +
              `<code>/login your-email@gmail.com your-password</code>`;
            await this.sendMenu(chatId, helpText, {
              inline_keyboard: [[{ text: '⬅️ Back to Menu', callback_data: 'nav_main' }]]
            });
            return;
          }

          const email = parts[1];
          const password = parts.slice(2).join(' ');

          try {
            const loggedInUser = AuthService.loginWithTelegram(chatId, email, password, username);
            const welcomeText = `🎉 <b>Authentication Successful!</b>\n\n` +
              `Welcome back, <b>${loggedInUser.name}</b>!\n` +
              `🎓 <b>College:</b> <b>${loggedInUser.collegeName}</b>\n` +
              `📱 <b>Telegram Chat ID:</b> <code>${chatId}</code> (Linked)\n\n` +
              `<i>Your account is now fully active across web and mobile. Tap any button below to explore:</i>`;

            await this.sendMenu(chatId, welcomeText, this.getMainMenuMarkup(true));
          } catch (loginErr: any) {
            const errorText = `❌ <b>Login Failed:</b>\n\n` +
              `${loginErr.message || 'Invalid credentials'}.\n\n` +
              `Please verify your Gmail and password, then try again:\n` +
              `<code>/login your-email@gmail.com your-password</code>`;
            await this.sendMenu(chatId, errorText, {
              inline_keyboard: [
                [{ text: '🔐 Retry Login', callback_data: 'auth_login_prompt' }],
                [{ text: '💼 Continue as Guest', callback_data: 'nav_jobs_p_0' }]
              ]
            });
          }
          return;
        }

        // Command: /logout
        if (text.startsWith('/logout')) {
          AuthService.logoutTelegram(chatId);
          const logoutText = `🚪 <b>Logged Out Successfully</b>\n\n` +
            `Your Telegram account has been disconnected.\n\n` +
            `To log back in anytime, simply send:\n` +
            `<code>/login your-email@gmail.com your-password</code>`;
          await this.sendMenu(chatId, logoutText, this.getMainMenuMarkup(false));
          return;
        }

        // Command: /profile or /whoami
        if (text.startsWith('/profile') || text.startsWith('/whoami')) {
          const { text: profText, markup } = this.getUserProfileContent(user);
          await this.sendMenu(chatId, profText, markup);
          return;
        }

        // Command: /help
        if (text.startsWith('/help')) {
          const { text: helpText, markup } = this.getHelpContent();
          await this.sendMenu(chatId, helpText, markup);
          return;
        }

        // Command: /start or /menu
        if (text.startsWith('/start') || text.startsWith('/menu')) {
          await this.sendMenu(chatId, this.getMainMenuText(user), this.getMainMenuMarkup(isLoggedIn));
        } else if (text.startsWith('/jobs')) {
          const { text: jobsText, markup } = this.getJobsListContent(0);
          await this.sendMenu(chatId, jobsText, markup);
        } else if (text.startsWith('/gigs')) {
          const { text: gigsText, markup } = this.getGigsListContent(0);
          await this.sendMenu(chatId, gigsText, markup);
        } else if (text.startsWith('/salary')) {
          const { text: salText, markup } = this.getSalaryIntelContent();
          await this.sendMenu(chatId, salText, markup);
        } else if (text.startsWith('/tracker')) {
          const { text: trackerText, markup } = this.getTrackerContent();
          await this.sendMenu(chatId, trackerText, markup);
        } else if (text.startsWith('/calc')) {
          const { text: calcText, markup } = this.getCtcCalculatorContent('25');
          await this.sendMenu(chatId, calcText, markup);
        } else if (text.startsWith('/dossier')) {
          const { text: dosText, markup } = this.getCompanyDirectoryContent();
          await this.sendMenu(chatId, dosText, markup);
        } else if (text.startsWith('/alumni')) {
          const { text: alText, markup } = this.getAlumniReferralContent();
          await this.sendMenu(chatId, alText, markup);
        } else {
          await this.sendMenu(chatId, this.getMainMenuText(user), this.getMainMenuMarkup(isLoggedIn));
        }
      } catch (err: any) {
        console.error('[TelegramBot] Message processing error:', err.message);
      }
    }
  }

  // --- Background Long Polling (Runs locally or on server) ---
  public static startPolling() {
    if (this.isPolling) return;
    this.isPolling = true;
    console.log('[TelegramBot] 🚀 Starting interactive Telegram polling listener...');

    // Register native "/" commands with Telegram API
    this.setBotCommands().catch(() => {});

    const poll = async () => {
      if (!this.isPolling) return;
      try {
        const res = await axios.get(this.getApiUrl('getUpdates'), {
          params: { offset: this.lastUpdateId + 1, timeout: 20 },
          timeout: 25000
        });

        if (res.data?.ok && Array.isArray(res.data.result)) {
          for (const update of res.data.result) {
            this.lastUpdateId = update.update_id;
            await this.handleUpdate(update);
          }
        }
      } catch (err: any) {
        // network pause or sandbox offline is expected
      }

      if (this.isPolling) {
        this.pollingTimeout = setTimeout(poll, 1500);
      }
    };

    poll();
  }

  public static stopPolling() {
    this.isPolling = false;
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
      this.pollingTimeout = null;
    }
  }
}
