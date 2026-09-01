"use client";

import React from "react";

export interface ContainerNarrowProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main";
  ariaLabel?: string;
}

export function ContainerNarrow({
  children,
  className = "",
  as = "div",
  ariaLabel,
}: ContainerNarrowProps) {
  const Tag = as;

  return (
    <Tag
      className={className}
      aria-label={ariaLabel}
      style={{
        width: "100%",
        maxWidth: "42rem",
        marginInline: "auto",
        paddingInline: "1.5rem",
      }}
    >
      {children}
    </Tag>
  );
}
