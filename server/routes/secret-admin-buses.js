import express from 'express';
import { connectMongo } from '../mongo.js';
import { requireAdmin } from '../auth.js';
import { Bus } from '../models/Bus.js';
import { sortSpec, toBase44 } from '../utils.js';

export const adminBusesRouter = express.Router();

adminBusesRouter.use(requireAdmin);

adminBusesRouter.get('/', async (req, res) => {
  try {
    await connectMongo();
    const sortKey = req.query.sort || 'display_order';
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const buses = await Bus.find({}).sort(sortSpec(sortKey)).limit(limit).lean();
    res.json(buses.map(toBase44));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminBusesRouter.post('/', async (req, res) => {
  try {
    await connectMongo();
    const payload = req.body || {};
    if (!payload.vehicle_name || !payload.category) return res.status(400).json({ error: 'missing_fields' });
    const bus = await Bus.create(payload);
    res.status(201).json(toBase44(bus));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminBusesRouter.put('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const payload = req.body || {};
    const bus = await Bus.findByIdAndUpdate(id, payload, { new: true });
    if (!bus) return res.status(404).json({ error: 'not_found' });
    res.json(toBase44(bus));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminBusesRouter.delete('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const bus = await Bus.findByIdAndDelete(id);
    if (!bus) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

