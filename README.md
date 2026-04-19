# Jyothu Voyage Hub (Vite + Express + MongoDB)

Frontend UI is kept as-is. Base44 backend logic has been replaced with a custom backend:

- **Backend**: Express API under `server/`
- **DB**: MongoDB Atlas via Mongoose
- **Admin auth**: JWT stored in **HttpOnly cookie**

## Setup

1. Install deps:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill values:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`

3. Seed the admin user (creates/updates and resets session lock):

```bash
npm run seed:admin
```

4. Run dev (starts backend on `4000` and Vite on `5173`):

```bash
npm run dev
```

## URLs

- **Public site**: `http://localhost:5173/`
- **Secret admin login**: `http://localhost:5173/jyothu-control-panel-login`
- **Secret admin panel**: `http://localhost:5173/jyothu-control-panel`

## API

Public:

- `GET /api/public/home-data`
- `POST /api/public/bookings`
- `POST /api/public/messages`

Admin (JWT cookie required):

- `POST /api/secret-admin/login`
- `POST /api/secret-admin/logout`
- `GET /api/secret-admin/me`
- `GET/POST/PUT/DELETE /api/secret-admin/cars`
- `GET/POST/PUT/DELETE /api/secret-admin/buses`
- `GET/POST/PUT/DELETE /api/secret-admin/packages`
- `GET/DELETE /api/secret-admin/bookings`
- `GET/DELETE /api/secret-admin/messages`

