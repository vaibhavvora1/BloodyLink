import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import BloodStock from '../src/models/BloodStock.js';
import DonationRequest from '../src/models/DonationRequest.js';
import Donor from '../src/models/Donor.js';
import Admin from '../src/models/Admin.js';
import { env } from '../src/config/env.js';
import { createDonationRequest, changeDonationRequestStatus } from '../src/services/donationRequest.service.js';
import { ensureBloodStockGroups } from '../src/services/bloodStock.service.js';

const donorId = process.env.DONATION_TEST_DONOR_ID;
const adminId = process.env.DONATION_TEST_ADMIN_ID;
const center = process.env.DONATION_TEST_CENTER;
const confirm = process.env.DONATION_TEST_CONFIRM;

function requireConfiguration() {
  if (env.NODE_ENV === 'production') throw new Error('Donation concurrency verification cannot run with NODE_ENV=production.');
  if (confirm !== 'YES') throw new Error('Set DONATION_TEST_CONFIRM=YES only for a disposable test database.');
  if (!mongoose.isValidObjectId(donorId) || !mongoose.isValidObjectId(adminId) || !center?.trim()) {
    throw new Error('Set DONATION_TEST_DONOR_ID, DONATION_TEST_ADMIN_ID, and DONATION_TEST_CENTER.');
  }
}

function tomorrow() {
  return new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function readGroupStock(bloodGroup) {
  const row = await BloodStock.findOne({ bloodGroup }).select('availableUnits incomingUnits').lean();
  if (!row) throw new Error(`Missing stock row for ${bloodGroup}.`);
  return row;
}

async function checkNoNegativeStock() {
  const negative = await BloodStock.exists({ $or: [{ availableUnits: { $lt: 0 } }, { incomingUnits: { $lt: 0 } }] });
  if (negative) throw new Error('A blood stock counter became negative.');
}

async function main() {
  requireConfiguration();
  await connectDB();
  await ensureBloodStockGroups();
  await DonationRequest.init();
  const donor = await Donor.findById(donorId).select('bloodGroup').lean();
  if (!donor) throw new Error('Test donor was not found.');
  if (!await Admin.exists({ _id: adminId })) throw new Error('Test admin was not found.');
  if (await DonationRequest.exists({ donor: donorId, status: { $in: ['pending', 'approved'] } })) {
    throw new Error('Test donor already has an active request; use an eligible donor with no active request.');
  }

  const before = await readGroupStock(donor.bloodGroup);
  const submissions = await Promise.allSettled(Array.from({ length: 50 }, (_, index) => createDonationRequest({
    donorId,
    preferredDate: tomorrow(),
    center: center.trim(),
    idempotencyKey: `verify-${Date.now()}-${index}`
  })));
  const active = await DonationRequest.find({ donor: donorId, status: { $in: ['pending', 'approved'] } }).select('_id status').lean();
  const created = submissions.filter((item) => item.status === 'fulfilled' && !item.value.replayed);
  const requestConflicts = submissions.filter((item) => item.status === 'rejected' && item.reason.statusCode === 409);
  const incomingDuring = await readGroupStock(donor.bloodGroup);
  if (active.length !== 1 || created.length !== 1 || requestConflicts.length !== 49) throw new Error(`Concurrent request assertion failed: ${active.length} active, ${created.length} created, ${requestConflicts.length} conflicts.`);
  if (incomingDuring.incomingUnits - before.incomingUnits !== 1 || incomingDuring.availableUnits !== before.availableUnits) {
    throw new Error('Pending requests did not change only the incoming stock counter by one.');
  }
  await checkNoNegativeStock();

  const request = active[0];
  await changeDonationRequestStatus({ requestId: request._id, adminId, action: 'approve' });
  const completions = await Promise.allSettled(Array.from({ length: 50 }, () => changeDonationRequestStatus({ requestId: request._id, adminId, action: 'complete' })));
  const completed = completions.filter((item) => item.status === 'fulfilled');
  const after = await readGroupStock(donor.bloodGroup);
  const stored = await DonationRequest.findById(request._id).select('status').lean();
  const completionConflicts = completions.filter((item) => item.status === 'rejected' && item.reason.statusCode === 409);
  if (completed.length !== 1 || completionConflicts.length !== 49 || stored?.status !== 'completed') throw new Error(`Concurrent completion assertion failed: ${completed.length} successful transitions, ${completionConflicts.length} conflicts.`);
  if (after.availableUnits - before.availableUnits !== 1 || after.incomingUnits !== before.incomingUnits) {
    throw new Error(`Stock assertion failed: available delta ${after.availableUnits - before.availableUnits}, incoming delta ${after.incomingUnits - before.incomingUnits}.`);
  }
  await checkNoNegativeStock();
  process.stdout.write('PASS: 50 concurrent requests from one donor produced exactly one active request.\n');
  process.stdout.write('PASS: 50 concurrent completion calls produced exactly one completion and +1 available unit.\n');
  process.stdout.write('PASS: available and incoming stock counters stayed non-negative.\n');
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
