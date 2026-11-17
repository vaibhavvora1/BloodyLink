import { z } from 'zod';

const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const password = z.string().min(8).max(128).refine((value) => /[a-z]/.test(value), 'Password must include a lowercase letter.')
  .refine((value) => /[A-Z]/.test(value), 'Password must include an uppercase letter.')
  .refine((value) => /\d/.test(value), 'Password must include a number.')
  .refine((value) => /[^A-Za-z0-9]/.test(value), 'Password must include a symbol.');
const phone = z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid phone number.');
const bloodGroup = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
const name = z.string().trim().min(2).max(100);
const city = z.string().trim().min(2).max(100);

export const donorRegisterSchema = z.object({
  name,
  email,
  phone,
  password,
  bloodGroup,
  age: z.coerce.number().int().min(18).max(100),
  gender: z.enum(['female', 'male', 'other', 'prefer_not_to_say']),
  city,
  lastDonationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD for the last donation date.').optional().or(z.literal('')),
  isAvailable: z.boolean().optional()
}).strict();

export const patientRegisterSchema = z.object({
  name,
  email,
  phone,
  password,
  bloodGroup,
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
