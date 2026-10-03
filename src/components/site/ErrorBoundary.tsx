import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

/**
 * Catches render errors anywhere below it and shows a styled fallback.
 *
 * A blank white page is a failure state we never ship — a reader who hits an
 * error should still get navigation out of it. In production this is also the
 * only place `console.error` is allowed, since React requires it for the error
 * boundary to log.
 */
type Props = {
  children: ReactNode;
  /** Changing this value resets the boundary. Used to retry after navigation. */
  resetKey?: string;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: Props) {
    // A new route should clear a previous route's error.
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // React requires the log for the boundary to be useful in production.
    // `no-console` permits warn/error, so no disable directive is needed.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 text-center">
        <div aria-hidden="true" className="h-0.5 w-7 bg-bronze" />
        <h1 tabIndex={-1} className="type-title mt-6 text-ink outline-none">Something went wrong</h1>
        <p className="type-body measure mt-4 text-ink-muted">
          This page failed to render. The rankings are still available — try again, or head
          straight there.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => this.setState({ error: null })}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.assign("/rankings")}>
            See the rankings
          </Button>
        </div>
      </div>
    );
  }
}
