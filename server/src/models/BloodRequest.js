import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  patientName: { type: String, required: true, trim: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  units: { type: Number, required: true, min: 1, default: 1 },
  hospital: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  urgency: { type: String, enum: ['Normal', 'Urgent', 'Immediate'], default: 'Urgent' },
  status: { type: String, enum: ['Open', 'Pending', 'Confirmed', 'Fulfilled', 'Cancelled'], default: 'Open' },
  assignedDonorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', default: null },
  donationDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('BloodRequest', bloodRequestSchema);
