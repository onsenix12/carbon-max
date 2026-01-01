# Changi Carbon Calculator — Implementation Plan (v2.0)

*5-Day MVP Build Guide for Changi Airport Demo*
*Updated with Strategic Framework Alignment*

---

## Executive Summary

### What We're Building

A **Sustainable Loyalty Ecosystem** (not just a calculator) for Changi Airport that demonstrates:

1. **Customer-facing experience** — Changi App simulation + Telegram bot with SAF-first positioning
2. **Operations-facing dashboard** — Aggregate emissions view for sustainability team
3. **AI-powered Carbon Advisor** — "Ask Max" with personalized impact storytelling
4. **Eco-Loyalty System** — Green Tier status with Eco-Points (parallel to Changi Rewards)
5. **Circularity tracking** — Beyond carbon to waste reduction and sustainable choices

### Strategic Positioning

> **The window for purely "offset-based" products has closed.**

This MVP pivots from a transactional offset calculator to a **Behavioral Change Engine** that:
- Prioritizes **SAF and Removals** over avoidance offsets
- Gamifies **Reduction** (circular economy) as much as "Compensation"
- Leverages **AI** to make invisible environmental impact visible and personal

### Success Criteria

| Criteria | Target | Framework Alignment |
|----------|--------|---------------------|
| SAF-first positioning | SAF shown before offsets in all UX | Regulatory readiness (2026 mandate) |
| Radiative forcing toggle | Default ON with education | Scientific honesty, trust building |
| Eco-Points engagement | Track adoption rate | Addresses 1-2% conversion problem |
| Complete journey tracking | Flight + Shopping + F&B + Transport + Circularity | Holistic footprint |
| Ask Max impact stories | Personalized narratives, not generic certificates | Emotional connection |
| Methodology transparency | "How we calculated this" on every result | Greenwashing protection |

### Timeline

**Total: 5 days**
- Day 1: Foundation + Flight Calculator (SAF-first)
- Day 2: Changi App Simulation + Ask Max + Green Tier
- Day 3: Telegram Bot + Proactive Nudges + Circularity
- Day 4: Operations Dashboard + Gamification Polish
- Day 5: Demo Flow + Compliance Narrative

---

## Strategic Framework Alignment

Before diving into implementation, we align this MVP with the critical insights from the Sustainability Tech Idea Validation Framework:

### Key Pivots from Original Plan

| Original Approach | Framework-Aligned Approach |
|-------------------|---------------------------|
| Offset-first UX | **SAF-first UX** — Position SAF contribution prominently, offsets as secondary |
| Generic badges | **Green Tier Status** — Parallel loyalty tier with Eco-Points |
| Carbon-only tracking | **Planetary Boundaries** — Include circularity, waste, sustainable choices |
| Static certificates | **AI Impact Stories** — Personalized narratives showing specific impact |
| Assumed accuracy | **Radical Transparency** — Show methodology, cite sources, acknowledge uncertainty |
| One-time transactions | **Continuous Engagement Loop** — Pre-trip, transit, terminal, flight, post-trip |

### Greenwashing Protection

The framework warns that terms like "Carbon Neutral" are legally toxic. Our MVP implements:

1. **Never claim "carbon neutral"** — Use "carbon contribution" or "climate action"
2. **SAF Book-and-Claim transparency** — Show exactly how SAF attribution works
3. **Radiative Forcing by default** — Include non-CO2 effects (1.9x multiplier)
4. **Source citations** — Every emission factor linked to DEFRA/IATA/ICAO
5. **Uncertainty ranges** — "Estimated 1,800-2,100 kg CO2e" not false precision

---

## 1. Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHANGI SUSTAINABLE LOYALTY ECOSYSTEM                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   CUSTOMER TOUCHPOINTS              OPERATIONS TOUCHPOINT                   │
│   ┌─────────────────────┐          ┌─────────────────────┐                 │
│   │  📱 Changi App Sim  │          │  📊 Dashboard       │                 │
│   │  (Next.js Web)      │          │  (Next.js Web)      │                 │
│   │  + Green Tier UI    │          │  + SAF Tracking     │                 │
│   └──────────┬──────────┘          └──────────┬──────────┘                 │
│              │                                │                             │
│   ┌──────────┴──────────┐                     │                             │
│   │  💬 Telegram Bot    │                     │                             │
│   │  (Webhook)          │                     │                             │
│   │  + Impact Stories   │                     │                             │
│   └──────────┬──────────┘                     │                             │
│              │                                │                             │
│              └────────────┬───────────────────┘                             │
│                           ▼                                                 │
│              ┌─────────────────────────────┐                                │
│              │       API LAYER             │                                │
│              │  (Next.js API Routes)       │                                │
│              ├─────────────────────────────┤                                │
│              │ /api/calculate              │ ← Emission calculations        │
│              │ /api/chat                   │ ← Claude AI (Ask Max)          │
│              │ /api/telegram               │ ← Telegram webhook             │
│              │ /api/activity               │ ← Log customer actions         │
│              │ /api/dashboard              │ ← Aggregate data               │
│              │ /api/saf                    │ ← SAF Book-and-Claim           │
│              │ /api/eco-points             │ ← Green Tier management        │
│              │ /api/circularity            │ ← Waste/reuse tracking         │
│              └──────────┬──────────────────┘                                │
│                         ▼                                                   │
│              ┌─────────────────────────────┐                                │
│              │       DATA LAYER            │                                │
│              ├─────────────────────────────┤                                │
│              │ • routes.json               │ ← Flight routes + aircraft     │
│              │ • merchants.json            │ ← Changi shops + ratings       │
│              │ • products.json             │ ← Product categories + factors │
│              │ • emissionFactors.json      │ ← DEFRA + IATA factors         │
│              │ • safProjects.json          │ ← SAF providers + verification │
│              │ • circularityActions.json   │ ← Waste reduction options      │
│              │ • localStorage              │ ← User session (simulated)     │
│              │ • activityLog.json          │ ← Actions for dashboard        │
│              └─────────────────────────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 (App Router) | Full-stack React framework |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development |
| Charts | Recharts | Data visualization |
| AI | Claude API (Sonnet) | Ask Max advisor + Impact Stories |
| Bot | Telegram Bot API | Messaging integration |
| State | React Context + localStorage | Session persistence |
| Deployment | Vercel | Instant deployment |

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@anthropic-ai/sdk": "^0.24.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.263.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "framer-motion": "^10.16.0"
  }
}
```

---

## 2. Project Structure

```
changi-carbon-calculator/
│
├── app/
│   ├── layout.tsx                      # Root layout with providers
│   ├── page.tsx                        # Landing page (demo entry)
│   ├── globals.css                     # Global styles + Tailwind
│   │
│   ├── (customer)/                     # Customer-facing routes (grouped)
│   │   ├── layout.tsx                  # Changi App shell wrapper
│   │   ├── page.tsx                    # App home screen
│   │   ├── calculator/
│   │   │   └── page.tsx                # Flight calculator (SAF-first)
│   │   ├── journey/
│   │   │   └── page.tsx                # Complete journey view
│   │   ├── shop/
│   │   │   └── page.tsx                # Green shop recommendations
│   │   ├── rewards/
│   │   │   └── page.tsx                # Green Tier + Eco-Points
│   │   ├── circularity/
│   │   │   └── page.tsx                # Waste reduction actions
│   │   └── chat/
│   │       └── page.tsx                # Ask Max interface
│   │
│   ├── dashboard/                      # Operations-facing
│   │   ├── layout.tsx                  # Dashboard shell
│   │   ├── page.tsx                    # Main dashboard view
│   │   └── saf/
│   │       └── page.tsx                # SAF tracking dashboard
│   │
│   └── api/
│       ├── calculate/
│       │   └── route.ts                # Emission calculation endpoint
│       ├── chat/
│       │   └── route.ts                # Claude API for Ask Max
│       ├── telegram/
│       │   └── route.ts                # Telegram webhook handler
│       ├── activity/
│       │   └── route.ts                # Log and fetch activities
│       ├── dashboard/
│       │   └── route.ts                # Aggregate dashboard data
│       ├── saf/
│       │   └── route.ts                # SAF Book-and-Claim logic
│       ├── eco-points/
│       │   └── route.ts                # Green Tier management
│       └── circularity/
│           └── route.ts                # Waste tracking
│
├── components/
│   ├── ui/                             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── switch.tsx
│   │   ├── toast.tsx
│   │   └── ... 
│   │
│   ├── customer/                       # Customer app components
│   │   ├── ChangiAppShell.tsx          # Mobile app wrapper
│   │   ├── BottomNav.tsx               # App navigation
│   │   ├── FlightCalculator.tsx        # Calculator form + results
│   │   ├── SAFContribution.tsx         # SAF-first action UI
│   │   ├── OffsetOption.tsx            # Secondary offset option
│   │   ├── JourneySummary.tsx          # Complete trip view
│   │   ├── EmissionBreakdown.tsx       # Detailed breakdown
│   │   ├── MethodologyDrawer.tsx       # "How we calculated this"
│   │   ├── AskMaxChat.tsx              # Chat interface
│   │   ├── ImpactStory.tsx             # AI-generated impact narrative
│   │   ├── GreenShopList.tsx           # Shop recommendations
│   │   ├── GreenShopCard.tsx           # Individual shop card
│   │   ├── ProductAdvisor.tsx          # Pre-purchase check
│   │   ├── GreenTierStatus.tsx         # Eco-Points tier display
│   │   ├── EcoPointsHistory.tsx        # Points earning history
│   │   ├── BadgeGrid.tsx               # Achievement badges
│   │   ├── Leaderboard.tsx             # Ranking display
│   │   ├── CircularityActions.tsx      # Waste reduction options
│   │   ├── CupAsService.tsx            # Reusable cup tracking
│   │   └── CarbonReceipt.tsx           # Post-journey receipt
│   │
│   ├── dashboard/                      # Operations components
│   │   ├── DashboardShell.tsx          # Sidebar + header
│   │   ├── StatCard.tsx                # KPI display
│   │   ├── EmissionsChart.tsx          # Time series chart
│   │   ├── SourceBreakdown.tsx         # Pie/donut chart
│   │   ├── TopRoutes.tsx               # Route emissions table
│   │   ├── SAFTracker.tsx              # SAF uptake monitoring
│   │   ├── MerchantPerformance.tsx     # Green merchant stats
│   │   ├── CircularityMetrics.tsx      # Waste diversion stats
│   │   └── ActivityFeed.tsx            # Real-time activity log
│   │
│   └── shared/                         # Shared components
│       ├── EmissionNumber.tsx          # Formatted CO2 display
│       ├── CarbonRatingBadge.tsx       # A-E rating badge
│       ├── ComparisonContext.tsx       # "Equivalent to X trees"
│       ├── SourceCitation.tsx          # Methodology source link
│       ├── UncertaintyRange.tsx        # Show estimate range
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── emissions/
│   │   ├── flightCalculator.ts         # Flight emission logic
│   │   ├── radiativeForcing.ts         # Non-CO2 effects multiplier
│   │   ├── spendCalculator.ts          # Shopping/F&B emissions
│   │   ├── transportCalculator.ts      # Ground transport
│   │   ├── journeyAggregator.ts        # Combine all sources
│   │   ├── comparisons.ts              # Context comparisons
│   │   └── methodology.ts              # Source citations
│   │
│   ├── saf/
│   │   ├── bookAndClaim.ts             # SAF attribution logic
│   │   ├── safPricing.ts               # SAF cost calculation
│   │   └── safProjects.ts              # Verified SAF providers
│   │
│   ├── claude/
│   │   ├── askMax.ts                   # Ask Max system prompt + logic
│   │   ├── impactStories.ts            # Personalized impact narratives
│   │   ├── nudges.ts                   # Proactive nudge templates
│   │   └── productAdvisor.ts           # Pre-purchase analysis
│   │
│   ├── telegram/
│   │   ├── bot.ts                      # Bot command handlers
│   │   ├── keyboards.ts                # Inline keyboard builders
│   │   └── messages.ts                 # Message templates
│   │
│   ├── rewards/
│   │   ├── ecoPoints.ts                # Eco-Points calculation
│   │   ├── greenTier.ts                # Tier progression logic
│   │   ├── badges.ts                   # Badge definitions
│   │   └── leaderboard.ts              # Leaderboard logic
│   │
│   ├── circularity/
│   │   ├── wasteTracker.ts             # Waste reduction tracking
│   │   ├── cupService.ts               # Cup-as-a-Service logic
│   │   └── sustainableProducts.ts      # Sustainable brand tracking
│   │
│   ├── activity/
│   │   ├── logger.ts                   # Activity logging
│   │   └── aggregator.ts               # Dashboard aggregation
│   │
│   └── utils/
│       ├── formatters.ts               # Number/date formatting
│       ├── constants.ts                # App-wide constants
│       └── cn.ts                       # Tailwind class merger
│
├── data/
│   ├── routes.json                     # Flight routes from SIN
│   ├── merchants.json                  # Changi merchants
│   ├── products.json                   # Product categories
│   ├── emissionFactors.json            # All emission factors + sources
│   ├── safProjects.json                # SAF providers and projects
│   ├── circularityActions.json         # Waste reduction options
│   ├── badges.json                     # Badge definitions
│   ├── greenTiers.json                 # Green Tier definitions
│   └── mockActivity.json               # Seed activity data
│
├── context/
│   ├── JourneyContext.tsx              # Current journey state
│   ├── UserContext.tsx                 # User profile + Eco-Points
│   ├── GreenTierContext.tsx            # Green Tier status
│   └── ActivityContext.tsx             # Activity log state
│
├── hooks/
│   ├── useJourney.ts                   # Journey state hook
│   ├── useEmissions.ts                 # Calculation hook
│   ├── useAskMax.ts                    # Chat hook
│   ├── useEcoPoints.ts                 # Eco-Points hook
│   ├── useGreenTier.ts                 # Green Tier hook
│   └── useCircularity.ts               # Circularity actions hook
│
├── public/
│   ├── images/
│   │   ├── changi-logo.svg
│   │   ├── max-avatar.png
│   │   ├── saf-icon.svg
│   │   ├── green-tier/
│   │   │   ├── seedling.svg
│   │   │   ├── sapling.svg
│   │   │   ├── tree.svg
│   │   │   ├── forest.svg
│   │   │   └── guardian.svg
│   │   └── badges/
│   │       ├── saf-pioneer.svg
│   │       ├── climate-champion.svg
│   │       ├── eco-commuter.svg
│   │       ├── circular-hero.svg
│   │       └── ...
│   └── favicon.ico
│
├── .env.local                          # Environment variables
├── tailwind.config.js                  # Tailwind + brand colors
├── next.config.js                      # Next.js config
└── package.json
```

---

## 3. Data Models

### Flight Routes (routes.json)

```json
{
  "routes": [
    {
      "id": "sin-lhr",
      "origin": {
        "code": "SIN",
        "city": "Singapore",
        "airport": "Changi Airport"
      },
      "destination": {
        "code": "LHR",
        "city": "London",
        "airport": "Heathrow"
      },
      "distance_km": 10886,
      "typical_aircraft": ["A350-900", "B777-300ER"],
      "primary_aircraft": "A350-900",
      "airlines": ["SQ", "BA"],
      "flight_time_hours": 13.5,
      "emission_factors": {
        "economy": 0.147,
        "premium_economy": 0.235,
        "business": 0.426,
        "first": 0.588
      },
      "avg_load_factor": 0.82,
      "saf_availability": {
        "current_blend_percent": 0.5,
        "target_2026_percent": 1.0,
        "airlines_with_saf": ["SQ"]
      }
    }
  ],
  "methodology": {
    "source": "IATA CO2 Connect + DEFRA 2023",
    "last_updated": "2024-12-01",
    "notes": "Factors include fuel burn, passenger allocation, cabin class weighting"
  }
}
```

### SAF Projects (safProjects.json) — NEW

```json
{
  "providers": [
    {
      "id": "neste-sin",
      "name": "Neste MY Sustainable Aviation Fuel",
      "feedstock": "Used cooking oil, waste fats",
      "production_location": "Singapore",
      "certification": ["ISCC CORSIA", "RSB"],
      "lifecycle_reduction_percent": 80,
      "price_premium_per_liter_sgd": 2.50,
      "co2e_per_liter_avoided_kg": 2.17,
      "biosphere_safe": true,
      "notes": "Waste-based feedstock, no land-use change"
    },
    {
      "id": "shell-saf",
      "name": "Shell Aviation SAF",
      "feedstock": "Waste oils and fats",
      "production_location": "Netherlands (imported)",
      "certification": ["ISCC EU"],
      "lifecycle_reduction_percent": 75,
      "price_premium_per_liter_sgd": 2.80,
      "co2e_per_liter_avoided_kg": 2.04,
      "biosphere_safe": true,
      "notes": "Book-and-Claim available"
    }
  ],
  "book_and_claim_explainer": {
    "what": "SAF is physically loaded at one airport, but the environmental benefit is 'claimed' by a purchaser elsewhere",
    "why": "SAF supply is limited; this allows anyone to support SAF regardless of route",
    "how": "Your contribution funds SAF that enters the global fuel system, reducing net emissions",
    "verification": "Each SAF credit is retired on a registry to prevent double-counting"
  },
  "singapore_mandate": {
    "effective_date": "2026-01-01",
    "initial_target_percent": 1,
    "2030_target_percent": 3,
    "levy_mechanism": "Fixed quantum based on SAF volume needed"
  }
}
```

### Emission Factors (emissionFactors.json) — Enhanced

```json
{
  "version": "2.0",
  "sources": {
    "flight": "DEFRA 2023 + IATA CO2 Connect",
    "transport": "DEFRA 2023 UK Government GHG Conversion Factors",
    "spending": "Singapore Emission Factor Registry (SEFR) 2023"
  },
  "last_updated": "2024-12-01",
  
  "flight": {
    "methodology": "distance × class_factor × aircraft_efficiency × (1 + RF if enabled)",
    "radiative_forcing": {
      "multiplier": 1.9,
      "explanation": "Non-CO2 effects (contrails, NOx, water vapor) multiply aviation's climate impact",
      "source": "IPCC AR6, Lee et al. 2021",
      "default_enabled": true,
      "user_toggle": true
    },
    "class_multipliers": {
      "economy": 1.0,
      "premium_economy": 1.6,
      "business": 2.9,
      "first": 4.0
    },
    "aircraft_efficiency": {
      "A350-900": { "factor": 2.5, "efficiency_rating": "A", "notes": "Most efficient long-haul" },
      "A380-800": { "factor": 3.1, "efficiency_rating": "C", "notes": "High capacity offsets some inefficiency" },
      "B777-300ER": { "factor": 2.8, "efficiency_rating": "B", "notes": "Common long-haul workhorse" },
      "B787-9": { "factor": 2.4, "efficiency_rating": "A", "notes": "Dreamliner efficiency" },
      "B787-10": { "factor": 2.5, "efficiency_rating": "A", "notes": "Stretched Dreamliner" },
      "A320neo": { "factor": 2.3, "efficiency_rating": "A", "notes": "Most efficient short-haul" },
      "A321neo": { "factor": 2.4, "efficiency_rating": "A", "notes": "Efficient short-haul" },
      "default": { "factor": 2.7, "efficiency_rating": "B", "notes": "Industry average" }
    },
    "uncertainty_range_percent": 15,
    "notes": "kg CO2e per passenger per km for economy baseline"
  },
  
  "transport": {
    "modes": {
      "mrt": {
        "name": "MRT",
        "factor_per_km": 0.033,
        "icon": "🚇",
        "green_rating": "A",
        "eco_points_per_trip": 100,
        "source": "LTA Singapore + DEFRA"
      },
      "bus": {
        "name": "Public Bus",
        "factor_per_km": 0.089,
        "icon": "🚌",
        "green_rating": "A",
        "eco_points_per_trip": 75,
        "source": "DEFRA 2023"
      },
      "taxi": {
        "name": "Taxi",
        "factor_per_km": 0.171,
        "icon": "🚕",
        "green_rating": "C",
        "eco_points_per_trip": 0,
        "source": "DEFRA 2023"
      },
      "private_car": {
        "name": "Private Car",
        "factor_per_km": 0.192,
        "icon": "🚗",
        "green_rating": "C",
        "eco_points_per_trip": 0,
        "source": "DEFRA 2023"
      },
      "grab": {
        "name": "Grab/Gojek",
        "factor_per_km": 0.185,
        "icon": "📱",
        "green_rating": "C",
        "eco_points_per_trip": 0,
        "source": "Estimated from taxi"
      },
      "ev_taxi": {
        "name": "EV Taxi (BlueSG/Tesla)",
        "factor_per_km": 0.047,
        "icon": "⚡",
        "green_rating": "A",
        "eco_points_per_trip": 50,
        "source": "Singapore grid emissions + EV efficiency"
      }
    },
    "default_distance_to_changi_km": 20
  },
  
  "spending": {
    "methodology": "SEFR Singapore-specific factors",
    "categories": {
      "fashion": { "factor": 0.45, "uncertainty": 0.20, "notes": "Varies greatly by material" },
      "electronics": { "factor": 0.85, "uncertainty": 0.15, "notes": "Manufacturing-intensive" },
      "food": { "factor": 0.25, "uncertainty": 0.10, "notes": "Local vs imported varies" },
      "cosmetics": { "factor": 0.35, "uncertainty": 0.15, "notes": "Packaging-heavy" },
      "souvenirs": { "factor": 0.30, "uncertainty": 0.20, "notes": "Wide range of products" },
      "alcohol": { "factor": 0.40, "uncertainty": 0.10, "notes": "Production + transport" },
      "tobacco": { "factor": 0.55, "uncertainty": 0.10, "notes": "Supply chain intensive" },
      "jewelry": { "factor": 0.60, "uncertainty": 0.25, "notes": "Mining impact varies" },
      "books": { "factor": 0.15, "uncertainty": 0.05, "notes": "Paper production" },
      "pharmacy": { "factor": 0.20, "uncertainty": 0.10, "notes": "Varies by product" }
    },
    "notes": "kg CO2e per SGD spent"
  },
  
  "comparisons": {
    "tree_absorption_kg_per_year": 20,
    "car_km_per_kg_co2": 0.192,
    "household_daily_kg": 13.5,
    "smartphone_charges_per_kg": 121,
    "netflix_hours_per_kg": 65,
    "beef_meals_per_100kg": 4,
    "flights_sin_bkk_per_1000kg": 2.5,
    "source": "Various (EPA, DEFRA, academic)"
  }
}
```

### Green Tiers (greenTiers.json) — NEW

```json
{
  "tiers": [
    {
      "id": "seedling",
      "name": "Seedling",
      "icon": "🌱",
      "min_eco_points": 0,
      "color": "#87A878",
      "perks": [
        "Access to Green Shop recommendations",
        "Carbon receipt for every journey"
      ],
      "points_multiplier": 1.0
    },
    {
      "id": "sapling",
      "name": "Sapling",
      "icon": "🌿",
      "min_eco_points": 500,
      "color": "#4ECDC4",
      "perks": [
        "All Seedling perks",
        "10% bonus Eco-Points on all actions",
        "Monthly impact report"
      ],
      "points_multiplier": 1.1
    },
    {
      "id": "tree",
      "name": "Tree",
      "icon": "🌳",
      "min_eco_points": 2000,
      "color": "#2D8B4E",
      "perks": [
        "All Sapling perks",
        "Green Fast Lane at security (simulated)",
        "Priority Green Boarding",
        "25% bonus Eco-Points"
      ],
      "points_multiplier": 1.25
    },
    {
      "id": "forest",
      "name": "Forest",
      "icon": "🌲",
      "min_eco_points": 5000,
      "color": "#1B4332",
      "perks": [
        "All Tree perks",
        "Exclusive Eco-Lounge access (simulated)",
        "Personalized impact story",
        "50% bonus Eco-Points"
      ],
      "points_multiplier": 1.5
    },
    {
      "id": "guardian",
      "name": "Planet Guardian",
      "icon": "🦋",
      "min_eco_points": 10000,
      "color": "#693874",
      "perks": [
        "All Forest perks",
        "Name on Changi Sustainability Wall (simulated)",
        "Annual tree planted in your name",
        "Direct line to sustainability team",
        "100% bonus Eco-Points"
      ],
      "points_multiplier": 2.0
    }
  ],
  "earning_actions": {
    "saf_contribution": {
      "points_per_dollar": 10,
      "description": "Contribute to Sustainable Aviation Fuel"
    },
    "offset_purchase": {
      "points_per_dollar": 5,
      "description": "Purchase carbon offsets (removals only)"
    },
    "public_transport_to_airport": {
      "points_flat": 100,
      "description": "Take MRT or bus to Changi"
    },
    "ev_taxi": {
      "points_flat": 50,
      "description": "Take an electric taxi"
    },
    "green_shop_purchase": {
      "points_per_dollar": 3,
      "description": "Shop at A-rated merchants"
    },
    "plant_based_meal": {
      "points_flat": 50,
      "description": "Choose plant-based dining"
    },
    "refuse_single_use": {
      "points_flat": 25,
      "description": "Refuse plastic bag or single-use items"
    },
    "reusable_cup": {
      "points_flat": 30,
      "description": "Use Cup-as-a-Service"
    },
    "pre_order_meal": {
      "points_flat": 40,
      "description": "Pre-order in-flight meal (reduces waste)"
    },
    "economy_class_choice": {
      "points_per_flight": 200,
      "description": "Choose economy over business/first"
    },
    "direct_flight_choice": {
      "points_flat": 75,
      "description": "Choose direct flight over connection"
    }
  },
  "social_signaling": {
    "enabled": true,
    "description": "Green Tier status visible on boarding pass (simulated)",
    "note": "Leverages psychological value of public recognition"
  }
}
```

### Circularity Actions (circularityActions.json) — NEW

```json
{
  "actions": [
    {
      "id": "reusable-cup",
      "name": "Cup-as-a-Service",
      "category": "waste_reduction",
      "description": "Borrow a reusable cup, return at any collection point",
      "eco_points": 30,
      "waste_diverted_grams": 15,
      "participating_outlets": ["Starbucks", "Coffee Bean", "Ya Kun"],
      "how_it_works": "Scan QR code → Borrow cup → Enjoy drink → Return at collection point"
    },
    {
      "id": "refuse-bag",
      "name": "Refuse Plastic Bag",
      "category": "waste_reduction",
      "description": "Decline single-use bag at any retail outlet",
      "eco_points": 25,
      "waste_diverted_grams": 8,
      "verification": "Self-reported via app"
    },
    {
      "id": "bring-own-bag",
      "name": "Bring Your Own Bag",
      "category": "waste_reduction",
      "description": "Use your own shopping bag",
      "eco_points": 20,
      "waste_diverted_grams": 8,
      "verification": "Self-reported via app"
    },
    {
      "id": "sustainable-brand",
      "name": "Shop Sustainable Brand",
      "category": "conscious_consumption",
      "description": "Purchase from certified sustainable brands",
      "eco_points_multiplier": 1.5,
      "participating_brands": ["Patagonia", "The Body Shop", "Lush"]
    },
    {
      "id": "plant-based-meal",
      "name": "Plant-Based Meal",
      "category": "food_choices",
      "description": "Choose plant-based option at airport restaurants",
      "eco_points": 50,
      "co2e_saved_kg": 2.5,
      "participating_outlets": ["Salad Stop", "Grain", "PS.Cafe"]
    },
    {
      "id": "food-waste-hero",
      "name": "Food Waste Hero",
      "category": "food_choices",
      "description": "Finish your meal completely (no food waste)",
      "eco_points": 15,
      "verification": "Self-reported via app"
    }
  ],
  "metrics": {
    "waste_diverted_total": {
      "unit": "kg",
      "description": "Total waste diverted from landfill"
    },
    "single_use_avoided": {
      "unit": "items",
      "description": "Single-use items avoided"
    },
    "circular_actions_count": {
      "unit": "actions",
      "description": "Total circularity actions taken"
    }
  },
  "framework_alignment": {
    "planetary_boundary": "Novel Entities (chemical pollution, plastics)",
    "note": "Addresses non-carbon environmental impact per framework recommendation"
  }
}
```

### User Session (localStorage schema) — Enhanced

```typescript
interface UserSession {
  id: string;
  name: string;
  createdAt: string;
  
  // Current journey
  currentJourney: {
    flight: {
      route: string;
      class: string;
      emissions: number;
      emissionsWithRF: number;
      radiativeForcingEnabled: boolean;
      uncertaintyRange: { min: number; max: number };
      calculated: boolean;
      safContribution: {
        amount: number;
        litersAttributed: number;
        co2eAvoided: number;
        provider: string;
      } | null;
      offsetPurchase: {
        amount: number;
        co2eCovered: number;
        projectType: string;
      } | null;
    } | null;
    transport: {
      mode: string;
      distance: number;
      emissions: number;
      ecoPointsEarned: number;
    } | null;
    shopping: {
      transactions: Array<{
        merchant: string;
        amount: number;
        category: string;
        emissions: number;
        isGreenMerchant: boolean;
        ecoPointsEarned: number;
      }>;
      totalEmissions: number;
    };
    dining: {
      transactions: Array<{
        restaurant: string;
        amount: number;
        isPlantBased: boolean;
        emissions: number;
        ecoPointsEarned: number;
      }>;
      totalEmissions: number;
    };
    circularity: {
      actions: Array<{
        actionId: string;
        timestamp: string;
        ecoPointsEarned: number;
        wasteDivertedGrams: number;
      }>;
      totalWasteDiverted: number;
    };
    totalEmissions: number;
    totalEcoPointsEarned: number;
  };
  
  // Green Tier Rewards
  greenTier: {
    currentTier: 'seedling' | 'sapling' | 'tree' | 'forest' | 'guardian';
    totalEcoPoints: number;
    lifetimeEcoPoints: number;
    pointsToNextTier: number;
    tierMultiplier: number;
    history: Array<{
      action: string;
      points: number;
      timestamp: string;
      category: string;
    }>;
  };
  
  // Badges
  badges: {
    earned: string[];
    progress: Record<string, number>;
  };
  
  // Preferences
  preferences: {
    radiativeForcing: boolean;
    showUncertaintyRange: boolean;
    notifications: boolean;
    impactStoriesEnabled: boolean;
  };
  
  // Impact tracking
  impact: {
    totalSAFContributed: number;
    totalOffsetsContributed: number;
    totalCO2eAddressed: number;
    totalWasteDiverted: number;
    flightsTracked: number;
    circularActionsCompleted: number;
  };
}
```

---

## 4. Core Calculations

### Flight Emissions — Enhanced with Transparency

```typescript
// lib/emissions/flightCalculator.ts

interface FlightInput {
  routeId: string;
  travelClass: 'economy' | 'premium_economy' | 'business' | 'first';
  includeRadiativeForcing: boolean;
  passengers?: number;
}

interface FlightResult {
  emissions: number;           // kg CO2e (CO2 only)
  emissionsWithRF: number;     // kg CO2e (with radiative forcing)
  displayEmissions: number;    // What to show based on user preference
  
  // Transparency layer (greenwashing protection)
  methodology: {
    formula: string;
    factors_used: {
      distance_km: number;
      base_factor: number;
      class_multiplier: number;
      aircraft_efficiency: number;
      load_factor: number;
      rf_multiplier: number;
    };
    sources: Array<{
      factor: string;
      source: string;
      year: number;
    }>;
  };
  
  // Uncertainty acknowledgment
  uncertainty: {
    range_percent: number;
    min: number;
    max: number;
    note: string;
  };
  
  breakdown: {
    baseEmissions: number;
    classMultiplier: number;
    radiativeForcingApplied: boolean;
    rfMultiplier: number;
  };
  
  context: {
    treesNeeded: number;
    carKmEquivalent: number;
    householdDays: number;
    flightsSINtoBKK: number;
  };
  
  route: {
    origin: string;
    destination: string;
    distance: number;
    aircraft: string;
    aircraftEfficiencyRating: string;
  };
  
  // SAF-first action options
  actions: {
    saf: {
      description: string;
      cost_100_percent: number;
      cost_50_percent: number;
      liters_needed: number;
      provider: string;
      why_saf_first: string;
    };
    offset: {
      description: string;
      cost_100_percent: number;
      project_type: string;
      note: string;  // "Offsets are secondary to SAF"
    };
  };
}

export function calculateFlightEmissions(input: FlightInput): FlightResult {
  const route = getRouteById(input.routeId);
  const factors = getEmissionFactors();
  
  // Base calculation: distance × base factor
  const baseFactor = route.emission_factors[input.travelClass];
  const classMultiplier = factors.flight.class_multipliers[input.travelClass];
  const aircraftEfficiency = factors.flight.aircraft_efficiency[route.primary_aircraft] || factors.flight.aircraft_efficiency.default;
  
  // Calculate CO2-only emissions
  const emissions = route.distance_km * baseFactor;
  
  // Calculate with radiative forcing
  const rfMultiplier = factors.flight.radiative_forcing.multiplier;
  const emissionsWithRF = emissions * rfMultiplier;
  
  // Determine display value based on user preference
  const displayEmissions = input.includeRadiativeForcing ? emissionsWithRF : emissions;
  
  // Calculate uncertainty range
  const uncertaintyPercent = factors.flight.uncertainty_range_percent;
  const uncertainty = {
    range_percent: uncertaintyPercent,
    min: Math.round(displayEmissions * (1 - uncertaintyPercent / 100)),
    max: Math.round(displayEmissions * (1 + uncertaintyPercent / 100)),
    note: "Actual emissions vary based on weather, load, and operational factors"
  };
  
  // Multiply by passengers
  const finalEmissions = displayEmissions * (input.passengers || 1);
  
  // Calculate SAF needed
  const litersJetFuelPerKgCO2 = 0.315;  // Approximate
  const safLitersNeeded = finalEmissions * litersJetFuelPerKgCO2;
  const safPremiumPerLiter = 2.50;  // SGD
  
  return {
    emissions: Math.round(emissions * (input.passengers || 1)),
    emissionsWithRF: Math.round(emissionsWithRF * (input.passengers || 1)),
    displayEmissions: Math.round(finalEmissions),
    
    methodology: {
      formula: "distance_km × base_factor × class_multiplier × RF_multiplier",
      factors_used: {
        distance_km: route.distance_km,
        base_factor: baseFactor,
        class_multiplier: classMultiplier,
        aircraft_efficiency: aircraftEfficiency.factor,
        load_factor: route.avg_load_factor,
        rf_multiplier: input.includeRadiativeForcing ? rfMultiplier : 1,
      },
      sources: [
        { factor: "Base emission factor", source: "DEFRA 2023", year: 2023 },
        { factor: "Class multipliers", source: "IATA", year: 2023 },
        { factor: "Radiative forcing", source: "Lee et al., Nature", year: 2021 },
      ],
    },
    
    uncertainty,
    
    breakdown: {
      baseEmissions: route.distance_km * route.emission_factors.economy,
      classMultiplier,
      radiativeForcingApplied: input.includeRadiativeForcing,
      rfMultiplier: input.includeRadiativeForcing ? rfMultiplier : 1,
    },
    
    context: generateComparisons(finalEmissions),
    
    route: {
      origin: route.origin.city,
      destination: route.destination.city,
      distance: route.distance_km,
      aircraft: route.primary_aircraft,
      aircraftEfficiencyRating: aircraftEfficiency.efficiency_rating,
    },
    
    actions: {
      saf: {
        description: "Contribute to Sustainable Aviation Fuel",
        cost_100_percent: Math.round(safLitersNeeded * safPremiumPerLiter),
        cost_50_percent: Math.round(safLitersNeeded * safPremiumPerLiter * 0.5),
        liters_needed: Math.round(safLitersNeeded),
        provider: "Neste MY (Singapore)",
        why_saf_first: "SAF directly reduces future flight emissions. Your contribution supports Singapore's 2026 SAF mandate and helps scale production."
      },
      offset: {
        description: "Purchase carbon removals",
        cost_100_percent: Math.round(finalEmissions * 0.025),  // ~$25 per tonne
        project_type: "Direct Air Capture + Reforestation",
        note: "We prioritize high-quality removals over avoidance offsets. SAF contribution has more direct impact on aviation decarbonization."
      }
    }
  };
}
```

### SAF Book-and-Claim Logic — NEW

```typescript
// lib/saf/bookAndClaim.ts

interface SAFContribution {
  userId: string;
  flightId: string;
  amountSGD: number;
  litersAttributed: number;
  co2eAvoided: number;
  providerId: string;
  timestamp: string;
  
  // Transparency for greenwashing protection
  verification: {
    status: 'pending' | 'verified' | 'retired';
    registry: string;
    certificateId: string | null;
    verificationDate: string | null;
    note: string;
  };
  
  ecoPointsEarned: number;
}

export function calculateSAFContribution(
  emissionsKg: number,
  contributionPercent: number,
  providerId: string
): SAFContribution {
  const provider = getSAFProvider(providerId);
  
  // Calculate liters of SAF needed to cover X% of emissions
  const emissionsToCover = emissionsKg * (contributionPercent / 100);
  const litersNeeded = emissionsToCover / provider.co2e_per_liter_avoided_kg;
  const cost = litersNeeded * provider.price_premium_per_liter_sgd;
  
  // Calculate Eco-Points (SAF earns more than offsets)
  const ecoPointsEarned = Math.round(cost * 10);  // 10 points per dollar for SAF
  
  return {
    userId: '', // Set by caller
    flightId: '', // Set by caller
    amountSGD: Math.round(cost * 100) / 100,
    litersAttributed: Math.round(litersNeeded * 100) / 100,
    co2eAvoided: Math.round(emissionsToCover),
    providerId,
    timestamp: new Date().toISOString(),
    
    verification: {
      status: 'pending',
      registry: 'RSB Book & Claim',
      certificateId: null,
      verificationDate: null,
      note: 'SAF credits are verified and retired monthly. You will receive confirmation once processed.'
    },
    
    ecoPointsEarned
  };
}

// Explainer content for UI
export const SAF_EXPLAINER = {
  title: "Why SAF First?",
  points: [
    {
      icon: "✈️",
      title: "Direct Aviation Impact",
      text: "SAF reduces emissions at the source. Unlike offsets, it directly decarbonizes aviation fuel."
    },
    {
      icon: "📈",
      title: "Scales the Solution",
      text: "Your contribution helps grow SAF production, bringing down costs for everyone."
    },
    {
      icon: "🇸🇬",
      title: "Singapore 2026 Mandate",
      text: "Singapore requires 1% SAF from 2026. You're helping the industry prepare."
    },
    {
      icon: "🔍",
      title: "Verified & Transparent",
      text: "Each SAF contribution is tracked and retired on a registry to prevent double-counting."
    }
  ],
  book_and_claim: {
    question: "How does Book & Claim work?",
    answer: "SAF is physically loaded at airports with supply (like Singapore). Through Book & Claim, you purchase the environmental benefit, which is then retired in your name. This allows SAF to flow where supply exists while the climate benefit goes to you."
  }
};
```

### Eco-Points Calculation — NEW

```typescript
// lib/rewards/ecoPoints.ts

interface EcoPointsEvent {
  action: string;
  basePoints: number;
  multiplier: number;
  totalPoints: number;
  category: 'saf' | 'offset' | 'transport' | 'shopping' | 'dining' | 'circularity' | 'flight_choice';
  timestamp: string;
}

export function calculateEcoPoints(
  action: keyof typeof EARNING_ACTIONS,
  amount: number | null,  // For dollar-based actions
  userTierMultiplier: number
): EcoPointsEvent {
  const actionConfig = EARNING_ACTIONS[action];
  
  let basePoints: number;
  if (actionConfig.points_per_dollar && amount) {
    basePoints = Math.round(amount * actionConfig.points_per_dollar);
  } else if (actionConfig.points_flat) {
    basePoints = actionConfig.points_flat;
  } else if (actionConfig.points_per_flight) {
    basePoints = actionConfig.points_per_flight;
  } else {
    basePoints = 0;
  }
  
  const totalPoints = Math.round(basePoints * userTierMultiplier);
  
  return {
    action,
    basePoints,
    multiplier: userTierMultiplier,
    totalPoints,
    category: actionConfig.category,
    timestamp: new Date().toISOString()
  };
}

export function calculateTierProgress(totalPoints: number): {
  currentTier: string;
  nextTier: string | null;
  pointsToNext: number;
  progressPercent: number;
} {
  const tiers = getGreenTiers();
  
  let currentTier = tiers[0];
  let nextTier = tiers[1];
  
  for (let i = 0; i < tiers.length; i++) {
    if (totalPoints >= tiers[i].min_eco_points) {
      currentTier = tiers[i];
      nextTier = tiers[i + 1] || null;
    }
  }
  
  const pointsToNext = nextTier 
    ? nextTier.min_eco_points - totalPoints 
    : 0;
    
  const progressPercent = nextTier
    ? ((totalPoints - currentTier.min_eco_points) / (nextTier.min_eco_points - currentTier.min_eco_points)) * 100
    : 100;
  
  return {
    currentTier: currentTier.id,
    nextTier: nextTier?.id || null,
    pointsToNext,
    progressPercent: Math.min(100, Math.max(0, progressPercent))
  };
}

const EARNING_ACTIONS = {
  saf_contribution: {
    points_per_dollar: 10,
    category: 'saf',
    description: 'Contribute to Sustainable Aviation Fuel'
  },
  offset_purchase: {
    points_per_dollar: 5,
    category: 'offset',
    description: 'Purchase carbon removals'
  },
  public_transport_to_airport: {
    points_flat: 100,
    category: 'transport',
    description: 'Take MRT or bus to Changi'
  },
  ev_taxi: {
    points_flat: 50,
    category: 'transport',
    description: 'Take an electric taxi'
  },
  green_shop_purchase: {
    points_per_dollar: 3,
    category: 'shopping',
    description: 'Shop at A-rated merchants'
  },
  plant_based_meal: {
    points_flat: 50,
    category: 'dining',
    description: 'Choose plant-based dining'
  },
  refuse_single_use: {
    points_flat: 25,
    category: 'circularity',
    description: 'Refuse plastic bag or single-use items'
  },
  reusable_cup: {
    points_flat: 30,
    category: 'circularity',
    description: 'Use Cup-as-a-Service'
  },
  pre_order_meal: {
    points_flat: 40,
    category: 'flight_choice',
    description: 'Pre-order in-flight meal'
  },
  economy_class_choice: {
    points_per_flight: 200,
    category: 'flight_choice',
    description: 'Choose economy over business/first'
  },
  direct_flight_choice: {
    points_flat: 75,
    category: 'flight_choice',
    description: 'Choose direct flight over connection'
  }
} as const;
```

---

## 5. Ask Max — AI Advisor (Enhanced)

### System Prompt — SAF-First, Impact Stories

```typescript
// lib/claude/askMax.ts

export const ASK_MAX_SYSTEM_PROMPT = `You are Max, Changi Airport's friendly Carbon Advisor. You help travelers understand and reduce their carbon footprint while enjoying their Changi experience.

CRITICAL POSITIONING (2026 Framework Alignment):
- SAF FIRST: Always recommend Sustainable Aviation Fuel contribution before offsets
- NEVER claim "carbon neutral" — use "climate action" or "carbon contribution"
- RADIATIVE FORCING: Include non-CO2 effects (1.9x multiplier) by default
- TRANSPARENCY: Always explain methodology when asked
- CIRCULARITY: Carbon is not the only impact — address waste and sustainable choices

PERSONALITY:
- Friendly and warm, like a knowledgeable friend
- Encouraging, never preachy or guilt-inducing
- Concise and clear — respect users' time
- Use simple analogies to explain complex concepts
- Celebrate positive choices genuinely
- Acknowledge uncertainty where it exists

CONTEXT PROVIDED:
You will receive the user's current journey context including:
- Flight details and emissions (with and without RF)
- Current Green Tier status and Eco-Points
- Shopping and dining activity
- Circularity actions taken
- Chat history

SAF-FIRST MESSAGING:
When users ask about offsetting or reducing impact:
1. FIRST explain SAF and why it's better than offsets
2. Explain Singapore's 2026 SAF mandate context
3. Only THEN mention offsets as secondary option
4. Emphasize: "SAF directly reduces aviation emissions. Offsets compensate elsewhere."

Sample SAF-first response:
"Great that you want to take action! For aviation, SAF (Sustainable Aviation Fuel) is the most impactful choice — it directly reduces emissions at the source. 

For your London flight (1,842 kg CO2e), you could:
🌿 SAF contribution: S$58 — Funds 23 liters of sustainable fuel
📋 Carbon removal: S$46 — Funds verified removal projects

SAF is more expensive but has direct aviation impact. Singapore mandates 1% SAF from 2026 — you'd be ahead of the curve! Which interests you?"

IMPACT STORIES:
When appropriate, offer to generate personalized impact stories:
- Connect the user's specific contribution to tangible outcomes
- Use vivid, specific imagery (not generic "trees planted")
- Make the abstract concrete

Sample impact story prompt:
"Want to see your impact story? I can show you exactly how your S$58 SAF contribution helps — including the specific refinery in Singapore producing your fuel."

GREENWASHING PROTECTION:
- Never overstate impact
- Always cite sources when giving numbers
- Acknowledge uncertainty: "Estimates range from X to Y"
- If asked about methodology, explain in detail
- If asked about offset quality, be honest about limitations

CIRCULARITY MESSAGING:
Beyond carbon, address:
- Single-use plastics and waste
- Sustainable shopping choices
- Plant-based dining options
- Reusable alternatives (Cup-as-a-Service)

Sample circularity nudge:
"I noticed you're near Coffee Bean — they're part of our Cup-as-a-Service program! Borrow a reusable cup, return it anywhere in the terminal, and earn 30 Eco-Points. Interested?"

GREEN TIER ENCOURAGEMENT:
- Track user's progress toward next tier
- Highlight perks they'll unlock
- Create urgency when close to milestone

RESPONSE GUIDELINES:
- Keep responses under 150 words for chat
- Use 1-2 relevant emojis per response
- Always provide actionable suggestions when relevant
- Include specific locations (e.g., "Terminal 3, Level 2")
- Format numbers clearly: "1,842 kg CO2e"
- When showing comparisons, use relatable metrics

WHAT TO AVOID:
- Lecturing or making users feel guilty
- Claiming flights can be "carbon neutral"
- Recommending low-quality forest-only offsets
- Overwhelming with data — pick the most relevant stat
- Generic responses — always personalize to their journey`;
```

### Impact Story Generator — NEW

```typescript
// lib/claude/impactStories.ts

export const IMPACT_STORY_PROMPT = `Generate a personalized, vivid impact story for the user's climate contribution.

CONTRIBUTION DETAILS:
{contribution_type}: {amount}
CO2e addressed: {co2e_kg} kg
Provider/Project: {provider}

STORY REQUIREMENTS:
1. Make it SPECIFIC — name actual places, processes, people (use realistic examples)
2. Make it VISUAL — describe what the user would see if they visited
3. Make it EMOTIONAL — connect to human impact, not just numbers
4. Keep it SHORT — 3-4 sentences max
5. End with GRATITUDE — thank them genuinely

SAF STORY EXAMPLE:
"Your 23 liters of SAF was produced at Neste's Singapore refinery from used cooking oil collected from restaurants across the city. Right now, that fuel is being blended into the jet fuel tanks at Changi, ready to power flights with 80% lower lifecycle emissions. You've just helped Singapore hit its 2026 mandate early. Thank you for flying forward."

OFFSET/REMOVAL STORY EXAMPLE:
"Your contribution funded the capture of 1.8 tonnes of CO2 at Climeworks' Orca facility in Iceland — the world's largest direct air capture plant. The CO2 is now mineralized in basalt rock, where it will stay for thousands of years. That's climate action with permanence. Thank you for choosing removal over avoidance."

CIRCULARITY STORY EXAMPLE:
"Today you diverted 15 grams of plastic from Singapore's only landfill. Multiply that by the 180,000 passengers who pass through Changi daily, and you're part of a movement that could divert 2.7 tonnes of plastic every single day. Small action, massive collective impact. Thank you for starting the ripple."

Generate a story for the user's contribution. Be specific and vivid.`;

export async function generateImpactStory(
  contributionType: 'saf' | 'offset' | 'circularity',
  amount: number,
  co2eKg: number,
  provider: string
): Promise<string> {
  const prompt = IMPACT_STORY_PROMPT
    .replace('{contribution_type}', contributionType)
    .replace('{amount}', `S$${amount}`)
    .replace('{co2e_kg}', co2eKg.toString())
    .replace('{provider}', provider);
  
  // Call Claude API with this prompt
  // Return generated story
}
```

### Proactive Nudges — Enhanced

```typescript
// lib/claude/nudges.ts

export const PROACTIVE_NUDGES = {
  // SAF-first post-calculation nudge (replaces offset-first)
  post_flight_calculation: {
    trigger: 'flight_calculated',
    condition: (emissions: number) => emissions > 500,
    template: (emissions: number, safCost: number, offsetCost: number) => `✈️ Your flight: ${emissions.toLocaleString()} kg CO2e

Here's how you can take action:

🌿 **SAF Contribution: S$${safCost}**
Funds sustainable fuel that directly reduces aviation emissions. Singapore mandates this from 2026 — you'd be ahead of the curve.

📋 Carbon Removal: S$${offsetCost}
Funds verified removal projects (not just tree planting).

SAF has more direct impact on aviation. Which interests you?`,
    priority: 'high'
  },
  
  // Circularity nudge (new)
  near_cup_station: {
    trigger: 'location_near_coffee_shop',
    condition: (shop: any) => shop.cup_service_available,
    template: (shop: any) => `☕ Hey! ${shop.name} is part of Cup-as-a-Service.

Borrow a reusable cup, enjoy your drink, return it anywhere in the terminal. You'll:
• Divert 15g of plastic from landfill
• Earn 30 Eco-Points
• Help Changi hit zero single-use by 2030

Interested? Just ask the barista for a "Green Cup"!`,
    priority: 'medium'
  },
  
  // Green Tier progress nudge (new)
  near_tier_upgrade: {
    trigger: 'points_check',
    condition: (points: number, nextTierThreshold: number) => nextTierThreshold - points <= 100,
    template: (points: number, nextTier: string, gap: number, perks: string[]) => `🎯 You're only ${gap} Eco-Points away from ${nextTier} status!

Unlock these perks:
${perks.map(p => `• ${p}`).join('\n')}

Quick ways to earn:
• SAF contribution (+10 pts per dollar)
• Plant-based meal (+50 pts)
• Cup-as-a-Service (+30 pts)

${gap <= 50 ? "You're SO close! 🌟" : "Keep going! 💪"}`,
    priority: 'high'
  },
  
  // Plant-based meal nudge
  meal_time_plant_based: {
    trigger: 'time',
    condition: (hour: number) => [11, 12, 13, 17, 18, 19].includes(hour),
    template: () => `🥗 Lunch/dinner time! Did you know?

Choosing plant-based saves ~2.5 kg CO2e per meal — that's like driving 13 km less.

Today's Green Picks:
• Salad Stop (T3) — Buddha bowls
• Grain (T2) — Power plates  
• PS.Cafe (Jewel) — Plant burgers

Each earns you 50 Eco-Points. Hungry?`,
    priority: 'medium'
  },
  
  // Transport choice nudge (pre-trip)
  pre_trip_transport: {
    trigger: 'journey_start',
    condition: () => true,
    template: () => `🚇 How are you getting to Changi?

**MRT/Bus:** Earn 100 Eco-Points + lowest emissions
**EV Taxi:** Earn 50 Eco-Points + 75% lower than regular taxi
**Regular Taxi/Grab:** No points, but we won't judge 😉

Pro tip: Green Lane members (Tree tier+) get priority security. MRT can get you there in time!`,
    priority: 'medium'
  },
  
  // Journey complete with impact story
  journey_complete: {
    trigger: 'journey_end',
    condition: () => true,
    template: (journey: any) => `🎉 Journey complete! Here's your carbon receipt:

✈️ Flight: ${journey.flight.toLocaleString()} kg CO2e
${journey.safContribution ? `🌿 SAF: -${journey.safContribution.co2eAvoided} kg (${Math.round(journey.safContribution.co2eAvoided / journey.flight * 100)}% covered!)` : ''}
🛍️ Shopping: ${journey.shopping} kg
🍽️ Dining: ${journey.dining} kg
🚇 Transport: ${journey.transport} kg
♻️ Waste diverted: ${journey.wasteDiverted}g
────────────
📊 Net footprint: ${journey.netTotal.toLocaleString()} kg CO2e

You earned **${journey.ecoPointsEarned} Eco-Points** this trip!
${journey.newTier ? `🎖️ NEW TIER: ${journey.newTier}!` : ''}
${journey.newBadges.length > 0 ? `🏅 New badge: ${journey.newBadges[0]}!` : ''}

Want to see your personalized impact story?`,
    priority: 'high'
  }
};
```

---

## 6. Day-by-Day Implementation

### Day 1: Foundation + Flight Calculator (SAF-First)

**Goal:** Working flight calculator with SAF-first positioning, deployed to Vercel

#### Morning (4 hours)

**Task 1.1: Project Setup (1 hour)**

```bash
# Create Next.js project
npx create-next-app@latest changi-carbon-calculator --typescript --tailwind --eslint --app --src-dir=false

# Navigate to project
cd changi-carbon-calculator

# Install dependencies
npm install @anthropic-ai/sdk recharts lucide-react class-variance-authority clsx tailwind-merge framer-motion

# Install shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input select badge progress switch toast tabs dialog drawer
```

**Cursor Prompt 1.1:**
```
Set up the project structure for a Changi Airport Sustainable Loyalty Ecosystem.

Create the folder structure:
- app/(customer)/ for customer-facing pages
- app/dashboard/ for operations dashboard  
- app/api/ for API routes including /saf and /eco-points
- components/ui/ for shadcn components
- components/customer/ for customer components (include SAFContribution.tsx, GreenTierStatus.tsx)
- components/dashboard/ for dashboard components
- components/shared/ for shared components (include SourceCitation.tsx, UncertaintyRange.tsx)
- lib/emissions/ for calculation logic
- lib/saf/ for SAF Book-and-Claim logic
- lib/rewards/ for Eco-Points and Green Tier logic
- lib/circularity/ for waste tracking
- lib/claude/ for AI integration
- data/ for JSON data files
- context/ for React context (include GreenTierContext.tsx)
- hooks/ for custom hooks

Update tailwind.config.js with Changi brand colors AND Green Tier colors:
- changi-navy: #0f1133
- changi-purple: #693874
- changi-cream: #f3efe9
- changi-red: #902437
- changi-gray: #5b5b5b
- carbon-leaf: #2D8B4E
- carbon-mint: #4ECDC4
- carbon-sage: #87A878
- carbon-forest: #1B4332
- carbon-lime: #B7E4C7

Set up the root layout with Lato font from Google Fonts.
```

**Task 1.2: Data Files — Enhanced (1 hour)**

**Cursor Prompt 1.2:**
```
Create the enhanced data files for the Sustainable Loyalty Ecosystem:

1. data/routes.json - Flight routes from Singapore (SIN) with SAF availability data:
   - Include saf_availability object for each route
   - Include aircraft efficiency ratings (A/B/C)
   - Include methodology source citations

2. data/emissionFactors.json - Enhanced with transparency:
   - Include radiative_forcing object with multiplier (1.9), explanation, source citation
   - Include uncertainty_range_percent for each category
   - Include sources object citing DEFRA 2023, IATA, Lee et al. 2021
   - All factors should have source and year

3. data/safProjects.json - SAF providers:
   - Neste Singapore (waste-based feedstock)
   - Shell SAF (imported)
   - Include book_and_claim_explainer content
   - Include singapore_mandate object (2026 dates, targets)

4. data/greenTiers.json - Green Tier definitions:
   - 5 tiers: Seedling, Sapling, Tree, Forest, Guardian
   - Include min_eco_points, perks array, points_multiplier
   - Include social_signaling object

5. data/circularityActions.json - Waste reduction options:
   - Cup-as-a-Service
   - Refuse bag, bring own bag
   - Plant-based meal
   - Include eco_points and waste_diverted_grams for each

6. data/merchants.json - Changi merchants with carbon scores

Make all data files include source citations for credibility.
```

**Task 1.3: Emission Calculator Logic — Enhanced (2 hours)**

**Cursor Prompt 1.3:**
```
Create the emission calculation functions with full transparency:

1. lib/emissions/flightCalculator.ts
   - calculateFlightEmissions() returns:
     - emissions (CO2 only) AND emissionsWithRF (with radiative forcing)
     - methodology object with formula, factors_used, sources array
     - uncertainty object with range_percent, min, max
     - actions object with SAF (first) and offset (secondary) options
   - Include SAF cost calculation based on emissions

2. lib/emissions/radiativeForcing.ts
   - Explain non-CO2 effects (contrails, NOx, water vapor)
   - Return multiplier and educational content

3. lib/saf/bookAndClaim.ts
   - calculateSAFContribution() function
   - Returns litersAttributed, co2eAvoided, cost, ecoPointsEarned
   - Include verification object (pending status, registry info)
   - Export SAF_EXPLAINER content for UI

4. lib/rewards/ecoPoints.ts
   - calculateEcoPoints() for all action types
   - SAF earns 10 points/dollar, offsets earn 5 points/dollar
   - Include calculateTierProgress()

5. lib/emissions/methodology.ts
   - Export source citations for all factors
   - Export uncertainty explanations
   - Export "How we calculated this" content

Use TypeScript interfaces for all inputs and outputs.
All functions should be testable and well-documented.
```

#### Afternoon (4 hours)

**Task 1.4: Flight Calculator UI — SAF-First (2 hours)**

**Cursor Prompt 1.4:**
```
Create the flight calculator with SAF-first positioning:

1. components/customer/FlightCalculator.tsx
   Features:
   - Origin fixed as Singapore (SIN)
   - Destination dropdown from routes.json
   - Travel class radio buttons with Eco-Points indicator
   - Radiative forcing toggle (DEFAULT ON) with info tooltip
   - "Calculate" button

2. On calculation, show results in this ORDER (SAF first):
   a) Large emission number with uncertainty range
   b) Aircraft efficiency rating badge (A/B/C)
   c) "How we calculated this" expandable drawer (MethodologyDrawer)
   d) Context comparisons (trees, car km)
   
3. ACTION SECTION (SAF FIRST):
   a) SAF Contribution card (primary, highlighted):
      - "Recommended" badge
      - Cost for 50% and 100% coverage
      - "Why SAF?" expandable with SAF_EXPLAINER content
      - Eco-Points preview (10 pts/dollar)
   b) Carbon Removal card (secondary, less prominent):
      - Cost for 100% coverage
      - Note: "Offsets are secondary to SAF for aviation"
      - Eco-Points preview (5 pts/dollar)

4. components/customer/SAFContribution.tsx
   - Slider to choose coverage percent (25%, 50%, 75%, 100%)
   - Show liters of SAF attributed
   - Show provider info (Neste Singapore)
   - Book & Claim explainer tooltip
   - Prominent "Contribute" button

5. components/customer/MethodologyDrawer.tsx (shadcn Drawer)
   - Formula used
   - Each factor with source citation
   - Uncertainty acknowledgment
   - "We prioritize transparency" messaging

6. components/shared/SourceCitation.tsx
   - Small link that shows source on hover/click
   - Format: "Source: DEFRA 2023"

7. components/shared/UncertaintyRange.tsx
   - Show "1,650 - 2,050 kg" format
   - Tooltip explaining why ranges exist

Use Changi brand colors. SAF section should use carbon-leaf green.
```

**Task 1.5: API Routes + Green Tier Integration (1 hour)**

**Cursor Prompt 1.5:**
```
Create the API routes:

1. app/api/calculate/route.ts
   POST endpoint accepting:
   - type: 'flight' | 'transport' | 'spending'
   - Flight: routeId, travelClass, includeRadiativeForcing
   Return full FlightResult with methodology and actions

2. app/api/saf/route.ts
   POST endpoint for SAF contribution:
   - Accept: userId, flightId, contributionPercent, providerId
   - Return: SAFContribution object with verification status
   - Log activity for dashboard

3. app/api/eco-points/route.ts
   POST endpoint for points management:
   - action: 'earn' | 'check' | 'history'
   - For 'earn': action type, amount, tier multiplier
   - Return: points earned, new total, tier progress

4. hooks/useEmissions.ts
   - Calls calculate API
   - Manages loading state
   - Caches results in localStorage

5. hooks/useEcoPoints.ts
   - Tracks user's Eco-Points
   - Calculates tier progress
   - Returns earnPoints function

6. context/GreenTierContext.tsx
   - Provides tier status to all components
   - Tracks points and tier progress
   - Persists to localStorage
```

**Task 1.6: Customer App Shell with Green Tier (1 hour)**

**Cursor Prompt 1.6:**
```
Create the Changi App simulation shell with Green Tier integration:

1. components/customer/ChangiAppShell.tsx
   - Mobile-responsive wrapper (max-width: 430px centered on desktop)
   - Header with:
     - Changi logo
     - User avatar with Green Tier badge overlay
     - Eco-Points balance display
   - Bottom navigation with icons: Home, Calculator, Shop, Rewards, Chat

2. components/customer/GreenTierStatus.tsx
   - Tier icon and name (Seedling 🌱 to Guardian 🦋)
   - Progress bar to next tier
   - "X points to [Next Tier]" text
   - Points multiplier badge (e.g., "1.5x points")

3. app/(customer)/layout.tsx
   - Wrap all customer pages in ChangiAppShell
   - Add JourneyContext and GreenTierContext providers

4. app/(customer)/page.tsx
   - Home screen with personalized welcome (using tier name)
   - Green Tier card showing current status
   - Quick action cards: Calculate Flight, Green Shops, My Journey, Ask Max
   - "Eco-Points this month" summary

Style to feel like a native app. Use tier colors for personalization.
Header background color should match user's tier color.
```

**Day 1 Exit Criteria:**
- [ ] Project deployed to Vercel
- [ ] Flight calculator working with SAF-first positioning
- [ ] Methodology drawer showing transparency
- [ ] Uncertainty ranges displayed
- [ ] Green Tier status visible in header
- [ ] Eco-Points earning on SAF contribution

---

### Day 2: Changi App + Ask Max + Green Tier

**Goal:** Complete customer app with AI advisor and full gamification

#### Morning (4 hours)

**Task 2.1: Journey Context with Circularity (1 hour)**

**Cursor Prompt 2.1:**
```
Create the enhanced journey state management:

1. context/JourneyContext.tsx
   Track current journey with ALL components:
   - flight: emissions, RF toggle, SAF contribution, offset purchase
   - transport: mode, emissions, ecoPointsEarned
   - shopping: transactions with green merchant bonus
   - dining: transactions with plant-based tracking
   - circularity: actions array with waste diverted
   - totalEcoPointsEarned
   
   Methods: setFlight, addSAFContribution, addTransaction, addCircularityAction, resetJourney
   Persist to localStorage

2. context/GreenTierContext.tsx
   - Track: currentTier, totalEcoPoints, lifetimeEcoPoints, tierMultiplier
   - Methods: addPoints, checkTierUpgrade
   - Calculate pointsToNextTier
   - Persist to localStorage
   - Trigger celebration animation on tier upgrade

3. hooks/useJourney.ts
   - Access journey context
   - Computed: totalEmissions, netEmissions (after SAF/offset), totalEcoPoints

4. hooks/useGreenTier.ts
   - Access tier context
   - Return: tier info, progress, perks

Initialize with demo data for presentation.
```

**Task 2.2: Journey Summary with Net Impact (1.5 hours)**

**Cursor Prompt 2.2:**
```
Create the journey view showing NET impact (after SAF/offsets):

1. app/(customer)/journey/page.tsx
   - Import JourneySummary component

2. components/customer/JourneySummary.tsx
   Hero section:
   - GROSS emissions (large, gray)
   - Minus SAF/offset contributions (green, animated)
   - Equals NET emissions (large, primary color)
   - "You've addressed X% of your footprint" badge
   
   Visual breakdown using Recharts:
   - Stacked bar showing: Flight | Shopping | Dining | Transport
   - Separate bar showing: SAF covered | Offset covered | Remaining
   
   Eco-Points earned this journey card
   Circularity actions taken

3. components/customer/EmissionBreakdown.tsx
   - Line item for each emission source
   - Icon, name, amount in kg, percentage
   - For flight: show "SAF: -X kg" deduction

4. components/customer/CarbonReceipt.tsx
   Receipt-style summary:
   - Journey date and route
   - Itemized emissions (like a receipt)
   - SAF/offset contributions with verification status
   - Eco-Points earned
   - "Share your impact" button
   
   Actions:
   - "Get Impact Story" button (triggers AI generation)
   - Share to social (simulated)

5. components/shared/ComparisonContext.tsx
   - "Equivalent to X trees absorbing for a year"
   - "Like driving X km"
   - Use positive framing when contributions made

Animate the "gross minus contributions equals net" calculation.
```

**Task 2.3: Ask Max Chat — SAF-First, Impact Stories (1.5 hours)**

**Cursor Prompt 2.3:**
```
Create the enhanced Ask Max chat interface:

1. app/(customer)/chat/page.tsx
   - Import AskMaxChat component

2. components/customer/AskMaxChat.tsx
   Chat container:
   - Messages list with scroll
   - Max avatar (friendly, nature-themed)
   - Typing indicator
   - Input field with send button
   
   Message types:
   - Text messages (user and Max)
   - Action cards (SAF contribution, offset, circularity)
   - Impact Story cards (generated narratives)
   - Quick action buttons
   
3. Suggested questions chips when chat is empty:
   - "Why is SAF better than offsets?"
   - "How do you calculate my footprint?"
   - "What's my Green Tier progress?"
   - "Show me my impact story"
   - "Find me sustainable shops"

4. components/customer/ImpactStory.tsx
   Special card for AI-generated impact narratives:
   - Vivid imagery (could include placeholder illustration)
   - Specific details about their contribution
   - Emotional, personal tone
   - "Thank you" closing
   - Share button

5. Quick action buttons Max can include:
   - "Contribute to SAF" → opens SAF flow
   - "See Green Shops" → navigates to shop page
   - "View My Journey" → navigates to journey page
   - "Log Circularity Action" → opens action sheet

Max's messages should use SAF-first language and never claim "carbon neutral".
```

#### Afternoon (4 hours)

**Task 2.4: Claude API — Enhanced with Impact Stories (1.5 hours)**

**Cursor Prompt 2.4:**
```
Create the enhanced Ask Max backend:

1. lib/claude/askMax.ts
   - ASK_MAX_SYSTEM_PROMPT constant (from implementation plan - SAF-first version)
   - buildContextString() including Green Tier status and circularity actions
   - askMax() function calling Claude API

2. lib/claude/impactStories.ts
   - IMPACT_STORY_PROMPT constant
   - generateImpactStory() for SAF, offset, and circularity contributions
   - Stories should be vivid, specific, and emotional

3. app/api/chat/route.ts
   POST endpoint:
   - Accept: message, journeyContext, greenTierContext, chatHistory
   - Detect if user is asking for impact story
   - If so, call generateImpactStory()
   - Return: reply, nudge (if applicable), impactStory (if generated)

4. lib/claude/nudges.ts
   - Enhanced PROACTIVE_NUDGES with SAF-first messaging
   - Include circularity nudges
   - Include Green Tier progress nudges
   - checkForNudge() evaluates all triggers

5. hooks/useAskMax.ts
   - Manage chat history state
   - sendMessage() function
   - Handle impact story responses specially
   - Store chat history in localStorage

Test with these queries:
- "Should I offset my flight?"
- "What is radiative forcing?"
- "Show me my impact story"
- "How close am I to the next tier?"
```

**Task 2.5: Green Shop + Circularity Actions (1.5 hours)**

**Cursor Prompt 2.5:**
```
Create the green shopping and circularity experience:

1. app/(customer)/shop/page.tsx
   Two tabs: "Green Shops" and "Eco Actions"

2. Green Shops Tab:
   components/customer/GreenShopList.tsx
   - Filter by: category, terminal, carbon score
   - Sort by: rating, eco-points multiplier
   - "Green Picks" featured section at top
   
   components/customer/GreenShopCard.tsx
   - Carbon score badge (A-E with colors)
   - Eco-Points multiplier badge (e.g., "2x points")
   - Location and highlights
   - "Get Directions" button

3. Eco Actions Tab (NEW):
   components/customer/CircularityActions.tsx
   - List of available actions from circularityActions.json
   - Each action shows:
     - Icon and name
     - Eco-Points reward
     - Waste diverted (grams)
     - "Log Action" button
   
   components/customer/CupAsService.tsx
   - Special card for Cup-as-a-Service
   - QR code placeholder (for demo)
   - Instructions
   - Participating outlets list

4. components/customer/ProductAdvisor.tsx
   - "Check Before You Buy" input
   - User types product name
   - Calls Ask Max for:
     - Estimated carbon
     - Sustainable alternatives at Changi
     - Green merchant recommendation

5. Action logging:
   - When user taps "Log Action", record to journey context
   - Award Eco-Points immediately with celebration animation
   - Show "Nice! +30 Eco-Points" toast

Include framework-aligned messaging about circularity beyond just carbon.
```

**Task 2.6: Full Rewards Experience (1 hour)**

**Cursor Prompt 2.6:**
```
Create the complete rewards experience:

1. app/(customer)/rewards/page.tsx
   Three tabs: "My Tier", "Badges", "Leaderboard"

2. My Tier Tab:
   components/customer/GreenTierStatus.tsx (enhanced)
   - Large tier icon with animation
   - Tier name and color
   - Progress bar to next tier (animated)
   - "X points to [Next Tier]" with countdown feel
   - Current perks list
   - Next tier perks preview (grayed)
   
   components/customer/EcoPointsHistory.tsx
   - Recent points earnings
   - Filter by category (SAF, circularity, transport, etc.)
   - Running total

3. Badges Tab:
   components/customer/BadgeGrid.tsx
   - Grid of all badges
   - Earned: full color, checkmark, date earned
   - Locked: grayed, lock icon, "How to earn" on tap
   
   Special badges:
   - "SAF Pioneer" — First SAF contribution
   - "Circular Hero" — 10 circularity actions
   - "Green Commuter" — 5 public transport trips
   - "Plant Powered" — 5 plant-based meals

4. Leaderboard Tab:
   components/customer/Leaderboard.tsx
   - Top 10 users (mock data)
   - Current user highlighted with tier color
   - Show: rank, name, tier icon, points
   - "This week" / "All time" toggle
   - Note: "Rankings based on Eco-Points earned"

5. Tier upgrade celebration:
   - Full-screen animation when user reaches new tier
   - New tier icon reveal
   - Perks unlocked list
   - Share button

Use Framer Motion for all animations. Make earning points feel rewarding.
```

**Day 2 Exit Criteria:**
- [ ] Journey context with circularity tracking
- [ ] Journey summary showing net impact (after SAF/offsets)
- [ ] Ask Max responding with SAF-first language
- [ ] Impact stories generating
- [ ] Green shops AND circularity actions available
- [ ] Full rewards experience with tier progression

---

### Day 3: Telegram Bot + Proactive Nudges + Circularity

**Goal:** Working Telegram bot with SAF-first messaging and circularity features

#### Morning (4 hours)

**Task 3.1: Telegram Bot Setup (1.5 hours)**

**Cursor Prompt 3.1:**
```
Set up the Telegram bot with SAF-first positioning:

1. Create bot with @BotFather:
   - Name: Changi Eco Advisor
   - Username: carbon_max_bot
   - Description: "Your sustainable travel companion at Changi Airport"
   - Set commands list

2. lib/telegram/bot.ts
   COMMANDS object with handlers:
   - /start — Welcome with Green Tier status
   - /calculate — Calculate flight emissions (SAF-first results)
   - /saf — Learn about and contribute to SAF
   - /journey — View current journey summary
   - /shop — Find green-rated shops
   - /eco — Log circularity action
   - /tier — Check Green Tier status
   - /ask [question] — Ask Max anything
   - /impact — Get personalized impact story

3. lib/telegram/keyboards.ts
   Keyboard builders:
   - buildDestinationKeyboard() — Top 6 destinations
   - buildClassKeyboard() — Travel classes with Eco-Points indicator
   - buildSAFKeyboard() — SAF contribution options (25%, 50%, 75%, 100%)
   - buildCircularityKeyboard() — Quick circularity actions
   - buildTierKeyboard() — Tier info and progress

4. lib/telegram/messages.ts
   Message templates with SAF-first language:
   - Welcome message mentioning SAF mandate
   - Flight result with SAF as primary action
   - SAF explainer content
   - Tier progress message
   - Impact story format

5. Store in .env.local:
   TELEGRAM_BOT_TOKEN=your_token_here
```

**Task 3.2: Telegram Webhook Handler (1.5 hours)**

**Cursor Prompt 3.2:**
```
Create the Telegram webhook with full command support:

1. app/api/telegram/route.ts
   Handle messages:
   - /start — Welcome with tier status, explain SAF
   - /calculate [destination] — Start or continue calculation
   - /saf — SAF explainer and contribution flow
   - /journey — Format journey as Telegram message
   - /shop [category] — List green shops
   - /eco [action] — Log circularity action
   - /tier — Show tier progress with visual bar
   - /ask [question] — Pass to Ask Max
   - /impact — Generate and send impact story
   
   Handle callback queries:
   - calc_[routeId] — Select destination
   - class_[class] — Select travel class
   - saf_[percent] — Choose SAF contribution percent
   - saf_confirm — Confirm SAF contribution
   - eco_[action] — Log specific circularity action
   
   Free-form messages:
   - Pass to Ask Max with context
   - Return response with inline actions

2. User session management:
   - Store in-memory keyed by chatId
   - Track: current journey, tier status, conversation state

3. SAF contribution flow in Telegram:
   Step 1: Show flight result with SAF prominently
   Step 2: "Contribute to SAF?" with percentage buttons
   Step 3: Show cost and liters attributed
   Step 4: Confirm contribution
   Step 5: Show Eco-Points earned and tier progress

Always use SAF-first language in all bot responses.
```

**Task 3.3: Bot Conversation Flows (1 hour)**

**Cursor Prompt 3.3:**
```
Create conversation flow handlers:

1. lib/telegram/flows.ts

Flight Calculation Flow (SAF-first):
   Step 1: Select destination → keyboard
   Step 2: Select class → keyboard (show Eco-Points for economy choice)
   Step 3: Calculate and display results:
     - Emissions with RF
     - Aircraft efficiency rating
     - SAF contribution prominently
     - Offset as secondary
   Step 4: If user selects SAF → SAF contribution flow
   Step 5: Show Eco-Points earned, tier progress

Circularity Action Flow:
   Step 1: Show available actions keyboard
   Step 2: User selects action
   Step 3: Confirm logging
   Step 4: Award Eco-Points with celebration emoji
   Step 5: Show updated tier progress

Tier Check Flow:
   - Visual tier badge (emoji)
   - Points total
   - Progress bar (using block characters: ▓▒░)
   - Points to next tier
   - Current perks

Impact Story Flow:
   - Check if user has contributions
   - Generate story via Claude
   - Send as formatted message with emoji
   - Include share prompt

Format all messages with appropriate Markdown and emojis.
Make the experience feel conversational and rewarding.
```

#### Afternoon (4 hours)

**Task 3.4: Proactive Nudge System (1.5 hours)**

**Cursor Prompt 3.4:**
```
Create the proactive nudge system with SAF-first and circularity nudges:

1. lib/claude/nudges.ts
   Define all nudge templates from implementation plan:
   - post_flight_calculation (SAF-first)
   - near_cup_station (circularity)
   - near_tier_upgrade (gamification)
   - meal_time_plant_based (circularity)
   - pre_trip_transport
   - journey_complete (with impact story offer)

2. Nudge evaluation logic:
   evaluateNudges(context) function:
   - Check all trigger conditions
   - Return highest priority applicable nudge
   - Track last nudge time to avoid spam

3. Web app integration:
   - NudgeToast component (uses shadcn Toast)
   - Max avatar in toast
   - Message and action button
   - Dismiss option
   - Track dismissed nudges to not repeat

4. Telegram integration:
   - Send nudge after relevant actions
   - Respect rate limits (max 1 nudge per 30 min)
   - Include inline action buttons

5. Nudge triggers:
   - After flight calculation → SAF nudge (high priority)
   - Time-based → Meal nudges at lunch/dinner
   - Points-based → Tier upgrade nudge when close
   - Journey end → Impact story offer

Nudges should feel helpful, not annoying. Always provide value.
```

**Task 3.5: Circularity Deep Integration (1 hour)**

**Cursor Prompt 3.5:**
```
Create deep circularity tracking:

1. lib/circularity/wasteTracker.ts
   - trackAction(actionId, userId) function
   - Calculate waste diverted
   - Award Eco-Points
   - Update journey context
   - Return impact summary

2. lib/circularity/cupService.ts
   - Cup-as-a-Service specific logic
   - Track borrow and return
   - Calculate multiple uses impact
   - Special bonus for consistent users

3. app/api/circularity/route.ts
   POST endpoint:
   - action: 'log' | 'history' | 'impact'
   - For 'log': actionId, userId
   - Return: points earned, waste diverted, journey update

4. Dashboard metrics preparation:
   - Total waste diverted (kg)
   - Single-use items avoided
   - Circularity actions count
   - Top actions by popularity

5. components/customer/CircularityImpact.tsx
   - Summary card showing:
     - Total waste diverted this journey
     - Single-use items avoided
     - "Equivalent to X plastic bags"
   - Celebration animation on milestone (e.g., 100g diverted)

Framework alignment: This addresses "Novel Entities" planetary boundary (plastics, chemical pollution) as recommended.
```

**Task 3.6: Activity Logging for Dashboard (1.5 hours)**

**Cursor Prompt 3.6:**
```
Create comprehensive activity logging:

1. lib/activity/logger.ts
   logActivity(activity) function
   Activity types (expanded):
   - flight_calculated
   - saf_contributed (track amount, provider, verification)
   - offset_purchased
   - circularity_action (track action type, waste diverted)
   - green_shop_visited
   - plant_based_meal
   - transport_mode_selected
   - tier_upgraded
   - badge_earned
   - impact_story_generated
   
   Activity schema:
   {
     id: string,
     type: ActivityType,
     timestamp: string,
     userId: string,
     details: {
       // varies by type
     },
     emissions?: number,
     emissionsAvoided?: number,
     wasteDiverted?: number,
     ecoPoints?: number,
     safLiters?: number
   }

2. app/api/activity/route.ts
   - POST to log new activity
   - GET with filters (type, date range, userId)
   - Aggregation endpoints for dashboard

3. Integration points:
   - Flight calculator → log calculation
   - SAF contribution → log with provider, liters, verification status
   - Circularity action → log with waste metrics
   - Tier upgrade → log milestone

4. Real-time feed preparation:
   - Store in JSON file for MVP
   - Format for dashboard display
   - Include rich details for each type

This feeds the operations dashboard with comprehensive data.
```

**Day 3 Exit Criteria:**
- [ ] Telegram bot responding to all commands
- [ ] SAF-first messaging throughout bot
- [ ] Circularity actions loggable via Telegram
- [ ] Proactive nudges appearing in web app
- [ ] Activities being logged with SAF and circularity data

---

### Day 4: Operations Dashboard + SAF Tracking

**Goal:** Complete operations view with SAF tracking and circularity metrics

#### Morning (4 hours)

**Task 4.1: Dashboard Layout (1 hour)**

**Cursor Prompt 4.1:**
```
Create the operations dashboard layout:

1. app/dashboard/layout.tsx
   - Sidebar navigation (collapsed on mobile)
   - Header with date, "Live" indicator, and refresh button
   - Main content area

2. components/dashboard/DashboardShell.tsx
   Professional styling (changi-navy):
   - Sidebar items with icons:
     - 📊 Overview
     - ✈️ Flight Emissions
     - 🌿 SAF Tracking (NEW)
     - ♻️ Circularity (NEW)
     - 🏪 Merchant Performance
     - 📋 Activity Log
   - CAG logo
   - User avatar

3. Navigation implementation:
   - Active state styling
   - Tooltip on collapsed sidebar
   - Mobile drawer navigation

Use professional, data-focused design appropriate for sustainability managers.
```

**Task 4.2: Dashboard Overview — Enhanced (1.5 hours)**

**Cursor Prompt 4.2:**
```
Create the dashboard overview with SAF and circularity metrics:

1. app/dashboard/page.tsx

2. Key metrics row (6 StatCards):
   Row 1:
   - Today's Gross Emissions (tCO2e)
   - SAF Contributions Today (liters) — NEW, highlighted green
   - Net Emissions (after SAF/offsets) — NEW
   
   Row 2:
   - Offset Rate (%)
   - Circularity Actions Today — NEW
   - Waste Diverted (kg) — NEW

3. components/dashboard/StatCard.tsx
   - Large number display
   - Label and comparison (vs yesterday/last week)
   - Trend indicator with color
   - Optional highlight border for key metrics (SAF)

4. SAF Progress Section (NEW):
   components/dashboard/SAFProgressCard.tsx
   - Current SAF uptake percentage
   - Progress bar toward 2026 mandate (1%)
   - "X liters contributed today"
   - "On track" / "Behind" indicator

5. Emissions Chart (Recharts):
   components/dashboard/EmissionsChart.tsx
   - Stacked area chart showing:
     - Gross emissions (gray)
     - SAF reduction (green, negative)
     - Offset reduction (blue, negative)
     - Net emissions (line)
   - Toggle: Daily / Weekly / Monthly

6. Two-column layout below:
   Left: Source breakdown (donut chart)
   Right: Top routes table with SAF availability indicator

Show SAF prominently as the key metric for 2026 readiness.
```

**Task 4.3: SAF Tracking Dashboard — NEW (1.5 hours)**

**Cursor Prompt 4.3:**
```
Create dedicated SAF tracking view:

1. app/dashboard/saf/page.tsx

2. components/dashboard/SAFTracker.tsx
   Hero metrics:
   - Total SAF Contributed (liters, this month)
   - CO2e Avoided via SAF
   - % of Passenger Flights Covered
   - Progress to 2026 Mandate (1%)

3. SAF Timeline Chart:
   - Line chart showing SAF contributions over time
   - Overlay: 2026 mandate target line
   - Forecast: "At current rate, will reach X% by 2026"

4. SAF by Route Table:
   - Route, Flights, SAF Contributions, Coverage %
   - Sort by coverage
   - Highlight routes with 0% coverage (opportunity)

5. Provider Breakdown:
   - Pie chart showing SAF by provider (Neste, Shell, etc.)
   - Provider certification badges

6. Passenger Engagement:
   - % of passengers who saw SAF option
   - % who contributed
   - Average contribution amount
   - Conversion funnel visualization

7. Book & Claim Verification Status:
   - Pending verifications count
   - Recently verified
   - Audit trail link

This view helps sustainability team track 2026 mandate readiness.
```

#### Afternoon (4 hours)

**Task 4.4: Circularity Dashboard — NEW (1 hour)**

**Cursor Prompt 4.4:**
```
Create circularity tracking view:

1. Add to dashboard navigation: /dashboard/circularity

2. components/dashboard/CircularityMetrics.tsx
   Hero metrics:
   - Total Waste Diverted (kg, this month)
   - Single-Use Items Avoided
   - Cup-as-a-Service Uses
   - Active Circular Participants

3. Actions Breakdown:
   - Bar chart showing actions by type
   - Cup reuse, bag refusal, plant-based meals, etc.

4. Terminal Heatmap:
   - Show which terminals have most circularity actions
   - Identify opportunity areas

5. Trend Over Time:
   - Line chart showing waste diverted daily
   - Compare to previous period

6. Top Participants:
   - Leaderboard of most active users (anonymized)
   - Tier distribution of circular participants

This addresses the framework's "Novel Entities" planetary boundary tracking.
```

**Task 4.5: Dashboard API + Live Integration (1.5 hours)**

**Cursor Prompt 4.5:**
```
Create dashboard data API with real-time capabilities:

1. app/api/dashboard/route.ts
   GET endpoint with query params:
   - period: 'today' | 'week' | 'month'
   - view: 'overview' | 'saf' | 'circularity'
   
   Returns comprehensive data:
   {
     summary: {
       grossEmissions: number,
       safContributed: number,
       safCO2eAvoided: number,
       netEmissions: number,
       offsetRate: number,
       circularityActions: number,
       wasteDiverted: number
     },
     safProgress: {
       currentPercent: number,
       targetPercent: number,
       litersSinceLastMonth: number,
       forecastFor2026: number
     },
     circularity: {
       byActionType: Record<string, number>,
       byTerminal: Record<string, number>,
       trend: Array<{ date: string, wasteDiverted: number }>
     },
     bySource: { ... },
     timeSeries: Array<{ date: string, gross: number, net: number, saf: number }>,
     topRoutes: Array<{ route: string, emissions: number, safCoverage: number }>,
     recentActivity: Array<Activity>
   }

2. Mock data generation:
   - Generate realistic data for past 7 days
   - Include SAF and circularity metrics
   - Show positive trends (good demo story)

3. Real-time integration:
   - When customer app logs activity, it appears in dashboard
   - Use polling (every 10 seconds) for live updates
   - Show "new" badge on fresh activities
```

**Task 4.6: UI Polish + Framework Alignment (1.5 hours)**

**Cursor Prompt 4.6:**
```
Polish pass with framework alignment:

1. Loading states:
   - Skeleton loaders matching card layouts
   - Smooth fade-in for data

2. Empty states:
   - Friendly messages
   - Suggest actions to generate data

3. Methodology transparency (greenwashing protection):
   - Add "How we calculate" link on dashboard
   - Show data sources for each metric
   - Acknowledge estimation where applicable

4. SAF-first visual hierarchy:
   - SAF metrics should be most prominent
   - Use carbon-leaf green for SAF elements
   - Secondary color for offsets

5. Circularity celebration:
   - Special styling for circularity section
   - Different color palette (more organic)
   - Icons that feel "circular"

6. Accessibility:
   - Check all color contrasts
   - Add aria labels
   - Keyboard navigation

7. Demo mode:
   - Toggle to simulate live activity
   - Generates random activities every 30 seconds
   - Makes dashboard feel alive for presentation

8. Print-friendly:
   - "Export Report" button
   - Clean layout for PDF generation

Focus on making SAF progress the hero metric.
```

**Day 4 Exit Criteria:**
- [ ] Dashboard overview with SAF and circularity metrics
- [ ] Dedicated SAF tracking page with 2026 progress
- [ ] Circularity metrics dashboard
- [ ] Live activity feed reflecting customer actions
- [ ] Methodology transparency on all calculations
- [ ] Demo mode for live presentation

---

### Day 5: Demo Flow + Compliance Narrative

**Goal:** Demo-ready product with 2026 compliance narrative

#### Morning (4 hours)

**Task 5.1: Landing Page — Compliance Narrative (1.5 hours)**

**Cursor Prompt 5.1:**
```
Create the landing page with 2026 compliance narrative:

1. app/page.tsx

Sections:

Hero:
- "Changi Sustainable Loyalty Ecosystem"
- Tagline: "From calculator to compliance. Ready for Singapore's 2026 SAF mandate."
- Two CTAs: "Experience as Passenger" | "View Operations Dashboard"
- Background: Subtle gradient with leaf motifs

Problem Statement:
- "The offset era is ending. The SAF era begins in 2026."
- Show the timeline: 2024 (now) → 2026 (1% SAF) → 2030 (3-5%)
- Changi's current gap: ACA Level 3 vs competitors at Level 4-5

Solution Overview:
- 4 pillars with icons:
  - 🌿 SAF-First Contributions
  - 🎖️ Green Tier Loyalty
  - ♻️ Circularity Tracking
  - 📊 Real-Time Dashboard

Framework Alignment:
- Brief mention of Planetary Boundaries
- "Beyond carbon — addressing waste, biodiversity, and sustainable choices"

Demo Instructions:
- How to use the demo
- Telegram bot QR code
- What to try first

Compliance Readiness:
- "Built for CSRD, ISSB, and Singapore's Sustainable Air Hub Blueprint"
- Methodology transparency highlight

Footer:
- "Built with the CARBON Framework"
- Link to project documentation

Professional but forward-looking. Should feel like a compliance solution, not just a green marketing tool.
```

**Task 5.2: Demo Script Mode — 2026 Narrative (1 hour)**

**Cursor Prompt 5.2:**
```
Create guided demo mode with compliance narrative:

1. lib/demo/demoScript.ts
   Define demo scenario steps with narrative:
   
   Intro:
   "The offset era is ending. Singapore mandates SAF from 2026. Let's see how Changi is preparing..."

   Step 1: Calculate London flight
   - Show emissions with radiative forcing
   - Highlight methodology transparency
   
   Step 2: SAF contribution (primary action)
   - Explain Book & Claim
   - Show verification status
   - "This funds real SAF at Neste Singapore"
   
   Step 3: Ask Max about SAF
   - "Why SAF first?" question
   - Show Max's educational response
   
   Step 4: Circularity action
   - Log Cup-as-a-Service
   - Show waste diverted
   - "Beyond carbon — addressing plastics too"
   
   Step 5: Green Tier progress
   - Show Eco-Points earned
   - Tier upgrade celebration
   - "Gamifying sustainable behavior"
   
   Step 6: Impact story
   - Request personalized impact story
   - Show AI-generated narrative
   - "Making the abstract concrete"
   
   Step 7: Dashboard view
   - Show SAF progress toward 2026
   - Live activity feed
   - "Real-time compliance visibility"

2. components/shared/DemoOverlay.tsx
   - Step indicator (1/7, 2/7, etc.)
   - Narrative text (presenter notes)
   - Next/Back buttons
   - Skip to any step
   - "Exit demo mode" option

3. Store demo state in URL params for direct linking to any step.
```

**Task 5.3: Sample Data — Success Story (1 hour)**

**Cursor Prompt 5.3:**
```
Create sample data that tells a positive compliance story:

1. data/mockActivity.json
   - 50+ activities from "past week"
   - Heavy emphasis on SAF contributions (showing adoption)
   - Good mix of circularity actions
   - Show increasing trend

2. Dashboard seed data:
   - SAF progress: 0.7% (showing momentum toward 1% mandate)
   - Net emissions trending down
   - Circularity actions growing
   - Passenger engagement improving

3. Mock user "Sarah Chen":
   - Pre-calculated London flight
   - SAF contribution (50% coverage)
   - 2 circularity actions
   - Tree tier status (1,800 points)
   - 3 badges earned

4. Mock leaderboard:
   - 20 users across all tiers
   - Realistic point distributions
   - Shows community engagement

5. SAF tracking data:
   - Show contributions from multiple routes
   - Progress chart trending toward 2026 target
   - Provider breakdown (mostly Neste Singapore)

Data should tell the story: "Changi is ahead of the curve on 2026 compliance."
```

**Task 5.4: Telegram Demo Prep (0.5 hours)**

**Cursor Prompt 5.4:**
```
Prepare Telegram for demo:

1. Set bot profile:
   - Photo: Changi Eco Advisor logo
   - Description: "Your sustainable travel companion at Changi Airport. SAF-first, transparency always."

2. Set command descriptions:
   /start - Start your eco journey
   /calculate - Calculate flight emissions
   /saf - Learn about & contribute to SAF
   /journey - View your journey summary
   /shop - Find green-rated shops
   /eco - Log a circularity action
   /tier - Check your Green Tier status
   /impact - Get your personalized impact story
   /ask - Ask Max anything

3. Demo message sequence:
   - /start → Welcome with SAF mandate context
   - /calculate → London, business → SAF-first result
   - /saf → Book & Claim explainer
   - /eco → Log cup reuse → Points celebration
   - /tier → Show progress
   - /impact → Generate and share story

4. Create QR code for bot link

5. Document any known limitations
```

#### Afternoon (4 hours)

**Task 5.5: Testing + Bug Fixes (2 hours)**

**Cursor Prompt 5.5:**
```
Systematic testing checklist:

Customer App:
- [ ] Flight calculator shows SAF before offsets
- [ ] Radiative forcing toggle works (default ON)
- [ ] Methodology drawer shows sources
- [ ] Uncertainty ranges display correctly
- [ ] SAF contribution flow completes
- [ ] Eco-Points awarded correctly
- [ ] Green Tier progress updates
- [ ] Ask Max uses SAF-first language
- [ ] Impact stories generate
- [ ] Circularity actions log properly
- [ ] Journey shows net impact (after SAF)

Telegram Bot:
- [ ] All commands respond
- [ ] SAF contribution flow in Telegram works
- [ ] Circularity actions via Telegram
- [ ] Impact story via Telegram
- [ ] Tier status with visual progress bar

Dashboard:
- [ ] SAF metrics prominent
- [ ] 2026 progress visualization
- [ ] Circularity metrics displaying
- [ ] Activity feed updates
- [ ] Demo mode generates activities

Framework Alignment:
- [ ] Never says "carbon neutral"
- [ ] SAF always before offsets
- [ ] Methodology sources cited
- [ ] Uncertainty acknowledged

Fix any bugs found. Prioritize demo-critical issues.
```

**Task 5.6: Documentation (1 hour)**

**Cursor Prompt 5.6:**
```
Create demo and technical documentation:

1. README.md updates:
   - Project overview (Sustainable Loyalty Ecosystem, not just calculator)
   - Framework alignment summary
   - Setup instructions
   - Environment variables

2. DEMO_GUIDE.md:
   - Demo narrative script (2026 compliance story)
   - Key talking points:
     - "Offset era ending, SAF era beginning"
     - "Singapore 2026 mandate readiness"
     - "Beyond carbon: circularity"
     - "Transparency prevents greenwashing"
   - What to show, what to skip
   - Answers to likely questions:
     - "Why SAF over offsets?"
     - "How does Book & Claim work?"
     - "What about greenwashing concerns?"

3. TECHNICAL.md:
   - Architecture overview
   - SAF Book & Claim implementation
   - Eco-Points calculation logic
   - Data flow diagram
   - API documentation
   - Framework alignment decisions

4. FRAMEWORK_ALIGNMENT.md:
   - How we addressed each framework recommendation
   - SAF-first positioning
   - Planetary Boundaries beyond carbon
   - Greenwashing protection measures
   - Consumer apathy solutions (gamification)
```

**Task 5.7: Final Deployment (1 hour)**

```bash
# Final deployment checklist

# 1. Environment variables on Vercel
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=...
NEXT_PUBLIC_APP_URL=https://changi-carbon.vercel.app

# 2. Set Telegram webhook
curl -F "url=https://changi-carbon.vercel.app/api/telegram" \
  https://api.telegram.org/bot<TOKEN>/setWebhook

# 3. Test production deployment
- All features working
- SAF-first positioning verified
- No console errors
- Performance acceptable

# 4. Create shareable links
- Landing page
- Customer app direct link: /customer
- Dashboard direct link: /dashboard
- Telegram bot: t.me/carbon_max_bot
- Demo mode link with step: /?demo=true&step=1

# 5. Backup materials
- Screenshots of key screens
- Screen recording of demo flow
- Exported dashboard PDF
```

**Day 5 Exit Criteria:**
- [ ] Landing page with 2026 compliance narrative
- [ ] Demo script mode working
- [ ] All bugs fixed
- [ ] Documentation complete (including framework alignment)
- [ ] Telegram webhook configured
- [ ] Ready for presentation with compliance story

---

## 8. Demo Script — 2026 Compliance Narrative

### Presentation Flow (15 minutes)

#### Opening — The Regulatory Shift (2 minutes)

> "The offset era is ending. In 2026, Singapore becomes one of the first countries to mandate Sustainable Aviation Fuel for all departing flights.
>
> But here's Changi's paradox: We're the World's Best Airport for passenger experience, yet only mid-tier for carbon management. Hong Kong has Level 4. Schiphol achieved Level 5.
>
> **The gap isn't data — it's tooling.** We track 366,000 flights and 13 million retail transactions. We just don't use it for sustainability.
>
> Today I'll show you how we close that gap — not with another offset calculator, but with a **Sustainable Loyalty Ecosystem** built for 2026 compliance."

#### SAF-First Experience (4 minutes)

**Flight Calculator (2 min)**
> "Let's follow Sarah, a business traveler heading to London..."

1. Open Changi App simulation
2. Calculate flight (London, Business)
3. **Point out:** Radiative forcing ON by default ("We include non-CO2 effects — scientifically honest")
4. **Point out:** Methodology drawer ("Full transparency — here's exactly how we calculated")
5. **Point out:** SAF shown FIRST ("Notice: SAF contribution is primary, offsets secondary")

**SAF Contribution (2 min)**
> "Sarah wants to take action. Watch how we guide her..."

1. Click SAF contribution
2. Show Book & Claim explainer ("The fuel goes into Singapore's system; she gets the climate benefit")
3. Complete contribution
4. Show Eco-Points earned ("10 points per dollar for SAF — twice what offsets earn")
5. **Key message:** "Every dollar funds real SAF at Neste's Singapore refinery"

#### Beyond Carbon — Circularity (2 minutes)

> "But we're not just about flights. The framework told us: address Planetary Boundaries beyond carbon..."

1. Navigate to Eco Actions
2. Log Cup-as-a-Service action
3. Show waste diverted
4. **Key message:** "15 grams of plastic. Small? Multiply by 180,000 daily passengers."

#### Gamification That Works (2 minutes)

> "The framework warned us: 1-2% offset conversion rates. Passengers say they care, but don't act. Our solution: Green Tier..."

1. Show Sarah's Green Tier status
2. Point out tier multiplier ("1.25x points at Tree tier")
3. Show progress to Forest tier
4. **Key message:** "It's like airline status, but for sustainability"

5. Show badges earned
6. **Key message:** "Social signaling — Green Boarding lets others see your commitment"

#### Ask Max — AI That Educates (2 minutes)

> "But what happens when passengers have questions about SAF, methodology, or impact?"

1. Open Ask Max chat
2. Ask: "Why is SAF better than offsets?"
3. Show SAF-first response
4. Ask: "Show me my impact story"
5. Show personalized impact narrative
6. **Key message:** "Not a generic certificate — a vivid story about her specific contribution"

#### Operations Dashboard — Compliance Readiness (2 minutes)

> "Meanwhile, the sustainability team sees this..."

1. Switch to dashboard
2. **Hero metric:** SAF progress toward 2026 mandate
3. Show trending toward target
4. Point out circularity metrics ("Not just carbon — waste too")
5. Show activity feed
6. "Watch what happens when a customer contributes..." → Activity appears
7. **Key message:** "Real-time compliance visibility"

#### Closing — Ready for 2026 (1 minute)

> "This MVP demonstrates our Sustainable Loyalty Ecosystem:
>
> - **SAF-first**, not offset-first
> - **Transparent** methodology, not black-box calculations
> - **Circularity** beyond just carbon
> - **Gamified** to actually change behavior
> - **Compliant** with Singapore's 2026 mandate
>
> We're not building a calculator. We're building the infrastructure for Changi to lead aviation sustainability in Asia.
>
> Questions?"

---

## 9. Risk Mitigation — Framework Aligned

| Risk | Framework Source | Likelihood | Impact | Mitigation |
|------|------------------|------------|--------|------------|
| Greenwashing allegations | Section 1.1, 3.4 | High | Critical | Never claim "carbon neutral"; cite all sources; acknowledge uncertainty |
| SAF supply constraints | Section 1.2 | Medium | High | Book & Claim allows virtual attribution; not dependent on physical SAF at Changi |
| Consumer apathy (1-2% conversion) | Section 3.2 | High | Medium | Green Tier gamification; instant Eco-Points feedback; social signaling |
| Verification latency | Section 3.2 | High | Medium | Show "pending" status; monthly verification cycle; interim points |
| Claude API rate limits | Technical | Medium | Medium | Cache common responses; have fallbacks |
| Regulatory changes | Section 1.2 | Low | Medium | Modular design allows pivot; track CAAS announcements |

---

## 10. Framework Alignment Summary

| Framework Recommendation | How We Addressed It |
|--------------------------|---------------------|
| **SAF > Offsets** | SAF shown first in all UX; earns 2x Eco-Points |
| **End of "Offset Era"** | Offset positioned as secondary; focus on removals, not avoidance |
| **Green Tier Status** | Full Green Tier loyalty system with 5 tiers |
| **Book & Claim SAF** | Complete implementation with verification tracking |
| **Radiative Forcing** | Default ON with educational content |
| **Planetary Boundaries** | Circularity tracking addresses Novel Entities boundary |
| **Greenwashing Protection** | Never say "carbon neutral"; cite all sources; show uncertainty |
| **Consumer Apathy** | Gamification with instant feedback; social signaling |
| **Verification Latency** | Pending status; monthly verification; interim points |
| **AI for Impact** | Claude-powered impact stories; personalized narratives |
| **Methodology Transparency** | "How we calculated" on every result |
| **Circularity Economy** | Cup-as-a-Service; waste tracking; sustainable shopping |

---

## Appendix: Environment Variables

```bash
# .env.local

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC...

# App
NEXT_PUBLIC_APP_URL=https://changi-carbon.vercel.app
NEXT_PUBLIC_APP_NAME="Changi Sustainable Loyalty Ecosystem"

# Feature flags
NEXT_PUBLIC_ENABLE_SAF=true
NEXT_PUBLIC_ENABLE_CIRCULARITY=true
NEXT_PUBLIC_DEFAULT_RF=true  # Radiative forcing default
```

---

## Appendix: Key Messages for Demo

**On SAF:**
> "SAF directly reduces aviation emissions. Offsets compensate elsewhere. For aviation, SAF is the real solution."

**On 2026 Mandate:**
> "Singapore mandates 1% SAF from 2026, rising to 3-5% by 2030. We're building compliance infrastructure now."

**On Book & Claim:**
> "The fuel enters Singapore's system. You get the climate benefit. It's how SAF scales before supply catches up."

**On Radiative Forcing:**
> "Aviation's climate impact isn't just CO2. Contrails, NOx, water vapor — we include them all. That's scientific honesty."

**On Circularity:**
> "Carbon is one boundary. Plastics are another. We're building for the whole picture."

**On Gamification:**
> "1-2% of passengers offset today. Why? No feedback, no status, no community. Green Tier changes that."

---

*Plan Version: 2.0*
*Framework Aligned: December 2024*
*For: Changi Airport Sustainable Loyalty Ecosystem MVP*
