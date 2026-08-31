"use client";

import { createContext, useCallback, useContext, useId, useMemo, useState } from "react";
import { cn } from "../lib/cn";
import { Portal } from "./portal";

export type ToastTone = "neutral" | "success" | "danger";

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONES: Record<ToastTone, string> = {
  neutral: "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
  success: "bg-green-700 text-white",
  danger: "bg-red-700 text-white",
};

/**
 * Toast queue and viewport. Each toast is its own live region — mounted
 * empty, then filled a frame later, matching the timing that makes
 * `announce()` actually audible — with `assertive` reserved for `danger`
 * toasts, since a routine success message should not interrupt anything.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const baseId = useId();

  const show = useCallback((message: string, tone: ToastTone = "neutral") => {
    const id = `${baseId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, [baseId]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role={toast.tone === "danger" ? "alert" : "status"}
              className={cn("rounded-lg px-4 py-2.5 text-sm shadow-lg", TONES[toast.tone])}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
