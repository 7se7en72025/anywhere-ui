/**
 * Tiny class-name joiner. Zero dependencies on purpose: every kilobyte we ship
 * is a kilobyte a 2G user has to download before they can read anything.
 */
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  let out = "";

  for (const input of inputs) {
    if (!input && input !== 0) continue;

    const value = Array.isArray(input) ? cn(...input) : String(input);
    if (!value) continue;

    out = out ? `${out} ${value}` : value;
  }

  return out;
}
