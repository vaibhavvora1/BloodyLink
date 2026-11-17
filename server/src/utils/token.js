import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (user) => jwt.sign(
  { id: user.id, role: user.role },
  env.ACCESS_TOKEN_SECRET,
  { expiresIn: '15m' }
);

export const signRefreshToken = (user) => jwt.sign(
  { id: user.id, role: user.role, jti: crypto.randomUUID() },
  env.REFRESH_TOKEN_SECRET,
  { expiresIn: '7d' }
);

export const verifyAccessToken = (token) => jwt.verify(token, env.ACCESS_TOKEN_SECRET);
export const verifyRefreshToken = (token, options = {}) => jwt.verify(token, env.REFRESH_TOKEN_SECRET, options);
export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

export const setRefreshCookie = (res, token) => {
  res.cookie(env.REFRESH_COOKIE_NAME, token, refreshCookieOptions());
};

export const clearRefreshCookie = (res) => {
  const { maxAge, ...options } = refreshCookieOptions();
  res.clearCookie(env.REFRESH_COOKIE_NAME, options);
};
