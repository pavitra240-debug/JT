/**
 * MongoDB Keep-Alive Script
 * 
 * This script queries the MongoDB database to prevent auto-pause on MongoDB Atlas.
 * Run this on a schedule (e.g., every 6 days) to keep your cluster active.
 * 
 * Usage:
 *   node scripts/keep-db-alive.js
 * 
 * For Vercel Cron:
 *   Add to vercel.json in crons array with schedule "0 0 */6 * *" (every 6 days at midnight)
 * 
 * For local development:
 *   Add to package.json scripts and run manually or use a cron scheduler
 */

import 'dotenv/config';
import mongoose from 'mongoose';

async function keepDatabaseAlive() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set in environment variables');
      process.exit(1);
    }

    console.log('[keep-db-alive] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    
    console.log('[keep-db-alive] ✅ Connected to MongoDB');
    
    // Query a simple collection to keep the connection active
    const db = mongoose.connection.db;
    const result = await db.collection('admins').findOne({});
    
    console.log('[keep-db-alive] ✅ Pinged database successfully');
    console.log(`[keep-db-alive] Found ${result ? 'admin record' : 'no admin records'}`);
    
    await mongoose.disconnect();
    console.log('[keep-db-alive] ✅ Disconnected from MongoDB');
    console.log('[keep-db-alive] ✅ Database keep-alive successful - cluster will not pause');
    
    process.exit(0);
  } catch (error) {
    console.error('[keep-db-alive] ❌ Error:', error?.message || error);
    process.exit(1);
  }
}

keepDatabaseAlive();
