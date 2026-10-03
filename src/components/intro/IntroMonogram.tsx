import type { IntroPhase } from "@/hooks/useIntro";
import { cn } from "@/lib/utils";

/**
 * The animated wordmark that opens the intro.
 *
 * Three parts, all CSS: the letters rise and track in, a bronze rule draws from
 * the centre, and a single dot settles. `transform` and `opacity` only — the
 * letters animate `letter-spacing`, which is not a layout property for a
 * non-wrapping inline element, but it is animated on a non-scrolling, fixed-size
 * element so there is no reflow to observe.
 *
 * The word is the organisation's full name, not the abbreviation. That makes it
 * long enough to wrap, so it is set word by word: each word is an unbreakable
 * unit and lines break only at the spaces. Breaking mid-word ("Educa- / tional")
 * reads as a rendering bug, while a clean two-line lockup reads as designed.
 *
 * Decorative: the parent overlay is `aria-hidden`, and the real wordmark is in
 * the masthead underneath.
 */
export function IntroMonogram({ phase }: { phase: IntroPhase }) {
  const WORDS = "Institute for Educational Accountability".split(" ");

  // The last letter must start by ~1200ms so its 600ms rise finishes inside the
  // 2000ms hold. Count letters, not words, so the timing survives rewording.
  // Flat-mapped up front so the render below is a pure function of the index —
  // no counter mutated mid-render.
  const LETTERS = WORDS.flatMap((word, wi) =>
    word.split("").map((letter, li) => ({ key: `${wi}-${li}`, letter })),
  );
  const STAGGER = Math.min(60, Math.floor(1200 / LETTERS.length));

  // Word boundaries, so each word renders as one unbreakable unit.
  const STARTS: number[] = WORDS.map((_, wi) => WORDS.slice(0, wi).join("").length);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center">
        <span className="flex max-w-[22ch] flex-wrap justify-center gap-x-[0.28em] font-serif text-4xl font-bold leading-tight tracking-normal text-ink-inverse sm:text-5xl">
          {WORDS.map((word, wi) => (
            <span key={word} className="inline-flex whitespace-nowrap">
              {word.split("").map((letter, li) => {
                const i = (STARTS[wi] ?? 0) + li;
                return (
                  <span
                    key={`${word}-${letter}-${li}`}
                    className="inline-block animate-[intro-letters-in_600ms_cubic-bezier(0.16,1,0.3,1)_both]"
                    style={{ animationDelay: `${200 + i * STAGGER}ms` }}
                  >
                    {letter}
                  </span>
                );
              })}
            </span>
          ))}
        </span>

        {/* The rule draws from the centre, not the left. */}
        <span
          aria-hidden="true"
          className={cn(
            "mt-3 block h-0.5 w-40 origin-center bg-bronze sm:w-48",
            "animate-[intro-rule-draw_500ms_cubic-bezier(0.16,1,0.3,1)_both]",
          )}
          style={{ animationDelay: "700ms" }}
        />
      </div>

      {/* One bronze dot. Reads as a full stop, which is what it is. */}
      <span
        aria-hidden="true"
        className="block size-1.5 rounded-full bg-bronze animate-[intro-dot-in_400ms_cubic-bezier(0.16,1,0.3,1)_both]"
        style={{ animationDelay: "1200ms" }}
      />

      {phase === "contributors" || phase === "exiting" ? (
        <p className="mt-1 text-[0.625rem] tracking-[0.24em] text-ink-inverse/45 uppercase">
          Built by the people who answered
        </p>
      ) : null}
    </div>
  );
}
