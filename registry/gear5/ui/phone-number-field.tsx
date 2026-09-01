"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface PhoneNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  className?: string;
}

const COUNTRIES = [
  { code: "+1", name: "US", flag: "🇺🇸" },
  { code: "+44", name: "GB", flag: "🇬🇧" },
  { code: "+91", name: "IN", flag: "🇮🇳" },
  { code: "+61", name: "AU", flag: "🇦🇺" },
  { code: "+81", name: "JP", flag: "🇯🇵" },
  { code: "+49", name: "DE", flag: "🇩🇪" },
  { code: "+33", name: "FR", flag: "🇫🇷" },
  { code: "+86", name: "CN", flag: "🇨🇳" },
  { code: "+55", name: "BR", flag: "🇧🇷" },
  { code: "+27", name: "ZA", flag: "🇿🇦" },
];

export function PhoneNumberField({ value, onChange, label, description, className }: PhoneNumberFieldProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const hintId = `${id}-hint`;
  const [country, setCountry] = useState(COUNTRIES[0]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    onChange(raw);
  };

  const formatPhone = (digits: string): string => {
    if (!digits) return "";
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {description && (
        <p id={descId} className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}
      <div className="flex gap-2">
        <select
          aria-label="Country code"
          value={country.code}
          onChange={(e) => setCountry(COUNTRIES.find((c) => c.code === e.target.value) ?? COUNTRIES[0])}
          className="rounded-md border border-neutral-300 bg-white px-2 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          value={formatPhone(value)}
          onChange={handleChange}
          aria-describedby={cn(description && descId, hintId) || undefined}
          placeholder="(555) 123-4567"
          className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />
      </div>
      <p id={hintId} className="text-xs text-neutral-500 dark:text-neutral-400">
        Format: {country.code} (XXX) XXX-XXXX
      </p>
    </div>
  );
}
