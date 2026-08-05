# Frontend — React + Vite

The frontend for Lukman's portfolio & booking site. Deploy this folder on its own (e.g. as its own GitHub repo, or as the root of a Vercel/Netlify project). It talks to the backend entirely over HTTP via `VITE_API_URL` — no shared code or folder needed.

---

## Structure

```
src/
  admin/          → Admin dashboard (all CRUD screens, JWT-protected)
  components/      → Shared UI (Layout, StatusBar, cards, hero)
  context/          → Auth context (real JWT login against the backend)
  data/
    api.js           → HTTP client (adds auth token, handles errors)
    store.js          → All calls to your backend, grouped by resource
  hooks/
    useStoreData.js    → Loads data + auto-refreshes on admin changes
  pages/            → Public site pages (Home, About, Portfolio, Booking, etc)
  styles/            → global.css — design system (colors, type, components)
```

---

## 1. Local Development

**The backend must be running first** (see the backend's own README) — this frontend has no data of its own.

```bash
npm install
cp .env.example .env
```

Confirm `.env` has:
```
VITE_API_URL=http://localhost:4000
```
(or wherever your backend is running)

```bash
npm run dev
```
Open `http://localhost:5173`. Log in at `/admin/login` with the email/password you set up in the backend's `.env`.

**Change your password immediately** under Admin → Settings, once logged in.

---

## 2. Deploying to Vercel / Netlify

1. Push this `frontend/` folder to its own GitHub repo.
2. Import the repo into Vercel or Netlify.
3. Set the environment variable:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```
   (your deployed backend's real URL)
4. Build command: `npm run build` — Output directory: `dist`
5. Once deployed, go back to your backend's environment variables and set `FRONTEND_URL` to this frontend's real URL, then redeploy the backend (CORS needs this to allow requests from your domain).

---

## 3. Admin Dashboard

Visit `/admin` on your deployed site. Everything edited here writes to the real backend database and is visible to every visitor immediately:
- Profile, bio, tagline, tech stack
- Portfolio projects — upload real images/videos
- Services & pricing
- Bookings — view submissions, update status, mark payments
- Job listings & applications
- Testimonials
- Privacy Policy / Terms of Service text
- Your own admin password

---

## 4. Customization Quick Reference

| Want to change...        | Where                                  |
|---------------------------|------------------------------------------|
| Colors, fonts             | `src/styles/global.css` (`:root`)      |
| Booking form fields       | `src/pages/Booking.jsx`                |
| API base URL              | `.env` → `VITE_API_URL`                |
| What data is fetched      | `src/data/store.js`                    |

---

## 5. Notes

- This app is 100% dependent on the backend being reachable at `VITE_API_URL`. If you see loading states that never resolve, check that URL and that the backend is running/deployed.
- All write actions (portfolio, services, bookings status, etc.) in the admin dashboard require being logged in — the JWT is stored in `localStorage` and sent automatically by `src/data/api.js`.
