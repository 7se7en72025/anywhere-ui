"use client";

import React from "react";

export interface AspectCardProps {
  image: React.ReactNode;
  children: React.ReactNode;
  imageRatio?: number;
  className?: string;
  cardClassName?: string;
  imageClassName?: string;
  contentClassName?: string;
  ariaLabel?: string;
}

export function AspectCard({
  image,
  children,
  imageRatio = 16 / 9,
  className = "",
  cardClassName = "",
  imageClassName = "",
  contentClassName = "",
  ariaLabel,
}: AspectCardProps) {
  return (
    <article
      aria-label={ariaLabel}
      className={`${cardClassName} ${className}`}
      style={{
        border: "1px solid var(--color-border, #e5e7eb)",
        borderRadius: "0.5rem",
        overflow: "hidden",
        background: "var(--color-bg, #fff)",
      }}
    >
      <div
        className={imageClassName}
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: `${(1 / imageRatio) * 100}%`,
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
          {image}
        </div>
      </div>
      <div
        className={contentClassName}
        style={{ padding: "1rem" }}
      >
        {children}
      </div>
    </article>
  );
}
