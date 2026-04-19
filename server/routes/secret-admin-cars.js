import express from 'express';
import { connectMongo } from '../mongo.js';
import { requireAdmin } from '../auth.js';
import { Car } from '../models/Car.js';
import { sortSpec, toBase44 } from '../utils.js';

export const adminCarsRouter = express.Router();

adminCarsRouter.use(requireAdmin);

adminCarsRouter.get('/', async (req, res) => {
  try {
    await connectMongo();
    const sortKey = req.query.sort || 'display_order';
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const cars = await Car.find({}).sort(sortSpec(sortKey)).limit(limit).lean();
    res.json(cars.map(toBase44));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminCarsRouter.post('/', async (req, res) => {
  try {
    await connectMongo();
    const payload = req.body || {};
    if (!payload.vehicle_name || !payload.category) return res.status(400).json({ error: 'missing_fields' });
    const car = await Car.create(payload);
    res.status(201).json(toBase44(car));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminCarsRouter.put('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const payload = req.body || {};
    const car = await Car.findByIdAndUpdate(id, payload, { new: true });
    if (!car) return res.status(404).json({ error: 'not_found' });
    res.json(toBase44(car));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminCarsRouter.delete('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);
    if (!car) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

