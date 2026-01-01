/**
 * Telegram Bot Utilities
 * Helper functions for message handling
 */

import TelegramBot from 'node-telegram-bot-api';

// Telegram's maximum message length is 4096 characters
export const MAX_MESSAGE_LENGTH = 4096;

/**
 * Split a long message into multiple messages if it exceeds Telegram's limit
 * Attempts to split at sentence boundaries for better readability
 */
export function splitMessage(text: string): string[] {
  if (text.length <= MAX_MESSAGE_LENGTH) {
    return [text];
  }

  const messages: string[] = [];
  let currentMessage = '';
  const sentences = text.split(/([.!?]\s+|\n\n+)/);

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const testMessage = currentMessage + sentence;

    if (testMessage.length <= MAX_MESSAGE_LENGTH) {
      currentMessage = testMessage;
    } else {
      // Current message is full, save it and start a new one
      if (currentMessage.trim()) {
        messages.push(currentMessage.trim());
      }
      currentMessage = sentence;

      // If a single sentence is too long, split it by words
      if (currentMessage.length > MAX_MESSAGE_LENGTH) {
        const words = currentMessage.split(/(\s+)/);
        let wordMessage = '';

        for (const word of words) {
          if ((wordMessage + word).length <= MAX_MESSAGE_LENGTH) {
            wordMessage += word;
          } else {
            if (wordMessage.trim()) {
              messages.push(wordMessage.trim());
            }
            wordMessage = word;
          }
        }
        currentMessage = wordMessage;
      }
    }
  }

  // Add remaining message
  if (currentMessage.trim()) {
    messages.push(currentMessage.trim());
  }

  return messages;
}

/**
 * Send a message that may be longer than Telegram's limit
 * Automatically splits into multiple messages if needed
 * Note: bot instance is imported dynamically to avoid circular dependency
 */
export async function sendLongMessage(
  chatId: number,
  text: string,
  options?: TelegramBot.SendMessageOptions
): Promise<TelegramBot.Message[]> {
  // Import bot dynamically to avoid circular dependency
  const { bot } = await import('./bot');
  const messages = splitMessage(text);
  const sentMessages: TelegramBot.Message[] = [];

  for (let i = 0; i < messages.length; i++) {
    // Add continuation indicator for multi-part messages
    const messageText = messages.length > 1 && i > 0 
      ? `(continued ${i + 1}/${messages.length})\n\n${messages[i]}`
      : messages[i];

    // For multi-part messages, only include keyboard on last message
    const messageOptions = i === messages.length - 1 ? options : { ...options, reply_markup: undefined };

    const message = await bot.sendMessage(chatId, messageText, messageOptions);
    sentMessages.push(message);

    // Small delay between messages to avoid rate limiting
    if (i < messages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return sentMessages;
}

/**
 * Truncate text to fit within Telegram's limit with ellipsis
 */
export function truncateMessage(text: string, maxLength: number = MAX_MESSAGE_LENGTH - 50): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Try to truncate at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastNewline = truncated.lastIndexOf('\n');

  const cutPoint = Math.max(lastPeriod, lastNewline);
  
  if (cutPoint > maxLength * 0.8) {
    // Good cut point found
    return truncated.substring(0, cutPoint + 1) + '\n\n...';
  }

  // Fallback: truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

