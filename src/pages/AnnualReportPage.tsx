import { useEffect } from "react";

import { Container } from "@/components/site/Container";
import { Rule } from "@/components/site/Rule";
import { SEO, applySeo } from "@/lib/seo";

/**
 * The annual report.
 *
 * A placeholder until the first report is published. It says the report is
 * coming rather than pretending it exists — a button to a PDF that is not
 * there yet would be a dead end, and a dead end on a page whose only job is
 * to deliver a document is the whole page failing.
 */
export function AnnualReportPage() {
  useEffect(() => applySeo(SEO.annualReport), []);

  return (
    <Container>
      <div className="animate-route-in">
        <header className="pt-12 md:pt-20">
          <span className="type-label text-bronze-ink">2026</span>
          <h1 tabIndex={-1} className="type-title measure-tight mt-5 text-ink outline-none">
            Annual report
          </h1>
        </header>

        <Rule tone="rule" className="mt-10" />

        <section className="py-16 md:py-24">
          <p className="type-body-lg measure text-ink-muted">
            Coming soon — the full report on the 2026 survey is being prepared.
          </p>
        </section>
      </div>
    </Container>
  );
}
