# Why the backend was crashing

Your GitHub repo (`adekeyel/portfolio-back`) currently has **three copies**
of the same backend code committed at once:

1. Loose files at the repo root (`index.js`, `db/`, `routes/`, `middleware/`, `package.json`)
2. A `backend/` subfolder with the same files again
3. A `frontend/` subfolder (this one is legitimate — your React app)

All three copies exist in git history at the same time. This is almost
certainly why Railway is inconsistent: whatever "Root Directory" is set to
in the Railway service settings, it's easy for that setting to point at a
stale/half-updated copy, or for a deploy to pick up files from the wrong
place. `db/pool.js` genuinely exists and is imported correctly
(`import { pool } from '../db/pool.js'` in `routes/auth.js`) in every copy —
the code itself has no bug. The problem is repo structure/deploy config,
not the JS.

This zip is a **single, clean copy** of the backend — no duplication.
All files pass `node --check` (syntax-checked).

## What to do

1. In your local clone of `adekeyel/portfolio-back`, delete **everything**
   except the `frontend/` folder.
2. Unzip this into the repo root, so you end up with:
   ```
   portfolio-back/
     frontend/   (unchanged)
     db/
     middleware/
     routes/
     index.js
     package.json
   ```
3. Commit and push:
   ```
   git add -A
   git commit -m "Clean up duplicated backend structure"
   git push
   ```
4. In Railway → your service → **Settings → Root Directory**, make sure
   it is blank/`/` (since the backend now lives at the repo root, not in
   a `backend/` subfolder). If it currently says `backend`, change it.
5. Trigger a fresh deploy (Railway → Deployments → Redeploy, not from
   cache) and check the build log — you should see `db/pool.js` listed
   among the copied files, and no more `ERR_MODULE_NOT_FOUND`.
6. Double-check required env vars are set in Railway: `DATABASE_URL`
   (auto-set if you've linked a Postgres service) and anything else your
   `.env.example` lists.

## Frontend note

The frontend blank-page issue (only header/footer showing) traces back to
this same outage: several pages (`Home`, `About`, `Contact`, `Privacy`,
`Terms`) were rendering an **empty invisible div forever** whenever their
data fetch failed, instead of showing an error. That's fixed in the
frontend zip — those pages now show a visible "Couldn't load this page"
message if the API is unreachable, instead of silently staying blank.
Once the backend above is deployed and healthy, pages should render
normally. Also worth confirming in Vercel: **Settings → Environment
Variables → `VITE_API_URL`** is set to your live Railway URL (it
currently defaults to `http://localhost:4000` if unset, which will always
fail in production).
