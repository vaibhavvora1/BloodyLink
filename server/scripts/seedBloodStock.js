import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { ensureBloodStockGroups } from '../src/services/bloodStock.service.js';

try {
  await connectDB();
  await ensureBloodStockGroups();
  process.stdout.write('Blood stock groups are ready.\n');
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
