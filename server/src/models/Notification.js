import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  recipientRole: { type: String, enum: ['donor', 'patient'], required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationMatch', default: null },
  title: { type: String, required: true },
  message: { type: String, required: true },
  readAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
