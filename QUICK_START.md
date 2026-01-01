# Quick Start Guide - 5 Minutes to Running Locally

## 🚀 Fast Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env.local` File
```bash
# Copy this template and fill in your keys
ANTHROPIC_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
```

**Note**: You can skip API keys for basic testing, but some features won't work.

### 3. Start the Server
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:3000
```

---

## 🎯 What to Test

### Customer App (Passenger-Facing)
- **URL**: http://localhost:3000
- **Calculator**: http://localhost:3000/calculator
- **Journey**: http://localhost:3000/journey
- **Rewards**: http://localhost:3000/rewards
- **Shops**: http://localhost:3000/shop
- **Chat**: http://localhost:3000/chat

### Operations Dashboard (Staff-Facing)
- **URL**: http://localhost:3000/dashboard
- **SAF Tracking**: http://localhost:3000/dashboard/saf
- **Circularity**: http://localhost:3000/dashboard/circularity

### Telegram Bot
- **Setup**: Create bot via @BotFather, add token to `.env.local`
- **Test**: Send `/start` to your bot
- **Webhook**: http://localhost:3000/api/telegram

---

## 📱 Quick Test Sequence

### Customer App (2 minutes)
1. Go to http://localhost:3000
2. Click "Experience as Passenger"
3. Calculate a flight (London, Business class)
4. Contribute to SAF (50%)
5. View journey summary

### Dashboard (1 minute)
1. Go to http://localhost:3000/dashboard
2. Check SAF progress card
3. View emissions chart
4. Check top routes table

### Telegram Bot (2 minutes)
1. Create bot via @BotFather
2. Add token to `.env.local`
3. Restart server
4. Send `/start` to bot
5. Try `/calculate` → London → Business

---

## ⚡ Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Use `PORT=3001 npm run dev` |
| Telegram not working | Check token in `.env.local` |
| AI features not working | Add `ANTHROPIC_API_KEY` |
| API routes 404 | Restart dev server |

---

## 📋 What's What?

| Part | Who Uses It | URL |
|------|-------------|-----|
| **Customer App** | Passengers | `/calculator`, `/journey`, `/rewards` |
| **Dashboard** | Airport Staff | `/dashboard` |
| **Telegram Bot** | Passengers (via Telegram) | `/api/telegram` |

---

**That's it! You're ready to test.** 🎉

For detailed testing steps, see [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md)

