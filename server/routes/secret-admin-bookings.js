import express from 'express';
import { connectMongo } from '../mongo.js';
import { requireAdmin } from '../auth.js';
import { Booking } from '../models/Booking.js';
import { sortSpec, toBase44 } from '../utils.js';

export const adminBookingsRouter = express.Router();

adminBookingsRouter.use(requireAdmin);

adminBookingsRouter.get('/', async (req, res) => {
  try {
    await connectMongo();
    const sortKey = req.query.sort || '-created_date';
    const limit = Math.min(Number(req.query.limit || 200), 500);
    const bookings = await Booking.find({}).sort(sortSpec(sortKey)).limit(limit).lean();
    res.json(bookings.map(toBase44));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

// Not in your public spec, but the existing admin UI updates status.
adminBookingsRouter.put('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const payload = req.body || {};
    const booking = await Booking.findByIdAndUpdate(id, payload, { new: true });
    if (!booking) return res.status(404).json({ error: 'not_found' });
    res.json(toBase44(booking));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminBookingsRouter.delete('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

