# Application Structure - At a Glance

## 🎯 Three Main Parts

```
┌─────────────────────────────────────────────────────────────┐
│                    CHANGI SUSTAINABILITY APP                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │  CUSTOMER APP    │  │  DASHBOARD        │  │ TELEGRAM │ │
│  │  (Passengers)    │  │  (Staff/Ops)      │  │   BOT    │ │
│  └──────────────────┘  └──────────────────┘  └──────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Part 1: Customer-Facing App

**Who uses it**: Passengers/travelers  
**URL**: `http://localhost:3000` (root)  
**Routes**: `/calculator`, `/journey`, `/rewards`, `/shop`, `/chat`

### Features:
- ✈️ **Flight Calculator** - Calculate carbon footprint
- 🌿 **SAF Contributions** - Contribute to Sustainable Aviation Fuel
- 📊 **Journey Summary** - View your impact
- 🏆 **Green Tier** - Loyalty program with tiers
- 🛍️ **Green Shops** - Find sustainable merchants
- 💬 **Ask Max** - AI assistant (requires API key)
- ♻️ **Circularity Actions** - Log waste reduction actions

### Key Pages:
```
/ (root)
  └─> Landing page with links to customer app and dashboard

/calculator
  └─> Flight emissions calculator with SAF-first positioning

/journey
  └─> Complete journey summary (emissions, SAF, circularity)

/rewards
  └─> Green Tier status, Eco-Points, badges

/shop
  └─> List of green-rated shops at Changi

/chat
  └─> Ask Max AI chat interface
```

---

## 📊 Part 2: Operations Dashboard

**Who uses it**: Airport staff, operations team, management  
**URL**: `http://localhost:3000/dashboard`  
**Routes**: `/dashboard`, `/dashboard/saf`, `/dashboard/circularity`

### Features:
- 📈 **Real-time Metrics** - SAF contributions, emissions, circularity
- 🎯 **SAF Progress** - Progress toward 2026 mandate (hero metric)
- 📉 **Emissions Charts** - 30-day trends
- 🗺️ **Source Breakdown** - Emissions by category
- 🛫 **Top Routes** - Routes with highest emissions
- 📋 **Export Reports** - CSV/PDF export

### Key Pages:
```
/dashboard
  └─> Main overview with SAF progress, metrics, charts

/dashboard/saf
  └─> Detailed SAF tracking and verification

/dashboard/circularity
  └─> Circularity metrics, waste diversion, terminal heatmap
```

---

## 🤖 Part 3: Telegram Bot

**Who uses it**: Passengers (via Telegram)  
**Webhook**: `http://localhost:3000/api/telegram`  
**Setup**: Requires Telegram Bot Token

### Features:
- Same features as Customer App, but via Telegram chat
- Conversational interface
- Inline keyboards for easy navigation
- Proactive nudges

### Commands:
```
/start       - Welcome message and Green Tier status
/calculate   - Calculate flight emissions
/saf         - Learn about and contribute to SAF
/journey     - View journey summary
/shop        - Find green-rated shops
/eco         - Log circularity action
/tier        - Check Green Tier status
/ask         - Ask Max anything (requires API key)
/impact      - Get personalized impact story
/help        - Show all commands
```

### Setup:
1. Create bot via @BotFather on Telegram
2. Get bot token
3. Add to `.env.local`: `TELEGRAM_BOT_TOKEN=your_token`
4. For local testing: Enable polling mode (see LOCAL_TESTING_GUIDE.md)

---

## 🔄 How They Connect

```
┌─────────────┐
│  Customer   │
│     App     │──┐
└─────────────┘  │
                 │
┌─────────────┐  │    ┌──────────────┐
│  Telegram   │──┼───▶│   Shared     │
│     Bot     │  │    │   Backend    │
└─────────────┘  │    │   (APIs)     │
                 │    └──────────────┘
┌─────────────┐  │         │
│  Dashboard  │──┘         │
└─────────────┘            │
                           ▼
                    ┌──────────────┐
                    │   Data &     │
                    │  Business    │
                    │   Logic      │
                    └──────────────┘
```

**Shared Backend**:
- `/api/calculate` - Flight emissions calculation
- `/api/saf` - SAF contribution processing
- `/api/eco-points` - Eco-Points system
- `/api/chat` - Ask Max AI chat
- `/api/dashboard` - Dashboard data
- `/api/telegram` - Telegram bot webhook

---

## 🗂️ File Structure

```
app/
├── (customer)/          # Customer-facing pages
│   ├── calculator/
│   ├── journey/
│   ├── rewards/
│   ├── shop/
│   └── chat/
│
├── dashboard/           # Operations dashboard
│   ├── page.tsx         # Main dashboard
│   ├── saf/             # SAF tracking
│   └── circularity/     # Circularity metrics
│
└── api/                 # API routes
    ├── calculate/
    ├── saf/
    ├── chat/
    ├── dashboard/
    └── telegram/
        └── webhook/

components/
├── customer/            # Customer app components
├── dashboard/           # Dashboard components
└── shared/              # Shared components

lib/
├── emissions/              # Flight emissions calculation
├── saf/                 # SAF book-and-claim
├── rewards/             # Eco-Points & Green Tier
├── claude/              # AI integration (Ask Max)
└── telegram/            # Telegram bot logic
```

---

## 🧪 Testing Order

1. **Customer App** (Start here - easiest)
   - No special setup needed
   - Test calculator, SAF contribution, journey

2. **Dashboard** (Next)
   - No special setup needed
   - Check metrics, charts, exports

3. **Telegram Bot** (Last - requires setup)
   - Need bot token
   - Set up polling or webhook
   - Test commands

---

## 📝 Quick Reference

| Part | URL | Setup Needed? |
|------|-----|---------------|
| Customer App | `http://localhost:3000` | No |
| Dashboard | `http://localhost:3000/dashboard` | No |
| Telegram Bot | Via Telegram app | Yes (bot token) |

---

**For detailed testing steps, see [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md)**  
**For quick start, see [QUICK_START.md](QUICK_START.md)**

