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
| `Masthead` | Sticky header: wordmark, nav (Methodology/Reports/Ranking/About), theme toggle; solidifies after 8px scroll. Below `sm` the inline nav collapses to a hamburger that toggles a full-width dropdown panel with the same links stacked vertically |
| `Wordmark` | Type-only "IEA" brand mark, `size: sm \| md \| lg` |
| `Rule` / `AccentRule` | 1px hairline dividers / 28×2px bronze eyebrow rule (`orientation`, `tone`) |
| `ThemeToggle` | Light↔dark ghost icon button; `size-11` on mobile (44px touch target), `size-10` on desktop |
| `ErrorBoundary` | Route-level error fallback with retry; `resetKey` clears on navigation |

## `data-display/` — shared data visuals (use anywhere a number or person appears)

| Use this | For | Key props |
|----------|-----|-----------|
| `ScoreBar` | 0–100 bar, no chart lib | `value`, `max=100`, `size: sm \| md \| lg`, `tone?` (defaults to band), `label?` for a11y, `delayMs?` stagger |
| `Monogram` | Initials-in-circle avatar, deterministic colour | `name`, `label?` override, `size: sm \| md \| lg \| xl`, `blank?` to reserve space |
| `Portrait` | Contributor photo → named monogram → blank slot (same size, no shift); `lg` rect uses `aspect-[4/5] w-full` so it fills any grid cell | `contributor`, `size: sm \| md \| lg`, `shape: circle \| rect` |
| `StatBlock` / `StatRow` | Big figure + label; wide-gap-separated row | `value`, `label`, `sublabel?` |
| `SectionHeader` | Eyebrow + `h2` + lede + action | `eyebrow?`, `title`, `lede?`, `action?` |

## `rankings/` — the `/rankings` table system

| Use this | For |
|----------|-----|
| `RankingsToolbar` | Search (debounced) + view toggle + Sort/Columns menus + mobile filter sheet (44px trigger) + live result count + active-filter badges. On the red-flags view it renders only the toggle |
| `RankingsTable` | Accessible desktop table: sortable headers (`aria-sort`), memoized rows, guarded row-click navigation; `min-w-[42rem]` so it fits the `md` content box without horizontal scroll |
| `SchoolListRow` | Mobile stacked row (separate component, not a responsive table); `gap-3` between identity elements, `w-16` score bar, metrics indented `pl-[4.75rem]` to align under the name |
| `SchoolCell` / `RankCell` | Row identity: monogram + linked name, bronze serif rank |
| `ScoreCell` / `OverallCell` | Band-coloured metric with optional bar; `invert` marks the cost column |
| `EmptyState` | Filter-no-match fallback with reset |

## `red-flags/` — the curated red-flag list

| Use this | For |
|----------|-----|
| `RedFlagList` | The `/rankings` red-flags view: a responsive grid of bordered school cards (1 / 2 / 3 columns), **no rank and no score**, shuffled on every load. Canvas-coloured gaps between cards mean an incomplete last row never leaves a dark void. Not a filtered table |

`/red-flag/:id` is a page (`src/pages/RedFlagPage.tsx`) that shows the flagged school's name, its published reasons as a numbered list, a provenance note ("Where this comes from"), the contact email, and navigation back to the list or home. It renders the school's published reasons and a dispute email at the bottom.

## `school/` — `/school/:id` detail

| Use this | For |
|----------|-----|
| `SchoolHero` | Breadcrumb, monogram, rank, type·grades·location, `h1`, score dial |
| `ScoreDial` | Hand-rolled SVG 270° gauge — `value`, `size=200` |
| `CategoryBreakdown` | 2×2 `MetricCard` grid. Scores come from `categories.*`, so Net Cost is the **inverted desirability score** (consistent with the table), not the pre-inversion rating |
| `MetricCard` | One dimension: band rule, score, bar, blurb, weight note; unscored renders text, never "0" |
| `NeighboursTable` | Rank-adjacent schools with gap sentence |
| `SchoolNavArrows` | Prev/next-by-rank buttons (hidden at the ends) |

## `home/` and `intro/`

- Home sections: `Hero` (masthead + stats + a red-flag teaser + the top three;
  stats are a 3-column grid on mobile, buttons are full-width), `TopTen`
  (numbered leaderboard; accent rule `w-6` aligns with the rank numeral),
  `HowToRead` (dimension legend with medians), `MethodologyTeaser` (3 collapsed
  steps with `type-numeric` step numerals, reused on `/methodology`).
- Intro splash: `IntroGate` (overlay manager), `IntroMonogram` (animated name),
  `ContributorStrip` (8 reserved contributor slots via `introSlots()`).
