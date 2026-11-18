import mongoose from 'mongoose';

const bloodStockSchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], unique: true },
  availableUnits: { type: Number, required: true, min: 0, default: 0 },
  incomingUnits: { type: Number, required: true, min: 0, default: 0 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true, autoIndex: false });

export default mongoose.model('BloodStock', bloodStockSchema);
