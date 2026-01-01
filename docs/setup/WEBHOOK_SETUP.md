# Telegram Webhook Setup & Troubleshooting Guide

## Quick Status Check

### Option 1: Use the PowerShell Script (Windows)
```powershell
.\scripts\check-webhook-status.ps1
```

### Option 2: Use the Bash Script (Linux/Mac)
```bash
./scripts/check-webhook-status.sh
```

### Option 3: Manual Check (Any Platform)
```bash
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
```

## Expected Webhook Configuration

**Correct endpoint**: `https://carbon-max.vercel.app/api/telegram`

**What you should see:**
```json
{
  "ok": true,
  "result": {
    "url": "https://carbon-max.vercel.app/api/telegram",
    "pending_update_count": 0,
    "last_error_date": null
  }
}
```

## Red Flags to Watch For

### ❌ Webhook not set
- **Symptom**: `url` is empty or null
- **Fix**: Set the webhook using `scripts/set-webhook-interactive.ps1` or:
  ```bash
  curl -F "url=https://carbon-max.vercel.app/api/telegram" \
    https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook
  ```

### ❌ Wrong endpoint
- **Symptom**: `url` ends in `/api/telegram/webhook`
- **Fix**: Update webhook to point to `/api/telegram` (not `/api/telegram/webhook`)
  ```bash
  curl -F "url=https://carbon-max.vercel.app/api/telegram" \
    https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook
  ```

### ❌ Endpoint errors
- **Symptom**: `last_error_message` has content
- **Fix**: Check the error message for specific issues:
  - SSL certificate problems → Check Vercel deployment
  - 404 errors → Verify endpoint is deployed
  - 500 errors → Check Vercel logs and environment variables

## Verify Endpoint is Live

Test the endpoint directly:
```bash
curl https://carbon-max.vercel.app/api/telegram
```

**Expected response:**
```json
{"status":"Telegram webhook is active"}
```

If you get a 404 or other error, the endpoint may not be deployed correctly.

## Vercel Environment Variables

Ensure these are set in **Vercel Dashboard → Settings → Environment Variables**:

- ✅ `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- ✅ `ANTHROPIC_API_KEY` - For Ask Max feature

**Critical**: After adding/changing environment variables, you **must redeploy** for them to take effect.

## Setting/Fixing the Webhook

### Using PowerShell Script (Recommended)
```powershell
.\scripts\set-webhook-interactive.ps1
```

### Using curl
```bash
curl -F "url=https://carbon-max.vercel.app/api/telegram" \
  https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook
```

## Common Issues Fixed

### ✅ Duplicate Route Removed
The duplicate route at `/app/api/telegram/webhook/route.ts` has been removed to avoid confusion. The correct endpoint is `/api/telegram`.

### ✅ Documentation Updated
All documentation has been updated to reference the correct endpoint `/api/telegram` instead of `/api/telegram/webhook`.

## Testing Your Bot

1. Check webhook status using one of the methods above
2. Verify endpoint is live: `curl https://carbon-max.vercel.app/api/telegram`
3. Send `/start` to your bot in Telegram
4. Check Vercel logs if the bot doesn't respond

## Need Help?

- Check Vercel deployment logs for errors
- Verify environment variables are set correctly
- Ensure the deployment is live and accessible
- Use the diagnostic script: `scripts/diagnose-telegram-bot.ps1`

