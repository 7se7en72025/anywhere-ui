"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface CreditCardFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

function detectCardType(digits: string): string | null {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return null;
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

const CARD_ICONS: Record<string, string> = {
  Visa: "💳",
  Mastercard: "💳",
  Amex: "💳",
  Discover: "💳",
};

export function CreditCardField({ value, onChange, label, className }: CreditCardFieldProps) {
  const id = useId();
  const raw = value.replace(/\D/g, "");
  const cardType = detectCardType(raw);

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          value={formatCardNumber(value)}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 16))}
          placeholder="1234 5678 9012 3456"
          aria-describedby={cardType ? `${id}-type` : undefined}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pe-16 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />
        {cardType && (
          <span id={`${id}-type`} className="absolute end-3 top-1/2 -translate-y-1/2 text-sm" aria-label={cardType}>
            {CARD_ICONS[cardType]} {cardType}
          </span>
        )}
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Enter your 16-digit card number
      </p>
    </div>
  );
}
