import { Router } from 'express';
import { AuthService } from '../services/auth.service.js';

export const authRouter = Router();

// Register new user
authRouter.post('/register', (req, res) => {
  try {
    const { email, password, name, collegeName, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = AuthService.register({ email, password, name, collegeName, phone });
    // Remove passwordHash before returning
    const { passwordHash, ...safeUser } = result.user;
    return res.status(201).json({ user: safeUser, token: result.token });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Login with Gmail & Password
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = AuthService.login(email, password);
    const { passwordHash, ...safeUser } = result.user;
    return res.json({ user: safeUser, token: result.token });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
});

// Verify current token / session
authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header.' });
  }
  const token = authHeader.split(' ')[1];
  const user = AuthService.verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Token is expired or invalid.' });
  }
  const { passwordHash, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// Bind Telegram Chat ID
authRouter.post('/telegram-bind', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  const token = authHeader.split(' ')[1];
  const user = AuthService.verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  const { chatId, username } = req.body;
  if (!chatId) {
    return res.status(400).json({ error: 'chatId is required.' });
  }

  const updated = AuthService.loginWithTelegram(chatId, user.email, '', username);
  const { passwordHash, ...safeUser } = updated;
  return res.json({ user: safeUser });
});
