# 04 — Components

Rule of thumb: **feature components use palette token names** (`text-ink`,
`bg-canvas`, `text-band-strong`), never shadcn semantic names and never raw
hex. Class names go through `cn()` (`src/lib/utils.ts`).

## `ui/` — primitives (themed shadcn/new-york base)

| Use this | For | Key props |
|----------|-----|-----------|
| `Button` | Actions and links-as-buttons | `variant: default \| outline \| ghost \| link \| subtle`, `size: sm \| md \| lg \| icon \| icon-sm`, `asChild` for `<Link>` |
| `Badge` | Chips: school type, rank pill, score band | `variant: default \| outline \| muted \| bronze \| band-strong \| band-fair \| band-weak`, `size: sm \| md` |
| `Input` | Search / text fields | Plain input, native props |
| `Sheet` (+ `SheetTrigger/Content/Header/Footer…`) | Slide-in panels (mobile Filters sheet) | `SheetContent side: top \| right \| bottom \| left` |
| `Toggle` | Single press-toggle chip | Radix `Toggle.Root` props (`pressed`, `onPressedChange`) |
| `ToggleGroup` / `ToggleGroupItem` | Segmented single-select (view, type, band) | `variant`, `size`, `spacing` |
| `Menu` / `MenuTrigger` / `MenuPanel` / `MenuItem` | Sort + Columns dropdowns | `MenuPanel label, align: start \| end`; `MenuItem checked?, disabled?, onSelect()` — custom WAI-ARIA menu (roving focus, arrows/Home/End/Escape), not Radix |

## `site/` — page chrome

| Use this | For |
|----------|-----|
| `Container` | Page width rhythm — `size: wide` (1200px) / `prose` (68ch) / `standfirst` (60ch) |
| `Masthead` | Sticky header: wordmark, nav (Methodology/Reports/Ranking/About), theme toggle; solidifies after 8px scroll |
| `Wordmark` | Type-only "IEA" brand mark, `size: sm \| md \| lg` |
| `Rule` / `AccentRule` | 1px hairline dividers / 28×2px bronze eyebrow rule (`orientation`, `tone`) |
| `ThemeToggle` | Light↔dark ghost icon button |
| `ErrorBoundary` | Route-level error fallback with retry; `resetKey` clears on navigation |

## `data-display/` — shared data visuals (use anywhere a number or person appears)

| Use this | For | Key props |
|----------|-----|-----------|
| `ScoreBar` | 0–100 bar, no chart lib | `value`, `max=100`, `size: sm \| md \| lg`, `tone?` (defaults to band), `label?` for a11y, `delayMs?` stagger |
| `Monogram` | Initials-in-circle avatar, deterministic colour | `name`, `label?` override, `size: sm \| md \| lg \| xl`, `blank?` to reserve space |
| `Portrait` | Contributor photo → named monogram → blank slot (same size, no shift) | `contributor`, `size: sm \| md \| lg`, `shape: circle \| rect` |
| `StatBlock` / `StatRow` | Big figure + label; hairline-divided row | `value`, `label`, `sublabel?` |
| `SectionHeader` | Eyebrow + `h2` + lede + action | `eyebrow?`, `title`, `lede?`, `action?` |

## `rankings/` — the `/rankings` table system

| Use this | For |
|----------|-----|
| `RankingsToolbar` | Search (debounced) + view toggle + Sort/Columns menus + mobile filter sheet + live result count + active-filter badges |
| `RankingsTable` | Accessible desktop table: sortable headers (`aria-sort`), memoized rows, guarded row-click navigation |
| `SchoolListRow` | Mobile stacked row (separate component, not a responsive table) |
| `SchoolCell` / `RankCell` | Row identity: monogram + linked name, bronze serif rank |
| `ScoreCell` / `OverallCell` | Band-coloured metric with optional bar; `invert` marks the cost column |
| `EmptyState` | Filter-no-match fallback with reset |

## `school/` — `/school/:id` detail

| Use this | For |
|----------|-----|
| `SchoolHero` | Breadcrumb, monogram, rank, type·grades·location, `h1`, score dial |
| `ScoreDial` | Hand-rolled SVG 270° gauge — `value`, `size=200` |
| `CategoryBreakdown` | 2×2 `MetricCard` grid + raw readings list |
| `MetricCard` | One dimension: band rule, score, bar, blurb, weight note; unscored renders text, never "0" |
| `NeighboursTable` | Rank-adjacent schools with gap sentence |
| `SchoolNavArrows` | Prev/next-by-rank buttons (hidden at the ends) |

## `home/` and `intro/`

- Home sections: `Hero` (masthead + stats + top/bottom lists), `TopTen`
  (numbered leaderboard), `HowToRead` (dimension legend with medians),
  `MethodologyTeaser` (3 collapsible steps, reused on `/methodology`).
- Intro splash: `IntroGate` (overlay manager), `IntroMonogram` (animated name),
  `ContributorStrip` (8 reserved contributor slots via `introSlots()`).
