import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  mongoose.connection.on('error', (error) => {
    console.error(`MongoDB connection error: ${error.message}`);
  });

  const conn = await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};
