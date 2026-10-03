# 03 — Architecture

## App shell (`src/app.tsx`, `src/main.tsx`)

`main.tsx` mounts `<App/>` under `StrictMode`. `App` wraps everything in
`ThemeProvider` + `BrowserRouter`; `Shell` renders `SiteChrome` around lazy
routes. `SiteChrome` = `IntroGate` (splash) + skip link + `Masthead` +
`<main>` (with `ErrorBoundary`, reset per route) + `SiteFooter`.

Route changes: scroll resets to top on push/replace (back/forward left to the
browser), and focus moves to the new page's `<h1>` (every `h1` has
`tabIndex={-1}`). Lazy chunks show a height-reserving fallback — no spinners,
no layout shift.

## Data flow

```
src/data/schools.json
  → src/lib/data.ts (sole importer; module-scope indexes)
    → pages via selectors (topSchools, getSchool, neighbours, …)
    → src/lib/filters.ts (pure filter/sort over the list)
      → useRankings() (URL search params as state)
        → RankingsToolbar / RankingsTable / SchoolListRow
```

- The JSON is **imported, not fetched**: inlined into the bundle, no loading state.
- Scores are **stored, not computed**: the browser does no scoring arithmetic.
- Rankings state is the URL: `parseParams` validates, `serialiseParams` omits
  defaults, so plain `/rankings` is the default red-flags view and every view
  is shareable.

## Intro splash

`/` only, every load (no session flag; `?skipIntro=1` bypasses for dev).
`useIntro` is a timer state machine (`idle → monogram → contributors →
exiting → done`); all motion is CSS. The overlay is a non-interactive sibling
of the live page (`pointer-events: none`, `aria-hidden`), skipped entirely
under reduced motion or off `/`.

## SEO

Decisions are pure (`headTags(seo, path, origin)` in `src/lib/seo.ts`); only
`applySeo` touches the DOM, on route change. Per-school titles carry rank and
score; the 404 sets `noindex`. Canonicals are set at runtime (no static
canonical in `index.html`). `public/sitemap.xml` + `robots.txt` are generated
by `scripts/build-sitemap.mjs` (`npm run sitemap`).

## Hooks

| Hook | Purpose |
|------|---------|
| `useRankings` | Rankings state from URL params; memoized `selectSchools`; `replace` commits, reset pushes |
| `useIntro(enabled)` | Splash phase machine + dismiss |
| `useTheme` / `ThemeProvider` | Light-default theme, `localStorage`, single writer of `<html.dark>`; toggle cycles light↔dark |
| `useMediaQuery` / `useIsMobile` | Tear-free media-query subscription (mobile = `< 48rem`) |
| `useScrollShadow(threshold)` | Past-scroll boolean driving the masthead's solid state |
| `useReducedMotion` | `prefers-reduced-motion` wrapper |
