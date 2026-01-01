/**
 * Telegram Webhook Verification Script
 * 
 * This script helps verify that your Telegram bot webhook is configured correctly.
 * 
 * Usage:
 *   node scripts/verify-telegram-webhook.js <YOUR_BOT_TOKEN> <YOUR_VERCEL_URL>
 * 
 * Example:
 *   node scripts/verify-telegram-webhook.js 123456:ABC-def https://your-app.vercel.app
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function verifyWebhook(botToken, webhookUrl) {
  console.log('\n🔍 Verifying Telegram Bot Webhook Configuration...\n');
  
  // Step 1: Verify bot token
  console.log('1️⃣ Checking bot token...');
  try {
    const botInfo = await makeRequest(`https://api.telegram.org/bot${botToken}/getMe`);
    if (botInfo.ok) {
      console.log(`   ✅ Bot found: @${botInfo.result.username} (${botInfo.result.first_name})`);
    } else {
      console.log(`   ❌ Invalid bot token: ${botInfo.description}`);
      return;
    }
  } catch (error) {
    console.log(`   ❌ Error checking bot: ${error.message}`);
    return;
  }
  
  // Step 2: Check current webhook
  console.log('\n2️⃣ Checking current webhook configuration...');
  try {
    const webhookInfo = await makeRequest(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    if (webhookInfo.ok) {
      const info = webhookInfo.result;
      console.log(`   Current webhook URL: ${info.url || '(not set)'}`);
      console.log(`   Pending updates: ${info.pending_update_count || 0}`);
      console.log(`   Last error date: ${info.last_error_date ? new Date(info.last_error_date * 1000).toISOString() : 'None'}`);
      console.log(`   Last error message: ${info.last_error_message || 'None'}`);
      
      if (info.url !== webhookUrl) {
        console.log(`   ⚠️  Webhook URL mismatch! Expected: ${webhookUrl}`);
        console.log(`   💡 Run the setWebhook command to update it.`);
      } else {
        console.log(`   ✅ Webhook URL matches!`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Error checking webhook: ${error.message}`);
  }
  
  // Step 3: Test webhook endpoint
  console.log('\n3️⃣ Testing webhook endpoint...');
  try {
    const testUrl = new URL(webhookUrl);
    const testPath = testUrl.pathname;
    
    // Try GET request to verify endpoint exists
    const testResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: testUrl.hostname,
        path: testPath,
        method: 'GET',
        headers: {
          'User-Agent': 'Telegram-Bot-Webhook-Verifier'
        }
      };
      
      https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({ status: res.statusCode, data });
        });
      }).on('error', reject).end();
    });
    
    if (testResponse.status === 200) {
      console.log(`   ✅ Webhook endpoint is accessible (HTTP ${testResponse.status})`);
    } else {
      console.log(`   ⚠️  Webhook endpoint returned HTTP ${testResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error testing endpoint: ${error.message}`);
    console.log(`   💡 Make sure your Vercel deployment is live and accessible.`);
  }
  
  // Step 4: Provide setWebhook command
  console.log('\n4️⃣ To set/update the webhook, run:');
  console.log(`\n   curl -F "url=${webhookUrl}" https://api.telegram.org/bot${botToken}/setWebhook\n`);
  console.log('   Or visit this URL in your browser:');
  console.log(`   https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}\n`);
  
  console.log('✅ Verification complete!\n');
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node scripts/verify-telegram-webhook.js <BOT_TOKEN> <WEBHOOK_URL>');
  console.log('\nExample:');
  console.log('  node scripts/verify-telegram-webhook.js 123456:ABC-def https://your-app.vercel.app');
  process.exit(1);
}

const [botToken, webhookUrl] = args;

// Ensure webhook URL includes /api/telegram path
const fullWebhookUrl = webhookUrl.endsWith('/api/telegram') 
  ? webhookUrl 
  : `${webhookUrl.replace(/\/$/, '')}/api/telegram`;

verifyWebhook(botToken, fullWebhookUrl).catch(console.error);

