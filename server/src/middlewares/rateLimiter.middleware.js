import rateLimit from 'express-rate-limit';

const createLimiter = (windowMs, limit, message) => rateLimit({
  windowMs,
  limit,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ success: false, message, data: null })
});

export const generalRateLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests. Please try again in 15 minutes.'
);

export const loginRateLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many login attempts. Please try again in 15 minutes.'
);

export const adminLoginRateLimiter = createLimiter(
  15 * 60 * 1000,
  3,
  'Too many admin login attempts. Please try again in 15 minutes.'
);

export const registerRateLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  'Too many registration attempts. Please try again in one hour.'
);

export const refreshRateLimiter = createLimiter(
  15 * 60 * 1000,
  30,
  'Too many refresh requests. Please try again in 15 minutes.'
);
