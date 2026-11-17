import { Router } from 'express';
import Patient from '../models/Patient.js';
import Donor from '../models/Donor.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateBody, validateQuery } from '../middlewares/validate.middleware.js';
import { donorSearchSchema, patientProfileUpdateSchema } from '../utils/authValidation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';

const router = Router();
router.use(authenticate, authorize('patient'));

const PATIENT_PROFILE_FIELDS = 'name email phone city address dateOfBirth bloodGroup gender hospital emergencyContact createdAt';

router.get('/dashboard', (req, res) => sendResponse(res, 200, true, 'Patient dashboard', req.user));

router.get('/profile', asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.user.id).select(PATIENT_PROFILE_FIELDS).lean();
  if (!patient) return sendResponse(res, 404, false, 'Patient not found');
  return sendResponse(res, 200, true, 'Patient profile', patient);
}));

router.put('/profile', validateBody(patientProfileUpdateSchema), asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.dateOfBirth) {
    update.dateOfBirth = new Date(update.dateOfBirth);
  } else if (update.dateOfBirth === '') {
    update.dateOfBirth = null;
  }

  const patient = await Patient.findByIdAndUpdate(
    req.user.id,
    { $set: update },
    { new: true, runValidators: true }
  ).select(PATIENT_PROFILE_FIELDS).lean();

  if (!patient) return sendResponse(res, 404, false, 'Patient not found');
  return sendResponse(res, 200, true, 'Profile updated successfully', patient);
}));

router.get('/donors', validateQuery(donorSearchSchema), asyncHandler(async (req, res) => {
  const { bloodGroup, city } = req.validatedQuery;
  const query = { isAvailable: true };
  if (bloodGroup) query.bloodGroup = bloodGroup;
  if (city) query.city = { $regex: city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const donors = await Donor.find(query).select('name bloodGroup city lastDonationDate isAvailable').limit(100).lean();
  return sendResponse(res, 200, true, 'Available donors', donors);
}));

export default router;
