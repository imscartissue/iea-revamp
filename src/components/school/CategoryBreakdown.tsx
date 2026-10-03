import { MetricCard } from "@/components/school/MetricCard";
import { ScoreBar } from "@/components/data-display/ScoreBar";
import { SectionHeader } from "@/components/data-display/SectionHeader";
import { meta } from "@/lib/data";
import { bandColor } from "@/lib/scoring";
import type { CategoryKey, School } from "@/lib/types";

/**
 * The four scored dimensions, as cards, plus the raw readings.
 *
 * Two layers on purpose, because they answer different questions:
 *
 * 1. The **cards** give each dimension a score, its meaning, and its weight.
 * 2. The **readings** below show the underlying metric value, including cost
 *    *before* inversion — otherwise a reader cannot work out what "56.7 on
 *    Net Cost" actually means in rupees.
 *
 * All values are precomputed at build time; this component only arranges them.
 */
export function CategoryBreakdown({ school }: { school: School }) {
  return (
    <section>
      <SectionHeader eyebrow="Breakdown" title="Where the score comes from" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {meta.categories.map((category) => {
          const key = category.key as CategoryKey;
          const value = school.categories[key];
          return (
            <MetricCard
              key={category.key}
              category={category}
              score={typeof value === "number" ? value : null}
              detail={key === "complaint" ? school.complaint : null}
            />
          );
        })}
      </div>

      <div className="mt-10">
        <h3 className="type-heading text-ink">The raw readings</h3>
        <p className="type-caption measure-tight mt-2 text-ink-muted">
          What students actually answered. Cost is shown as they rated it, before it was
          inverted for scoring.
        </p>

        <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reading
            label="School Environment"
            value={school.metrics.schoolEnvironment}
            hint="Atmosphere, culture, student life"
          />
          <Reading
            label="Infrastructure"
            value={school.metrics.infrastructure}
            hint="Classrooms, labs, library, sports"
          />
          <Reading
            label="Net Cost"
            value={school.metrics.cost}
            hint="Lower is better — inverted for scoring"
            lowerIsBetter
          />
          <Reading
            label="Net Benefit"
            value={school.metrics.netBenefit}
            hint="Outcomes after graduating"
          />
        </dl>
      </div>
    </section>
  );
}

function Reading({
  label,
  value,
  hint,
  lowerIsBetter = false,
}: {
  label: string;
  value: number;
  hint: string;
  lowerIsBetter?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="type-caption text-ink-faint">{label}</dt>
      <dd className="flex items-baseline gap-2">
        <span className={bandColor(value)}>{value.toFixed(1)}</span>
        {lowerIsBetter ? (
          <span className="text-[0.625rem] tracking-[0.12em] text-ink-faint uppercase">
            lower better
          </span>
        ) : null}
      </dd>
      <ScoreBar value={value} size="sm" label={`${label}: ${value.toFixed(1)}`} />
      <p className="type-caption text-ink-faint">{hint}</p>
    </div>
  );
}
