import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  age: { type: Number, min: 0, max: 120 },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  address: { type: String, trim: true, maxlength: 200, default: '' },
  medicalNotes: { type: String, trim: true, maxlength: 1000, default: '' },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, enum: ['female', 'male', 'other', 'prefer_not_to_say'], default: 'prefer_not_to_say' },
  hospital: { type: String, required: true, trim: true, maxlength: 150 },
  emergencyContact: { type: String, trim: true, default: '' },
  refreshTokenHash: { type: String, select: false },
  failedLoginAttempts: { type: Number, default: 0, select: false },
  lockUntil: { type: Date, default: null, select: false },
  role: { type: String, enum: ['patient'], default: 'patient', immutable: true, required: true }
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
