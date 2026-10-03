import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";

import { ContributorStrip } from "@/components/intro/ContributorStrip";
import { IntroMonogram } from "@/components/intro/IntroMonogram";
import { useIntro } from "@/hooks/useIntro";
import { cn } from "@/lib/utils";

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
          "fixed inset-0 z-50 flex flex-col items-center justify-center gap-12 bg-ink px-4",
          // Never interactive. Kept on during the exit too, so a click lands on
          // the page underneath rather than the overlay.
          "pointer-events-none",
          exiting
            ? "animate-[intro-overlay-out_400ms_cubic-bezier(0.65,0,0.35,1)_both]"
            : "animate-[intro-overlay-in_300ms_cubic-bezier(0.16,1,0.3,1)_both]",
        )}
      >
        <IntroMonogram phase={phase} />
        <ContributorStrip phase={phase} />

        {/*
          "Click anywhere to continue".

          Decorative text, NOT a button, and that is load-bearing for two
          reasons. The overlay is `aria-hidden`, and a focusable element inside
          an `aria-hidden` container is an accessibility violation that screen
          readers will expose as an unlabelled control. And the overlay is
          `pointer-events: none`, so a button inside it would not be clickable
          either. The interaction is the overlay itself, via the global
          pointerdown/keydown listener in `useIntro`.

          Pinned to the bottom rather than placed in the flow, so it cannot
          shift the wordmark or the contributor strip as it appears.

          It fades in at 1400ms — after the contributor slots have started
          arriving and before they finish — which is the earliest point that
          reads naturally and still leaves it on screen for ~600ms of the hold
          plus the whole 400ms exit. The timing is otherwise unchanged.
        */}
        <p
          className={cn(
            "absolute inset-x-0 bottom-8 text-center type-caption sm:bottom-10",
            "px-4 text-ink-inverse/45",
            "animate-[intro-label-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]",
          )}
          style={{ animationDelay: "1400ms" }}
        >
          Click anywhere to continue
        </p>
      </div>
    </>
  );
}
