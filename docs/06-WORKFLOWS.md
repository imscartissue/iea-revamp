# 06 — Workflows

## Commands

| Script | Does |
|--------|------|
| `npm run dev` | Dev server (port 5173) |
| `npm run build` | `tsc` + sitemap + `vite build` |
| `npm run preview` | Serve the production build |
| `npm run check` | `typecheck` + `lint` |
| `npm run sitemap` | Regenerate `public/sitemap.xml` + `robots.txt` |
| `npm run fonts` | Rebuild the self-hosted woff2 files |

## Editing school data

Edit `src/data/schools.json` directly. Keep ranks contiguous in descending
score order, keep `meta` counts consistent with the rows, and keep each
school's keys to the documented shape (`05-DATA.md`).

## Adding a contributor

Append to `contributors` in `src/data/contributors.ts`, drop the photo at
`public/people/<id>.jpg`, and flip `SHOW_INTRO_PORTRAITS` once photos are ready.

## Adding a page

1. Create `src/pages/XPage.tsx` (set SEO via `SEO.*` / `schoolSeo` + `applySeo`).
2. Add the route in `src/app.tsx` — `lazy()` unless it is `/`.
3. Add nav links (`Masthead`), sitemap URL (`scripts/build-sitemap.mjs`), and a
   footer link if it belongs there.
4. Every `h1` needs `tabIndex={-1}` for route-change focus.

## Build and deploy files

- `scripts/build-sitemap.mjs` writes `public/sitemap.xml` + `robots.txt` from
  the data (re-run after data or origin changes).
- `scripts/build-fonts.mjs` rebuilds `public/fonts/*.woff2` + `fonts.css`.
- `public/_redirects` — SPA rewrite (`/* → /index.html 200`, assets/fonts
  passthrough). Required on hosts like Netlify/Cloudflare Pages.
- `public/_headers` — immutable caching for `/assets/*` + `/fonts/*`, safe
  defaults elsewhere. Keep the catch-all last.
- `ECA.xlsx` / `*.xlsx` are git-ignored: the raw survey holds real student
  names and emails and must never be committed.
