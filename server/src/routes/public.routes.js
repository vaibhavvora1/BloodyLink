import { Router } from 'express';
import BloodStock from '../models/BloodStock.js';
import { BLOOD_GROUPS, stockStatus } from '../services/bloodStock.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';

const router = Router();

router.get('/stock/summary', asyncHandler(async (_req, res) => {
  const rows = await BloodStock.find().select('bloodGroup availableUnits').lean();
  const byGroup = new Map(rows.map((item) => [item.bloodGroup, item.availableUnits]));
  const data = BLOOD_GROUPS.map((bloodGroup) => {
    const availableUnits = byGroup.get(bloodGroup) || 0;
    const status = stockStatus(availableUnits);
    return { bloodGroup, totalUnits: availableUnits, availableUnits, status };
  });
  return sendResponse(res, 200, true, 'Blood stock summary', data);
}));

router.get('/stock', asyncHandler(async (req, res) => {
  const filter = { availableUnits: { $gt: 0 } };
  if (req.query.bloodGroup && BLOOD_GROUPS.includes(req.query.bloodGroup)) filter.bloodGroup = req.query.bloodGroup;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(8, Math.max(1, Number.parseInt(req.query.limit, 10) || 8));
  const [data, total] = await Promise.all([
    BloodStock.find(filter).select('-_id bloodGroup availableUnits updatedAt').sort({ bloodGroup: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    BloodStock.countDocuments(filter)
  ]);
  const rows = data.map((item) => ({ ...item, status: stockStatus(item.availableUnits) }));
  return sendResponse(res, 200, true, 'Blood availability', { data: rows, page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) });
}));

export default router;
