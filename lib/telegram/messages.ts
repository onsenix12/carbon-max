/**
 * Telegram Bot Message Templates
 * SAF-first positioning with framework-aligned messaging
 */

import { getSingaporeMandate } from '@/lib/saf/bookAndClaim';
import { SAF_EXPLAINER } from '@/lib/saf/bookAndClaim';

const mandate = getSingaporeMandate();

/**
 * Welcome message with Green Tier status
 */
export function getWelcomeMessage(tierName: string, tierIcon: string, points: number): string {
  return `🌱 Welcome to Changi Eco Advisor!

I'm Max, your sustainable travel companion at Changi Airport. I help you understand and reduce your carbon footprint while earning Eco-Points.

Your Status:
${tierIcon} ${tierName} Tier
⭐ ${points.toLocaleString()} Eco-Points

${mandate ? `\n🇸🇬 Singapore's 2026 SAF Mandate:\nStarting 2026, all flights from Singapore must use at least 1% Sustainable Aviation Fuel (SAF). You can contribute now and be ahead of the curve!` : ''}

What would you like to do?
• Calculate your flight emissions
• Learn about SAF contributions
• Find green-rated shops
• Log circularity actions
• Check your Green Tier progress

Type /help to see all commands.`;
}

/**
 * Flight calculation result with SAF-first positioning
 */
export function getFlightResultMessage(
  destination: string,
  emissionsKg: number,
  emissionsWithRF: number,
  safContribution?: { amount: number; liters: number; co2eAvoided: number }
): string {
  let message = `✈️ Flight to ${destination}\n\n`;
  
  message += `Carbon Footprint:\n`;
  message += `• Without RF: ${emissionsKg.toLocaleString()} kg CO₂e\n`;
  message += `• With RF: ${emissionsWithRF.toLocaleString()} kg CO₂e\n\n`;
  
  message += `🌿 SAF-First Recommendation:\n`;
  message += `For aviation, SAF (Sustainable Aviation Fuel) is the most impactful choice — it directly reduces emissions at the source.\n\n`;
  
  if (safContribution) {
    message += `Your SAF Contribution:\n`;
    message += `• Amount: S$${safContribution.amount.toFixed(2)}\n`;
    message += `• Liters: ${safContribution.liters.toFixed(1)}L\n`;
    message += `• CO₂e Avoided: ${safContribution.co2eAvoided.toFixed(1)} kg\n\n`;
  } else {
    // Calculate SAF options
    const coverage25 = (emissionsKg * 0.25) / 2.27;
    const cost25 = coverage25 * 2.5;
    
    message += `Options:\n`;
    message += `🌿 25% SAF: S$${cost25.toFixed(2)} — ${coverage25.toFixed(1)}L\n`;
    message += `🌿 50% SAF: S$${(cost25 * 2).toFixed(2)} — ${(coverage25 * 2).toFixed(1)}L\n`;
    message += `🌿 75% SAF: S$${(cost25 * 3).toFixed(2)} — ${(coverage25 * 3).toFixed(1)}L\n`;
    message += `🌿 100% SAF: S$${(cost25 * 4).toFixed(2)} — ${(coverage25 * 4).toFixed(1)}L\n\n`;
  }
  
  message += `💡 SAF directly reduces aviation emissions. Offsets compensate elsewhere.\n`;
  message += `Singapore mandates 1% SAF from 2026 — you'd be ahead of the curve!`;
  
  return message;
}

/**
 * SAF explainer message
 */
export function getSAFExplainerMessage(): string {
  return `🌿 ${SAF_EXPLAINER.title}\n\n` +
    `What is SAF?\n${SAF_EXPLAINER.whatIsSAF}\n\n` +
    `How It Works:\n${SAF_EXPLAINER.howItWorks}\n\n` +
    `📋 Book-and-Claim:\n${SAF_EXPLAINER.bookAndClaim.content}\n\n` +
    `Benefits:\n${SAF_EXPLAINER.bookAndClaim.benefits.map(b => `• ${b}`).join('\n')}\n\n` +
    `🌍 Impact:\n${SAF_EXPLAINER.environmentalImpact}\n\n` +
    `🇸🇬 Singapore Mandate:\nStarting 2026, all flights from Singapore must use at least 1% SAF. By contributing now, you're supporting the transition to sustainable aviation.\n\n` +
    `Use /saf to contribute to SAF for your flight.`;
}

/**
 * Tier progress message
 */
export function getTierProgressMessage(
  currentTier: string,
  currentTierIcon: string,
  currentPoints: number,
  nextTier?: { name: string; minPoints: number },
  pointsNeeded?: number,
  progressPercent?: number
): string {
  let message = `${currentTierIcon} ${currentTier} Tier\n\n`;
  message += `Current Points: ${currentPoints.toLocaleString()}\n`;
  
  if (nextTier && pointsNeeded !== undefined) {
    message += `\n📊 Progress to ${nextTier.name}:\n`;
    message += `• Points needed: ${pointsNeeded.toLocaleString()}\n`;
    if (progressPercent !== undefined) {
      const progressBar = '█'.repeat(Math.floor(progressPercent / 10)) + '░'.repeat(10 - Math.floor(progressPercent / 10));
      message += `• Progress: ${progressBar} ${progressPercent.toFixed(0)}%\n`;
    }
  } else {
    message += `\n🏆 You've reached the highest tier!`;
  }
  
  return message;
}

/**
 * Journey summary message
 */
export function getJourneySummaryMessage(
  totalEmissions: number,
  netEmissions: number,
  totalPoints: number,
  wasteDiverted: number,
  hasSAF: boolean,
  hasCircularity: boolean
): string {
  let message = `📊 Your Journey Summary\n\n`;
  
  message += `Carbon Footprint:\n`;
  message += `• Total: ${totalEmissions.toLocaleString()} kg CO₂e\n`;
  message += `• Net (after actions): ${netEmissions.toLocaleString()} kg CO₂e\n`;
  message += `• Reduced: ${(totalEmissions - netEmissions).toLocaleString()} kg CO₂e\n\n`;
  
  if (hasSAF) {
    message += `🌿 SAF Contribution: ✓\n`;
  }
  if (hasCircularity) {
    message += `♻️ Circularity Actions: ✓\n`;
    message += `• Waste Diverted: ${(wasteDiverted / 1000).toFixed(2)} kg\n`;
  }
  
  message += `\n⭐ Eco-Points Earned: ${totalPoints.toLocaleString()}`;
  
  return message;
}

/**
 * Impact story message
 */
export function getImpactStoryMessage(story: {
  title: string;
  narrative: string;
  details: {
    emissionsReduced: number;
    safContribution?: number;
    offsetContribution?: number;
    ecoPointsEarned: number;
    actions: string[];
  };
}): string {
  let message = `🌟 ${story.title}\n\n`;
  message += `${story.narrative}\n\n`;
  message += `Impact Details:\n`;
  message += `• Emissions Reduced: ${story.details.emissionsReduced.toLocaleString()} kg CO₂e\n`;
  if (story.details.safContribution) {
    message += `• SAF Contribution: S$${story.details.safContribution.toFixed(2)}\n`;
  }
  message += `• Eco-Points Earned: ${story.details.ecoPointsEarned.toLocaleString()}\n`;
  message += `• Actions: ${story.details.actions.join(', ')}\n`;
  
  return message;
}

/**
 * Circularity action logged message
 */
export function getCircularityActionMessage(
  actionName: string,
  pointsEarned: number,
  wasteDiverted: number
): string {
  return `♻️ Circularity Action Logged!\n\n` +
    `Action: ${actionName}\n` +
    `⭐ Eco-Points: +${pointsEarned}\n` +
    `🗑️ Waste Diverted: ${wasteDiverted}g\n\n` +
    `Thank you for contributing to Changi's circular economy!`;
}

/**
 * Help message with all commands
 */
export function getHelpMessage(): string {
  return `📚 Changi Eco Advisor Commands\n\n` +
    `/start - Welcome message and Green Tier status\n` +
    `/calculate - Calculate flight emissions (SAF-first results)\n` +
    `/saf - Learn about and contribute to SAF\n` +
    `/journey - View current journey summary\n` +
    `/shop - Find green-rated shops at Changi\n` +
    `/eco - Log a circularity action\n` +
    `/tier - Check your Green Tier status and progress\n` +
    `/ask [question] - Ask Max anything about sustainability\n` +
    `/impact - Get your personalized impact story\n\n` +
    `💡 Tip: SAF (Sustainable Aviation Fuel) is the most impactful way to reduce aviation emissions. Singapore mandates 1% SAF from 2026!`;
}

