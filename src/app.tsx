import { Suspense, lazy, useEffect, useRef, type ReactNode } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router";

import { ErrorBoundary } from "@/components/site/ErrorBoundary";
import { IntroGate } from "@/components/intro/IntroGate";
import { Masthead } from "@/components/site/Masthead";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ThemeProvider } from "@/hooks/useTheme";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

/**
 * Route-level code splitting.
 *
 * `/` is eager because it is the entry point. Everything else is lazy, which
 * keeps the table, the toolbar, the Radix sheet and the filter menus off the
 * landing page's critical path — they are only fetched when a reader asks for
 * them. Measured effect is in docs/06-PERFORMANCE.md.
 *
 * The fallback reserves height so nothing shifts when the chunk lands. A
 * spinner or a skeleton that changes the page height is a CLS regression, and
 * CLS is one of the four metrics we are held to.
 */
const RankingsPage = lazy(() =>
  import("@/pages/RankingsPage").then((m) => ({ default: m.RankingsPage })),
);
const SchoolPage = lazy(() => import("@/pages/SchoolPage").then((m) => ({ default: m.SchoolPage })));
const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const MethodologyPage = lazy(() => import("@/pages/MethodologyPage").then((m) => ({ default: m.MethodologyPage })));
const AnnualReportPage = lazy(() => import("@/pages/AnnualReportPage").then((m) => ({ default: m.AnnualReportPage })));

/**
 * The app shell.
 *
 * React Router in DECLARATIVE mode on purpose: there are no loaders, actions or
 * server state here, so the data-router machinery would be dead weight. We use
 * the router for exactly three things — `:id` matching, scroll restoration and
 * `NavLink` active state.
 *
 * There is deliberately NO animation library and NO TooltipProvider: no
 * component currently needs a tooltip, and wiring the provider in for a
 * possibly-unused feature is exactly what the add-a-dependency checklist
 * exists to prevent. See docs/01-STACK.md § motion.
 *
 * `prefers-reduced-motion` is honoured by the global CSS rule in
 * `src/styles/index.css` plus the `useReducedMotion()` hook, with no library in
 * the path.
 */
export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function Shell() {
  return (
    <SiteChrome>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/school/:id" element={<SchoolPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/reports" element={<AnnualReportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </SiteChrome>
  );
}

/**
 * Everything around the routed page: the splash gate, scroll and focus
 * management, the skip link, the masthead, the `<main>` landmark and the footer.
 *
 * Extracted from `Shell` and exported so the test harnesses render the real
 * chrome rather than a hand-copied version of it. When the harnesses built
 * their own route tree they silently omitted this, and `check-a11y.mjs`
 * correctly reported "no main landmark" — against a page that does not exist.
 * A harness that renders less than production will eventually be believed about
 * something it never saw.
 *
 * The routed content arrives as `children` rather than being imported here,
 * because the app passes lazy routes and the harnesses pass eager ones. Both
 * render identical markup; only the chunking differs.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <IntroGate>
      <ScrollReset pathname={pathname} />

      {/* First tab stop. A table-heavy site needs this. */}
      <a
        href="#main"
        className="type-ui sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-ink-inverse"
      >
        Skip to content
      </a>

      <div className="flex min-h-dvh flex-col">
        <Masthead />
        <main id="main" className="flex-1">
          {/* `resetKey` clears a previous route's render error on navigation. */}
          <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>
        </main>
        <SiteFooter />
      </div>
    </IntroGate>
  );
}

/**
 * Lazy-route placeholder.
 *
 * Reserves roughly a viewport of height and nothing else. A spinner would be an
 * animated element for a split that resolves in a few tens of milliseconds on
 * any reasonable connection, and a skeleton would have to guess the real
 * layout — both cost more than they communicate. `defer-paint` keeps the
 * browser from spending effort on an off-screen placeholder.
 */
function PageFallback() {
  return <div aria-hidden="true" className="defer-paint min-h-[60dvh]" />;
}

/**
 * Scroll and focus management for route changes.
 *
 * Scroll: reset to top on PUSH/REPLACE, leave POP alone so the browser's own
 * back/forward restoration works. `behavior: "instant"`, never "smooth" — a
 * smooth scroll on navigation fights the route transition and reads as lag.
 *
 * Focus: move to the new page's `<h1>` so a screen-reader user is told the page
 * changed. Without it, focus stays on the link they clicked and the next Tab
 * lands somewhere mid-page. Every `<h1>` therefore carries `tabIndex={-1}`.
 */
function ScrollReset({ pathname }: { pathname: string }) {
  const navType = useNavigationType();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (navType === "POP") return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, navType]);

  useEffect(() => {
    // Wait a frame so the new page's heading is in the DOM.
    const id = requestAnimationFrame(() => {
      const h1 = document.querySelector<HTMLElement>("main h1");
      // `preventScroll` so focusing does not fight the scroll reset above.
      h1?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
