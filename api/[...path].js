import app from '../server/app.js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  return app(req, res);
}
