import { accountModelForRole, publicUser } from '../utils/account.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/token.js';
import { sendResponse } from '../utils/response.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const [scheme, token, extra] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token || extra) {
    return sendResponse(res, 401, false, 'Authentication required');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return sendResponse(res, 401, false, 'Invalid or expired access token');
  }

  const Account = accountModelForRole(payload.role);
  if (!Account || !payload.id) return sendResponse(res, 401, false, 'Invalid access token');

  const account = await Account.findById(payload.id).select('+refreshTokenHash');
  if (!account || !account.refreshTokenHash) {
    return sendResponse(res, 401, false, 'Session has been revoked');
  }

  req.user = publicUser(account);
  return next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return sendResponse(res, 401, false, 'Authentication required');
  if (!roles.includes(req.user.role)) return sendResponse(res, 403, false, 'You do not have permission to access this resource');
  return next();
};
