import { ScoreBar } from "@/components/data-display/ScoreBar";
import { BAND_LABEL, band, formatWeight } from "@/lib/scoring";
import type { CategoryMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * One scored dimension, as a card.
 *
 * The 3px band-coloured left rule is the one idea carried over from v1 that
 * was worth keeping. Everything else about the old card was a shadow and a
 * grey border.
 *
 * `complaint` is the odd one out: it is not scored, so it renders text or a
 * plain note rather than a number and a bar. Rendering "0" there would be a
 * lie about the data.
 */
export function MetricCard({
  category,
  score,
  detail,
}: {
  category: CategoryMeta;
  /** `null` for unscored categories. */
  score: number | null;
  /** The registered complaint text, if any. */
  detail?: string | null;
}) {
  const unscored = score === null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-l-[3px] bg-surface py-5 pr-5 pl-5",
        unscored ? "border-l-rule-soft" : `border-l-band-${band(score)}`,
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="type-heading text-ink">{category.label}</h3>
        {unscored ? (
          <span className="type-caption shrink-0 text-ink-faint">not scored</span>
        ) : (
          <span className={cn("type-numeric shrink-0", `text-band-${band(score)}`)}>
            {score.toFixed(1)}
          </span>
        )}
      </div>

      {unscored ? (
        <p className="type-body measure-snug text-ink-muted">
          {detail ?? "No complaint data was collected, so this is not scored."}
        </p>
      ) : (
        <>
          <ScoreBar value={score} size="md" />
          <p className="type-caption measure-snug text-ink-muted">{category.blurb}</p>
          <p className="type-caption text-ink-faint">
            {BAND_LABEL[band(score)]} · {formatWeight(category.key)} of the overall score
            {category.invert ? " · cost is inverted, so lower cost ranks higher" : ""}
          </p>
        </>
      )}
    </div>
  );
}
