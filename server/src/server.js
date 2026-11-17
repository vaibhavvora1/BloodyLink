import app from './app.js';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { env, validateEnv } from './config/env.js';

const startServer = async () => {
  let server;
  try {
    validateEnv();
    await connectDB();
    server = app.listen(env.PORT, () => {
      console.log(`Bloodlink server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }

  const shutdown = async (exitCode = 0) => {
    if (server) await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect().catch((error) => console.error(`MongoDB shutdown error: ${error.message}`));
    process.exit(exitCode);
  };

  process.once('SIGINT', () => shutdown(0));
  process.once('SIGTERM', () => shutdown(0));
  process.once('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    shutdown(1);
  });
  process.once('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    shutdown(1);
  });
};

startServer().catch((error) => {
  console.error('Unexpected startup error:', error);
  process.exit(1);
});
