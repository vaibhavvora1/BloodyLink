import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Admin from '../src/models/Admin.js';
import { connectDB } from '../src/config/db.js';
import { env, validateEnv } from '../src/config/env.js';

const run = async () => {
  validateEnv();
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before seeding.');
  }
  if (!/[a-z]/.test(env.ADMIN_PASSWORD) || !/[A-Z]/.test(env.ADMIN_PASSWORD) || !/\d/.test(env.ADMIN_PASSWORD) || !/[^A-Za-z0-9]/.test(env.ADMIN_PASSWORD) || env.ADMIN_PASSWORD.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters and include upper, lower, number, and symbol characters.');
  }

  await connectDB();
  const email = env.ADMIN_EMAIL.trim().toLowerCase();
  const existing = await Admin.exists({ email });
  if (existing) throw new Error(`An admin account already exists for ${email}; the seed script will not overwrite it.`);

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, salt);
  await Admin.create({ name: env.ADMIN_NAME, email, passwordHash, role: 'admin' });
  console.log(`Admin account created for ${email}.`);
};

run()
  .catch((error) => {
    console.error(`Admin seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
