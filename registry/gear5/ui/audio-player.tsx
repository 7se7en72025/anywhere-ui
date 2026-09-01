"use client";

import React, { useCallback, useRef, useState } from "react";

export interface AudioPlayerProps {
  src?: string;
  label?: string;
}

export function AudioPlayer({ src, label = "Audio player" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  }, []);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio || !audio.duration) return;
      const value = Number(e.target.value);
      audio.currentTime = (value / 100) * audio.duration;
      setProgress(value);
    },
    []
  );

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setVolume(val);
      if (audioRef.current) audioRef.current.volume = val;
    },
    []
  );

  return (
    <div
      role="region"
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.75rem",
        backgroundColor: "#f5f5f5",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} preload="metadata" />
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#1a73e8",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="3" y="2" width="3" height="10" rx="1" />
            <rect x="8" y="2" width="3" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M3 1.5v11l9-5.5z" />
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
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          fontSize: "0.75rem",
          color: "#666",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {volume > 0 && (
            <>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
            </>
          )}
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={handleVolume}
          aria-label="Volume"
          style={{ width: 60, height: 4, cursor: "pointer" }}
        />
      </label>
    </div>
  );
}
