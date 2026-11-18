import { Router } from 'express';
import { z } from 'zod';
import DonationRequest from '../models/DonationRequest.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';
import { changeDonationRequestStatus } from '../services/donationRequest.service.js';

const router = Router();
const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const statuses = ['pending', 'approved', 'completed', 'rejected', 'cancelled', 'expired'];
const pageSchema = z.coerce.number().int().min(1).max(100000);
router.use(authenticate, authorize('admin'));

router.get('/', asyncHandler(async (req, res) => {
  const pageResult = pageSchema.safeParse(req.query.page || 1);
  if (!pageResult.success) return sendResponse(res, 400, false, 'Page must be a positive integer.');
  if (req.query.status && !statuses.includes(req.query.status)) return sendResponse(res, 400, false, 'Invalid donation request status.');
  if (req.query.bloodGroup && !groups.includes(req.query.bloodGroup)) return sendResponse(res, 400, false, 'Invalid blood group.');
  const page = pageResult.data;
  const limit = 20;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
  const [data, total] = await Promise.all([
    DonationRequest.find(filter).select('donor bloodGroup units preferredDate center status createdAt').populate('donor', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    DonationRequest.countDocuments(filter)
  ]);
  return sendResponse(res, 200, true, 'Donation requests', { data, page, limit, total, pages: Math.ceil(total / limit) });
}));

router.patch('/:id/:action', asyncHandler(async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) return sendResponse(res, 400, false, 'Invalid donation request ID.');
  if (!['approve', 'reject', 'complete'].includes(req.params.action)) return sendResponse(res, 404, false, 'Donation request action not found.');
  const request = await changeDonationRequestStatus({ requestId: req.params.id, adminId: req.user.id, action: req.params.action });
  return sendResponse(res, 200, true, `Donation request ${request.status}`, request);
}));

export default router;
