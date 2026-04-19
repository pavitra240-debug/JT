import app from '../server/app.js';

export const config = {
  runtime: 'nodejs',
};

export default function handler(req, res) {
  // Debug logging
  console.log(`[API Handler] Method: ${req.method}, URL: ${req.url}, Path: ${req.path}`);
  
  // Normalize the request URL to include /api prefix if not present
  // Vercel may pass the full URL or a partial path
  const originalUrl = req.url || '';
  
  if (!originalUrl.startsWith('/api')) {
    req.url = `/api${originalUrl}`;
    console.log(`[API Handler] Adjusted URL from "${originalUrl}" to "${req.url}"`);
  }
  
  // Invoke the Express app
  // Express middleware chains work by calling app(req, res)
  app(req, res);
  
  // Note: We don't return anything here because Express will
  // call res.end() or res.send() which handles the response
}


