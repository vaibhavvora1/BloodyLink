import mongoose from 'mongoose';
import DonationRequest from '../models/DonationRequest.js';
import Donor from '../models/Donor.js';
import BloodStock from '../models/BloodStock.js';
import { DONATION_DATE_WINDOW_DAYS, MIN_DONATION_INTERVAL_DAYS } from '../config/donationPolicy.js';

const activeStatuses = ['pending', 'approved'];
const fail = (statusCode, message) => Object.assign(new Error(message), { statusCode });
const publicRequest = (request) => {
  const data = request.toObject ? request.toObject() : request;
  delete data.idempotencyKey;
  data.statusHistory = (data.statusHistory || []).map(({ status, at }) => ({ status, at }));
  return data;
};

function validateEligibility(donor, preferredDate) {
  if (!donor) throw fail(404, 'Donor account not found.');
  if (donor.isActive === false || donor.isBlocked === true) throw fail(403, 'Your donor account is not eligible to submit a request.');
  const date = new Date(preferredDate);
  const now = Date.now();
  if (!Number.isFinite(date.getTime()) || date.getTime() <= now || date.getTime() > now + DONATION_DATE_WINDOW_DAYS * 86400000) {
    throw fail(400, `Choose a future date within ${DONATION_DATE_WINDOW_DAYS} days.`);
  }
  if (donor.lastDonationDate) {
    const nextDate = new Date(donor.lastDonationDate).getTime() + MIN_DONATION_INTERVAL_DAYS * 86400000;
    if (now < nextDate) throw fail(400, `You must wait ${MIN_DONATION_INTERVAL_DAYS} days after your last completed donation before submitting a request.`);
    if (date.getTime() < nextDate) throw fail(400, `Choose a date at least ${MIN_DONATION_INTERVAL_DAYS} days after your last completed donation.`);
  }
}

export async function createDonationRequest({ donorId, preferredDate, center, idempotencyKey }) {
  const existing = await DonationRequest.findOne({ donor: donorId, idempotencyKey }).lean();
  if (existing) return { request: publicRequest(existing), replayed: true };

  const donor = await Donor.findById(donorId).select('bloodGroup lastDonationDate isActive isBlocked').lean();
  validateEligibility(donor, preferredDate);
  const session = await mongoose.startSession();
  let request;
  try {
    await session.withTransaction(async () => {
      const [created] = await DonationRequest.create([{
        donor: donorId,
        bloodGroup: donor.bloodGroup,
        units: 1,
        preferredDate: new Date(preferredDate),
        center,
        idempotencyKey,
        status: 'pending',
        statusHistory: [{ status: 'pending', at: new Date(), by: donorId }]
      }], { session });
      request = created;
      const stockUpdate = await BloodStock.updateOne({ bloodGroup: donor.bloodGroup }, { $inc: { incomingUnits: 1 } }, { session });
      if (stockUpdate.modifiedCount !== 1) throw fail(409, 'Blood stock ledger is not initialized for your blood group.');
    });
  } catch (error) {
    if (error.code === 11000) {
      const replay = await DonationRequest.findOne({ donor: donorId, idempotencyKey }).lean();
      if (replay) return { request: publicRequest(replay), replayed: true };
      throw fail(409, 'You already have an active donation request.');
    }
    throw error;
  } finally {
    await session.endSession();
  }
  return { request: publicRequest(request), replayed: false };
}

export async function cancelDonationRequest({ requestId, donorId }) {
  const session = await mongoose.startSession();
  let updated;
  try {
    await session.withTransaction(async () => {
      updated = await DonationRequest.findOneAndUpdate(
        { _id: requestId, donor: donorId, status: { $in: activeStatuses } },
        { $set: { status: 'cancelled' }, $push: { statusHistory: { status: 'cancelled', at: new Date(), by: donorId } } },
        { new: true, session }
      );
      if (!updated) return;
      const stockUpdate = await BloodStock.updateOne(
        { bloodGroup: updated.bloodGroup, incomingUnits: { $gte: 1 } },
        { $inc: { incomingUnits: -1 } },
        { session }
      );
      if (stockUpdate.modifiedCount !== 1) throw fail(409, 'Incoming stock does not contain this request. No changes were made.');
    });
  } finally {
    await session.endSession();
  }
  if (updated) return publicRequest(updated);
  const owned = await DonationRequest.exists({ _id: requestId, donor: donorId });
  if (!owned) throw fail(404, 'Donation request not found.');
  throw fail(409, 'Only pending or approved donation requests can be cancelled.');
}

export async function changeDonationRequestStatus({ requestId, adminId, action }) {
  const transitions = {
    approve: { from: ['pending'], to: 'approved', adjustsStock: false },
    reject: { from: ['pending', 'approved'], to: 'rejected', adjustsStock: true },
    complete: { from: ['approved'], to: 'completed', adjustsStock: true, completes: true }
  };
  const transition = transitions[action];
  if (!transition) throw fail(400, 'Unsupported donation request action.');
  const session = await mongoose.startSession();
  let updated;
  try {
    await session.withTransaction(async () => {
      updated = await DonationRequest.findOneAndUpdate(
        { _id: requestId, status: { $in: transition.from } },
        { $set: { status: transition.to, handledBy: adminId }, $push: { statusHistory: { status: transition.to, at: new Date(), by: adminId } } },
        { new: true, session }
      );
      if (!updated) return;
      if (transition.adjustsStock) {
        const increments = transition.completes ? { incomingUnits: -1, availableUnits: 1 } : { incomingUnits: -1 };
        const stockUpdate = await BloodStock.updateOne(
          { bloodGroup: updated.bloodGroup, incomingUnits: { $gte: 1 } },
          { $inc: increments, $set: { updatedBy: adminId } },
          { session }
        );
        if (stockUpdate.modifiedCount !== 1) throw fail(409, 'Incoming stock does not contain this request. No changes were made.');
      }
      if (transition.completes) {
        const donorUpdate = await Donor.updateOne({ _id: updated.donor }, { $set: { lastDonationDate: new Date() } }, { session });
        if (donorUpdate.matchedCount !== 1) throw fail(409, 'Donor record is missing. No changes were made.');
      }
    });
  } finally {
    await session.endSession();
  }
  if (updated) return { status: updated.status, bloodGroup: updated.bloodGroup, units: updated.units, preferredDate: updated.preferredDate, center: updated.center };
  throw fail(409, 'Donation request was already processed.');
}
