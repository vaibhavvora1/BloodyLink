import { Router } from 'express';
import BloodStock from '../models/BloodStock.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';
import { BLOOD_GROUPS, stockStatus } from '../services/bloodStock.service.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const stock = await BloodStock.find().select('-_id bloodGroup availableUnits incomingUnits updatedAt').sort({ bloodGroup: 1 }).lean();
  const byGroup = new Map(stock.map((item) => [item.bloodGroup, item]));
  const data = BLOOD_GROUPS.map((bloodGroup) => {
    const item = byGroup.get(bloodGroup) || { bloodGroup, availableUnits: 0, incomingUnits: 0 };
    return { ...item, status: stockStatus(item.availableUnits) };
  });
  return sendResponse(res, 200, true, 'Blood stock', data);
}));

export default router;
