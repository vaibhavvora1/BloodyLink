import Admin from '../models/Admin.js';
import Donor from '../models/Donor.js';
import Patient from '../models/Patient.js';

export const ACCOUNT_MODELS = Object.freeze({ donor: Donor, patient: Patient, admin: Admin });

export const accountModelForRole = (role) => ACCOUNT_MODELS[role] || null;

export const publicUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email,
  role: account.role,
  ...(account.phone ? { phone: account.phone } : {}),
  ...(account.bloodGroup ? { bloodGroup: account.bloodGroup } : {}),
  ...(account.city ? { city: account.city } : {})
});
