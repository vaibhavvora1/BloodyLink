import { Router } from 'express';
import Donor from '../models/Donor.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { donorAvailabilitySchema } from '../utils/authValidation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';

const router = Router();
router.use(authenticate, authorize('donor'));

router.get('/dashboard', (req, res) => sendResponse(res, 200, true, 'Donor dashboard', req.user));

router.get('/profile', asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user.id).select('name email phone bloodGroup age gender city lastDonationDate isAvailable createdAt').lean();
  return sendResponse(res, 200, true, 'Donor profile', donor);
}));

router.patch('/availability', validateBody(donorAvailabilitySchema), asyncHandler(async (req, res) => {
  const donor = await Donor.findByIdAndUpdate(
    req.user.id,
    { $set: { isAvailable: req.body.isAvailable } },
    { new: true, runValidators: true }
  ).select('name isAvailable').lean();
  return sendResponse(res, 200, true, 'Availability updated', donor);
}));

export default router;
