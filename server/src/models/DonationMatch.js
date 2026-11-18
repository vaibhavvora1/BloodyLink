import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  date: Date,
  time: String,
  place: String,
  hospital: String,
  address: String,
  contactPerson: String,
  instructions: String,
  messageTemplate: String
}, { _id: false });

const donationMatchSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true, index: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', default: null },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationOffer', default: null },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  city: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Pending Admin Approval', 'Approved', 'Scheduled', 'Completed', 'Rejected', 'Cancelled'], default: 'Pending Admin Approval', index: true },
  statusHistory: [{ status: { type: String, enum: ['Requested', 'Accepted by Donor', 'Pending Admin Approval', 'Approved', 'Scheduled', 'Completed', 'Rejected', 'Cancelled'] }, actorRole: { type: String, enum: ['patient', 'donor', 'admin', 'system'] }, changedAt: { type: Date, default: Date.now } }],
  appointment: { type: appointmentSchema, default: null },
  rejectionReason: { type: String, trim: true, maxlength: 500, default: '' }
}, { timestamps: true });

donationMatchSchema.index({ requestId: 1, donorId: 1 }, { unique: true, partialFilterExpression: { requestId: { $type: 'objectId' } } });
export default mongoose.model('DonationMatch', donationMatchSchema);
