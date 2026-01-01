# Telegram Bot Troubleshooting Guide

If your Telegram bot isn't working after deploying to Vercel, follow these steps:

## Common Issues

### 1. Bot Token Not Set in Vercel

**Symptoms:**
- Bot doesn't respond to any commands
- Vercel function logs show: "TELEGRAM_BOT_TOKEN is not set"

**Solution:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add `TELEGRAM_BOT_TOKEN` with your bot token value
5. Make sure it's set for **Production**, **Preview**, and **Development** environments
6. **Redeploy** your application (Vercel will automatically redeploy if you have auto-deploy enabled)

### 2. Webhook Not Configured

**Symptoms:**
- Bot doesn't respond to messages
- No errors in Vercel logs

**Solution:**

1. **Get your Vercel deployment URL:**
   - Find it in Vercel Dashboard → Your Project → Deployments
   - It should look like: `https://your-app.vercel.app`

2. **Set the webhook using one of these methods:**

   **Method 1: Using curl (recommended)**
   ```bash
   curl -F "url=https://your-app.vercel.app/api/telegram" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
   ```

   **Method 2: Using browser**
   Visit this URL (replace `<YOUR_BOT_TOKEN>` and `<YOUR_APP_URL>`):
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-app.vercel.app/api/telegram
   ```

   **Method 3: Using the verification script**
   ```bash
   node scripts/verify-telegram-webhook.js <YOUR_BOT_TOKEN> https://your-app.vercel.app
   ```

3. **Verify the webhook is set:**
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
   ```

   Expected response:
   ```json
   {
     "ok": true,
     "result": {
       "url": "https://your-app.vercel.app/api/telegram",
       "pending_update_count": 0
     }
   }
   ```

### 3. Wrong Webhook URL

**Symptoms:**
- Webhook is set but pointing to wrong endpoint
- Bot responds intermittently

**Solution:**
- Make sure the webhook URL is: `https://your-app.vercel.app/api/telegram`
- **NOT** `/api/telegram/webhook` (that's a different endpoint)
- Use the verification script to check: `node scripts/verify-telegram-webhook.js <TOKEN> <URL>`

### 4. Environment Variables Not Applied

**Symptoms:**
- Variables are set in Vercel but still getting errors
- Bot worked locally but not in production

**Solution:**
1. Check that environment variables are set for the correct environment (Production/Preview/Development)
2. **Redeploy** after adding/changing environment variables:
   - Go to Deployments tab
   - Click "..." on the latest deployment
   - Select "Redeploy"
3. Wait for deployment to complete
4. Test the bot again

### 5. Function Timeout

**Symptoms:**
- Bot responds slowly or times out
- Vercel logs show timeout errors

**Solution:**
- The `vercel.json` already sets `maxDuration: 30` for API routes
- If you need longer, update `vercel.json`:
  ```json
  {
    "functions": {
      "app/api/**/*.ts": {
        "maxDuration": 60
      }
    }
  }
  ```
- Note: Free tier has a 10s limit, Pro tier allows up to 60s

## Verification Steps

### Step 1: Check Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these are set:
   - `TELEGRAM_BOT_TOKEN` ✅
   - `ANTHROPIC_API_KEY` ✅ (for Ask Max feature)
   - `NEXT_PUBLIC_APP_URL` ✅ (optional, for links in bot messages)

### Step 2: Check Webhook Status

Run the verification script:
```bash
node scripts/verify-telegram-webhook.js <YOUR_BOT_TOKEN> https://your-app.vercel.app
```

Or manually check:
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

### Step 3: Test the Endpoint

Test if your webhook endpoint is accessible:
```bash
curl https://your-app.vercel.app/api/telegram
```

Expected response:
```json
{"status":"Telegram webhook is active"}
```

### Step 4: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Logs
2. Look for errors related to:
   - `TELEGRAM_BOT_TOKEN`
   - `api/telegram`
   - Function errors

### Step 5: Test the Bot

1. Open Telegram
2. Search for your bot (e.g., `@carbon_max_bot`)
3. Send `/start`
4. The bot should respond with a welcome message

## Quick Fix Checklist

- [ ] `TELEGRAM_BOT_TOKEN` is set in Vercel environment variables
- [ ] Environment variable is set for **Production** environment
- [ ] Application has been **redeployed** after setting environment variables
- [ ] Webhook is set to: `https://your-app.vercel.app/api/telegram`
- [ ] Webhook verification shows `pending_update_count: 0`
- [ ] `/api/telegram` endpoint returns `{"status":"Telegram webhook is active"}`

## Still Not Working?

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Filter by "api/telegram"
   - Look for error messages

2. **Test locally with webhook:**
   - Use ngrok to expose local server
   - Set webhook to ngrok URL temporarily
   - This helps isolate if it's a Vercel-specific issue

3. **Verify bot token:**
   - Make sure you're using the correct token from @BotFather
   - Token format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

4. **Check for rate limiting:**
   - Telegram has rate limits
   - Wait a few minutes and try again

## Getting Help

If you're still having issues:
1. Check Vercel function logs for specific error messages
2. Verify webhook status with the verification script
3. Test the endpoint directly with curl
4. Make sure all environment variables are set correctly

## Useful Commands

```bash
# Get webhook info
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo

# Set webhook
curl -F "url=https://your-app.vercel.app/api/telegram" \
  https://api.telegram.org/bot<TOKEN>/setWebhook

# Delete webhook (for local testing with polling)
curl https://api.telegram.org/bot<TOKEN>/deleteWebhook

# Test endpoint
curl https://your-app.vercel.app/api/telegram

# Verify setup (using script)
node scripts/verify-telegram-webhook.js <TOKEN> https://your-app.vercel.app
```

