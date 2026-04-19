import express from 'express';
import { connectMongo } from '../mongo.js';
import { Car } from '../models/Car.js';
import { Bus } from '../models/Bus.js';
import { Package } from '../models/Package.js';
import { Booking } from '../models/Booking.js';
import { Message } from '../models/Message.js';
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

