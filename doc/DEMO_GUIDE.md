# Demo Guide: Changi Sustainable Loyalty Ecosystem

## Demo Narrative Script

### Opening: The 2026 Compliance Story

> "In 2026, Singapore will mandate that all flights from Changi use at least 1% Sustainable Aviation Fuel. That's not just a regulatory requirement—it's a fundamental shift in how we think about aviation emissions.
>
> The offset era is ending. The SAF era is beginning.
>
> Today, I'll show you how Changi is preparing for this transition while building a sustainable loyalty ecosystem that goes beyond carbon—addressing waste, circularity, and transparency in a way no other airport can."

---

## Key Talking Points

### 1. "Offset Era Ending, SAF Era Beginning"

**The Shift:**
- Traditional carbon offsets compensate for emissions elsewhere (forests, renewable energy projects)
- SAF directly reduces aviation emissions at the source
- Singapore's 2026 mandate makes SAF a compliance requirement, not optional
- This platform positions SAF as the primary action, offsets as secondary

**What to Show:**
- Flight calculation result with SAF contribution option prominently displayed
- SAF explainer showing Book-and-Claim system
- Comparison: "SAF: 10 Eco-Points per dollar vs. Offset: 5 points per dollar"

**Key Message:**
> "We're not just offering offsets anymore. We're building the infrastructure for SAF contributions because that's where the industry is heading—and where Singapore requires us to be by 2026."

---

### 2. "Singapore 2026 Mandate Readiness"

**The Context:**
- Singapore mandates 1% SAF from 2026, scaling to 3-5% by 2030
- This platform tracks SAF contributions and prepares passengers for the transition
- Book-and-Claim system enables contributions even when physical SAF isn't on the specific flight

**What to Show:**
- Welcome message mentioning 2026 mandate
- SAF contribution flow with Book-and-Claim explanation
- Verification certificate showing IATA registry tracking

**Key Message:**
> "By 2026, every flight from Singapore will use SAF. We're giving passengers the chance to contribute now, understand the system, and be ahead of the curve."

---

### 3. "Beyond Carbon: Circularity"

**The Framework:**
- Planetary Boundaries Framework: Climate change is just one of nine boundaries
- This platform tracks waste diversion, single-use reduction, circularity actions
- Eco-Points reward both carbon actions AND circularity actions

**What to Show:**
- Circularity Actions page showing cup reuse, bag refusal, etc.
- Journey summary showing both emissions AND waste diverted
- Green Tier progression that rewards both types of actions

**Key Message:**
> "True sustainability isn't just about carbon. It's about waste, resources, biodiversity. That's why we track circularity actions—because refusing a plastic bag or using a reusable cup matters just as much as offsetting your flight."

---

### 4. "Transparency Prevents Greenwashing"

**The Problem:**
- Many carbon tools make vague claims without methodology
- Greenwashing concerns erode trust
- This platform shows sources, uncertainty ranges, and never claims "carbon neutral"

**What to Show:**
- Methodology drawer showing calculation details
- Source citations for all emission factors
- Uncertainty ranges displayed (e.g., "1,842 kg CO2e ± 5%")
- Impact story that's specific, not generic

**Key Message:**
> "We show you exactly how we calculated your emissions. We cite our sources. We acknowledge uncertainty. We never claim your flight is 'carbon neutral'—because transparency is the only way to build trust."

---

## Demo Flow: What to Show

### 1. Landing Page (30 seconds)
- **Show**: Framework alignment section, "Beyond Carbon" messaging
- **Say**: "This isn't just a calculator—it's a complete sustainability ecosystem"
- **Skip**: Deep dive into technical details

### 2. Flight Calculator (2 minutes)
- **Show**: 
  - Select route (e.g., Singapore → London)
  - Select class (Business)
  - Result showing emissions with/without radiative forcing
  - SAF contribution option prominently displayed
- **Say**: "Notice SAF is the first option, not offsets. That's intentional—we're preparing for 2026."
- **Highlight**: Methodology transparency, source citations

### 3. SAF Contribution Flow (2 minutes)
- **Show**:
  - SAF explainer with Book-and-Claim explanation
  - Contribution amount selection
  - Verification certificate generation
  - Eco-Points earned (10 per dollar)
- **Say**: "This uses IATA's Book-and-Claim system—the same standard airlines use. Your contribution is verified and tracked."
- **Highlight**: Singapore 2026 mandate context

### 4. Circularity Actions (1.5 minutes)
- **Show**:
  - List of circularity actions (cup reuse, bag refusal, etc.)
  - Log an action (e.g., "Cup reuse")
  - Points celebration
  - Waste diverted metric
- **Say**: "This is what 'beyond carbon' means. Every action that reduces waste earns points and contributes to Changi's circularity goals."
- **Highlight**: Waste diversion tracking, not just emissions

### 5. Green Tier & Journey Summary (1.5 minutes)
- **Show**:
  - Current tier status
  - Progress to next tier
  - Journey summary showing emissions + waste diverted
  - Impact story generation
- **Say**: "The Green Tier system gamifies sustainability. Higher tiers earn more points per action, creating a loyalty loop."
- **Highlight**: Complete journey view (flight + shopping + actions)

### 6. Telegram Bot (1 minute)
- **Show**:
  - `/start` command
  - `/calculate` → London → Business
  - `/saf` explainer
  - `/eco` → Cup reuse
- **Say**: "We also have a Telegram bot for conversational engagement. Same features, different interface."
- **Skip**: Deep dive into bot setup

### 7. Operations Dashboard (30 seconds - optional)
- **Show**: Real-time emissions view, SAF tracking
- **Say**: "This is what CAG teams see—real-time visibility into airport emissions and SAF contributions."
- **Skip**: Detailed drill-downs unless asked

---

## What to Skip (Unless Asked)

- **Deep technical architecture**: Keep high-level unless technical audience
- **Database schema**: Not relevant for demo
- **API endpoints**: Only show if developer audience
- **Telegram webhook setup**: Too technical for most demos
- **Payment integration details**: Mention it's simulated for demo
- **Multi-language support**: Mention it's planned, not implemented

---

## Answers to Likely Questions

### "Why SAF over offsets?"

**Answer:**
> "SAF directly reduces aviation emissions at the source. Offsets compensate elsewhere—which is valuable, but doesn't address the core problem of aviation emissions.
>
> More importantly, Singapore mandates 1% SAF from 2026. This isn't optional—it's compliance. By positioning SAF first, we're preparing passengers for that reality and building the infrastructure now.
>
> That said, we still offer offsets as a secondary option. Some passengers prefer them, and they're still valuable. But SAF is the future of aviation decarbonization."

**Supporting Points:**
- SAF reduces emissions by 80-90% vs. conventional fuel
- Book-and-Claim enables contributions even when physical SAF isn't on the flight
- IATA standard ensures no double-counting
- Higher Eco-Points reward (10 vs. 5) reflects higher impact

---

### "How does Book-and-Claim work?"

**Answer:**
> "Book-and-Claim separates the physical fuel from its environmental attributes. Here's how it works:
>
> 1. SAF is produced at a certified facility (e.g., Neste's Singapore refinery)
> 2. The SAF receives sustainability certificates proving its environmental benefits
> 3. The physical fuel and its environmental attributes are separated
> 4. You 'book' the environmental attributes (the carbon reduction)
> 5. You 'claim' those attributes against your specific flight, even if the physical SAF was used elsewhere
>
> This system is managed by IATA's Book-and-Claim Registry, which prevents double-counting. It's the same system airlines use, and it's becoming the industry standard."

**Visual Aid:**
- Show the Book-and-Claim explainer in the SAF contribution flow
- Point to the verification certificate showing IATA registry

---

### "What about greenwashing concerns?"

**Answer:**
> "Greenwashing is a real problem, and we've built transparency into every layer of this platform:
>
> **Methodology Transparency**: Every calculation shows its methodology. Click 'How we calculated this' and you'll see aircraft type, load factors, emission factors, and sources.
>
> **Source Citations**: All emission factors are cited. We use IATA, DEFRA, and academic sources—not made-up numbers.
>
> **Uncertainty Ranges**: We show uncertainty ranges (e.g., '± 5%') because we acknowledge that calculations have limitations.
>
> **No False Claims**: We never claim flights are 'carbon neutral.' We say 'climate action' or 'carbon contribution'—because transparency requires honesty.
>
> **Impact Stories**: When we generate impact stories, they're specific and verifiable. Not generic 'trees planted'—but specific projects with real outcomes."

**Show:**
- Methodology drawer with detailed calculation
- Source citations in emission factors
- Uncertainty range display
- Impact story that's specific, not generic

---

### "How accurate are these calculations?"

**Answer:**
> "We use industry-standard emission factors from IATA, DEFRA, and academic sources. For flights, we use aircraft-specific factors, not generic distance-based calculations.
>
> That said, all carbon calculations have uncertainty. We show uncertainty ranges (typically ± 5-10%) because transparency requires honesty.
>
> For shopping emissions, we use category-level factors (e.g., 'electronics average') because product-level data isn't always available. We're transparent about this limitation and show it in the methodology.
>
> The goal isn't perfect accuracy—it's credible, transparent, and actionable. We'd rather show uncertainty than pretend we know everything."

---

### "What's the difference between this and other carbon calculators?"

**Answer:**
> "Three key differentiators:
>
> **1. SAF-First Positioning**: Most calculators offer offsets. We prioritize SAF because that's where the industry is heading and where Singapore requires us to be.
>
> **2. Beyond Carbon**: We track circularity actions, waste diversion, and sustainable choices—not just emissions. That's the Planetary Boundaries Framework in action.
>
> **3. Complete Journey**: We track flight + shopping + F&B + ground transport. Most calculators only do flights. Changi's retail infrastructure (S$1.1B annually) enables this.
>
> Plus, we're building for 2026 compliance, not just current needs. That future-readiness is what sets us apart."

---

### "How does the Green Tier system work?"

**Answer:**
> "The Green Tier system gamifies sustainability through a loyalty program:
>
> - **Earn Eco-Points** through SAF contributions, offsets, and circularity actions
> - **Progress through tiers**: Seedling → Sprout → Sapling → Tree → Forest → Canopy
> - **Tier multipliers**: Higher tiers earn more points per action (e.g., Canopy tier earns 3x)
> - **Social signaling**: Badges and recognition for tier achievements
>
> It's designed to create a loyalty loop: actions → points → tier progression → more valuable actions → more points.
>
> The key insight: sustainability shouldn't feel like sacrifice. It should feel like progress."

---

### "Is this just a demo, or production-ready?"

**Answer:**
> "This is a demonstration of the concept and architecture. For production, we'd need:
>
> - Database integration (currently in-memory)
> - Payment gateway for SAF contributions
> - User authentication and account linking
> - Production webhook for Telegram bot
> - Multi-language support (currently English only)
> - Rate limiting and security hardening
>
> But the core logic, calculations, and user flows are production-ready. This demonstrates what's possible with Changi's data infrastructure."

---

## Demo Tips

### Do's
- ✅ Start with the 2026 mandate story—it creates urgency
- ✅ Show transparency features (methodology, sources) early
- ✅ Emphasize "beyond carbon" messaging
- ✅ Use real examples (London flight, cup reuse)
- ✅ Show the gamification (Green Tier, Eco-Points)
- ✅ Acknowledge limitations honestly

### Don'ts
- ❌ Don't claim it's "carbon neutral"
- ❌ Don't oversell accuracy—acknowledge uncertainty
- ❌ Don't skip the transparency features
- ❌ Don't get lost in technical details
- ❌ Don't ignore the circularity aspects
- ❌ Don't promise features that aren't implemented

---

## Closing: The Vision

> "This isn't just a carbon calculator. It's a sustainable loyalty ecosystem that:
>
> - Prepares Changi for 2026 SAF compliance
> - Addresses planetary boundaries beyond carbon
> - Builds trust through transparency
> - Engages passengers through gamification
>
> The offset era is ending. The SAF era is beginning. And Changi is ready."

---

**Last Updated**: December 2024  
**For Questions**: See [TECHNICAL.md](TECHNICAL.md) for implementation details

