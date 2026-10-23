import { useEffect } from "react";

import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/site/Reveal";
import { Rule } from "@/components/site/Rule";
import { MethodologyTeaser } from "@/components/home/MethodologyTeaser";
import { HowToRead } from "@/components/home/HowToRead";
import { SEO, applySeo } from "@/lib/seo";

/**
 * The method, in full.
 *
 * This page carries what the home page used to carry: the three steps of how the
 * score is built, and the legend for reading a row. The home page links here
 * rather than repeating it, so the landing page is the pitch and this is the
 * proof.
 *
 * The steps are dropdowns rather than an always-open list — see
 * `MethodologyTeaser` for why.
 */
export function MethodologyPage() {
  useEffect(() => applySeo(SEO.methodology), []);

  return (
    <Container>
      <div className="animate-route-in">
        <header className="pt-12 md:pt-20">
          <Reveal staggerMs={60}>
            <h1 tabIndex={-1} className="type-title measure-tight text-ink outline-none">
              Methodology
            </h1>
            <p className="type-body-lg measure mt-6 text-ink-muted">
              Every score on this site can be traced back to a survey response and a
              published weight. Here is exactly how.
            </p>
          </Reveal>
        </header>

        <Rule tone="rule" className="mt-10" />

        <Reveal className="py-16 md:py-24" delayMs={60}>
          <MethodologyTeaser />
        </Reveal>

        <Rule tone="rule" />

        <Reveal className="py-16 md:py-24" delayMs={120}>
          <HowToRead />
        </Reveal>
      </div>
    </Container>
  );
}
