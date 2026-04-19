import 'dotenv/config';
import { connectMongo } from '../server/mongo.js';
import { Car } from '../server/models/Car.js';

// Seed data based on the current car images
const SAMPLE_CARS = [
  {
    vehicle_name: 'Toyota Etios (4+1 seater)',
    category: 'Economy Sedan',
    rating: 4.9,
    local_drop_price: 1000,
    local_8h_nonac: 1900,
    local_8h_ac: 2300,
    outstation_nonac_per_km: 11,
    outstation_ac_per_km: 12,
    image_url: '', // Left empty for manual upload later
    display_order: 1,
  },
  {
    vehicle_name: 'Swift Dzire (4+1 seater)',
    category: 'Compact Sedan',
    rating: 4.9,
    local_drop_price: 1000,
    local_8h_nonac: 1900,
    local_8h_ac: 2300,
    outstation_nonac_per_km: 11,
    outstation_ac_per_km: 12,
    image_url: '',
    display_order: 2,
  },
  {
    vehicle_name: 'Maruti Ciaz (4+1 seater)',
    category: 'Premium Sedan',
    rating: 4.9,
    local_drop_price: 1000,
    local_8h_nonac: 1900,
    local_8h_ac: 2300,
    outstation_nonac_per_km: 12,
    outstation_ac_per_km: 13,
    image_url: '',
    display_order: 3,
  },
  {
    vehicle_name: 'Maruti Ertiga (6+1 seater)',
    category: 'Family MUV',
    rating: 4.9,
    local_drop_price: 2200,
    local_8h_nonac: 3300,
    local_8h_ac: 3800,
    outstation_nonac_per_km: 13,
    outstation_ac_per_km: 14,
    image_url: '',
    display_order: 4,
  },
  {
    vehicle_name: 'Toyota Rumion (6+1 seater)',
    category: 'Family MUV',
    rating: 4.8,
    local_drop_price: 2200,
    local_8h_nonac: 3300,
    local_8h_ac: 3800,
    outstation_nonac_per_km: 14,
    outstation_ac_per_km: 15,
    image_url: '',
    display_order: 5,
  },
  {
    vehicle_name: 'Toyota Innova (6+1/7+1 seater)',
    category: 'Premium MUV',
    rating: 4.8,
    local_drop_price: 2200,
    local_8h_nonac: 3300,
    local_8h_ac: 3800,
    outstation_nonac_per_km: 15,
    outstation_ac_per_km: 16,
    image_url: '',
    display_order: 6,
  },
  {
    vehicle_name: 'Toyota Innova Crysta (6+1/7+1 seater)',
    category: 'Premium MUV',
    rating: 4.7,
    local_drop_price: 2200,
    local_8h_nonac: 3300,
    local_8h_ac: 3800,
    outstation_nonac_per_km: 17,
    outstation_ac_per_km: 18,
    image_url: '',
    display_order: 7,
  },
  {
    vehicle_name: 'Toyota Innova Hycross (6+1 seater)',
    category: 'Premium MUV',
    rating: 4.9,
    local_drop_price: 2200,
    local_8h_nonac: 3300,
    local_8h_ac: 3800,
    outstation_nonac_per_km: 17,
    outstation_ac_per_km: 18,
    image_url: '',
    display_order: 8,
  },
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');

  await connectMongo();

  let created = 0;
  let skipped = 0;

  for (const carData of SAMPLE_CARS) {
    const existing = await Car.findOne({ vehicle_name: carData.vehicle_name });
    if (existing) {
      console.log(`[seed] skipped existing car: ${carData.vehicle_name}`);
      skipped++;
      continue;
    }

    await Car.create(carData);
    console.log(`[seed] created car: ${carData.vehicle_name}`);
    created++;
  }

  console.log(`[seed] cars: ${created} created, ${skipped} skipped`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});