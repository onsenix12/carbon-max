/**
 * Ask Max - AI Carbon Advisor
 * SAF-first positioning with impact stories
 */

export const ASK_MAX_SYSTEM_PROMPT = `You are Max, Changi Airport's friendly Carbon Advisor. You help travelers understand and reduce their carbon footprint while enjoying their Changi experience.

CRITICAL POSITIONING (2026 Framework Alignment):
- SAF FIRST: Always recommend Sustainable Aviation Fuel contribution before offsets
- NEVER claim "carbon neutral" — use "climate action" or "carbon contribution"
- RADIATIVE FORCING: Include non-CO2 effects (1.9x multiplier) by default
- TRANSPARENCY: Always explain methodology when asked
- CIRCULARITY: Carbon is not the only impact — address waste and sustainable choices

PERSONALITY:
- Friendly and warm, like a knowledgeable friend
- Encouraging, never preachy or guilt-inducing
- Concise and clear — respect users' time
- Use simple analogies to explain complex concepts
- Celebrate positive choices genuinely
- Acknowledge uncertainty where it exists

CONTEXT PROVIDED:
You will receive the user's current journey context including:
- Flight details and emissions (with and without RF)
- Current Green Tier status and Eco-Points
- Shopping and dining activity
- Circularity actions taken
- Chat history

SAF-FIRST MESSAGING:
When users ask about offsetting or reducing impact:
1. FIRST explain SAF and why it's better than offsets
2. Explain Singapore's 2026 SAF mandate context
3. Only THEN mention offsets as secondary option
4. Emphasize: "SAF directly reduces aviation emissions. Offsets compensate elsewhere."

Sample SAF-first response:
"Great that you want to take action! For aviation, SAF (Sustainable Aviation Fuel) is the most impactful choice — it directly reduces emissions at the source. 

For your London flight (1,842 kg CO2e), you could:
🌿 SAF contribution: S$58 — Funds 23 liters of sustainable fuel
📋 Carbon removal: S$46 — Funds verified removal projects

SAF is more expensive but has direct aviation impact. Singapore mandates 1% SAF from 2026 — you'd be ahead of the curve! Which interests you?"

IMPACT STORIES:
When appropriate, offer to generate personalized impact stories:
- Connect the user's specific contribution to tangible outcomes
- Use vivid, specific imagery (not generic "trees planted")
- Make the abstract concrete

Sample impact story prompt:
"Want to see your impact story? I can show you exactly how your S$58 SAF contribution helps — including the specific refinery in Singapore producing your fuel."

GREENWASHING PROTECTION:
- Never overstate impact
- Always cite sources when giving numbers
- Acknowledge uncertainty: "Estimates range from X to Y"
- If asked about methodology, explain in detail
- If asked about offset quality, be honest about limitations

CIRCULARITY MESSAGING:
Beyond carbon, address:
- Single-use plastics and waste
- Sustainable shopping choices
- Plant-based dining options
- Reusable alternatives (Cup-as-a-Service)

Sample circularity nudge:
"I noticed you're near Coffee Bean — they're part of our Cup-as-a-Service program! Borrow a reusable cup, return it anywhere in the terminal, and earn 30 Eco-Points. Interested?"

GREEN TIER ENCOURAGEMENT:
- Track user's progress toward next tier
- Highlight perks they'll unlock
- Create urgency when close to milestone

RESPONSE GUIDELINES:
- Keep responses under 150 words for chat
- Use 1-2 relevant emojis per response
- Always provide actionable suggestions when relevant
- Include specific locations (e.g., "Terminal 3, Level 2")
- Format numbers clearly: "1,842 kg CO2e"
- When showing comparisons, use relatable metrics

WHAT TO AVOID:
- Lecturing or making users feel guilty
- Claiming flights can be "carbon neutral"
- Recommending low-quality forest-only offsets
- Overwhelming with data — pick the most relevant stat
- Generic responses — always personalize to their journey`;

export interface JourneyContext {
  flight?: {
    origin?: string;
    destination?: string;
    emissions: number;
    emissionsWithRF?: number;
    includeRF: boolean;
    safContribution?: {
      amount: number;
      liters: number;
      emissionsReduced: number;
    };
    offsetPurchase?: {
      amount: number;
      tonnesOffset: number;
    };
  };
  transport: Array<{
    mode: string;
    emissions: number;
    ecoPointsEarned: number;
  }>;
  shopping: Array<{
    merchantName: string;
    amount: number;
    isGreenMerchant: boolean;
    ecoPointsEarned: number;
  }>;
  dining: Array<{
    restaurantName: string;
    amount: number;
    isPlantBased: boolean;
    emissionsReduced?: number;
    ecoPointsEarned: number;
  }>;
  circularity: Array<{
    actionName: string;
    wasteDiverted: number;
    ecoPointsEarned: number;
  }>;
  totalEcoPointsEarned: number;
  totalEmissions: number;
  netEmissions: number;
  totalWasteDiverted: number;
}

export interface GreenTierContext {
  currentTier: {
    id: string;
    name: string;
    level: number;
    points_multiplier: number;
  };
  totalEcoPoints: number;
  lifetimeEcoPoints: number;
  pointsToNextTier: number | null;
  progressPercent: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function buildContextString(
  journeyContext: JourneyContext,
  greenTierContext: GreenTierContext
): string {
  let context = '=== USER CONTEXT ===\n\n';

  // Green Tier Status
  context += `GREEN TIER STATUS:\n`;
  context += `- Current Tier: ${greenTierContext.currentTier.name} (Level ${greenTierContext.currentTier.level})\n`;
  context += `- Total Eco-Points: ${greenTierContext.totalEcoPoints.toLocaleString()}\n`;
  context += `- Lifetime Points: ${greenTierContext.lifetimeEcoPoints.toLocaleString()}\n`;
  context += `- Points Multiplier: ${greenTierContext.currentTier.points_multiplier}x\n`;
  if (greenTierContext.pointsToNextTier) {
    context += `- Points to Next Tier: ${greenTierContext.pointsToNextTier.toLocaleString()}\n`;
  }
  context += '\n';

  // Flight Information
  if (journeyContext.flight) {
    context += `FLIGHT:\n`;
    context += `- Route: ${journeyContext.flight.origin || 'Origin'} → ${journeyContext.flight.destination || 'Destination'}\n`;
    context += `- Emissions: ${journeyContext.flight.emissions.toFixed(1)} kg CO2e`;
    if (journeyContext.flight.includeRF && journeyContext.flight.emissionsWithRF) {
      context += ` (${journeyContext.flight.emissionsWithRF.toFixed(1)} kg CO2e with radiative forcing)\n`;
    } else {
      context += '\n';
    }
    if (journeyContext.flight.safContribution) {
      context += `- SAF Contribution: $${journeyContext.flight.safContribution.amount.toFixed(2)} (${journeyContext.flight.safContribution.liters.toFixed(1)}L, -${journeyContext.flight.safContribution.emissionsReduced.toFixed(1)} kg CO2e)\n`;
    }
    if (journeyContext.flight.offsetPurchase) {
      context += `- Offset Purchase: $${journeyContext.flight.offsetPurchase.amount.toFixed(2)} (${journeyContext.flight.offsetPurchase.tonnesOffset.toFixed(3)} t CO2e)\n`;
    }
    context += '\n';
  }

  // Transport
  if (journeyContext.transport.length > 0) {
    context += `TRANSPORT:\n`;
    journeyContext.transport.forEach(t => {
      context += `- ${t.mode}: ${t.emissions.toFixed(1)} kg CO2e, ${t.ecoPointsEarned} points\n`;
    });
    context += '\n';
  }

  // Shopping
  if (journeyContext.shopping.length > 0) {
    context += `SHOPPING:\n`;
    journeyContext.shopping.forEach(s => {
      context += `- ${s.merchantName}: $${s.amount.toFixed(2)}${s.isGreenMerchant ? ' (Green Merchant)' : ''}, ${s.ecoPointsEarned} points\n`;
    });
    context += '\n';
  }

  // Dining
  if (journeyContext.dining.length > 0) {
    context += `DINING:\n`;
    journeyContext.dining.forEach(d => {
      context += `- ${d.restaurantName}: $${d.amount.toFixed(2)}${d.isPlantBased ? ' (Plant-based)' : ''}`;
      if (d.emissionsReduced) {
        context += `, -${d.emissionsReduced.toFixed(1)} kg CO2e`;
      }
      context += `, ${d.ecoPointsEarned} points\n`;
    });
    context += '\n';
  }

  // Circularity Actions
  if (journeyContext.circularity.length > 0) {
    context += `CIRCULARITY ACTIONS:\n`;
    journeyContext.circularity.forEach(c => {
      context += `- ${c.actionName}: ${c.wasteDiverted}g waste diverted, ${c.ecoPointsEarned} points\n`;
    });
    context += `- Total waste diverted: ${(journeyContext.totalWasteDiverted / 1000).toFixed(2)} kg\n`;
    context += '\n';
  }

  // Summary
  context += `SUMMARY:\n`;
  context += `- Total Emissions: ${journeyContext.totalEmissions.toFixed(1)} kg CO2e\n`;
  context += `- Net Emissions: ${journeyContext.netEmissions.toFixed(1)} kg CO2e\n`;
  context += `- Total Eco-Points Earned: ${journeyContext.totalEcoPointsEarned.toLocaleString()}\n`;

  return context;
}

export async function askMax(
  message: string,
  journeyContext: JourneyContext,
  greenTierContext: GreenTierContext,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const contextString = buildContextString(journeyContext, greenTierContext);
  
  // Build messages array for Claude API
  // Format chat history + current message for Claude
  const conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  
  // Add chat history
  chatHistory.forEach(msg => {
    conversationMessages.push({
      role: msg.role,
      content: msg.content,
    });
  });
  
  // Add current user message
  conversationMessages.push({
    role: 'user',
    content: `${contextString}\n\n${message}`,
  });

  // Call the Claude API if API key is available
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (apiKey) {
    try {
      console.log('[AskMax] ✅ Attempting to call Claude API with model: claude-3-5-sonnet-20241022');
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: ASK_MAX_SYSTEM_PROMPT,
          messages: conversationMessages.map(m => ({
            role: m.role,
            content: [{ type: 'text', text: m.content }],
          })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Claude API error: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += ` - ${errorData.error?.message || errorText}`;
        } catch {
          errorMessage += ` - ${errorText}`;
        }
        console.error('[AskMax] ❌ Claude API request failed:', errorMessage);
        console.warn('[AskMax] ⚠️ Falling back to mock response due to API error');
        // Fall through to mock response
      } else {
        const data = await response.json();
        const responseText = data.content[0]?.text;
        
        if (!responseText) {
          console.error('[AskMax] ❌ Claude API returned empty response');
          console.warn('[AskMax] ⚠️ Falling back to mock response');
          // Fall through to mock response
        } else {
          console.log('[AskMax] ✅ Successfully received response from Claude API');
          return responseText;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[AskMax] ❌ Claude API error - falling back to mock response:', errorMessage);
      console.error('[AskMax] Error details:', error);
      // Fall through to mock response
    }
  } else {
    console.warn('[AskMax] ⚠️ ANTHROPIC_API_KEY not set in environment variables - using mock responses');
    console.warn('[AskMax] To use Claude API, set ANTHROPIC_API_KEY in your .env.local file');
  }

  // Mock response for development/demo
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('offset') && (lowerMessage.includes('should') || lowerMessage.includes('should i'))) {
    return `Great question! For aviation, I'd recommend SAF (Sustainable Aviation Fuel) contribution first. SAF directly reduces emissions at the source—in the aircraft itself—which makes it more impactful than offsets that compensate elsewhere.\n\nSingapore mandates 1% SAF from 2026, so contributing now puts you ahead of the curve. Offsets are still valuable for addressing remaining emissions, but SAF should be your first choice for aviation.\n\nWould you like to see SAF contribution options for your flight?`;
  }
  
  if (lowerMessage.includes('radiative forcing')) {
    return `Radiative forcing accounts for the non-CO2 effects of aviation emissions, like contrails and nitrogen oxides. These effects can amplify the climate impact by about 1.9x compared to CO2 alone.\n\nWe include radiative forcing by default because it gives a more complete picture of aviation's climate impact. The science is still evolving, but including it is the more conservative and transparent approach.\n\nYour flight emissions show both values: the base CO2 emissions and the total including radiative forcing effects.`;
  }
  
  if (lowerMessage.includes('impact story') || lowerMessage.includes('story')) {
    return `I'd love to generate your personalized impact story! This will show you exactly how your contributions are making a difference—with specific details about the SAF production, waste diversion, or other actions you've taken.\n\nWould you like me to create that for you now?`;
  }
  
  if (lowerMessage.includes('tier') && (lowerMessage.includes('close') || lowerMessage.includes('next'))) {
    if (greenTierContext.pointsToNextTier) {
      return `You're currently at ${greenTierContext.currentTier.name} tier with ${greenTierContext.totalEcoPoints.toLocaleString()} Eco-Points. You're ${greenTierContext.pointsToNextTier.toLocaleString()} points away from the next tier!\n\nQuick ways to earn those points:\n• SAF contribution: 10 points per dollar\n• Plant-based meal: 50 points\n• Circularity actions: 5-30 points each\n\nYou're making great progress! 🌿`;
    } else {
      return `Congratulations! You've reached the highest tier—${greenTierContext.currentTier.name}! You're earning ${greenTierContext.currentTier.points_multiplier}x points on all actions. Keep up the amazing work! 🎉`;
    }
  }

  // Default response
  return `I'm here to help you with your sustainability journey! You can ask me about:\n\n• SAF contributions and how they work\n• Your carbon footprint calculations\n• Your Green Tier progress\n• Sustainable shopping options\n• Circularity actions\n• Your impact story\n\nWhat would you like to explore?`;
}

