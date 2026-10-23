import { useEffect } from "react";

import { Container } from "@/components/site/Container";
import { Hero } from "@/components/home/Hero";
import { SEO, applySeo } from "@/lib/seo";

/**
 * The landing page.
 *
 * Static content, no runtime data fetching. The whole page is inside `Hero`'s
 * `page-settle` stagger window, which begins at 2080ms — the moment the intro's
 * wipe reveals it — and is already painted underneath, so a skipped intro shows
 * it immediately with no flash.
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
    </Container>
  );
}
