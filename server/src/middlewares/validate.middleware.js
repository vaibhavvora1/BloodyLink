import { sendResponse } from '../utils/response.js';

export const validateBody = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return sendResponse(res, 400, false, parsed.error.issues.map((issue) => issue.message).join(', '));
  }
  req.body = parsed.data;
  return next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    return sendResponse(res, 400, false, parsed.error.issues.map((issue) => issue.message).join(', '));
  }
  req.validatedQuery = parsed.data;
  return next();
};
