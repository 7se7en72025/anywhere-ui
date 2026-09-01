"use client";

import { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label: string;
  width?: number;
  height?: number;
  className?: string;
}

export function SignaturePad({ value, onChange, label, width = 400, height = 200, className }: SignaturePadProps) {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    const pos = getPos(e);
    ctx?.beginPath();
    ctx?.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    const pos = getPos(e);
    ctx?.lineTo(pos.x, pos.y);
    ctx?.stroke();
  };

  const endDraw = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange("");
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label id={id} className="text-sm font-medium">
        {label}
      </label>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        aria-labelledby={id}
        role="img"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
        className="cursor-crosshair rounded-md border border-neutral-300 dark:border-neutral-700"
        style={{ touchAction: "none" }}
      />
      <button
        type="button"
        onClick={clear}
        aria-label="Clear signature"
        className="self-start rounded px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        Clear
      </button>
    </div>
  );
}
