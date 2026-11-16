import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { sendResponse } from '../utils/response.js';

export const notFoundHandler = (req, res) => {
  return sendResponse(res, 404, false, `Route ${req.originalUrl} not found`);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found or invalid ID format';
  }

  if (env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An unexpected server error occurred. Please try again.';
  }

  return sendResponse(res, statusCode, false, message);
};
