import { useState } from "react";

import { SectionHeader } from "@/components/data-display/SectionHeader";
import { formatCount } from "@/lib/format";
import { meta } from "@/lib/data";

/**
 * Three steps, stated plainly, as dropdowns.
 *
 * This block exists to stop the ranking being read as an opinion. Each step is
 * a fact a reader can check, and the cost inversion is called out explicitly
 * because it is the one rule that is genuinely surprising: a school that costs
 * less ranks higher, which is the opposite of "expensive is good".
 *
 * The steps are collapsed by default and expand on click. A reader who wants the
 * method should not have to scroll past it to find the ranking, and a reader who
 * does not want it should not have to read it — the same reason the dimensions
 * on `/about` are a FAQ rather than a wall of text.
 *
 * This component moved from the home page to `/methodology`. The home page now
 * links here instead of carrying the method, so the landing page is the pitch
 * and this page is the proof.
 */
export function MethodologyTeaser() {
  const steps = [
    {
      n: "01",
      title: "Students answered anonymously",
      body: `${formatCount(meta.totalResponses)} students across the ${meta.location} rated the school they or their peers attended. No school submitted its own numbers, and no name is published.`,
    },
    {
      n: "02",
      title: "Four things were scored",
      body: "School Environment, Infrastructure, Net Cost and Net Benefit. Each is a 0-100 rating, so they can be compared across schools that share nothing but a postcode.",
    },
    {
      n: "03",
      title: "One weighted number, and the cost is inverted",
      body: "Environment 30%, Net Benefit 30%, Infrastructure 20%, Net Cost 20%. Cost is turned upside down first, so cheaper ranks higher. The weights are published, not discovered.",
    },
  ];

  return (
    <section className="defer-paint">
      <SectionHeader eyebrow="Method" title="How this was built" />

      <ol className="mt-10 flex flex-col gap-3">
        {steps.map((step) => (
          <MethodStep key={step.n} step={step} />
        ))}
      </ol>
    </section>
  );
}

/**
 * One collapsible step.
 *
 * A `<button>` wrapping the heading, with the body in a region that is hidden
 * until it is opened. `aria-expanded` on the button and `aria-hidden` on the
 * body keep the state announced; the chevron is decorative.
 */
function MethodStep({
  step,
}: {
  step: { n: string; title: string; body: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-rule-soft last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-baseline gap-4 rounded-sm py-4 text-left transition-colors duration-[120ms] hover:bg-bronze-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
      >
        <span className="font-serif text-numeric-lg leading-none text-bronze-ink">{step.n}</span>
        <span className="type-heading flex-1 text-ink">{step.title}</span>
        <span
          aria-hidden="true"
          className={`type-caption shrink-0 text-ink-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      <div
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-200 ease-brand ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="type-body measure-snug pb-4 text-ink-muted">{step.body}</p>
        </div>
      </div>
    </li>
  );
}
