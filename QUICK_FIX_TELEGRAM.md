# Quick Fix: Telegram Bot Not Responding

## Most Common Issues (in order of likelihood)

### 1. ❌ TELEGRAM_BOT_TOKEN Not Set in Vercel (MOST COMMON)

**Symptoms:**
- Bot doesn't respond to any commands
- No errors visible in Telegram

**Fix:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **carbon-max**
3. Go to **Settings** → **Environment Variables**
4. Add `TELEGRAM_BOT_TOKEN` with your bot token
5. **IMPORTANT:** Make sure it's set for **Production** environment
6. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click **"..."** on the latest deployment
   - Select **"Redeploy"**
   - Wait for deployment to complete

### 2. ❌ Webhook Not Configured

**Symptoms:**
- Bot doesn't respond
- No webhook set in Telegram

**Fix:**
Run the interactive setup script:
```powershell
.\scripts\set-webhook-interactive.ps1
```

Or manually set it:
```powershell
# Replace YOUR_BOT_TOKEN with your actual token
curl -F "url=https://carbon-max.vercel.app/api/telegram" https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook
```

### 3. ❌ Wrong Webhook URL

**Symptoms:**
- Webhook is set but pointing to wrong endpoint
- Bot responds intermittently

**Fix:**
- Make sure webhook URL is: `https://carbon-max.vercel.app/api/telegram`
- **NOT** `/api/telegram/webhook` (that's a different endpoint)

### 4. ❌ Webhook Has Errors

**Symptoms:**
- Webhook is set but Telegram shows errors
- Check webhook info shows `last_error_message`

**Fix:**
1. Check webhook status:
   ```powershell
   curl https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo
   ```
2. Look at the `last_error_message` field
3. Common errors:
   - **404/Not Found**: Webhook URL is wrong
   - **500/Internal Server Error**: Check if `TELEGRAM_BOT_TOKEN` is set in Vercel
   - **Timeout**: Check Vercel function logs

## Diagnostic Steps

### Step 1: Run Diagnostic Script
```powershell
.\scripts\diagnose-telegram-bot.ps1
```

This will check:
- ✅ Bot token validity
- ✅ Webhook configuration
- ✅ Webhook endpoint accessibility
- ✅ Common configuration issues

### Step 2: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → **Logs**
2. Filter by `api/telegram`
3. Look for errors like:
   - `TELEGRAM_BOT_TOKEN is not set`
   - `Internal server error`
   - Function timeout errors

### Step 3: Verify Webhook Endpoint
Test if the endpoint is accessible:
```powershell
curl https://carbon-max.vercel.app/api/telegram
```

Expected response:
```json
{"status":"Telegram webhook is active"}
```

### Step 4: Check Webhook Status
```powershell
curl https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo
```

Look for:
- `url`: Should be `https://carbon-max.vercel.app/api/telegram`
- `pending_update_count`: Should be 0 (or low number)
- `last_error_message`: Should be empty or null

## Quick Checklist

- [ ] `TELEGRAM_BOT_TOKEN` is set in Vercel environment variables
- [ ] Environment variable is set for **Production** environment
- [ ] Application has been **redeployed** after setting environment variables
- [ ] Webhook is set to: `https://carbon-max.vercel.app/api/telegram`
- [ ] Webhook verification shows `pending_update_count: 0`
- [ ] `/api/telegram` endpoint returns `{"status":"Telegram webhook is active"}`
- [ ] No errors in Vercel function logs

## Still Not Working?

1. **Verify bot token:**
   - Make sure you're using the correct token from @BotFather
   - Token format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

2. **Test locally:**
   - The bot uses polling mode in development
   - Make sure `TELEGRAM_BOT_TOKEN` is in `.env.local`
   - Run `npm run dev` and test locally first

3. **Check for rate limiting:**
   - Telegram has rate limits
   - Wait a few minutes and try again

4. **Clear pending updates:**
   ```powershell
   # Delete webhook temporarily
   curl https://api.telegram.org/botYOUR_BOT_TOKEN/deleteWebhook
   
   # Set it again
   curl -F "url=https://carbon-max.vercel.app/api/telegram" https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook
   ```

## Useful Commands

```powershell
# Get webhook info
curl https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo

# Set webhook
curl -F "url=https://carbon-max.vercel.app/api/telegram" https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook

# Delete webhook (for local testing)
curl https://api.telegram.org/botYOUR_BOT_TOKEN/deleteWebhook

# Test endpoint
curl https://carbon-max.vercel.app/api/telegram

# Run diagnostic
.\scripts\diagnose-telegram-bot.ps1
```

