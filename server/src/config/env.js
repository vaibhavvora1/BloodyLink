import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(configDirectory, '../../.env') });

export const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || '',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Bloodlink Admin',
  REFRESH_COOKIE_NAME: 'bloodlinkRefreshToken'
};

export const validateEnv = () => {
  const problems = [];
  if (!env.MONGO_URI) problems.push('MONGO_URI is required.');
  if (!env.CLIENT_URL) problems.push('CLIENT_URL is required.');
  if (env.ACCESS_TOKEN_SECRET.length < 64) problems.push('ACCESS_TOKEN_SECRET must contain at least 64 characters.');
  if (env.REFRESH_TOKEN_SECRET.length < 64) problems.push('REFRESH_TOKEN_SECRET must contain at least 64 characters.');
  if (env.ACCESS_TOKEN_SECRET && env.ACCESS_TOKEN_SECRET === env.REFRESH_TOKEN_SECRET) {
    problems.push('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different.');
  }
  if (!Number.isInteger(env.PORT) || env.PORT < 1 || env.PORT > 65535) problems.push('PORT must be a valid TCP port.');

  if (problems.length) {
    throw new Error(`Invalid server configuration: ${problems.join(' ')}`);
  }
};
