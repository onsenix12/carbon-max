# Telegram Webhook Setup Script for PowerShell
# This script helps you set up the Telegram bot webhook for your Vercel deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$BotToken,
    
    [Parameter(Mandatory=$false)]
    [string]$WebhookUrl = "https://carbon-max.vercel.app/api/telegram"
)

Write-Host "`n🔧 Setting up Telegram Bot Webhook...`n" -ForegroundColor Cyan

# Step 1: Verify bot token
Write-Host "1️⃣ Verifying bot token..." -ForegroundColor Yellow
try {
    $botInfoResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotToken/getMe" -Method Get
    if ($botInfoResponse.ok) {
        Write-Host "   ✅ Bot found: @$($botInfoResponse.result.username) ($($botInfoResponse.result.first_name))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Invalid bot token: $($botInfoResponse.description)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Error checking bot: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Check current webhook
Write-Host "`n2️⃣ Checking current webhook configuration..." -ForegroundColor Yellow
try {
    $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotToken/getWebhookInfo" -Method Get
    if ($webhookInfo.ok) {
        $info = $webhookInfo.result
        Write-Host "   Current webhook URL: $($info.url)" -ForegroundColor Cyan
        Write-Host "   Pending updates: $($info.pending_update_count)" -ForegroundColor Cyan
        if ($info.last_error_date) {
            $errorDate = [DateTimeOffset]::FromUnixTimeSeconds($info.last_error_date).DateTime
            Write-Host "   Last error date: $errorDate" -ForegroundColor Yellow
            Write-Host "   Last error message: $($info.last_error_message)" -ForegroundColor Yellow
        } else {
            Write-Host "   Last error: None" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   ⚠️  Could not check webhook info: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Step 3: Test webhook endpoint
Write-Host "`n3️⃣ Testing webhook endpoint..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-WebRequest -Uri $WebhookUrl -Method Get -ErrorAction Stop
    if ($testResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Webhook endpoint is accessible (HTTP $($testResponse.StatusCode))" -ForegroundColor Green
        Write-Host "   Response: $($testResponse.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Webhook endpoint test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   💡 Make sure your Vercel deployment is live and accessible." -ForegroundColor Yellow
}

# Step 4: Set webhook
Write-Host "`n4️⃣ Setting webhook..." -ForegroundColor Yellow
try {
    $body = @{
        url = $WebhookUrl
    } | ConvertTo-Json
    
    $setWebhookResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotToken/setWebhook" -Method Post -Body $body -ContentType "application/json"
    
    if ($setWebhookResponse.ok) {
        Write-Host "   ✅ Webhook set successfully!" -ForegroundColor Green
        Write-Host "   URL: $WebhookUrl" -ForegroundColor Cyan
        if ($setWebhookResponse.description) {
            Write-Host "   Note: $($setWebhookResponse.description)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ Failed to set webhook: $($setWebhookResponse.description)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Error setting webhook: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 5: Verify webhook was set
Write-Host "`n5️⃣ Verifying webhook configuration..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
try {
    $verifyResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotToken/getWebhookInfo" -Method Get
    if ($verifyResponse.ok) {
        $info = $verifyResponse.result
        if ($info.url -eq $WebhookUrl) {
            Write-Host "   ✅ Webhook verified! URL matches." -ForegroundColor Green
            Write-Host "   Pending updates: $($info.pending_update_count)" -ForegroundColor Cyan
        } else {
            Write-Host "   ⚠️  Webhook URL mismatch!" -ForegroundColor Yellow
            Write-Host "   Expected: $WebhookUrl" -ForegroundColor Yellow
            Write-Host "   Actual: $($info.url)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ⚠️  Could not verify webhook: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n✅ Setup complete!`n" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test your bot by sending /start in Telegram" -ForegroundColor White
Write-Host "2. Check Vercel logs if the bot doesn't respond" -ForegroundColor White
Write-Host "3. Make sure TELEGRAM_BOT_TOKEN is set in Vercel environment variables" -ForegroundColor White

