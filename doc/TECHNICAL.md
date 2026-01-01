# Technical Documentation

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │ Telegram Bot │  │  Dashboard    │         │
│  │  (Next.js)   │  │  (node-tele- │  │  (Next.js)    │         │
│  │              │  │  gram-bot)   │  │              │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────────────┐
│         │                  │                  │                  │
│  ┌──────▼──────────────────▼──────────────────▼──────┐          │
│  │           Next.js API Routes (App Router)         │          │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │          │
│  │  │/calculate│ │  /saf    │ │/eco-points│  ...   │          │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘         │          │
│  └───────┼────────────┼────────────┼────────────────┘          │
│          │            │            │                               │
┌──────────┼────────────┼────────────┼───────────────────────────┐
│          │            │            │                             │
│  ┌───────▼────────────▼────────────▼──────────┐                 │
│  │         Business Logic Layer (lib/)        │                 │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │                 │
│  │  │emissions │ │   saf    │ │  rewards  │ │                 │
│  │  │          │ │          │ │           │ │                 │
│  │  │flightCalc│ │bookAndClm│ │ecoPoints  │ │                 │
│  │  │          │ │          │ │           │ │                 │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ │                 │
│  │       │            │            │         │                 │
│  │  ┌────▼────────────▼────────────▼─────┐ │                 │
│  │  │      AI Integration (claude/)      │ │                 │
│  │  │  ┌──────────┐ ┌──────────┐       │ │                 │
│  │  │  │ askMax   │ │  impact   │       │ │                 │
│  │  │  │          │ │  Stories  │       │ │                 │
│  │  │  └──────────┘ └───────────┘       │ │                 │
│  │  └───────────────────────────────────┘ │                 │
│  └─────────────────────────────────────────┘                 │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │              Data Layer (data/*.json)                     ││
│  │  routes.json │ emissionFactors.json │ safProjects.json  ││
│  │  greenTiers.json │ circularityActions.json              ││
│  └──────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Runtime**: Node.js 18+
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **Charts**: Recharts
- **AI**: Anthropic Claude API
- **Telegram**: node-telegram-bot-api
- **State Management**: React Context API

### Key Design Decisions

1. **Server-Side Rendering**: Next.js App Router for SEO and performance
2. **API Routes**: RESTful API endpoints in `/app/api`
3. **Type Safety**: Full TypeScript coverage
4. **Modular Architecture**: Business logic separated from UI
5. **Data Storage**: JSON files for demo (production: database)
6. **AI Integration**: Anthropic Claude for conversational features

---

## SAF Book-and-Claim Implementation

### Overview

The SAF (Sustainable Aviation Fuel) Book-and-Claim system allows passengers to claim environmental benefits of SAF even when physical fuel isn't used on their specific flight. This follows IATA's Book-and-Claim standard.

### Implementation Location

**File**: `lib/saf/bookAndClaim.ts`

### Core Function

```typescript
export function calculateSAFContribution(input: SAFContributionInput): SAFContributionResult
```

### Input Parameters

```typescript
interface SAFContributionInput {
  routeId: string;              // Flight route identifier
  emissionsKg: number;           // Flight emissions (kg CO2e)
  contributionAmount: number;    // USD contribution amount
  safType?: 'waste_based' | 'imported';
  provider?: 'neste_singapore' | 'shell_saf';
}
```

### Calculation Logic

1. **Liters Attributed**: `contributionAmount / SAF_COST_PER_LITER`
   - Default: $2.50 USD per liter (premium over conventional fuel)

2. **Emissions Avoided**:
   ```
   conventionalEmissions = litersAttributed × conventionalFuelFactor
   safEmissions = litersAttributed × safFactor
   co2eAvoided = conventionalEmissions - safEmissions
   ```
   - Waste-based SAF: 90% reduction
   - Imported SAF: 80% reduction

3. **Eco-Points**: `contributionAmount × 10` (10 points per dollar)

4. **Verification**:
   - Status: 'pending' → 'verified' → 'rejected'
   - Registry: IATA Book-and-Claim Registry
   - Certificate ID: Generated unique identifier

### Book-and-Claim Flow

```
1. SAF Production
   └─> Certified facility (e.g., Neste Singapore)
       └─> Receives sustainability certificates

2. Separation
   └─> Physical fuel ≠ Environmental attributes

3. Booking
   └─> Passenger books environmental attributes
       └─> Registry: IATA Book-and-Claim

4. Claiming
   └─> Attributes claimed against specific flight
       └─> Even if physical SAF used elsewhere
```

### Data Sources

- **SAF Providers**: `data/safProjects.json`
- **Emission Factors**: `data/emissionFactors.json`
- **Singapore Mandate**: Embedded in SAF explainer

### API Endpoint

**POST** `/api/saf`

```typescript
// Request
{
  routeId: string;
  emissionsKg: number;
  contributionAmount: number;
  safType?: 'waste_based' | 'imported';
  provider?: 'neste_singapore' | 'shell_saf';
}

// Response
{
  litersAttributed: number;
  co2eAvoided: number;
  cost: number;
  ecoPointsEarned: number;
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    registry: string;
    certificateId: string;
    timestamp: string;
    provider: string;
  };
  bookAndClaimInfo: {
    explanation: string;
    benefits: string[];
    certification: string[];
  };
}
```

---

## Eco-Points Calculation Logic

### Overview

Eco-Points are awarded for sustainable actions and used to progress through Green Tiers. Higher tiers earn more points per action (tier multipliers).

### Implementation Location

**File**: `lib/rewards/ecoPoints.ts`

### Core Function

```typescript
export function calculateEcoPoints(
  input: EcoPointsInput,
  currentPoints: number = 0
): EcoPointsResult
```

### Points Rates

| Action Type | Rate | Example |
|------------|------|---------|
| SAF Contribution | 10 points/$ | $50 → 500 points |
| Carbon Offset | 5 points/$ | $50 → 250 points |
| Sustainable Merchant | 0.5 points/$ | $100 → 50 points |
| Circularity Action | Variable | Cup reuse → 30 points |

### Tier Multipliers

| Tier | Multiplier | Example (100 base points) |
|------|------------|---------------------------|
| Seedling (0-99) | 1.0x | 100 points |
| Sprout (100-499) | 1.2x | 120 points |
| Sapling (500-1,999) | 1.5x | 150 points |
| Tree (2,000-9,999) | 2.0x | 200 points |
| Forest (10,000-49,999) | 2.5x | 250 points |
| Canopy (50,000+) | 3.0x | 300 points |

### Calculation Flow

```
1. Determine Action Type
   └─> Get base points from POINTS_RATES or action definition

2. Get Current Tier
   └─> Based on currentPoints
       └─> Retrieve tier multiplier

3. Calculate Final Points
   └─> basePoints × tierMultiplier
       └─> Round to nearest integer

4. Calculate Next Tier Progress
   └─> If not at highest tier
       └─> Calculate points needed and progress %
```

### Circularity Actions

Circularity actions have fixed point values defined in `data/circularityActions.json`:

```json
{
  "id": "cup_reuse",
  "name": "Use Reusable Cup",
  "eco_points": 30,
  "waste_diverted_grams": 15
}
```

### API Endpoint

**POST** `/api/eco-points`

```typescript
// Request
{
  action: 'earn' | 'check' | 'history';
  userId: string;
  actionType?: ActionType;
  amount?: number;
  actionId?: string;
}

// Response
{
  success: boolean;
  points: {
    total: number;
    earned: number;
    tierProgress: TierProgress;
  };
  history?: Array<{
    id: string;
    actionType: string;
    points: number;
    timestamp: string;
    description: string;
  }>;
}
```

---

## Data Flow Diagrams

### Flight Calculation Flow

```
User Input (route, class)
    │
    ▼
[Flight Calculator API]
    │
    ├─> Load route data (routes.json)
    ├─> Get emission factors (emissionFactors.json)
    ├─> Calculate CO2 emissions
    ├─> Apply radiative forcing (optional)
    └─> Generate methodology info
    │
    ▼
Response: {
  emissions: number,
  emissionsWithRF: number,
  methodology: {...},
  uncertainty: {...},
  actions: {saf, offset}
}
```

### SAF Contribution Flow

```
User Input (routeId, amount)
    │
    ▼
[SAF API]
    │
    ├─> Calculate liters attributed
    ├─> Calculate CO2e avoided
    ├─> Generate verification certificate
    ├─> Calculate Eco-Points
    └─> Get Book-and-Claim info
    │
    ▼
Response: {
  litersAttributed: number,
  co2eAvoided: number,
  verification: {...},
  ecoPointsEarned: number
}
    │
    ▼
[Eco-Points API]
    │
    └─> Award points to user
        └─> Update tier progress
```

### Circularity Action Flow

```
User Action (e.g., "cup reuse")
    │
    ▼
[Circularity Action Handler]
    │
    ├─> Load action definition (circularityActions.json)
    ├─> Get Eco-Points value
    ├─> Calculate waste diverted
    └─> Log action
    │
    ▼
[Eco-Points API]
    │
    └─> Award points
        └─> Update journey summary
```

### Impact Story Generation Flow

```
User Request
    │
    ▼
[Impact Story API]
    │
    ├─> Gather journey context
    │   ├─> Flight emissions
    │   ├─> SAF contributions
    │   ├─> Circularity actions
    │   └─> Green Tier status
    │
    ├─> Build prompt for Claude
    │   └─> Include framework alignment
    │
    ├─> Call Claude API
    │   └─> Generate personalized story
    │
    └─> Return story with citations
```

---

## API Documentation

### Flight Emissions Calculation

**Endpoint**: `POST /api/calculate`

**Request**:
```typescript
{
  type: 'flight';
  routeId: string;
  travelClass?: 'economy' | 'business' | 'first';
  includeRadiativeForcing?: boolean;
  passengers?: number;
  userId?: string; // Optional, for activity logging
}
```

**Response**:
```typescript
{
  type: 'flight';
  result: {
    emissions: number;              // CO2 only (kg CO2e)
    emissionsWithRF: number;         // With RF (kg CO2e)
    perPassenger: {
      emissions: number;
      emissionsWithRF: number;
    };
  };
  methodology: {
    formula: string;
    factorsUsed: Array<{
      name: string;
      value: number;
      unit: string;
      source: string;
      citation: string;
      year: number;
    }>;
    sources: Array<{...}>;
    calculationMethod: string;
  };
  uncertainty: {
    rangePercent: number;
    min: number;
    max: number;
    explanation: string;
  };
  actions: {
    saf: {
      type: 'saf';
      priority: 1;
      description: string;
      cost: number;
      ecoPointsEarned: number;
      emissionsReduced: number;
    };
    offset: {
      type: 'offset';
      priority: 2;
      description: string;
      cost: number;
      ecoPointsEarned: number;
    };
  };
  route: {
    id: string;
    origin: string;
    destination: string;
    distanceKm: number;
    aircraftEfficiencyRating: string;
  };
}
```

### SAF Contribution

**Endpoint**: `POST /api/saf`

**Request**:
```typescript
{
  routeId: string;
  emissionsKg: number;
  contributionAmount: number;
  safType?: 'waste_based' | 'imported';
  provider?: 'neste_singapore' | 'shell_saf';
  userId?: string;
}
```

**Response**:
```typescript
{
  litersAttributed: number;
  co2eAvoided: number;
  cost: number;
  ecoPointsEarned: number;
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    registry: string;
    certificateId: string;
    timestamp: string;
    provider: string;
  };
  bookAndClaimInfo: {
    explanation: string;
    benefits: string[];
    certification: string[];
  };
}
```

### Eco-Points

**Endpoint**: `POST /api/eco-points`

**Request**:
```typescript
{
  action: 'earn' | 'check' | 'history';
  userId: string;
  actionType?: 'saf_contribution' | 'carbon_offset' | 'circularity_action' | ...;
  amount?: number;
  actionId?: string;
  tierMultiplier?: number;
}
```

**Response**:
```typescript
{
  success: boolean;
  points: {
    total: number;
    earned: number;
    tierProgress: {
      currentTier: {...};
      currentPoints: number;
      progressToNext: {
        nextTier: {...};
        pointsNeeded: number;
        progressPercent: number;
      } | null;
    };
  };
  history?: Array<{
    id: string;
    actionType: string;
    points: number;
    timestamp: string;
    description: string;
  }>;
  error?: string;
}
```

### Ask Max (AI Chat)

**Endpoint**: `POST /api/chat`

**Request**:
```typescript
{
  message: string;
  userId: string;
  journeyContext?: {
    flight?: {...};
    shopping?: {...};
    circularityActions?: Array<{...}>;
  };
  greenTierContext?: {
    currentTier: string;
    points: number;
    progressPercent: number;
  };
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

**Response**:
```typescript
{
  response: string;
  suggestions?: Array<{
    type: 'saf' | 'offset' | 'circularity' | 'tier';
    description: string;
    action?: string;
  }>;
}
```

### Impact Story Generation

**Endpoint**: `POST /api/chat` (with special prompt)

**Request**: Same as Ask Max, but with `generateImpactStory: true`

**Response**:
```typescript
{
  story: {
    title: string;
    narrative: string;
    metrics: {
      emissionsReduced: number;
      wasteDiverted: number;
      pointsEarned: number;
    };
    visualizations: Array<{
      type: 'chart' | 'comparison' | 'timeline';
      data: any;
    }>;
    shareable: {
      text: string;
      image?: string; // Base64 or URL
    };
  };
  citations: Array<{
    source: string;
    citation: string;
  }>;
}
```

### Journey Summary

**Endpoint**: `GET /api/dashboard?userId={userId}`

**Response**:
```typescript
{
  journey: {
    totalEmissions: number;
    netEmissions: number;        // After SAF/offsets
    totalPoints: number;
    wasteDiverted: number;       // In grams
    hasSAF: boolean;
    hasCircularity: boolean;
  };
  flights: Array<{
    routeId: string;
    destination: string;
    emissions: number;
    safContribution?: number;
    timestamp: string;
  }>;
  actions: Array<{
    type: string;
    description: string;
    points: number;
    timestamp: string;
  }>;
}
```

---

## Framework Alignment Decisions

### SAF-First Positioning

**Decision**: SAF contributions prioritized over offsets in UI and messaging.

**Implementation**:
- SAF option appears first in action recommendations
- SAF earns 2x Eco-Points vs. offsets (10 vs. 5 per dollar)
- Welcome message includes 2026 mandate context
- Ask Max AI prompt instructs to recommend SAF first

**Location**: 
- `lib/claude/askMax.ts` (system prompt)
- `components/customer/SAFContribution.tsx` (UI)
- `lib/telegram/messages.ts` (Telegram messaging)

### Transparency & Anti-Greenwashing

**Decision**: Never claim "carbon neutral," show methodology, cite sources, display uncertainty.

**Implementation**:
- Methodology drawer in calculator shows full calculation
- Source citations for all emission factors
- Uncertainty ranges displayed (e.g., ±5%)
- Impact stories are specific, not generic

**Location**:
- `lib/emissions/methodology.ts`
- `components/shared/MethodologyDrawer.tsx`
- `components/shared/SourceCitation.tsx`

### Planetary Boundaries Beyond Carbon

**Decision**: Track circularity actions and waste diversion, not just emissions.

**Implementation**:
- Circularity actions module tracks waste diversion
- Journey summary includes waste diverted (grams)
- Eco-Points awarded for circularity actions
- Green Tier progression rewards both carbon and circularity

**Location**:
- `lib/circularity/index.ts`
- `components/customer/CircularityActions.tsx`
- `data/circularityActions.json`

### Gamification to Address Apathy

**Decision**: Green Tier system with Eco-Points and tier multipliers.

**Implementation**:
- Six-tier system (Seedling → Canopy)
- Tier multipliers increase point earning
- Progress tracking and milestone celebrations
- Social signaling with badges

**Location**:
- `lib/rewards/ecoPoints.ts`
- `data/greenTiers.json`
- `components/customer/GreenTierStatus.tsx`

---

## Data Models

### Route Data Structure

```typescript
interface Route {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  aircraft_efficiency_rating: 'A' | 'B' | 'C';
  typical_aircraft?: string[];
}
```

### Emission Factors Structure

```typescript
interface EmissionFactors {
  factors: {
    aviation_fuel: {
      co2_per_liter: number;
      source: string;
    };
    saf_waste_based: {
      co2_per_liter: number;
      source: string;
    };
    saf_imported: {
      co2_per_liter: number;
      source: string;
    };
  };
  sources: {
    iata: {...};
    defra: {...};
  };
}
```

### Green Tier Structure

```typescript
interface GreenTier {
  id: string;
  name: string;
  level: number;
  min_eco_points: number;
  max_eco_points: number | null;
  points_multiplier: number;
  social_signaling: {
    badge_icon: string;
    color: string;
  };
}
```

---

## Error Handling

### API Error Responses

All API endpoints return consistent error format:

```typescript
{
  error: string;
  code?: string;        // Optional error code
  details?: any;        // Optional additional details
}
```

### Common Error Codes

- `MISSING_PARAMETER`: Required parameter missing
- `INVALID_ROUTE`: Route ID not found
- `CALCULATION_ERROR`: Error in calculation logic
- `AI_ERROR`: Claude API error
- `TELEGRAM_ERROR`: Telegram bot API error

---

## Performance Considerations

### Current (Demo)

- In-memory storage (sessions, points)
- JSON file reads (routes, tiers)
- No caching
- No rate limiting

### Production Recommendations

1. **Database**: PostgreSQL or MongoDB for persistence
2. **Caching**: Redis for frequently accessed data
3. **Rate Limiting**: Implement per-user rate limits
4. **CDN**: Static assets via CDN
5. **API Optimization**: Batch requests where possible
6. **AI Caching**: Cache common AI responses

---

## Security Considerations

### Current (Demo)

- No authentication (userId passed directly)
- No input validation beyond TypeScript
- No rate limiting
- Environment variables for API keys

### Production Recommendations

1. **Authentication**: JWT or OAuth 2.0
2. **Input Validation**: Zod or similar schema validation
3. **Rate Limiting**: Per-user and per-IP limits
4. **API Key Security**: Rotate keys regularly
5. **HTTPS**: Enforce HTTPS in production
6. **CORS**: Configure CORS properly
7. **SQL Injection**: Use parameterized queries
8. **XSS**: Sanitize user inputs

---

## Testing

### Current State

- No automated tests
- Manual testing only

### Recommended Test Coverage

1. **Unit Tests**: Business logic (calculations, points)
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Critical user flows
4. **AI Tests**: Mock Claude responses

---

**Last Updated**: December 2024  
**For Questions**: See [FRAMEWORK_ALIGNMENT.md](FRAMEWORK_ALIGNMENT.md) for framework decisions

