"use client";

import React, { useCallback, useState } from "react";

export interface VideoEmbedProps {
  src?: string;
  title?: string;
  label?: string;
}

export function VideoEmbed({
  src,
  title = "Embedded video",
  label = "Video player",
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setPlaying(true);
  }, []);

  return (
    <div
      role="region"
      aria-label={label}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
        borderRadius: "0.75rem",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {playing ? (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      ) : (
        <button
          onClick={handlePlay}
          aria-label={`Play ${title}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            backgroundColor: "rgba(0,0,0,0.6)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 68,
              height: 48,
              borderRadius: "0.75rem",
              backgroundColor: "rgba(255,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span
            aria-hidden="true"
            style={{
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
