import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { publicUser } from './account.js';
import { hashToken, setRefreshCookie, signAccessToken, signRefreshToken } from './token.js';

export const INVALID_LOGIN_MESSAGE = 'Invalid email or password';
export const LOCKOUT_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

let fallbackPasswordHashPromise;

const cryptoRandomPassword = () => crypto.randomBytes(32).toString('hex');

export const fallbackPasswordHash = () => {
  fallbackPasswordHashPromise ||= bcrypt.hash(cryptoRandomPassword(), 12);
  return fallbackPasswordHashPromise;
};

export const issueSession = async (account, res) => {
  const refreshToken = signRefreshToken(account);
  account.refreshTokenHash = hashToken(refreshToken);
  await account.save();
  setRefreshCookie(res, refreshToken);
  return { accessToken: signAccessToken(account), user: publicUser(account) };
};

export const setFailedLogin = async (Account, account) => {
  const attempts = (account.failedLoginAttempts || 0) + 1;
  if (attempts >= LOCKOUT_ATTEMPTS) {
    await Account.updateOne({ _id: account._id }, {
      $set: { failedLoginAttempts: 0, lockUntil: new Date(Date.now() + LOCKOUT_DURATION_MS) }
    });
    return;
  }
  await Account.updateOne({ _id: account._id }, { $set: { failedLoginAttempts: attempts } });
};

export const isSameHash = (left, right) => {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  return crypto.timingSafeEqual(Buffer.from(left), Buffer.from(right));
};
