import app from '../server/app.js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  // Ensure the path includes /api prefix for Express app routing
  req.url = `/api${req.url}`;
  return app(req, res);
}
