"use client";

import React from "react";

export interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: number;
  className?: string;
  as?: "div" | "section" | "article";
}

export function AspectRatio({
  children,
  ratio = 16 / 9,
  className = "",
  as = "div",
}: AspectRatioProps) {
  const Tag = as;

  return (
    <Tag
      className={className}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${(1 / ratio) * 100}%`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </Tag>
  );
}
