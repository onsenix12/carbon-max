/**
 * Telegram Keyboard Builders
 * Reusable keyboard builders for Telegram bot
 */

import routesData from '@/data/routes.json';
import circularityActionsData from '@/data/circularityActions.json';
import { SAF_CONSTANTS, SAF_PERCENTAGE_OPTIONS } from '@/lib/constants';

export interface TelegramInlineKeyboardButton {
  text: string;
  callback_data: string;
  url?: string;
}

export interface TelegramInlineKeyboard {
  reply_markup: {
    inline_keyboard: TelegramInlineKeyboardButton[][];
  };
}

/**
 * Calculate SAF contribution cost for a given percentage
 * 
 * @param emissionsKg - Flight emissions in kg CO2e
 * @param percentage - SAF contribution percentage (25, 50, 75, or 100)
 * @returns Cost in USD for the SAF contribution
 * 
 * @example
 * ```typescript
 * const cost = calculateSAFCost(1000, 50); // Cost for 50% SAF coverage
 * ```
 */
export function calculateSAFCost(emissionsKg: number, percentage: 25 | 50 | 75 | 100): number {
  const percentageDecimal = percentage / 100;
  const emissionsToCover = emissionsKg * percentageDecimal;
  const litersNeeded = emissionsToCover / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER;
  return litersNeeded * SAF_CONSTANTS.COST_PER_LITER;
}

/**
 * Build destination selection keyboard for Telegram bot
 * Shows top 6 destinations in a 2-column grid with "Other Destination" option
 * 
 * @returns Telegram inline keyboard with destination options
 */
export function buildDestinationKeyboard(): TelegramInlineKeyboard {
  const topRoutes = routesData.routes.slice(0, 6);
  const keyboard: TelegramInlineKeyboardButton[][] = [];
  
  for (let i = 0; i < topRoutes.length; i += 2) {
    const row: TelegramInlineKeyboardButton[] = [];
    row.push({
      text: `${topRoutes[i].destination_city} (${topRoutes[i].destination})`,
      callback_data: `calc_${topRoutes[i].id}`,
    });
    if (topRoutes[i + 1]) {
      row.push({
        text: `${topRoutes[i + 1].destination_city} (${topRoutes[i + 1].destination})`,
        callback_data: `calc_${topRoutes[i + 1].id}`,
      });
    }
    keyboard.push(row);
  }
  keyboard.push([{ text: '📍 Other Destination', callback_data: 'calc_other' }]);
  
  return {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  };
}

/**
 * Build travel class selection keyboard for Telegram bot
 * Shows Economy, Business, and First class options
 * 
 * @returns Telegram inline keyboard with class options
 */
export function buildClassKeyboard(): TelegramInlineKeyboard {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✈️ Economy (1.0x)', callback_data: 'class_economy' },
          { text: '💼 Business (2.0x)', callback_data: 'class_business' },
        ],
        [
          { text: '👑 First (3.0x)', callback_data: 'class_first' },
        ],
      ],
    },
  };
}

/**
 * Build SAF contribution percentage keyboard for Telegram bot
 * Shows 25%, 50%, 75%, and 100% SAF contribution options with costs
 * 
 * @param emissionsKg - Flight emissions in kg CO2e (used to calculate costs)
 * @returns Telegram inline keyboard with SAF contribution percentage options
 */
export function buildSAFKeyboard(emissionsKg: number): TelegramInlineKeyboard {
  const cost25 = calculateSAFCost(emissionsKg, 25);
  const cost50 = calculateSAFCost(emissionsKg, 50);
  const cost75 = calculateSAFCost(emissionsKg, 75);
  const cost100 = calculateSAFCost(emissionsKg, 100);

  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: `🌿 25% SAF (S$${cost25.toFixed(0)})`, callback_data: 'saf_25' },
          { text: `🌿 50% SAF (S$${cost50.toFixed(0)})`, callback_data: 'saf_50' },
        ],
        [
          { text: `🌿 75% SAF (S$${cost75.toFixed(0)})`, callback_data: 'saf_75' },
          { text: `🌿 100% SAF (S$${cost100.toFixed(0)})`, callback_data: 'saf_100' },
        ],
      ],
    },
  };
}

/**
 * Build circularity actions keyboard for Telegram bot
 * Shows top 6 circularity actions in a 2-column grid
 * 
 * @returns Telegram inline keyboard with circularity action options
 */
export function buildCircularityKeyboard(): TelegramInlineKeyboard {
  const actions = circularityActionsData.actions.slice(0, 6);
  const keyboard: TelegramInlineKeyboardButton[][] = [];
  
  for (let i = 0; i < actions.length; i += 2) {
    const row: TelegramInlineKeyboardButton[] = [];
    const action1 = actions[i] as typeof actions[0] & { icon?: string };
    row.push({
      text: `${action1.icon || '♻️'} ${action1.name}`,
      callback_data: `eco_${action1.id}`,
    });
    if (actions[i + 1]) {
      const action2 = actions[i + 1] as typeof actions[0] & { icon?: string };
      row.push({
        text: `${action2.icon || '♻️'} ${action2.name}`,
        callback_data: `eco_${action2.id}`,
      });
    }
    keyboard.push(row);
  }
  
  return {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  };
}

/**
 * Build confirmation keyboard for Telegram bot
 * Shows Confirm and Cancel buttons for action confirmation
 * 
 * @param action - Action identifier (e.g., 'saf', 'offset')
 * @returns Telegram inline keyboard with confirmation options
 */
export function buildConfirmationKeyboard(action: string): TelegramInlineKeyboard {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Confirm', callback_data: `${action}_confirm` },
          { text: '❌ Cancel', callback_data: `${action}_cancel` },
        ],
      ],
    },
  };
}

/**
 * Build main menu keyboard for Telegram bot
 * Shows primary action buttons in a grid layout
 * 
 * @returns Telegram reply keyboard with main menu options
 */
export function buildMainMenuKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        [
          { text: '✈️ Calculate Flight' },
          { text: '🌿 SAF Info' },
        ],
        [
          { text: '📊 My Journey' },
          { text: '🏆 My Tier' },
        ],
        [
          { text: '🛍️ Green Shops' },
          { text: '♻️ Log Action' },
        ],
        [
          { text: '💬 Ask Max' },
          { text: '🌟 My Impact' },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };
}

