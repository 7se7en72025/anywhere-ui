"use client";

import React from "react";

export interface StackLayoutProps {
  children: React.ReactNode;
  direction?: "vertical" | "horizontal";
  gap?: string;
  dividers?: boolean;
  dividerColor?: string;
  className?: string;
  as?: "div" | "section" | "nav" | "ul" | "ol";
}

export function StackLayout({
  children,
  direction = "vertical",
  gap = "1rem",
  dividers = false,
  dividerColor = "var(--color-border, #e5e7eb)",
  className = "",
  as = "div",
}: StackLayoutProps) {
  const isHorizontal = direction === "horizontal";
  const childArray = React.Children.toArray(children);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    gap: dividers ? "0" : gap,
    margin: 0,
    padding: 0,
    listStyle: "none",
  };

  const itemStyle: React.CSSProperties = isHorizontal
    ? {
        borderInlineEnd: dividers
          ? `1px solid ${dividerColor}`
          : undefined,
        paddingInlineEnd: dividers ? gap : undefined,
      }
    : {
        borderBottom: dividers ? `1px solid ${dividerColor}` : undefined,
        paddingBottom: dividers ? gap : undefined,
      };

  const Tag = as;

  return (
    <Tag className={className} style={containerStyle} role="list">
      {childArray.map((child, index) => (
        <li key={index} style={{ ...itemStyle, display: "block" }} role="listitem">
          {child}
        </li>
      ))}
    </Tag>
  );
}
