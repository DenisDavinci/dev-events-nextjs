import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable in .env.local"
    );
}

/**
 * Shape of the cached connection object stored on the global object.
 * - `conn`    : the active Mongoose instance once connected, or null before first call.
 * - `promise` : the in-flight connection promise, or null when idle.
 */
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

/**
 * Extend the NodeJS global type so TypeScript recognises our custom
 * `mongoose` property that persists across hot-module reloads in development.
 */
declare global {
    var mongoose: MongooseCache | undefined;
}

/**
 * Use the existing cached object if it exists, otherwise create one.
 * The global scope survives Next.js hot-reloads, preventing a new
 * connection from being opened on every file change in development.
 */
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

// Persist the cache on the global object for subsequent module evaluations.
global.mongoose = cached;

/**
 * Returns a singleton Mongoose connection.
 *
 * - First call: opens the connection and caches both the promise and the
 *   resolved Mongoose instance.
 * - Subsequent calls: return the already-resolved instance immediately,
 *   skipping the async overhead entirely.
 */
export async function connectToDatabase(): Promise<Mongoose> {
    // Return the existing connection if we already have one.
    if (cached.conn) {
        return cached.conn;
    }

    // If no in-flight promise exists yet, start the connection.
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            // Reuse sockets between requests instead of creating new ones.
            bufferCommands: false,
        });
    }

    // Await the promise (whether we just created it or it was already pending).
    cached.conn = await cached.promise;

    return cached.conn;
}
