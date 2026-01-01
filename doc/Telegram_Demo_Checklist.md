# Telegram Bot Demo Preparation Checklist

## ✅ Pre-Demo Setup (Manual Steps via @BotFather)

### 1. Set Bot Profile Photo
- [ ] Open Telegram and go to @BotFather
- [ ] Send `/setuserpic`
- [ ] Upload the **Changi Eco Advisor logo** (square image, recommended: 512x512px or 640x640px)
- [ ] Confirm the photo is set

### 2. Set Bot Description
- [ ] In @BotFather, send `/setdescription`
- [ ] Paste: `Your sustainable travel companion at Changi Airport. SAF-first, transparency always.`
- [ ] Confirm the description is set

### 3. Set Command Descriptions
- [ ] In @BotFather, send `/setcommands`
- [ ] Paste the following list:

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

- [ ] Verify commands appear when typing `/` in the bot chat

## 📱 QR Code Generation

### Option 1: Online Generator
- [ ] Go to https://www.qr-code-generator.com/ or https://qr.io/
- [ ] Enter bot link: `https://t.me/carbon_max_bot` (or your actual bot username)
- [ ] Download QR code image
- [ ] Save to `public/telegram-bot-qr.png` or similar location

### Option 2: Command Line (if you have Node.js)
```bash
npm install -g qrcode-cli
qrcode "https://t.me/carbon_max_bot" -o public/telegram-bot-qr.png
```

### Option 3: Python (if you have Python)
```bash
pip install qrcode[pil]
python -c "import qrcode; qrcode.make('https://t.me/carbon_max_bot').save('public/telegram-bot-qr.png')"
```

- [ ] Update landing page to display the QR code (replace placeholder in `app/page.tsx`)

## 🎬 Demo Message Sequence

Practice this sequence before the demo:

1. **`/start`**
   - ✅ Welcome message appears
   - ✅ Shows SAF mandate context
   - ✅ Displays user's Green Tier status
   - ✅ Main menu buttons appear

2. **`/calculate`**
   - ✅ Destination selection appears
   - ✅ Select **London**
   - ✅ Class selection appears
   - ✅ Select **Business**
   - ✅ SAF-first result displays
   - ✅ Option to contribute to SAF appears

3. **`/saf`**
   - ✅ Book & Claim explainer displays
   - ✅ Information about SAF contributions
   - ✅ "Contribute to SAF" button appears

4. **`/eco`**
   - ✅ Circularity actions list appears
   - ✅ Select **Cup reuse** (or similar action)
   - ✅ Points celebration message
   - ✅ Waste diverted information

5. **`/tier`**
   - ✅ Current tier displayed
   - ✅ Progress to next tier shown
   - ✅ Points breakdown visible

6. **`/impact`**
   - ✅ Personalized impact story generates
   - ✅ Shows user's contributions
   - ✅ Story is shareable

## ⚠️ Known Limitations to Mention (if asked)

- **Session Storage**: Sessions are in-memory (will reset on server restart)
- **SAF Payments**: Simulated for demo (no actual payment processing)
- **Circularity Verification**: Actions logged but not verified with merchants
- **Impact Stories**: AI-generated, may have slight variations
- **Multi-language**: Currently English only

## 🔍 Pre-Demo Testing

- [ ] Test all commands work correctly
- [ ] Verify bot profile photo displays correctly
- [ ] Check bot description appears in search
- [ ] Test QR code scans correctly and opens bot
- [ ] Practice demo sequence at least once
- [ ] Have backup plan if webhook is down (mention it's a demo environment)

## 📝 Demo Day Checklist

- [ ] Bot is live and webhook is active
- [ ] QR code is ready and tested
- [ ] Demo sequence practiced
- [ ] Backup device/phone ready (in case primary device has issues)
- [ ] Screenshots of key interactions ready (backup if live demo fails)
- [ ] Know how to explain any limitations if asked

## 🚀 Quick Start Commands

If you need to quickly test the bot:
```
/start → /calculate → London → Business → /saf → /eco → Cup reuse → /tier → /impact
```

---

**Note**: All code is already implemented. You only need to:
1. Set bot profile photo and description via @BotFather (manual)
2. Set command descriptions via @BotFather (manual)
3. Generate QR code (one-time)
4. Practice the demo sequence

