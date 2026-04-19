import app from '../server/app.js';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req, res) {
  // Vercel serverless strips /api prefix and passes request here
  // We must reconstruct the full URL for Express routing to work
  // Example: browser /api/public/home-data → handler receives /public/home-data
  
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  
  // Pass to Express app to handle the request
  // Express will match routes, call handlers, and send the response
  return app(req, res);
}
