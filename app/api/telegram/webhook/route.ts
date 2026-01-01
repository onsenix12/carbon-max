/**
 * Telegram Bot Webhook Handler
 * Receives updates from Telegram and processes commands
 */

import { NextRequest, NextResponse } from 'next/server';
import { bot, COMMANDS, handleCallbackQuery, handleTextMessage } from '@/lib/telegram/bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle different update types
    if (body.message) {
      const msg = body.message;
      const text = msg.text || '';
      
      // Check if it's a command
      if (text.startsWith('/')) {
        const command = text.split(' ')[0] as keyof typeof COMMANDS;
        if (COMMANDS[command]) {
          await COMMANDS[command](msg);
        } else {
          await bot.sendMessage(msg.chat.id, 'Unknown command. Type /help for available commands.');
        }
      } else {
        // Handle text messages (main menu buttons, etc.)
        await handleTextMessage(msg);
      }
    } else if (body.callback_query) {
      // Handle callback queries (button presses)
      await handleCallbackQuery(body.callback_query);
      // Answer callback query to remove loading state
      await bot.answerCallbackQuery(body.callback_query.id);
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { logError } = await import('@/lib/utils/errors');
    logError(error, { endpoint: '/api/telegram/webhook' });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for webhook verification (if needed)
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'Telegram webhook is active' });
}

