# uSpecMe Website

Static multi-page site for `uspecme.com` with:
- Root coming-soon page
- Hidden MVP preview under `/mvp`

## Local Run
Open `index.html` directly in your browser for MVP preview.

## Production Routing (Vercel)
Routing is defined in `vercel.json`:
- `/` -> `coming-soon.html`
- `/mvp` -> `index.html`
- `/mvp/*` -> existing MVP pages/assets
- Root MVP file paths redirect to `/mvp/*`
- `/mvp*` sends `X-Robots-Tag: noindex, nofollow, noarchive`

## Deploy (GitHub + Vercel)
1. Push this folder to a GitHub repo.
2. Import repo in Vercel as a static project (`Framework: Other`, no build command).
3. Add domains in Vercel: `uspecme.com` and `www.uspecme.com`.
4. In easyname DNS keep:
   - `A` `@` -> `216.198.79.1`
   - `CNAME` `www` -> `ccdbaa26341e34d3.vercel-dns-017.com`
5. Set `www.uspecme.com` as primary domain in Vercel and redirect apex (`uspecme.com`) to `www`.

## Structure Notes
- `coming-soon.html`: public root landing
- `index.html`, `network.html`, `requests.html`, `messages.html`, `notifications.html`: MVP pages
- `main.css`, `main.js`: shared MVP styling/logic
