import express from 'express';
import { connectMongo } from '../mongo.js';
import { requireAdmin } from '../auth.js';
import { Message } from '../models/Message.js';
import { sortSpec, toBase44 } from '../utils.js';

export const adminMessagesRouter = express.Router();

adminMessagesRouter.use(requireAdmin);

adminMessagesRouter.get('/', async (req, res) => {
  try {
    await connectMongo();
    const sortKey = req.query.sort || '-created_date';
    const limit = Math.min(Number(req.query.limit || 100), 500);
    const messages = await Message.find({}).sort(sortSpec(sortKey)).limit(limit).lean();
    res.json(messages.map(toBase44));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminMessagesRouter.delete('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const msg = await Message.findByIdAndDelete(id);
    if (!msg) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

