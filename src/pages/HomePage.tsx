import { useEffect } from "react";

import { Container } from "@/components/site/Container";
import { Rule } from "@/components/site/Rule";
import { Hero } from "@/components/home/Hero";
import { TopTen } from "@/components/home/TopTen";
import { HowToRead } from "@/components/home/HowToRead";
import { SEO, applySeo } from "@/lib/seo";

/**
 * The landing page.
 *
 * Static content, two links, and no runtime data fetching. The whole page is
 * inside `Hero`'s `page-settle` stagger window, which begins at 2080ms — the
 * moment the intro's wipe reveals it — and is already painted underneath, so a
 * skipped intro shows it immediately with no flash.
 *
 * The method is no longer on this page. It moved to `/methodology`, and the
 * home page links there, so the landing page is the pitch and the methodology
 * page is the proof.
 */
export function HomePage() {
  useEffect(() => applySeo(SEO.home), []);

  return (
    <Container>
      <Hero />

      <Rule tone="rule" className="mt-20 md:mt-28" />

      <div className="py-16 md:py-24">
        <TopTen />
      </div>

      <Rule tone="rule" />

      <div className="py-16 md:py-24">
        <HowToRead />
      </div>
    </Container>
  );
}
