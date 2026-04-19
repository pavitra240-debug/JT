import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectMongo } from './mongo.js';
import { publicRouter } from './routes/public.js';
import { adminAuthRouter } from './routes/secret-admin-auth.js';
import { adminCarsRouter } from './routes/secret-admin-cars.js';
import { adminBusesRouter } from './routes/secret-admin-buses.js';
import { adminPackagesRouter } from './routes/secret-admin-packages.js';
import { adminBookingsRouter } from './routes/secret-admin-bookings.js';
import { adminMessagesRouter } from './routes/secret-admin-messages.js';

const app = express();
app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const clientOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (clientOrigins.length === 0 || clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.get('/api/health', async (_req, res) => {
  try {
    await connectMongo();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'db_unreachable' });
  }
});

app.use('/api/public', publicRouter);
app.use('/api/secret-admin', adminAuthRouter);
app.use('/api/secret-admin/cars', adminCarsRouter);
app.use('/api/secret-admin/buses', adminBusesRouter);
app.use('/api/secret-admin/packages', adminPackagesRouter);
app.use('/api/secret-admin/bookings', adminBookingsRouter);
app.use('/api/secret-admin/messages', adminMessagesRouter);

app.use((_req, res) => res.status(404).json({ error: 'not_found' }));

export default app;
