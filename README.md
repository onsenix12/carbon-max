# Changi Sustainable Loyalty Ecosystem

> A comprehensive sustainability platform that transforms Changi Airport's world-class data infrastructure into a world-class carbon transparency and engagement system.

## Project Overview

The Changi Sustainable Loyalty Ecosystem is not just a carbon calculator—it's a complete sustainability engagement platform that addresses the full passenger journey, from flight emissions to shopping choices, while preparing for Singapore's 2026 SAF mandate.

### What Makes This Different

- **SAF-First Positioning**: Sustainable Aviation Fuel contributions prioritized over offsets, aligned with Singapore's 2026 mandate
- **Beyond Carbon**: Addresses planetary boundaries including waste, circularity, and biodiversity
- **Complete Journey Tracking**: Flight emissions + shopping + F&B + ground transport
- **Gamification**: Green Tier loyalty program with Eco-Points rewards
- **Transparency**: Methodology citations, uncertainty ranges, no greenwashing claims
- **Framework-Aligned**: Built on CARBON framework principles (Context → Assets → Recipients → Behaviors → Offerings → Next)

### Core Capabilities

1. **Enhanced Passenger Calculator**: Aircraft-specific emissions with SAF attribution
2. **SAF Book-and-Claim**: IATA-aligned contribution tracking and verification
3. **Circularity Actions**: Waste diversion tracking beyond carbon
4. **Green Tier Program**: Gamified loyalty system with tier progression
5. **Impact Stories**: AI-generated personalized narratives
6. **Telegram Bot**: Conversational interface for sustainability engagement
7. **Operations Dashboard**: Real-time emissions visibility for airport teams

## Framework Alignment Summary

This project follows the **CARBON Framework** (Context → Assets → Recipients → Behaviors → Offerings → Next):

| Stage | Key Insight | Implementation |
|-------|-------------|----------------|
| **Context** | World's Best Airport (experience) but ACA Level 3 (carbon) | SAF-first positioning, 2026 mandate readiness |
| **Assets** | 366K flights, 13M+ transactions, Changi App ecosystem | Leveraged for accuracy and differentiation |
| **Recipients** | Passengers, business partners, CAG teams | Multi-segment solution with distinct interfaces |
| **Behaviors** | Journey touchpoints from check-in to post-departure | Interventions at key moments |
| **Offerings** | Four pillars: Calculator, Stakeholder Platform, Dashboard, Merchant Module | Pillar 4 (Merchant) as competitive moat |
| **Next** | 24-month roadmap to ACA Level 4 | Phased delivery with clear milestones |

**Reference**: See [doc/CARBON_Framework.md](doc/CARBON_Framework.md) for full framework documentation.

## Key Features

### SAF-First Approach
- SAF contributions prioritized over offsets
- Book-and-Claim system with IATA registry tracking
- Singapore 2026 mandate context integrated
- 10 Eco-Points per dollar (vs. 5 for offsets)

### Planetary Boundaries Framework
Beyond carbon emissions:
- **Climate Change**: SAF, offsets, emissions tracking
- **Novel Entities**: Waste diversion, single-use reduction
- **Biodiversity**: Plant-based meals, sustainable merchants

### Transparency & Anti-Greenwashing
- Methodology citations for all calculations
- Uncertainty ranges displayed
- Never claims "carbon neutral" flights
- Source attribution for all emission factors

### Gamification
- **Green Tier System**: Seedling → Sprout → Sapling → Tree → Forest → Canopy
- **Eco-Points**: Earned through SAF, offsets, circularity actions
- **Tier Multipliers**: Higher tiers earn more points per action
- **Progress Tracking**: Visual progress bars and milestone celebrations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **Charts**: Recharts
- **AI Integration**: Anthropic Claude (Ask Max, Impact Stories)
- **Telegram Bot**: node-telegram-bot-api
- **State Management**: React Context API

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Telegram Bot Token (for Telegram bot features)
- Anthropic API Key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GreenMax
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your values (see [Environment Variables](#environment-variables) below).

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required

```bash
# Anthropic Claude API (for Ask Max and Impact Stories)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Telegram Bot (for Telegram bot features)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### Optional

```bash
# Base URL for API calls (defaults to localhost:3000 in dev)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### Getting API Keys

1. **Anthropic API Key**:
   - Sign up at https://console.anthropic.com/
   - Create an API key
   - Add to `.env.local` as `ANTHROPIC_API_KEY`

2. **Telegram Bot Token**:
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` and follow prompts
   - Copy the token and add to `.env.local` as `TELEGRAM_BOT_TOKEN`
   - See [Telegram Bot Setup](docs/setup/telegram-bot.md) for full setup

## Project Structure

```
GreenMax/
├── app/                    # Next.js App Router
│   ├── (customer)/        # Customer-facing pages
│   │   ├── calculator/   # Flight emissions calculator
│   │   ├── journey/      # Journey summary
│   │   ├── rewards/       # Green Tier & Eco-Points
│   │   └── shop/          # Green-rated shops
│   ├── api/               # API routes
│   │   ├── calculate/    # Flight emissions API
│   │   ├── saf/          # SAF contribution API
│   │   ├── eco-points/   # Eco-Points API
│   │   ├── chat/         # Ask Max API
│   │   └── telegram/     # Telegram webhook
│   └── dashboard/         # Operations dashboard
├── components/            # React components
│   ├── customer/         # Customer-facing components
│   ├── dashboard/       # Dashboard components
│   └── ui/              # Shared UI components
├── lib/                  # Core business logic
│   ├── emissions/       # Flight emissions calculation
│   ├── saf/            # SAF Book-and-Claim
│   ├── rewards/       # Eco-Points & Green Tier
│   ├── circularity/   # Circularity actions
│   ├── claude/        # AI integration
│   └── telegram/      # Telegram bot
├── data/                # JSON data files
│   ├── routes.json     # Flight routes
│   ├── emissionFactors.json
│   ├── safProjects.json
│   ├── circularityActions.json
│   └── greenTiers.json
└── doc/                 # Documentation
    ├── CARBON_Framework.md
    ├── Solution.md
    └── Customer_Journeys.md
```

## Documentation

All documentation has been consolidated in the **[docs/](docs/)** folder for easy access.

### Quick Links

**Getting Started:**
- **[Quick Start Guide](docs/getting-started/QUICK_START.md)** - Get up and running in 5 minutes
- **[Local Testing Guide](docs/getting-started/LOCAL_TESTING_GUIDE.md)** - Step-by-step testing instructions

**Setup & Configuration:**
- **[Telegram Bot Setup](docs/setup/telegram-bot.md)** - Complete Telegram bot configuration
- **[Webhook Setup](docs/setup/WEBHOOK_SETUP.md)** - Telegram webhook configuration

**Project Documentation:**
- **[DEMO_GUIDE.md](doc/DEMO_GUIDE.md)**: Demo narrative, talking points, and Q&A
- **[TECHNICAL.md](doc/TECHNICAL.md)**: Architecture, implementation details, API documentation
- **[FRAMEWORK_ALIGNMENT.md](doc/FRAMEWORK_ALIGNMENT.md)**: How we addressed framework recommendations

**For troubleshooting and deployment guides, see the [docs/](docs/) folder.**

## Development

### Running Locally

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Key Concepts

### SAF Book-and-Claim
Allows passengers to claim environmental benefits of SAF even when physical fuel isn't used on their specific flight. See [lib/saf/bookAndClaim.ts](lib/saf/bookAndClaim.ts) for implementation.

### Eco-Points System
Gamified rewards for sustainable actions:
- SAF contribution: 10 points per dollar
- Carbon offset: 5 points per dollar
- Circularity actions: Variable points per action
- Tier multipliers: Higher tiers earn more

### Green Tier Progression
- **Seedling** (0-99 points): 1x multiplier
- **Sprout** (100-499): 1.2x multiplier
- **Sapling** (500-1,999): 1.5x multiplier
- **Tree** (2,000-9,999): 2x multiplier
- **Forest** (10,000-49,999): 2.5x multiplier
- **Canopy** (50,000+): 3x multiplier

## Deployment

### Production Deployment

The application is deployed on Vercel at:
- **Production URL**: https://changi-carbon.vercel.app
- **Telegram Bot**: t.me/carbon_max_bot

### Quick Links

- **Landing Page**: https://changi-carbon.vercel.app
- **Customer App**: https://changi-carbon.vercel.app/customer
- **Dashboard**: https://changi-carbon.vercel.app/dashboard
- **Demo Mode**: https://changi-carbon.vercel.app/?demo=true&step=1

### Deployment Checklist

For detailed deployment instructions, environment variables, and post-deployment verification, see **[Deployment Checklist](docs/deployment/DEPLOYMENT_CHECKLIST.md)**.

Key deployment steps:
1. Set environment variables on Vercel (ANTHROPIC_API_KEY, TELEGRAM_BOT_TOKEN, NEXT_PUBLIC_APP_URL)
2. Configure Telegram webhook to point to production URL
3. Test all features in production
4. Verify SAF-first positioning
5. Create shareable links for demos

## Contributing

This is a demonstration project. For production deployment:

1. Replace in-memory storage with a database (PostgreSQL, MongoDB, etc.)
2. Implement proper user authentication
3. Add payment gateway integration for SAF contributions
4. Set up production webhook for Telegram bot
5. Add rate limiting and security measures
6. Implement proper error logging and monitoring

## License

[Add your license here]

## Acknowledgments

- Built using the CARBON Framework methodology
- SAF data aligned with IATA Book-and-Claim standards
- Emission factors from IATA, DEFRA, and academic sources
- Framework alignment with Singapore 2026 SAF mandate

---

**Last Updated**: January 2026  
**Version**: 0.1.0  
**Status**: Production Ready

