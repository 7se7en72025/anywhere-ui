"use client";

import React, { useCallback, useRef, useState } from "react";

export interface CarouselProps {
  slides: React.ReactNode[];
  ariaLabel?: string;
}

export function Carousel({ slides, ariaLabel = "Carousel" }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current === null) return;
      const diff = touchStart.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goNext() : goPrev();
      }
      touchStart.current = null;
    },
    [goNext, goPrev]
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "0.75rem",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        aria-live="polite"
        style={{
          display: "flex",
          transition: "transform 0.3s ease",
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${slides.length}`}
            aria-hidden={i !== current}
            style={{
              minWidth: "100%",
              flexShrink: 0,
            }}
          >
            {slide}
          </div>
        ))}
      </div>
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          top: "50%",
          left: "0.5rem",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.8)",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <button
        onClick={goNext}
        aria-label="Next slide"
        style={{
          position: "absolute",
          top: "50%",
          right: "0.5rem",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.8)",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div
        role="tablist"
        aria-label="Slide navigation"
        style={{
          position: "absolute",
          bottom: "0.75rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.375rem",
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "none",
              backgroundColor: i === current ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
