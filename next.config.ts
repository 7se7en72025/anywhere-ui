import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile in a parent directory otherwise
  // makes Turbopack infer the wrong root and warn on every build.
  turbopack: {
    root: import.meta.dirname,
  },
  outputFileTracingIncludes: {
    "/": ["./public/r/**"],
  },
};

export default nextConfig;
