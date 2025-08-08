import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'takeaway';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Extend NodeJS global type for TypeScript
declare global {
  var mongo: {
    client: MongoClient | null;
    db: Db | null;
  };
}

// Initialize the global cache
const globalWithMongo = global as typeof globalThis & {
  mongo: { client: MongoClient | null; db: Db | null };
};

let cached = globalWithMongo.mongo;

if (!cached) {
  cached = globalWithMongo.mongo = { client: null, db: null };
}

export async function connectToDatabase() {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  try {
    // In development mode, use a global variable to preserve the connection
    // across hot-reloads
    if (!cached.client) {
      const options: MongoClientOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      cached.client = await MongoClient.connect(MONGODB_URI, options);
      cached.db = cached.client.db(MONGODB_DB);
      
      // Log successful connection
      console.log('Successfully connected to MongoDB');
    }

    return { client: cached.client, db: cached.db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export async function closeConnection() {
  if (cached.client) {
    await cached.client.close();
    cached.client = null;
    cached.db = null;
    console.log('MongoDB connection closed');
  }
}
