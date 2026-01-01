# Framework Alignment Documentation

## How We Addressed Each Framework Recommendation

This document maps the CARBON Framework recommendations to specific implementation decisions in the Changi Sustainable Loyalty Ecosystem.

---

## Framework Overview

The **CARBON Framework** (Context → Assets → Recipients → Behaviors → Offerings → Next) guided the design of this solution. This document shows how each framework stage's recommendations were implemented.

**Reference**: See [doc/CARBON_Framework.md](CARBON_Framework.md) for full framework documentation.

---

## C | Context: The Performance Paradox

### Framework Recommendation

> "Address the gap between World's Best Airport (experience) and ACA Level 3 (carbon management). Prepare for Singapore's 2026 SAF mandate."

### How We Addressed It

#### 1. SAF-First Positioning

**Implementation**:
- SAF contributions prioritized over offsets in all UI flows
- Welcome messages include 2026 mandate context
- SAF earns 2x Eco-Points vs. offsets (10 vs. 5 per dollar)
- Book-and-Claim system aligned with IATA standards

**Code Locations**:
- `lib/claude/askMax.ts`: System prompt instructs SAF-first recommendations
- `components/customer/SAFContribution.tsx`: SAF option displayed first
- `lib/telegram/messages.ts`: Welcome message includes mandate context
- `lib/saf/bookAndClaim.ts`: IATA-aligned Book-and-Claim implementation

**Evidence**:
```typescript
// From lib/claude/askMax.ts
"SAF FIRST: Always recommend Sustainable Aviation Fuel contribution before offsets"
"Singapore mandates 1% SAF from 2026 — you'd be ahead of the curve!"
```

#### 2. 2026 Mandate Readiness

**Implementation**:
- SAF tracking infrastructure built before mandate
- Book-and-Claim system ready for compliance
- Passenger education about mandate integrated into flows

**Code Locations**:
- `data/safProjects.json`: Singapore mandate information embedded
- `lib/saf/bookAndClaim.ts`: Verification system ready for IATA registry
- `lib/telegram/messages.ts`: Mandate context in welcome messages

---

## A | Assets: Leveraging Unique Data Infrastructure

### Framework Recommendation

> "Leverage Changi's unique assets: 366K flights tracked, 13M+ transactions, Changi App ecosystem."

### How We Addressed It

#### 1. Aircraft-Specific Calculations

**Implementation**:
- Route data includes aircraft efficiency ratings
- Flight calculator uses route-specific factors, not generic distance
- Methodology shows actual aircraft type used

**Code Locations**:
- `lib/emissions/flightCalculator.ts`: Route-based calculations
- `data/routes.json`: Aircraft efficiency ratings per route
- `lib/emissions/methodology.ts`: Transparent calculation display

**Evidence**:
```typescript
// From lib/emissions/flightCalculator.ts
const efficiencyFactor = EFFICIENCY_FACTORS[route.aircraft_efficiency_rating];
// Uses route-specific efficiency, not generic distance
```

#### 2. Transaction Data Infrastructure (Planned)

**Implementation**:
- Architecture supports transaction-based carbon attribution
- Merchant module designed for POS integration
- Category-level emission factors ready

**Code Locations**:
- `components/customer/GreenShopList.tsx`: Merchant display ready
- `data/merchants.json`: Merchant data structure
- Architecture supports future POS integration

**Note**: Full transaction integration requires production POS system access.

---

## R | Recipients: Multi-Segment Solution

### Framework Recommendation

> "Serve three segments: CAG teams (primary), business partners (secondary), passengers (tertiary)."

### How We Addressed It

#### 1. Passenger-Facing Features

**Implementation**:
- Flight calculator with transparency
- SAF contribution flow
- Circularity actions
- Green Tier gamification
- Telegram bot for conversational engagement

**Code Locations**:
- `app/(customer)/`: All customer-facing pages
- `components/customer/`: Customer components
- `lib/telegram/`: Telegram bot implementation

#### 2. Operations Dashboard (Planned)

**Implementation**:
- Dashboard architecture in place
- Real-time emissions view structure
- SAF tracking ready for operations team

**Code Locations**:
- `app/dashboard/`: Dashboard pages
- `components/dashboard/`: Dashboard components
- Architecture supports future real-time data feeds

**Note**: Full operations dashboard requires production data pipeline integration.

#### 3. Stakeholder Platform (Planned)

**Implementation**:
- Architecture supports multi-tenant reporting
- Benchmarking structure designed
- Partner onboarding flow conceptualized

**Note**: Stakeholder platform requires partner buy-in and data sharing agreements.

---

## B | Behaviors: Journey Touchpoint Interventions

### Framework Recommendation

> "Intervene at key journey moments: check-in, shopping, post-departure, quarterly reporting."

### How We Addressed It

#### 1. Pre-Departure: Flight Calculator

**Implementation**:
- Calculator available before flight
- SAF contribution option at calculation time
- Methodology transparency builds trust

**Code Locations**:
- `app/(customer)/calculator/page.tsx`: Flight calculator page
- `components/customer/FlightCalculator.tsx`: Calculator component

#### 2. During Journey: Circularity Actions

**Implementation**:
- Circularity actions available during airport visit
- Real-time logging of actions
- Points celebration for engagement

**Code Locations**:
- `components/customer/CircularityActions.tsx`: Action logging
- `lib/circularity/index.ts`: Circularity logic

#### 3. Post-Departure: Journey Summary & Impact Stories

**Implementation**:
- Journey summary shows complete footprint
- Impact stories generate personalized narratives
- Carbon receipt available post-flight

**Code Locations**:
- `app/(customer)/journey/page.tsx`: Journey summary
- `lib/claude/impactStories.ts`: AI-generated stories
- `components/customer/CarbonReceipt.tsx`: Receipt component

#### 4. Ongoing: Green Tier & Telegram Bot

**Implementation**:
- Green Tier progression creates loyalty loop
- Telegram bot enables ongoing engagement
- Progress tracking maintains interest

**Code Locations**:
- `app/(customer)/rewards/page.tsx`: Green Tier display
- `lib/telegram/bot.ts`: Telegram bot handlers

---

## O | Offerings: Four-Pillar Solution

### Framework Recommendation

> "Four pillars: Enhanced Calculator, Stakeholder Platform, Operations Dashboard, Merchant Module. Pillar 4 (Merchant) as competitive moat."

### How We Addressed It

#### Pillar 1: Enhanced Passenger Calculator ✅ Implemented

**Implementation**:
- Aircraft-specific calculations
- Radiative forcing toggle
- SAF attribution option
- Methodology transparency
- Source citations

**Code Locations**:
- `lib/emissions/flightCalculator.ts`: Core calculation logic
- `components/customer/FlightCalculator.tsx`: UI component
- `lib/emissions/methodology.ts`: Methodology display

#### Pillar 2: Stakeholder Platform ⚠️ Architecture Ready

**Implementation**:
- Architecture supports multi-tenant reporting
- Benchmarking structure designed
- Partner onboarding flow conceptualized

**Status**: Architecture ready, requires partner buy-in for full implementation.

#### Pillar 3: Operations Dashboard ⚠️ Architecture Ready

**Implementation**:
- Dashboard pages and components created
- Real-time emissions view structure
- SAF tracking ready

**Status**: Architecture ready, requires production data pipeline integration.

#### Pillar 4: Merchant Module ⚠️ Partial Implementation

**Implementation**:
- Green-rated shops display
- Merchant data structure
- Category-level emission factors ready
- Transaction attribution architecture designed

**Code Locations**:
- `components/customer/GreenShopList.tsx`: Shop display
- `data/merchants.json`: Merchant data
- Architecture supports future POS integration

**Status**: Partial implementation. Full transaction attribution requires POS system integration.

---

## Framework-Specific Recommendations

### 1. SAF-First Positioning

**Framework Recommendation**: "Position SAF as primary action, offsets as secondary."

**Implementation**:
- ✅ SAF option appears first in all action recommendations
- ✅ SAF earns 2x Eco-Points (10 vs. 5 per dollar)
- ✅ Welcome messages emphasize SAF
- ✅ Ask Max AI recommends SAF first
- ✅ Book-and-Claim system ready for 2026 mandate

**Code Evidence**:
```typescript
// lib/claude/askMax.ts
"SAF FIRST: Always recommend Sustainable Aviation Fuel contribution before offsets"
"When users ask about offsetting: 1. FIRST explain SAF..."
```

### 2. Planetary Boundaries Beyond Carbon

**Framework Recommendation**: "Address multiple planetary boundaries, not just climate change."

**Implementation**:
- ✅ Circularity actions module tracks waste diversion
- ✅ Journey summary includes waste diverted (grams)
- ✅ Eco-Points awarded for circularity actions
- ✅ Green Tier progression rewards both carbon and circularity
- ✅ UI messaging emphasizes "beyond carbon"

**Code Evidence**:
```typescript
// components/customer/CircularityActions.tsx
"Beyond Carbon: Circularity Matters"
"While carbon emissions are important, true sustainability goes beyond just CO₂"
```

**Planetary Boundaries Addressed**:
- **Climate Change**: SAF, offsets, emissions tracking ✅
- **Novel Entities**: Waste diversion, single-use reduction ✅
- **Biodiversity**: Plant-based meals, sustainable merchants (planned)

### 3. Transparency Prevents Greenwashing

**Framework Recommendation**: "Show methodology, cite sources, display uncertainty, never claim 'carbon neutral'."

**Implementation**:
- ✅ Methodology drawer shows full calculation details
- ✅ Source citations for all emission factors
- ✅ Uncertainty ranges displayed (e.g., ±5%)
- ✅ Never claims "carbon neutral" flights
- ✅ Impact stories are specific, not generic
- ✅ "How we calculated this" expandable sections

**Code Evidence**:
```typescript
// lib/claude/askMax.ts
"NEVER claim 'carbon neutral' — use 'climate action' or 'carbon contribution'"
"Always cite sources when giving numbers"
"Acknowledge uncertainty: 'Estimates range from X to Y'"
```

**Code Locations**:
- `lib/emissions/methodology.ts`: Methodology generation
- `components/shared/MethodologyDrawer.tsx`: Methodology display
- `components/shared/SourceCitation.tsx`: Source citations
- `components/shared/UncertaintyRange.tsx`: Uncertainty display

### 4. Consumer Apathy Solutions (Gamification)

**Framework Recommendation**: "Use gamification to engage passengers, not just inform them."

**Implementation**:
- ✅ Green Tier system with six tiers
- ✅ Eco-Points awarded for all actions
- ✅ Tier multipliers create progression incentive
- ✅ Progress tracking with visual progress bars
- ✅ Milestone celebrations
- ✅ Social signaling with badges

**Code Evidence**:
```typescript
// lib/rewards/ecoPoints.ts
const POINTS_RATES: Record<ActionType, number> = {
  saf_contribution: 10,  // 2x offset rate
  carbon_offset: 5,
  circularity_action: 0  // Variable per action
};

// Tier multipliers
const tierMultiplier = currentTier.points_multiplier; // 1.0x to 3.0x
```

**Code Locations**:
- `lib/rewards/ecoPoints.ts`: Points calculation logic
- `data/greenTiers.json`: Tier definitions
- `components/customer/GreenTierStatus.tsx`: Tier display
- `components/customer/TierUpgradeCelebration.tsx`: Celebrations

### 5. Book-and-Claim System

**Framework Recommendation**: "Implement IATA-aligned Book-and-Claim for SAF attribution."

**Implementation**:
- ✅ Book-and-Claim logic implemented
- ✅ IATA registry tracking structure
- ✅ Verification certificate generation
- ✅ Explainer content integrated
- ✅ Singapore mandate context included

**Code Evidence**:
```typescript
// lib/saf/bookAndClaim.ts
verification: {
  status: 'pending' | 'verified' | 'rejected';
  registry: 'IATA Book-and-Claim Registry';
  certificateId: string;
  timestamp: string;
  provider: string;
}
```

**Code Locations**:
- `lib/saf/bookAndClaim.ts`: Core Book-and-Claim logic
- `data/safProjects.json`: Book-and-Claim explainer content
- `components/customer/SAFContribution.tsx`: UI component

---

## Framework Alignment Summary Table

| Framework Stage | Recommendation | Implementation Status | Code Location |
|----------------|----------------|----------------------|---------------|
| **Context** | SAF-first positioning | ✅ Implemented | `lib/claude/askMax.ts`, `lib/telegram/messages.ts` |
| **Context** | 2026 mandate readiness | ✅ Implemented | `data/safProjects.json`, `lib/saf/bookAndClaim.ts` |
| **Assets** | Aircraft-specific calculations | ✅ Implemented | `lib/emissions/flightCalculator.ts` |
| **Assets** | Transaction data leverage | ⚠️ Architecture ready | `components/customer/GreenShopList.tsx` |
| **Recipients** | Passenger calculator | ✅ Implemented | `app/(customer)/calculator/` |
| **Recipients** | Operations dashboard | ⚠️ Architecture ready | `app/dashboard/` |
| **Recipients** | Stakeholder platform | ⚠️ Architecture ready | (Conceptual) |
| **Behaviors** | Journey touchpoints | ✅ Implemented | Multiple components |
| **Behaviors** | Post-departure engagement | ✅ Implemented | `lib/claude/impactStories.ts` |
| **Offerings** | Pillar 1: Calculator | ✅ Implemented | `lib/emissions/`, `components/customer/` |
| **Offerings** | Pillar 2: Stakeholder | ⚠️ Architecture ready | (Conceptual) |
| **Offerings** | Pillar 3: Dashboard | ⚠️ Architecture ready | `app/dashboard/` |
| **Offerings** | Pillar 4: Merchant | ⚠️ Partial | `components/customer/GreenShopList.tsx` |
| **Framework** | SAF-first positioning | ✅ Implemented | Multiple locations |
| **Framework** | Beyond carbon | ✅ Implemented | `lib/circularity/`, `components/customer/CircularityActions.tsx` |
| **Framework** | Transparency | ✅ Implemented | `lib/emissions/methodology.ts`, `components/shared/` |
| **Framework** | Gamification | ✅ Implemented | `lib/rewards/ecoPoints.ts`, `data/greenTiers.json` |
| **Framework** | Book-and-Claim | ✅ Implemented | `lib/saf/bookAndClaim.ts` |

**Legend**:
- ✅ **Implemented**: Fully functional in demo
- ⚠️ **Architecture Ready**: Structure in place, requires production integration
- ⚠️ **Partial**: Some features implemented, full implementation requires additional work

---

## Framework Principles Applied

### 1. Problem Before Solution

**Principle**: C (Context) and R (Recipients) come before O (Offerings)

**Application**:
- Started with performance paradox (Context)
- Identified three recipient segments (Recipients)
- Designed four pillars to address each segment (Offerings)

### 2. Assets Inform Differentiation

**Principle**: A (Assets) shapes what makes O (Offerings) unique

**Application**:
- Leveraged flight tracking data for aircraft-specific calculations
- Designed merchant module around transaction data (unique to Changi)
- Pillar 4 (Merchant) becomes competitive moat

### 3. Journeys Reveal Interventions

**Principle**: B (Behaviors) identifies where O (Offerings) should intervene

**Application**:
- Mapped passenger journey touchpoints
- Designed interventions at check-in, shopping, post-departure
- Created Telegram bot for ongoing engagement

### 4. Measure What Matters

**Principle**: N (Next) connects back to C (closing the gap)

**Application**:
- Success metrics tied to ACA Level 4 achievement
- SAF mandate readiness tracked
- Partner adoption targets aligned with HKIA benchmark

### 5. Iterate, Don't Waterfall

**Principle**: Revisit earlier stages as you learn

**Application**:
- Architecture supports iteration
- Modular design allows feature additions
- Framework alignment documented for future reference

---

## Future Framework Alignment

### Planned Enhancements

1. **Full Transaction Attribution** (Pillar 4)
   - POS system integration
   - Product-level emission factors
   - Shopping carbon receipts

2. **Stakeholder Platform** (Pillar 2)
   - Partner onboarding portal
   - Benchmarking dashboard
   - Automated reporting

3. **Operations Dashboard** (Pillar 3)
   - Real-time data feeds
   - Scenario planning tools
   - ACA compliance automation

4. **Multi-Language Support**
   - Chinese (Simplified/Traditional)
   - Malay
   - Tamil

5. **Payment Integration**
   - SAF contribution payments
   - Offset purchase flow
   - Receipt generation

---

## Framework Validation

### How We Know It Works

1. **SAF-First Positioning**: Welcome messages, AI prompts, and UI flows all prioritize SAF
2. **Transparency**: Methodology drawers, source citations, uncertainty ranges all implemented
3. **Beyond Carbon**: Circularity actions module tracks waste, not just emissions
4. **Gamification**: Green Tier system with points and multipliers creates engagement
5. **Framework Alignment**: All six CARBON stages addressed in implementation

### Evidence of Framework Alignment

- ✅ **Context**: 2026 mandate readiness built into core flows
- ✅ **Assets**: Aircraft-specific calculations leverage flight tracking data
- ✅ **Recipients**: Multi-segment solution with distinct interfaces
- ✅ **Behaviors**: Interventions at key journey touchpoints
- ✅ **Offerings**: Four pillars with clear differentiation
- ✅ **Next**: Architecture supports 24-month roadmap

---

**Last Updated**: December 2024  
**Framework Version**: CARBON 1.0  
**Reference**: [doc/CARBON_Framework.md](CARBON_Framework.md)

