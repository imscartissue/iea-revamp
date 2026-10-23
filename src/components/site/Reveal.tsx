import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

/**
 * Wrap content so it fades and rises into place — on first load if it is
 * already in the viewport, and on scroll otherwise.
 *
 * Every direct child gets its own `opacity: 0 → 1` and
 * `translateY(24px) → none` transition, staggered by `staggerMs`. So a stack
 * of headings, paragraphs and buttons arrives one after another rather than
 * all at once.
 *
 * `delayMs` staggers this whole block against its siblings. Runs on the
 * compositor, and is collapsed to instant by the global
 * `prefers-reduced-motion` rule.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
  staggerMs = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger delay for the whole block, in milliseconds. */
  delayMs?: number;
  /** Stagger delay between each direct child, in milliseconds. */
  staggerMs?: number;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  const childList = Children.toArray(children);

  const content = Array.isArray(childList) && staggerMs > 0
    ? childList.map((child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<Record<string, unknown>>;
        return cloneElement(el, {
          style: {
            ...(el.props.style ?? {}),
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px) scale(0.97)",
            transition:
              "opacity 800ms var(--ease-brand), transform 800ms var(--ease-brand)",
            transitionDelay: `${delayMs + i * staggerMs}ms`,
          },
        });
      })
    : childList;

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={{
        transitionDelay: `${delayMs}ms`,
        ...(visible ? {} : { opacity: 0, transform: "translateY(24px) scale(0.97)" }),
        transition: "opacity 800ms var(--ease-brand), transform 800ms var(--ease-brand)",
      }}
    >
      {content}
    </div>
  );
}
