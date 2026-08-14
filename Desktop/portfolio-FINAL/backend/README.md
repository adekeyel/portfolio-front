# Backend — Express + PostgreSQL API

The backend for Lukman's portfolio & booking site. Deploy this folder on its own (e.g. as its own GitHub repo, or as the root of a Railway service).

---

## Structure

```
index.js         → Main server entry point
db/
  schema.sql      → Full PostgreSQL schema
  migrate.js       → Run once to create tables + seed default content + admin user
  defaultData.js    → Seed content used only by migrate.js
routes/           → One file per resource
  auth.js           → Login, session check, change password
  profile.js         → Public profile/bio content
  portfolio.js        → Portfolio projects (CRUD)
  services.js          → Services & pricing (CRUD)
  bookings.js           → Booking form submissions + admin management
  jobs.js                → Job listings + applications
  testimonials.js         → Testimonials (CRUD)
  contact.js                → Contact form
  legal.js                   → Privacy Policy / Terms text
  uploads.js                  → Portfolio image/video uploads
  payments.js                  → Paystack / Flutterwave / Monnify integration
middleware/
  auth.js           → JWT verification middleware
```

---

## 1. Local Development

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — a local Postgres instance, or a free Railway/Supabase database
- `JWT_SECRET` — generate one: `openssl rand -base64 48`
- `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` — used once, for your first login

Create tables and seed default content + your admin user:
```bash
npm run migrate
```

Start the server:
```bash
npm run dev
```
Runs on `http://localhost:4000` by default. Health check: `GET /api/health`.

---

## 2. Deploying to Railway

1. Push this `backend/` folder to its own GitHub repo.
2. On [Railway](https://railway.app): **New Project → Deploy from GitHub repo**, select the repo.
3. **Add a PostgreSQL database**: New → Database → PostgreSQL. Railway auto-creates `DATABASE_URL` and links it to your service.
4. In your service's **Variables** tab, add:
   - `JWT_SECRET`
   - `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`
   - `FRONTEND_URL` — your deployed frontend's URL (needed for CORS)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard (needed for portfolio image/video uploads to work and persist across redeploys)
   - `PUBLIC_APP_URL` — your frontend's URL (used for payment redirect callbacks)
   - Payment provider keys — see Section 3 below
5. Railway runs `npm install` and `npm start` automatically. Run the migration once via Railway's service shell (or Railway CLI):
   ```bash
   npm run migrate
   ```
6. Note your backend's public URL — the frontend needs it as `VITE_API_URL`.

---

## 3. Connecting Paystack / Flutterwave / Monnify

Real payment support is already built — see `routes/payments.js`. Add one set of keys as environment variables:

```
PAYMENT_PROVIDER=paystack
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```
```
PAYMENT_PROVIDER=flutterwave
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxx
FLW_WEBHOOK_HASH=your-chosen-secret
```
```
PAYMENT_PROVIDER=monnify
MONNIFY_API_KEY=MK_PROD_xxxxx
MONNIFY_SECRET_KEY=xxxxx
MONNIFY_CONTRACT_CODE=xxxxx
MONNIFY_BASE_URL=https://api.monnify.com   # sandbox: https://sandbox.monnify.com
```

Set your provider's webhook URL to:
- Paystack: `https://your-backend-url/api/payments/webhook/paystack`
- Flutterwave: `https://your-backend-url/api/payments/webhook/flutterwave`
- Monnify: `https://your-backend-url/api/payments/webhook/monnify`

Test with sandbox/test keys first, then swap to live keys. Only one provider is active at a time, set by `PAYMENT_PROVIDER`.

---

## 4. Notes

- Portfolio image/video uploads go directly to Cloudinary (see `routes/uploads.js`) — this is required, not optional, since Railway's local disk does not persist across redeploys. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` before using the portfolio upload feature.
- Rate limiting is applied to public write endpoints (booking, contact, job applications, login).
- All admin write endpoints require a valid JWT. Verify with: `curl -X POST https://your-backend/api/portfolio` (should return 401 without a token).
- CORS only allows requests from `FRONTEND_URL` — update this if your frontend domain changes.
