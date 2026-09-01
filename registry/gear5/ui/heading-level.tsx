"use client";

import { createContext, useContext, useMemo } from "react";
import { cn } from "../lib/cn";

const HeadingLevelContext = createContext(1);

export interface HeadingSectionProps {
  children: React.ReactNode;
}

/**
 * Increments the heading level for everything inside it.
 *
 * Wrap a region whose headings sit one level deeper than the surrounding page.
 */
export function HeadingSection({ children }: HeadingSectionProps) {
  const level = useContext(HeadingLevelContext);
  const next = useMemo(() => Math.min(level + 1, 6), [level]);

  return <HeadingLevelContext.Provider value={next}>{children}</HeadingLevelContext.Provider>;
}

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * A heading that knows its own level.
 *
 * A reusable card cannot know whether it is being rendered under an `h1` or an
 * `h3`, so it guesses — and the result is a page whose heading outline skips
 * levels or restarts. That outline is the primary way screen reader users
 * navigate a page: they pull up a list of headings and jump. A broken outline
 * is a broken table of contents for exactly the people who rely on it most.
 *
 * `Heading` renders whatever level its position in the tree implies, and
 * `HeadingSection` deepens that level for its subtree — so a component is
 * correct wherever it is placed, rather than correct where it was first
 * written.
 */
export function Heading({ children, className, ...props }: HeadingProps) {
  const level = useContext(HeadingLevelContext);
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag {...props} className={cn("text-start font-semibold", className)}>
      {children}
    </Tag>
  );
}

/** The heading level the current subtree would render at. */
export function useHeadingLevel(): number {
  return useContext(HeadingLevelContext);
}
