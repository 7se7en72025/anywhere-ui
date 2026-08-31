"use client";

import { useId, useRef, useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";

export interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  className?: string;
}

/**
 * A drop zone that is a real, focusable, keyboard-activatable button first —
 * drag-and-drop is progressive enhancement on top of it, not the only way in,
 * since a keyboard-only or switch-access user cannot drag anything. Chosen
 * files are announced by name, since the drop zone's visual state changing
 * is otherwise the only feedback given.
 */
export function FileUpload({ label, accept, multiple = false, onFiles, className }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const handle = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    onFiles(list);
    announce(list.length === 1 ? `Selected: ${list[0].name}` : `Selected ${list.length} files`, "polite");
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handle(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-lg border-2 border-dashed p-6 text-center text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
          dragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-neutral-300 dark:border-neutral-700",
        )}
      >
        Drop a file here, or click to choose one
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => handle(event.target.files)}
        className="sr-only"
      />
    </div>
  );
}
