import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import BloodStock from '../src/models/BloodStock.js';
import { BLOOD_GROUPS, ensureBloodStockGroups } from '../src/services/bloodStock.service.js';

const marker = 'single-group-available-incoming-v1';

try {
  await connectDB();
  const oldCollection = mongoose.connection.db.collection('bloodstock_legacy');
  const migrationCollection = mongoose.connection.db.collection('bloodstock_migrations');
  if (await migrationCollection.findOne({ _id: marker })) {
    process.stdout.write('Blood stock migration was already completed.\n');
  } else {
    const oldRecords = await BloodStock.collection.find({}).toArray();
    const totals = new Map(BLOOD_GROUPS.map((group) => [group, { availableUnits: 0, incomingUnits: 0, updatedAt: new Date() }]));
    for (const record of oldRecords) {
      const total = totals.get(record.bloodGroup);
      if (!total) continue;
      total.availableUnits += Number(record.availableUnits ?? record.units ?? 0);
      total.incomingUnits += Number(record.incomingUnits ?? 0);
      if (record.updatedAt && record.updatedAt > total.updatedAt) total.updatedAt = record.updatedAt;
    }
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        if (oldRecords.length) await oldCollection.bulkWrite(oldRecords.map((record) => ({
          updateOne: { filter: { _id: record._id }, update: { $setOnInsert: record }, upsert: true }
        })), { session });
        await BloodStock.collection.deleteMany({}, { session });
        await BloodStock.collection.insertMany(BLOOD_GROUPS.map((bloodGroup) => ({
          bloodGroup,
          ...totals.get(bloodGroup),
          createdAt: new Date()
        })), { session });
        await migrationCollection.insertOne({ _id: marker, migratedAt: new Date(), backedUpRecords: oldRecords.length }, { session });
      });
    } finally {
      await session.endSession();
    }
    process.stdout.write(`Migrated ${oldRecords.length} stock record(s); original records are backed up in bloodstock_legacy.\n`);
  }
  await ensureBloodStockGroups();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
