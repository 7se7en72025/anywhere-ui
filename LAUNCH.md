# Anywhere UI - Launch Strategy

## Demo Video Script (60-90 seconds)

### Concept: "The Bugs You Can't See"
A fast-paced, visually striking demo that shows real problems and how Anywhere UI fixes them.

---

### Scene 1: Hook (0-5s)
**Visual:** Black screen, white text fading in
**Text:** "Your component library works on your laptop."
**Beat:** Quick cut to a phone on a slow connection showing a broken spinner

### Scene 2: The Problem (5-15s)
**Visual:** Split screen showing common bugs
- Left: Number showing "1.2M" in Hindi (wrong, should be 12.3L)
- Left: Emoji cut in half by truncate
- Left: Date formatted as "01/02/2026" in Germany (should be 02.01.2026)
**Voiceover:** "But what about the 2.6 billion people on slow networks? The 1.3 billion with disabilities? The 6.5 billion who don't speak English?"

### Scene 3: The Solution (15-35s)
**Visual:** Quick cuts showing Anywhere UI components
1. **CompactNumber** - Same number, 3 locales side by side
2. **ResilientForm** - Go offline, fill form, come back online, form submits
3. **Locale switcher** - Click Arabic, entire UI mirrors RTL
4. **AsyncBoundary** - Error state with retry button
5. **AdaptiveImage** - Save-Data mode refuses to load

**Voiceover:** "Anywhere UI: 87 components, zero dependencies, tested against 10 axes in CI."

### Scene 4: The Tech (35-50s)
**Visual:** Terminal showing install command
```bash
npx shadcn@latest add anywhere-ui/r/async-boundary.json
```
Then quick cuts of:
- Test suite running (866 tests passing)
- Bundle sizes (all under 3.3KB gzipped)
- axe accessibility checks

**Voiceover:** "Copy-paste distribution. No npm package. No version lock. Just components that work."

### Scene 5: Social Proof (50-60s)
**Visual:** GitHub stars, component count, "Zero Dependencies" badge
**Text:** "Open source. MIT licensed."
**Voiceover:** "Built for the conditions most libraries never test against."

### Scene 6: CTA (60-70s)
**Visual:** Clean terminal with install command
**Text:** "Try it now: anywhere-ui.dev"
**Voiceover:** "anywhere-ui.dev"

---

## Reddit Posting Strategy

### Target Subreddits (Post in this order)

#### Tier 1: High Traffic, Direct Relevance
1. **r/reactjs** (700k+ members)
   - Title: "I built a component library with 866 tests, zero dependencies, and verified accessibility. Every component works offline, RTL, and in 10+ locales."
   - Flair: "Showcase"
   - Best time: Tuesday-Thursday, 9-11 AM EST

2. **r/webdev** (2M+ members)
   - Title: "Your component library probably doesn't test against 10 accessibility and i18n axes. Mine does."
   - Best time: Monday-Wednesday, 8-10 AM EST

3. **r/programming** (6M+ members)
   - Title: "How we verified 87 React components against accessibility, i18n, privacy, security, and offline resilience in CI"
   - Best time: Tuesday-Thursday, 10 AM-12 PM EST

#### Tier 2: Niche but Engaged
4. **r/accessibility** (50k+ members)
   - Title: "I built a component library where every component passes axe testing and handles focus management for screen readers"
   - Best time: Monday-Wednesday, 9-11 AM EST

5. **r/i18n** (10k+ members)
   - Title: "A React component library where RTL is a data change, not a rewrite. 10 locales, 43 country address forms."
   - Best time: Any weekday

6. **r/css** (500k+ members)
   - Title: "The design system behind 87 components: one gradient, four radii, and a single accent color"
   - Best time: Tuesday-Thursday

7. **r/nextjs** (200k+ members)
   - Title: "Built with Next.js 16 and React 19. 228 static pages, zero runtime dependencies."
   - Best time: Monday-Wednesday

#### Tier 3: Broader Tech
8. **r/javascript** (2.5M+ members)
   - Title: "A component library that ships no web fonts, no analytics, and no third-party requests"
   - Best time: Tuesday-Thursday, 9-11 AM EST

9. **r/SideProject** (200k+ members)
   - Title: "After 6 months, I shipped a component library with 866 tests, 87 components, and zero dependencies"
   - Best time: Saturday-Sunday, 10 AM-12 PM EST

10. **r/indiehackers** (100k+ members)
    - Title: "Built Anywhere UI: React components that work on 2G, offline, and in 10+ languages"
    - Best time: Weekday mornings

### Posting Tips

1. **Don't spam** - Post 1-2 per day maximum, never the same post everywhere
2. **Customize each post** - Different angle for each subreddit
3. **Engage in comments** - Reply to every question within first 2 hours
4. **Cross-post strategically** - Use Reddit's cross-post feature after original gains traction
5. **Follow up** - Post a "1 month later" update with metrics

### Post Templates

#### r/reactjs Template
```
Title: I built a component library with 866 tests, zero dependencies, and verified accessibility

Body:
Hey r/reactjs,

I've been working on Anywhere UI for the past 6 months. It's a React component library with 87 components, zero runtime dependencies, and a verification system that tests against 10 axes:

- Accessibility (axe testing on every component)
- Internationalisation (10 locales, RTL support, 43 country address forms)
- Privacy (no fetch/XHR/sendBeacon allowed)
- Security (no dangerouslySetInnerHTML/eval)
- Offline (ResilientForm saves drafts and replays)
- SSR safety (renders through react-dom/server in CI)
- And more...

Every component is copy-paste distributed via shadcn CLI. No npm package, no version lock.

Check it out: https://anywhere-ui.dev

I'd love feedback on the components and the verification approach. What axes would you add?
```

#### r/webdev Template
```
Title: Your component library probably doesn't test against 10 accessibility and i18n axes

Body:
Most component libraries are tested on the laptop they were written on.

I built Anywhere UI with a different approach: 87 components, each verified against 10 axes in CI:

1. Performance (tier-based budgets)
2. Accessibility (axe + focus management)
3. Internationalisation (locale-aware formatting)
4. Privacy (no network calls allowed)
5. Security (no dangerous sinks)
6. Resilience (error boundaries with recovery)
7. Offline (draft storage and replay)
8. SSR safety (server rendering verified)
9. Sensory safety (prefers-reduced-motion)
10. Supply chain (zero dependencies)

The results: 866 tests, all passing, every commit.

Live demo: https://anywhere-ui.dev
GitHub: https://github.com/7se7en72025/anywhere-ui
```

### Twitter/X Thread Concept

```
Tweet 1:
Your component library works on your laptop.

But what about:
- 2.6 billion people on slow networks
- 1.3 billion with disabilities  
- 6.5 billion who don't speak English

I built Anywhere UI to fix this. 87 components, zero dependencies, 866 tests.

🧵

Tweet 2:
The core insight: most bugs are invisible to the developer.

A K/M/B number formatter breaks in Hindi (where 1.2M should be 12.3L).
A truncate function cuts emoji in half.
A date picker assumes Gregorian calendar.

Tweet 3:
Every component in Anywhere UI is verified against 10 axes in CI:

♿ Accessibility
🌐 Internationalisation  
🔒 Security
📡 Offline
🖥️ SSR safety
...and 5 more

866 tests. All passing. Every commit.

Tweet 4:
Zero dependencies. Zero web fonts. Zero analytics. Zero third-party requests.

Copy-paste distribution via shadcn CLI:

npx shadcn@latest add anywhere-ui/r/async-boundary.json

Tweet 5:
Try it yourself: https://anywhere-ui.dev

Switch to Arabic and watch the whole UI mirror.
Go offline and submit a form.
See the number formatter work in 10 locales.

Open source. MIT licensed.
```
