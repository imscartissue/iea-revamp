import { NavLink } from "react-router";

import { Container } from "@/components/site/Container";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Wordmark } from "@/components/site/Wordmark";
import { useScrollShadow } from "@/hooks/useScrollShadow";
import { cn } from "@/lib/utils";

/**
 * Four destinations. There are six routes; the other two are the root (the
 * wordmark) and a 404. Adding a fifth nav item needs a reason.
 */
const LINKS = [
  { to: "/methodology", label: "Methodology" },
  { to: "/reports", label: "Reports" },
  { to: "/rankings", label: "Ranking" },
  { to: "/about", label: "About" },
] as const;

/**
 * Sticky header.
 *
 * At rest it is transparent over the canvas. After 8px of scroll it gains a
 * solid `--surface` fill, a bottom hairline and a light shadow. That transition
 * happens exactly once, on a `boolean` from `useScrollShadow` — not per frame.
 */
export function Masthead() {
  const scrolled = useScrollShadow(8);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-200",
        scrolled
          ? "bg-surface shadow-header"
          : "bg-canvas/0",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6 md:h-20">
          <NavLink
            to="/"
            // `end` so the wordmark is not "active" while on every other route,
            // and a full reset of scroll on click.
            end
            className="shrink-0 rounded-sm"
            aria-label="IEA — home"
          >
            <Wordmark size="sm" />
          </NavLink>

          <div className="flex items-center gap-1 md:gap-2">
            <SiteNav />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}

function SiteNav() {
  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-1 md:gap-2">
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "relative inline-flex h-10 items-center rounded-sm px-3",
                  "font-sans type-ui transition-colors duration-[120ms]",
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {/* A 2px bronze underline on the active item. `transform`-
                      only, so it never triggers a layout pass. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 bottom-1.5 h-0.5 origin-left bg-bronze",
                      "transition-transform duration-200 ease-brand",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
