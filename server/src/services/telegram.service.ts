import axios from 'axios';
import { Job, Gig, AutomationSettings } from '../types.js';
import { StoreService } from './store.service.js';

export class TelegramService {
  private static getCredentials() {
    const auto = StoreService.getAutomation();
    const token = auto?.telegramBotToken || '9233664453:AAGU7w4GUhsXyLM1weCEl1N8qK39iEeFNSs';
    const chatId = auto?.telegramChatId || '6817458694';
    return { token, chatId, enabled: auto?.telegramEnabled ?? true };
  }

  public static async sendMessage(text: string): Promise<{ success: boolean; error?: string }> {
    const { token, chatId, enabled } = this.getCredentials();
    if (!token || !chatId) {
      return { success: false, error: 'Telegram Bot Token or Chat ID not configured.' };
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const res = await axios.post(url, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      }, { timeout: 10000 });

      return { success: res.data?.ok === true };
    } catch (err: any) {
      console.error('[TelegramService] Send error:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.description || err.message };
    }
  }

  public static async sendDailyDigest(jobs: Job[], gigs: Gig[]): Promise<{ success: boolean; error?: string }> {
    const topJobs = jobs.slice(0, 3);
    const topGigs = gigs.slice(0, 2);

    let message = `🚀 <b>CareerHunter Daily Morning Digest</b>\n`;
    message += `📅 <i>${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</i>\n\n`;
    
    message += `🔥 <b>TOP VERIFIED DIRECT JOBS:</b>\n`;
    topJobs.forEach((j, idx) => {
      message += `\n${idx + 1}. <b>${j.title}</b> at <b>${j.company}</b>\n`;
      message += `   📍 ${j.location} • 💰 ${j.salary || 'Competitive'}\n`;
      message += `   ⚡ Fit Score: <b>${j.matchScore}%</b> | [${j.source.toUpperCase()}]\n`;
      message += `   👉 <a href="${j.directApplyUrl}">Direct Apply Link</a>\n`;
    });

    if (topGigs.length > 0) {
      message += `\n\n💰 <b>VERIFIED WFH SIDE GIGS:</b>\n`;
      topGigs.forEach((g, idx) => {
        message += `\n• <b>${g.title}</b> (${g.clientOrPlatform})\n`;
        message += `   💵 Payout: <b>${g.payout}</b> • ⏱ ${g.estimatedHours}\n`;
        message += `   👉 <a href="${g.directApplyUrl}">Apply to Gig</a>\n`;
      });
    }

    message += `\n\n💡 <i>Tip: Open your CareerHunter local dashboard to generate tailored cover letters and before/after resume audits!</i>`;

    return await this.sendMessage(message);
  }

  public static async sendVipJobAlert(job: Job): Promise<{ success: boolean; error?: string }> {
    const text = `🎯 <b>VIP 95%+ MATCH ROLE DISCOVERED!</b>\n\n` +
      `💼 <b>${job.title}</b> at <b>${job.company}</b>\n` +
      `📍 <b>Location:</b> ${job.location}\n` +
      `💰 <b>CTC / Salary:</b> ${job.salary || 'Competitive'}\n` +
      `⚡ <b>ATS Fit Score:</b> <b>${job.matchScore}% Match!</b>\n` +
      `🏛️ <b>Portal Source:</b> [${job.source.toUpperCase()}]\n\n` +
      `🔗 <b>Direct Official Apply:</b> <a href="${job.directApplyUrl}">Open Career Portal ↗️</a>\n\n` +
      `💡 <i>Tip: Send /chart to view your 5-phase customized technical & STAR interview roadmap for this opening!</i>`;

    return await this.sendMessage(text);
  }

  public static async testNotification(): Promise<{ success: boolean; error?: string }> {
    const text = `🎉 <b>CareerHunter Bot Connected Successfully!</b>\n\n` +
      `Hello Suneo Aggarwal!\n` +
      `Your Telegram job alert bot (@Job_huntet_bot) is now connected.\n` +
      `You will receive verified MNC ATS openings (Greenhouse, Lever, Ashby, Google, MSFT) and WFH side gigs directly to your Telegram.\n\n` +
      `⏰ <b>Scheduled Daily Dispatch:</b> Every morning at 09:00 AM\n` +
      `🎓 <b>College Alumni Tracking:</b> ABESEC Ghaziabad`;

    return await this.sendMessage(text);
  }
}
