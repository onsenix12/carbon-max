# Changi Carbon Calculator — Brandbook

*Design & Development Reference for Web App + Telegram Bot*

---

## 1. Brand Essence

### Brand Positioning

The Changi Carbon Calculator is an extension of Changi Airport's brand promise of **"Connecting Lives"** — now connecting travelers to their environmental impact and empowering conscious choices.

### Product Meaning

**Changi Carbon** represents the intersection of:
- 🌏 **World-class travel** — The excellence Changi is known for
- 🌱 **Sustainability leadership** — The commitment to net-zero by 2050
- 🤝 **Shared responsibility** — Airport, airlines, merchants, and passengers together

### Brand Promise

> "Every journey leaves a footprint. We help you understand yours — and make it lighter."

### The Brand Represents

| Core Value | Expression in Product |
|------------|----------------------|
| Transparency, not guilt | Show data clearly; never shame users for choices |
| Empowerment, not restriction | Offer alternatives; let users decide |
| Progress, not perfection | Celebrate small wins; track improvement over time |
| Community, not isolation | Connect individual action to collective impact |

### Personality

| Trait | Expression | What to Avoid |
|-------|------------|---------------|
| **Knowledgeable** | Accurate data, clear methodology, educational content | Jargon, overwhelming statistics |
| **Encouraging** | Celebrate green choices, show progress, reward action | Lecturing, guilt-tripping |
| **Trustworthy** | Transparent calculations, cited sources, honest limitations | Greenwashing, vague claims |
| **Helpful** | Actionable suggestions, easy comparisons, simple next steps | Passive information dumps |
| **Warm** | Friendly tone, personalized insights, genuine care | Cold, robotic, bureaucratic |

---

## 2. Visual Language Overview

### Design Philosophy

The Changi Carbon Calculator inherits Changi Airport's design excellence while introducing a dedicated **sustainability layer**. The result should feel like a natural extension of the Changi App — premium, trustworthy, and distinctly Singaporean.

### Core Principles

1. **Premium meets approachable** — Changi's world-class aesthetic with warmth
2. **Data with meaning** — Numbers always have context and comparison
3. **Green as accent, not overwhelm** — Sustainability woven in, not shouted
4. **Clean over cluttered** — Generous whitespace, focused content
5. **Motion with purpose** — Animations that guide, not distract

### Visual Tone Spectrum

```
Changi Corporate ←————————————— Changi Carbon ——————————————→ Pure Sustainability
[Authoritative]                    [Balanced]                    [Activist]
[High-contrast]                    [Warm contrast]               [Soft/organic]
[Technology-driven]                [Tech + Nature]               [Nature-first]

                                      ↑
                              We sit here
```

### Design DNA

| Changi DNA | Carbon Calculator Adaptation |
|------------|------------------------------|
| Sleek, modern | Maintain — clean interfaces, refined typography |
| High-contrast | Soften slightly — accessible but not harsh |
| Authoritative | Balance with warmth — trustworthy but friendly |
| Technology-driven | Add organic touches — tech serving nature |
| Service-oriented | Extend to environment — service to planet |

---

## 3. Color System (CSS Reference)

### Primary Palette — Changi Core

These colors come directly from Changi Airport Group's brand identity.

```css
:root {
  /* Changi Core Colors */
  --changi-navy: #0f1133;        /* Primary dark — headers, key text */
  --changi-purple: #693874;      /* Accent — interactive elements */
  --changi-cream: #f3efe9;       /* Background — light surfaces */
  --changi-red: #902437;         /* Alert/Action — CTAs, warnings */
  --changi-gray: #5b5b5b;        /* Secondary text — body copy */
}
```

### Secondary Palette — Carbon Green

These colors extend the Changi palette for sustainability contexts.

```css
:root {
  /* Carbon Green Spectrum */
  --carbon-leaf: #2D8B4E;        /* Primary green — eco badges, positive indicators */
  --carbon-mint: #4ECDC4;        /* Fresh accent — highlights, progress */
  --carbon-sage: #87A878;        /* Soft green — backgrounds, subtle indicators */
  --carbon-forest: #1B4332;      /* Deep green — dark mode, emphasis */
  --carbon-lime: #B7E4C7;        /* Light green — success states, celebrations */
}
```

### Semantic Colors

```css
:root {
  /* Emission Levels */
  --emission-low: #4ECDC4;       /* Excellent — A rating */
  --emission-medium: #F4D35E;    /* Moderate — B/C rating */
  --emission-high: #F97316;      /* High — D rating */
  --emission-critical: #902437;  /* Very high — E/F rating */
  
  /* Status Colors */
  --status-success: #2D8B4E;     /* Completed, achieved */
  --status-warning: #F4D35E;     /* Attention needed */
  --status-error: #902437;       /* Error, critical */
  --status-info: #693874;        /* Information, neutral */
  
  /* Interactive States */
  --interactive-default: #693874;
  --interactive-hover: #0f1133;
  --interactive-active: #2D8B4E;
  --interactive-disabled: #9CA3AF;
}
```

### Gradient Definitions

```css
:root {
  /* Primary Brand Gradient — Changi signature */
  --gradient-changi: linear-gradient(
    135deg,
    #693874 0%,
    #902437 50%,
    #F4A261 100%
  );
  
  /* Carbon Journey Gradient — for progress indicators */
  --gradient-carbon: linear-gradient(
    90deg,
    #902437 0%,      /* High emissions */
    #F4D35E 50%,     /* Medium */
    #2D8B4E 100%     /* Low emissions */
  );
  
  /* Eco Positive Gradient — for rewards/achievements */
  --gradient-eco: linear-gradient(
    135deg,
    #2D8B4E 0%,
    #4ECDC4 50%,
    #B7E4C7 100%
  );
  
  /* Dashboard Header Gradient */
  --gradient-dashboard: linear-gradient(
    180deg,
    #0f1133 0%,
    #1a1f4e 100%
  );
}
```

### Color Usage Guidelines

| Context | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| **Headers/Navigation** | --changi-navy | --changi-cream | --changi-purple |
| **Body Content** | --changi-gray | --changi-cream | --carbon-leaf |
| **Emission Display** | Semantic colors | --changi-cream | Context-dependent |
| **Rewards/Gamification** | --carbon-leaf | --carbon-lime | --gradient-eco |
| **Alerts/Actions** | --changi-red | --changi-cream | --changi-purple |
| **Dashboard (Ops)** | --changi-navy | --changi-gray | --carbon-mint |

### Dark Mode Palette

```css
[data-theme="dark"] {
  --background-primary: #0f1133;
  --background-secondary: #1a1f4e;
  --background-tertiary: #252b5c;
  --text-primary: #f3efe9;
  --text-secondary: #9CA3AF;
  --border-color: #374151;
  
  /* Adjusted greens for dark mode */
  --carbon-leaf: #4ADE80;
  --carbon-mint: #5EEAD4;
}
```

---

## 4. Typography

### Font Stack

```css
:root {
  /* Primary Font — Changi Brand Font */
  --font-primary: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Numeric Font — for emission numbers, statistics */
  --font-numeric: 'Lato', 'Tabular Nums', monospace;
  
  /* Fallback System Stack */
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### Type Scale

```css
:root {
  /* Headings */
  --text-h1: 2.25rem;    /* 36px — Page titles */
  --text-h2: 1.875rem;   /* 30px — Section headers */
  --text-h3: 1.5rem;     /* 24px — Card titles */
  --text-h4: 1.25rem;    /* 20px — Subsections */
  --text-h5: 1.125rem;   /* 18px — Labels */
  
  /* Body */
  --text-body: 1rem;     /* 16px — Primary content */
  --text-small: 0.875rem; /* 14px — Secondary content */
  --text-tiny: 0.75rem;  /* 12px — Captions, metadata */
  
  /* Special */
  --text-stat: 3rem;     /* 48px — Large statistics */
  --text-emission: 2.5rem; /* 40px — Emission numbers */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Font Weights

```css
:root {
  --font-light: 300;     /* Subtle text */
  --font-regular: 400;   /* Body copy */
  --font-medium: 500;    /* Emphasis */
  --font-semibold: 600;  /* Headings */
  --font-bold: 700;      /* Strong emphasis, stats */
  --font-black: 900;     /* Hero numbers */
}
```

### Typography Usage

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Page Title | h1 | Bold | --changi-navy | Single per page |
| Section Header | h2 | Semibold | --changi-navy | With subtle divider |
| Card Title | h3 | Semibold | --changi-navy | — |
| Body Text | body | Regular | --changi-gray | line-height: 1.5 |
| Emission Number | emission | Black | Context color | Always with unit |
| Caption | tiny | Regular | --changi-gray | Metadata, sources |
| Button | small | Semibold | Inherit | UPPERCASE optional |

### Emission Number Formatting

```
✅ 1,842 kg CO₂e     — Comma separators, subscript
✅ 1.8 tonnes        — Decimal for large numbers
❌ 1842kg            — No separator, no space
❌ 1,842 kilograms   — Spell out only in education
```

---

## 5. Components & Motion

### Motion Principles

> "Everything floats. Nothing snaps."

```css
:root {
  /* Timing Functions */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Durations */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
}
```

### Standard Transitions

```css
/* Default transition for all interactive elements */
.interactive {
  transition: all var(--duration-normal) var(--ease-default);
}

/* Button hover */
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 17, 51, 0.15);
}

/* Card hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(15, 17, 51, 0.12);
}

/* Progress bar fill */
.progress-fill {
  transition: width var(--duration-slow) var(--ease-out);
}

/* Number count-up */
.stat-number {
  transition: all var(--duration-slower) var(--ease-out);
}
```

### Component-Specific Motion

| Component | Trigger | Animation | Duration |
|-----------|---------|-----------|----------|
| Modal | Open | Fade in + Scale from 0.95 | 300ms |
| Toast | Appear | Slide in from right | 200ms |
| Dropdown | Open | Fade + Slide down | 200ms |
| Card | Hover | Lift (translateY -4px) | 200ms |
| Button | Click | Scale to 0.97 | 100ms |
| Progress | Update | Width transition | 500ms |
| Badge earned | Award | Pop (scale 0→1.1→1) | 400ms + bounce |
| Emission reveal | Calculate | Count up + Fade in | 700ms |

### Loading States

```css
/* Skeleton pulse */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--changi-cream) 0%,
    #e0ddd7 50%,
    var(--changi-cream) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Carbon calculation spinner */
.carbon-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 6. Component Library

### Card Styles

```css
/* Base Card */
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(15, 17, 51, 0.08);
  border: 1px solid rgba(15, 17, 51, 0.06);
}

/* Emission Result Card */
.card-emission {
  background: var(--changi-cream);
  border-left: 4px solid var(--carbon-leaf);
}

/* Green Merchant Card */
.card-merchant {
  background: linear-gradient(135deg, #f0fdf4 0%, white 100%);
  border: 1px solid var(--carbon-lime);
}

/* Achievement Card */
.card-achievement {
  background: var(--gradient-eco);
  color: white;
}
```

### Button Styles

```css
/* Primary Button */
.btn-primary {
  background: var(--changi-purple);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}

.btn-primary:hover {
  background: var(--changi-navy);
}

/* Green Action Button */
.btn-green {
  background: var(--carbon-leaf);
  color: white;
}

/* Outline Button */
.btn-outline {
  background: transparent;
  border: 2px solid var(--changi-purple);
  color: var(--changi-purple);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--changi-purple);
}
```

### Badge Styles

```css
/* Carbon Rating Badge */
.badge-rating {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--text-tiny);
  font-weight: 600;
}

.badge-rating-a { background: var(--emission-low); color: white; }
.badge-rating-b { background: #86EFAC; color: var(--carbon-forest); }
.badge-rating-c { background: var(--emission-medium); color: var(--changi-navy); }
.badge-rating-d { background: var(--emission-high); color: white; }
.badge-rating-e { background: var(--emission-critical); color: white; }

/* Achievement Badge */
.badge-achievement {
  background: var(--gradient-eco);
  padding: 8px 16px;
  border-radius: 24px;
  color: white;
  font-weight: 600;
}

/* Points Badge */
.badge-points {
  background: var(--changi-purple);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--text-tiny);
}
```

### Input Styles

```css
/* Standard Input */
.input {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: var(--text-body);
  transition: border-color var(--duration-fast);
}

.input:focus {
  border-color: var(--changi-purple);
  outline: none;
  box-shadow: 0 0 0 3px rgba(105, 56, 116, 0.1);
}

/* Select Dropdown */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* chevron */
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}
```

---

## 7. Iconography

### Icon Style

- **Style:** Outlined, 2px stroke
- **Corners:** Rounded (2px radius)
- **Size:** 24px default, 20px small, 32px large
- **Source:** Lucide Icons (recommended) or Heroicons

### Required Icons

| Category | Icons Needed |
|----------|--------------|
| **Navigation** | Home, Calculator, Shop, Rewards, Chat, Settings |
| **Emission** | Plane, Shopping bag, Utensils, Car/Transport, Tree |
| **Action** | Plus, Minus, Check, X, Arrow right, External link |
| **Status** | Info, Warning, Success, Error |
| **Gamification** | Trophy, Badge, Star, Gift, Trending up |
| **Social** | Share, Heart, Bookmark |

### Emoji Usage

Emojis are encouraged for warmth and quick recognition:

| Context | Recommended Emoji |
|---------|-------------------|
| Flight | ✈️ 🛫 🛬 |
| Shopping | 🛍️ 🛒 |
| Food | 🍽️ 🥗 🌱 |
| Transport | 🚕 🚇 🚶 |
| Achievement | 🏆 🎖️ ⭐ 🎉 |
| Nature | 🌳 🌱 🌿 🌍 |
| Progress | 📈 💪 ✨ |

---

## 8. Layout & Spacing

### Spacing Scale

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### Container Widths

```css
:root {
  --container-sm: 640px;   /* Mobile content */
  --container-md: 768px;   /* Tablet */
  --container-lg: 1024px;  /* Desktop */
  --container-xl: 1280px;  /* Wide desktop */
}
```

### Border Radius

```css
:root {
  --radius-sm: 4px;    /* Small elements, badges */
  --radius-md: 8px;    /* Buttons, inputs */
  --radius-lg: 12px;   /* Cards */
  --radius-xl: 16px;   /* Modals, large cards */
  --radius-2xl: 24px;  /* Floating elements */
  --radius-full: 9999px; /* Pills, avatars */
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(15, 17, 51, 0.05);
  --shadow-md: 0 2px 8px rgba(15, 17, 51, 0.08);
  --shadow-lg: 0 8px 24px rgba(15, 17, 51, 0.12);
  --shadow-xl: 0 16px 48px rgba(15, 17, 51, 0.16);
  
  /* Colored shadows for emphasis */
  --shadow-green: 0 4px 12px rgba(45, 139, 78, 0.25);
  --shadow-purple: 0 4px 12px rgba(105, 56, 116, 0.25);
}
```

---

## 9. Voice & Tone

### Ask Max (Carbon Advisor) Voice

**Personality:** Friendly expert, encouraging guide, never preachy

| Situation | Tone | Example |
|-----------|------|---------|
| Explaining emissions | Clear, educational | "Your flight produces 1,842 kg CO₂e — that's about what 92 trees absorb in a year." |
| Suggesting alternatives | Helpful, not pushy | "If you're flexible, economy class would reduce your footprint by 77%." |
| Celebrating choices | Warm, genuine | "Nice choice! That plant-based meal just earned you 15 Green Points 🌱" |
| Answering questions | Knowledgeable, concise | "Radiative forcing accounts for non-CO₂ effects like contrails. It roughly doubles aviation's climate impact." |
| Nudging action | Encouraging, not guilty | "You're 50 points away from your next badge. Offsetting this flight would get you there! 🎯" |

### Content Guidelines

| Do | Don't |
|----|-------|
| "Your footprint" | "Your damage" |
| "Consider" | "You should" |
| "Great choice!" | "Finally, a good decision" |
| "Here's what this means" | "This is bad because" |
| "You could save X kg" | "You're wasting X kg" |
| "Progress so far: 60%" | "Still 40% to go" |

### Number Formatting

```
Emissions:     1,842 kg CO₂e  (always with unit)
Money:         S$45.00        (Singapore dollars)
Percentages:   12.4%          (one decimal)
Large numbers: 582K tCO₂e     (K/M suffixes for thousands/millions)
Comparisons:   3.2x higher    (relative, not absolute when comparing)
```

---

## 10. Accessibility

### Color Contrast

All text must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Tested Combinations

| Background | Text Color | Ratio | Pass |
|------------|------------|-------|------|
| --changi-cream | --changi-navy | 12.4:1 | ✅ AAA |
| --changi-cream | --changi-gray | 5.2:1 | ✅ AA |
| --changi-navy | white | 15.1:1 | ✅ AAA |
| --carbon-leaf | white | 4.6:1 | ✅ AA |
| --emission-medium | --changi-navy | 8.3:1 | ✅ AAA |

### Focus States

```css
/* Visible focus ring for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--changi-purple);
  outline-offset: 2px;
}

/* Remove outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Screen Reader Support

- All images have descriptive alt text
- Emission charts have text alternatives
- Interactive elements have ARIA labels
- Progress indicators announce changes

---

## 11. Platform-Specific Guidelines

### Changi App Simulation (Web)

- Mobile-first responsive design
- Bottom navigation bar (iOS/Android style)
- Native-feeling transitions
- Pull-to-refresh gesture support
- Safe area padding for notched devices

### Telegram Bot

- Use Telegram's native inline keyboards
- Keep messages under 4096 characters
- Use markdown formatting sparingly
- Include callback buttons for quick actions
- Respect Telegram's rate limits

### Operations Dashboard

- Desktop-optimized (1280px+)
- Sidebar navigation
- Data-dense but scannable
- Export functionality prominent
- Real-time update indicators

---

## 12. Asset Checklist

### Required Assets

- [ ] Changi Airport logo (official, licensed)
- [ ] Carbon leaf icon (custom)
- [ ] Green Points icon (custom)
- [ ] Achievement badges (5 designs)
- [ ] Emission tier icons (A-E rating)
- [ ] Max avatar (Ask Max chat)
- [ ] Loading animation (Lottie/CSS)
- [ ] Empty states illustrations
- [ ] Error state illustrations
- [ ] Onboarding illustrations (3-4)

### Favicon Set

```
favicon.ico          — 32x32, 16x16
apple-touch-icon.png — 180x180
icon-192.png         — 192x192 (PWA)
icon-512.png         — 512x512 (PWA)
```

---

## Appendix: Quick Reference

### Tailwind Config (if using)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        changi: {
          navy: '#0f1133',
          purple: '#693874',
          cream: '#f3efe9',
          red: '#902437',
          gray: '#5b5b5b',
        },
        carbon: {
          leaf: '#2D8B4E',
          mint: '#4ECDC4',
          sage: '#87A878',
          forest: '#1B4332',
          lime: '#B7E4C7',
        },
      },
      fontFamily: {
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
    },
  },
};
```

### shadcn/ui Theme

```javascript
// For shadcn/ui components
{
  "style": "default",
  "tailwind": {
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial brandbook for MVP |

---

*This brandbook is a living document. Update as the product evolves.*

*Brand Foundation: Changi Airport Group*
*Product: Changi Carbon Calculator*
*Framework: CARBON (Context → Assets → Recipients → Behaviors → Offerings → Next)*
