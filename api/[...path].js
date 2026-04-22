import app from '../server/app.js';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req, res) {
  // Vercel forwards the request to this handler
  // The req.url contains the full path (e.g., /api/secret-admin/login)
  // Express app expects the full path with /api prefix
  
  const originalUrl = req.url || '';
  
  // Ensure the URL has the /api prefix for Express routing
  if (!originalUrl.startsWith('/api')) {
    req.url = `/api${originalUrl}`;
  }
  
  // Pass request to Express app
  // Express will match routes and handle the response
  app(req, res);
}



