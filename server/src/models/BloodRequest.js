import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  units: { type: Number, required: true, min: 1, max: 10 },
  hospital: { type: String, required: true, trim: true, maxlength: 150 },
  city: { type: String, required: true, trim: true, maxlength: 100, index: true },
  urgency: { type: String, enum: ['Normal', 'Urgent', 'Immediate'], default: 'Urgent' },
  requiredDate: { type: Date, required: true },
  contactPhone: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Requested', 'Pending Admin Approval', 'Approved', 'Scheduled', 'Completed', 'Rejected', 'Cancelled'], default: 'Requested', index: true },
  statusHistory: [{ status: { type: String, enum: ['Requested', 'Accepted by Donor', 'Pending Admin Approval', 'Approved', 'Scheduled', 'Completed', 'Rejected', 'Cancelled'] }, actorRole: { type: String, enum: ['patient', 'donor', 'admin', 'system'] }, changedAt: { type: Date, default: Date.now } }],
  contactLogs: [{ hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }, hospitalName: String, contactedAt: { type: Date, default: Date.now }, notes: String }]
}, { timestamps: true });

export default mongoose.model('BloodRequest', bloodRequestSchema);
