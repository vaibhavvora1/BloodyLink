import { Router } from 'express';
import { z } from 'zod';
import DonationRequest from '../models/DonationRequest.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { donationRequestRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';
import { cancelDonationRequest, createDonationRequest } from '../services/donationRequest.service.js';

const router = Router();
const preferredDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid preferred date.').refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Choose a valid calendar date.');
const requestSchema = z.object({
  preferredDate: preferredDateSchema,
  center: z.string().trim().min(2).max(150)
}).strict();
const pageSchema = z.coerce.number().int().min(1).max(100000);
const validIdempotencyKey = /^[A-Za-z0-9._:-]{8,128}$/;
router.use(authenticate, authorize('donor'));

router.post('/request', donationRequestRateLimiter, asyncHandler(async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  const key = req.get('Idempotency-Key') || '';
  if (!parsed.success) return sendResponse(res, 400, false, parsed.error.issues[0]?.message || 'Invalid donation request.');
  if (!validIdempotencyKey.test(key)) return sendResponse(res, 400, false, 'A valid Idempotency-Key header is required.');
  const result = await createDonationRequest({ donorId: req.user.id, ...parsed.data, idempotencyKey: key });
  return sendResponse(res, result.replayed ? 200 : 201, true, result.replayed ? 'Existing donation request returned' : 'Donation request submitted', result.request);
}));

router.get('/my', asyncHandler(async (req, res) => {
  const parsed = pageSchema.safeParse(req.query.page || 1);
  if (!parsed.success) return sendResponse(res, 400, false, 'Page must be a positive integer.');
  const page = parsed.data;
  const limit = 10;
  const filter = { donor: req.user.id };
  const [data, total] = await Promise.all([
    DonationRequest.find(filter).select('bloodGroup units preferredDate center status createdAt updatedAt').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    DonationRequest.countDocuments(filter)
  ]);
  return sendResponse(res, 200, true, 'Your donation requests', { data, page, limit, total, pages: Math.ceil(total / limit) });
}));

router.patch('/:id/cancel', asyncHandler(async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) return sendResponse(res, 400, false, 'Invalid donation request ID.');
  const request = await cancelDonationRequest({ requestId: req.params.id, donorId: req.user.id });
  return sendResponse(res, 200, true, 'Donation request cancelled', request);
}));

export default router;
