import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";

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
 *
 * On phones the four inline links do not fit beside the wordmark, so they
 * collapse into a hamburger that drops a full-width panel below the bar. The
 * panel is the same links stacked vertically with hairline separators — the
 * editorial pattern, just vertical.
 */
export function Masthead() {
  const scrolled = useScrollShadow(8);
  const [navOpen, setNavOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape.
  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  // Close on outside click.
  useEffect(() => {
    if (!navOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (panelRef.current?.contains(event.target as Node)) return;
      setNavOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [navOpen]);

  // Close when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 40rem)");
    const onChange = () => {
      if (mql.matches) setNavOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-200",
        scrolled || navOpen
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
            {/* Inline nav — desktop only. On phones the hamburger below takes over. */}
            <div className="hidden sm:block">
              <SiteNav />
            </div>
            <ThemeToggle />
            {/* Hamburger — mobile only. */}
            <button
              type="button"
              onClick={() => setNavOpen(!navOpen)}
              aria-expanded={navOpen}
              aria-controls="mobile-nav"
              aria-label={navOpen ? "Close navigation" : "Open navigation"}
              className="inline-flex size-11 items-center justify-center rounded-sm text-ink-muted transition-colors hover:text-ink sm:hidden"
            >
              {navOpen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile nav panel — absolute so it overlays content without pushing it. */}
      {navOpen && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="absolute inset-x-0 top-full border-t border-rule-soft bg-surface shadow-float sm:hidden"
        >
          <Container>
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {LINKS.map((link) => (
                  <li
                    key={link.to}
                    className="border-b border-rule-soft last:border-b-0"
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setNavOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between py-3.5 type-ui transition-colors",
                          isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {link.label}
                          {isActive ? (
                            <span
                              aria-hidden="true"
                              className="h-0.5 w-6 bg-bronze"
                            />
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </div>
      )}
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
