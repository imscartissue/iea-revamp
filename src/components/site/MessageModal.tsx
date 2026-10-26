import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { AccentRule } from "@/components/site/Rule";
import { Monogram } from "@/components/data-display/Monogram";
import { cn } from "@/lib/utils";
import type { MessageBlock } from "@/data/messages";

/**
 * A letter from one of the founders: a modal popup over the team section.
 *
 * The letter lives in `src/data/messages.ts` as blocks (byline, epigraph,
 * paragraph, subheading, signature), so words and formatting can be edited
 * without touching this component.
 *
 * Shape of the panel:
 *
 *   - a slim bronze gradient cap, then a STICKY masthead (monogram, role,
 *     name, close) that stays put while the letter scrolls under it — so the
 *     reader always knows whose letter they are in and can always close it
 *   - the letter scrolls in the panel body: byline, epigraph, paragraphs with
 *     a bronze drop cap on the first, subheadings, signature under a hairline
 *   - the only shadows used are the design system's dialog values; the panel
 *     is `surface` on a dimmed, blurred page, so it reads as a sheet of paper
 *     laid over the site rather than a browser alert
 *
 * Behaviour: closes on Escape, backdrop click or the X — never a trap. Focus
 * moves into the panel on open, is kept inside it while open, and returns to
 * the trigger on close. The page behind is scroll-locked. Wheel scrolling over
 * the letter is inertial (see below) so it glides instead of ticking. Closing
 * plays a short exit before unmounting, so the letter does not snap out of
 * existence.
 *
 * Portalled to `document.body`: the page runs a `transform` entrance animation,
 * and a transformed ancestor would become the containing block for the fixed
 * overlay — clipping the backdrop to the page box and letting the sticky
 * masthead paint over the panel.
 *
 * All motion is decorative; `message-anim` is disabled under
 * `prefers-reduced-motion` in `styles/index.css`.
 */
export function MessageModal({
  open,
  onClose,
  name,
  role,
  blocks,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  role: string;
  blocks: MessageBlock[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const exitTimer = useRef<number | undefined>(undefined);
  const [closing, setClosing] = useState(false);

  /** Animated close: play the exit, then hand back to the parent's state. */
  const close = () => {
    if (closing) return;
    setClosing(true);
    exitTimer.current = window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    /** Keep Tab inside the panel — the page behind must not be reachable. */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      window.clearTimeout(exitTimer.current);
      previouslyFocused?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable in effect; rerunning on it would re-grab focus
  }, [open]);

  /**
   * Inertial wheel scroll for the letter.
   *
   * A mouse wheel emits stepped deltas, which on a tall letter reads as jolts.
   * Here every wheel tick moves a target position instead of the scroll
   * offset; a single rAF loop eases the real offset toward that target, so the
   * letter glides. Touch and trackpad momentum are left to the browser — only
   * stepped wheel input (and keyboard) is intercepted — and everything is
   * dropped under `prefers-reduced-motion`, where the native jump is the
   * correct behaviour.
   *
   * Keeps target and scrollTop in sync on any scroll we did not cause, so
   * scrollbar dragging and PageDown keep working alongside it.
   */
  useEffect(() => {
    if (!open) return;
    const el = letterRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = el.scrollTop;
    let raf = 0;
    let last = 0;

    const max = () => el.scrollHeight - el.clientHeight;

    const step = (t: number) => {
      const dt = Math.min(t - last, 64);
      last = t;
      const diff = target - el.scrollTop;
      // Time-based easing, so the glide feels the same at 60 and 120 Hz.
      const ease = 1 - Math.pow(0.001, dt / 450);
      el.scrollTop += diff * ease;
      if (Math.abs(diff) > 0.5) {
        raf = requestAnimationFrame(step);
      } else {
        el.scrollTop = target;
        raf = 0;
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Pinch-zoom (ctrl+wheel) and horizontal scrolling stay native.
      if (e.ctrlKey || e.deltaX !== 0) return;
      // At the ends, let go — so the reader feels the boundary instead of a wall.
      const atTop = el.scrollTop <= 0 && e.deltaY < 0;
      const atBottom = el.scrollTop >= max() - 1 && e.deltaY > 0;
      if (atTop || atBottom) {
        target = el.scrollTop;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        return;
      }

      e.preventDefault();
      // deltaMode 1 = lines, 2 = pages; both need converting to pixels.
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;
      target = Math.min(Math.max(target + e.deltaY * scale, 0), max());
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    // Anything we did not drive (scrollbar drag, keys) resets the target.
    const onScroll = () => {
      if (!raf) target = el.scrollTop;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className={cn(
        "message-anim fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6",
        closing
          ? "animate-[message-backdrop-out_200ms_cubic-bezier(0.65,0,0.35,1)_both]"
          : "animate-[message-backdrop-in_240ms_cubic-bezier(0.16,1,0.3,1)_both]",
      )}
    >
      {/* Backdrop — the whole viewport, dimmed. Solid (no backdrop-blur): blur
         on a full-screen layer causes compositor edge artifacts when the tab
         regains focus, which reads as a stray outline in the background. */ }
      <div
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 bg-ink/55"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`A message from ${name}`}
        tabIndex={-1}
        className={cn(
          "message-anim relative flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden",
          "rounded-md bg-surface shadow-float focus:outline-none",
          closing
            ? "animate-[message-panel-out_200ms_cubic-bezier(0.65,0,0.35,1)_both]"
            : "animate-[message-panel-in_320ms_cubic-bezier(0.16,1,0.3,1)_both]",
        )}
      >
        {/* Bronze cap — the accent, drawn as light falling off to the right. */}
        <div
          aria-hidden="true"
          className="h-0.5 w-full shrink-0 bg-gradient-to-r from-bronze via-bronze/70 to-transparent"
        />

        {/* Sticky masthead: identity + close, always visible over the letter. */}
        <header className="flex shrink-0 items-center gap-4 border-b border-rule-soft bg-surface px-6 py-4 sm:px-9">
          <Monogram name={name} size="md" />

          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <AccentRule className="w-5" />
              <span className="type-label truncate text-bronze-ink">{role}</span>
            </div>
            <p className="type-heading truncate text-ink">{name}</p>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close message"
            className="ml-auto inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-rule-soft text-ink-faint transition-colors hover:border-rule hover:bg-bronze-wash hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* The letter */}
        <div
          ref={letterRef}
          className="message-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-7 sm:px-9 sm:py-9"
        >
          <div className="flex flex-col gap-4">
            {blocks.map((block, i) => {
              switch (block.kind) {
                case "byline":
                  return (
                    <p key={i} className="type-body measure text-ink italic">
                      {block.text}
                    </p>
                  );

                case "epigraph":
                  return (
                    <figure
                      key={i}
                      className="my-1 border-l-[3px] border-bronze/70 pl-4 sm:pl-5"
                    >
                      <blockquote className="type-body measure text-ink italic">
                        {block.text}
                      </blockquote>
                      <figcaption className="type-caption mt-1.5 text-ink-faint">
                        — {block.source}
                      </figcaption>
                    </figure>
                  );

                case "h":
                  return (
                    <h3 key={i} className="type-heading mt-3 text-ink">
                      {block.text}
                    </h3>
                  );

                case "sign":
                  return (
                    <div key={i} className="mt-4 border-t border-rule-soft pt-5">
                      <AccentRule className="mb-3" />
                      <div
                        className={cn(
                          "flex flex-col gap-0.5 type-body text-ink",
                          block.style === "bold" ? "font-bold" : "italic",
                        )}
                      >
                        {block.lines.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </div>
                    </div>
                  );

                case "p":
                default:
                  return (
                    <p key={i} className="type-body measure text-ink-muted">
                      {inline(block.text)}
                    </p>
                  );
              }
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Inline markup for letter bodies: **bold** and *italic*.
 *
 * Deliberately tiny — the letters need exactly these two emphases and nothing
 * more. Unmatched markers are rendered literally rather than swallowed.
 */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
