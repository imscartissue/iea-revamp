import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * Cycles light -> dark. A third "system" option exists in `useTheme` but has no
 * button: for a site with one brand palette, letting someone unknowingly
 * revert to their OS setting is worse than not offering the choice. The
 * effective state is always explicit.
 */
export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative text-ink-muted hover:text-ink"
    >
      {/* Both icons render and stack; only one is visible. This keeps the
          button's box stable across a theme change and avoids a remount. */}
      <Sun aria-hidden="true" className={cn("absolute size-4 transition-opacity", !isDark && "opacity-0")} />
      <Moon aria-hidden="true" className={cn("absolute size-4 transition-opacity", isDark && "opacity-0")} />
    </Button>
  );
}
