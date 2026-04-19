import 'dotenv/config';
import { connectMongo } from '../server/mongo.js';
import { Package } from '../server/models/Package.js';

// Sample package data based on the current package images
const SAMPLE_PACKAGES = [
  {
    package_name: 'Hubli to Mysore Round Trip Package',
    tour_type: 'Round Trip Package',
    route: 'Hubli - Mysore - Hubli',
    duration: '3 Nights / 4 Days',
    image_url: '', // Leave empty for manual upload
    rating: 4.7,
    display_order: 1,
    pricing_rows: [
      { vehicle_type: '4+1 Seater (Swift / Etios)', price_range: '₹19,500' },
      { vehicle_type: '6+1 Seater (Ertiga)', price_range: '₹21,800 - ₹24,000' },
      { vehicle_type: '7+1 Seater (Innova / Crysta)', price_range: '₹26,500' },
      { vehicle_type: '13+1 Seater (Tempo Traveller)', price_range: '₹30,500' },
      { vehicle_type: '21+1 Mini Bus (AC)', price_range: '₹50,200 - ₹62,500' },
      { vehicle_type: '25+1 Mini Bus (AC)', price_range: '₹61,500 - ₹67,000' },
      { vehicle_type: '29+1 / 30+1 Mini Bus (AC)', price_range: '₹67,000' },
    ],
  },
  {
    package_name: 'Hubli to Ooty Round Trip Package',
    tour_type: 'Round Trip Package',
    route: 'Hubli - Ooty - Hubli',
    duration: '3 Nights / 4 Days',
    image_url: '',
    rating: 4.7,
    display_order: 2,
    pricing_rows: [
      { vehicle_type: '4+1 Seater (Swift / Etios)', price_range: '₹27,500' },
      { vehicle_type: '6+1 Seater (Ertiga)', price_range: '₹30,000' },
      { vehicle_type: '7+1 Seater (Innova AC)', price_range: '₹36,000' },
      { vehicle_type: '13+1 Seater (AC)', price_range: '₹38,500 - ₹42,500' },
      { vehicle_type: '21+1 Seater (AC)', price_range: '₹59,500 - ₹62,500' },
      { vehicle_type: '25+1 Seater (AC)', price_range: '₹71,500 - ₹78,500' },
      { vehicle_type: '29+1 Seater (AC)', price_range: '₹81,000 - ₹95,500' },
    ],
  },
  {
    package_name: 'Hubli to Coorg Round Trip Package',
    tour_type: 'Round Trip Package',
    route: 'Hubli - Coorg - Hubli',
    duration: '3 Nights / 4 Days',
    image_url: '',
    rating: 4.6,
    display_order: 3,
    pricing_rows: [
      { vehicle_type: '4+1 Seater', price_range: '₹19,500' },
      { vehicle_type: '6+1 Seater', price_range: '₹21,500 - ₹24,000' },
      { vehicle_type: '7+1 Seater (Innova / Crysta AC)', price_range: '₹24,000 - ₹26,500' },
      { vehicle_type: '13+1 Seater (Tempo Traveller AC)', price_range: '₹27,500 - ₹30,500' },
      { vehicle_type: '21+1 Seater (AC)', price_range: '₹44,000 - ₹50,500' },
      { vehicle_type: '25+1 Seater (AC)', price_range: '₹57,800 - ₹61,500' },
      { vehicle_type: '29+1 Seater (AC)', price_range: '₹63,500 - ₹67,500' },
    ],
  },
  {
    package_name: 'Hubli to Goa Round Trip Package',
    tour_type: 'Round Trip Package',
    route: 'Hubli - Goa - Hubli',
    duration: '2 Nights / 3 Days',
    image_url: '',
    rating: 4.7,
    display_order: 4,
    pricing_rows: [
      { vehicle_type: '4+1 Seater', price_range: '₹12,200 - ₹12,600' },
      { vehicle_type: '6+1 Seater (Ertiga)', price_range: '₹15,000 - ₹17,200' },
      { vehicle_type: '7+1 Seater (Innova)', price_range: '₹19,500' },
      { vehicle_type: '13+1 Seater (Tempo Traveller)', price_range: '₹18,200 - ₹25,200' },
      { vehicle_type: '21+1 Mini Bus', price_range: '₹29,500 - ₹38,500' },
      { vehicle_type: '25+1 Mini Bus', price_range: '₹50,500' },
      { vehicle_type: '29+1 Mini Bus', price_range: '₹59,900' },
    ],
  },
  {
    package_name: 'Hubli to Shiridi Round Trip Package',
    tour_type: 'Round Trip Package',
    route: 'Hubli - Shiridi - Hubli',
    duration: '3 Nights / 4 Days',
    image_url: '',
    rating: 4.6,
    display_order: 5,
    pricing_rows: [
      { vehicle_type: '4+1 Seater', price_range: '₹17,400 - ₹24,000' },
      { vehicle_type: '6+1 Seater (Ertiga)', price_range: '₹21,000 - ₹27,800' },
      { vehicle_type: '7+1 Seater (Crysta AC)', price_range: '₹34,500' },
      { vehicle_type: '13+1 Seater (Tempo Traveller)', price_range: '₹25,200 - ₹37,000' },
      { vehicle_type: '21+1 Mini Bus', price_range: '₹39,600 - ₹59,000' },
      { vehicle_type: '25+1 Mini Bus', price_range: '₹70,800' },
      { vehicle_type: '29+1 Mini Bus', price_range: '₹81,800' },
    ],
  },
  {
    package_name: 'Hubli to Maharashtra Round Trip Package',
    tour_type: 'Round Trip Package',
    route: 'Hubli - Maharashtra - Hubli',
    duration: '3 Nights / 4 Days',
    image_url: '',
    rating: 4.6,
    display_order: 6,
    pricing_rows: [
      { vehicle_type: '4+1 Seater', price_range: '₹17,400 - ₹24,000' },
      { vehicle_type: '6+1 Seater', price_range: '₹21,000 - ₹34,500' },
      { vehicle_type: '7+1 Seater (Innova AC)', price_range: '₹42,000' },
      { vehicle_type: '13+1 Seater (Tempo Traveller)', price_range: '₹25,200 - ₹48,500' },
      { vehicle_type: '21+1 Seater (Bus)', price_range: '₹39,600 - ₹75,500' },
      { vehicle_type: '25+1 Seater', price_range: '₹90,000' },
      { vehicle_type: '29+1 Seater', price_range: '₹1,05,000' },
    ],
  },
  {
    package_name: 'Hubli to Madikeri Round Trip Package',
    tour_type: 'Round Trip Package',
    route: 'Hubli - Madikeri - Hubli',
    duration: '2 Nights / 3 Days',
    image_url: '',
    rating: 4.5,
    display_order: 7,
    pricing_rows: [
      { vehicle_type: '4+1 Seater', price_range: '₹12,200 - ₹12,600' },
      { vehicle_type: '6+1 Seater', price_range: '₹15,000 - ₹17,400' },
      { vehicle_type: '13+1 Seater (Tempo Traveller)', price_range: '₹18,200 - ₹25,200' },
      { vehicle_type: '21+1 Mini Bus', price_range: '₹29,500 - ₹38,500' },
      { vehicle_type: '25+1 Mini Bus', price_range: '₹50,500' },
      { vehicle_type: '29+1 Mini Bus', price_range: '₹56,950' },
    ],
  },
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');

  await connectMongo();

  let created = 0;
  let skipped = 0;

  for (const packageData of SAMPLE_PACKAGES) {
    const existing = await Package.findOne({ package_name: packageData.package_name });
    if (existing) {
      console.log(`[seed] skipped existing package: ${packageData.package_name}`);
      skipped++;
      continue;
    }

    await Package.create(packageData);
    console.log(`[seed] created package: ${packageData.package_name}`);
    created++;
  }

  console.log(`[seed] packages: ${created} created, ${skipped} skipped`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});