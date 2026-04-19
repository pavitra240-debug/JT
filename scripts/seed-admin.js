import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../server/mongo.js';
import { Admin } from '../server/models/Admin.js';

async function main() {
  const name = process.env.ADMIN_NAME || 'Admin';
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');
  if (!process.env.JWT_SECRET) throw new Error('Missing JWT_SECRET');
  if (!email) throw new Error('Missing ADMIN_EMAIL');
  if (!password) throw new Error('Missing ADMIN_PASSWORD');

  await connectMongo();

  const existing = await Admin.findOne({ email });
  const passwordHash = await bcrypt.hash(password, 12);

  if (!existing) {
    await Admin.create({
      name,
      email,
      passwordHash,
      sessionActive: false,
      sessionJti: null,
    });
    // eslint-disable-next-line no-console
    console.log(`[seed] created admin: ${email}`);
    return;
  }

  existing.name = name;
  existing.passwordHash = passwordHash;
  // Reset lock to ensure you can log in after reseeding if needed
  existing.sessionActive = false;
  existing.sessionJti = null;
  await existing.save();
  // eslint-disable-next-line no-console
  console.log(`[seed] updated admin + reset session: ${email}`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

