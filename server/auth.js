import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { connectMongo } from './mongo.js';
import { Admin } from './models/Admin.js';

const COOKIE_NAME = 'jyothu_admin_token';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[auth] CRITICAL: JWT_SECRET is not set!');
    throw new Error('Missing JWT_SECRET');
  }
  console.log('[auth] JWT_SECRET loaded:', secret ? `${secret.substring(0, 10)}...` : 'undefined');
  return secret;
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function signAdminToken({ adminId, email, jti }) {
  const secret = getJwtSecret();
  return jwt.sign(
    { sub: adminId, email, role: 'admin', jti },
    secret,
    { expiresIn: '7d' },
  );
}

export function newJti() {
  return nanoid(24);
}

export function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export async function requireAdmin(req, res, next) {
  try {
    await connectMongo();
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'unauthorized' });

    const secret = getJwtSecret();
    const payload = jwt.verify(token, secret);
    if (!payload?.sub || payload?.role !== 'admin') {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const admin = await Admin.findById(payload.sub).lean();
    if (!admin) return res.status(401).json({ error: 'unauthorized' });

    // Enforce one active session until logout: token must match stored jti and sessionActive must be true
    if (!admin.sessionActive || !admin.sessionJti || admin.sessionJti !== payload.jti) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    req.admin = { id: String(admin._id), email: admin.email, name: admin.name, role: 'admin' };
    next();
  } catch (_e) {
    return res.status(401).json({ error: 'unauthorized' });
  }
}

