import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Horizontal rhythm for every section on the site.
 *
 * `wide`   — 1200px, the table and the masthead
 * `prose`  — 68ch, long-form text
 * `standfirst` — 60ch, the sentence under a heading
 *
 * Padding is 16px below `sm` and 24px above, per the design doc. The mobile
 * value is the one that matters here: most readers are on a phone.
 */
export function Container({
  children,
  size = "wide",
  className,
}: {
  children: ReactNode;
  size?: "wide" | "prose" | "standfirst";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        size === "wide" && "max-w-[1200px]",
        size === "prose" && "max-w-[68ch]",
        size === "standfirst" && "max-w-[60ch]",
        className,
      )}
    >
      {children}
    </div>
  );
}
