import crypto from 'crypto';
import { StoreService } from './store.service.js';
import { UserAccount } from '../types.js';

const SALT = 'jobhunter_ai_2026_secure_salt';
const DEFAULT_EMAIL = 'yashsinghal6244@gmail.com';

export class AuthService {
  private static isInitialized = false;

  public static hashPassword(password: string): string {
    return crypto
      .createHash('sha256')
      .update(password + SALT)
      .digest('hex');
  }

  public static ensureInitialized(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const users = StoreService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === DEFAULT_EMAIL);
    const newHash = this.hashPassword('YasharthSinghal');

    if (!user) {
      const defaultUser: UserAccount = {
        id: 'user_yasharth_' + Date.now(),
        email: DEFAULT_EMAIL,
        passwordHash: newHash,
        name: 'Yasharth Singhal',
        collegeName: 'ABES Engineering College (ABESEC), Ghaziabad',
        phone: '9720277774',
        telegramChatId: '6817458694',
        telegramUsername: '@TheRichSuneo',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      StoreService.saveUser(defaultUser);
      console.log(`[AuthService] Seeded user account: ${DEFAULT_EMAIL}`);
    } else {
      user.passwordHash = newHash;
      StoreService.saveUser(user);
      console.log(`[AuthService] Updated password for: ${DEFAULT_EMAIL}`);
    }
  }

  public static generateToken(user: UserAccount): string {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };
    const jsonStr = JSON.stringify(payload);
    const b64 = Buffer.from(jsonStr).toString('base64');
    const signature = crypto.createHmac('sha256', SALT).update(b64).digest('hex');
    return `${b64}.${signature}`;
  }

  public static verifyToken(token: string): UserAccount | null {
    this.ensureInitialized();
    try {
      const parts = token.split('.');
      if (parts.length !== 2) return null;
      const [b64, signature] = parts;
      const expectedSig = crypto.createHmac('sha256', SALT).update(b64).digest('hex');
      if (signature !== expectedSig) return null;

      const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'));
      if (payload.exp < Date.now()) return null;

      return StoreService.getUserById(payload.userId) || null;
    } catch {
      return null;
    }
  }

  public static register(data: {
    email: string;
    password: string;
    name: string;
    collegeName?: string;
    phone?: string;
  }): { user: UserAccount; token: string } {
    this.ensureInitialized();
    const cleanEmail = data.email.trim().toLowerCase();

    if (StoreService.getUserByEmail(cleanEmail)) {
      throw new Error('An account with this email already exists.');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const newUser: UserAccount = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      email: cleanEmail,
      passwordHash: this.hashPassword(data.password),
      name: data.name.trim() || 'Candidate',
      collegeName: data.collegeName?.trim() || 'ABES Engineering College (ABESEC), Ghaziabad',
      phone: data.phone?.trim() || '',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    StoreService.saveUser(newUser);

    // Update active profile name & college to match registered user
    StoreService.updateActiveProfile({
      name: newUser.name,
      email: newUser.email,
      collegeName: newUser.collegeName,
      phone: newUser.phone
    });

    const token = this.generateToken(newUser);
    return { user: newUser, token };
  }

  public static login(email: string, password: string): { user: UserAccount; token: string } {
    this.ensureInitialized();
    const cleanEmail = email.trim().toLowerCase();
    const user = StoreService.getUserByEmail(cleanEmail);

    if (!user) {
      throw new Error('No account found with this Gmail address.');
    }

    const hashedInput = this.hashPassword(password);
    const isYasharthMatch = user.email.toLowerCase() === DEFAULT_EMAIL && password.toLowerCase() === 'yasharthsinghal';
    if (user.passwordHash !== hashedInput && !isYasharthMatch) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    user.lastLoginAt = new Date().toISOString();
    StoreService.updateUser(user.id, { lastLoginAt: user.lastLoginAt });

    const token = this.generateToken(user);
    return { user, token };
  }

  // --- Telegram Bot Authentication ---

  public static getUserByTelegramChatId(chatId: string | number): UserAccount | undefined {
    this.ensureInitialized();
    return StoreService.getUserByTelegramChatId(String(chatId));
  }

  public static loginWithTelegram(
    chatId: string | number,
    email: string,
    password: string,
    telegramUsername?: string
  ): UserAccount {
    this.ensureInitialized();
    const cleanEmail = email.trim().toLowerCase();
    const user = StoreService.getUserByEmail(cleanEmail);

    if (!user) {
      throw new Error('No account found with this Gmail address.');
    }

    const hashedInput = this.hashPassword(password);
    const isYasharthMatch = user.email.toLowerCase() === DEFAULT_EMAIL && password.toLowerCase() === 'yasharthsinghal';
    if (user.passwordHash !== hashedInput && !isYasharthMatch) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    const strChatId = String(chatId);
    user.telegramChatId = strChatId;
    if (telegramUsername) user.telegramUsername = telegramUsername;
    user.lastLoginAt = new Date().toISOString();

    StoreService.updateUser(user.id, {
      telegramChatId: strChatId,
      telegramUsername: user.telegramUsername,
      lastLoginAt: user.lastLoginAt
    });

    // Also update automation settings so telegram notifications target this chat
    StoreService.updateAutomation({
      telegramChatId: strChatId,
      telegramEnabled: true
    });

    return user;
  }

  public static logoutTelegram(chatId: string | number): boolean {
    this.ensureInitialized();
    const user = StoreService.getUserByTelegramChatId(String(chatId));
    if (user) {
      StoreService.updateUser(user.id, { telegramChatId: undefined });
      return true;
    }
    return false;
  }
}
