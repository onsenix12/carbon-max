/**
 * Telegram Bot - Changi Eco Advisor
 * SAF-first positioning with framework-aligned messaging
 */

import TelegramBot from 'node-telegram-bot-api';
import { calculateFlightEmissions } from '@/lib/emissions/flightCalculator';
import { calculateSAFContribution } from '@/lib/saf/bookAndClaim';
import { askMax } from '@/lib/claude/askMax';
import { generateCompleteImpactStory } from '@/lib/claude/impactStories';
import { getCurrentTier, calculateTierProgress } from '@/lib/rewards/ecoPoints';
import { getWelcomeMessage, getFlightResultMessage, getSAFExplainerMessage, getTierProgressMessage, getJourneySummaryMessage, getImpactStoryMessage, getCircularityActionMessage, getHelpMessage } from './messages';
import { buildDestinationKeyboard, buildClassKeyboard, buildSAFKeyboard, buildCircularityKeyboard, buildTierKeyboard, buildMainMenuKeyboard, buildConfirmationKeyboard } from './keyboards';
import { sendLongMessage } from './utils';

// User session storage (in production, use a database)
interface UserSession {
  userId: string;
  currentFlight?: {
    routeId: string;
    destination: string;
    emissionsKg: number;
    emissionsWithRF: number;
    class: 'economy' | 'business' | 'first';
  };
  journey?: {
    totalEmissions: number;
    netEmissions: number;
    totalPoints: number;
    wasteDiverted: number;
    hasSAF: boolean;
    hasCircularity: boolean;
  };
}

const userSessions: Map<number, UserSession> = new Map();

// Initialize bot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

export const bot = new TelegramBot(token, { polling: false }); // Use webhook instead of polling

/**
 * Get or create user session
 */
function getUserSession(chatId: number): UserSession {
  if (!userSessions.has(chatId)) {
    userSessions.set(chatId, {
      userId: `telegram_${chatId}`,
    });
  }
  return userSessions.get(chatId)!;
}

/**
 * Get user's Green Tier info (mock - in production, fetch from database)
 */
function getUserTierInfo(userId: string) {
  // In production, fetch from database
  const points = 498; // Mock points
  const tier = getCurrentTier(points);
  const progress = calculateTierProgress(points);
  
  return {
    tier,
    points,
    progress,
  };
}

/**
 * Command handlers
 */
export const COMMANDS = {
  '/start': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const session = getUserSession(chatId);
    const tierInfo = getUserTierInfo(session.userId);
    
    const welcomeMsg = getWelcomeMessage(
      tierInfo.tier.name,
      tierInfo.tier.social_signaling.badge_icon,
      tierInfo.points
    );
    
    await sendLongMessage(chatId, welcomeMsg, buildMainMenuKeyboard());
  },

  '/calculate': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(
      chatId,
      '✈️ Select your destination:',
      buildDestinationKeyboard()
    );
  },

  '/saf': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const explainerMsg = getSAFExplainerMessage();
    
    await sendLongMessage(chatId, explainerMsg, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌿 Contribute to SAF', callback_data: 'saf_contribute' }],
          [{ text: '📋 Learn More', callback_data: 'saf_learn_more' }]
        ]
      }
    });
  },

  '/journey': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const session = getUserSession(chatId);
    
    if (session.journey) {
      const summaryMsg = getJourneySummaryMessage(
        session.journey.totalEmissions,
        session.journey.netEmissions,
        session.journey.totalPoints,
        session.journey.wasteDiverted,
        session.journey.hasSAF,
        session.journey.hasCircularity
      );
      await sendLongMessage(chatId, summaryMsg);
    } else {
      await bot.sendMessage(
        chatId,
        '📊 You haven\'t started a journey yet.\n\nUse /calculate to calculate your flight emissions and start tracking your impact!'
      );
    }
  },

  '/shop': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(
      chatId,
      '🛍️ Green Shops at Changi\n\nFind sustainable merchants with high carbon scores:\n\n' +
      '🌿 Top Green Shops:\n' +
      '• Gucci (Carbon Score: A, 1.8x Points)\n' +
      '• Chanel (Carbon Score: A, 1.5x Points)\n' +
      '• Starbucks (Carbon Score: A, 1.5x Points)\n\n' +
      'Use the web app for full shop listings and filters.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 Open Web App', url: 'https://your-app-url.com/shop' }]
          ]
        }
      }
    );
  },

  '/eco': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(
      chatId,
      '♻️ Log a Circularity Action\n\nSelect an action to log:',
      buildCircularityKeyboard()
    );
  },

  '/tier': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const session = getUserSession(chatId);
    const tierInfo = getUserTierInfo(session.userId);
    
    const progressMsg = getTierProgressMessage(
      tierInfo.tier.name,
      tierInfo.tier.social_signaling.badge_icon,
      tierInfo.points,
      tierInfo.progress.progressToNext?.nextTier ? {
        name: tierInfo.progress.progressToNext.nextTier.name,
        minPoints: tierInfo.progress.progressToNext.nextTier.minPoints,
      } : undefined,
      tierInfo.progress.pointsUntilNextTier ?? undefined,
      tierInfo.progress.progressToNext?.progressPercent
    );
    
    await sendLongMessage(chatId, progressMsg, buildTierKeyboard());
  },

  '/ask': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const question = msg.text?.replace('/ask', '').trim() || '';
    
    if (!question) {
      await bot.sendMessage(
        chatId,
        '💬 Ask Max anything about sustainability!\n\nExample: /ask Why is SAF better than offsets?'
      );
      return;
    }
    
    // Show typing indicator
    await bot.sendChatAction(chatId, 'typing');
    
    try {
      const session = getUserSession(chatId);
      const tierInfo = getUserTierInfo(session.userId);
      
      // Build context (simplified - in production, fetch from database)
      const journeyContext = {
        flight: session.currentFlight ? {
          origin: 'SIN',
          destination: session.currentFlight.destination,
          emissions: session.currentFlight.emissionsKg,
          emissionsWithRF: session.currentFlight.emissionsWithRF,
          includeRF: true,
        } : undefined,
        transport: [],
        shopping: [],
        dining: [],
        circularity: [],
        totalEcoPointsEarned: tierInfo.points,
        totalEmissions: session.currentFlight?.emissionsKg || 0,
        netEmissions: session.currentFlight ? session.currentFlight.emissionsKg - (session.currentFlight.emissionsKg * 0.1) : 0,
        totalWasteDiverted: 0,
      };
      
      const greenTierContext = {
        currentTier: {
          id: tierInfo.tier.id,
          name: tierInfo.tier.name,
          level: tierInfo.tier.level,
          points_multiplier: tierInfo.tier.points_multiplier,
        },
        totalEcoPoints: tierInfo.points,
        lifetimeEcoPoints: tierInfo.points,
        pointsToNextTier: tierInfo.progress.pointsUntilNextTier ?? null,
        progressPercent: tierInfo.progress.progressToNext?.progressPercent ?? 0,
      };
      
      const response = await askMax(question, journeyContext, greenTierContext);
      await sendLongMessage(chatId, response);
    } catch (error) {
      console.error('Error asking Max:', error);
      await bot.sendMessage(
        chatId,
        'Sorry, I encountered an error. Please try again later.'
      );
    }
  },

  '/impact': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    await bot.sendChatAction(chatId, 'typing');
    
    try {
      const session = getUserSession(chatId);
      const tierInfo = getUserTierInfo(session.userId);
      
      // Build context (simplified)
      const journeyContext = {
        flight: session.currentFlight ? {
          origin: 'SIN',
          destination: session.currentFlight.destination,
          emissions: session.currentFlight.emissionsKg,
          emissionsWithRF: session.currentFlight.emissionsWithRF,
          includeRF: true,
          safContribution: session.journey?.hasSAF ? {
            amount: 50,
            liters: 20,
            emissionsReduced: 45,
            provider: 'neste_singapore',
            timestamp: new Date().toISOString(),
          } : undefined,
        } : undefined,
        transport: [],
        shopping: [],
        dining: [],
        circularity: session.journey?.hasCircularity ? [{
          actionName: 'Cup-as-a-Service',
          wasteDiverted: session.journey.wasteDiverted,
          ecoPointsEarned: 10,
        }] : [],
        totalEcoPointsEarned: tierInfo.points,
        totalEmissions: session.currentFlight?.emissionsKg || 0,
        netEmissions: session.currentFlight ? session.currentFlight.emissionsKg - (session.currentFlight.emissionsKg * 0.1) : 0,
        totalWasteDiverted: session.journey?.wasteDiverted || 0,
      };
      
      const greenTierContext = {
        currentTier: {
          id: tierInfo.tier.id,
          name: tierInfo.tier.name,
          level: tierInfo.tier.level,
          points_multiplier: tierInfo.tier.points_multiplier,
        },
        totalEcoPoints: tierInfo.points,
        lifetimeEcoPoints: tierInfo.points,
        pointsToNextTier: tierInfo.progress.pointsUntilNextTier ?? null,
        progressPercent: tierInfo.progress.progressToNext?.progressPercent ?? 0,
      };
      
      const story = await generateCompleteImpactStory(journeyContext, greenTierContext);
      const impactMsg = getImpactStoryMessage(story);
      
      await sendLongMessage(chatId, impactMsg);
    } catch (error) {
      console.error('Error generating impact story:', error);
      await bot.sendMessage(
        chatId,
        'Sorry, I couldn\'t generate your impact story. Please make sure you have some actions logged first!'
      );
    }
  },

  '/help': async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    await sendLongMessage(chatId, getHelpMessage());
  },
};

/**
 * Handle callback queries (button presses)
 */
export async function handleCallbackQuery(query: TelegramBot.CallbackQuery) {
  const chatId = query.message?.chat.id;
  const data = query.data;
  
  if (!chatId || !data) return;
  
  const session = getUserSession(chatId);
  
  // Handle destination selection
  if (data.startsWith('destination_')) {
    const routeId = data.replace('destination_', '');
    if (routeId === 'other') {
      await bot.sendMessage(chatId, 'Please enter your destination airport code (e.g., LHR, JFK, NRT)');
      return;
    }
    
    // Calculate emissions for selected route
    await bot.sendMessage(chatId, 'Select your travel class:', buildClassKeyboard());
    // Store route selection in session
    // In production, fetch route data from database
  }
  
  // Handle class selection
  if (data.startsWith('class_')) {
    const classType = data.replace('class_', '');
    if (classType === 'info') {
      await bot.sendMessage(
        chatId,
        '✈️ Travel Class Multipliers:\n\n' +
        '• Economy: 1.0x (baseline)\n' +
        '• Business: 2.0x (more space = more emissions)\n' +
        '• First: 3.0x (most space = most emissions)\n\n' +
        'Choose economy class to reduce your footprint!'
      );
      return;
    }
    
    // Calculate and show results
    // In production, use actual route and class data
    const emissionsKg = 1842; // Mock
    const emissionsWithRF = emissionsKg * 1.9;
    
    session.currentFlight = {
      routeId: 'SIN-LHR',
      destination: 'London',
      emissionsKg,
      emissionsWithRF,
      class: classType as 'economy' | 'business' | 'first',
    };
    
      const resultMsg = getFlightResultMessage('London', emissionsKg, emissionsWithRF);
      await sendLongMessage(chatId, resultMsg, buildSAFKeyboard(emissionsKg));
  }
  
  // Handle SAF contribution
  if (data.startsWith('saf_')) {
    if (data === 'saf_info') {
      await sendLongMessage(chatId, getSAFExplainerMessage());
      return;
    }
    if (data === 'saf_cancel') {
      await bot.sendMessage(chatId, 'SAF contribution cancelled.');
      return;
    }
    
    const percent = parseInt(data.replace('saf_', ''));
    if (session.currentFlight) {
      const emissionsToCover = session.currentFlight.emissionsKg * (percent / 100);
      const litersNeeded = emissionsToCover / 2.27;
      const contributionAmount = litersNeeded * 2.5;
      
      const safResult = calculateSAFContribution({
        routeId: session.currentFlight.routeId,
        emissionsKg: emissionsToCover,
        contributionAmount,
        safType: 'waste_based',
        provider: 'neste_singapore',
      });
      
      const confirmMsg = `🌿 SAF Contribution Confirmation\n\n` +
        `Coverage: ${percent}%\n` +
        `Amount: S$${contributionAmount.toFixed(2)}\n` +
        `Liters: ${safResult.litersAttributed.toFixed(1)}L\n` +
        `CO₂e Avoided: ${safResult.co2eAvoided.toFixed(1)} kg\n` +
        `⭐ Eco-Points: +${safResult.ecoPointsEarned}\n\n` +
        `Confirm this contribution?`;
      
      await sendLongMessage(chatId, confirmMsg, buildConfirmationKeyboard('saf'));
    }
  }
  
  // Handle circularity actions
  if (data.startsWith('circularity_')) {
    const actionId = data.replace('circularity_', '');
    // In production, fetch action data and log it
    const actionMsg = getCircularityActionMessage('Cup-as-a-Service', 10, 15);
    await sendLongMessage(chatId, actionMsg);
  }
  
  // Handle confirmations
  if (data.startsWith('confirm_')) {
    const [action, decision] = data.replace('confirm_', '').split('_');
    if (decision === 'yes') {
      await bot.sendMessage(chatId, '✅ Action confirmed! Thank you for your contribution.');
    } else {
      await bot.sendMessage(chatId, '❌ Action cancelled.');
    }
  }
}

/**
 * Handle text messages (main menu buttons)
 */
export async function handleTextMessage(msg: TelegramBot.Message) {
  const text = msg.text?.toLowerCase() || '';
  const chatId = msg.chat.id;
  
  // Handle main menu buttons
  if (text.includes('calculate flight')) {
    await COMMANDS['/calculate'](msg);
  } else if (text.includes('saf info')) {
    await COMMANDS['/saf'](msg);
  } else if (text.includes('my journey')) {
    await COMMANDS['/journey'](msg);
  } else if (text.includes('my tier')) {
    await COMMANDS['/tier'](msg);
  } else if (text.includes('green shops')) {
    await COMMANDS['/shop'](msg);
  } else if (text.includes('log action')) {
    await COMMANDS['/eco'](msg);
  } else if (text.includes('ask max')) {
    await bot.sendMessage(chatId, '💬 What would you like to ask Max? Type your question.');
  } else if (text.includes('my impact')) {
    await COMMANDS['/impact'](msg);
  }
}

