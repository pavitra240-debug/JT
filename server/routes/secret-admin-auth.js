import express from 'express';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../mongo.js';
import { Admin } from '../models/Admin.js';
import { cookieOptions, getCookieName, signAdminToken } from '../auth.js';

export const adminAuthRouter = express.Router();

adminAuthRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      console.error('[admin-auth] Missing email or password');
      return res.status(400).json({ error: 'missing_fields' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPassword = String(password).trim();

    const envAdminEmail = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const envAdminPassword = String(process.env.ADMIN_PASSWORD || '').trim();

    if (!envAdminEmail || !envAdminPassword) {
      console.error('[admin-auth] ADMIN_EMAIL or ADMIN_PASSWORD not configured');
      return res.status(500).json({ error: 'server_error' });
    }

    if (normalizedEmail !== envAdminEmail || normalizedPassword !== envAdminPassword) {
      console.error('[admin-auth] Invalid credentials');
      return res.status(401).json({ error: 'invalid_credentials', message: 'Email or password is incorrect.' });
    }

    const token = signAdminToken({ adminId: 'admin', email: envAdminEmail });
    res.cookie(getCookieName(), token, cookieOptions());

    console.log('[admin-auth] Login successful:', envAdminEmail);
    return res.json({ user: { id: 'admin', name: process.env.ADMIN_NAME || 'Admin', email: envAdminEmail, role: 'admin' } });
  } catch (e) {
    console.error('[admin-auth] Login error:', e?.message);
    return res.status(500).json({ error: 'server_error' });
  }
});

adminAuthRouter.post('/logout', async (req, res) => {
  try {
    res.clearCookie(getCookieName(), { path: '/' });
    return res.json({ ok: true });
  } catch (_e) {
    return res.status(500).json({ error: 'server_error' });
  }
});

adminAuthRouter.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.[getCookieName()];
    
    if (!token) {
      console.log('[admin-auth] /me called without token');
      return res.status(401).json({ error: 'unauthorized' });
    }

    const jwt = (await import('jsonwebtoken')).default;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!payload?.email) {
      console.error('[admin-auth] Token missing email');
      return res.status(401).json({ error: 'unauthorized' });
    }

    console.log('[admin-auth] /me verified for:', payload.email);
    return res.json({ 
      user: { 
        id: 'admin', 
        name: process.env.ADMIN_NAME || 'Admin', 
        email: payload.email, 
        role: 'admin' 
      } 
    });
  } catch (e) {
    console.error('[admin-auth] /me error:', e?.message);
    return res.status(401).json({ error: 'unauthorized' });
  }
});
