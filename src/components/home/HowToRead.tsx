import { Link } from "react-router";

import { ScoreBar } from "@/components/data-display/ScoreBar";
import { SectionHeader } from "@/components/data-display/SectionHeader";
import { meta, schools } from "@/lib/data";
import type { CategoryKey } from "@/lib/types";

/**
 * What the four dimensions actually mean, with a worked example each.
 *
 * This is the difference between "a number" and "a measurement you can trust",
 * and it is why someone can read a row of the table in fifteen seconds instead
 * of guessing.
 *
 * The bars show the real median school in this survey, so they are not
 * decorative — they show what a middle-of-the-pack row actually looks like. The
 * caption says so, because a reader could otherwise mistake them for a fixed
 * scale and compare two schools against each other incorrectly.
 */

/**
 * Median of one category across the roster, computed at module scope.
 *
 * The roster is immutable, so this never needs to be a hook or a selector — it
 * is evaluated once for the lifetime of the page.
 */
function medianOf(key: CategoryKey): number {
  const values = schools
    .map((s) => s.categories[key])
    .filter((v): v is number => typeof v === "number")
    .sort((a, b) => a - b);

  if (values.length === 0) return 0;
  const mid = Math.floor(values.length / 2);
  return values.length % 2 === 0
    ? Math.round(((values[mid - 1] as number) + (values[mid] as number)) / 2)
    : (values[mid] as number);
}

export function HowToRead() {
  return (
    <section className="defer-paint">
      <SectionHeader
        eyebrow="Legend"
        title="How to read a row"
        lede="Each school carries four scores and one overall. Here is what each of the four measures, and why cost runs backwards."
      />

      <dl className="mt-10 flex flex-col">
        {meta.categories.map((category) => {
          const key = category.key as CategoryKey;
          const median = medianOf(key);
          return (
            <div
              key={category.key}
              className="grid gap-x-8 gap-y-3 border-b border-rule-soft py-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
            >
              <div className="flex flex-col gap-2.5">
                <dt className="type-heading text-ink">
                  {category.label}
                  {category.invert ? (
                    <span className="ml-2 align-middle text-[0.625rem] tracking-[0.12em] text-bronze-ink uppercase">
                      inverted ↓
                    </span>
                  ) : null}
                </dt>

                {category.unscored ? (
                  <span className="type-caption text-ink-faint">Not scored</span>
                ) : (
                  <>
                    <ScoreBar
                      value={median}
                      size="md"
                      label={`Median ${category.label.toLowerCase()} score across the survey: ${median.toFixed(1)}`}
                    />
                    <span className="type-caption text-ink-faint">
                      Median in this survey: {median.toFixed(1)}
                    </span>
                  </>
                )}
              </div>

              <dd className="type-body measure-snug text-ink-muted">
                {category.blurb}

                {category.invert ? (
                  <span className="mt-2 block type-caption text-bronze-ink">
                    Higher is better, because the raw cost rating is turned upside down before
                    scoring: a school that costs less to attend ranks higher.
                  </span>
                ) : null}

                {category.unscored ? (
                  <span className="mt-2 block type-caption text-ink-faint">
                    Excluded from the overall score — no complaint data was collected, so it
                    carries no weight.
                  </span>
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="type-caption measure mt-6 text-ink-faint">
        The bars show the median school in this survey, not a fixed scale. Use them to see
        roughly where a school sits; to compare two schools with each other, use the{" "}
        <Link to="/rankings" className="text-bronze-ink underline underline-offset-4 hover:decoration-2">
          rankings page
        </Link>
        .
      </p>
    </section>
  );
}
