import bcrypt from 'bcrypt';
import { accountModelForRole, publicUser } from '../utils/account.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { sendResponse } from '../utils/response.js';
import {
  INVALID_LOGIN_MESSAGE,
  fallbackPasswordHash,
  isSameHash,
  issueSession,
  setFailedLogin
} from '../utils/authSession.js';
import {
  clearRefreshCookie,
  hashToken,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../utils/token.js';

const rejectInvalidLogin = (res) => sendResponse(res, 401, false, INVALID_LOGIN_MESSAGE);

export const register = (role) => asyncHandler(async (req, res) => {
  const Account = accountModelForRole(role);
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  const details = { ...req.body };
  delete details.password;
  delete details.role;
  const account = await Account.create({
    ...details,
    passwordHash,
    role
  });
  const session = await issueSession(account, res);
  return sendResponse(res, 201, true, 'Account created', session);
});

export const login = (role) => asyncHandler(async (req, res) => {
  const Account = accountModelForRole(role);
  const account = await Account.findOne({ email: req.body.email })
    .select('+passwordHash +failedLoginAttempts +lockUntil');

  const passwordMatches = account
    ? await bcrypt.compare(req.body.password, account.passwordHash)
    : await bcrypt.compare(req.body.password, await fallbackPasswordHash());

  const isLocked = account?.lockUntil && account.lockUntil.getTime() > Date.now();
  if (!account || isLocked || !passwordMatches) {
    if (account && !isLocked && !passwordMatches) await setFailedLogin(Account, account);
    return rejectInvalidLogin(res);
  }

  await Account.updateOne({ _id: account._id }, { $set: { failedLoginAttempts: 0, lockUntil: null } });
  const session = await issueSession(account, res);
  return sendResponse(res, 200, true, 'Login successful', session);
});

export const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (!rawToken) {
    clearRefreshCookie(res);
    return sendResponse(res, 401, false, 'Refresh session is missing or expired');
  }

  let payload;
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    clearRefreshCookie(res);
    return sendResponse(res, 401, false, 'Refresh session is missing or expired');
  }

  const Account = accountModelForRole(payload.role);
  if (!Account || !payload.id) {
    clearRefreshCookie(res);
    return sendResponse(res, 401, false, 'Refresh session is invalid');
  }

  const account = await Account.findById(payload.id).select('+refreshTokenHash');
  const submittedHash = hashToken(rawToken);
  if (!account || !account.refreshTokenHash) {
    clearRefreshCookie(res);
    return sendResponse(res, 401, false, 'Refresh session is revoked');
  }

  if (!isSameHash(account.refreshTokenHash, submittedHash)) {
    await Account.updateOne({ _id: account._id }, { $unset: { refreshTokenHash: 1 } });
    clearRefreshCookie(res);
    return sendResponse(res, 401, false, 'Refresh session reuse detected; session revoked');
  }

  const nextRefreshToken = signRefreshToken(account);
  const rotated = await Account.findOneAndUpdate(
    { _id: account._id, refreshTokenHash: submittedHash },
    { $set: { refreshTokenHash: hashToken(nextRefreshToken) } },
    { new: true }
  );

  if (!rotated) {
    await Account.updateOne({ _id: account._id }, { $unset: { refreshTokenHash: 1 } });
    clearRefreshCookie(res);
    return sendResponse(res, 401, false, 'Refresh session reuse detected; session revoked');
  }

  setRefreshCookie(res, nextRefreshToken);
  return sendResponse(res, 200, true, 'Session refreshed', {
    accessToken: signAccessToken(account),
    user: publicUser(account)
  });
});

export const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (rawToken) {
    try {
      const payload = verifyRefreshToken(rawToken, { ignoreExpiration: true });
      const Account = accountModelForRole(payload.role);
      if (Account && payload.id) {
        await Account.updateOne({ _id: payload.id }, { $unset: { refreshTokenHash: 1 } });
      }
    } catch {
      // Clear cookie even if token verification fails
    }
  }
  clearRefreshCookie(res);
  return sendResponse(res, 200, true, 'Logged out');
});

export const me = (req, res) => sendResponse(res, 200, true, 'Current user', req.user);
