# Bhuvi Ornaments (React + JavaScript)
Store at `/`, admin at `/admin` — one project, one build, one domain.
- `npm install`, then `npm run dev` to run locally; `npm run build` makes `dist/` (Netlify / Cloudflare Pages: build `npm run build`, publish `dist`).
- Data: `public/catalog.json`. Admin edits are saved in your browser; use Admin → Publish to download a new catalog.json, replace the file, redeploy.
- Admin API layer: `src/admin/adminApi.js` (swap it for a real backend later; screens stay unchanged).
- Admin passcode: set `VITE_ADMIN_PASS` in a `.env` file (default `bhuvi-admin`). It is only a gate; also protect `/admin` with your host's password feature.
- Replace the placeholder WhatsApp number in Admin → Settings, then publish.
