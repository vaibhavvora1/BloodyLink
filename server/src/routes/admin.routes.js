import { Router } from 'express';
import Donor from '../models/Donor.js';
import Patient from '../models/Patient.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';

const router = Router();
router.use(authenticate, authorize('admin'));

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const [donors, patients] = await Promise.all([Donor.countDocuments(), Patient.countDocuments()]);
  return sendResponse(res, 200, true, 'Admin dashboard', { donors, patients });
}));

router.get('/donors', asyncHandler(async (_req, res) => {
  const donors = await Donor.find().select('name email phone bloodGroup age gender city lastDonationDate isAvailable createdAt').sort({ createdAt: -1 }).limit(500).lean();
  return sendResponse(res, 200, true, 'Donors', donors);
}));

router.get('/patients', asyncHandler(async (_req, res) => {
  const patients = await Patient.find().select('name email phone bloodGroup city hospital createdAt').sort({ createdAt: -1 }).limit(500).lean();
  return sendResponse(res, 200, true, 'Patients', patients);
}));

export default router;
