# Telegram Bot Diagnostic Script
# This script checks all common issues that prevent the bot from responding

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🔍 Telegram Bot Diagnostic Tool" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get bot token
Write-Host "Step 1: Bot Token" -ForegroundColor Yellow
Write-Host "Please enter your Telegram bot token:" -ForegroundColor White
Write-Host "(You can get this from @BotFather on Telegram)" -ForegroundColor Gray
$BotToken = Read-Host -Prompt "Bot Token" -AsSecureString
$BotTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($BotToken))

if ([string]::IsNullOrWhiteSpace($BotTokenPlain)) {
    Write-Host "   ❌ ERROR: Bot token cannot be empty." -ForegroundColor Red
    exit 1
}

# Step 2: Verify bot token
Write-Host ""
Write-Host "Step 2: Verifying Bot Token" -ForegroundColor Yellow
try {
    $botInfoResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotTokenPlain/getMe" -Method Get
    if ($botInfoResponse.ok) {
        Write-Host "   ✅ Bot found: @$($botInfoResponse.result.username) ($($botInfoResponse.result.first_name))" -ForegroundColor Green
        $BotUsername = $botInfoResponse.result.username
    } else {
        Write-Host "   ❌ ERROR: Invalid bot token: $($botInfoResponse.description)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ ERROR: Error checking bot: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 TIP: Make sure your bot token is correct." -ForegroundColor Yellow
    exit 1
}

# Step 3: Check webhook configuration
Write-Host ""
Write-Host "Step 3: Checking Webhook Configuration" -ForegroundColor Yellow
try {
    $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotTokenPlain/getWebhookInfo" -Method Get
    if ($webhookInfo.ok) {
        $info = $webhookInfo.result
        
        if ($info.url) {
            Write-Host "   Current webhook URL: $($info.url)" -ForegroundColor Cyan
            Write-Host "   Pending updates: $($info.pending_update_count)" -ForegroundColor $(if ($info.pending_update_count -gt 0) { "Yellow" } else { "Green" })
            
            if ($info.last_error_date) {
                $errorDate = [DateTimeOffset]::FromUnixTimeSeconds($info.last_error_date).DateTime
                Write-Host "   ⚠️  WARNING: Last error occurred: $errorDate" -ForegroundColor Red
                Write-Host "   Error message: $($info.last_error_message)" -ForegroundColor Red
                
                # Analyze common error messages
                if ($info.last_error_message -like "*404*" -or $info.last_error_message -like "*Not Found*") {
                    Write-Host "   💡 ISSUE: Webhook endpoint not found. Check if the URL is correct." -ForegroundColor Yellow
                } elseif ($info.last_error_message -like "*timeout*" -or $info.last_error_message -like "*timed out*") {
                    Write-Host "   💡 ISSUE: Webhook endpoint is timing out. Check Vercel function logs." -ForegroundColor Yellow
                } elseif ($info.last_error_message -like "*500*" -or $info.last_error_message -like "*Internal Server Error*") {
                    Write-Host "   💡 ISSUE: Server error. Check if TELEGRAM_BOT_TOKEN is set in Vercel." -ForegroundColor Yellow
                } elseif ($info.last_error_message -like "*SSL*" -or $info.last_error_message -like "*certificate*") {
                    Write-Host "   💡 ISSUE: SSL certificate problem. Check if your domain has valid SSL." -ForegroundColor Yellow
                }
            } else {
                Write-Host "   ✅ No recent errors" -ForegroundColor Green
            }
            
            # Check if webhook URL is correct
            $expectedUrl = "https://carbon-max.vercel.app/api/telegram"
            if ($info.url -ne $expectedUrl) {
                Write-Host ""
                Write-Host "   ⚠️  WARNING: Webhook URL mismatch!" -ForegroundColor Yellow
                Write-Host "   Expected: $expectedUrl" -ForegroundColor Yellow
                Write-Host "   Actual: $($info.url)" -ForegroundColor Yellow
                Write-Host "   💡 TIP: Run set-webhook-interactive.ps1 to fix this." -ForegroundColor Yellow
            } else {
                Write-Host "   ✅ Webhook URL is correct" -ForegroundColor Green
            }
        } else {
            Write-Host "   ❌ ERROR: No webhook is set!" -ForegroundColor Red
            Write-Host "   💡 TIP: Run set-webhook-interactive.ps1 to set up the webhook." -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ❌ ERROR: Could not check webhook: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Test webhook endpoint
Write-Host ""
Write-Host "Step 4: Testing Webhook Endpoint" -ForegroundColor Yellow
$WebhookUrl = "https://carbon-max.vercel.app/api/telegram"
try {
    $testResponse = Invoke-WebRequest -Uri $WebhookUrl -Method Get -ErrorAction Stop
    if ($testResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Webhook endpoint is accessible (HTTP $($testResponse.StatusCode))" -ForegroundColor Green
        $responseContent = $testResponse.Content | ConvertFrom-Json
        if ($responseContent.status) {
            Write-Host "   Response: $($responseContent.status)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  WARNING: Webhook endpoint returned HTTP $($testResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ ERROR: Could not reach webhook endpoint: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   💡 TIP: Make sure your Vercel deployment is live and accessible." -ForegroundColor Yellow
    Write-Host "   💡 TIP: Check if the URL is correct: $WebhookUrl" -ForegroundColor Yellow
}

# Step 5: Check for common configuration issues
Write-Host ""
Write-Host "Step 5: Configuration Checklist" -ForegroundColor Yellow
Write-Host "   Checking common issues..." -ForegroundColor Gray

$issues = @()
$fixes = @()

# Check webhook URL format
if ($webhookInfo.ok -and $webhookInfo.result.url) {
    $currentUrl = $webhookInfo.result.url
    if ($currentUrl -like "*/api/telegram/webhook*") {
        $issues += "Webhook URL points to wrong endpoint (/api/telegram/webhook instead of /api/telegram)"
        $fixes += "Update webhook URL to: https://carbon-max.vercel.app/api/telegram"
    }
}

# Check for pending updates
if ($webhookInfo.ok -and $webhookInfo.result.pending_update_count -gt 10) {
    $issues += "High number of pending updates ($($webhookInfo.result.pending_update_count)) - webhook may not be processing"
    $fixes += "Check Vercel logs for errors. May need to clear pending updates."
}

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Diagnostic Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

if ($issues.Count -eq 0) {
    Write-Host "✅ No obvious issues found!" -ForegroundColor Green
    Write-Host ""
    Write-Host "If the bot still doesn't respond, check:" -ForegroundColor Yellow
    Write-Host "1. Vercel Environment Variables:" -ForegroundColor White
    Write-Host "   - Go to Vercel Dashboard, Your Project, Settings, Environment Variables" -ForegroundColor Gray
    Write-Host "   - Verify TELEGRAM_BOT_TOKEN is set for Production environment" -ForegroundColor Gray
    Write-Host "   - Make sure you redeployed after setting the variable" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Vercel Function Logs:" -ForegroundColor White
    Write-Host "   - Go to Vercel Dashboard, Your Project, Logs" -ForegroundColor Gray
    Write-Host "   - Filter by api/telegram" -ForegroundColor Gray
    Write-Host "   - Look for error messages" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Test the bot:" -ForegroundColor White
    Write-Host "   - Open Telegram and search for @$BotUsername" -ForegroundColor Gray
    Write-Host "   - Send /start command" -ForegroundColor Gray
} else {
    Write-Host "WARNING: Found $($issues.Count) potential issue(s):" -ForegroundColor Yellow
    Write-Host ""
    for ($i = 0; $i -lt $issues.Count; $i++) {
        Write-Host "$($i + 1). $($issues[$i])" -ForegroundColor Red
        if ($fixes[$i]) {
            Write-Host "   Fix: $($fixes[$i])" -ForegroundColor Yellow
        }
        Write-Host ""
    }
}

Write-Host ""
Write-Host "Quick Fix Commands:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To set/update webhook, run:" -ForegroundColor White
Write-Host "  .\scripts\set-webhook-interactive.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host 'For more help, see QUICK_FIX_TELEGRAM.md' -ForegroundColor Yellow
Write-Host ""

# Clear the token from memory
$BotTokenPlain = $null
[GC]::Collect()

