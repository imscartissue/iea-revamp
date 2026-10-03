import { cn } from "@/lib/utils";

/**
 * The site mark: "IEA" in Roman.
 *
 * Just the abbreviation — no second line beneath it. The mark appears in the
 * masthead and the footer, and in both places anything longer reads as a
 * department label rather than a brand.
 *
 * Rendered as a `<Link to="/">` in the masthead, but the component itself is
 * presentational so the intro can render it without a router.
 *
 * No image, no SVG, no icon font. The mark is type — which is why it inherits
 * the loaded webfont for free and costs zero requests.
 */
export function Wordmark({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col leading-none",
        size === "sm" && "gap-1",
        size === "md" && "gap-1.5",
        size === "lg" && "gap-2",
        className,
      )}
    >
      <span
        className={cn(
          "font-serif font-bold text-ink",
          size === "sm" && "text-lg tracking-[-0.02em]",
          size === "md" && "text-2xl tracking-[-0.03em]",
          size === "lg" && "text-5xl tracking-[-0.04em]",
        )}
      >
        IEA
      </span>
    </span>
  );
}
