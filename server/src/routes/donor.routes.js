import { Router } from 'express';
import Donor from '../models/Donor.js';
import BloodRequest from '../models/BloodRequest.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { donorAvailabilitySchema, donorProfileUpdateSchema } from '../utils/authValidation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';

const router = Router();
router.use(authenticate, authorize('donor'));

const DONOR_PROFILE_FIELDS = 'name email phone city address dateOfBirth bloodGroup gender weight lastDonationDate isAvailable createdAt';
const MIN_DONATION_INTERVAL_MS = 56 * 24 * 60 * 60 * 1000;

const calculateAge = (dob) => {
  const diff = Date.now() - dob.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

router.get('/dashboard', (req, res) => sendResponse(res, 200, true, 'Donor dashboard', req.user));

router.get('/profile', asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user.id).select(DONOR_PROFILE_FIELDS).lean();
  if (!donor) return sendResponse(res, 404, false, 'Donor not found');
  return sendResponse(res, 200, true, 'Donor profile', donor);
}));

router.put('/profile', validateBody(donorProfileUpdateSchema), asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.dateOfBirth) {
    update.dateOfBirth = new Date(update.dateOfBirth);
    update.age = calculateAge(update.dateOfBirth);
  } else if (update.dateOfBirth === '') {
    update.dateOfBirth = null;
  }
  if (update.lastDonationDate) {
    update.lastDonationDate = new Date(update.lastDonationDate);
  } else if (update.lastDonationDate === '') {
    update.lastDonationDate = null;
  }

  const donor = await Donor.findByIdAndUpdate(
    req.user.id,
    { $set: update },
    { new: true, runValidators: true }
  ).select(DONOR_PROFILE_FIELDS).lean();

  if (!donor) return sendResponse(res, 404, false, 'Donor not found');
  return sendResponse(res, 200, true, 'Profile updated successfully', donor);
}));

router.patch('/availability', validateBody(donorAvailabilitySchema), asyncHandler(async (req, res) => {
  const donor = await Donor.findByIdAndUpdate(
    req.user.id,
    { $set: { isAvailable: req.body.isAvailable } },
    { new: true, runValidators: true }
  ).select('name isAvailable').lean();
  return sendResponse(res, 200, true, 'Availability updated', donor);
}));

router.get('/requests', asyncHandler(async (_req, res) => {
  let requests = await BloodRequest.find({ status: { $in: ['Open', 'Pending'] } })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  if (requests.length === 0) {
    const seed = [
      { patientName: 'Priya Sharma', bloodGroup: 'O+', units: 2, hospital: 'Lilavati Hospital', city: 'Mumbai', urgency: 'Immediate', status: 'Open' },
      { patientName: 'Rahul Verma', bloodGroup: 'A+', units: 1, hospital: 'Apollo Spectra', city: 'Delhi', urgency: 'Urgent', status: 'Open' },
      { patientName: 'Sneha Patel', bloodGroup: 'B-', units: 3, hospital: 'Fortis Hospital', city: 'Bengaluru', urgency: 'Immediate', status: 'Open' }
    ];
    requests = await BloodRequest.insertMany(seed);
  }
  return sendResponse(res, 200, true, 'Active blood requests', requests);
}));

router.post('/requests/:id/confirm', asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user.id);
  if (!donor) return sendResponse(res, 404, false, 'Donor not found');

  if (donor.lastDonationDate) {
    const elapsed = Date.now() - new Date(donor.lastDonationDate).getTime();
    if (elapsed < MIN_DONATION_INTERVAL_MS) {
      const remainingDays = Math.ceil((MIN_DONATION_INTERVAL_MS - elapsed) / (24 * 60 * 60 * 1000));
      return sendResponse(res, 400, false, `Ineligible to donate. Please wait ${remainingDays} more day(s) between donations.`);
    }
  }

  const request = await BloodRequest.findById(req.params.id);
  if (!request) return sendResponse(res, 404, false, 'Blood request not found');
  if (request.status !== 'Open' && request.status !== 'Pending') {
    return sendResponse(res, 400, false, 'This blood request is no longer open');
  }

  const now = new Date();
  request.status = 'Confirmed';
  request.assignedDonorId = donor._id;
  request.donationDate = now;
  await request.save();

  donor.lastDonationDate = now;
  await donor.save();

  return sendResponse(res, 200, true, 'Donation confirmed successfully', {
    requestId: request._id,
    patientName: request.patientName,
    bloodGroup: request.bloodGroup,
    hospital: request.hospital,
    city: request.city,
    donationDate: now.toISOString()
  });
}));

export default router;
