"use client";

import { useId, useRef, useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";
import { ProgressBar } from "./progress-bar";

export interface FileSizeUploadProps {
  label: string;
  maxSize?: number;
  accept?: string;
  onFiles: (files: File[]) => void;
  className?: string;
}

export function FileSizeUpload({ label, maxSize = 10 * 1024 * 1024, accept, onFiles, className }: FileSizeUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const oversized = Array.from(files).filter((f) => f.size > maxSize);
    if (oversized.length > 0) {
      const msg = `${oversized.length} file(s) exceed the ${formatSize(maxSize)} limit`;
      setError(msg);
      announce(msg, "assertive");
      return;
    }

    const list = Array.from(files);
    setProgress(0);
    setStatus(`Uploading ${list.length} file(s)...`);
    announce(`Uploading ${list.length} file(s)`, "polite");

    // Simulate upload progress
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setStatus(`Uploaded ${list.length} file(s) successfully`);
        announce(`Upload complete: ${list.length} file(s)`, "polite");
        onFiles(list);
      }
    }, 100);
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700"
      >
        Drop files here, or click to choose
        <br />
        <span className="text-xs text-neutral-500">Max size: {formatSize(maxSize)}</span>
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="sr-only"
      />
      {progress > 0 && progress < 100 && (
        <ProgressBar value={progress} label="Upload progress" />
      )}
      <div aria-live="polite" className="text-xs text-neutral-600 dark:text-neutral-400">
        {error && <span className="text-red-600 dark:text-red-400">{error}</span>}
        {status && !error && <span>{status}</span>}
      </div>
    </div>
  );
}
