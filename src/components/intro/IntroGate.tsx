import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";


import { useIntro } from "@/hooks/useIntro";
import { contributors } from "@/data/contributors";
import { cn } from "@/lib/utils";

/** First line of the org chart: the founders (2). */
const firstLine: typeof contributors = contributors.filter((c) =>
  ["yogeshwor-sharma", "eron-subedi"].includes(c.id),
);

/**
 * The splash screen: a short credit sequence, then the site.
 *
 * **It plays on `/` and nowhere else.** A reader who lands on `/rankings` from a
 * shared link, or follows a school from search, gets the site immediately — the
 * sequence is an introduction to the project, not a toll to pass through, and
 * making someone sit through it on every internal navigation would be hostile.
 *
 * **It plays on every load of `/`, including every refresh.** There is no
 * session flag. The whole point of the sequence is that the people who built
 * this are seen; suppressing it after the first view meant most people never
 * saw it at all.
 *
 * `children` is rendered ALWAYS and the overlay is its SIBLING, not a wrapper:
 *
 *   - the page is live and interactive from the first frame, so there is never
   *     a blank screen and a throttled timer cannot produce a broken site
 *   - the overlay starts at `opacity: 0` AND `pointer-events: none`, so it
 *     costs nothing until it fades in and can never swallow a click
 *   - the exit can REVEAL the page (a clip-path wipe upward) instead of
 *     cross-fading two things, which reads as a designed transition
 *
 * Skipped entirely — not shortened — under `prefers-reduced-motion`, with
 * `?skipIntro=1`, or on any interaction.
 */
export function IntroGate({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { phase, visible, dismiss } = useIntro(isHome);

  /**
   * `intro-active` is what makes the page wait before settling in. It is
   * applied ONLY while the overlay is genuinely on screen.
   *
   * This is not a nicety. The page's entrance animation uses
   * `animation-fill-mode: both`, so a non-zero delay pins it at `opacity: 0`
   * for the whole delay. If this class were applied when the splash is not
   * showing, every non-home route would render a blank page for two seconds.
   * See docs/09-BUGS.md § A7.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (!visible || phase === "exiting") {
      root.classList.remove("intro-active");
      return;
    }
    root.classList.add("intro-active");
    return () => root.classList.remove("intro-active");
  }, [visible, phase]);

  if (!visible) return <>{children}</>;

  const exiting = phase === "exiting";

  return (
    <>
      {children}

      {/*
        aria-hidden from the first frame, and gone from the DOM entirely
        afterwards. A screen reader must never be held hostage to a 2-second
        animation — that would be an accessibility failure, not a style choice.
      */}
      <div
        aria-hidden="true"
        data-intro-phase={phase}
        onClick={dismiss}
        className={cn(
          "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink px-6 pb-16",
          // Never interactive. Kept on during the exit too, so a click lands on
          // the page underneath rather than the overlay.
          "pointer-events-none",
          exiting
            ? "animate-[intro-overlay-out_400ms_cubic-bezier(0.65,0,0.35,1)_both]"
            : "animate-[intro-overlay-in_300ms_cubic-bezier(0.16,1,0.3,1)_both]",
        )}
      >
        {/* Brand mark — the stacked logo, ivory on the ink ground. */}
        <img
          src="/brand/stacked-dark.webp"
          alt=""
          className="block w-56 max-w-full object-contain sm:w-72 md:w-80 animate-[intro-person-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
          style={{ animationDelay: "200ms" }}
        />

        {/* Founders row — names and roles only; portraits stay on /about, where
            they are large enough to be portraits. */}
        <div className="flex items-center justify-center gap-8 md:gap-12">
          {firstLine.map((person, i) => (
            <div
              key={person.id}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="text-center font-serif text-[0.95rem] font-bold uppercase leading-none tracking-[0.05em] text-ink-inverse sm:text-base animate-[intro-label-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: `${1250 + i * 60}ms` }}
              >
                {person.name}
              </span>
              <span
                className="type-caption text-center text-ink-inverse/50 tracking-[0.04em] max-w-[10rem] animate-[intro-label-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: `${1310 + i * 60}ms` }}
              >
                {person.role}
              </span>
            </div>
          ))}
        </div>

        {/* A short centred bronze rule — the same mark the monogram used to
            draw, now as the seam between the credits and the epigraph. */}
        <div className="h-0.5 w-16 bg-bronze my-1 md:my-3 sm:w-24" aria-hidden="true" />

        {/* The epigraph that names the standard the site holds institutions to. */}
        <figure className="flex flex-col items-center gap-3 sm:gap-4">
          <img
            src="/images/madison/profile-silhouette.png"
            alt=""
            className="block h-24 w-auto object-contain sm:h-32 md:h-36 animate-[intro-person-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "1350ms" }}
          />
          {/* Brand yellow = `bronze`, not the pale `bronze-soft`.
              Sized ≥24px on purpose: at 3.46:1 on ink it clears WCAG's
              3:1 large-text threshold, though it would fail normal text. */}
          <blockquote
            className="max-w-[32ch] text-center font-serif text-2xl leading-snug text-bronze md:text-3xl animate-[intro-label-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "1450ms" }}
          >
            “If men were angels, no government would be necessary”.
          </blockquote>
          <figcaption
            className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-bronze-soft/70 animate-[intro-label-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "1550ms" }}
          >
            — James Madison, Federalist No. 51
          </figcaption>
        </figure>

        {/* "Click anywhere to continue" — breathes so it reads as an
            affordance. The outer <p> owns the entrance; the inner span owns
            the pulse, so the two animations never fight over one element. */}
        <p
          className={cn(
            "absolute inset-x-0 bottom-8 text-center type-caption sm:bottom-10",
            "px-4 text-ink-inverse/70",
            "animate-[intro-label-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]",
          )}
          style={{ animationDelay: "1900ms" }}
        >
          <span className="animate-[intro-hint-breathe_2.6s_ease-in-out_infinite]">
            Click anywhere to continue
          </span>
        </p>
      </div>
    </>
  );
}
