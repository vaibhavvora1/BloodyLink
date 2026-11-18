import { z } from 'zod';

const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const password = z.string().min(8).max(128).refine((value) => /[a-z]/.test(value), 'Password must include a lowercase letter.')
  .refine((value) => /[A-Z]/.test(value), 'Password must include an uppercase letter.')
  .refine((value) => /\d/.test(value), 'Password must include a number.')
  .refine((value) => /[^A-Za-z0-9]/.test(value), 'Password must include a symbol.');
const phone = z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid phone number.');
const bloodGroup = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
const name = z.string().trim().min(2, 'Name must be at least 2 characters.').max(100);
const city = z.string().trim().min(2, 'City must be at least 2 characters.').max(100);
const gender = z.enum(['female', 'male', 'other', 'prefer_not_to_say']);

const isValidDonorDOB = (val) => {
  if (!val) return true;
  const dob = new Date(val);
  if (isNaN(dob.getTime()) || dob > new Date()) return false;
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
  return years >= 18 && years <= 65;
};

const isNotFutureDate = (val) => {
  if (!val) return true;
  const d = new Date(val);
  return !isNaN(d.getTime()) && d <= new Date();
};

export const donorRegisterSchema = z.object({
  name,
  email,
  phone,
  password,
  bloodGroup,
  age: z.coerce.number().int().min(18).max(65),
  gender,
  city,
  isAvailable: z.boolean().optional()
}).strict();

export const patientRegisterSchema = z.object({
  name,
  email,
  phone,
  password,
  bloodGroup,
  age: z.coerce.number().int().min(0).max(120).optional(),
  gender: gender.optional(),
  city,
  hospital: z.string().trim().min(2).max(150)
}).strict();

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(128)
}).strict();

export const donorAvailabilitySchema = z.object({ isAvailable: z.boolean() }).strict();

export const donorSearchSchema = z.object({
  bloodGroup: bloodGroup.optional(),
  city: z.string().trim().max(100).optional()
}).strict();

export const donorProfileUpdateSchema = z.object({
  name: name.optional(),
  phone: phone.optional(),
  city: city.optional(),
  address: z.string().trim().max(200).optional().or(z.literal('')),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD for date of birth.')
    .refine(isValidDonorDOB, 'Donor must be between 18 and 65 years old and DOB cannot be in future.')
    .optional().or(z.literal('')),
  bloodGroup: bloodGroup.optional(),
  gender: gender.optional(),
  age: z.coerce.number().int().min(18).max(65).optional(),
  weight: z.union([z.coerce.number().min(45, 'Weight must be at least 45 kg for blood donation.').max(250), z.literal('')]).optional(),
  medicalNotes: z.string().trim().max(1000).optional().or(z.literal('')),
  isAvailable: z.boolean().optional()
}).strict();

export const patientProfileUpdateSchema = z.object({
  name: name.optional(),
  phone: phone.optional(),
  city: city.optional(),
  address: z.string().trim().max(200).optional().or(z.literal('')),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD for date of birth.')
    .refine(isNotFutureDate, 'Date of birth cannot be in the future.')
    .optional().or(z.literal('')),
  bloodGroup: bloodGroup.optional(),
  gender: gender.optional(),
  age: z.coerce.number().int().min(0).max(120).optional(),
  medicalNotes: z.string().trim().max(1000).optional().or(z.literal('')),
  hospital: z.string().trim().min(2, 'Hospital name is required.').max(150).optional(),
  emergencyContact: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid emergency contact phone number.').optional().or(z.literal(''))
}).strict();

const hospitalFieldsSchema = z.object({
  name: z.string().trim().min(2).max(150),
  contactPerson: z.string().trim().min(2).max(100),
  phone,
  email,
  city,
  address: z.string().trim().max(200).optional().or(z.literal(''))
});

export const hospitalCreateSchema = hospitalFieldsSchema.strict();
export const hospitalUpdateSchema = hospitalFieldsSchema.partial().strict().refine(
  (data) => Object.keys(data).length > 0,
  'Provide at least one hospital field to update.'
);
