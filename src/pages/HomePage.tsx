import { useEffect } from "react";

import { Hero } from "@/components/home/Hero";
import { SEO, applySeo } from "@/lib/seo";

/**
 * The landing page.
 *
 * Hero carries the band, the stats, red-flag spotlight and top of the table —
 * it manages its own `Container`s, because the navy band has to break out to
 * full width. The data band breaks out as the single high-contrast anchor.
 */
export function HomePage() {
  useEffect(() => applySeo(SEO.home), []);

  return <Hero />;
}