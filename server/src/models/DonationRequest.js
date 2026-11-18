import mongoose from 'mongoose';

const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const statuses = ['pending', 'approved', 'completed', 'rejected', 'cancelled', 'expired'];

const donationRequestSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true, index: true },
  bloodGroup: { type: String, enum: groups, required: true },
  units: { type: Number, min: 1, max: 1, default: 1, required: true },
  preferredDate: { type: Date, required: true },
  center: { type: String, required: true, trim: true, maxlength: 150 },
  status: { type: String, enum: statuses, default: 'pending', index: true },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  idempotencyKey: { type: String, select: false },
  statusHistory: [{
    status: { type: String, enum: statuses, required: true },
    at: { type: Date, default: Date.now },
    by: { type: mongoose.Schema.Types.ObjectId, default: null }
  }]
}, { timestamps: true });

donationRequestSchema.index(
  { donor: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'approved'] } }, name: 'one_active_donation_request_per_donor' }
);
donationRequestSchema.index(
  { donor: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } }, name: 'donation_request_idempotency' }
);

export default mongoose.model('DonationRequest', donationRequestSchema);
