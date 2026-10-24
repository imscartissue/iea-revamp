import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/site/Container";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Wordmark } from "@/components/site/Wordmark";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
  const [scrollY, setScrollY] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
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
  }, [pathname]);

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

              <div className="flex items-center gap-1 md:gap-2">
                <ThemeToggle />
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-expanded={open}
                  aria-controls="site-nav"
                  aria-label="Open navigation"
                  className="inline-flex size-11 items-center justify-center gap-2 rounded-sm text-ink-muted transition-colors hover:text-ink"
                >
                  <Menu aria-hidden="true" className="size-5" />
                  <span className="hidden font-sans text-sm font-bold uppercase tracking-[0.14em] lg:inline">
                    Menu
                  </span>
                </button>
              </div>
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
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="inline-flex size-11 items-center justify-center gap-2 rounded-sm text-ink-inverse/70 transition-colors hover:text-ink-inverse"
            >
              <X aria-hidden="true" className="size-5" />
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