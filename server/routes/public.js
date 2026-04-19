import express from 'express';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../mongo.js';
import { Car } from '../models/Car.js';
import { Bus } from '../models/Bus.js';
import { Package } from '../models/Package.js';
import { Booking } from '../models/Booking.js';
import { Message } from '../models/Message.js';
import { Admin } from '../models/Admin.js';
import { toBase44 } from '../utils.js';

export const publicRouter = express.Router();

publicRouter.get('/home-data', async (_req, res) => {
  try {
    await connectMongo();

    const [cars, buses, packages] = await Promise.all([
      Car.find({})
        .sort({ display_order: 1, createdAt: -1 })
        .select(
          'vehicle_name category rating local_drop_price local_8h_nonac local_8h_ac outstation_nonac_per_km outstation_ac_per_km image_url display_order createdAt',
        )
        .limit(50)
        .lean(),
      Bus.find({})
        .sort({ display_order: 1, createdAt: -1 })
        .select(
          'vehicle_name category seating_capacity rating local_price local_ac_price outstation_nonac_per_km outstation_ac_per_km image_url display_order createdAt',
        )
        .limit(50)
        .lean(),
      Package.find({})
        .sort({ display_order: 1, createdAt: -1 })
        .select('package_name tour_type route duration image_url rating display_order pricing_rows createdAt')
        .limit(50)
        .lean(),
    ]);

    res.json({
      cars: cars.map(toBase44),
      buses: buses.map(toBase44),
      packages: packages.map(toBase44),
    });
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

publicRouter.post('/bookings', async (req, res) => {
  try {
    await connectMongo();
    const payload = req.body || {};
    if (!payload.customer_name?.trim() || !payload.phone?.trim() || !payload.service_type?.trim()) {
      return res.status(400).json({ error: 'Missing required fields: customer_name, phone, service_type' });
    }
    const booking = await Booking.create(payload);
    res.status(201).json({ booking: toBase44(booking) });
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

publicRouter.post('/messages', async (req, res) => {
  try {
    await connectMongo();
    const payload = req.body || {};
    if (!payload.full_name?.trim() || !payload.message?.trim()) {
      return res.status(400).json({ error: 'Missing required fields: full_name, message' });
    }
    const msg = await Message.create(payload);
    res.status(201).json({ message: toBase44(msg) });
  } catch (_e) {
    res.status(500).json({ error: 'server_error' });
  }
});

// Emergency seed endpoint - only works with correct secret
publicRouter.post('/seed-admin-emergency', async (req, res) => {
  try {
    const secret = req.headers['x-seed-secret'] || req.body?.secret || '';
    const expectedSecret = process.env.ADMIN_SEED_SECRET || 'default-seed-key-change-me';
    
    if (secret !== expectedSecret) {
      return res.status(403).json({ error: 'Unauthorized - invalid seed secret' });
    }

    await connectMongo();
    
    const email = (process.env.ADMIN_EMAIL || 'admin@jyothu.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'admin@123';
    const name = process.env.ADMIN_NAME || 'Admin';

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: 'Admin already exists', email });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      name,
      email,
      passwordHash,
      sessionActive: false,
      sessionJti: null,
    });

    return res.status(201).json({ 
      message: 'Admin created successfully',
      admin: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error?.message || 'server_error' });
  }
});

