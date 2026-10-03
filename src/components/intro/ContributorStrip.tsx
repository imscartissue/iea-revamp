import { INTRO_CONTRIBUTOR_SLOTS, SHOW_INTRO_PORTRAITS, introOverflow, introSlots } from "@/data/contributors";
import { Monogram } from "@/components/data-display/Monogram";
import { Portrait } from "@/components/data-display/Portrait";
import type { IntroPhase } from "@/hooks/useIntro";
import { cn } from "@/lib/utils";

/**
 * The people who made this — the whole point of the splash.
 *
 * **Slots are always reserved, even with no names yet.** `introSlots()` returns
 * a fixed-length list; a `null` entry renders a blank monogram and a blank
 * label rule at exactly the size a real person will occupy. That is deliberate:
 * with an empty `contributors` array an unpadded list would render *nothing*,
 * which reads as a broken splash rather than as credits awaiting names. It also
 * means adding the real team later moves nothing at all.
 *
 * Capped at `INTRO_CONTRIBUTOR_SLOTS` (8) because more than that cannot be read
 * in two seconds. When there are more than 8, the sample is EVENLY SPACED
 * (`introSlots`) rather than the first N, so the same faces appear every visit.
 *
 * Monograms rather than portraits: a portrait in a 48px circle is a
 * thumbnail with a border, not a portrait. `SHOW_INTRO_PORTRAITS` exists for
 * when that judgement is revisited — photos belong on `/about`, where they are
 * large enough to be portraits.
 */
export function ContributorStrip({ phase }: { phase: IntroPhase }) {
  const slots = introSlots();
  const overflow = introOverflow();

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4",
        // The strip rises and fades with the overlay wipe.
        phase === "exiting" && "animate-[intro-strip-out_400ms_cubic-bezier(0.65,0,0.35,1)_both]",
      )}
    >
      <ul
        className="flex flex-wrap items-start justify-center gap-x-4 gap-y-5 sm:gap-x-6"
        // The overlay is aria-hidden regardless; this is belt and braces.
        aria-hidden="true"
      >
        {slots.map((person, i) => {
          const name = person?.name.trim() ?? "";
          const delay = 1250 + i * 40;

          return (
            <li
              // Keyed by id when we have one, index otherwise, so the slots
              // keep their identity when real entries arrive.
              key={person?.id ?? `slot-${i}`}
              className="flex w-16 flex-col items-center gap-2 sm:w-20"
            >
              <span
                className="animate-[intro-person-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: `${delay}ms` }}
              >
                {person && SHOW_INTRO_PORTRAITS && person.photo ? (
                  <Portrait contributor={person} size="sm" shape="circle" />
                ) : (
                  <Monogram
                    name={name || `Reserved slot ${i + 1}`}
                    size="lg"
                    blank={!name}
                  />
                )}
              </span>

              <span
                className={cn(
                  "flex h-3 w-full items-center justify-center",
                  "animate-[intro-label-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]",
                )}
                style={{ animationDelay: `${delay + 40}ms` }}
              >
                {name ? (
                  <span className="line-clamp-2 text-center text-[0.625rem] leading-tight tracking-[0.08em] text-ink-inverse/70 uppercase">
                    {name}
                  </span>
                ) : (
                  // A reserved rule, not an em-dash. Eight em-dashes in a row
                  // would look broken; a hairline reads as "a name goes here".
                  <span
                    className="h-px w-10 bg-ink-inverse/25"
                    aria-hidden="true"
                  />
                )}
              </span>
            </li>
          );
        })}

        {overflow > 0 ? (
          <li
            className="flex items-center pt-10 text-[0.625rem] tracking-[0.08em] text-ink-inverse/50 uppercase animate-[intro-label-in_500ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: `${1250 + INTRO_CONTRIBUTOR_SLOTS * 40}ms` }}
          >
            +{overflow}
          </li>
        ) : null}
      </ul>

      {slots.every((s) => s === null) ? (
        // Say what the space is for, rather than leaving eight empty circles
        // unexplained. This is not filler text; it is the only honest label for
        // a slot with no person in it yet.
        <p className="type-caption text-ink-inverse/40">The people who built this</p>
      ) : null}
    </div>
  );
}
