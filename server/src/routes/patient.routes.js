import { Router } from 'express';
import Donor from '../models/Donor.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateQuery } from '../middlewares/validate.middleware.js';
import { donorSearchSchema } from '../utils/authValidation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';

const router = Router();
router.use(authenticate, authorize('patient'));

router.get('/dashboard', (req, res) => sendResponse(res, 200, true, 'Patient dashboard', req.user));

router.get('/donors', validateQuery(donorSearchSchema), asyncHandler(async (req, res) => {
  const { bloodGroup, city } = req.validatedQuery;
  const query = { isAvailable: true };
  if (bloodGroup) query.bloodGroup = bloodGroup;
  if (city) query.city = { $regex: city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const donors = await Donor.find(query).select('name bloodGroup city lastDonationDate isAvailable').limit(100).lean();
  return sendResponse(res, 200, true, 'Available donors', donors);
}));

export default router;
