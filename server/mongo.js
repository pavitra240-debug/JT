import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

let connectionPromise = null;

function getMongoUris() {
  const uris = [];
  if (process.env.MONGODB_URI?.trim()) uris.push(process.env.MONGODB_URI.trim());
  if (process.env.MONGODB_URI_FALLBACK?.trim()) uris.push(process.env.MONGODB_URI_FALLBACK.trim());
  if (!uris.length) {
    throw new Error('Missing MONGODB_URI. Set this value in your .env file before starting the server.');
  }
  return uris;
}

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const uris = getMongoUris();
  const options = {
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    maxPoolSize: 10,
  };

  const errors = [];
  for (const uri of uris) {
    try {
      connectionPromise = mongoose.connect(uri, options).then((m) => m.connection);
      const conn = await connectionPromise;
      return conn;
    } catch (error) {
      errors.push({ uri: uri.slice(0, 60), message: error?.message || String(error) });
      connectionPromise = null;
    }
  }

  const messages = errors.map((item) => `[${item.uri}] ${item.message}`).join(' | ');
  throw new Error(
    `MongoDB connection failed. Check MONGODB_URI, optional MONGODB_URI_FALLBACK, Atlas network access (IP whitelist), and network connectivity. Details: ${messages}`,
  );
}

