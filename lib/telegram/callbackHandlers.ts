/**
 * Telegram Callback Query Handlers
 * Handles button press callbacks from Telegram bot
 */

import TelegramBot from 'node-telegram-bot-api';
import { calculateFlightEmissions } from '@/lib/emissions/flightCalculator';
import { calculateSAFContribution } from '@/lib/saf/bookAndClaim';
import { calculateEcoPoints } from '@/lib/rewards/ecoPoints';
import routesData from '@/data/routes.json';
import circularityActionsData from '@/data/circularityActions.json';
import { sendLongMessage } from '@/lib/telegram/utils';
import { buildClassKeyboard, buildSAFKeyboard, buildConfirmationKeyboard } from '@/lib/telegram/keyboardBuilders';
import { ActivityLogger } from '@/lib/activity/logger';
import { SAF_CONSTANTS } from '@/lib/constants';
import type { UserSession } from '@/lib/storage/sessionStorage';

/**
 * Handle destination selection callback from Telegram bot
 * 
 * @param bot - Telegram bot instance
 * @param chatId - Chat ID of the user
 * @param routeId - Selected route ID or 'other' for manual entry
 * @param session - User session object
 */
export async function handleDestinationCallback(
  bot: TelegramBot,
  chatId: number,
  routeId: string,
  session: UserSession
): Promise<void> {
  if (routeId === 'other') {
    await bot.sendMessage(chatId, 'Please enter your destination airport code (e.g., LHR, JFK, NRT)');
    session.conversationState = 'awaiting_destination';
    return;
  }
  
  const route = routesData.routes.find(r => r.id === routeId);
  if (!route) {
    await bot.answerCallbackQuery(chatId.toString(), { text: 'Route not found' });
    return;
  }
  
  session.currentFlight = {
    routeId: route.id,
    destination: route.destination,
    destinationCity: route.destination_city,
    emissionsKg: 0,
    emissionsWithRF: 0,
    class: 'economy',
  };
  session.conversationState = 'awaiting_class';
  await bot.sendMessage(
    chatId,
    `✈️ Selected: ${route.destination_city} (${route.destination})\n\nSelect your travel class:`,
    buildClassKeyboard()
  );
}

/**
 * Handle travel class selection callback from Telegram bot
 * Calculates emissions and shows SAF contribution options
 * 
 * @param bot - Telegram bot instance
 * @param chatId - Chat ID of the user
 * @param classType - Selected travel class (economy, business, first)
 * @param session - User session object
 */
export async function handleClassCallback(
  bot: TelegramBot,
  chatId: number,
  classType: 'economy' | 'business' | 'first',
  session: UserSession
): Promise<void> {
  if (!session.currentFlight?.routeId) {
    await bot.answerCallbackQuery(chatId.toString(), { text: 'Please select a destination first' });
    return;
  }
  
  const route = routesData.routes.find(r => r.id === session.currentFlight!.routeId);
  if (!route) {
    await bot.answerCallbackQuery(chatId.toString(), { text: 'Route not found' });
    return;
  }
  
  const result = calculateFlightEmissions({
    routeId: route.id,
    cabinClass: classType,
  });
  
  session.currentFlight = {
    routeId: route.id,
    destination: route.destination,
    destinationCity: route.destination_city,
    emissionsKg: result.perPassenger.emissions,
    emissionsWithRF: result.perPassenger.emissionsWithRF,
    class: classType,
  };
  
  await ActivityLogger.logFlightCalculated(session.userId, {
    routeId: route.id,
    origin: route.origin || 'SIN',
    destination: route.destination,
    emissions: result.perPassenger.emissions,
    emissionsWithRF: result.perPassenger.emissionsWithRF,
    cabinClass: classType,
    aircraftEfficiency: route.aircraft_efficiency_rating,
  });
  
  const resultMsg = buildFlightResultMessage(route, result, classType);
  await sendLongMessage(chatId, resultMsg, buildSAFKeyboard(result.perPassenger.emissions));
}

/**
 * Build flight result message
 */
function buildFlightResultMessage(
  route: typeof routesData.routes[0],
  result: ReturnType<typeof calculateFlightEmissions>,
  classType: string
): string {
  let message = `✈️ Flight to ${route.destination_city}\n\n`;
  message += `Carbon Footprint:\n`;
  message += `• Without RF: ${result.perPassenger.emissions.toLocaleString()} kg CO₂e\n`;
  message += `• With RF: ${result.perPassenger.emissionsWithRF.toLocaleString()} kg CO₂e\n\n`;
  message += `🌿 *SAF Contribution Options:*\n`;
  
  const saf25Cost = ((result.perPassenger.emissions * 0.25) / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER) * SAF_CONSTANTS.COST_PER_LITER;
  const saf50Cost = ((result.perPassenger.emissions * 0.50) / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER) * SAF_CONSTANTS.COST_PER_LITER;
  
  message += `🌿 25% SAF: S$${saf25Cost.toFixed(2)} — ${((result.perPassenger.emissions * 0.25) / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER).toFixed(1)}L\n`;
  message += `🌿 50% SAF: S$${saf50Cost.toFixed(2)} — ${((result.perPassenger.emissions * 0.50) / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER).toFixed(1)}L\n`;
  message += `🌿 75% SAF: S$${(saf25Cost * 3).toFixed(2)} — ${((result.perPassenger.emissions * 0.75) / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER).toFixed(1)}L\n`;
  message += `🌿 100% SAF: S$${(saf25Cost * 4).toFixed(2)} — ${((result.perPassenger.emissions * 1.0) / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER).toFixed(1)}L\n\n`;
  message += `*SAF directly reduces aviation emissions. Singapore mandates 1% SAF from 2026.*\n\n`;
  message += `Select a contribution percentage:`;
  
  return message;
}

/**
 * Handle SAF contribution percentage selection callback
 * Processes SAF contribution and updates user session
 * 
 * @param bot - Telegram bot instance
 * @param chatId - Chat ID of the user
 * @param percentage - SAF contribution percentage (25, 50, 75, or 100)
 * @param session - User session object
 */
export async function handleSAFCallback(
  bot: TelegramBot,
  chatId: number,
  percentage: 25 | 50 | 75 | 100,
  session: UserSession
): Promise<void> {
  if (!session.currentFlight) {
    await bot.answerCallbackQuery(chatId.toString(), { text: 'Please calculate a flight first' });
    return;
  }
  
  const emissionsToCover = session.currentFlight.emissionsKg * (percentage / 100);
  const litersNeeded = emissionsToCover / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER;
  const contributionAmount = litersNeeded * SAF_CONSTANTS.COST_PER_LITER;
  
  const safResult = calculateSAFContribution({
    routeId: session.currentFlight.routeId,
    emissionsKg: emissionsToCover,
    contributionAmount,
    safType: 'waste_based',
    provider: 'neste_singapore',
  });
  
  session.safContribution = {
    percent: percentage,
    amount: contributionAmount,
    liters: safResult.litersAttributed,
    co2eAvoided: safResult.co2eAvoided,
    pending: true,
  };
  
  if (!session.journey) {
    session.journey = {
      totalEmissions: session.currentFlight.emissionsKg,
      netEmissions: session.currentFlight.emissionsKg - safResult.co2eAvoided,
      totalPoints: safResult.ecoPointsEarned,
      wasteDiverted: 0,
      hasSAF: true,
      hasCircularity: false,
    };
  } else {
    session.journey.totalEmissions = session.currentFlight.emissionsKg;
    session.journey.netEmissions = session.currentFlight.emissionsKg - safResult.co2eAvoided;
    session.journey.totalPoints += safResult.ecoPointsEarned;
    session.journey.hasSAF = true;
  }
  
  await ActivityLogger.logSAFContributed(session.userId, {
    provider: 'neste_singapore',
    safType: 'waste_based',
    amount: contributionAmount,
    liters: safResult.litersAttributed,
    emissionsAvoided: safResult.co2eAvoided,
    verificationStatus: safResult.verification.status,
    certificateId: safResult.verification.certificateId,
    routeId: session.currentFlight.routeId,
  });
  
  const confirmMsg = buildSAFConfirmationMessage(safResult, percentage);
  await sendLongMessage(chatId, confirmMsg, buildConfirmationKeyboard('saf'));
}

/**
 * Build SAF confirmation message
 */
function buildSAFConfirmationMessage(
  safResult: ReturnType<typeof calculateSAFContribution>,
  percentage: number
): string {
  let message = `🌿 *SAF Contribution Confirmed*\n\n`;
  message += `Contribution: ${percentage}% of flight emissions\n`;
  message += `Amount: S$${safResult.cost.toFixed(2)}\n`;
  message += `Liters: ${safResult.litersAttributed.toFixed(1)}L\n`;
  message += `CO₂e Avoided: ${safResult.co2eAvoided.toFixed(1)} kg\n`;
  message += `⭐ Eco-Points: +${safResult.ecoPointsEarned}\n\n`;
  message += `Verification: ${safResult.verification.status}\n`;
  message += `Certificate: ${safResult.verification.certificateId}\n\n`;
  message += `Thank you for contributing to sustainable aviation!`;
  
  return message;
}

/**
 * Handle circularity action callback from Telegram bot
 * Logs circularity action and awards eco-points
 * 
 * @param bot - Telegram bot instance
 * @param chatId - Chat ID of the user
 * @param actionId - Circularity action ID
 * @param session - User session object
 */
export async function handleCircularityCallback(
  bot: TelegramBot,
  chatId: number,
  actionId: string,
  session: UserSession
): Promise<void> {
  const action = circularityActionsData.actions.find(a => a.id === actionId);
  if (!action) {
    await bot.answerCallbackQuery(chatId.toString(), { text: 'Action not found' });
    return;
  }
  
  const pointsResult = calculateEcoPoints({
    actionType: 'circularity_action',
    actionId: actionId,
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
  session.journey.wasteDiverted += action.waste_diverted_grams;
  session.journey.hasCircularity = true;
  
  const message = `♻️ Circularity Action Logged!\n\n` +
    `Action: ${action.name}\n` +
    `⭐ Eco-Points: +${pointsResult.finalPoints}\n` +
    `🗑️ Waste Diverted: ${action.waste_diverted_grams}g\n\n` +
    `Thank you for contributing to Changi's circular economy!`;
  
  await sendLongMessage(chatId, message);
}

/**
 * Handle nudge dismissal callback
 */
export async function handleNudgeDismissal(
  bot: TelegramBot,
  chatId: number,
  nudgeId: string,
  session: UserSession
): Promise<void> {
  const { markNudgeDismissed } = await import('@/lib/claude/nudges');
  markNudgeDismissed(session.userId, nudgeId);
  await bot.answerCallbackQuery(chatId.toString(), { text: 'Nudge dismissed' });
}

