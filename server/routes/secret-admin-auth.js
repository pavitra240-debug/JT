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
    
    if (!email || !password) {
      console.error('[admin-auth] Missing email or password');
      return res.status(400).json({ error: 'missing_fields' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPassword = String(password).trim();
    let admin = await Admin.findOne({ email: normalizedEmail });

    const envAdminEmail = String(process.env.ADMIN_EMAIL || 'admin@jyothu.com').toLowerCase().trim();
    const envAdminPassword = String(process.env.ADMIN_PASSWORD || 'admin@123').trim();
    const envAdminName = process.env.ADMIN_NAME || 'Admin';
    const matchesEnvCredentials = normalizedEmail === envAdminEmail && normalizedPassword === envAdminPassword;

    if (!admin) {
      console.log('[admin-auth] Admin not found. Checking env credentials...');
      console.log('[admin-auth] Submitted email:', normalizedEmail);
      console.log('[admin-auth] Env admin email:', envAdminEmail);

      if (!matchesEnvCredentials) {
        console.error('[admin-auth] Credentials do not match env or admin does not exist');
        return res.status(401).json({ error: 'invalid_credentials' });
      }

      console.log('[admin-auth] Creating new admin user from env credentials...');
      const passwordHash = await bcrypt.hash(normalizedPassword, 12);
      admin = await Admin.create({
        name: envAdminName,
        email: envAdminEmail,
        passwordHash,
        sessionActive: false,
        sessionJti: null,
      });
      console.log('[admin-auth] Admin user created:', admin._id);
    } else if (matchesEnvCredentials) {
      const currentPasswordMatches = await bcrypt.compare(normalizedPassword, admin.passwordHash);
      if (!currentPasswordMatches) {
        console.log('[admin-auth] Env credentials match but DB password hash differs; updating stored admin password hash.');
        admin.passwordHash = await bcrypt.hash(normalizedPassword, 12);
        await admin.save();
      }
    }

    // Automatically clear any existing session before creating new one
    if (admin.sessionActive) {
      console.log('[admin-auth] Clearing existing session for admin:', admin.email);
      admin.sessionActive = false;
      admin.sessionJti = null;
      await admin.save();
    }

    const ok = await bcrypt.compare(normalizedPassword, admin.passwordHash);
    if (!ok) {
      console.error('[admin-auth] Password mismatch');
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    const jti = newJti();
    admin.sessionActive = true;
    admin.sessionJti = jti;
    await admin.save();

    const token = signAdminToken({ adminId: String(admin._id), email: admin.email, jti });
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
    
    if (!admin.sessionActive || !admin.sessionJti || admin.sessionJti !== payload.jti) {
      console.error('[admin-auth] Session mismatch or inactive');
      return res.status(401).json({ error: 'unauthorized' });
    }

    console.log('[admin-auth] /me verified for admin:', admin.email);
    return res.json({ user: { id: String(admin._id), name: admin.name, email: admin.email, role: 'admin' } });
  } catch (e) {
    console.error('[admin-auth] /me error:', e?.message || e);
    return res.status(401).json({ error: 'unauthorized' });
  }
});

