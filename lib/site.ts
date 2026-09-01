export const siteConfig = {
  name: "Gear5 UI",
  tagline: "React components that work anywhere.",
  description:
    "Accessible, translation-ready React components engineered for slow networks, cheap phones, and screen readers. Every component is verified in CI on ten axes: performance, accessibility, internationalisation, privacy, security, resilience, offline support, SSR safety, sensory safety, and supply chain.",
  repo: "https://github.com/7se7en72025/gear5-ui",
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
