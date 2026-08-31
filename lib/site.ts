export const siteConfig = {
  name: "Anywhere UI",
  tagline: "React components that work anywhere.",
  description:
    "Accessible, translation-ready React components engineered for slow networks and cheap phones. Every component is verified on three axes: performance budget, WCAG conformance, and internationalisation.",
  repo: "https://github.com/7se7en72025/anywhere-ui",
  keywords: [
    "react components",
    "accessibility",
    "internationalization",
    "performance",
    "offline first",
    "save-data",
    "rtl",
    "wcag",
    "shadcn registry",
    "next.js",
  ],
} as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
