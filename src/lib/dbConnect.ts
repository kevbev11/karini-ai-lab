import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Replaces the forbidden require()

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

// Define a proper type for global.mongoose
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Use `const` instead of `let` and avoid `any`
const globalWithMongoose = global as typeof globalThis & {
  mongoose: MongooseCache;
};

globalWithMongoose.mongoose ||= { conn: null, promise: null };

export default async function dbConnect() {
  if (globalWithMongoose.mongoose.conn) return globalWithMongoose.mongoose.conn;

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}
