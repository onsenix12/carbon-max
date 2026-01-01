# Final Deployment Checklist

## 1. Environment Variables on Vercel

Set the following environment variables in your Vercel project settings:

```bash
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=...
NEXT_PUBLIC_APP_URL=https://changi-carbon.vercel.app
```

### Steps:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable for **Production**, **Preview**, and **Development** environments
3. Verify all variables are set correctly

---

## 2. Set Telegram Webhook

Configure the Telegram bot webhook to point to your production URL:

```bash
curl -F "url=https://changi-carbon.vercel.app/api/telegram" \
  https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook
```

**Important:** 
- Replace `<YOUR_TELEGRAM_BOT_TOKEN>` with your actual bot token
- Replace `https://changi-carbon.vercel.app` with your actual Vercel deployment URL
- The webhook URL must be `/api/telegram` (not `/api/telegram/webhook`)

### Verify Webhook:
```bash
curl https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/getWebhookInfo
```

Expected response should show:
- `url`: `https://your-app.vercel.app/api/telegram`
- `pending_update_count`: `0` (or low number)

### Quick Verification Script:
```bash
node scripts/verify-telegram-webhook.js <YOUR_BOT_TOKEN> https://your-app.vercel.app
```

**If the bot doesn't work, see [TELEGRAM_TROUBLESHOOTING.md](./TELEGRAM_TROUBLESHOOTING.md) for detailed troubleshooting steps.**

---

## 3. Test Production Deployment

### Feature Testing Checklist:

- [ ] **Landing Page** (`/`)
  - [ ] Page loads correctly
  - [ ] All sections display properly
  - [ ] Navigation buttons work
  - [ ] Demo mode link works (`/?demo=true&step=1`)

- [ ] **Customer App** (`/customer` or `/calculator`)
  - [ ] Flight calculator works
  - [ ] SAF contribution flow works
  - [ ] Journey summary displays
  - [ ] Green Tier status shows
  - [ ] Shop listings load
  - [ ] Ask Max chat works

- [ ] **Dashboard** (`/dashboard`)
  - [ ] Dashboard loads with data
  - [ ] SAF tracking page works
  - [ ] Circularity metrics display
  - [ ] Charts render correctly

- [ ] **Telegram Bot** (`t.me/carbon_max_bot`)
  - [ ] Bot responds to `/start`
  - [ ] Flight calculation works
  - [ ] SAF contribution flow works
  - [ ] All commands function correctly

- [ ] **SAF-First Positioning**
  - [ ] SAF is prominently featured over offsets
  - [ ] 2026 mandate messaging is visible
  - [ ] Book-and-Claim explanation is clear

- [ ] **Performance**
  - [ ] No console errors
  - [ ] Page load times acceptable (< 3s)
  - [ ] API responses are fast
  - [ ] Images load correctly

- [ ] **Mobile Responsiveness**
  - [ ] Customer app works on mobile
  - [ ] Dashboard is usable on tablet
  - [ ] Telegram bot works on all devices

---

## 4. Create Shareable Links

### Production Links:

- **Landing Page**: 
  ```
  https://changi-carbon.vercel.app
  ```

- **Customer App Direct Link**: 
  ```
  https://changi-carbon.vercel.app/customer
  ```

- **Dashboard Direct Link**: 
  ```
  https://changi-carbon.vercel.app/dashboard
  ```

- **Telegram Bot**: 
  ```
  t.me/carbon_max_bot
  ```
  Or use the full URL:
  ```
  https://t.me/carbon_max_bot
  ```

- **Demo Mode Link with Step**: 
  ```
  https://changi-carbon.vercel.app/?demo=true&step=1
  ```

### Additional Demo Links:

- **Step 0 (Introduction)**: `/?demo=true&step=0`
- **Step 1 (Calculate Flight)**: `/?demo=true&step=1`
- **Step 2 (SAF Contribution)**: `/?demo=true&step=2`
- **Step 3 (Ask Max)**: `/?demo=true&step=3`
- **Step 4 (Circularity)**: `/?demo=true&step=4`
- **Step 5 (Green Tier)**: `/?demo=true&step=5`
- **Step 6 (Impact Story)**: `/?demo=true&step=6`
- **Step 7 (Dashboard)**: `/?demo=true&step=7`

---

## 5. Backup Materials

### Screenshots to Capture:

1. **Landing Page**
   - Hero section
   - Four-pillar solution
   - Compliance readiness section

2. **Customer App**
   - Home screen with Green Tier status
   - Flight calculator with results
   - SAF contribution flow
   - Journey summary
   - Green shops listing
   - Ask Max chat interface

3. **Dashboard**
   - Main dashboard view
   - SAF tracking page
   - Circularity metrics
   - Activity feed

4. **Telegram Bot**
   - Welcome message
   - Flight calculation result
   - SAF contribution confirmation
   - Green Tier status

### Screen Recording:

Record a complete demo flow covering:
1. Landing page overview
2. Flight calculation (SIN → LHR)
3. SAF contribution (50% coverage)
4. Circularity action (Cup-as-a-Service)
5. Green Tier progress
6. Impact story generation
7. Dashboard view

**Recommended Tools:**
- Loom
- OBS Studio
- QuickTime (Mac)
- Windows Game Bar (Windows)

### Dashboard Export:

1. Navigate to `/dashboard`
2. Use browser print function (Ctrl+P / Cmd+P)
3. Save as PDF
4. Include:
   - SAF progress toward 2026 mandate
   - Current emissions metrics
   - Activity summary

---

## 6. Post-Deployment Verification

### Health Checks:

- [ ] All API endpoints respond correctly
  - `/api/calculate` - Flight emissions
  - `/api/saf` - SAF contributions
  - `/api/chat` - Ask Max
  - `/api/telegram` - Webhook handler
  - `/api/dashboard` - Dashboard data

- [ ] Environment variables are accessible
  - Anthropic API key works
  - Telegram bot token works
  - App URL is correct

- [ ] No errors in Vercel logs
  - Check Function Logs
  - Check Build Logs
  - Monitor for runtime errors

### Monitoring Setup:

1. **Vercel Analytics** (if enabled)
   - Monitor page views
   - Track error rates
   - Watch performance metrics

2. **Telegram Bot Monitoring**
   - Check webhook delivery
   - Monitor command usage
   - Track error responses

3. **API Monitoring**
   - Set up uptime monitoring (e.g., UptimeRobot)
   - Monitor response times
   - Alert on failures

---

## 7. Documentation Updates

- [ ] Update README.md with production URL
- [ ] Document all shareable links
- [ ] Update any hardcoded localhost URLs
- [ ] Verify all documentation links work

---

## 8. Security Checklist

- [ ] Environment variables are not exposed in client code
- [ ] API routes have proper error handling
- [ ] No sensitive data in console logs
- [ ] Telegram webhook verification (if implemented)
- [ ] Rate limiting considered for production

---

## Quick Reference

### Production URL:
```
https://changi-carbon.vercel.app
```

### Telegram Bot:
```
t.me/carbon_max_bot
```

### Key Routes:
- Landing: `/`
- Customer: `/customer`
- Calculator: `/calculator`
- Dashboard: `/dashboard`
- Demo: `/?demo=true&step=1`

### Support Contacts:
- Vercel Support: [Vercel Dashboard](https://vercel.com/dashboard)
- Telegram Bot Issues: Check webhook status
- API Issues: Check Vercel Function Logs

---

**Last Updated**: January 2026  
**Status**: Ready for Production Deployment

