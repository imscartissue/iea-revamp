import type { Contributor } from "@/lib/types";
import { Monogram } from "@/components/data-display/Monogram";
import { cn } from "@/lib/utils";

/**
 * A contributor portrait.
 *
 * Photos are **portraits, not avatars** — 3:4, rendered large on `/about`
 * (up to 220px wide) so a face is actually recognisable. A 40px round crop of a
 * photograph is not a portrait, it is a thumbnail with a border, which is why
 * the round monogram exists for the small cases and this does not.
 *
 * Behaviour, in order of preference:
 *   1. `photo` set  -> the image, 3:4, `object-cover`
 *   2. name known  -> the monogram, in a 3:4 well
 *   3. neither      -> a blank reserved slot of the SAME size
 *
 * Case 3 is the point: the layout is identical whether or not real names and
 * photos exist, so filling them in later moves nothing.
 */
export function Portrait({
  contributor,
  size = "md",
  /** Circle for the intro strip, rectangle everywhere else. */
  shape = "rect",
  className,
}: {
  contributor: Contributor;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "rect";
  className?: string;
}) {
  const hasName = contributor.name.trim() !== "";

  // Square-ish circle for the intro, 3:4 portrait for the grid.
  const box = cn(
    "relative shrink-0 overflow-hidden bg-sunken",
    shape === "circle" ? "rounded-full" : "rounded-md",
    size === "sm" && (shape === "circle" ? "size-10" : "h-14 w-11"),
    size === "md" && (shape === "circle" ? "size-16" : "h-36 w-27"),
    size === "lg" && (shape === "circle" ? "size-20" : "h-52 w-39"),
    className,
  );

  if (contributor.photo) {
    return (
      <span className={box}>
        <img
          src={contributor.photo}
          // Never an empty alt: a portrait of a named person is described by
          // their name, which the caption already shows.
          alt={contributor.photoAlt ?? (hasName ? `${contributor.name}` : "")}
          loading="lazy"
          decoding="async"
          // 3:4 crop. `object-position: center 25%` biases toward the face,
          // since portraits are usually framed with headroom.
          className="size-full object-cover object-[center_25%]"
        />
      </span>
    );
  }

  if (hasName) {
    return (
      <span className={box}>
        <Monogram
          name={contributor.name}
          size={size === "sm" ? "sm" : size === "md" ? "lg" : "xl"}
          className="size-full rounded-none"
        />
      </span>
    );
  }

  // Reserved slot. A hairline keeps the boundary visible so the page does not
  // look broken while the list is being filled in.
  return (
    <span className={box}>
      <span aria-hidden="true" className="absolute inset-0 rounded-[inherit] border border-rule-soft" />
    </span>
  );
}
