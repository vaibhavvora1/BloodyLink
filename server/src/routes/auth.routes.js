import { Router } from 'express';
import { login, logout, me, refresh, register } from '../controllers/auth.controller.js';
import {
  adminLoginRateLimiter,
  loginRateLimiter,
  refreshRateLimiter,
  registerRateLimiter
} from '../middlewares/rateLimiter.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { donorRegisterSchema, loginSchema, patientRegisterSchema } from '../utils/authValidation.js';

const router = Router();

router.post('/donor/register', registerRateLimiter, validateBody(donorRegisterSchema), register('donor'));
router.post('/donor/login', loginRateLimiter, validateBody(loginSchema), login('donor'));
router.post('/patient/register', registerRateLimiter, validateBody(patientRegisterSchema), register('patient'));
router.post('/patient/login', loginRateLimiter, validateBody(loginSchema), login('patient'));
router.post('/admin/login', adminLoginRateLimiter, validateBody(loginSchema), login('admin'));
router.post('/refresh', refreshRateLimiter, refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
