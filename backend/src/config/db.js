import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  try {
    if (uri && uri.trim() !== '') {
      // If user provided cluster root without db name, default to restaurant_db
      if (uri.startsWith('mongodb+srv://') && !uri.includes('.mongodb.net/')) {
        uri = uri.replace(/\.mongodb\.net\/?(\?.*)?$/, '.mongodb.net/restaurant_db$1');
      }

      console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }
    throw new Error('MONGO_URI / MONGODB_URI not configured, switching to in-memory instance');
  } catch (err) {
    console.warn(`! Primary MongoDB connection failed (${err.message}). Starting MongoMemoryServer fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✓ In-Memory MongoDB Server Connected successfully at: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error(`✗ Fatal: Unable to initialize in-memory MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
