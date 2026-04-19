import 'dotenv/config';
import fs from 'fs/promises';
import path from 'node:path';
import { connectMongo } from '../server/mongo.js';
import { Car } from '../server/models/Car.js';
import { Bus } from '../server/models/Bus.js';
import { Package } from '../server/models/Package.js';

const VALID_KEYS = ['cars', 'buses', 'packages'];

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : value;
}

async function importCollection(collectionName, items) {
  if (!Array.isArray(items)) {
    throw new Error(`Expected '${collectionName}' to be an array`);
  }

  let created = 0;
  let skipped = 0;

  for (const item of items) {
    if (!item || typeof item !== 'object') continue;

    const payload = { ...item };
    payload.image_url = normalizeText(payload.image_url) || '';

    if (collectionName === 'cars') {
      if (!normalizeText(payload.vehicle_name) || !normalizeText(payload.category)) {
        console.warn(`[import] skipping car with missing required fields: ${JSON.stringify(item)}`);
        continue;
      }
      const existing = await Car.findOne({ vehicle_name: normalizeText(payload.vehicle_name) });
      if (existing) {
        skipped++;
        continue;
      }
      await Car.create({
        vehicle_name: normalizeText(payload.vehicle_name),
        category: normalizeText(payload.category),
        rating: payload.rating,
        local_drop_price: payload.local_drop_price,
        local_8h_nonac: payload.local_8h_nonac,
        local_8h_ac: payload.local_8h_ac,
        outstation_nonac_per_km: payload.outstation_nonac_per_km,
        outstation_ac_per_km: payload.outstation_ac_per_km,
        image_url: payload.image_url,
        display_order: payload.display_order ?? 0,
      });
      created++;
    }

    if (collectionName === 'buses') {
      if (!normalizeText(payload.vehicle_name) || !normalizeText(payload.category)) {
        console.warn(`[import] skipping bus with missing required fields: ${JSON.stringify(item)}`);
        continue;
      }
      const existing = await Bus.findOne({ vehicle_name: normalizeText(payload.vehicle_name) });
      if (existing) {
        skipped++;
        continue;
      }
      await Bus.create({
        vehicle_name: normalizeText(payload.vehicle_name),
        category: normalizeText(payload.category),
        seating_capacity: normalizeText(payload.seating_capacity) || '',
        rating: payload.rating,
        local_price: payload.local_price,
        local_ac_price: payload.local_ac_price,
        outstation_nonac_per_km: payload.outstation_nonac_per_km,
        outstation_ac_per_km: payload.outstation_ac_per_km,
        image_url: payload.image_url,
        display_order: payload.display_order ?? 0,
      });
      created++;
    }

    if (collectionName === 'packages') {
      if (!normalizeText(payload.package_name)) {
        console.warn(`[import] skipping package with missing required fields: ${JSON.stringify(item)}`);
        continue;
      }
      const existing = await Package.findOne({ package_name: normalizeText(payload.package_name) });
      if (existing) {
        skipped++;
        continue;
      }
      const validPricingRows = Array.isArray(payload.pricing_rows)
        ? payload.pricing_rows.map((row) => ({
            vehicle_type: normalizeText(row.vehicle_type) || '',
            price_range: normalizeText(row.price_range) || '',
          }))
        : [];

      await Package.create({
        package_name: normalizeText(payload.package_name),
        tour_type: normalizeText(payload.tour_type) || '',
        route: normalizeText(payload.route) || '',
        duration: normalizeText(payload.duration) || '',
        image_url: payload.image_url,
        rating: payload.rating,
        display_order: payload.display_order ?? 0,
        pricing_rows: validPricingRows,
      });
      created++;
    }
  }

  return { created, skipped };
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    throw new Error('Usage: node scripts/import-data.js <path-to-json-file>');
  }

  const resolvedPath = path.resolve(process.cwd(), jsonPath);
  const content = await fs.readFile(resolvedPath, 'utf-8');
  const data = JSON.parse(content);

  for (const key of Object.keys(data)) {
    if (!VALID_KEYS.includes(key)) {
      throw new Error(`Invalid top-level key '${key}' in import file. Use only: ${VALID_KEYS.join(', ')}`);
    }
  }

  await connectMongo();

  const summary = {};
  for (const key of VALID_KEYS) {
    if (!data[key]) continue;
    summary[key] = await importCollection(key, data[key]);
  }

  console.log('[import] completed');
  Object.entries(summary).forEach(([key, result]) => {
    console.log(`[import] ${key}: ${result.created} created, ${result.skipped} skipped`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});