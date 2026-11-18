import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  contactPerson: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  address: { type: String, trim: true, default: '' }
}, { timestamps: true });

export default mongoose.model('Hospital', hospitalSchema);
