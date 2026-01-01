#!/bin/bash
# Quick Telegram Webhook Status Check Script
# This script checks the current webhook status without setting it

set -e

echo ""
echo "Telegram Bot Webhook Status Check"
echo ""

# Prompt for bot token
echo "Please enter your Telegram bot token:"
echo "(You can get this from @BotFather on Telegram)"
read -s BOT_TOKEN

if [ -z "$BOT_TOKEN" ]; then
    echo ""
    echo "ERROR: Bot token cannot be empty. Exiting."
    exit 1
fi

EXPECTED_WEBHOOK_URL="https://carbon-max.vercel.app/api/telegram"

echo ""
echo "Checking webhook status..."
echo ""

# Get webhook info
WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo")

# Check if request was successful
if echo "$WEBHOOK_INFO" | grep -q '"ok":true'; then
    # Extract values using grep and sed (basic parsing)
    URL=$(echo "$WEBHOOK_INFO" | grep -o '"url":"[^"]*"' | sed 's/"url":"\([^"]*\)"/\1/')
    PENDING_COUNT=$(echo "$WEBHOOK_INFO" | grep -o '"pending_update_count":[0-9]*' | grep -o '[0-9]*')
    LAST_ERROR_DATE=$(echo "$WEBHOOK_INFO" | grep -o '"last_error_date":[0-9]*' | grep -o '[0-9]*' || echo "")
    LAST_ERROR_MSG=$(echo "$WEBHOOK_INFO" | grep -o '"last_error_message":"[^"]*"' | sed 's/"last_error_message":"\([^"]*\)"/\1/' || echo "")
    
    echo "Webhook Status:"
    echo -n "  URL: "
    
    if [ -z "$URL" ] || [ "$URL" = "null" ]; then
        echo "(not set)"
        echo ""
        echo "  ⚠️  Webhook not set!"
    elif [[ "$URL" == *"/api/telegram/webhook"* ]]; then
        echo "$URL"
        echo ""
        echo "  ⚠️  WARNING: Webhook points to wrong endpoint (/webhook)"
        echo "     Should be: $EXPECTED_WEBHOOK_URL"
    elif [ "$URL" = "$EXPECTED_WEBHOOK_URL" ]; then
        echo -e "\033[0;32m$URL\033[0m"
    else
        echo -e "\033[0;33m$URL\033[0m"
    fi
    
    if [ -n "$PENDING_COUNT" ]; then
        if [ "$PENDING_COUNT" -gt 0 ]; then
            echo -e "  Pending updates: \033[0;33m$PENDING_COUNT\033[0m"
        else
            echo -e "  Pending updates: \033[0;32m$PENDING_COUNT\033[0m"
        fi
    fi
    
    if [ -n "$LAST_ERROR_DATE" ] && [ "$LAST_ERROR_DATE" != "null" ]; then
        ERROR_DATE=$(date -d "@$LAST_ERROR_DATE" 2>/dev/null || echo "$LAST_ERROR_DATE")
        echo -e "  Last error date: \033[0;31m$ERROR_DATE\033[0m"
        if [ -n "$LAST_ERROR_MSG" ]; then
            echo -e "  Last error message: \033[0;31m$LAST_ERROR_MSG\033[0m"
        fi
    else
        echo -e "  Last error: \033[0;32m(none)\033[0m"
    fi
    
    echo ""
    
    # Check endpoint accessibility
    echo "Testing endpoint accessibility..."
    if HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$EXPECTED_WEBHOOK_URL"); then
        if [ "$HTTP_CODE" = "200" ]; then
            RESPONSE=$(curl -s "$EXPECTED_WEBHOOK_URL")
            echo -e "  ✅ Endpoint is live: $RESPONSE"
        else
            echo -e "  ⚠️  Endpoint returned HTTP $HTTP_CODE"
        fi
    else
        echo -e "  ⚠️  Could not reach endpoint"
        echo "     Make sure your Vercel deployment is live."
    fi
    
    echo ""
    
    # Summary
    if [ -z "$URL" ] || [ "$URL" = "null" ]; then
        echo -e "\033[0;33mAction needed: Set webhook using set-webhook-interactive.ps1 or curl\033[0m"
    elif [[ "$URL" == *"/api/telegram/webhook"* ]]; then
        echo -e "\033[0;33mAction needed: Update webhook to point to /api/telegram (not /api/telegram/webhook)\033[0m"
    elif [ "$URL" != "$EXPECTED_WEBHOOK_URL" ]; then
        echo -e "\033[0;33mAction needed: Update webhook URL to match expected URL\033[0m"
    elif [ -n "$LAST_ERROR_DATE" ] && [ "$LAST_ERROR_DATE" != "null" ]; then
        echo -e "\033[0;33mAction needed: Check error message above and fix the issue\033[0m"
    else
        echo -e "\033[0;32m✅ Webhook is properly configured!\033[0m"
    fi
    
else
    echo "ERROR: Failed to get webhook info"
    echo "$WEBHOOK_INFO"
    exit 1
fi

echo ""

