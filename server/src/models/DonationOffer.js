import mongoose from 'mongoose';

const donationOfferSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true, index: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], index: true },
  city: { type: String, required: true, trim: true, maxlength: 100, index: true },
  availableFrom: { type: Date, required: true },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export default mongoose.model('DonationOffer', donationOfferSchema);
