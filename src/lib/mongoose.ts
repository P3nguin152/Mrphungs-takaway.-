import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/takeaway';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let isConnected: number | null = null; // 1 = connected, 0 = disconnected, null = unknown

export async function connectMongoose() {
  if (isConnected === 1) {
    return mongoose;
  }

  if (mongoose.connection && mongoose.connection.readyState === 1) {
    isConnected = 1;
    return mongoose;
  }

  try {
    // Prevent model overwrite errors in dev due to HMR
    if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGODB_URI, {
        // Use Mongoose defaults for modern drivers
      });
    }
    isConnected = 1;
    return mongoose;
  } catch (err) {
    isConnected = 0;
    console.error('Mongoose connection error:', err);
    throw new Error('Failed to connect to MongoDB via Mongoose');
  }
}

export async function disconnectMongoose() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = 0;
  }
}
