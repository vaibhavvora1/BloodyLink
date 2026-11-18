import { Router } from 'express';
import Donor from '../models/Donor.js';
import BloodRequest from '../models/BloodRequest.js';
import DonationOffer from '../models/DonationOffer.js';
import DonationMatch from '../models/DonationMatch.js';
import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { donorAvailabilitySchema, donorProfileUpdateSchema } from '../utils/authValidation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';
import { MIN_DONATION_INTERVAL_DAYS } from '../config/donationPolicy.js';

const router = Router();
router.use(authenticate, authorize('donor'));
const PROFILE_FIELDS = 'name email phone city address dateOfBirth age bloodGroup gender weight lastDonationDate isAvailable medicalNotes createdAt';
const PRIVATE_STATUSES = new Set(['Approved', 'Scheduled', 'Completed']);
const donorProfileData = (donor) => {
  const eligibleAfter = donor.lastDonationDate ? new Date(new Date(donor.lastDonationDate).getTime() + MIN_DONATION_INTERVAL_DAYS * 86400000) : null;
  return { ...donor, donationEligibility: { minimumIntervalDays: MIN_DONATION_INTERVAL_DAYS, eligibleAfter, eligible: !eligibleAfter || eligibleAfter <= new Date() } };
};

router.get('/dashboard', (req, res) => sendResponse(res, 200, true, 'Donor dashboard', req.user));

router.get('/profile', asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user.id).select(PROFILE_FIELDS).lean();
  if (!donor) return sendResponse(res, 404, false, 'Donor not found');
  return sendResponse(res, 200, true, 'Donor profile', donorProfileData(donor));
}));

router.put('/profile', validateBody(donorProfileUpdateSchema), asyncHandler(async (req, res) => {
  const update = { ...req.body };
  for (const key of ['dateOfBirth']) if (update[key] !== undefined) update[key] = update[key] ? new Date(update[key]) : null;
  if (update.weight === '') update.weight = null;
  const donor = await Donor.findByIdAndUpdate(req.user.id, { $set: update }, { new: true, runValidators: true }).select(PROFILE_FIELDS).lean();
  if (!donor) return sendResponse(res, 404, false, 'Donor not found');
  return sendResponse(res, 200, true, 'Profile updated successfully', donorProfileData(donor));
}));

router.patch('/availability', validateBody(donorAvailabilitySchema), asyncHandler(async (req, res) => {
  const donor = await Donor.findByIdAndUpdate(req.user.id, { $set: { isAvailable: req.body.isAvailable } }, { new: true }).select('isAvailable').lean();
  return sendResponse(res, 200, true, 'Availability updated', donor);
}));

router.get('/requests', asyncHandler(async (_req, res) => {
  const requests = await BloodRequest.find({ status: 'Requested' }).select('bloodGroup units hospital city urgency requiredDate status createdAt').sort({ createdAt: -1 }).limit(100).lean();
  return sendResponse(res, 200, true, 'Open blood requests', requests);
}));

router.post('/requests/:id/accept', asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user.id);
  if (!donor) return sendResponse(res, 404, false, 'Donor not found');
  if (!donor.isAvailable) return sendResponse(res, 400, false, 'Turn on your availability before accepting a request.');
  if (donor.lastDonationDate) {
    const elapsed = Date.now() - new Date(donor.lastDonationDate).getTime();
    if (elapsed < MIN_DONATION_INTERVAL_DAYS * 24 * 60 * 60 * 1000) {
      const days = Math.ceil((MIN_DONATION_INTERVAL_DAYS * 24 * 60 * 60 * 1000 - elapsed) / (24 * 60 * 60 * 1000));
      return sendResponse(res, 400, false, `Donation eligibility requires a ${MIN_DONATION_INTERVAL_DAYS}-day interval. Please wait ${days} day(s).`);
    }
  }
  const request = await BloodRequest.findOne({ _id: req.params.id, status: 'Requested' });
  if (!request) return sendResponse(res, 404, false, 'This request is no longer open.');
  const patient = await Patient.findById(request.patientId).select('_id');
  if (!patient) return sendResponse(res, 404, false, 'Request owner not found.');
  const match = await DonationMatch.create({ patientId: patient._id, donorId: donor._id, requestId: request._id, bloodGroup: request.bloodGroup, city: request.city, status: 'Pending Admin Approval', statusHistory: [{ status: 'Accepted by Donor', actorRole: 'donor' }, { status: 'Pending Admin Approval', actorRole: 'system' }] });
  request.status = 'Pending Admin Approval';
  request.statusHistory.push({ status: 'Accepted by Donor', actorRole: 'donor' }, { status: 'Pending Admin Approval', actorRole: 'system' });
  await request.save();
  return sendResponse(res, 201, true, 'Match submitted for admin approval', { matchId: match.id, status: match.status });
}));

router.get('/offers', asyncHandler(async (req, res) => {
  const offers = await DonationOffer.find({ donorId: req.user.id }).sort({ createdAt: -1 }).lean();
  return sendResponse(res, 200, true, 'Your donation offers', offers);
}));

router.post('/offers', asyncHandler(async (req, res) => {
  const { bloodGroup, city, availableFrom } = req.body || {};
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!validGroups.includes(bloodGroup) || !String(city || '').trim() || !availableFrom || Number.isNaN(Date.parse(availableFrom))) {
    return sendResponse(res, 400, false, 'Blood group, city and a valid availability date are required.');
  }
  const offer = await DonationOffer.create({ donorId: req.user.id, bloodGroup, city: city.trim(), availableFrom: new Date(availableFrom) });
  return sendResponse(res, 201, true, 'Donation offer published', offer);
}));

router.get('/matches', asyncHandler(async (req, res) => {
  const matches = await DonationMatch.find({ donorId: req.user.id }).sort({ createdAt: -1 }).lean();
  const result = await Promise.all(matches.map(async (match) => {
    const request = match.requestId ? await BloodRequest.findById(match.requestId).select('units hospital requiredDate').lean() : null;
    const row = { ...match, request: request || null };
    if (PRIVATE_STATUSES.has(match.status)) row.patient = await Patient.findById(match.patientId).select('name phone email address city').lean();
    return row;
  }));
  return sendResponse(res, 200, true, 'Donation history and matches', result);
}));

router.get('/notifications', asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipientId: req.user.id, recipientRole: 'donor' }).sort({ createdAt: -1 }).limit(100).lean();
  return sendResponse(res, 200, true, 'Notifications', notifications);
}));

router.patch('/notifications/:id/read', asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipientId: req.user.id, recipientRole: 'donor' }, { $set: { readAt: new Date() } }, { new: true }).lean();
  if (!notification) return sendResponse(res, 404, false, 'Notification not found');
  return sendResponse(res, 200, true, 'Notification marked as read', notification);
}));

export default router;
