import express from 'express';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../mongo.js';
import { Admin } from '../models/Admin.js';
import { cookieOptions, getCookieName, newJti, signAdminToken } from '../auth.js';

export const adminAuthRouter = express.Router();

adminAuthRouter.post('/login', async (req, res) => {
  try {
    await connectMongo();
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'missing_fields' });

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) return res.status(401).json({ error: 'invalid_credentials' });

    // Enforce: one login active until logout
    if (admin.sessionActive) {
      return res.status(403).json({ error: 'already_logged_in' });
    }

    const ok = await bcrypt.compare(String(password), admin.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

    const jti = newJti();
    admin.sessionActive = true;
    admin.sessionJti = jti;
    await admin.save();

    const token = signAdminToken({ adminId: String(admin._id), email: admin.email, jti });
    res.cookie(getCookieName(), token, cookieOptions());

    return res.json({ user: { id: String(admin._id), name: admin.name, email: admin.email, role: 'admin' } });
  } catch (_e) {
    return res.status(500).json({ error: 'server_error' });
  }
});

adminAuthRouter.post('/logout', async (req, res) => {
  try {
    await connectMongo();
    // Best effort: clear active session for whichever admin currently has this token
    const token = req.cookies?.[getCookieName()];
    if (token) {
      // validate token signature but ignore failures
      try {
        const jwt = (await import('jsonwebtoken')).default;
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload?.sub) {
          await Admin.updateOne({ _id: payload.sub }, { $set: { sessionActive: false, sessionJti: null } });
        }
      } catch {
        // ignore
      }
    }
    res.clearCookie(getCookieName(), { path: '/' });
    return res.json({ ok: true });
  } catch (_e) {
    return res.status(500).json({ error: 'server_error' });
  }
});

// Force logout all admins - useful if stuck
adminAuthRouter.post('/force-logout-all', async (_req, res) => {
  try {
    await connectMongo();
    const result = await Admin.updateMany(
      { sessionActive: true },
      { $set: { sessionActive: false, sessionJti: null } }
    );
    res.clearCookie(getCookieName(), { path: '/' });
    return res.json({ 
      ok: true,
      message: 'All admin sessions cleared',
      clearedCount: result.modifiedCount
    });
  } catch (_e) {
    return res.status(500).json({ error: 'server_error' });
  }
});

adminAuthRouter.get('/me', async (req, res) => {
  try {
    await connectMongo();
    const token = req.cookies?.[getCookieName()];
    if (!token) return res.status(401).json({ error: 'unauthorized' });

    const jwt = (await import('jsonwebtoken')).default;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.sub) return res.status(401).json({ error: 'unauthorized' });

    const admin = await Admin.findById(payload.sub).lean();
    if (!admin || !admin.sessionActive || admin.sessionJti !== payload.jti) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    return res.json({ user: { id: String(admin._id), name: admin.name, email: admin.email, role: 'admin' } });
  } catch (_e) {
    return res.status(401).json({ error: 'unauthorized' });
  }
});

