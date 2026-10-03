import type { Contributor } from "@/lib/types";

/**
 * WHO BUILT THIS SITE.
 * ---------------------------------------------------------------------------
 * The intro sequence and `/about` are built around these entries, and the
 * entries do not exist yet — the names are being supplied by the humans who
 * did the work.
 *
 * RULES (see docs/AI-HANDOVER.md § 2.8)
 *
 * 1. NEVER invent a contributor. A fabricated team to fill a component is not
 *    acceptable at any stage, including "just for the demo".
 * 2. An entry with an empty `name` is a RESERVED SLOT, not a bug. The UI
 *    renders blank space of the correct size, so swapping real names in later
 *    causes zero layout shift.
 * 3. `role` is three words maximum, and should be literally what the person
 *    did: "Data & scoring", not "Head of Insights".
 * 4. `links` is optional and at most two. A GitHub URL or a personal site is
 *    enough; a wall of social icons is not.
 *
 * HOW TO FILL THIS IN
 *
 *   - Add an entry per person. Give it a stable `id` (their GitHub handle or
 *     initials works) — the id is used as a React key and as the image cache
 *     key, so changing it later re-downloads their photo.
 *   - Leave `name` and `role` as `""` if you do not have them yet. The layout
 *     holds.
 *   - Drop photos in `public/people/<id>.jpg` and set `photo`. They are
 *     rendered as PORTRAITS, not avatars — see `components/data-display/
 *     Portrait.tsx`. Recommended: 3:4 crop, ~600px wide, under 150 kB.
 *     The site has no image pipeline, so optimise these by hand.
 *
 * Once `contributors` is non-empty, set `SHOW_INTRO_PORTRAITS` to true if the
 * photos are ready to appear in the 2-second intro. Until then the intro uses
 * monograms, which read better at that size anyway.
 */

/** Real people, credited. May be empty; entries may have blank `name`/`role`. */
export const contributors: Contributor[] = [
  // { id: "…", name: "", role: "", photo: "/people/….jpg", links: { github: "…" } },
];

/**
 * How many slots the splash reserves, and therefore how many people it can show.
 *
 * Eight, because that is what can actually be read in the two seconds available
 * and because the design cap is eight (`02-DESIGN-SYSTEM.md § 4`). This constant
 * is the single source of that cap — the strip never hardcodes it.
 *
 * The slots are reserved even when `contributors` is empty. An empty array with
 * no padding would render nothing at all, which reads as a broken splash rather
 * than as credits awaiting names.
 */
export const INTRO_CONTRIBUTOR_SLOTS = 8;

/**
 * The people shown in the intro.
 *
 * Deterministic and evenly spaced, so the same faces appear every time — a
 * `Math.random()` or a `.slice(0, 8)` would look arbitrary and would make the
 * splash feel like a different product each visit.
 */
export function introContributors(): Contributor[] {
  if (contributors.length <= INTRO_CONTRIBUTOR_SLOTS) return contributors;
  const step = contributors.length / INTRO_CONTRIBUTOR_SLOTS;
  return Array.from(
    { length: INTRO_CONTRIBUTOR_SLOTS },
    (_, i) => contributors[Math.floor(i * step)] as Contributor,
  );
}

/**
 * Turn photos on in the intro once they exist.
 *
 * Deliberately separate from `contributors.length`: the intro runs at a size
 * where a portrait's face is ~40px tall, which is a bad use of a portrait. The
 * monogram is the better mark there. Photos belong on `/about`, where they are
 * large enough to be portraits.
 */
export const SHOW_INTRO_PORTRAITS = false;

/** True once there is at least one real name to show. */
export const hasContributorNames = contributors.some((c) => c.name.trim() !== "");

/**
 * The people shown in the intro, padded to a fixed number of slots.
 *
 * Always `INTRO_CONTRIBUTOR_SLOTS` long. Real people fill the first N; the
 * rest are `null`, which the UI renders as a correctly-sized blank slot.
 *
 * The padding is the point. With an empty `contributors` array the splash would
 * otherwise render *nothing* — no circles, no gap, no hint that credits belong
 * there. Reserving the space means the layout a reader sees today is the layout
 * they will see once the real names land, and nothing shifts when it happens.
 */
export function introSlots(): (Contributor | null)[] {
  const real = introContributors();
  return Array.from(
    { length: INTRO_CONTRIBUTOR_SLOTS },
    (_, i) => real[i] ?? null,
  );
}

/** How many real people are not shown individually, for the "+N" chip. */
export function introOverflow(): number {
  return Math.max(0, contributors.length - INTRO_CONTRIBUTOR_SLOTS);
}
