import app from '../server/app.js';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req, res) {
  // On Vercel, the /api prefix is stripped before calling this handler
  // So /api/public/home-data arrives as /public/home-data
  // We must restore the /api prefix for the Express app to match its routes
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  
  // Call the Express app handler
  return app(req, res);
}
