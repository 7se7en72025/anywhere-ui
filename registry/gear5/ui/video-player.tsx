"use client";

import React, { useCallback, useRef, useState } from "react";

export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  label?: string;
}

export function VideoPlayer({
  src,
  poster,
  label = "Video player",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCaptions, setShowCaptions] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<TextTrack | null>(null);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  }, []);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;
      const value = Number(e.target.value);
      video.currentTime = (value / 100) * video.duration;
      setProgress(value);
    },
    []
  );

  const toggleCaptions = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!trackRef.current) {
      trackRef.current = video.textTracks?.[0] ?? null;
    }
    const track = trackRef.current;
    if (track) {
      track.mode = showCaptions ? "hidden" : "showing";
    }
    setShowCaptions((prev) => !prev);
  }, [showCaptions]);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label}
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "0.75rem",
        overflow: "hidden",
        backgroundColor: "#000",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        style={{ width: "100%", display: "block" }}
        preload="metadata"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      >
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: "0.25rem",
            display: "flex",
          }}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <rect x="4" y="3" width="3.5" height="12" rx="1" />
              <rect x="10.5" y="3" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M4 2v14l12-7z" />
            </svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          aria-label="Seek"
          style={{ flex: 1, height: 4, cursor: "pointer" }}
        />
        <button
          onClick={toggleCaptions}
          aria-label={showCaptions ? "Hide captions" : "Show captions"}
          aria-pressed={showCaptions}
          style={{
            background: showCaptions ? "rgba(255,255,255,0.2)" : "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: "0.25rem",
            borderRadius: "0.25rem",
            display: "flex",
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          CC
        </button>
        <button
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: "0.25rem",
            display: "flex",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
