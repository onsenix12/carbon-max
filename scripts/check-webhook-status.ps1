# Quick Telegram Webhook Status Check Script
# This script checks the current webhook status without setting it

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Telegram Bot Webhook Status Check" -ForegroundColor Cyan
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

$ExpectedWebhookUrl = "https://carbon-max.vercel.app/api/telegram"

Write-Host ""
Write-Host "Checking webhook status..." -ForegroundColor Cyan
Write-Host ""

try {
    $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotTokenPlain/getWebhookInfo" -Method Get
    
    if ($webhookInfo.ok) {
        $info = $webhookInfo.result
        
        Write-Host "Webhook Status:" -ForegroundColor White
        Write-Host "  URL: " -NoNewline
        if ($info.url) {
            if ($info.url -eq $ExpectedWebhookUrl) {
                Write-Host $info.url -ForegroundColor Green
            } elseif ($info.url -like "*/api/telegram/webhook*") {
                Write-Host $info.url -ForegroundColor Red
                Write-Host ""
                Write-Host "  ⚠️  WARNING: Webhook points to wrong endpoint (/webhook)" -ForegroundColor Red
                Write-Host "     Should be: $ExpectedWebhookUrl" -ForegroundColor Yellow
            } else {
                Write-Host $info.url -ForegroundColor Yellow
            }
        } else {
            Write-Host "(not set)" -ForegroundColor Red
            Write-Host ""
            Write-Host "  ⚠️  Webhook not set!" -ForegroundColor Red
        }
        
        Write-Host "  Pending updates: $($info.pending_update_count)" -ForegroundColor $(if ($info.pending_update_count -gt 0) { "Yellow" } else { "Green" })
        
        if ($info.last_error_date) {
            $errorDate = [DateTimeOffset]::FromUnixTimeSeconds($info.last_error_date).DateTime
            Write-Host "  Last error date: $errorDate" -ForegroundColor Red
            if ($info.last_error_message) {
                Write-Host "  Last error message: $($info.last_error_message)" -ForegroundColor Red
            }
        } else {
            Write-Host "  Last error: (none)" -ForegroundColor Green
        }
        
        Write-Host ""
        
        # Check endpoint accessibility
        Write-Host "Testing endpoint accessibility..." -ForegroundColor Cyan
        try {
            $testResponse = Invoke-WebRequest -Uri $ExpectedWebhookUrl -Method Get -ErrorAction Stop
            if ($testResponse.StatusCode -eq 200) {
                $responseBody = $testResponse.Content | ConvertFrom-Json
                Write-Host "  ✅ Endpoint is live: $($responseBody.status)" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ⚠️  Could not reach endpoint: $($_.Exception.Message)" -ForegroundColor Yellow
            Write-Host "     Make sure your Vercel deployment is live." -ForegroundColor Yellow
        }
        
        Write-Host ""
        
        # Summary
        if (-not $info.url) {
            Write-Host "Action needed: Set webhook using set-webhook-interactive.ps1" -ForegroundColor Yellow
        } elseif ($info.url -like "*/api/telegram/webhook*") {
            Write-Host "Action needed: Update webhook to point to /api/telegram (not /api/telegram/webhook)" -ForegroundColor Yellow
        } elseif ($info.url -ne $ExpectedWebhookUrl) {
            Write-Host "Action needed: Update webhook URL to match expected URL" -ForegroundColor Yellow
        } elseif ($info.last_error_date) {
            Write-Host "Action needed: Check error message above and fix the issue" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Webhook is properly configured!" -ForegroundColor Green
        }
        
    } else {
        Write-Host "ERROR: Failed to get webhook info: $($webhookInfo.description)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR: Could not check webhook status: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "TIP: Make sure your bot token is correct." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Clear the token from memory
$BotTokenPlain = $null
[GC]::Collect()

