import BloodStock from '../models/BloodStock.js';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const stockStatus = (units) => units < 5 ? 'Critical' : units < 10 ? 'Low' : 'Available';

export async function ensureBloodStockGroups() {
  const legacyCount = await BloodStock.collection.countDocuments({
    $or: [
      { units: { $exists: true } },
      { availableUnits: { $exists: false } },
      { incomingUnits: { $exists: false } },
      { updatedAt: { $exists: false } },
      { bloodGroup: { $nin: BLOOD_GROUPS } }
    ]
  });
  if (legacyCount) {
    throw new Error('Legacy blood stock records need migration. Run `npm run migrate:stock` before starting the server.');
  }

  const duplicates = await BloodStock.collection.aggregate([
    { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]).toArray();
  if (duplicates.length) {
    throw new Error('Duplicate blood stock groups need migration. Run `npm run migrate:stock` before starting the server.');
  }

  const hasCollection = await BloodStock.db.db.listCollections({ name: BloodStock.collection.collectionName }, { nameOnly: true }).hasNext();
  const indexes = hasCollection ? await BloodStock.collection.indexes() : [];
  const groupIndex = indexes.find((index) => index.name !== '_id_' && index.key.bloodGroup === 1 && Object.keys(index.key).length === 1);
  if (groupIndex && !groupIndex.unique) await BloodStock.collection.dropIndex(groupIndex.name);
  if (!groupIndex?.unique) await BloodStock.collection.createIndex({ bloodGroup: 1 }, { unique: true, name: 'blood_group_unique' });
  await Promise.all(BLOOD_GROUPS.map((bloodGroup) => BloodStock.updateOne(
    { bloodGroup },
    { $setOnInsert: { availableUnits: 0, incomingUnits: 0 } },
    { upsert: true }
  )));
}
