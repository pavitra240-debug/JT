import express from 'express';
import { connectMongo } from '../mongo.js';
import { requireAdmin } from '../auth.js';
import { Package } from '../models/Package.js';
import { sortSpec, toBase44 } from '../utils.js';

export const adminPackagesRouter = express.Router();

adminPackagesRouter.use(requireAdmin);

adminPackagesRouter.get('/', async (req, res) => {
  try {
    await connectMongo();
    const sortKey = req.query.sort || 'display_order';
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const packages = await Package.find({}).sort(sortSpec(sortKey)).limit(limit).lean();
    res.json(packages.map(toBase44));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminPackagesRouter.post('/', async (req, res) => {
  try {
    await connectMongo();
    const payload = req.body || {};
    if (!payload.package_name) return res.status(400).json({ error: 'missing_fields' });
    const pkg = await Package.create(payload);
    res.status(201).json(toBase44(pkg));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminPackagesRouter.put('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const payload = req.body || {};
    const pkg = await Package.findByIdAndUpdate(id, payload, { new: true });
    if (!pkg) return res.status(404).json({ error: 'not_found' });
    res.json(toBase44(pkg));
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

adminPackagesRouter.delete('/:id', async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const pkg = await Package.findByIdAndDelete(id);
    if (!pkg) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true });
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

