import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeChoice = "light" | "dark" | "system";
type Resolved = "light" | "dark";

const STORAGE_KEY = "iea-theme";

/**
 * Light/dark theme. **Default is LIGHT.**
 *
 * The initial class is applied by a ~6-line inline script in `index.html` that
 * runs before first paint, so there is never a flash of the wrong theme. This
 * provider exists only to expose the current choice and change it — it must
 * never be the thing that decides the theme for the first paint.
 *
 * With nothing stored we render light, NOT the OS preference. The brand leads
 * with the warm ivory canvas, and a reader on a dark-mode phone should still land
 * on ivory. "System" remains available as an explicit choice.
 */

type ThemeContextValue = {
  /** What the user chose. */
  choice: ThemeChoice;
  /** What that resolves to right now. */
  resolved: Resolved;
  setChoice: (c: ThemeChoice) => void;
  /** Cycles light -> dark -> system. */
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): ThemeChoice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // Private browsing / blocked storage. Fall through to the default.
  }
  return "light";
}

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(readStored);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  // Track OS changes, but only while the user is on "system".
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const resolved: Resolved = choice === "system" ? (systemDark ? "dark" : "light") : choice;

  // Single writer for the `dark` class. Nothing else may touch it.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    // Keep the browser UI (address bar on mobile) in step with the canvas.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
    if (meta) meta.content = resolved === "dark" ? "#0c101c" : "#f4ecd8";
  }, [resolved]);

  const setChoice = useCallback((c: ThemeChoice) => {
    setChoiceState(c);
    try {
      // Always written, including "system". Removing the key would make
      // "system" indistinguishable from "never chose anything", and the
      // default is now light — so deleting it would silently mean light.
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // Storage unavailable; the choice still applies for this session.
    }
  }, []);

  // The toggle is the one a reader actually reaches, and it must never land on
  // "system" by accident — that is a hidden third state with no button. So it
  // cycles light -> dark -> light, and "system" is reachable only from a
  // deliberate three-way choice.
  const toggle = useCallback(() => {
    setChoice(resolved === "dark" ? "light" : "dark");
  }, [resolved, setChoice]);

  const value = useMemo(
    () => ({ choice, resolved, setChoice, toggle }),
    [choice, resolved, setChoice, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
