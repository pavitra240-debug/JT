import 'dotenv/config';
import { connectMongo } from '../server/mongo.js';
import { Bus } from '../server/models/Bus.js';

// Seed data based on the current bus images
const SAMPLE_BUSES = [
  {
    vehicle_name: 'Tempo Traveller (12+1 seater)',
    category: 'Tempo Traveller',
    seating_capacity: '12+1',
    rating: 4.8,
    local_price: 5500,
    local_ac_price: 7000,
    outstation_nonac_per_km: 18,
    outstation_ac_per_km: 22,
    image_url: '',
    display_order: 1,
  },
  {
    vehicle_name: 'Mini Bus (21+1 seater)',
    category: 'Mini Bus',
    seating_capacity: '21+1',
    rating: 4.7,
    local_price: 8000,
    local_ac_price: 10000,
    outstation_nonac_per_km: 29,
    outstation_ac_per_km: 34,
    image_url: '',
    display_order: 2,
  },
  {
    vehicle_name: 'Mini Bus (25+1 seater)',
    category: 'Mini Bus',
    seating_capacity: '25+1',
    rating: 4.7,
    local_price: 9000,
    local_ac_price: 12000,
    outstation_nonac_per_km: 36,
    outstation_ac_per_km: 40,
    image_url: '',
    display_order: 3,
  },
  {
    vehicle_name: 'Seater Mini Bus (29+1 seater)',
    category: 'Mini Bus',
    seating_capacity: '29+1',
    rating: 4.8,
    local_price: 10000,
    local_ac_price: 14000,
    outstation_nonac_per_km: 39,
    outstation_ac_per_km: 44,
    image_url: '',
    display_order: 4,
  },
  {
    vehicle_name: 'Bus (40+1 seater)',
    category: 'Bus',
    seating_capacity: '40+1',
    rating: 4.7,
    local_price: 10000,
    local_ac_price: 12000,
    outstation_nonac_per_km: 43,
    outstation_ac_per_km: 47,
    image_url: '',
    display_order: 5,
  },
  {
    vehicle_name: 'Bus (49+1 seater)',
    category: 'Bus',
    seating_capacity: '49+1',
    rating: 4.7,
    local_price: 10000,
    local_ac_price: 12500,
    outstation_nonac_per_km: 46,
    outstation_ac_per_km: 49,
    image_url: '',
    display_order: 6,
  },
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');

  await connectMongo();

  let created = 0;
  let skipped = 0;

  for (const busData of SAMPLE_BUSES) {
    const existing = await Bus.findOne({ vehicle_name: busData.vehicle_name });
    if (existing) {
      console.log(`[seed] skipped existing bus: ${busData.vehicle_name}`);
      skipped++;
      continue;
    }

    await Bus.create(busData);
    console.log(`[seed] created bus: ${busData.vehicle_name}`);
    created++;
  }

  console.log(`[seed] buses: ${created} created, ${skipped} skipped`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});