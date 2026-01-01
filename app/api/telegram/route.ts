/**
 * Telegram Webhook Handler
 * Full command support with SAF-first positioning
 */

import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { calculateFlightEmissions } from '@/lib/emissions/flightCalculator';
import { calculateSAFContribution } from '@/lib/saf/bookAndClaim';
import { askMax, type JourneyContext, type GreenTierContext } from '@/lib/claude/askMax';
import { generateCompleteImpactStory } from '@/lib/claude/impactStories';
import { getCurrentTier, calculateTierProgress, calculateEcoPoints } from '@/lib/rewards/ecoPoints';
import routesData from '@/data/routes.json';
import circularityActionsData from '@/data/circularityActions.json';
import merchantsData from '@/data/merchants.json';
import { sendLongMessage } from '@/lib/telegram/utils';
import { evaluateNudges, getTelegramNudge, markNudgeSent, markNudgeDismissed, type NudgeContext } from '@/lib/claude/nudges';
import { ActivityLogger } from '@/lib/activity/logger';
import { AppUrls } from '@/lib/config';
import { logError } from '@/lib/utils/errors';

// Initialize bot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

// Use polling in development, webhook in production
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.VERCEL;

// Initialize bot with polling in development, webhook in production
const bot = isDevelopment 
  ? new TelegramBot(token, { polling: true })
  : new TelegramBot(token, { polling: false });

// Module-level flag to ensure handlers are set up only once
let handlersSetup = false;

// User session storage (in-memory, keyed by chatId)
interface UserSession {
  userId: string;
  currentFlight?: {
    routeId: string;
    destination: string;
    destinationCity: string;
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
  safContribution?: {
    percent: number;
    amount: number;
    liters: number;
    co2eAvoided: number;
    pending: boolean;
  };
  conversationState?: 'awaiting_destination' | 'awaiting_class' | 'awaiting_saf_confirm';
}

const userSessions: Map<number, UserSession> = new Map();

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
 * Build destination keyboard
 */
function buildDestinationKeyboard() {
  const topRoutes = routesData.routes.slice(0, 6);
  const keyboard = [];
  
  for (let i = 0; i < topRoutes.length; i += 2) {
    const row = [];
    row.push({
      text: `${topRoutes[i].destination_city} (${topRoutes[i].destination})`,
      callback_data: `calc_${topRoutes[i].id}`
    });
    if (topRoutes[i + 1]) {
      row.push({
        text: `${topRoutes[i + 1].destination_city} (${topRoutes[i + 1].destination})`,
        callback_data: `calc_${topRoutes[i + 1].id}`
      });
    }
    keyboard.push(row);
  }
  keyboard.push([{ text: '📍 Other Destination', callback_data: 'calc_other' }]);
  
  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

/**
 * Build class selection keyboard
 */
function buildClassKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✈️ Economy (1.0x)', callback_data: 'class_economy' },
          { text: '💼 Business (2.0x)', callback_data: 'class_business' }
        ],
        [
          { text: '👑 First (3.0x)', callback_data: 'class_first' }
        ]
      ]
    }
  };
}

/**
 * Build SAF contribution percentage keyboard
 */
function buildSAFKeyboard(emissionsKg: number) {
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
        ]
      ]
    }
  };
}

/**
 * Build circularity actions keyboard
 */
function buildCircularityKeyboard() {
  const actions = circularityActionsData.actions.slice(0, 6);
  const keyboard = [];
  
  for (let i = 0; i < actions.length; i += 2) {
    const row = [];
    const action1 = actions[i] as typeof actions[0] & { icon?: string };
    row.push({
      text: `${action1.icon || '♻️'} ${action1.name}`,
      callback_data: `eco_${action1.id}`
    });
    if (actions[i + 1]) {
      const action2 = actions[i + 1] as typeof actions[0] & { icon?: string };
      row.push({
        text: `${action2.icon || '♻️'} ${action2.name}`,
        callback_data: `eco_${action2.id}`
      });
    }
    keyboard.push(row);
  }
  
  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

/**
 * Build confirmation keyboard
 */
function buildConfirmationKeyboard(action: string) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Confirm', callback_data: `${action}_confirm` },
          { text: '❌ Cancel', callback_data: `${action}_cancel` }
        ]
      ]
    }
  };
}

/**
 * Format tier progress with visual bar
 */
function formatTierProgress(tierName: string, tierIcon: string, points: number, progressPercent?: number, nextTier?: { name: string; minPoints: number }, pointsNeeded?: number) {
  let message = `${tierIcon} ${tierName} Tier\n\n`;
  message += `Current Points: ${points.toLocaleString()}\n`;
  
  if (nextTier && pointsNeeded !== undefined) {
    message += `\n📊 Progress to ${nextTier.name}:\n`;
    message += `• Points needed: ${pointsNeeded.toLocaleString()}\n`;
    if (progressPercent !== undefined) {
      const filled = Math.floor(progressPercent / 10);
      const empty = 10 - filled;
      const progressBar = '█'.repeat(filled) + '░'.repeat(empty);
      message += `• Progress: ${progressBar} ${progressPercent.toFixed(0)}%\n`;
    }
  } else if (progressPercent !== undefined) {
    const filled = Math.floor(progressPercent / 10);
    const empty = 10 - filled;
    const progressBar = '█'.repeat(filled) + '░'.repeat(empty);
    message += `\nProgress: ${progressBar} ${progressPercent.toFixed(0)}%\n`;
  }
  
  return message;
}

/**
 * Handle /start command
 */
async function handleStart(chatId: number) {
  const session = getUserSession(chatId);
  const tierInfo = getUserTierInfo(session.userId);
  
  const welcomeMsg = `🌱 Welcome to Changi Eco Advisor!\n\n` +
    `I'm Max, your sustainable travel companion at Changi Airport. I help you understand and reduce your carbon footprint while earning Eco-Points.\n\n` +
    `Your Status:\n` +
    `${tierInfo.tier.social_signaling.badge_icon} ${tierInfo.tier.name} Tier\n` +
    `⭐ ${tierInfo.points.toLocaleString()} Eco-Points\n\n` +
    `🇸🇬 Singapore's 2026 SAF Mandate:\n` +
    `Starting 2026, all flights from Singapore must use at least 1% Sustainable Aviation Fuel (SAF). You can contribute now and be ahead of the curve!\n\n` +
    `What would you like to do?\n` +
    `• Calculate your flight emissions\n` +
    `• Learn about SAF contributions\n` +
    `• Find green-rated shops\n` +
    `• Log circularity actions\n` +
    `• Check your Green Tier progress\n\n` +
    `Type /help to see all commands.`;
  
  await sendLongMessage(chatId, welcomeMsg, {
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
  });
}

/**
 * Handle /calculate command
 */
async function handleCalculate(chatId: number, args?: string) {
  const session = getUserSession(chatId);
  
  if (args && args.trim()) {
    // User provided destination directly
    const destination = args.trim().toUpperCase();
    const route = routesData.routes.find(r => 
      r.destination === destination || 
      r.destination_city.toLowerCase() === destination.toLowerCase()
    );
    
    if (route) {
      session.conversationState = 'awaiting_class';
      await bot.sendMessage(chatId, `✈️ Found route to ${route.destination_city} (${route.destination})\n\nSelect your travel class:`, buildClassKeyboard());
    } else {
      await bot.sendMessage(chatId, `📍 Destination "${args}" not found. Please select from the list:`, buildDestinationKeyboard());
    }
  } else {
    // Show destination selection
    session.conversationState = 'awaiting_destination';
    await bot.sendMessage(chatId, '✈️ Select your destination:', buildDestinationKeyboard());
  }
}

/**
 * Handle /saf command
 */
async function handleSAF(chatId: number) {
  const session = getUserSession(chatId);
  
  const explainerMsg = `🌿 Sustainable Aviation Fuel (SAF)\n\n` +
    `What is SAF?\n` +
    `Sustainable Aviation Fuel is a drop-in replacement for conventional jet fuel made from renewable feedstocks such as used cooking oil, municipal waste, and agricultural residues. SAF can reduce lifecycle CO2 emissions by up to 90% compared to conventional jet fuel.\n\n` +
    `How It Works:\n` +
    `SAF is produced at certified facilities using sustainable feedstocks. The fuel meets the same technical specifications as conventional jet fuel and can be blended up to 50% with conventional fuel without any modifications to aircraft or infrastructure.\n\n` +
    `📋 Book-and-Claim:\n` +
    `Through the book-and-claim system, you can contribute to SAF production even if your specific flight doesn't use it directly. Your contribution is verified and tracked through the IATA Book-and-Claim Registry.\n\n` +
    `Benefits:\n` +
    `• Directly reduces aviation emissions at the source\n` +
    `• Supports the transition to sustainable aviation\n` +
    `• Verified and certified through international standards\n` +
    `• Earns Eco-Points for your contribution\n\n` +
    `🌍 Impact:\n` +
    `By contributing to SAF, you're directly supporting the production and use of sustainable aviation fuel. Each liter of SAF reduces emissions by approximately 2.27 kg CO2e compared to conventional fuel (90% reduction for waste-based SAF).\n\n` +
    `🇸🇬 Singapore Mandate:\n` +
    `Starting 2026, all flights from Singapore must use at least 1% SAF. By contributing now, you're supporting the transition to sustainable aviation.\n\n`;
  
  if (session.currentFlight) {
    // Show SAF contribution options for current flight
    await sendLongMessage(chatId, explainerMsg + `\n\nContribute to SAF for your ${session.currentFlight.destinationCity} flight?`, buildSAFKeyboard(session.currentFlight.emissionsKg));
  } else {
    await sendLongMessage(chatId, explainerMsg + `\n\nUse /calculate to calculate your flight emissions and contribute to SAF.`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✈️ Calculate Flight', callback_data: 'calc_start' }]
        ]
      }
    });
  }
}

/**
 * Handle /journey command
 */
async function handleJourney(chatId: number) {
  const session = getUserSession(chatId);
  
  if (session.journey) {
    let message = `📊 Your Journey Summary\n\n`;
    message += `Carbon Footprint:\n`;
    message += `• Total: ${session.journey.totalEmissions.toLocaleString()} kg CO₂e\n`;
    message += `• Net (after actions): ${session.journey.netEmissions.toLocaleString()} kg CO₂e\n`;
    message += `• Reduced: ${(session.journey.totalEmissions - session.journey.netEmissions).toLocaleString()} kg CO₂e\n\n`;
    
    if (session.journey.hasSAF) {
      message += `🌿 SAF Contribution: ✓\n`;
    }
    if (session.journey.hasCircularity) {
      message += `♻️ Circularity Actions: ✓\n`;
      message += `• Waste Diverted: ${(session.journey.wasteDiverted / 1000).toFixed(2)} kg\n`;
    }
    
    message += `\n⭐ Eco-Points Earned: ${session.journey.totalPoints.toLocaleString()}`;
    
    await sendLongMessage(chatId, message);
  } else {
    await bot.sendMessage(
      chatId,
      '📊 You haven\'t started a journey yet.\n\nUse /calculate to calculate your flight emissions and start tracking your impact!'
    );
  }
}

/**
 * Handle /shop command
 */
async function handleShop(chatId: number, category?: string) {
  const filteredMerchants = category
    ? merchantsData.merchants.filter(m => m.category === category)
    : merchantsData.merchants;
  
  const topMerchants = filteredMerchants
    .sort((a, b) => b.carbon_score - a.carbon_score)
    .slice(0, 10);
  
  let message = `🛍️ Green Shops at Changi\n\n`;
  message += `Find sustainable merchants with high carbon scores:\n\n`;
  
  topMerchants.forEach((merchant, index) => {
    const scoreBar = '█'.repeat(merchant.carbon_score) + '░'.repeat(merchant.carbon_score_max - merchant.carbon_score);
    message += `${index + 1}. ${merchant.name}\n`;
    message += `   Carbon Score: ${scoreBar} ${merchant.carbon_score}/${merchant.carbon_score_max}\n`;
    message += `   Points Multiplier: ${merchant.eco_points_multiplier}x\n`;
    message += `   Terminal: ${merchant.terminal.join(', ')}\n\n`;
  });
  
  message += `Use the web app for full shop listings and filters.`;
  
  await sendLongMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🌐 Open Web App', url: AppUrls.shop() }]
      ]
    }
  });
}

/**
 * Handle /eco command
 */
async function handleEco(chatId: number, action?: string) {
  if (action) {
    // Log specific action
    const actionData = circularityActionsData.actions.find(a => a.id === action);
    if (actionData) {
      const session = getUserSession(chatId);
      const pointsResult = calculateEcoPoints({
        actionType: 'circularity_action',
        actionId: action,
      });
      
      if (!session.journey) {
        session.journey = {
          totalEmissions: 0,
          netEmissions: 0,
          totalPoints: 0,
          wasteDiverted: 0,
          hasSAF: false,
          hasCircularity: false,
        };
      }
      
      session.journey.totalPoints += pointsResult.finalPoints;
      session.journey.wasteDiverted += actionData.waste_diverted_grams;
      session.journey.hasCircularity = true;
      
      const message = `♻️ Circularity Action Logged!\n\n` +
        `Action: ${actionData.name}\n` +
        `⭐ Eco-Points: +${pointsResult.finalPoints}\n` +
        `🗑️ Waste Diverted: ${actionData.waste_diverted_grams}g\n\n` +
        `Thank you for contributing to Changi's circular economy!`;
      
      await sendLongMessage(chatId, message);
    } else {
      await bot.sendMessage(chatId, `Action "${action}" not found. Use /eco to see available actions.`);
    }
  } else {
    await bot.sendMessage(chatId, '♻️ Log a Circularity Action\n\nSelect an action to log:', buildCircularityKeyboard());
  }
}

/**
 * Handle /tier command
 */
async function handleTier(chatId: number) {
  const session = getUserSession(chatId);
  const tierInfo = getUserTierInfo(session.userId);
  
  let progressMsg = formatTierProgress(
    tierInfo.tier.name,
    tierInfo.tier.social_signaling.badge_icon,
    tierInfo.points,
    tierInfo.progress.progressToNext?.progressPercent,
    tierInfo.progress.progressToNext?.nextTier ? {
      name: tierInfo.progress.progressToNext.nextTier.name,
      minPoints: tierInfo.progress.progressToNext.nextTier.minPoints,
    } : undefined,
    tierInfo.progress.pointsUntilNextTier ?? undefined
  );
  
  if (!tierInfo.progress.progressToNext?.nextTier) {
    progressMsg += `\n🏆 You've reached the highest tier!`;
  }
  
  await sendLongMessage(chatId, progressMsg);
}

/**
 * Handle /ask command
 */
async function handleAsk(chatId: number, question?: string) {
  if (!question || !question.trim()) {
    await bot.sendMessage(
      chatId,
      '💬 Ask Max anything about sustainability!\n\nExample: /ask Why is SAF better than offsets?'
    );
    return;
  }
  
  await bot.sendChatAction(chatId, 'typing');
  
  try {
    const session = getUserSession(chatId);
    const tierInfo = getUserTierInfo(session.userId);
    
    // Build context
    const journeyContext: JourneyContext = {
      flight: session.currentFlight ? {
        origin: 'SIN',
        destination: session.currentFlight.destination,
        emissions: session.currentFlight.emissionsKg,
        emissionsWithRF: session.currentFlight.emissionsWithRF,
        includeRF: true,
        safContribution: session.safContribution ? {
          amount: session.safContribution.amount,
          liters: session.safContribution.liters,
          emissionsReduced: session.safContribution.co2eAvoided,
        } : undefined,
      } : undefined,
      transport: [],
      shopping: [],
      dining: [],
      circularity: session.journey?.hasCircularity ? [{
        actionName: 'Circularity Action',
        wasteDiverted: session.journey.wasteDiverted,
        ecoPointsEarned: 10,
      }] : [],
      totalEcoPointsEarned: tierInfo.points,
      totalEmissions: session.currentFlight?.emissionsKg || 0,
      netEmissions: session.currentFlight ? session.currentFlight.emissionsKg - (session.currentFlight.emissionsKg * 0.1) : 0,
      totalWasteDiverted: session.journey?.wasteDiverted || 0,
    };
    
    const greenTierContext: GreenTierContext = {
      currentTier: {
        id: tierInfo.tier.id,
        name: tierInfo.tier.name,
        level: tierInfo.tier.level,
        points_multiplier: tierInfo.tier.points_multiplier,
      },
      totalEcoPoints: tierInfo.points,
      lifetimeEcoPoints: tierInfo.points,
      pointsToNextTier: tierInfo.progress.pointsUntilNextTier,
      progressPercent: tierInfo.progress.progressToNext?.progressPercent ?? 0,
    };
    
    const response = await askMax(question, journeyContext, greenTierContext);
    await sendLongMessage(chatId, response);
  } catch (error) {
    logError(error, { endpoint: 'handleAsk', chatId });
    await bot.sendMessage(
      chatId,
      'Sorry, I encountered an error. Please try again later.'
    );
  }
}

/**
 * Handle /impact command
 */
async function handleImpact(chatId: number) {
  await bot.sendChatAction(chatId, 'typing');
  
  try {
    const session = getUserSession(chatId);
    const tierInfo = getUserTierInfo(session.userId);
    
    // Build context
    const journeyContext: JourneyContext = {
      flight: session.currentFlight ? {
        origin: 'SIN',
        destination: session.currentFlight.destination,
        emissions: session.currentFlight.emissionsKg,
        emissionsWithRF: session.currentFlight.emissionsWithRF,
        includeRF: true,
        safContribution: session.safContribution ? {
          amount: session.safContribution.amount,
          liters: session.safContribution.liters,
          emissionsReduced: session.safContribution.co2eAvoided,
        } : undefined,
      } : undefined,
      transport: [],
      shopping: [],
      dining: [],
      circularity: session.journey?.hasCircularity ? [{
        actionName: 'Circularity Action',
        wasteDiverted: session.journey.wasteDiverted,
        ecoPointsEarned: 10,
      }] : [],
      totalEcoPointsEarned: tierInfo.points,
      totalEmissions: session.currentFlight?.emissionsKg || 0,
      netEmissions: session.currentFlight ? session.currentFlight.emissionsKg - (session.currentFlight.emissionsKg * 0.1) : 0,
      totalWasteDiverted: session.journey?.wasteDiverted || 0,
    };
    
    const greenTierContext: GreenTierContext = {
      currentTier: {
        id: tierInfo.tier.id,
        name: tierInfo.tier.name,
        level: tierInfo.tier.level,
        points_multiplier: tierInfo.tier.points_multiplier,
      },
      totalEcoPoints: tierInfo.points,
      lifetimeEcoPoints: tierInfo.points,
      pointsToNextTier: tierInfo.progress.pointsUntilNextTier,
      progressPercent: tierInfo.progress.progressToNext?.progressPercent ?? 0,
    };
    
    const story = await generateCompleteImpactStory(journeyContext, greenTierContext);
    
    let message = `🌟 ${story.title}\n\n`;
    message += `${story.narrative}\n\n`;
    message += `Impact Details:\n`;
    message += `• Emissions Reduced: ${story.details.emissionsReduced.toLocaleString()} kg CO₂e\n`;
    if (story.details.safContribution) {
      message += `• SAF Contribution: S$${story.details.safContribution.toFixed(2)}\n`;
    }
    message += `• Eco-Points Earned: ${story.details.ecoPointsEarned.toLocaleString()}\n`;
    message += `• Actions: ${story.details.actions.join(', ')}\n`;
    
    await sendLongMessage(chatId, message);
  } catch (error) {
    logError(error, { endpoint: 'handleImpact', chatId });
    await bot.sendMessage(
      chatId,
      'Sorry, I couldn\'t generate your impact story. Please make sure you have some actions logged first!'
    );
  }
}

/**
 * Handle callback queries
 */
async function handleCallbackQuery(query: TelegramBot.CallbackQuery) {
  const chatId = query.message?.chat.id;
  const data = query.data;
  
  if (!chatId || !data) {
    await bot.answerCallbackQuery(query.id, { text: 'Error processing request' });
    return;
  }
  
  const session = getUserSession(chatId);
  
  try {
    // Handle destination selection (calc_[routeId])
    if (data.startsWith('calc_')) {
      const routeId = data.replace('calc_', '');
      
      if (routeId === 'other') {
        await bot.sendMessage(chatId, 'Please enter your destination airport code (e.g., LHR, JFK, NRT)');
        session.conversationState = 'awaiting_destination';
        await bot.answerCallbackQuery(query.id);
        return;
      }
      
      if (routeId === 'start') {
        await handleCalculate(chatId);
        await bot.answerCallbackQuery(query.id);
        return;
      }
      
      const route = routesData.routes.find(r => r.id === routeId);
      if (route) {
        // Store route selection temporarily
        session.currentFlight = {
          routeId: route.id,
          destination: route.destination,
          destinationCity: route.destination_city,
          emissionsKg: 0, // Will be calculated after class selection
          emissionsWithRF: 0,
          class: 'economy', // Default, will be updated
        };
        session.conversationState = 'awaiting_class';
        await bot.sendMessage(chatId, `✈️ Selected: ${route.destination_city} (${route.destination})\n\nSelect your travel class:`, buildClassKeyboard());
      }
      await bot.answerCallbackQuery(query.id);
      return;
    }
    
    // Handle class selection (class_[class])
    if (data.startsWith('class_')) {
      const classType = data.replace('class_', '') as 'economy' | 'business' | 'first';
      
      if (!session.conversationState || session.conversationState !== 'awaiting_class') {
        await bot.answerCallbackQuery(query.id, { text: 'Please select a destination first' });
        return;
      }
      
      // Find the route from session
      if (!session.currentFlight || !session.currentFlight.routeId) {
        await bot.answerCallbackQuery(query.id, { text: 'Please select a destination first' });
        return;
      }
      
      const route = routesData.routes.find(r => r.id === session.currentFlight!.routeId);
      
      if (!route) {
        await bot.answerCallbackQuery(query.id, { text: 'Route not found' });
        return;
      }
      
      // Calculate emissions
      const result = calculateFlightEmissions({
        routeId: route.id,
        cabinClass: classType,
      });
      
      session.currentFlight = {
        routeId: route.id,
        destination: route.destination,
        destinationCity: route.destination_city,
        emissionsKg: result.result.perPassenger.emissions,
        emissionsWithRF: result.result.perPassenger.emissionsWithRF,
        class: classType,
      };

      // Log flight calculation activity
      await ActivityLogger.logFlightCalculated(session.userId, {
        routeId: route.id,
        origin: route.origin || 'SIN',
        destination: route.destination,
        emissions: result.result.perPassenger.emissions,
        emissionsWithRF: result.result.perPassenger.emissionsWithRF,
        cabinClass: classType,
        aircraftEfficiency: route.aircraft_efficiency_rating,
      });
      
      // Step 1: Show flight result with SAF prominently
      let resultMsg = `✈️ Flight to ${route.destination_city}\n\n`;
      resultMsg += `Carbon Footprint:\n`;
      resultMsg += `• Without RF: ${result.result.perPassenger.emissions.toLocaleString()} kg CO₂e\n`;
      resultMsg += `• With RF: ${result.result.perPassenger.emissionsWithRF.toLocaleString()} kg CO₂e\n\n`;
      resultMsg += `🌿 SAF-First Recommendation:\n`;
      resultMsg += `For aviation, SAF (Sustainable Aviation Fuel) is the most impactful choice — it directly reduces emissions at the source.\n\n`;
      resultMsg += `💡 SAF directly reduces aviation emissions. Offsets compensate elsewhere.\n`;
      resultMsg += `Singapore mandates 1% SAF from 2026 — you'd be ahead of the curve!`;
      
      // Step 2: Show SAF contribution options
      await sendLongMessage(chatId, resultMsg, buildSAFKeyboard(result.result.perPassenger.emissions));
      
      // Send proactive SAF nudge after calculation
      setTimeout(async () => {
        await sendProactiveNudge(chatId, session);
      }, 2000); // Wait 2 seconds after showing results
      
      await bot.answerCallbackQuery(query.id);
      return;
    }
    
    // Handle SAF percentage selection (saf_[percent])
    if (data.startsWith('saf_')) {
      const percentStr = data.replace('saf_', '');
      const percent = parseInt(percentStr);
      
      if (isNaN(percent) || !session.currentFlight) {
        await bot.answerCallbackQuery(query.id, { text: 'Please calculate a flight first' });
        return;
      }
      
      // Step 3: Show cost and liters attributed
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
      
      session.safContribution = {
        percent,
        amount: contributionAmount,
        liters: safResult.litersAttributed,
        co2eAvoided: safResult.co2eAvoided,
        pending: true,
      };
      
      const confirmMsg = `🌿 SAF Contribution Details\n\n` +
        `Coverage: ${percent}% of your flight\n` +
        `Amount: S$${contributionAmount.toFixed(2)}\n` +
        `Liters: ${safResult.litersAttributed.toFixed(1)}L\n` +
        `CO₂e Avoided: ${safResult.co2eAvoided.toFixed(1)} kg\n` +
        `⭐ Eco-Points: +${safResult.ecoPointsEarned}\n\n` +
        `Confirm this SAF contribution?`;
      
      // Step 4: Confirm contribution
      await sendLongMessage(chatId, confirmMsg, buildConfirmationKeyboard('saf'));
      await bot.answerCallbackQuery(query.id);
      return;
    }
    
    // Handle SAF confirmation (saf_confirm)
    if (data === 'saf_confirm') {
      if (!session.safContribution || !session.currentFlight) {
        await bot.answerCallbackQuery(query.id, { text: 'No pending SAF contribution' });
        return;
      }
      
      // Update journey
      if (!session.journey) {
        session.journey = {
          totalEmissions: session.currentFlight.emissionsKg,
          netEmissions: session.currentFlight.emissionsKg - session.safContribution.co2eAvoided,
          totalPoints: 0,
          wasteDiverted: 0,
          hasSAF: false,
          hasCircularity: false,
        };
      }
      
      const pointsResult = calculateEcoPoints({
        actionType: 'saf_contribution',
        amount: session.safContribution.amount,
      });
      
      session.journey.totalPoints += pointsResult.finalPoints;
      session.journey.netEmissions = session.journey.totalEmissions - session.safContribution.co2eAvoided;
      session.journey.hasSAF = true;
      session.safContribution.pending = false;

      // Log SAF contribution activity
      await ActivityLogger.logSAFContributed(session.userId, {
        provider: 'neste_singapore',
        safType: 'waste_based',
        amount: session.safContribution.amount,
        liters: session.safContribution.liters,
        emissionsAvoided: session.safContribution.co2eAvoided,
        verificationStatus: 'pending',
        routeId: session.currentFlight.routeId,
      });
      
      // Step 5: Show Eco-Points earned and tier progress
      const tierInfo = getUserTierInfo(session.userId);
      
      let successMsg = `✅ SAF Contribution Confirmed!\n\n`;
      successMsg += `🌿 ${session.safContribution.percent}% of your flight is now covered by SAF\n`;
      successMsg += `• Liters: ${session.safContribution.liters.toFixed(1)}L\n`;
      successMsg += `• CO₂e Avoided: ${session.safContribution.co2eAvoided.toFixed(1)} kg\n`;
      successMsg += `• Amount: S$${session.safContribution.amount.toFixed(2)}\n\n`;
      successMsg += `⭐ Eco-Points Earned: +${pointsResult.finalPoints}\n`;
      successMsg += `Total Points: ${(tierInfo.points + pointsResult.finalPoints).toLocaleString()}\n\n`;
      
      // Check for tier upgrade
      const updatedTier = getCurrentTier(tierInfo.points + pointsResult.finalPoints);
      if (updatedTier.id !== tierInfo.tier.id) {
        successMsg += `🎉 Tier Upgrade! You've reached ${updatedTier.name} Tier!\n\n`;
      } else {
        const progress = calculateTierProgress(tierInfo.points + pointsResult.finalPoints);
        if (progress.progressToNext?.nextTier) {
          successMsg += `📊 Progress to ${progress.progressToNext.nextTier.name}: ${progress.progressToNext.progressPercent?.toFixed(0) || 0}%\n`;
        }
      }
      
      successMsg += `\nThank you for contributing to sustainable aviation!`;
      
      await sendLongMessage(chatId, successMsg);
      
      // Send journey complete nudge after SAF contribution
      setTimeout(async () => {
        await sendProactiveNudge(chatId, session);
      }, 2000);
      
      await bot.answerCallbackQuery(query.id, { text: 'SAF contribution confirmed!' });
      return;
    }
    
    // Handle SAF cancellation
    if (data === 'saf_cancel') {
      session.safContribution = undefined;
      await bot.sendMessage(chatId, 'SAF contribution cancelled.');
      await bot.answerCallbackQuery(query.id);
      return;
    }
    
    // Handle circularity actions (eco_[action])
    if (data.startsWith('eco_')) {
      const actionId = data.replace('eco_', '');
      const actionData = circularityActionsData.actions.find(a => a.id === actionId);
      
      if (actionData) {
        const pointsResult = calculateEcoPoints({
          actionType: 'circularity_action',
          actionId,
        });
        
        if (!session.journey) {
          session.journey = {
            totalEmissions: 0,
            netEmissions: 0,
            totalPoints: 0,
            wasteDiverted: 0,
            hasSAF: false,
            hasCircularity: false,
          };
        }
        
        session.journey.totalPoints += pointsResult.finalPoints;
        session.journey.wasteDiverted += actionData.waste_diverted_grams;
        session.journey.hasCircularity = true;

        // Log circularity action activity
        await ActivityLogger.logCircularityAction(session.userId, {
          actionId: actionId,
          actionName: actionData.name,
          wasteDiverted: actionData.waste_diverted_grams,
          ecoPoints: pointsResult.finalPoints,
        });
        
        const message = `♻️ Circularity Action Logged!\n\n` +
          `Action: ${actionData.name}\n` +
          `⭐ Eco-Points: +${pointsResult.finalPoints}\n` +
          `🗑️ Waste Diverted: ${actionData.waste_diverted_grams}g\n\n` +
          `Thank you for contributing to Changi's circular economy!`;
        
        await sendLongMessage(chatId, message);
        
        // Send tier upgrade nudge if close
        setTimeout(async () => {
          await sendProactiveNudge(chatId, session);
        }, 2000);
        
        await bot.answerCallbackQuery(query.id, { text: 'Action logged!' });
      } else {
        await bot.answerCallbackQuery(query.id, { text: 'Action not found' });
      }
      return;
    }
    
    // Handle nudge dismissals
    if (data.startsWith('nudge_dismiss_')) {
      const nudgeId = data.replace('nudge_dismiss_', '');
      markNudgeDismissed(session.userId, nudgeId);
      await bot.answerCallbackQuery(query.id, { text: 'Nudge dismissed' });
      return;
    }
    
    // Handle nudge actions
    if (data.startsWith('nudge_')) {
      const action = data.replace('nudge_', '');
      if (action === 'saf') {
        await handleSAF(chatId);
      } else if (action === 'tier') {
        await handleTier(chatId);
      } else if (action === 'impact') {
        await handleImpact(chatId);
      } else if (action.startsWith('eco_')) {
        const ecoAction = action.replace('eco_', '');
        await handleEco(chatId, ecoAction);
      }
      await bot.answerCallbackQuery(query.id);
      return;
    }
    
    await bot.answerCallbackQuery(query.id, { text: 'Unknown action' });
  } catch (error) {
    logError(error, { endpoint: 'handleCallbackQuery', chatId: query.message?.chat.id });
    await bot.answerCallbackQuery(query.id, { text: 'Error processing request' });
  }
}

/**
 * Send proactive nudge if applicable (with rate limiting)
 */
async function sendProactiveNudge(chatId: number, session: UserSession) {
  try {
    const tierInfo = getUserTierInfo(session.userId);
    
    const nudgeContext: NudgeContext = {
      journey: {
        flight: session.currentFlight ? {
          emissions: session.currentFlight.emissionsKg,
          emissionsWithRF: session.currentFlight.emissionsWithRF,
          safContribution: session.safContribution ? {
            amount: session.safContribution.amount,
            liters: session.safContribution.liters,
            emissionsReduced: session.safContribution.co2eAvoided,
          } : undefined,
          routeId: session.currentFlight.routeId,
        } : undefined,
        transport: [],
        shopping: [],
        dining: [],
        totalEmissions: session.journey?.totalEmissions || 0,
        netEmissions: session.journey?.netEmissions || 0,
        totalEcoPointsEarned: session.journey?.totalPoints || 0,
        totalWasteDiverted: session.journey?.wasteDiverted || 0,
        hasSAF: session.journey?.hasSAF || false,
        hasCircularity: session.journey?.hasCircularity || false,
      },
      greenTier: {
        currentTier: {
          id: tierInfo.tier.id,
          name: tierInfo.tier.name,
          level: tierInfo.tier.level,
        },
        totalEcoPoints: tierInfo.points,
        pointsToNextTier: tierInfo.progress.pointsUntilNextTier ?? undefined,
        progressPercent: tierInfo.progress.progressToNext?.progressPercent ?? 0,
        tierProgress: {
          progressToNext: tierInfo.progress.progressToNext ? {
            nextTier: {
              name: tierInfo.progress.progressToNext.nextTier.name,
              minPoints: tierInfo.progress.progressToNext.nextTier.minPoints,
            },
          } : undefined,
        },
      },
      time: new Date(),
    };
    
    const nudge = evaluateNudges(nudgeContext, session.userId);
    if (nudge && nudge.message) {
      const telegramNudge = getTelegramNudge(nudge);
      await sendLongMessage(chatId, telegramNudge.message, telegramNudge.keyboard || {
        reply_markup: {
          inline_keyboard: [],
        },
      });
      markNudgeSent(session.userId, nudge.id);
    }
  } catch (error) {
    // Silently fail - nudges are nice-to-have
    logError(error, { endpoint: 'sendProactiveNudge', chatId });
  }
}

/**
 * Handle free-form messages (pass to Ask Max)
 */
async function handleFreeFormMessage(chatId: number, text: string) {
  await bot.sendChatAction(chatId, 'typing');
  
  try {
    const session = getUserSession(chatId);
    const tierInfo = getUserTierInfo(session.userId);
    
    // Build context
    const journeyContext: JourneyContext = {
      flight: session.currentFlight ? {
        origin: 'SIN',
        destination: session.currentFlight.destination,
        emissions: session.currentFlight.emissionsKg,
        emissionsWithRF: session.currentFlight.emissionsWithRF,
        includeRF: true,
        safContribution: session.safContribution ? {
          amount: session.safContribution.amount,
          liters: session.safContribution.liters,
          emissionsReduced: session.safContribution.co2eAvoided,
        } : undefined,
      } : undefined,
      transport: [],
      shopping: [],
      dining: [],
      circularity: session.journey?.hasCircularity ? [{
        actionName: 'Circularity Action',
        wasteDiverted: session.journey.wasteDiverted,
        ecoPointsEarned: 10,
      }] : [],
      totalEcoPointsEarned: tierInfo.points,
      totalEmissions: session.currentFlight?.emissionsKg || 0,
      netEmissions: session.currentFlight ? session.currentFlight.emissionsKg - (session.currentFlight.emissionsKg * 0.1) : 0,
      totalWasteDiverted: session.journey?.wasteDiverted || 0,
    };
    
    const greenTierContext: GreenTierContext = {
      currentTier: {
        id: tierInfo.tier.id,
        name: tierInfo.tier.name,
        level: tierInfo.tier.level,
        points_multiplier: tierInfo.tier.points_multiplier,
      },
      totalEcoPoints: tierInfo.points,
      lifetimeEcoPoints: tierInfo.points,
      pointsToNextTier: tierInfo.progress.pointsUntilNextTier,
      progressPercent: tierInfo.progress.progressToNext?.progressPercent ?? 0,
    };
    
    const response = await askMax(text, journeyContext, greenTierContext);
    
    // Add inline actions for common queries
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌿 Learn About SAF', callback_data: 'saf_info' },
            { text: '✈️ Calculate Flight', callback_data: 'calc_start' }
          ]
        ]
      }
    };
    
    await sendLongMessage(chatId, response, inlineKeyboard);
  } catch (error) {
    logError(error, { endpoint: 'handleFreeFormMessage', chatId });
    await bot.sendMessage(
      chatId,
      'Sorry, I encountered an error. Please try again later.'
    );
  }
}

/**
 * Process a Telegram update (used by both webhook and polling)
 */
async function processUpdate(update: any) {
  // Handle different update types
  if (update.message) {
      const msg = update.message;
      const text = msg.text || '';
      const chatId = msg.chat.id;
      
      // Check if it's a command
      if (text.startsWith('/')) {
        const [command, ...args] = text.split(' ');
        const commandLower = command.toLowerCase();
        
        switch (commandLower) {
          case '/start':
            await handleStart(chatId);
            break;
          case '/calculate':
            await handleCalculate(chatId, args.join(' '));
            break;
          case '/saf':
            await handleSAF(chatId);
            break;
          case '/journey':
            await handleJourney(chatId);
            break;
          case '/shop':
            await handleShop(chatId, args.join(' '));
            break;
          case '/eco':
            await handleEco(chatId, args.join(' '));
            break;
          case '/tier':
            await handleTier(chatId);
            break;
          case '/ask':
            await handleAsk(chatId, args.join(' '));
            break;
          case '/impact':
            await handleImpact(chatId);
            break;
          case '/help':
            const helpMsg = `📚 Changi Eco Advisor Commands\n\n` +
              `/start - Welcome message and Green Tier status\n` +
              `/calculate [destination] - Calculate flight emissions (SAF-first results)\n` +
              `/saf - Learn about and contribute to SAF\n` +
              `/journey - View current journey summary\n` +
              `/shop [category] - Find green-rated shops at Changi\n` +
              `/eco [action] - Log a circularity action\n` +
              `/tier - Check your Green Tier status and progress\n` +
              `/ask [question] - Ask Max anything about sustainability\n` +
              `/impact - Get your personalized impact story\n\n` +
              `💡 Tip: SAF (Sustainable Aviation Fuel) is the most impactful way to reduce aviation emissions. Singapore mandates 1% SAF from 2026!`;
            await sendLongMessage(chatId, helpMsg);
            break;
          default:
            await bot.sendMessage(chatId, 'Unknown command. Type /help for available commands.');
        }
      } else {
        // Handle text messages (main menu buttons or free-form)
        const session = getUserSession(chatId);
        const textLower = text.toLowerCase();
        
        // Check if user is in a conversation state
        if (session.conversationState === 'awaiting_destination') {
          // User is entering destination manually
          const destination = text.trim().toUpperCase();
          const route = routesData.routes.find(r => 
            r.destination === destination || 
            r.destination_city.toLowerCase() === destination.toLowerCase()
          );
          
          if (route) {
            session.currentFlight = {
              routeId: route.id,
              destination: route.destination,
              destinationCity: route.destination_city,
              emissionsKg: 0,
              emissionsWithRF: 0,
              class: 'economy',
            };
            session.conversationState = 'awaiting_class';
            await bot.sendMessage(chatId, `✈️ Found: ${route.destination_city} (${route.destination})\n\nSelect your travel class:`, buildClassKeyboard());
          } else {
            await bot.sendMessage(chatId, `📍 Destination "${text}" not found. Please try again with an airport code (e.g., LHR, JFK, NRT) or select from the list:`, buildDestinationKeyboard());
          }
        } else if (textLower.includes('calculate flight') || textLower.includes('calculate')) {
          await handleCalculate(chatId);
        } else if (textLower.includes('saf info') || textLower.includes('saf')) {
          await handleSAF(chatId);
        } else if (textLower.includes('my journey') || textLower.includes('journey')) {
          await handleJourney(chatId);
        } else if (textLower.includes('my tier') || textLower.includes('tier')) {
          await handleTier(chatId);
        } else if (textLower.includes('green shops') || textLower.includes('shop')) {
          await handleShop(chatId);
        } else if (textLower.includes('log action') || textLower.includes('circularity')) {
          await handleEco(chatId);
        } else if (textLower.includes('ask max') || textLower.includes('ask')) {
          await bot.sendMessage(chatId, '💬 What would you like to ask Max? Type your question.');
        } else if (textLower.includes('my impact') || textLower.includes('impact')) {
          await handleImpact(chatId);
        } else if (text.trim()) {
          // Free-form message - pass to Ask Max
          await handleFreeFormMessage(chatId, text);
        }
      }
  } else if (update.callback_query) {
    // Handle callback queries (button presses)
    await handleCallbackQuery(update.callback_query);
  }
}

// Set up event handlers for polling mode (development only)
// This must be after processUpdate is defined
if (isDevelopment && !handlersSetup) {
  handlersSetup = true;
  
  bot.on('message', async (msg) => {
    await processUpdate({ message: msg });
  });
  
  bot.on('callback_query', async (query) => {
    await processUpdate({ callback_query: query });
  });
  
  bot.on('polling_error', (error) => {
    console.error('Telegram polling error:', error);
  });
  
  bot.on('webhook_error', (error) => {
    console.error('Telegram webhook error:', error);
  });
  
  // Delete any existing webhook when starting in polling mode
  bot.deleteWebHook().then(() => {
    console.log('🤖 Telegram bot started in POLLING mode (local development)');
    console.log('💡 For production, use webhook mode instead');
  }).catch((error) => {
    console.error('Failed to delete webhook:', error);
    console.log('🤖 Telegram bot started in POLLING mode (local development)');
  });
}

/**
 * Main webhook handler
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await processUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logError(error, { endpoint: '/api/telegram' });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'Telegram webhook is active' });
}

