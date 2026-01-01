#!/bin/bash
# Telegram Webhook Setup Script for Bash/Linux/Mac
# This script helps you set up the Telegram bot webhook for your Vercel deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if bot token is provided
if [ -z "$1" ]; then
    echo -e "${RED}Usage: ./scripts/set-telegram-webhook.sh <BOT_TOKEN> [WEBHOOK_URL]${NC}"
    echo ""
    echo "Example:"
    echo "  ./scripts/set-telegram-webhook.sh 123456:ABC-def"
    echo "  ./scripts/set-telegram-webhook.sh 123456:ABC-def https://your-app.vercel.app/api/telegram"
    exit 1
fi

BOT_TOKEN=$1
WEBHOOK_URL=${2:-"https://carbon-max.vercel.app/api/telegram"}

echo -e "\n${CYAN}🔧 Setting up Telegram Bot Webhook...${NC}\n"

# Step 1: Verify bot token
echo -e "${YELLOW}1️⃣ Verifying bot token...${NC}"
BOT_INFO=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getMe")
if echo "$BOT_INFO" | grep -q '"ok":true'; then
    BOT_USERNAME=$(echo "$BOT_INFO" | grep -o '"username":"[^"]*' | cut -d'"' -f4)
    BOT_NAME=$(echo "$BOT_INFO" | grep -o '"first_name":"[^"]*' | cut -d'"' -f4)
    echo -e "   ${GREEN}✅ Bot found: @${BOT_USERNAME} (${BOT_NAME})${NC}"
else
    echo -e "   ${RED}❌ Invalid bot token${NC}"
    exit 1
fi

# Step 2: Check current webhook
echo -e "\n${YELLOW}2️⃣ Checking current webhook configuration...${NC}"
WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo")
CURRENT_URL=$(echo "$WEBHOOK_INFO" | grep -o '"url":"[^"]*' | cut -d'"' -f4 || echo "(not set)")
PENDING_COUNT=$(echo "$WEBHOOK_INFO" | grep -o '"pending_update_count":[0-9]*' | cut -d':' -f2 || echo "0")
echo -e "   ${CYAN}Current webhook URL: ${CURRENT_URL}${NC}"
echo -e "   ${CYAN}Pending updates: ${PENDING_COUNT}${NC}"

# Step 3: Test webhook endpoint
echo -e "\n${YELLOW}3️⃣ Testing webhook endpoint...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$WEBHOOK_URL" | grep -q "200"; then
    echo -e "   ${GREEN}✅ Webhook endpoint is accessible${NC}"
else
    echo -e "   ${YELLOW}⚠️  Webhook endpoint test failed${NC}"
    echo -e "   ${YELLOW}💡 Make sure your Vercel deployment is live and accessible.${NC}"
fi

# Step 4: Set webhook
echo -e "\n${YELLOW}4️⃣ Setting webhook...${NC}"
SET_RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
    -F "url=${WEBHOOK_URL}")

if echo "$SET_RESPONSE" | grep -q '"ok":true'; then
    echo -e "   ${GREEN}✅ Webhook set successfully!${NC}"
    echo -e "   ${CYAN}URL: ${WEBHOOK_URL}${NC}"
else
    ERROR_MSG=$(echo "$SET_RESPONSE" | grep -o '"description":"[^"]*' | cut -d'"' -f4 || echo "Unknown error")
    echo -e "   ${RED}❌ Failed to set webhook: ${ERROR_MSG}${NC}"
    exit 1
fi

# Step 5: Verify webhook was set
echo -e "\n${YELLOW}5️⃣ Verifying webhook configuration...${NC}"
sleep 2
VERIFY_INFO=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo")
VERIFY_URL=$(echo "$VERIFY_INFO" | grep -o '"url":"[^"]*' | cut -d'"' -f4)
VERIFY_PENDING=$(echo "$VERIFY_INFO" | grep -o '"pending_update_count":[0-9]*' | cut -d':' -f2 || echo "0")

if [ "$VERIFY_URL" = "$WEBHOOK_URL" ]; then
    echo -e "   ${GREEN}✅ Webhook verified! URL matches.${NC}"
    echo -e "   ${CYAN}Pending updates: ${VERIFY_PENDING}${NC}"
else
    echo -e "   ${YELLOW}⚠️  Webhook URL mismatch!${NC}"
    echo -e "   ${YELLOW}Expected: ${WEBHOOK_URL}${NC}"
    echo -e "   ${YELLOW}Actual: ${VERIFY_URL}${NC}"
fi

echo -e "\n${GREEN}✅ Setup complete!${NC}\n"
echo -e "${CYAN}Next steps:${NC}"
echo -e "1. Test your bot by sending /start in Telegram"
echo -e "2. Check Vercel logs if the bot doesn't respond"
echo -e "3. Make sure TELEGRAM_BOT_TOKEN is set in Vercel environment variables"

