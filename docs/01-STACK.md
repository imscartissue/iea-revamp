# 01 — Stack

React 19 · TypeScript 5.9 · Vite 8 · Tailwind CSS v4 · shadcn/ui (new-york) ·
react-router 8. No backend; the data file is inlined into the JS bundle.

## Dependencies

| Package | Used for |
|---------|----------|
| `react`, `react-dom` | UI |
| `react-router` | Declarative routing only (`:id` matching, scroll handling, `NavLink`) — no loaders/actions |
| `radix-ui` | `Slot` (Button, Badge), `Dialog` (Sheet), `Toggle`, `ToggleGroup` |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Variant + class-name plumbing (`cn()` in `src/lib/utils.ts`) |
| `lucide-react` | Icons (`X`, search, arrows, sun/moon, sliders) |

Dev-only: `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `typescript`,
`eslint` + `typescript-eslint` + react plugins, `node-html-parser`
(used by `build-sitemap.mjs`), `wawoff2` (used by `build-fonts.mjs`).

## Deliberately absent

| Rejected | Instead |
|----------|---------|
| Chart library (Recharts/D3/Chart.js) | Hand-rolled `ScoreBar` (divs) and `ScoreDial` (SVG arc) |
| Table library (TanStack) | `RankingsTable` + pure functions in `src/lib/filters.ts` |
| Menu library (Radix dropdown-menu) | Custom `Menu` (~130 lines, WAI-ARIA keyboard support) |
| Animation library | CSS keyframes + `useIntro` timers; `prefers-reduced-motion` kill-switch |
| Data-fetching / state library | `schools.json` imported directly; URL search params as filter state |
| Tooltip provider | Nothing needs a tooltip |

## Config notes

- `vite.config.ts` — `react()` + `tailwindcss()` plugins, `@` → `./src` alias,
  `es2022` target, `lightningcss` minify, vendor chunk splits, dev port 5173.
- `components.json` — shadcn `new-york`, CSS at `src/styles/index.css`, aliases
  (`components` → `@/components`, `ui` → `@/components/ui`,
  `utils` → `@/lib/utils`, `lib` → `@/lib`, `hooks` → `@/hooks`).
- `tsconfig.app.json` — strict, `noUnusedLocals/Parameters`, includes `src` only.
- Route-level code splitting in `src/app.tsx`: `/` is eager, every other page is
  `lazy()` with a height-reserving fallback (no layout shift).
