# Solution: Changi Airport Carbon Calculator

## Vision

A carbon measurement platform that matches Changi's operational sophistication—turning world-class data infrastructure into world-class carbon transparency.

---

## C | Strategic Context

*Why this solution exists — linking back to the problem*

### The Performance Paradox

Changi holds the **World's Best Airport** ranking for passenger experience (12 consecutive years). For carbon management, it holds **ACA Level 3** — a mid-tier certification surpassed by Hong Kong (Level 4), Schiphol (Level 5), and multiple Indian airports.

**The gap isn't capability — it's tooling.**

| What CAG Has | What CAG Uses |
|--------------|---------------|
| Real-time aircraft tracking (366,000 movements/year) | 4-input distance-based calculator |
| SMART meters tracking 260,181 MWh | Manual spreadsheet aggregation |
| 13M+ POS transactions annually | No consumption footprint tracking |
| Changi App with millions of users | No carbon integration |

### Forcing Functions

| Pressure | Timeline | Implication |
|----------|----------|-------------|
| Singapore SAF mandate | 1% from 2026, 3-5% by 2030 | Must track SAF attribution |
| Net-zero commitment | 2050 | Must measure all 582,414 tCO2e |
| ACA Level 4 requirements | Ongoing | Must demonstrate Scope 3 engagement |
| Passenger climate awareness | Growing | Must provide credible transparency |

### Stakes

| If We Build This | If We Don't |
|------------------|-------------|
| ACA Level 4 certification | Stuck at Level 3 while peers advance |
| SAF mandate readiness | Reactive compliance scramble |
| Brand coherence (experience + sustainability) | Credibility gap widens |
| Net-zero pathway visibility | 2050 commitment lacks foundation |
| Data assets utilized | Infrastructure investment stranded |

**Reference:** [Problem.md]

---

## A | Assets Leveraged

*What makes CAG uniquely positioned to build this*

### Data Assets Deployed

| Asset | Scale | Solution Use |
|-------|-------|--------------|
| Flight tracking systems | 366,000 movements/year | Aircraft-specific emissions (Pillar 1) |
| SMART energy meters | 260,181 MWh tracked | Real-time Scope 2 monitoring (Pillar 3) |
| POS transactions | 13M+ annually | Shopping carbon attribution (Pillar 4) |
| Changi App users | Millions of profiles | Personalized carbon receipts (Pillar 1 & 4) |
| Tenant electricity metering | Per-outlet | Tenant benchmarking (Pillar 2) |
| Aircraft taxi tracking | Real-time | Taxi time emissions (Pillar 2) |

### Infrastructure Leveraged

- **Existing:** Flight ops systems, building management, centralized POS, Changi App, Changi Rewards, Carbon Clicks partnership
- **Extended:** Smart meter data pipelines, API integrations, app feature modules

### Position Advantage

> "Changi is a destination airport, not just a transit hub. With S$1.1B in retail, 50M Jewel visitors, and passengers who arrive early to shop and dine — we can measure consumption emissions that operational airports cannot."

**The moat:** Pillars 1-3 can be copied. Pillar 4 requires Changi's retail infrastructure, transaction volume, and destination positioning.

---

## R | Recipients Served

*Who we're solving for and what success looks like*

| Segment | Primary Need | Success Looks Like |
|---------|--------------|-------------------|
| **CAG Sustainability Team** (Primary) | Accurate data, automated compliance, strategic visibility | ACA Level 4 achieved; board reports in hours, not weeks; Scope 3 measured, not estimated |
| **Business Partners** (Secondary) | Simple reporting, peer benchmarking, recognition | Onboarding in 30 minutes; see own performance vs. peers; recognized for improvements |
| **Passengers** (Tertiary) | Transparency, credible offsets, agency over footprint | Understand their footprint; trust the numbers; feel agency through offset/SAF choice |

### Needs vs. Wants

| Segment | Says They Want | Actually Needs |
|---------|----------------|----------------|
| Sustainability Manager | "Better spreadsheets" | Automated data aggregation, real-time visibility |
| Business Partner | "Less reporting burden" | Self-service portal, clear value exchange |
| Passenger | "Simple offset option" | Trustworthy calculation, proof of impact |

**Reference:** [Problem.md — Customer Segments]

---

## B | Behaviors Addressed

*Where the solution intervenes in user journeys*

### Passenger Journey Touchpoints

| Journey Stage | Current Pain | Solution Intervention | Pillar |
|---------------|--------------|----------------------|--------|
| Pre-departure | No carbon info at check-in | Flight estimate in Changi App | P1 |
| Transit to airport | Transport choice invisible | Mode comparison with CO2 savings | P4 |
| Shopping & F&B | Consumption untracked | Transaction-linked carbon attribution | P4 |
| Post-departure | No follow-up, moment lost | Carbon receipt with action options | P1 + P4 |
| Ongoing relationship | Starts from zero each trip | Annual profile, progress tracking | P1 + P4 |

### Sustainability Manager Journey Touchpoints

| Journey Stage | Current Pain | Solution Intervention | Pillar |
|---------------|--------------|----------------------|--------|
| Annual planning | 6+ spreadsheets, 2 weeks prep | Unified dashboard, 2 days | P3 |
| Partner onboarding | Email-based, low response | Self-service portal, auto-validation | P2 |
| Quarterly monitoring | 2-3 month data lag | Real-time alerts, auto-reports | P3 |
| ACA submission | 3-week scavenger hunt | Auto-generated compliance package | P2 + P3 |
| Tenant engagement | Anecdotal, no data to share | Benchmarking dashboard, recognition | P2 + P4 |

**Reference:** [Customer_Journeys.md]

---

## O | Offerings

*What we're building — the four-pillar solution*

### Solution Architecture

The Changi Carbon Calculator is a four-pillar product that addresses each customer segment's core problem:

| Pillar | Segment Served | Problem Solved |
|--------|----------------|----------------|
| **Enhanced Passenger Calculator** | Passengers | Opaque, generic calculations → Aircraft-specific, transparent, actionable |
| **Stakeholder Emissions Platform** | Business Partners | No standardized reporting → Collaborative platform with benchmarking |
| **Operations Dashboard** | CAG Internal Teams | Manual aggregation, no real-time visibility → Integrated command center |
| **Merchant & Activity Module** | Passengers + Tenants | Flight-only footprint → Complete journey emissions including shopping, F&B, transport |

These pillars share a common data backbone but serve distinct users with distinct interfaces.

---

## Pillar 1: Enhanced Passenger Calculator

**What it replaces:** The current Changi Carbon Offsets tool (4 inputs, generic factors, offset-only)

**What it becomes:** The most accurate airport-branded passenger carbon calculator in the industry

### Core Features

**Aircraft-Specific Calculations**
- Integrate CAG's flight tracking data to identify actual aircraft types per route
- Partner with IATA CO2 Connect for airline-specific load factors and fuel efficiency
- Move from generic distance-based factors to flight-specific emissions

**Transparency Layer**
- Show passengers the calculation methodology, not just the number
- Display: aircraft type, assumed load factor, emission factor source, radiative forcing toggle
- "How we calculated this" expandable section for informed users

**Radiative Forcing Toggle**
- Default: CO2-only calculation (conservative, ICAO-aligned)
- Optional: 1.9x multiplier for full climate impact (contrails, NOx, high-altitude effects)
- Educational tooltip explaining non-CO2 effects

**SAF Attribution**
- Alongside traditional offsets, offer SAF contribution option
- Track and display SAF uptake by airline/route where data available
- Prepare for Singapore's 2026 SAF mandate (1% requirement)
- Position Changi as first airport offering SAF attribution in passenger calculator

**Changi App Integration**
- Carbon "receipt" added to trip summary post-flight
- Personal carbon tracking: annual footprint, flight history, cumulative offsets
- Gamification: badges for offset milestones, SAF contributions
- Push notification prompting offset/SAF purchase after departure

**Comparison Tools**
- "Your flight vs. average for this route"
- "Your annual flying vs. Singapore average"
- Route alternatives: "If you flew [alternative route], emissions would be X"

### Data Requirements

| Data | Source | Availability | Priority |
|------|--------|--------------|----------|
| Aircraft type by flight | CAG flight tracking systems | High | P0 |
| Route schedules | OAG, CAG operations | High | P0 |
| Airline load factors | IATA CO2 Connect partnership | Requires negotiation | P1 |
| SAF uptake by flight | Airline self-reporting | Very low | P2 |
| Passenger itineraries | Changi App check-in | Moderate | P1 |

### Success Metrics

- Calculator accuracy vs. IATA CO2 Connect benchmark (target: <5% variance)
- Offset/SAF conversion rate (baseline: current Changi Carbon Offsets rate)
- Changi App engagement lift from carbon features
- Passenger NPS on carbon transparency

---

## Pillar 2: Stakeholder Emissions Platform

**What it replaces:** Manual, ad-hoc emissions collection from business partners

**What it becomes:** A multi-stakeholder platform modeled on Hong Kong's Carbon Audit System (CAS)

### Core Features

**Partner Onboarding Portal**
- Self-service registration for airlines, ground handlers, tenants, logistics providers
- Standardized emissions reporting templates (GHG Protocol-aligned)
- Free access for all partners (following HKIA model)
- Tiered permissions: view own data, view anonymized benchmarks, view aggregate airport data

**Emissions Data Collection**
- Ground Service Equipment (GSE): fuel consumption, electrification status
- Tenant energy: electricity, gas, refrigerants (linked to CAG billing data where available)
- Airline ground operations: APU usage, taxi times, turnaround emissions
- Catering and cargo: delivery vehicle emissions, cold chain energy

**Automated Data Ingestion**
- API connections for partners with mature systems
- CSV upload for partners with basic reporting
- Smart meter integration for tenant electricity (already exists)
- Aircraft tracking integration for taxi time calculations

**Benchmarking Dashboard**
- Partner performance vs. peer group (anonymized)
- Trend lines: monthly, quarterly, annual
- Intensity metrics: emissions per passenger handled, per square meter, per movement
- Leaderboard for gamification (opt-in)

**Reduction Target Tracking**
- Partners set voluntary reduction targets
- Progress tracking against targets
- Recognition program for high performers
- Alignment with CAG's 2030/2050 targets

**ACA Compliance Module**
- Automated data aggregation for ACA Level 3/4 reporting
- Third-party verification workflow support
- Gap analysis: "What's needed for Level 4 progression"
- Stakeholder engagement documentation for ACI audits

### Data Requirements

| Data | Source | Availability | Priority |
|------|--------|--------------|----------|
| Tenant electricity | CAG smart meters / billing | High | P0 |
| GSE fuel consumption | Ground handler reporting | Low (requires partner buy-in) | P1 |
| Airline APU usage | Airline reporting / tracking | Low | P2 |
| Taxi times | CAG aircraft tracking | High | P0 |
| Refrigerant leakage | Tenant reporting | Very low | P3 |

### Stakeholder Adoption Strategy

**Phase 1: Anchor Partners**
- Onboard 5-10 largest partners (top airlines, primary ground handler, major retail tenants)
- Offer hands-on support for data integration
- Use as proof points for broader rollout

**Phase 2: Scaled Rollout**
- Self-service onboarding for remaining partners
- Mandatory reporting tied to lease/license renewals (long-term)
- Integration into CAG's Changi Airport Community platform

**Phase 3: Incentive Alignment**
- Preferential treatment for high-performing partners (e.g., slot allocation, marketing support)
- Public recognition in CAG sustainability reports
- Potential carbon pricing pass-through for laggards

### Success Metrics

- Partner adoption rate (target: 29+ partners, matching HKIA)
- Data completeness: % of Scope 3 emissions measured vs. estimated
- ACA Level 4 certification achieved
- Partner-reported reductions (aggregate tCO2e)

---

## Pillar 3: Operations Dashboard

**What it replaces:** Spreadsheet-based emissions tracking, siloed data systems, periodic reporting

**What it becomes:** Real-time command center for CAG sustainability teams

### Core Features

**Unified Emissions View**
- Single dashboard consolidating Scope 1, 2, and 3 emissions
- Real-time updates where data feeds allow (terminal energy, aircraft movements)
- Drill-down: airport-wide → terminal → zone → source

**Target Tracking**
- Progress against 20% Scope 1&2 reduction by 2030
- Trajectory modeling: "At current rate, we'll hit target in [year]"
- Net-zero 2050 pathway visualization
- Alerts when off-track

**Scenario Planning**
- "What if" modeling for interventions
- Example: "If we electrify 50% of GSE, Scope 3 drops by X"
- SAF uptake scenarios: impact of 1%, 3%, 5% SAF on total footprint
- Terminal expansion emissions impact

**Regulatory Compliance**
- SAF mandate tracker: current uptake vs. 2026 requirement
- ACA certification status and renewal timeline
- GRI/CDP reporting data export
- ISO 14064 verification workflow

**Anomaly Detection**
- Automated alerts for unusual emissions spikes
- Tenant outlier identification
- Aircraft taxi time anomalies (potential efficiency opportunities)

**Reporting Automation**
- One-click ACA submission data package
- Automated sustainability report data tables
- Board-ready executive summary generation
- Benchmarking vs. HKIA, Schiphol, Dubai (where public data available)

### Data Requirements

| Data | Source | Availability | Priority |
|------|--------|--------------|----------|
| Terminal electricity | SMART meters | High (real-time) | P0 |
| Vehicle fleet fuel | CAG operations | High | P0 |
| Aircraft movements | CAG tracking systems | High (real-time) | P0 |
| Stakeholder emissions | Pillar 2 platform | Dependent on adoption | P1 |
| SAF delivery data | Fuel suppliers / airlines | Low | P2 |

### Success Metrics

- Time to generate ACA submission (target: 80% reduction vs. current)
- Data latency: hours from source to dashboard
- Forecast accuracy: predicted vs. actual annual emissions
- Executive engagement: dashboard usage by leadership

---

## Pillar 4: Merchant & Activity Emissions Module

**What it replaces:** Nothing — this capability doesn't exist at any airport

**What it becomes:** The first airport carbon tool that tracks passenger consumption emissions, not just flight emissions

### The Opportunity

Changi isn't just a transit point — it's a destination. With S$1.1 billion in annual retail sales, 13+ million transactions, and 50 million Jewel visitors (20 million non-passengers), Changi has merchant data that operational airports simply don't possess.

This data flows through centralized systems:
- POS transactions across 400+ retail and F&B outlets
- Changi Pay and Changi App purchase tracking
- Jewel tenant sales reporting
- Duty-free purchase records linked to passenger itineraries

**The insight:** A passenger's airport carbon footprint isn't just their flight. It's the luxury watch they bought, the steak they ate, the rideshare to the terminal. Changi can measure this. No one else can.

---

### Core Features

**Transaction-Based Carbon Attribution**

- Map POS categories to emission factors (e.g., electronics, cosmetics, F&B, fashion)
- Calculate embedded carbon for purchases using product-category averages
- Link transactions to passenger profiles via Changi App / Changi Rewards
- Generate "shopping footprint" alongside flight footprint

**Category Emission Factors**

| Category | Approach | Data Source |
|----------|----------|-------------|
| Electronics | Product-level factors where available; category average otherwise | Manufacturer data, academic LCA studies |
| Fashion/Luxury | Material-based estimation (leather, textiles, metals) | DEFRA, Higg Index |
| F&B | Ingredient-based calculation, food miles for premium dining | WRAP, academic research |
| Cosmetics | Weight-based category factors | Industry averages |
| Alcohol/Tobacco | Product-specific where available | Supplier data |

**F&B Deep Dive**

Changi's F&B operation is substantial — from hawker fare to fine dining. The module tracks:
- Menu item carbon intensity (beef vs. chicken vs. plant-based)
- Food miles for imported ingredients (relevant for premium restaurants)
- Food waste emissions by outlet (linked to CAG's food waste reduction program)
- Benchmarking: "This outlet's carbon per meal vs. terminal average"

**Ground Transport Attribution**

- Taxi/rideshare emissions based on pickup zone and destination
- MRT vs. bus vs. private car comparison
- Integration with Changi App trip planning
- "You chose MRT — you saved X kg CO2 vs. taxi"

**Lounge & Amenity Usage**

- Lounge carbon footprint (energy, F&B, amenities)
- Shower/spa facility usage
- Transit hotel stays
- Per-passenger attribution based on access records

**Jewel-Specific Module**

Jewel is unique: 50 million annual visitors, 20 million of whom aren't flying. This requires separate treatment:
- Visitor carbon footprint (transport to Jewel, consumption, dwell time)
- Non-passenger vs. passenger segmentation
- Attraction-specific emissions (Rain Vortex energy, Canopy Park operations)
- Event emissions for Jewel-hosted activities

---

### Passenger-Facing Features

**Shopping Carbon Receipt**

After purchase (or at end of trip), passengers see:
- Total shopping footprint in kg CO2e
- Breakdown by category
- Comparison: "Your purchases vs. average traveler on this route"
- Offset option for shopping emissions (separate from flight offset)

**"Green Shopping" Nudges**

- Highlight lower-carbon alternatives in Changi App
- Partner with tenants offering sustainable products
- Badges/rewards for low-carbon shopping choices
- Integration with Changi Rewards program

**Complete Trip Footprint**

Combine all emissions into unified view:
- Flight emissions (Pillar 1)
- Shopping emissions (Pillar 4)
- F&B emissions (Pillar 4)
- Ground transport (Pillar 4)
- "Your total Changi journey: X kg CO2e"

---

### Tenant-Facing Features

**Carbon Intensity Benchmarking**

- Each tenant sees their carbon per S$ revenue
- Comparison to category peers (anonymized)
- Trend tracking: improving or worsening?
- Identification of hotspots (e.g., high-emission menu items, energy-intensive displays)

**Reduction Recommendations**

- "Switch to LED displays: estimated X kg CO2e/year savings"
- "Offer plant-based menu options: reduce F&B intensity by Y%"
- "Source from regional suppliers: reduce food miles by Z%"

**Sustainability Certification Pathway**

- Tiered recognition: Bronze, Silver, Gold, Platinum
- Public badging in Changi App and wayfinding
- Marketing support for high performers
- Alignment with CAG's tenant sustainability requirements

---

### Data Requirements

| Data | Source | Availability | Priority |
|------|--------|--------------|----------|
| POS transactions (category, value) | Changi merchant systems | High | P0 |
| Product-level detail | Tenant reporting / SKU data | Low | P2 |
| Changi App purchase linking | Changi Rewards / App | Moderate | P1 |
| F&B menu composition | Tenant self-reporting | Low | P2 |
| Ground transport mode | Changi App / survey | Moderate | P1 |
| Lounge access records | Lounge operators | Moderate | P2 |
| Jewel visitor counts | Jewel operations | High | P1 |

### Key Challenge: Emission Factor Accuracy

Transaction data is available; carbon factors are the hard part. Approach:

**Phase 1:** Category-level factors (e.g., "electronics" average, not product-specific)
**Phase 2:** Sub-category refinement (e.g., "smartphones" vs. "laptops")
**Phase 3:** Product-level where suppliers provide data (premium brands first)

Transparency is critical: show passengers the methodology and acknowledge uncertainty ranges.

---

### Success Metrics

- Transaction coverage: % of POS volume with carbon attribution
- Passenger engagement: % of Changi App users viewing shopping footprint
- Tenant participation: % of tenants accessing benchmarking dashboard
- Offset conversion: shopping emissions offset rate
- Behavioral shift: measurable change in ground transport mode share

---

### Differentiation: Why This Wins

### vs. Generic Calculators (ICAO, MyClimate)

| Generic Tools | Changi Solution |
|---------------|-----------------|
| Distance-based factors | Aircraft-specific calculations using CAG's tracking data |
| Assumed load factors | Actual load factors via IATA CO2 Connect |
| CO2 only | Radiative forcing toggle for full climate impact |
| Offset only | SAF attribution option |
| Standalone tool | Integrated into Changi App ecosystem |
| Flight emissions only | Complete journey: flight + shopping + F&B + transport |

### vs. HKIA Carbon Audit System

| HKIA CAS | Changi Solution |
|----------|-----------------|
| Stakeholder platform only | Four pillars: passenger, stakeholder, operations, merchant |
| Flight emissions not integrated | Flight-specific data from CAG's tracking infrastructure |
| No retail/F&B module | S$1.1B retail operation with transaction-level carbon tracking |
| No passenger consumption tracking | Shopping footprint linked to Changi App profiles |
| Hong Kong-specific | Potential for licensing to other airports |

### vs. Airline Carbon Tools (IATA CO2 Connect)

| Airline Tools | Changi Solution |
|---------------|-----------------|
| Flight-focused only | Airport activity included (retail, ground transport, dwell time) |
| Airline-branded | Airport-branded, neutral across all carriers |
| No stakeholder aggregation | Multi-partner platform for Scope 3 |
| No regulatory alignment | Built for ACA certification and SAF mandate |

### vs. Every Other Airport

| Other Airports | Changi Solution |
|----------------|-----------------|
| Operational focus (move passengers efficiently) | Destination focus (passengers spend, dine, experience) |
| Limited retail data | 13M+ transactions through centralized POS |
| No Jewel equivalent | 50M visitors to integrated retail/entertainment complex |
| Generic passenger calculator | Transaction-linked consumption footprint |

**The moat:** Other airports could copy the passenger calculator or stakeholder platform. They cannot copy Pillar 4 without Changi's retail infrastructure, transaction volume, and destination positioning.

---

## N | Next

*How we build, measure, and evolve*

### Phased Roadmap

### Phase 1: Foundation (Months 1-6)

**Goal:** Launch enhanced passenger calculator, establish data backbone

**Deliverables:**
- Enhanced passenger calculator replacing Changi Carbon Offsets
- Aircraft-specific calculations using existing flight tracking data
- Radiative forcing toggle
- Changi App integration (carbon receipt)
- Basic operations dashboard for internal teams

**Dependencies:**
- Flight tracking data access
- Changi App development capacity
- Carbon Clicks partnership expansion or replacement

**Exit Criteria:**
- Calculator live with >90% route coverage
- Accuracy validated against IATA benchmark
- 10,000+ calculations in first month

---

### Phase 2: Stakeholder Platform (Months 6-12)

**Goal:** Launch partner portal, begin Scope 3 data collection

**Deliverables:**
- Partner onboarding portal (self-service)
- Standardized reporting templates
- Tenant electricity integration (via smart meters)
- Taxi time emissions module
- Benchmarking dashboard (anonymized)

**Dependencies:**
- Partner buy-in from anchor tenants/airlines
- Smart meter data pipeline
- Legal review of data sharing agreements

**Exit Criteria:**
- 10+ partners actively reporting
- 50% of tenant electricity consumption tracked
- ACA Level 4 gap analysis complete

---

### Phase 3: Merchant & Activity Module (Months 12-18)

**Goal:** Launch Pillar 4, complete SAF integration, establish Changi's unique differentiator

**Deliverables:**
- Transaction-based carbon attribution (category-level factors)
- Shopping carbon receipt in Changi App
- Ground transport emissions calculator
- Tenant carbon intensity benchmarking dashboard
- Complete trip footprint view (flight + shopping + F&B + transport)
- SAF attribution in passenger calculator
- IATA CO2 Connect integration for load factors

**Dependencies:**
- POS data access and category mapping
- Emission factor database (DEFRA, academic sources)
- Tenant buy-in for benchmarking
- IATA partnership agreement
- Airline SAF reporting cooperation

**Exit Criteria:**
- 80%+ of retail transactions covered by carbon attribution
- Tenant benchmarking dashboard live with 50+ outlets
- SAF option live in passenger calculator
- "Complete trip footprint" feature launched

---

### Phase 4: Leadership Position (Months 18-24)

**Goal:** Achieve ACA Level 4, full operations dashboard, Jewel integration, establish Changi as reference implementation

**Deliverables:**
- Full operations dashboard with scenario planning
- ACA Level 4 certification achieved
- 29+ partners on stakeholder platform (matching HKIA)
- Jewel-specific carbon module (50M visitors)
- Product-level carbon factors for premium retail (Phase 2 of emission factor refinement)
- White-label exploration for other airports
- Public API for third-party integration

**Dependencies:**
- Sustained partner engagement
- ACI audit scheduling
- Jewel data sharing agreement
- Premium brand supplier cooperation for product-level data

**Exit Criteria:**
- ACA Level 4 certified
- Operations dashboard used weekly by sustainability team
- Jewel visitor footprint tracking live
- Recognized as peer to HKIA in industry benchmarks
- Inbound interest from other airports

---

### Investment Considerations

### Build vs. Buy vs. Partner

| Component | Recommendation | Rationale |
|-----------|----------------|-----------|
| Passenger calculator | Build | Core differentiator, needs CAG data integration |
| Stakeholder platform | Build (informed by HKIA) | No off-the-shelf solution fits; HKIA's is proprietary |
| Operations dashboard | Build on BI platform | Leverage existing CAG analytics infrastructure |
| Merchant & activity module | Build | Unique to Changi; no existing product; core differentiator |
| Emission factors (flights) | Partner (IATA, DEFRA) | Industry-standard factors, no need to reinvent |
| Emission factors (products) | Build + Partner | Start with academic/DEFRA data; refine with supplier partnerships |
| Offset projects | Partner (Carbon Clicks or expand) | Verification expertise not CAG's core competency |
| SAF procurement | Partner (airlines, fuel suppliers) | Physical SAF not CAG's role; attribution/tracking is |

### Key Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| IATA partnership fails | Medium | High | Fall back to aircraft-type factors from public data; less accurate but viable |
| Partner adoption stalls | Medium | High | Tie to lease renewals; start with anchor partners who are motivated |
| SAF data unavailable | High | Medium | Launch without SAF; add when data exists; regulatory pressure will help |
| Product emission factors inaccurate | High | Medium | Use category-level factors with transparency; refine over time; acknowledge uncertainty |
| Passenger privacy concerns (transaction tracking) | Medium | Medium | Opt-in only; anonymization; clear value exchange; align with existing Changi Rewards consent |
| Internal prioritization | Medium | High | Tie to ACA Level 4 commitment; executive sponsorship |

### Evolution Path

*Beyond the 24-month roadmap — where does this go?*

| Horizon | Timeline | Focus | Opportunity |
|---------|----------|-------|-------------|
| **H1: Core Product** | 0-24 months | Four pillars live, ACA Level 4 | Foundation established |
| **H2: Ecosystem Expansion** | 24-36 months | API for third parties, airline integrations, regional airport partnerships | Platform becomes infrastructure |
| **H3: Market Leadership** | 36-48 months | White-label licensing to other airports, SBTi pathway tool, aviation industry benchmark | Revenue diversification |
| **H4: Platform Play** | 48+ months | Regional aviation carbon data platform, regulatory reporting standard, carbon marketplace integration | Industry standard-setter |

### Gap Closure Metrics

*How we know the solution addresses the Context*

| Gap Identified (C) | Metric | Target |
|--------------------|--------|--------|
| ACA Level 3 vs. peers at Level 4+ | ACA certification level | Level 4 by Month 24 |
| Generic calculator vs. data infrastructure | Calculator accuracy vs. IATA benchmark | <5% variance |
| Scope 3 estimated vs. measured | % of Scope 3 measured directly | >70% by Month 24 |
| No stakeholder platform | Partner adoption | 29+ partners (match HKIA) |
| No consumption tracking | Transaction coverage | 80%+ of retail transactions |
| SAF mandate unready | SAF tracking capability | Live before 2026 mandate |

---

## Summary: Closing the Gap

The Changi Carbon Calculator transforms CAG's data advantage into a sustainability leadership position through four integrated pillars:

| Pillar | What It Does | Gap It Closes |
|--------|--------------|---------------|
| **1. Passenger Calculator** | Aircraft-specific emissions, SAF attribution, Changi App integration | Generic calculator → industry-leading accuracy |
| **2. Stakeholder Platform** | Self-service partner portal, benchmarking, ACA compliance automation | Manual Scope 3 estimation → measured emissions from 29+ partners |
| **3. Operations Dashboard** | Real-time visibility, scenario planning, regulatory tracking | Spreadsheet lag → live command center |
| **4. Merchant & Activity Module** | Transaction carbon, shopping receipts, ground transport | Flight-only footprint → complete journey emissions |

### CARBON Framework Alignment

| Stage | How This Solution Reflects It |
|-------|------------------------------|
| **C - Context** | Addresses the performance paradox: World's Best Airport for experience → World-class for sustainability |
| **A - Assets** | Leverages 366K flight movements, 13M+ transactions, 260K MWh tracked, Changi App ecosystem |
| **R - Recipients** | Serves CAG teams (primary), business partners (secondary), passengers (tertiary) with distinct interfaces |
| **B - Behaviors** | Intervenes at key journey touchpoints: check-in, shopping, post-departure, quarterly reporting, ACA submission |
| **O - Offerings** | Four pillars with clear differentiation; Pillar 4 as competitive moat |
| **N - Next** | 24-month roadmap to ACA Level 4; evolution path to platform/licensing play |

### The Bottom Line

Pillars 1-3 bring Changi to **parity** with leading airports like HKIA.

Pillar 4 establishes a **moat** that no operational-focused airport can replicate.

Together, they close the gap between World's Best Airport for passenger experience and world-class sustainability performance.

---

*Last updated: December 2024*
*Framework: CARBON (Context → Assets → Recipients → Behaviors → Offerings → Next)*
