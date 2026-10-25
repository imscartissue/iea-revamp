import { MetricCard } from "@/components/school/MetricCard";
import { SectionHeader } from "@/components/data-display/SectionHeader";
import { meta } from "@/lib/data";
import type { CategoryKey, School } from "@/lib/types";

/**
 * The four scored dimensions, as cards.
 *
 * Each card gives a dimension's score, its meaning and its weight, so a reader
 * can see *where* the overall score comes from and what each part contributes.
 *
 * Every score is read from `categories.*`, including Net Cost. That is the
 * inverted desirability score, so it is consistent with the rankings table and
 * the rest of the site — the raw pre-inversion cost is deliberately not shown
 * here, because it reads as a different number under a label that says
 * "Net Cost".
 *
 * All values are precomputed at build time; this component only arranges them.
 */
export function CategoryBreakdown({ school }: { school: School }) {
  return (
    <section>
      <SectionHeader eyebrow="Breakdown" title="Where the score comes from" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {meta.categories
          .filter((category) => category.key !== "complaint")
          .map((category) => {
            const key = category.key as CategoryKey;
            const value = school.categories[key];
            return (
              <MetricCard
                key={category.key}
                category={category}
                score={typeof value === "number" ? value : null}
              />
            );
          })}
      </div>
    </section>
  );
}
