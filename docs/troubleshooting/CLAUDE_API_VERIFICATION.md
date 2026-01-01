# Claude API Verification Guide

This guide helps you verify that your app is actually using the Claude API instead of hardcoded mock responses.

## Quick Check

### 1. Check if API Key is Set

**Local Development:**
```bash
# Check if .env.local exists and contains ANTHROPIC_API_KEY
cat .env.local | grep ANTHROPIC_API_KEY
```

**Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `ANTHROPIC_API_KEY` is set for your environment (Production/Preview/Development)

### 2. Check Server Logs

When you use the Ask Max feature, check your server console/logs. You should see one of these messages:

#### ✅ API is Working:
```
[AskMax] ✅ Attempting to call Claude API with model: claude-3-5-sonnet-20241022
[AskMax] ✅ Successfully received response from Claude API
```

#### ⚠️ API Key Not Set:
```
[AskMax] ⚠️ ANTHROPIC_API_KEY not set in environment variables - using mock responses
[AskMax] To use Claude API, set ANTHROPIC_API_KEY in your .env.local file
```

#### ❌ API Call Failed:
```
[AskMax] ✅ Attempting to call Claude API with model: claude-3-5-sonnet-20241022
[AskMax] ❌ Claude API request failed: Claude API error: 401 Unauthorized - ...
[AskMax] ⚠️ Falling back to mock response due to API error
```

## Testing the API

### Test 1: Web App Chat

1. Start your development server: `npm run dev`
2. Open http://localhost:3000/chat
3. Send a message like "What is SAF?"
4. Check your terminal/console for the log messages above

### Test 2: API Endpoint Directly

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is SAF?",
    "journeyContext": {
      "flight": {
        "emissions": 1000,
        "includeRF": true
      },
      "transport": [],
      "shopping": [],
      "dining": [],
      "circularity": [],
      "totalEcoPointsEarned": 0,
      "totalEmissions": 1000,
      "netEmissions": 1000,
      "totalWasteDiverted": 0
    },
    "greenTierContext": {
      "currentTier": {
        "id": "seed",
        "name": "Seed",
        "level": 1,
        "points_multiplier": 1
      },
      "totalEcoPoints": 0,
      "lifetimeEcoPoints": 0,
      "pointsToNextTier": 100,
      "progressPercent": 0
    },
    "chatHistory": []
  }'
```

Check the server logs to see if the API was called.

### Test 3: Telegram Bot

1. Send a message to your Telegram bot: `/ask What is SAF?`
2. Check your server logs for the same messages

## Common Issues

### Issue: "ANTHROPIC_API_KEY not set"

**Solution:**
1. Create `.env.local` in the project root
2. Add: `ANTHROPIC_API_KEY=sk-ant-your-key-here`
3. Restart your development server

### Issue: "401 Unauthorized"

**Possible causes:**
- Invalid API key
- API key expired or revoked
- Wrong API key format

**Solution:**
1. Verify your API key at https://console.anthropic.com/
2. Make sure the key starts with `sk-ant-`
3. Check if the key has the correct permissions

### Issue: "Network error" or "Failed to fetch"

**Possible causes:**
- No internet connection
- Firewall blocking the request
- API service is down

**Solution:**
1. Check your internet connection
2. Verify you can access https://api.anthropic.com/
3. Check Anthropic status page

### Issue: Still seeing mock responses

**Check:**
1. Are you seeing the log messages? If not, the API key might not be loaded
2. If you see "⚠️ Falling back to mock response", check the error message above it
3. Make sure you restarted the server after setting the API key

## What Changed

The app now:
- ✅ Properly logs when the API is called vs when mocks are used
- ✅ Shows clear error messages if the API call fails
- ✅ Uses the latest Anthropic API version (2024-01-01)
- ✅ Falls back to mock responses gracefully if API fails (so the app still works)

## Verification Checklist

- [ ] `.env.local` contains `ANTHROPIC_API_KEY`
- [ ] Server logs show "✅ Attempting to call Claude API" when using Ask Max
- [ ] Server logs show "✅ Successfully received response from Claude API"
- [ ] Responses are personalized and contextual (not generic mock responses)
- [ ] No error messages in logs about API failures

## Getting Help

If you're still having issues:
1. Check the server logs for specific error messages
2. Verify your API key is valid at https://console.anthropic.com/
3. Make sure you're using the latest version of the code
4. Check that your environment variables are loaded correctly

