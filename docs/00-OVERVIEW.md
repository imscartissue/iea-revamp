# 00 — Overview

## What this is

A rebuild of [ieainstitute.org](https://ieainstitute.org/): a ranking of Nepali
`+2` schools built from an anonymous student survey. Four scored dimensions,
no sponsors.

- **43 schools** in `src/data/schools.json`, ranked by overall score
- **200+ student responses**, attributed per school as a `responses` count
- **4 scored dimensions**: School Environment, Infrastructure, Net Cost, Net Benefit
- **1 unscored dimension**: Complaint (collected as text, never scored)
- **9 red-flag schools** in a separate curated list, each with published reasons

## Who it is for

Readers comparing `+2` schools in the Kathmandu Valley: students, parents, and
educators. Scores come from anonymous survey responses, not official
accreditation — the `/about` page and the data disclaimer say so explicitly.

## Routes

| Path | Page | Notes |
|------|------|-------|
| `/` | Home | `Hero`, top-10 list, how-to-read guide; the only route with the intro splash |
| `/rankings` | Rankings | Red-flag list (default, shuffled, no rank) or the full table (desktop / mobile) |
| `/school/:id` | School detail | Rank, score dial, category breakdown, neighbouring schools |
| `/red-flag/:id` | Red flag detail | The published reasons a school is flagged, plus a dispute email |
| `/methodology` | Methodology | How scores are built, shared sections with Home |
| `/reports` | Annual report | Placeholder "coming soon" page, no dead links |
| `/about` | About | Project, method, limitations, contributors, FAQs |
| `*` | 404 | Styled page, also rendered in place for unknown school or red-flag ids |

## Design pillars

1. **Editorial, printed look** — serif headlines, hairline rules, sharp corners.
2. **Data is data, not logic** — scores live in `schools.json`; the browser does
   no scoring arithmetic, so two pages cannot disagree.
3. **No heavy dependencies** — no chart, table, menu, animation, or
   data-fetching libraries. Small hand-rolled pieces instead (see `01-STACK.md`).
4. **Accessible by construction** — landmarks, skip link, focus management on
   route change, `aria-sort` tables, labelled bars and dials.
5. **URL-backed state** — filter/sort/view on `/rankings` live in the query
   string, so any view is shareable and the default URL is clean.
