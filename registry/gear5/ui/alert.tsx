import { cn } from "../lib/cn";

export type AlertTone = "info" | "success" | "warning" | "danger";

const TONES: Record<AlertTone, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-100",
  success:
    "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/50 dark:text-green-100",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
  danger: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100",
};

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A static, in-flow message. `role="status"` for info/success — announced
 * politely, since neither interrupts what the user is doing — and
 * `role="alert"` for warning/danger, which are assertive by nature.
 */
export function Alert({ tone = "info", title, children, className }: AlertProps) {
  const assertive = tone === "warning" || tone === "danger";

  return (
    <div
      role={assertive ? "alert" : "status"}
      className={cn("rounded-lg border p-4 text-start text-sm", TONES[tone], className)}
    >
      {title && <p className="mb-1 font-medium">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
