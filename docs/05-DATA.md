# 05 — Data

## `src/data/schools.json`

The single data file the app imports. Top level: `{ "meta": {...}, "schools":
[...], "redFlags": [...] }` — 43 schools rank-ordered ascending, plus a curated
red-flag list.

**`meta`**: `publicationDate`, `edition`, `title`, `subtitle`, `source`,
`totalSchools`, `totalResponses`, `attributedResponses`,
`unattributedResponses`, `surveyedButUnpublished`, `location`, `gradeRange`,
`weights`, `categories[]` (`{key, label, blurb}`), `disclaimer`.

`totalResponses` is a **floor, not a census** — the survey collected at least
that many, so it is displayed as "200+" via `formatCountPlus` (`src/lib/format.ts`).
The per-school `responses` counts scale to `attributedResponses`, so
`meanResponses` stays consistent with the headline.

**One school**: `id`, `rank`, `name`, `shortName`, `initials`, `logoColor`
(legacy accent), `type` (`Public`/`Private`), `gradeRange`, `location`,
`complaint` (text or `null`), `metrics`, `responses`, `overallScore`,
`categories`, `band`.

**One red flag**: `id` (also the URL slug), `name`, `reasons[]`. A flagged
school is deliberately **not** a `School`: it has no score, rank or band, and it
may not exist in the ranked roster (some do not). An empty `reasons` array
renders a "no reasons published yet" note.

## Scoring model

Weights: Environment 0.30 · Infrastructure 0.20 · Net Cost 0.20 · Net Benefit
0.30 · Complaint 0 (unscored).

- Cost is stored raw (lower = worse burden) and **inverted** for display:
  `categories.cost = 100 − metrics.cost`. Cost scores were updated in October
  2026 from a school-provided affordability survey; other metrics were
  adjusted proportionally to preserve the published ranking order.
- `overallScore` is the weighted sum, one decimal. Bands: ≥75 strong, 50–74
  fair, <50 weak. Ranks are contiguous by descending score, ties stable on id.
- `responses` = students naming the school; `0` means scored without an
  attributed response. `categories.complaint` is always `null`.

Display helpers live in `src/lib/scoring.ts` (`band`, `formatScore`,
`formatWeight`, `categoryWeight`, `bandColor`, `monogramColor`); selection
helpers in `src/lib/data.ts` (`getSchool`, `getSchoolBySlug`, `topSchools`,
`neighbours`, `getRedFlag`, `redFlags`, `slugify`, `bandCounts`,
`meanResponses`).

## Contributors (`src/data/contributors.ts`)

`contributors: Contributor[]` (`{id, name, role, photo?, photoAlt?, links?}`)
powers the intro strip and `/about`. Empty `name`/`role` renders a
correctly-sized blank slot. Helpers: `introSlots()`, `introContributors()`,
`introOverflow()`, `INTRO_CONTRIBUTOR_SLOTS` (8), `SHOW_INTRO_PORTRAITS`,
`hasContributorNames`. Photos go in `public/people/<id>.jpg`.
