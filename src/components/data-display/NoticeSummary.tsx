import { Link } from "react-router";

/**
 * The notice summary inside the red-flag page's dark hero: how many
 * reasons are published, where the school sits in the ranking, and the
 * throughline to its full profile.
 *
 * Renders as the hero's gold-capped translucent card (see
 * `.red-flag-summary-card` in the stylesheet) — figures in ivory serif,
 * labels and the profile link in gold.
 *
 * Degrades gracefully: a school outside the ranking shows "Separate
 * notice" and, with no profile to go to, a note instead of a link.
 */
export function NoticeSummary({
  reasons,
  rank,
  profileTo,
}: {
  /** How many reasons this notice publishes. */
  reasons: number;
  /** Overall rank, when the flagged school is also in the ranking. */
  rank?: number;
  /** Route to the school's full profile, when one exists. */
  profileTo?: string;
}) {
  return (
    <aside aria-label="Notice summary" className="red-flag-summary-card">
      <p className="type-label text-gold">Notice summary</p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="type-caption text-ink-inverse/65">Reasons published</p>
          <p className="type-numeric mt-1 text-ink-inverse">{reasons}</p>
        </div>
        <div>
          <p className="type-caption text-ink-inverse/65">
            {rank != null ? "Ranking position" : "Ranking status"}
          </p>
          <p className="type-numeric-sm mt-1 text-ink-inverse">
            {rank != null ? `#${rank}` : "Separate notice"}
          </p>
        </div>
      </div>

      {profileTo ? (
        <Link
          to={profileTo}
          className="type-caption mt-4 inline-block text-gold underline underline-offset-4 hover:decoration-2"
        >
          Explore the full school profile →
        </Link>
      ) : (
        <p className="type-caption mt-4 text-ink-inverse/70">
          This notice is maintained separately from the ranked school table.
        </p>
      )}
    </aside>
  );
}
