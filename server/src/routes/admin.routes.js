import { Router } from 'express';
import Donor from '../models/Donor.js';
import Patient from '../models/Patient.js';
import BloodRequest from '../models/BloodRequest.js';
import DonationOffer from '../models/DonationOffer.js';
import DonationMatch from '../models/DonationMatch.js';
import BloodStock from '../models/BloodStock.js';
import Hospital from '../models/Hospital.js';
import Notification from '../models/Notification.js';
import DonationRequest from '../models/DonationRequest.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';
import { hospitalCreateSchema, hospitalUpdateSchema } from '../utils/authValidation.js';
import { stockStatus } from '../services/bloodStock.service.js';

const router = Router();
router.use(authenticate, authorize('admin'));
const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const statuses = ['Requested', 'Pending Admin Approval', 'Approved', 'Scheduled', 'Completed', 'Rejected', 'Cancelled'];
const getFilter = (query, fields) => {
  const filter = {};
  if (query.status && (statuses.includes(query.status) || query.status === 'Available')) filter[query.status === 'Available' ? 'isActive' : 'status'] = query.status === 'Available' ? true : query.status;
  if (query.bloodGroup && groups.includes(query.bloodGroup)) filter.bloodGroup = query.bloodGroup;
  if (query.city) filter.city = { $regex: String(query.city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  return filter;
};

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const [donors, patients, requests, pendingMatches, stockUnits] = await Promise.all([
    Donor.countDocuments(), Patient.countDocuments(), BloodRequest.countDocuments(),
    DonationMatch.countDocuments({ status: 'Pending Admin Approval' }),
    BloodStock.aggregate([{ $group: { _id: null, units: { $sum: '$availableUnits' }, incomingUnits: { $sum: '$incomingUnits' } } }])
  ]);
  return sendResponse(res, 200, true, 'Admin dashboard', { donors, patients, requests, pendingMatches, stockUnits: stockUnits[0]?.units || 0, incomingUnits: stockUnits[0]?.incomingUnits || 0 });
}));

router.get('/donors', asyncHandler(async (_req, res) => {
  const donors = await Donor.find().select('name email phone bloodGroup age gender city lastDonationDate isAvailable isActive isBlocked createdAt').sort({ createdAt: -1 }).limit(500).lean();
  return sendResponse(res, 200, true, 'Donors', donors);
}));
router.patch('/donors/:id/status', asyncHandler(async (req, res) => {
  const update = {};
  for (const key of ['isActive', 'isBlocked']) {
    if (req.body?.[key] !== undefined) {
      if (typeof req.body[key] !== 'boolean') return sendResponse(res, 400, false, `${key} must be true or false.`);
      update[key] = req.body[key];
    }
  }
  if (!Object.keys(update).length || Object.keys(req.body || {}).some((key) => !['isActive', 'isBlocked'].includes(key))) return sendResponse(res, 400, false, 'Provide only isActive and/or isBlocked.');
  const donor = await Donor.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).select('name isActive isBlocked').lean();
  if (!donor) return sendResponse(res, 404, false, 'Donor not found');
  return sendResponse(res, 200, true, 'Donor status updated', donor);
}));
router.delete('/donors/:id', asyncHandler(async (req, res) => {
  if (await DonationRequest.exists({ donor: req.params.id, status: { $in: ['pending', 'approved'] } })) return sendResponse(res, 409, false, 'Resolve active donation requests before deleting this donor.');
  const donor = await Donor.findByIdAndDelete(req.params.id);
  if (!donor) return sendResponse(res, 404, false, 'Donor not found');
  await DonationOffer.deleteMany({ donorId: donor._id });
  await DonationMatch.updateMany({ donorId: donor._id, status: { $nin: ['Completed', 'Rejected', 'Cancelled'] } }, { $set: { status: 'Cancelled' } });
  return sendResponse(res, 200, true, 'Donor deleted');
}));
router.get('/patients', asyncHandler(async (_req, res) => {
  const patients = await Patient.find().select('name email phone bloodGroup city hospital createdAt').sort({ createdAt: -1 }).limit(500).lean();
  return sendResponse(res, 200, true, 'Patients', patients);
}));
router.delete('/patients/:id', asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) return sendResponse(res, 404, false, 'Patient not found');
  await BloodRequest.deleteMany({ patientId: patient._id });
  await DonationMatch.updateMany({ patientId: patient._id, status: { $nin: ['Completed', 'Rejected', 'Cancelled'] } }, { $set: { status: 'Cancelled' } });
  return sendResponse(res, 200, true, 'Patient and open requests deleted');
}));

router.get('/requests', asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find(getFilter(req.query, ['status', 'bloodGroup', 'city'])).sort({ createdAt: -1 }).limit(500).lean();
  const data = await Promise.all(requests.map(async (item) => ({ ...item, patient: await Patient.findById(item.patientId).select('name email phone').lean() })));
  return sendResponse(res, 200, true, 'Blood requests', data);
}));
router.patch('/requests/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!['Cancelled', 'Completed'].includes(status)) return sendResponse(res, 400, false, 'Status must be Cancelled or Completed.');
  const request = await BloodRequest.findByIdAndUpdate(req.params.id, { $set: { status }, $push: { statusHistory: { status, actorRole: 'admin' } } }, { new: true }).lean();
  if (!request) return sendResponse(res, 404, false, 'Request not found');
  return sendResponse(res, 200, true, 'Request status updated', request);
}));

router.get('/offers', asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status === 'Available') filter.isActive = true;
  if (req.query.status === 'Inactive') filter.isActive = false;
  if (req.query.bloodGroup && groups.includes(req.query.bloodGroup)) filter.bloodGroup = req.query.bloodGroup;
  if (req.query.city) filter.city = { $regex: String(req.query.city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const offers = await DonationOffer.find(filter).sort({ createdAt: -1 }).limit(500).lean();
  const data = await Promise.all(offers.map(async (offer) => ({ ...offer, donor: await Donor.findById(offer.donorId).select('name email phone bloodGroup city isAvailable').lean() })));
  return sendResponse(res, 200, true, 'Donation offers', data);
}));
router.delete('/offers/:id', asyncHandler(async (req, res) => {
  const offer = await DonationOffer.findByIdAndDelete(req.params.id);
  if (!offer) return sendResponse(res, 404, false, 'Offer not found');
  return sendResponse(res, 200, true, 'Offer deleted');
}));
router.patch('/offers/:id/status', asyncHandler(async (req, res) => {
  if (typeof req.body?.isActive !== 'boolean') return sendResponse(res, 400, false, 'Offer availability must be true or false.');
  const offer = await DonationOffer.findByIdAndUpdate(req.params.id, { $set: { isActive: req.body.isActive } }, { new: true }).lean();
  if (!offer) return sendResponse(res, 404, false, 'Offer not found');
  return sendResponse(res, 200, true, 'Offer status updated', offer);
}));

router.get('/matches', asyncHandler(async (req, res) => {
  const matches = await DonationMatch.find(getFilter(req.query, ['status', 'bloodGroup', 'city'])).sort({ createdAt: -1 }).limit(500).lean();
  const data = await Promise.all(matches.map(async (match) => ({
    ...match,
    patient: await Patient.findById(match.patientId).select('name email phone city address').lean(),
    donor: await Donor.findById(match.donorId).select('name email phone city address bloodGroup').lean(),
    request: match.requestId ? await BloodRequest.findById(match.requestId).lean() : null
  })));
  return sendResponse(res, 200, true, 'Donor-patient matches', data);
}));
router.patch('/matches/:id/status', asyncHandler(async (req, res) => {
  const { status, rejectionReason = '' } = req.body || {};
  if (!['Approved', 'Rejected', 'Completed', 'Cancelled'].includes(status)) return sendResponse(res, 400, false, 'Unsupported match status.');
  const match = await DonationMatch.findById(req.params.id);
  if (!match) return sendResponse(res, 404, false, 'Match not found');
  if (status === 'Approved' && match.status !== 'Pending Admin Approval') return sendResponse(res, 400, false, 'Only pending matches can be approved.');
  if (status === 'Completed' && match.status !== 'Scheduled') return sendResponse(res, 400, false, 'Only scheduled matches can be completed.');
  match.status = status;
  match.statusHistory.push({ status, actorRole: 'admin' });
  if (status === 'Rejected') match.rejectionReason = String(rejectionReason).slice(0, 500);
  await match.save();
  if (match.requestId) await BloodRequest.findByIdAndUpdate(match.requestId, { $set: { status }, $push: { statusHistory: { status, actorRole: 'admin' } } });
  if (status === 'Completed') await Donor.findByIdAndUpdate(match.donorId, { $set: { lastDonationDate: match.appointment?.date || new Date() } });
  return sendResponse(res, 200, true, `Match ${status.toLowerCase()}`, match);
}));

router.post('/matches/:id/schedule', asyncHandler(async (req, res) => {
  const { date, time, place, hospital, address, contactPerson, instructions, messageTemplate } = req.body || {};
  if (!date || Number.isNaN(Date.parse(date)) || !time || !place?.trim() || !hospital?.trim() || !address?.trim() || !contactPerson?.trim() || !instructions?.trim() || !messageTemplate?.trim()) {
    return sendResponse(res, 400, false, 'Date, time, place, hospital, address, contact person, instructions and message template are required.');
  }
  const appointmentDay = new Date(date); appointmentDay.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (appointmentDay < today) return sendResponse(res, 400, false, 'Scheduled date cannot be in the past.');
  const match = await DonationMatch.findById(req.params.id);
  if (!match) return sendResponse(res, 404, false, 'Match not found');
  if (match.status !== 'Approved') return sendResponse(res, 400, false, 'Approve the match before scheduling it.');
  match.status = 'Scheduled';
  match.statusHistory.push({ status: 'Scheduled', actorRole: 'admin' });
  match.appointment = { date: new Date(date), time, place: place.trim(), hospital: hospital.trim(), address: address.trim(), contactPerson: contactPerson.trim(), instructions: instructions.trim(), messageTemplate: messageTemplate.trim() };
  await match.save();
  if (match.requestId) await BloodRequest.findByIdAndUpdate(match.requestId, { $set: { status: 'Scheduled' }, $push: { statusHistory: { status: 'Scheduled', actorRole: 'admin' } } });
  const values = { date: new Date(date).toLocaleDateString('en-IN'), time, place: place.trim(), hospital: hospital.trim(), address: address.trim(), contactPerson: contactPerson.trim(), instructions: instructions.trim() };
  const introduction = messageTemplate.replace(/\{(date|time|place|hospital|address|contactPerson|instructions)\}/g, (_all, key) => values[key]);
  const message = `${introduction}\n\nDate: ${values.date}\nTime: ${values.time}\nPlace: ${values.place}\nHospital: ${values.hospital}\nAddress: ${values.address}\nContact person: ${values.contactPerson}\nInstructions: ${values.instructions}`;
  await Notification.insertMany([
    { recipientId: match.donorId, recipientRole: 'donor', matchId: match._id, title: 'Donation scheduled', message },
    { recipientId: match.patientId, recipientRole: 'patient', matchId: match._id, title: 'Donation scheduled', message }
  ]);
  return sendResponse(res, 200, true, 'Donation scheduled and both users notified', match);
}));

router.get('/stock', asyncHandler(async (req, res) => {
  const filter = {};
  const search = String(req.query.search || '').trim().toUpperCase();
  if (req.query.bloodGroup && !groups.includes(req.query.bloodGroup)) return sendResponse(res, 400, false, 'Invalid blood group.');
  if (search) {
    const matchingGroups = groups.filter((group) => group.includes(search));
    filter.bloodGroup = req.query.bloodGroup && matchingGroups.includes(req.query.bloodGroup)
      ? req.query.bloodGroup
      : { $in: req.query.bloodGroup ? [] : matchingGroups };
  } else if (req.query.bloodGroup) {
    filter.bloodGroup = req.query.bloodGroup;
  }
  if (req.query.status) {
    const ranges = { Critical: { $lt: 5 }, Low: { $gte: 5, $lt: 10 }, Available: { $gte: 10 } };
    if (!ranges[req.query.status]) return sendResponse(res, 400, false, 'Invalid stock status.');
    filter.availableUnits = ranges[req.query.status];
  }
  const items = await BloodStock.find(filter).select('bloodGroup availableUnits incomingUnits updatedAt updatedBy').sort({ bloodGroup: 1 }).lean();
  const stock = items.map((item) => ({ ...item, status: stockStatus(item.availableUnits) }));
  return sendResponse(res, 200, true, 'Blood stock', stock);
}));
router.post('/stock', asyncHandler(async (req, res) => {
  const { bloodGroup, units } = req.body || {};
  const count = Number(units);
  if (!groups.includes(bloodGroup) || !Number.isInteger(count) || count < 1) return sendResponse(res, 400, false, 'Select a blood group and enter a positive whole number of units.');
  const stock = await BloodStock.findOneAndUpdate({ bloodGroup }, { $inc: { availableUnits: count }, $set: { updatedBy: req.user.id } }, { new: true, runValidators: true, upsert: true }).lean();
  return sendResponse(res, 200, true, 'Available stock increased', stock);
}));
router.put('/stock/:id', asyncHandler(async (req, res) => {
  const units = Number(req.body?.availableUnits ?? req.body?.units);
  if (!Number.isInteger(units) || units < 0) return sendResponse(res, 400, false, 'Available units must be a non-negative whole number.');
  const stock = await BloodStock.findByIdAndUpdate(req.params.id, { $set: { availableUnits: units, updatedBy: req.user.id } }, { new: true, runValidators: true }).lean();
  if (!stock) return sendResponse(res, 404, false, 'Stock record not found');
  return sendResponse(res, 200, true, 'Stock updated', stock);
}));
router.delete('/stock/:id', asyncHandler(async (req, res) => {
  const stock = await BloodStock.findOneAndUpdate({ _id: req.params.id, incomingUnits: 0 }, { $set: { availableUnits: 0, updatedBy: req.user.id } }, { new: true }).lean();
  if (!stock) {
    const exists = await BloodStock.exists({ _id: req.params.id });
    return sendResponse(res, exists ? 409 : 404, false, exists ? 'Resolve incoming donations before clearing this stock group.' : 'Stock record not found');
  }
  return sendResponse(res, 200, true, 'Available stock cleared', stock);
}));

router.get('/hospitals', asyncHandler(async (_req, res) => sendResponse(res, 200, true, 'Hospital directory', await Hospital.find().sort({ city: 1, name: 1 }).lean())));
router.get('/messages', asyncHandler(async (_req, res) => sendResponse(res, 200, true, 'Scheduled messages', await Notification.find().sort({ createdAt: -1 }).limit(500).lean())));
router.post('/hospitals', validateBody(hospitalCreateSchema), asyncHandler(async (req, res) => {
  const hospital = await Hospital.create(req.body);
  return sendResponse(res, 201, true, 'Hospital added', hospital);
}));
router.put('/hospitals/:id', validateBody(hospitalUpdateSchema), asyncHandler(async (req, res) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean();
  if (!hospital) return sendResponse(res, 404, false, 'Hospital not found');
  return sendResponse(res, 200, true, 'Hospital updated', hospital);
}));
router.delete('/hospitals/:id', asyncHandler(async (req, res) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  if (!hospital) return sendResponse(res, 404, false, 'Hospital not found');
  return sendResponse(res, 200, true, 'Hospital removed', hospital);
}));
router.post('/requests/:id/contact', asyncHandler(async (req, res) => {
  const { hospitalId, notes = '' } = req.body || {};
  const [request, hospital] = await Promise.all([BloodRequest.findById(req.params.id), Hospital.findById(hospitalId)]);
  if (!request || !hospital) return sendResponse(res, 404, false, 'Request or hospital not found');
  request.contactLogs.push({ hospitalId: hospital._id, hospitalName: hospital.name, contactedAt: new Date(), notes: String(notes).slice(0, 500) });
  await request.save();
  return sendResponse(res, 200, true, 'Hospital contact logged on request', request.contactLogs.at(-1));
}));

export default router;
