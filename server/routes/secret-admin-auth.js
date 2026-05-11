import express from 'express';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../mongo.js';
import { Admin } from '../models/Admin.js';
import { cookieOptions, getCookieName, signAdminToken } from '../auth.js';

export const adminAuthRouter = express.Router();

adminAuthRouter.post('/login', async (req, res) => {
  try {
    await connectMongo();
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      console.error('[admin-auth] Missing email or password');
      return res.status(400).json({ error: 'missing_fields' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPassword = String(password).trim();

    const envAdminEmail = String(process.env.ADMIN_EMAIL || 'admin@jyothu.com').toLowerCase().trim();
    const envAdminPassword = String(process.env.ADMIN_PASSWORD || 'admin@123').trim();
    const envAdminName = process.env.ADMIN_NAME || 'Admin';

    if (normalizedEmail !== envAdminEmail || normalizedPassword !== envAdminPassword) {
      console.error('[admin-auth] Invalid admin credentials');
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    let admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      console.log('[admin-auth] Admin not found. Creating from env credentials...');
      const passwordHash = await bcrypt.hash(normalizedPassword, 12);
      admin = await Admin.create({
        name: envAdminName,
        email: envAdminEmail,
        passwordHash,
      });
      console.log('[admin-auth] Admin user created:', admin._id);
    }

    const token = signAdminToken({ adminId: String(admin._id), email: admin.email });
    res.cookie(getCookieName(), token, cookieOptions());

    console.log('[admin-auth] Login successful for:', admin.email);
    return res.json({ user: { id: String(admin._id), name: admin.name, email: admin.email, role: 'admin' } });
  } catch (e) {
    console.error('[admin-auth] Login error:', e?.message || e);
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
    await connectMongo();
    const token = req.cookies?.[getCookieName()];
    
    if (!token) {
      console.log('[admin-auth] /me called without token - returning 401 (expected for logged out users)');
      return res.status(401).json({ error: 'unauthorized' });
    }

    console.log('[admin-auth] /me called with token, verifying...');
    const jwt = (await import('jsonwebtoken')).default;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!payload?.sub) {
      console.error('[admin-auth] Token has no admin ID');
      return res.status(401).json({ error: 'unauthorized' });
    }

    const admin = await Admin.findById(payload.sub).lean();
    if (!admin) {
      console.error('[admin-auth] Admin not found in database');
      return res.status(401).json({ error: 'unauthorized' });
    }

    console.log('[admin-auth] /me verified for admin:', admin.email);
    return res.json({ user: { id: String(admin._id), name: admin.name, email: admin.email, role: 'admin' } });
  } catch (e) {
    console.error('[admin-auth] /me error:', e?.message || e);
    return res.status(401).json({ error: 'unauthorized' });
  }
});
