# Changelog

All notable changes to Anywhere UI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-01

### Added

- 87 UI components across 8 categories
- 11 shared primitives (hooks and utilities)
- 10-axis verification system (performance, accessibility, internationalisation, privacy, security, resilience, offline, SSR safety, sensory safety, supply chain)
- 866 tests covering all axes
- Copy-paste distribution via shadcn CLI
- Live documentation site with component browser and playground
- Support for 10+ locales including RTL languages
- Support for non-Gregorian calendars (Islamic, Buddhist, Persian)
- Address field forms for 43 countries
- Name field order for family-name-first languages
- Network simulation (Fast, Slow, Offline)
- Draft storage with security exclusions (passwords, payment fields, OTPs)
- AdaptiveImage with Save-Data awareness
- AsyncBoundary with four states (loading, error, empty, offline)
- ResilientForm with offline queueing and double-submit prevention
- ErrorBoundary with announced, focusable, recoverable fallback
- ThemeToggle with system preference detection
- CommandPalette with keyboard navigation
- Zero runtime dependencies enforced by CI
- SSR verification through react-dom/server
- Accessibility testing via axe
- Static analysis for forbidden APIs (fetch, eval, innerHTML)
- prefers-reduced-motion enforcement for animations
