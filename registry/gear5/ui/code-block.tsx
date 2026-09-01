import { CopyButton } from "./copy-button";
import { cn } from "../lib/cn";

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

/**
 * `dir="ltr"` unconditionally: code is always left-to-right regardless of the
 * surrounding page's direction — an RTL page that lets a `<pre>` inherit
 * `dir="rtl"` scrambles the visual order of punctuation and brackets in every
 * snippet it shows.
 */
export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-neutral-950 text-start", className)}>
      <div className="absolute end-2 top-2">
        <CopyButton value={code} label="Copy" copiedLabel="Copied" className="border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800" />
      </div>
      <pre dir="ltr" className="overflow-x-auto p-4 pe-16 text-sm text-neutral-100">
        {/* data-language, not lang: `lang` names a natural (human) language —
            a BCP 47 tag like "en" — and axe's valid-lang rule correctly
            rejects a programming-language value like "js" there. */}
        <code data-language={language}>{code}</code>
      </pre>
    </div>
  );
}
