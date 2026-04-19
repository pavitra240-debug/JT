import app from './app.js';

const port = Number(process.env.SERVER_PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${port}`);
});

