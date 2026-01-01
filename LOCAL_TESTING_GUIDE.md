# Local Testing Guide - Step by Step

## 🎯 Quick Overview

This application has **3 main parts**:

1. **Customer-Facing App** (`/calculator`, `/journey`, `/rewards`, `/shop`, `/chat`) - For passengers
2. **Operations Dashboard** (`/dashboard`) - For airport staff/operations team
3. **Telegram Bot** - Conversational interface via Telegram

---

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ Node.js 18+ installed
- ✅ npm installed
- ✅ (Optional) Telegram Bot Token (for Telegram testing)
- ✅ (Optional) Anthropic API Key (for AI features like Ask Max)

---

## 🚀 Step 1: Install Dependencies

```bash
# Navigate to project directory
cd GreenMax

# Install all dependencies
npm install
```

---

## 🔧 Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required for AI features (Ask Max, Impact Stories)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Required for Telegram bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Optional - defaults to localhost:3000 in development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

**Note**: If you don't have API keys yet:
- **Anthropic API Key**: Get from https://console.anthropic.com/
- **Telegram Bot Token**: See "Telegram Bot Setup" section below

---

## 🏃 Step 3: Start the Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

---

## 🧪 Step 4: Testing Each Part

### Part 1: Customer-Facing App

**URL**: http://localhost:3000

#### Test Flow 1: Landing Page
1. Open http://localhost:3000
2. You should see:
   - Hero section with "Changi Sustainable Loyalty Ecosystem"
   - Three buttons: "Experience as Passenger", "View Operations Dashboard", "Start Demo"
   - Framework alignment section
   - Solution overview

#### Test Flow 2: Flight Calculator
1. Click **"Experience as Passenger"** or go to http://localhost:3000/calculator
2. **Select a route**: Choose a destination (e.g., London, New York, Tokyo)
3. **Select class**: Economy, Business, or First
4. **View results**: You should see:
   - Emissions calculation (with/without radiative forcing)
   - SAF contribution option (prominently displayed)
   - Methodology transparency link
5. **Try SAF contribution**: Click "Contribute to SAF" and select a percentage (25%, 50%, 75%, 100%)
6. **View receipt**: After contributing, you should see a carbon receipt

#### Test Flow 3: Journey Summary
1. Go to http://localhost:3000/journey
2. You should see:
   - Total emissions from your journey
   - SAF contributions made
   - Circularity actions logged
   - Eco-Points earned
   - Impact breakdown

#### Test Flow 4: Green Tier & Rewards
1. Go to http://localhost:3000/rewards
2. You should see:
   - Current Green Tier status (Seedling, Sprout, Sapling, etc.)
   - Progress to next tier
   - Eco-Points breakdown
   - Badges earned
   - Tier benefits

#### Test Flow 5: Green Shops
1. Go to http://localhost:3000/shop
2. You should see:
   - List of sustainable merchants
   - Carbon scores for each shop
   - Eco-Points multipliers
   - Terminal locations

#### Test Flow 6: Ask Max (AI Chat)
1. Go to http://localhost:3000/chat
2. **Note**: Requires `ANTHROPIC_API_KEY` in `.env.local`
3. Try asking:
   - "Why is SAF better than offsets?"
   - "What is book-and-claim?"
   - "How can I reduce my carbon footprint?"

#### Test Flow 7: Circularity Actions
1. From the customer app, look for circularity actions
2. Try logging actions like:
   - Cup reuse
   - Bag refusal
   - Reusable container use
3. Check that Eco-Points are awarded

---

### Part 2: Operations Dashboard

**URL**: http://localhost:3000/dashboard

#### Test Flow 1: Dashboard Overview
1. Go to http://localhost:3000/dashboard
2. You should see:
   - **SAF Progress Card** (hero metric) - Shows progress toward 2026 mandate
   - **Today's Metrics**:
     - SAF Contributions (liters)
     - Gross Emissions (tCO₂e)
     - Net Emissions (after SAF/offsets)
     - Offset Rate (%)
     - Circularity Actions
     - Waste Diverted (kg)
   - **Emissions Chart** - 30-day trend
   - **Source Breakdown** - Pie chart showing emissions by source
   - **Top Routes Table** - Routes with highest emissions

#### Test Flow 2: SAF Tracking
1. Go to http://localhost:3000/dashboard/saf
2. You should see:
   - SAF progress timeline
   - Provider breakdown
   - Route-level SAF coverage
   - Verification status

#### Test Flow 3: Circularity Metrics
1. Go to http://localhost:3000/dashboard/circularity
2. You should see:
   - Circularity actions breakdown
   - Waste diversion trends
   - Terminal heatmap
   - Participant engagement

#### Test Flow 4: Export Reports
1. On the dashboard, look for "Export Report" button
2. Click to export data (CSV/PDF format)

---

### Part 3: Telegram Bot

**Note**: The bot automatically uses **polling mode** in local development (no webhook needed!)

#### Setup (One-Time)

1. **Create a Telegram Bot**:
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` and follow prompts
   - Name: `Changi Eco Advisor`
   - Username: `carbon_max_bot` (or your choice)
   - Copy the token you receive

2. **Add Token to `.env.local`**:
   ```bash
   TELEGRAM_BOT_TOKEN=your_token_here
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```
   
   The bot will automatically start in polling mode. You should see:
   ```
   🤖 Telegram bot started in POLLING mode (local development)
   💡 For production, use webhook mode instead
   ```

#### Test Flow 1: Basic Commands
1. **Start the bot**: Send `/start` to your bot
2. You should receive:
   - Welcome message
   - Green Tier status
   - Main menu buttons

#### Test Flow 2: Calculate Flight
1. Send `/calculate` or click "✈️ Calculate Flight"
2. **Select destination**: Choose from the list (e.g., London)
3. **Select class**: Economy, Business, or First
4. **View results**: See emissions calculation with SAF-first recommendation
5. **Contribute to SAF**: Select a percentage (25%, 50%, 75%, 100%)
6. **Confirm**: Confirm the contribution

#### Test Flow 3: SAF Information
1. Send `/saf`
2. You should see:
   - SAF explainer
   - Book-and-Claim explanation
   - Singapore 2026 mandate context
   - Option to contribute

#### Test Flow 4: Circularity Actions
1. Send `/eco`
2. **Select an action**: Choose from the list (e.g., "Cup reuse")
3. You should receive:
   - Confirmation message
   - Eco-Points earned
   - Waste diverted amount

#### Test Flow 5: Green Tier Status
1. Send `/tier`
2. You should see:
   - Current tier
   - Points earned
   - Progress to next tier
   - Progress bar

#### Test Flow 6: Journey Summary
1. Send `/journey`
2. You should see:
   - Total emissions
   - Net emissions (after actions)
   - SAF contributions
   - Circularity actions
   - Eco-Points earned

#### Test Flow 7: Ask Max
1. Send `/ask Why is SAF better than offsets?`
2. **Note**: Requires `ANTHROPIC_API_KEY`
3. You should receive an AI-generated response

#### Test Flow 8: Impact Story
1. Send `/impact`
2. **Note**: Requires `ANTHROPIC_API_KEY` and some actions logged
3. You should receive a personalized impact story

---

## 🔧 Local Development with Telegram Bot

### Automatic Polling Mode (Default for Local Development)

**Good news!** The bot automatically uses polling mode when running locally. You don't need to do anything special - just:

1. Add `TELEGRAM_BOT_TOKEN` to `.env.local`
2. Run `npm run dev`
3. The bot will automatically start polling for updates

When you see this in the console:
```
🤖 Telegram bot started in POLLING mode (local development)
```

You can immediately start chatting with your bot on Telegram!

### Option: Using Webhook with ngrok (For Testing Webhooks in Production)

1. **Install ngrok**: https://ngrok.com/
2. **Start your Next.js server**: `npm run dev`
3. **Start ngrok**:
   ```bash
   ngrok http 3000
   ```
4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)
5. **Set webhook**:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://abc123.ngrok.io/api/telegram"}'
   ```

---

## ✅ Quick Test Checklist

### Customer App
- [ ] Landing page loads
- [ ] Flight calculator works
- [ ] SAF contribution flow works
- [ ] Journey summary displays correctly
- [ ] Green Tier status shows
- [ ] Green shops list displays
- [ ] Ask Max chat works (if API key set)
- [ ] Circularity actions can be logged

### Dashboard
- [ ] Dashboard overview loads
- [ ] SAF progress card displays
- [ ] Metrics show correctly
- [ ] Charts render
- [ ] SAF tracking page works
- [ ] Circularity metrics page works
- [ ] Export report works

### Telegram Bot
- [ ] `/start` command works
- [ ] `/calculate` flow works
- [ ] `/saf` command works
- [ ] `/eco` command works
- [ ] `/tier` command works
- [ ] `/journey` command works
- [ ] `/ask` command works (if API key set)
- [ ] `/impact` command works (if API key set)

---

## 🐛 Troubleshooting

### Issue: "TELEGRAM_BOT_TOKEN is not set"
**Solution**: Add `TELEGRAM_BOT_TOKEN` to `.env.local`

### Issue: "ANTHROPIC_API_KEY is not set"
**Solution**: Add `ANTHROPIC_API_KEY` to `.env.local` (only needed for AI features)

### Issue: Telegram bot not responding
**Solution**: 
- Check that `TELEGRAM_BOT_TOKEN` is set in `.env.local`
- Check the console for "Telegram bot started in POLLING mode" message
- Restart the dev server: `npm run dev`
- Make sure you're in development mode (polling is automatic)
- For production webhook, ensure webhook URL is publicly accessible

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

### Issue: API routes return 404
**Solution**: 
- Ensure you're using Next.js 14 App Router
- Check that API routes are in `app/api/` directory
- Restart the dev server

---

## 📝 Notes

1. **Data Storage**: Currently uses in-memory storage. Data resets on server restart.
2. **Payments**: SAF contributions are simulated (no actual payment processing).
3. **AI Features**: Require Anthropic API key. Without it, Ask Max and Impact Stories won't work.
4. **Telegram Bot**: Automatically uses polling mode in local development. For production, configure webhooks.

---

## 🎯 Recommended Testing Order

1. **Start with Customer App** (easiest, no setup needed)
   - Test calculator
   - Test SAF contribution
   - Test journey summary

2. **Then Dashboard** (no setup needed)
   - Check metrics display
   - Verify charts render

3. **Finally Telegram Bot** (requires bot token)
   - Set up bot token
   - Test basic commands
   - Test full flows

---

## 📚 Additional Resources

- **Demo Guide**: `doc/DEMO_GUIDE.md`
- **Telegram Setup**: `lib/telegram/README.md`
- **Technical Docs**: `doc/TECHNICAL.md`
- **Deployment**: `DEPLOYMENT_CHECKLIST.md`

---

**Happy Testing! 🚀**

