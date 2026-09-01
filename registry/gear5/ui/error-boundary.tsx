"use client";

import { Component, useId, type ReactNode } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";

export interface ErrorBoundaryLabels {
  heading: string;
  retry: string;
}

const DEFAULT_LABELS: ErrorBoundaryLabels = {
  heading: "This part of the page couldn't load.",
  retry: "Try again",
};

interface ErrorBoundaryProps {
  children: ReactNode;
  labels?: Partial<ErrorBoundaryLabels>;
  /** Called after the user presses retry, before the boundary resets. */
  onReset?: () => void;
  /** Custom fallback. Receives the error and a reset function. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  className?: string;
}

interface State {
  error: Error | null;
}

/**
 * Contains a render crash to the subtree that caused it.
 *
 * The resilience thesis: one bad API response, one malformed date, one
 * component with a bug should cost the user the widget that broke — not the
 * page they were in the middle of using. React's own contract requires a
 * class component for this; there is no hook equivalent.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    announce(this.props.labels?.heading ?? DEFAULT_LABELS.heading, "assertive");
    // Bugs should be loud in development and silent-but-contained in
    // production — this is the one place in the library that should log.
    if (process.env.NODE_ENV !== "production") console.error(error);
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    const labels = { ...DEFAULT_LABELS, ...this.props.labels };
    return <ErrorFallback labels={labels} onRetry={this.reset} className={this.props.className} />;
  }
}

function ErrorFallback({
  labels,
  onRetry,
  className,
}: {
  labels: ErrorBoundaryLabels;
  onRetry: () => void;
  className?: string;
}) {
  const headingId = useId();

  return (
    <div
      role="alert"
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-start dark:border-red-900/60 dark:bg-red-950/40",
        className,
      )}
    >
      <p id={headingId} className="text-sm text-red-900 dark:text-red-200">
        {labels.heading}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-900 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-red-800 dark:text-red-100 dark:hover:bg-red-900/40"
      >
        {labels.retry}
      </button>
    </div>
  );
}
