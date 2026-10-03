# IEA Rankings

A rebuild of [ieainstitute.org](https://ieainstitute.org/) — a ranking of Nepali
`+2` schools built entirely from an anonymous student survey.

**42 schools · 110 student responses · 4 scored dimensions · no sponsors**

---

## Read the docs first

This project is driven by its documentation. If you are picking it up — human
or AI — start here, in this order:

| | File | What it gives you |
| --- | --- | --- |
| 1 | [`docs/00-OVERVIEW.md`](docs/00-OVERVIEW.md) | What the project is, routes, design pillars |
| 2 | [`docs/04-COMPONENTS.md`](docs/04-COMPONENTS.md) | Which component to use from where |
| 3 | [`docs/02-DESIGN-SYSTEM.md`](docs/02-DESIGN-SYSTEM.md) → [`06-WORKFLOWS.md`](docs/06-WORKFLOWS.md) | Stack, design tokens, architecture, data, workflows |

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build |
| `npm run fonts` | Rebuild the self-hosted Latin Modern woff2 files |
| `npm run typecheck` | `tsc` |
| `npm run lint` | ESLint |
| `npm run sitemap` | Regenerate `public/sitemap.xml` and `public/robots.txt` |
| `npm run check` | typecheck + lint |

## Stack

React 19 · TypeScript 5.9 · Vite 8 · Tailwind CSS v4 · shadcn/ui (new-york) ·
react-router 8

**No chart library, no table library, no menu library, no animation library, no
state library, no data-fetching layer, no backend.** Every one of those was
measured and removed. See [`docs/01-STACK.md`](docs/01-STACK.md) for the numbers
and the reasoning — it is the most useful file in the repo.

| Measured and rejected | gzipped |
| --- | --- |
| `motion` (Framer Motion) | 40.2 kB |
| `@tanstack/react-table` | 21.3 kB |
| Radix `dropdown-menu` | 13.8 kB |
| Recharts / D3 / Chart.js | 100–200 kB |

## Design

```
Ink Navy      #131A2C    text, dark surfaces, footer
Ivory         #F4ECD8    page background
Muted Bronze  #8A6A35    rules, links, accents, rank numerals

Latin Modern Roman   display, headlines, long-form prose
Latin Modern Sans    interface, labels, tables
```

Self-hosted `woff2`, four files, 84.6 kB total. Full token table in
[`docs/02-DESIGN-SYSTEM.md`](docs/02-DESIGN-SYSTEM.md).

## Performance

React 19 + react-dom is 65.8 kB gzipped — two thirds of this site's JavaScript,
and not something we can change without leaving React. So the budget is on the
code we own:

```
first load                     197.8 kB gzipped
lazy chunks, on navigation      25.0 kB
app-code (ours)                 35.4 / 45.0 kB budget
```

`npm run build` for production. The budgets above are the targets to stay under.

## Data

`src/data/schools.json` is the data file the app imports. Edit it freely.

The generated ranking is verified to be an **exact match** to the live site for
all 42 schools, including four tie groups. The scoring model, the `100 − cost`
inversion, and the data-quality handling are documented in
[`docs/08-DATA.md`](docs/08-DATA.md).

`ECA.xlsx` contains real student names and a few email addresses. None of it is
read beyond the school-name column, and none of it is ever served.

## Status

Phases 1–3 done: foundation, the full `/rankings` table, the 2-second credit
splash, and the home, school-detail and about pages. Phase 4 (hardening and
launch) is next. See [`docs/PROGRESS.md`](docs/PROGRESS.md).

**Two behaviour decisions worth knowing before you deploy:**

- **The theme defaults to light**, not to the OS preference. Dark mode is one tap
  in the masthead; "System" is an explicit opt-in.
- **The splash plays on `/` only, and on every load of it** — including every
  refresh. It is a credit sequence, so it is not stored, suppressed, or shown on
  any other route. Add `?skipIntro=1` to bypass it while developing.

Two things are blocked on a human:

- **Contributor names, roles and photos.** The layout reserves blank space of the
  correct size, so adding them moves nothing. Photos are rendered as 3:4
  portraits, not avatars — drop files at `public/people/<id>.jpg` (~600 px wide,
  under 150 kB). Instructions in `src/data/contributors.ts`.
- **Deploy target** — the domain and host affect the `_headers` format and the
  SPA rewrite.

Also outstanding: **no browser has been connected during development**, so
layout, focus order, the visual design, Lighthouse, the keyboard pass, reduced
motion, and cross-browser behaviour are all unverified. A human needs to look
at it.

[`docs/10-DEPLOY.md`](docs/10-DEPLOY.md) is the launch checklist, and it lists
everything above in one place rather than leaving it to be discovered.

Do not deploy before Phase 4: without the SPA rewrite, a hard refresh on
`/rankings` returns a 404.
