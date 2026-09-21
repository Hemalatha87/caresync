import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[CareSync DB Critical] MONGODB_URI is NOT defined in environment variables!');
    return false;
  }

  // Safe host display (hides password)
  const safeHost = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`[CareSync DB] Attempting connection to: ${safeHost}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log(`[CareSync DB] MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[CareSync DB Error] MongoDB Connection Failed: ${error.message}`);
    console.error(`[CareSync DB Tip] Check: 1) Is 0.0.0.0/0 allowed in MongoDB Atlas Network Access? 2) Is MONGODB_URI set in Render Environment?`);
    
    // Auto retry connection in background after 5s
    setTimeout(() => {
      console.log('[CareSync DB] Retrying MongoDB connection...');
      connectDB();
    }, 5000);

    return false;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[CareSync DB Warning] MongoDB disconnected. Attempting reconnection in 5s...');
  setTimeout(() => {
    if (mongoose.connection.readyState === 0 && process.env.MONGODB_URI) {
      mongoose.connect(process.env.MONGODB_URI).catch((e) => {
        console.error('[CareSync DB Reconnect Error]', e.message);
      });
    }
  }, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('[CareSync DB Runtime Error]', err.message);
});
