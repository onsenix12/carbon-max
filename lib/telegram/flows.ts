/**
 * Telegram Conversation Flow Handlers
 * Modular, reusable flow handlers for different user journeys
 */

import TelegramBot from 'node-telegram-bot-api';
import { calculateFlightEmissions } from '@/lib/emissions/flightCalculator';
import { calculateSAFContribution } from '@/lib/saf/bookAndClaim';
import { generateCompleteImpactStory } from '@/lib/claude/impactStories';
import { getCurrentTier, calculateTierProgress, calculateEcoPoints } from '@/lib/rewards/ecoPoints';
import routesData from '@/data/routes.json';
import circularityActionsData from '@/data/circularityActions.json';
import { sendLongMessage } from './utils';
import type { JourneyContext, GreenTierContext } from '@/lib/claude/askMax';

// Types
export interface UserSession {
  userId: string;
  currentFlight?: {
    routeId: string;
    destination: string;
    destinationCity: string;
    emissionsKg: number;
    emissionsWithRF: number;
    class: 'economy' | 'business' | 'first';
    aircraftEfficiency?: string;
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

export interface TierInfo {
  tier: {
    id: string;
    name: string;
    level: number;
    social_signaling: {
      badge_icon: string;
    };
    perks: string[];
  };
  points: number;
  progress: {
    progressPercent?: number;
    pointsToNextTier?: number;
    progressToNext?: {
      nextTier: {
        name: string;
        minPoints: number;
      };
    } | null;
  };
}

/**
 * Build destination selection keyboard
 */
export function buildDestinationKeyboard() {
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
 * Build class selection keyboard with Eco-Points indicator for economy
 */
export function buildClassKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✈️ Economy (1.0x) ⭐ Best for Points', callback_data: 'class_economy' },
          { text: '💼 Business (2.0x)', callback_data: 'class_business' }
        ],
        [
          { text: '👑 First (3.0x)', callback_data: 'class_first' }
        ],
        [
          { text: 'ℹ️ About Class Multipliers', callback_data: 'class_info' }
        ]
      ]
    }
  };
}

/**
 * Build SAF contribution percentage keyboard
 */
export function buildSAFKeyboard(emissionsKg: number) {
  const calculateCost = (percent: number) => {
    const emissionsToCover = emissionsKg * (percent / 100);
    const litersNeeded = emissionsToCover / 2.27;
    return litersNeeded * 2.5;
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
          { text: '❌ Skip for Now', callback_data: 'saf_skip' }
        ]
      ]
    }
  };
}

/**
 * Build circularity actions keyboard
 */
export function buildCircularityKeyboard() {
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
  
  keyboard.push([
    { text: '📋 View All Actions', callback_data: 'eco_all' }
  ]);
  
  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

/**
 * Build confirmation keyboard
 */
export function buildConfirmationKeyboard(action: string) {
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
 * Build progress bar using block characters (▓▒░)
 */
export function buildProgressBar(percent: number, length: number = 10): string {
  const filled = Math.floor(percent / 10);
  const half = percent % 10 >= 5 ? 1 : 0;
  const empty = length - filled - half;
  
  return '▓'.repeat(filled) + (half ? '▒' : '') + '░'.repeat(empty);
}

/**
 * FLIGHT CALCULATION FLOW (SAF-first)
 * 
 * Step 1: Select destination → keyboard
 * Step 2: Select class → keyboard (show Eco-Points for economy choice)
 * Step 3: Calculate and display results
 * Step 4: If user selects SAF → SAF contribution flow
 * Step 5: Show Eco-Points earned, tier progress
 */
export class FlightCalculationFlow {
  constructor(
    private bot: TelegramBot,
    private session: UserSession,
    private getUserTierInfo: (userId: string) => TierInfo
  ) {}

  /**
   * Step 1: Show destination selection
   */
  async step1_SelectDestination(chatId: number) {
    this.session.conversationState = 'awaiting_destination';
    await this.bot.sendMessage(
      chatId,
      '✈️ *Flight Calculator*\n\nSelect your destination:',
      { parse_mode: 'Markdown', ...buildDestinationKeyboard() }
    );
  }

  /**
   * Step 2: Show class selection with Eco-Points indicator
   */
  async step2_SelectClass(chatId: number, routeId: string) {
    const route = routesData.routes.find(r => r.id === routeId);
    if (!route) {
      await this.bot.sendMessage(chatId, '❌ Route not found. Please try again.');
      return;
    }

    // Store route selection
    this.session.currentFlight = {
      routeId: route.id,
      destination: route.destination,
      destinationCity: route.destination_city,
      emissionsKg: 0,
      emissionsWithRF: 0,
      class: 'economy',
      aircraftEfficiency: route.aircraft_efficiency_rating,
    };
    this.session.conversationState = 'awaiting_class';

    const message = `✈️ *Selected: ${route.destination_city} (${route.destination})*\n\n` +
      `Select your travel class:\n\n` +
      `💡 *Tip:* Economy class earns the most Eco-Points per dollar spent!`;
    
    await this.bot.sendMessage(
      chatId,
      message,
      { parse_mode: 'Markdown', ...buildClassKeyboard() }
    );
  }

  /**
   * Step 3: Calculate and display results with SAF prominently
   */
  async step3_CalculateAndDisplay(chatId: number, classType: 'economy' | 'business' | 'first') {
    if (!this.session.currentFlight) {
      await this.bot.sendMessage(chatId, '❌ No flight selected. Please start over.');
      return;
    }

    const route = routesData.routes.find(r => r.id === this.session.currentFlight!.routeId);
    if (!route) {
      await this.bot.sendMessage(chatId, '❌ Route not found.');
      return;
    }

    // Calculate emissions
    const result = calculateFlightEmissions({
      routeId: route.id,
      cabinClass: classType,
    });

    // Update session
    this.session.currentFlight.emissionsKg = result.result.perPassenger.emissions;
    this.session.currentFlight.emissionsWithRF = result.result.perPassenger.emissionsWithRF;
    this.session.currentFlight.class = classType;

    // Build result message
    let message = `✈️ *Flight Calculation Results*\n\n`;
    message += `*Route:* ${route.destination_city} (${route.destination})\n`;
    message += `*Class:* ${classType.charAt(0).toUpperCase() + classType.slice(1)}\n`;
    message += `*Aircraft Efficiency:* ${route.aircraft_efficiency_rating} Rating\n\n`;
    
    message += `*Carbon Footprint:*\n`;
    message += `• Without RF: *${result.result.perPassenger.emissions.toLocaleString()} kg CO₂e*\n`;
    message += `• With RF: *${result.result.perPassenger.emissionsWithRF.toLocaleString()} kg CO₂e*\n\n`;
    
    message += `🌿 *SAF-First Recommendation*\n`;
    message += `For aviation, SAF (Sustainable Aviation Fuel) is the *most impactful choice* — it directly reduces emissions at the source.\n\n`;
    
    // Calculate SAF options
    const saf25Cost = ((result.result.perPassenger.emissions * 0.25) / 2.27) * 2.5;
    const saf50Cost = ((result.result.perPassenger.emissions * 0.50) / 2.27) * 2.5;
    
    message += `*SAF Contribution Options:*\n`;
    message += `🌿 25% SAF: S$${saf25Cost.toFixed(2)} — ${((result.result.perPassenger.emissions * 0.25) / 2.27).toFixed(1)}L\n`;
    message += `🌿 50% SAF: S$${saf50Cost.toFixed(2)} — ${((result.result.perPassenger.emissions * 0.50) / 2.27).toFixed(1)}L\n`;
    message += `🌿 75% SAF: S$${(saf25Cost * 3).toFixed(2)} — ${((result.result.perPassenger.emissions * 0.75) / 2.27).toFixed(1)}L\n`;
    message += `🌿 100% SAF: S$${(saf25Cost * 4).toFixed(2)} — ${((result.result.perPassenger.emissions * 1.0) / 2.27).toFixed(1)}L\n\n`;
    
    message += `💡 *Why SAF?*\n`;
    message += `• Directly reduces aviation emissions at the source\n`;
    message += `• More impactful than offsets\n`;
    message += `• Singapore mandates 1% SAF from 2026 — be ahead of the curve!\n\n`;
    
    message += `📋 *Alternative:* Carbon offsets available as secondary option`;

    await sendLongMessage(
      chatId,
      message,
      { parse_mode: 'Markdown', ...buildSAFKeyboard(result.result.perPassenger.emissions) }
    );
  }

  /**
   * Step 4: Handle SAF contribution selection
   */
  async step4_SAFContribution(chatId: number, percent: number) {
    if (!this.session.currentFlight) {
      await this.bot.sendMessage(chatId, '❌ No flight calculated. Please start over.');
      return;
    }

    const emissionsToCover = this.session.currentFlight.emissionsKg * (percent / 100);
    const litersNeeded = emissionsToCover / 2.27;
    const contributionAmount = litersNeeded * 2.5;

    const safResult = calculateSAFContribution({
      routeId: this.session.currentFlight.routeId,
      emissionsKg: emissionsToCover,
      contributionAmount,
      safType: 'waste_based',
      provider: 'neste_singapore',
    });

    this.session.safContribution = {
      percent,
      amount: contributionAmount,
      liters: safResult.litersAttributed,
      co2eAvoided: safResult.co2eAvoided,
      pending: true,
    };

    const message = `🌿 *SAF Contribution Details*\n\n` +
      `*Coverage:* ${percent}% of your flight\n` +
      `*Amount:* S$${contributionAmount.toFixed(2)}\n` +
      `*Liters:* ${safResult.litersAttributed.toFixed(1)}L\n` +
      `*CO₂e Avoided:* ${safResult.co2eAvoided.toFixed(1)} kg\n` +
      `*⭐ Eco-Points:* +${safResult.ecoPointsEarned}\n\n` +
      `Confirm this SAF contribution?`;

    await sendLongMessage(
      chatId,
      message,
      { parse_mode: 'Markdown', ...buildConfirmationKeyboard('saf') }
    );
  }

  /**
   * Step 5: Confirm SAF and show results
   */
  async step5_ConfirmAndShowResults(chatId: number) {
    if (!this.session.safContribution || !this.session.currentFlight) {
      await this.bot.sendMessage(chatId, '❌ No pending SAF contribution.');
      return;
    }

    // Update journey
    if (!this.session.journey) {
      this.session.journey = {
        totalEmissions: this.session.currentFlight.emissionsKg,
        netEmissions: this.session.currentFlight.emissionsKg - this.session.safContribution.co2eAvoided,
        totalPoints: 0,
        wasteDiverted: 0,
        hasSAF: false,
        hasCircularity: false,
      };
    }

    const pointsResult = calculateEcoPoints({
      actionType: 'saf_contribution',
      amount: this.session.safContribution.amount,
    });

    this.session.journey.totalPoints += pointsResult.finalPoints;
    this.session.journey.netEmissions = this.session.journey.totalEmissions - this.session.safContribution.co2eAvoided;
    this.session.journey.hasSAF = true;
    this.session.safContribution.pending = false;

    // Get tier info
    const tierInfo = this.getUserTierInfo(this.session.userId);
    const updatedPoints = tierInfo.points + pointsResult.finalPoints;
    const updatedTier = getCurrentTier(updatedPoints);
    const progress = calculateTierProgress(updatedPoints);

    // Build success message
    let message = `✅ *SAF Contribution Confirmed!*\n\n`;
    message += `🌿 *${this.session.safContribution.percent}%* of your flight is now covered by SAF\n\n`;
    message += `*Details:*\n`;
    message += `• Liters: ${this.session.safContribution.liters.toFixed(1)}L\n`;
    message += `• CO₂e Avoided: ${this.session.safContribution.co2eAvoided.toFixed(1)} kg\n`;
    message += `• Amount: S$${this.session.safContribution.amount.toFixed(2)}\n\n`;
    message += `⭐ *Eco-Points Earned:* +${pointsResult.finalPoints}\n`;
    message += `*Total Points:* ${updatedPoints.toLocaleString()}\n\n`;

    // Check for tier upgrade
    if (updatedTier.id !== tierInfo.tier.id) {
      message += `🎉 *Tier Upgrade!*\n`;
      message += `You've reached *${updatedTier.name} Tier*!\n\n`;
    } else if (progress.progressToNext?.nextTier) {
      const progressPercent = progress.progressPercent || 0;
      const progressBar = buildProgressBar(progressPercent);
      
      message += `📊 *Progress to ${progress.progressToNext.nextTier.name}:*\n`;
      message += `${progressBar} ${progressPercent.toFixed(0)}%\n`;
      message += `${progress.pointsToNextTier || 0} points needed\n\n`;
    }

    message += `🙏 Thank you for contributing to sustainable aviation!`;

    await sendLongMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}

/**
 * CIRCULARITY ACTION FLOW
 * 
 * Step 1: Show available actions keyboard
 * Step 2: User selects action
 * Step 3: Confirm logging
 * Step 4: Award Eco-Points with celebration emoji
 * Step 5: Show updated tier progress
 */
export class CircularityActionFlow {
  constructor(
    private bot: TelegramBot,
    private session: UserSession,
    private getUserTierInfo: (userId: string) => TierInfo
  ) {}

  /**
   * Step 1: Show available actions
   */
  async step1_ShowActions(chatId: number) {
    const message = `♻️ *Log a Circularity Action*\n\n` +
      `Select an action you've completed:\n\n` +
      `*Earn Eco-Points* for every sustainable action you take!`;
    
    await this.bot.sendMessage(
      chatId,
      message,
      { parse_mode: 'Markdown', ...buildCircularityKeyboard() }
    );
  }

  /**
   * Step 2: User selects action
   */
  async step2_SelectAction(chatId: number, actionId: string) {
    const actionData = circularityActionsData.actions.find(a => a.id === actionId);
    
    if (!actionData) {
      await this.bot.sendMessage(chatId, '❌ Action not found.');
      return;
    }

    const pointsResult = calculateEcoPoints({
      actionType: 'circularity_action',
      actionId,
    });

    const message = `♻️ *Confirm Action*\n\n` +
      `*Action:* ${actionData.name}\n` +
      `*Description:* ${actionData.description}\n\n` +
      `*Impact:*\n` +
      `• Waste Diverted: ${actionData.waste_diverted_grams}g\n` +
      `• ⭐ Eco-Points: +${pointsResult.finalPoints}\n\n` +
      `Log this action?`;

    await sendLongMessage(
      chatId,
      message,
      { parse_mode: 'Markdown', ...buildConfirmationKeyboard('eco') }
    );
  }

  /**
   * Step 3: Confirm logging
   */
  async step3_ConfirmLogging(chatId: number, actionId: string) {
    const actionData = circularityActionsData.actions.find(a => a.id === actionId);
    if (!actionData) return;

    const pointsResult = calculateEcoPoints({
      actionType: 'circularity_action',
      actionId,
    });

    // Update journey
    if (!this.session.journey) {
      this.session.journey = {
        totalEmissions: 0,
        netEmissions: 0,
        totalPoints: 0,
        wasteDiverted: 0,
        hasSAF: false,
        hasCircularity: false,
      };
    }

    this.session.journey.totalPoints += pointsResult.finalPoints;
    this.session.journey.wasteDiverted += actionData.waste_diverted_grams;
    this.session.journey.hasCircularity = true;

    // Step 4: Award with celebration
    const tierInfo = this.getUserTierInfo(this.session.userId);
    const updatedPoints = tierInfo.points + pointsResult.finalPoints;
    const updatedTier = getCurrentTier(updatedPoints);
    const progress = calculateTierProgress(updatedPoints);

    let message = `🎉 *Circularity Action Logged!*\n\n`;
    message += `✅ *${actionData.name}*\n\n`;
    message += `*Impact:*\n`;
    message += `• ⭐ Eco-Points: +${pointsResult.finalPoints}\n`;
    message += `• 🗑️ Waste Diverted: ${actionData.waste_diverted_grams}g\n`;
    message += `• Total Points: ${updatedPoints.toLocaleString()}\n\n`;

    // Step 5: Show tier progress
    if (updatedTier.id !== tierInfo.tier.id) {
      message += `🎊 *Tier Upgrade!*\n`;
      message += `You've reached *${updatedTier.name} Tier*!\n\n`;
    } else if (progress.progressToNext?.nextTier) {
      const progressPercent = progress.progressPercent || 0;
      const progressBar = buildProgressBar(progressPercent);
      
      message += `📊 *Tier Progress:*\n`;
      message += `${progressBar} ${progressPercent.toFixed(0)}%\n`;
      message += `${progress.pointsToNextTier || 0} points to ${progress.progressToNext.nextTier.name}\n\n`;
    }

    message += `🙏 Thank you for contributing to Changi's circular economy!`;

    await sendLongMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}

/**
 * TIER CHECK FLOW
 * 
 * - Visual tier badge (emoji)
 * - Points total
 * - Progress bar (using block characters: ▓▒░)
 * - Points to next tier
 * - Current perks
 */
export class TierCheckFlow {
  constructor(
    private bot: TelegramBot,
    private getUserTierInfo: (userId: string) => TierInfo
  ) {}

  async showTierInfo(chatId: number, userId: string) {
    const tierInfo = this.getUserTierInfo(userId);
    
    let message = `${tierInfo.tier.social_signaling.badge_icon} *${tierInfo.tier.name} Tier*\n\n`;
    message += `*Current Points:* ${tierInfo.points.toLocaleString()}\n\n`;

    if (tierInfo.progress.progressToNext?.nextTier) {
      const progressPercent = tierInfo.progress.progressPercent || 0;
      const progressBar = buildProgressBar(progressPercent);
      
      message += `📊 *Progress to ${tierInfo.progress.progressToNext.nextTier.name}:*\n`;
      message += `${progressBar} ${progressPercent.toFixed(0)}%\n`;
      message += `*Points needed:* ${(tierInfo.progress.pointsToNextTier || 0).toLocaleString()}\n\n`;
    } else {
      message += `🏆 *You've reached the highest tier!*\n\n`;
    }

    message += `*Current Perks:*\n`;
    tierInfo.tier.perks.forEach((perk, index) => {
      message += `${index + 1}. ${perk}\n`;
    });

    await sendLongMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}

/**
 * IMPACT STORY FLOW
 * 
 * - Check if user has contributions
 * - Generate story via Claude
 * - Send as formatted message with emoji
 * - Include share prompt
 */
export class ImpactStoryFlow {
  constructor(
    private bot: TelegramBot,
    private session: UserSession,
    private getUserTierInfo: (userId: string) => TierInfo
  ) {}

  async generateAndSend(chatId: number) {
    // Check if user has contributions
    if (!this.session.journey || (!this.session.journey.hasSAF && !this.session.journey.hasCircularity)) {
      await this.bot.sendMessage(
        chatId,
        `📊 *No Impact Story Yet*\n\n` +
        `You need to take some actions first!\n\n` +
        `Try:\n` +
        `• /calculate - Calculate a flight and contribute to SAF\n` +
        `• /eco - Log a circularity action\n\n` +
        `Once you've made contributions, I'll generate your personalized impact story! 🌟`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    await this.bot.sendChatAction(chatId, 'typing');

    try {
      const tierInfo = this.getUserTierInfo(this.session.userId);

      // Build context
      const journeyContext: JourneyContext = {
        flight: this.session.currentFlight ? {
          origin: 'SIN',
          destination: this.session.currentFlight.destination,
          emissions: this.session.currentFlight.emissionsKg,
          emissionsWithRF: this.session.currentFlight.emissionsWithRF,
          includeRF: true,
          safContribution: this.session.safContribution ? {
            amount: this.session.safContribution.amount,
            liters: this.session.safContribution.liters,
            emissionsReduced: this.session.safContribution.co2eAvoided,
            provider: 'neste_singapore',
            timestamp: new Date().toISOString(),
          } : undefined,
        } : undefined,
        transport: [],
        shopping: [],
        dining: [],
        circularity: this.session.journey.hasCircularity ? [{
          actionName: 'Circularity Action',
          wasteDiverted: this.session.journey.wasteDiverted,
          ecoPointsEarned: 10,
        }] : [],
        totalEcoPointsEarned: tierInfo.points,
        totalEmissions: this.session.currentFlight?.emissionsKg || 0,
        netEmissions: this.session.journey.netEmissions,
        totalWasteDiverted: this.session.journey.wasteDiverted,
      };

      const greenTierContext: GreenTierContext = {
        currentTier: {
          id: tierInfo.tier.id,
          name: tierInfo.tier.name,
          level: tierInfo.tier.level,
          points_multiplier: 1.0,
        },
        totalEcoPoints: tierInfo.points,
        lifetimeEcoPoints: tierInfo.points,
        pointsToNextTier: tierInfo.progress.pointsToNextTier,
        progressPercent: tierInfo.progress.progressPercent,
      };

      // Generate story
      const story = await generateCompleteImpactStory(journeyContext, greenTierContext);

      // Format message
      let message = `🌟 *${story.title}*\n\n`;
      message += `${story.narrative}\n\n`;
      message += `*Impact Details:*\n`;
      message += `• Emissions Reduced: ${story.details.emissionsReduced.toLocaleString()} kg CO₂e\n`;
      if (story.details.safContribution) {
        message += `• SAF Contribution: S$${story.details.safContribution.toFixed(2)}\n`;
      }
      message += `• Eco-Points Earned: ${story.details.ecoPointsEarned.toLocaleString()}\n`;
      message += `• Actions: ${story.details.actions.join(', ')}\n\n`;
      message += `💬 *Share your impact:*\n`;
      message += `Tell others about your sustainable journey!`;

      await sendLongMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📱 Share My Story', url: 'https://your-app-url.com/share' },
              { text: '🔄 Generate New Story', callback_data: 'impact_regenerate' }
            ]
          ]
        }
      });
    } catch (error) {
      console.error('Error generating impact story:', error);
      await this.bot.sendMessage(
        chatId,
        '❌ Sorry, I couldn\'t generate your impact story right now. Please try again later!',
        { parse_mode: 'Markdown' }
      );
    }
  }
}

