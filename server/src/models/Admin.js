import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  refreshTokenHash: { type: String, select: false },
  failedLoginAttempts: { type: Number, default: 0, select: false },
  lockUntil: { type: Date, default: null, select: false },
  role: { type: String, enum: ['admin'], default: 'admin', immutable: true, required: true }
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);
