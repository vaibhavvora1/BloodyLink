import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  age: { type: Number, required: true, min: 18, max: 100 },
  gender: { type: String, required: true, enum: ['female', 'male', 'other', 'prefer_not_to_say'] },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  lastDonationDate: { type: Date, default: null },
  isAvailable: { type: Boolean, default: true },
  refreshTokenHash: { type: String, select: false },
  failedLoginAttempts: { type: Number, default: 0, select: false },
  lockUntil: { type: Date, default: null, select: false },
  role: { type: String, enum: ['donor'], default: 'donor', immutable: true, required: true }
}, { timestamps: true });

export default mongoose.model('Donor', donorSchema);
