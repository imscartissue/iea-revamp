import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";


import { Container } from "@/components/site/Container";
import { Wordmark } from "@/components/site/Wordmark";
import { Monogram } from "@/components/data-display/Monogram";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { bandColor } from "@/lib/scoring";
import { schools } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Destinations. The overlay (Harvard-style) carries all of them — there is no
 * separate inline nav on desktop, so the header stays minimal and the reader's
 * eye lands on content, not chrome.
 */
const LINKS = [
  { to: "/methodology", label: "Methodology" },
  { to: "/reports", label: "Reports" },
  { to: "/rankings", label: "Ranking" },
  { to: "/about", label: "About" },
] as const;

/**
 * Harvard-style masthead.
 *
 * Behaviour mirrors harvard.edu:
 *   - Sticky header whose brand bar slides up out of view once the reader has
 *     scrolled past 300px, and slides back down on a 100px scroll-up (or at
 *     the top of the page).
 *   - A full-screen overlay nav triggered by the hamburger, with a staggered
 *     entrance, focus management, ESC-to-close and body scroll lock.
 *   - Overlay-only navigation on every breakpoint.
 */
export function Masthead() {
  const { pathname } = useLocation();
  const reducedMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const navigate = useNavigate();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(false);

  // Scroll tracking — rAF-batched, tear-free enough for a boolean UI.
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let stuckState = window.scrollY > 300;
    let revealedState = false;

    const update = () => {
      const y = window.scrollY;
      stuckState = y > 300;
      if (y <= 0) {
        revealedState = false;
      } else if (stuckState) {
        if (y < lastY - 100) revealedState = true;
        else if (y > lastY) revealedState = false;
      } else {
        revealedState = false;
      }
      lastY = y;
      setScrollY(y);
      setStuck(stuckState);
      setRevealed(revealedState);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  // Close on route change. (setState-in-effect is intentional here: the overlay
  // must close when the route changes via back/forward, not only on link click.)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 1) return [];
    return schools
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortName.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) {
      const id = requestAnimationFrame(() => searchInputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (searchPanelRef.current?.contains(target)) return;
      if (searchButtonRef.current?.contains(target)) return;
      setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [searchOpen]);

  // ESC to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Body scroll lock + inert on page content while open.
  useEffect(() => {
    if (!open) return;
    const header = document.querySelector("header");
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    header?.setAttribute("inert", "");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    return () => {
      header?.removeAttribute("inert");
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus management.
  useEffect(() => {
    if (open && !prevOpen.current) {
      const id = requestAnimationFrame(() => firstLinkRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    if (!open && prevOpen.current) {
      triggerRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const brandHidden = stuck && !revealed && !open;
  const scrolled = scrollY > 8;

  const duration = reducedMotion ? "duration-0" : "duration-200";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-transform ease-brand",
          duration,
          brandHidden && "-translate-y-full",
        )}
      >
        <div
          className={cn(
            "border-b transition-colors duration-200",
            scrolled || open
              ? "bg-surface/95 shadow-header backdrop-blur"
              : "bg-canvas/0",
            scrolled || open ? "border-rule-soft" : "border-transparent",
          )}
        >
          <Container>
            <div className="flex h-16 items-center justify-between gap-6 md:h-20">
              <NavLink
                to="/"
                end
                className="shrink-0 rounded-sm"
                aria-label="IEA — home"
              >
                <Wordmark size="sm" />
              </NavLink>

              <div className="flex items-center gap-6 md:gap-8">
                <button
                  ref={searchButtonRef}
                  type="button"
                  onClick={() => setSearchOpen((v) => !v)}
                  aria-expanded={searchOpen}
                  aria-controls="site-search"
                  aria-label="Open site search"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-rule-soft bg-surface px-4 text-ink transition-colors hover:bg-bronze-wash"
                >
                  <svg
                    aria-hidden="true"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <span className="hidden font-sans text-sm font-bold uppercase tracking-[0.14em] sm:inline">
                    Search
                  </span>
                </button>
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-expanded={open}
                  aria-controls="site-nav"
                  aria-label="Open navigation"
                  className="inline-flex size-10 items-center justify-center rounded-sm text-ink transition-colors hover:text-bronze-ink"
                >
                  <svg
                    aria-hidden="true"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* Backdrop to dim the rest of the site while searching. */}
        {searchOpen ? (
          <div
            aria-hidden="true"
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-[2px]"
          />
        ) : null}

        {/* Search panel — drops below the brand bar. */}
        <div
          id="site-search"
          ref={searchPanelRef}
          aria-hidden={!searchOpen}
          className={cn(
            "absolute inset-x-0 top-full z-40 border-b border-rule-soft bg-surface shadow-float transition-[opacity,transform] ease-brand",
            searchOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          <Container>
            <div className="py-4 md:py-6">
              <div className="relative">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchResults.length > 0) {
                      navigate(`/school/${searchResults[0]!.id}`);
                      setSearchOpen(false);
                    }
                  }}
                  placeholder="Search schools by name or location"
                  aria-label="Search schools by name or location"
                  className="w-full rounded-sm border border-rule-soft bg-canvas py-3 pl-11 pr-4 font-sans text-base text-ink placeholder:text-ink-faint focus:border-bronze focus:outline-none"
                />
              </div>

              {searchQuery.trim().length > 0 ? (
                <div className="mt-4">
                  {searchResults.length === 0 ? (
                    <p className="type-caption text-ink-faint">
                      No schools match “{searchQuery}”.
                    </p>
                  ) : (
                    <ul className="flex flex-col divide-y divide-rule-soft">
                      {searchResults.map((school) => (
                        <li key={school.id}>
                          <button
                            type="button"
                            onClick={() => {
                              navigate(`/school/${school.id}`);
                              setSearchOpen(false);
                            }}
                            className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-bronze-wash"
                          >
                            <Monogram
                              name={school.name}
                              label={school.initials}
                              size="sm"
                            />
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate font-serif text-[0.9375rem] font-bold text-ink">
                                {school.name}
                              </span>
                              <span className="truncate type-caption text-ink-faint">
                                {school.shortName} · {school.location}
                              </span>
                            </span>
                            <span
                              className={`type-numeric-sm ${bandColor(school.overallScore)}`}
                            >
                              {school.overallScore.toFixed(1)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="mt-3 type-caption text-ink-faint">
                  Type a school name, short name, or location.
                </p>
              )}
            </div>
          </Container>
        </div>
      </header>

      {/* Full-screen overlay nav — always mounted so the exit animation runs. */}
      <div
        id="site-nav"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Site navigation"
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-ink text-ink-inverse",
          "transition-[transform,opacity] ease-brand",
          reducedMotion ? "duration-0" : "duration-[400ms]",
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none",
        )}
      >
        {/* Overlay top bar */}
        <div className="flex h-16 items-center justify-between border-b border-ink-inverse/10 px-4 md:h-20 md:px-8">
          <NavLink
            to="/"
            end
            className="shrink-0 rounded-sm"
            aria-label="IEA — home"
            onClick={() => setOpen(false)}
          >
            <Wordmark size="sm" className="text-ink-inverse" />
          </NavLink>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="inline-flex size-11 items-center justify-center gap-2 rounded-sm text-ink-inverse/70 transition-colors hover:text-ink-inverse"
            >
              <svg
                aria-hidden="true"
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="hidden font-sans text-sm font-bold uppercase tracking-[0.14em] lg:inline">
                Close
              </span>
            </button>
          </div>
        </div>

        {/* Nav list */}
        <nav
          aria-label="Main"
          className="flex-1 overflow-y-auto px-4 pb-12 pt-8 md:px-8 md:pt-16"
        >
          <ul className="flex flex-col gap-1 md:gap-2">
            {LINKS.map((link, i) => (
              <li
                key={link.to}
                style={{
                  transitionDelay: open && !reducedMotion ? `${0.2 + i * 0.05}s` : "0s",
                }}
                className={cn(
                  "transition-[opacity,transform] ease-brand",
                  reducedMotion ? "duration-0" : "duration-500",
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                )}
              >
                <NavLink
                  ref={i === 0 ? firstLinkRef : undefined}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "group relative inline-flex items-baseline font-serif text-[2.25rem] font-bold leading-[1.1] tracking-[-0.02em] transition-colors md:text-[3rem] xl:text-[3.5rem]",
                      isActive
                        ? "text-ink-inverse"
                        : "text-ink-inverse/70 hover:text-ink-inverse",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-0 -bottom-1 h-px origin-left bg-ink-inverse",
                          "transition-transform duration-300 ease-brand",
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Footer-ish meta inside the overlay, Harvard-style */}
          <div className="mt-12 border-t border-ink-inverse/10 pt-6 md:mt-16">
            <p className="max-w-prose font-sans text-sm leading-relaxed text-ink-inverse/50">
              IEA — an independent examination of Nepali schools.
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}