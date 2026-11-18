import { Router } from 'express';
import Patient from '../models/Patient.js';
import Donor from '../models/Donor.js';
import BloodRequest from '../models/BloodRequest.js';
import DonationOffer from '../models/DonationOffer.js';
import DonationMatch from '../models/DonationMatch.js';
import Notification from '../models/Notification.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { patientProfileUpdateSchema } from '../utils/authValidation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/response.js';

const router = Router();
router.use(authenticate, authorize('patient'));
const PROFILE_FIELDS = 'name email phone city address dateOfBirth age bloodGroup gender hospital emergencyContact medicalNotes createdAt';
const PRIVATE_STATUSES = new Set(['Approved', 'Scheduled', 'Completed']);
const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

router.get('/dashboard', (req, res) => sendResponse(res, 200, true, 'Patient dashboard', req.user));

router.get('/profile', asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.user.id).select(PROFILE_FIELDS).lean();
  if (!patient) return sendResponse(res, 404, false, 'Patient not found');
  return sendResponse(res, 200, true, 'Patient profile', patient);
}));

router.put('/profile', validateBody(patientProfileUpdateSchema), asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.dateOfBirth !== undefined) update.dateOfBirth = update.dateOfBirth ? new Date(update.dateOfBirth) : null;
  const patient = await Patient.findByIdAndUpdate(req.user.id, { $set: update }, { new: true, runValidators: true }).select(PROFILE_FIELDS).lean();
  if (!patient) return sendResponse(res, 404, false, 'Patient not found');
  return sendResponse(res, 200, true, 'Profile updated successfully', patient);
}));

router.post('/requests', asyncHandler(async (req, res) => {
  const { bloodGroup, units, hospital, city, urgency, requiredDate, contactPhone } = req.body || {};
  const count = Number(units);
  if (!groups.includes(bloodGroup) || !Number.isInteger(count) || count < 1 || count > 10 || !String(hospital || '').trim() || !String(city || '').trim() || !String(contactPhone || '').trim() || !requiredDate || Number.isNaN(Date.parse(requiredDate))) {
    return sendResponse(res, 400, false, 'Enter a valid blood group, units, hospital, city, required date and contact phone.');
  }
  const request = await BloodRequest.create({ patientId: req.user.id, bloodGroup, units: count, hospital: hospital.trim(), city: city.trim(), urgency: ['Normal', 'Urgent', 'Immediate'].includes(urgency) ? urgency : 'Urgent', requiredDate: new Date(requiredDate), contactPhone: contactPhone.trim(), statusHistory: [{ status: 'Requested', actorRole: 'patient' }] });
  return sendResponse(res, 201, true, 'Blood request created', request);
}));

router.get('/requests', asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find({ patientId: req.user.id }).sort({ createdAt: -1 }).lean();
  return sendResponse(res, 200, true, 'Your blood requests', requests);
}));

router.get('/offers', asyncHandler(async (req, res) => {
  const query = { isActive: true };
  if (req.query.bloodGroup && groups.includes(req.query.bloodGroup)) query.bloodGroup = req.query.bloodGroup;
  if (req.query.city) query.city = { $regex: String(req.query.city).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const offers = await DonationOffer.find(query).select('bloodGroup city availableFrom createdAt').sort({ availableFrom: 1 }).limit(100).lean();
  return sendResponse(res, 200, true, 'Available donation offers', offers);
}));

router.post('/offers/:id/request', asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.user.id).select('bloodGroup city');
  const offer = await DonationOffer.findOne({ _id: req.params.id, isActive: true });
  if (!offer) return sendResponse(res, 404, false, 'This donation offer is no longer available.');
  if (!patient) return sendResponse(res, 404, false, 'Patient not found.');
  if (patient.bloodGroup !== offer.bloodGroup) return sendResponse(res, 400, false, 'This offer does not match your registered blood group.');
  const request = await BloodRequest.findOne({ patientId: patient._id, bloodGroup: offer.bloodGroup, status: 'Requested' }).sort({ createdAt: -1 });
  if (!request) return sendResponse(res, 400, false, 'Create an open blood request for this blood group before requesting an offer.');
  const donor = await Donor.findById(offer.donorId).select('_id');
  if (!donor) return sendResponse(res, 400, false, 'The donor is not currently available.');
  const match = await DonationMatch.create({ patientId: patient._id, donorId: donor._id, requestId: request._id, offerId: offer._id, bloodGroup: offer.bloodGroup, city: offer.city, status: 'Pending Admin Approval', statusHistory: [{ status: 'Requested', actorRole: 'patient' }, { status: 'Pending Admin Approval', actorRole: 'system' }] });
  request.status = 'Pending Admin Approval';
  request.statusHistory.push({ status: 'Pending Admin Approval', actorRole: 'system' });
  await request.save();
  return sendResponse(res, 201, true, 'Donor request sent for admin approval', { matchId: match.id, status: match.status });
}));

router.get('/matches', asyncHandler(async (req, res) => {
  const matches = await DonationMatch.find({ patientId: req.user.id }).sort({ createdAt: -1 }).lean();
  const result = await Promise.all(matches.map(async (match) => {
    const request = match.requestId ? await BloodRequest.findById(match.requestId).select('units hospital requiredDate').lean() : null;
    const row = { ...match, request: request || null };
    if (PRIVATE_STATUSES.has(match.status)) row.donor = await Donor.findById(match.donorId).select('name phone email city bloodGroup address').lean();
    return row;
  }));
  return sendResponse(res, 200, true, 'Your matches', result);
}));

router.get('/notifications', asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipientId: req.user.id, recipientRole: 'patient' }).sort({ createdAt: -1 }).limit(100).lean();
  return sendResponse(res, 200, true, 'Notifications', notifications);
}));

router.patch('/notifications/:id/read', asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipientId: req.user.id, recipientRole: 'patient' }, { $set: { readAt: new Date() } }, { new: true }).lean();
  if (!notification) return sendResponse(res, 404, false, 'Notification not found');
  return sendResponse(res, 200, true, 'Notification marked as read', notification);
}));

export default router;
