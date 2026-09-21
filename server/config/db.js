import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caresync', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[CareSync DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[CareSync DB Warning] MongoDB Connection Error: ${error.message}`);
    console.warn(`[CareSync DB Warning] Running with Memory DB Fallback or retry mode.`);
    return false;
  }
};
