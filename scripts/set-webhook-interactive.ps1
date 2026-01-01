# Interactive Telegram Webhook Setup Script
# This script will prompt you for your bot token and set up the webhook

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Telegram Bot Webhook Setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will help you set up the Telegram webhook for:" -ForegroundColor White
Write-Host "  https://carbon-max.vercel.app/api/telegram" -ForegroundColor Yellow
Write-Host ""

# Prompt for bot token
Write-Host "Please enter your Telegram bot token:" -ForegroundColor Yellow
Write-Host "(You can get this from @BotFather on Telegram)" -ForegroundColor Gray
$BotToken = Read-Host -Prompt "Bot Token" -AsSecureString
$BotTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($BotToken))

if ([string]::IsNullOrWhiteSpace($BotTokenPlain)) {
    Write-Host ""
    Write-Host "ERROR: Bot token cannot be empty. Exiting." -ForegroundColor Red
    exit 1
}

$WebhookUrl = "https://carbon-max.vercel.app/api/telegram"

Write-Host ""
Write-Host "Verifying bot token..." -ForegroundColor Cyan
try {
    $botInfoResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotTokenPlain/getMe" -Method Get
    if ($botInfoResponse.ok) {
        Write-Host "   SUCCESS: Bot found: @$($botInfoResponse.result.username) ($($botInfoResponse.result.first_name))" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: Invalid bot token: $($botInfoResponse.description)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ERROR: Error checking bot: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   TIP: Make sure your bot token is correct." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Checking current webhook..." -ForegroundColor Cyan
try {
    $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotTokenPlain/getWebhookInfo" -Method Get
    if ($webhookInfo.ok) {
        $info = $webhookInfo.result
        if ($info.url) {
            Write-Host "   Current webhook: $($info.url)" -ForegroundColor Yellow
            Write-Host "   Pending updates: $($info.pending_update_count)" -ForegroundColor Yellow
            if ($info.last_error_date) {
                $errorDate = [DateTimeOffset]::FromUnixTimeSeconds($info.last_error_date).DateTime
                Write-Host "   WARNING: Last error: $errorDate - $($info.last_error_message)" -ForegroundColor Red
            }
        } else {
            Write-Host "   No webhook currently set" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   WARNING: Could not check current webhook" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Testing webhook endpoint..." -ForegroundColor Cyan
try {
    $testResponse = Invoke-WebRequest -Uri $WebhookUrl -Method Get -ErrorAction Stop
    if ($testResponse.StatusCode -eq 200) {
        Write-Host "   SUCCESS: Webhook endpoint is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "   WARNING: Could not reach webhook endpoint: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   TIP: Make sure your Vercel deployment is live." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setting webhook..." -ForegroundColor Cyan
try {
    $body = @{
        url = $WebhookUrl
    } | ConvertTo-Json
    
    $setWebhookResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotTokenPlain/setWebhook" -Method Post -Body $body -ContentType "application/json"
    
    if ($setWebhookResponse.ok) {
        Write-Host "   SUCCESS: Webhook set successfully!" -ForegroundColor Green
        Write-Host "   URL: $WebhookUrl" -ForegroundColor Cyan
        if ($setWebhookResponse.description) {
            Write-Host "   Note: $($setWebhookResponse.description)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ERROR: Failed to set webhook: $($setWebhookResponse.description)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ERROR: Error setting webhook: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Verifying webhook..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
try {
    $verifyResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotTokenPlain/getWebhookInfo" -Method Get
    if ($verifyResponse.ok) {
        $info = $verifyResponse.result
        if ($info.url -eq $WebhookUrl) {
            Write-Host "   SUCCESS: Webhook verified! URL matches." -ForegroundColor Green
            Write-Host "   Pending updates: $($info.pending_update_count)" -ForegroundColor Cyan
        } else {
            Write-Host "   WARNING: Webhook URL mismatch!" -ForegroundColor Yellow
            Write-Host "   Expected: $WebhookUrl" -ForegroundColor Yellow
            Write-Host "   Actual: $($info.url)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   WARNING: Could not verify webhook" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure TELEGRAM_BOT_TOKEN is set in Vercel environment variables" -ForegroundColor White
Write-Host "2. Test your bot by sending /start in Telegram" -ForegroundColor White
Write-Host "3. Check Vercel logs if the bot does not respond" -ForegroundColor White
Write-Host ""

# Clear the token from memory
$BotTokenPlain = $null
[GC]::Collect()
