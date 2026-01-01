/**
 * Telegram Bot Keyboard Builders
 * Interactive keyboards for user actions
 */

import routesData from '@/data/routes.json';
import circularityActionsData from '@/data/circularityActions.json';

/**
 * Build destination selection keyboard (top 6 destinations)
 */
export function buildDestinationKeyboard() {
  const topRoutes = routesData.routes.slice(0, 6);
  
  // Create keyboard rows (2 buttons per row)
  const keyboard = [];
  for (let i = 0; i < topRoutes.length; i += 2) {
    const row = [];
    row.push({
      text: `${topRoutes[i].destination_city} (${topRoutes[i].destination})`,
      callback_data: `destination_${topRoutes[i].id}`
    });
    if (topRoutes[i + 1]) {
      row.push({
        text: `${topRoutes[i + 1].destination_city} (${topRoutes[i + 1].destination})`,
        callback_data: `destination_${topRoutes[i + 1].id}`
      });
    }
    keyboard.push(row);
  }
  keyboard.push([{ text: '📍 Other Destination', callback_data: 'destination_other' }]);
  
  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

/**
 * Build travel class selection keyboard with Eco-Points indicator
 */
export function buildClassKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✈️ Economy (1.0x)', callback_data: 'class_economy' },
          { text: '💼 Business (2.0x)', callback_data: 'class_business' }
        ],
        [
          { text: '👑 First (3.0x)', callback_data: 'class_first' }
        ],
        [
          { text: 'ℹ️ About Multipliers', callback_data: 'class_info' }
        ]
      ]
    }
  };
}

/**
 * Build SAF contribution percentage keyboard
 */
export function buildSAFKeyboard(emissionsKg: number) {
  // Calculate costs for each percentage
  const calculateCost = (percent: number) => {
    const emissionsToCover = emissionsKg * (percent / 100);
    const litersNeeded = emissionsToCover / 2.27; // 2.27 kg CO2e reduction per liter
    return litersNeeded * 2.5; // $2.5 per liter premium
  };

  return {
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: `🌿 25% SAF (S$${calculateCost(25).toFixed(0)})`, 
            callback_data: `saf_25` 
          },
          { 
            text: `🌿 50% SAF (S$${calculateCost(50).toFixed(0)})`, 
            callback_data: `saf_50` 
          }
        ],
        [
          { 
            text: `🌿 75% SAF (S$${calculateCost(75).toFixed(0)})`, 
            callback_data: `saf_75` 
          },
          { 
            text: `🌿 100% SAF (S$${calculateCost(100).toFixed(0)})`, 
            callback_data: `saf_100` 
          }
        ],
        [
          { text: 'ℹ️ Learn About SAF', callback_data: 'saf_info' },
          { text: '❌ Cancel', callback_data: 'saf_cancel' }
        ]
      ]
    }
  };
}

/**
 * Build circularity actions keyboard
 */
export function buildCircularityKeyboard() {
  const actions = circularityActionsData.actions.slice(0, 6); // Top 6 actions
  
  const keyboard = [];
  for (let i = 0; i < actions.length; i += 2) {
    const row = [];
    const action1 = actions[i] as typeof actions[0] & { icon?: string };
    row.push({
      text: `${action1.icon || '♻️'} ${action1.name}`,
      callback_data: `circularity_${action1.id}`
    });
    if (actions[i + 1]) {
      const action2 = actions[i + 1] as typeof actions[0] & { icon?: string };
      row.push({
        text: `${action2.icon || '♻️'} ${action2.name}`,
        callback_data: `circularity_${action2.id}`
      });
    }
    keyboard.push(row);
  }
  
  keyboard.push([
    { text: '📋 View All Actions', callback_data: 'circularity_all' }
  ]);
  
  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

/**
 * Build tier info and progress keyboard
 */
export function buildTierKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📊 View Progress', callback_data: 'tier_progress' },
          { text: '🏆 View Badges', callback_data: 'tier_badges' }
        ],
        [
          { text: '📈 View Leaderboard', callback_data: 'tier_leaderboard' },
          { text: '💎 View Perks', callback_data: 'tier_perks' }
        ]
      ]
    }
  };
}

/**
 * Build main menu keyboard
 */
export function buildMainMenuKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        [
          { text: '✈️ Calculate Flight' },
          { text: '🌿 SAF Info' }
        ],
        [
          { text: '📊 My Journey' },
          { text: '🏆 My Tier' }
        ],
        [
          { text: '🛍️ Green Shops' },
          { text: '♻️ Log Action' }
        ],
        [
          { text: '💬 Ask Max' },
          { text: '🌟 My Impact' }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
}

/**
 * Build yes/no confirmation keyboard
 */
export function buildConfirmationKeyboard(action: string) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Yes', callback_data: `confirm_${action}_yes` },
          { text: '❌ No', callback_data: `confirm_${action}_no` }
        ]
      ]
    }
  };
}

