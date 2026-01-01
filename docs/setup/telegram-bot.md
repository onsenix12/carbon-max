# Telegram Bot Setup Guide

## 1. Create Bot with @BotFather

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts:
   - **Name**: `Changi Eco Advisor`
   - **Username**: `carbon_max_bot`
   - **Description**: `Your sustainable travel companion at Changi Airport`

## 2. Set Bot Profile

### Set Bot Photo
1. In @BotFather, send `/setuserpic`
2. Upload the Changi Eco Advisor logo image
3. The photo should be square (recommended: 512x512px or 640x640px)

### Set Bot Description
1. In @BotFather, send `/setdescription`
2. Paste: `Your sustainable travel companion at Changi Airport. SAF-first, transparency always.`

## 3. Set Bot Commands

Send this to @BotFather:

```
/setcommands
```

Then paste this list:

```
start - Start your eco journey
calculate - Calculate flight emissions
saf - Learn about & contribute to SAF
journey - View your journey summary
shop - Find green-rated shops
eco - Log a circularity action
tier - Check your Green Tier status
impact - Get your personalized impact story
ask - Ask Max anything
help - Show all available commands
```

## 4. Get Bot Token

1. Send `/token` to @BotFather
2. Copy the token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
3. The token is already stored in `.env.local` as `TELEGRAM_BOT_TOKEN`

## 5. Set Webhook

Once your app is deployed, set the webhook URL:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/telegram"}'
```

Or use the Telegram Bot API:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-domain.com/api/telegram
```

## 6. Create QR Code for Bot Link

Generate a QR code that links to your bot. The bot link format is:
```
https://t.me/carbon_max_bot
```

You can use any QR code generator:
- Online: https://www.qr-code-generator.com/ or https://qr.io/
- Command line: Use `qrcode` npm package or Python `qrcode` library
- Or use this script:

```bash
# Install qrcode-cli (if using npm)
npm install -g qrcode-cli

# Generate QR code
qrcode "https://t.me/carbon_max_bot" -o public/telegram-bot-qr.png
```

## 7. Demo Message Sequence

For demo purposes, follow this sequence:

1. **`/start`** → Welcome message with SAF mandate context
   - Shows user's Green Tier status
   - Mentions Singapore's 2026 SAF mandate
   - Displays main menu buttons

2. **`/calculate`** → Calculate flight emissions
   - Select destination: **London**
   - Select class: **Business**
   - Result shows SAF-first result
   - Option to contribute to SAF appears

3. **`/saf`** → Book & Claim explainer
   - Shows SAF information
   - Explains Book & Claim mechanism
   - Option to contribute

4. **`/eco`** → Log circularity action
   - Select action: **Cup reuse**
   - Shows points celebration
   - Displays waste diverted

5. **`/tier`** → Show progress
   - Displays current tier
   - Shows progress to next tier
   - Points breakdown

6. **`/impact`** → Generate and share story
   - Generates personalized impact story
   - Shows user's contributions
   - Shareable format

## 8. Test the Bot

1. Search for your bot on Telegram: `@carbon_max_bot`
2. Send `/start` to begin
3. Try commands like `/calculate`, `/saf`, `/tier`
4. Follow the demo sequence above

## Features

- **SAF-First Positioning**: All flight calculations prioritize SAF contributions
- **Interactive Keyboards**: Easy navigation with inline buttons
- **Journey Tracking**: Monitor your carbon footprint and Eco-Points
- **Ask Max Integration**: Get AI-powered sustainability advice
- **Impact Stories**: Personalized narratives about your contributions

## Commands

- `/start` - Welcome with Green Tier status
- `/calculate` - Calculate flight emissions (SAF-first results)
- `/saf` - Learn about and contribute to SAF
- `/journey` - View current journey summary
- `/shop` - Find green-rated shops
- `/eco` - Log circularity action
- `/tier` - Check Green Tier status
- `/ask [question]` - Ask Max anything
- `/impact` - Get personalized impact story
- `/help` - Show all commands

## Development

For local development with polling (instead of webhook):

```typescript
// In lib/telegram/bot.ts, change:
export const bot = new TelegramBot(token, { polling: true });
```

Note: Polling is not recommended for production. Use webhooks instead.

## Known Limitations

### Current Limitations

1. **Session Storage**: User sessions are stored in-memory. In production, use a database (Redis, PostgreSQL, etc.) for persistence.

2. **User Authentication**: Currently uses chatId as user identifier. For production, implement proper user authentication and link Telegram accounts to user profiles.

3. **SAF Payment**: SAF contribution flow is simulated. Real payment integration would require:
   - Payment gateway integration (Stripe, PayPal, etc.)
   - Transaction verification
   - Receipt generation

4. **Circularity Actions**: Actions are logged but not verified. In production, integrate with:
   - Merchant POS systems
   - QR code scanning at shops
   - Photo verification

5. **Impact Stories**: Generated using AI (Claude). Stories are personalized but may have slight variations.

6. **Webhook Security**: Current webhook doesn't verify Telegram secret token. For production, add verification:
   ```typescript
   const secretToken = process.env.TELEGRAM_SECRET_TOKEN;
   // Verify request authenticity
   ```

7. **Rate Limiting**: No rate limiting implemented. Add rate limiting for production to prevent abuse.

8. **Multi-language Support**: Currently English only. For Changi Airport, consider adding:
   - Chinese (Simplified/Traditional)
   - Malay
   - Tamil

### Demo-Specific Notes

- All calculations use demo data
- SAF contributions are simulated (no actual payment)
- Eco-Points are awarded but not permanently stored
- Journey summaries reset on server restart
- Impact stories are generated on-demand and may vary
