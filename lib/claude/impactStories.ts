/**
 * Impact Story Generator
 * Creates vivid, specific, emotional narratives about user contributions
 */

import type { JourneyContext, GreenTierContext } from '@/lib/claude/askMax';
import { SAF_CONSTANTS, CHANGI_CONSTANTS } from '@/lib/constants';

export const IMPACT_STORY_PROMPT = `Generate a personalized, vivid impact story for the user's climate contribution.

CONTRIBUTION DETAILS:
{contribution_type}: {amount}
CO2e addressed: {co2e_kg} kg
Provider/Project: {provider}

STORY REQUIREMENTS:
1. Make it SPECIFIC — name actual places, processes, people (use realistic examples)
2. Make it VISUAL — describe what the user would see if they visited
3. Make it EMOTIONAL — connect to human impact, not just numbers
4. Keep it SHORT — 3-4 sentences max
5. End with GRATITUDE — thank them genuinely

SAF STORY EXAMPLE:
"Your 23 liters of SAF was produced at Neste's Singapore refinery from used cooking oil collected from restaurants across the city. Right now, that fuel is being blended into the jet fuel tanks at Changi, ready to power flights with 80% lower lifecycle emissions. You've just helped Singapore hit its 2026 mandate early. Thank you for flying forward."

OFFSET/REMOVAL STORY EXAMPLE:
"Your contribution funded the capture of 1.8 tonnes of CO2 at Climeworks' Orca facility in Iceland — the world's largest direct air capture plant. The CO2 is now mineralized in basalt rock, where it will stay for thousands of years. That's climate action with permanence. Thank you for choosing removal over avoidance."

CIRCULARITY STORY EXAMPLE:
"Today you diverted 15 grams of plastic from Singapore's only landfill. Multiply that by the 180,000 passengers who pass through Changi daily, and you're part of a movement that could divert 2.7 tonnes of plastic every single day. Small action, massive collective impact. Thank you for starting the ripple."

Generate a story for the user's contribution. Be specific and vivid.`;

export interface ImpactStoryInput {
  contributionType: 'saf' | 'offset' | 'circularity';
  amount: number;
  co2eKg: number;
  provider: string;
  additionalDetails?: {
    liters?: number;
    wasteDiverted?: number;
    location?: string;
    route?: string;
  };
}

export interface ImpactStory {
  title: string;
  narrative: string;
  details: {
    emissionsReduced: number;
    safContribution?: number;
    offsetContribution?: number;
    ecoPointsEarned: number;
    actions: string[];
  };
}

export async function generateImpactStory(
  input: ImpactStoryInput
): Promise<string> {
  const { contributionType, amount, co2eKg, provider, additionalDetails } = input;

  let prompt = IMPACT_STORY_PROMPT
    .replace('{contribution_type}', contributionType)
    .replace('{amount}', `$${amount.toFixed(2)}`)
    .replace('{co2e_kg}', co2eKg.toFixed(1))
    .replace('{provider}', provider);

  // Add additional context if available
  if (additionalDetails) {
    prompt += `\n\nADDITIONAL CONTEXT:\n`;
    if (additionalDetails.liters) {
      prompt += `- SAF Liters: ${additionalDetails.liters.toFixed(1)}L\n`;
    }
    if (additionalDetails.wasteDiverted) {
      prompt += `- Waste Diverted: ${additionalDetails.wasteDiverted}g\n`;
    }
    if (additionalDetails.location) {
      prompt += `- Location: ${additionalDetails.location}\n`;
    }
    if (additionalDetails.route) {
      prompt += `- Route: ${additionalDetails.route}\n`;
    }
  }

  // Call the Claude API if API key is available
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (apiKey) {
    try {
      console.log('[ImpactStories] ✅ Attempting to call Claude API to generate impact story');
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2024-01-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 512,
          messages: [
            {
              role: 'user',
              content: [{ type: 'text', text: prompt }],
            },
          ],
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
        console.error('[ImpactStories] ❌ Claude API request failed:', errorMessage);
        console.warn('[ImpactStories] ⚠️ Falling back to mock response due to API error');
        // Fall through to mock response
      } else {
        const data = await response.json();
        const responseText = data.content[0]?.text;
        
        if (!responseText) {
          console.error('[ImpactStories] ❌ Claude API returned empty response');
          console.warn('[ImpactStories] ⚠️ Falling back to mock response');
          // Fall through to mock response
        } else {
          console.log('[ImpactStories] ✅ Successfully received response from Claude API');
          return responseText;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[ImpactStories] ❌ Claude API error - falling back to mock response:', errorMessage);
      console.error('[ImpactStories] Error details:', error);
      // Fall through to mock response
    }
  } else {
    console.warn('[ImpactStories] ⚠️ ANTHROPIC_API_KEY not set in environment variables - using mock responses');
    console.warn('[ImpactStories] To use Claude API, set ANTHROPIC_API_KEY in your .env.local file');
  }

  // Mock responses for development/demo
  if (contributionType === 'saf') {
    const liters = additionalDetails?.liters || (amount / SAF_CONSTANTS.COST_PER_LITER);
    return `Your ${liters.toFixed(0)} liters of SAF was produced at ${provider === 'neste_singapore' ? "Neste's Singapore refinery" : provider} from used cooking oil collected from restaurants across the city. Right now, that fuel is being blended into the jet fuel tanks at Changi, ready to power flights with up to 90% lower lifecycle emissions. You've just helped Singapore hit its 2026 SAF mandate early. Thank you for flying forward.`;
  }

  if (contributionType === 'offset') {
    return `Your contribution funded the capture of ${(co2eKg / 1000).toFixed(1)} tonnes of CO2 through verified removal projects. The CO2 is being permanently stored, where it will stay for thousands of years. That's climate action with permanence. Thank you for choosing removal over avoidance.`;
  }

  if (contributionType === 'circularity') {
    const wasteKg = (additionalDetails?.wasteDiverted || 0) / 1000;
    return `Today you diverted ${wasteKg.toFixed(2)} kg of waste from Singapore's only landfill. Multiply that by the ${CHANGI_CONSTANTS.DAILY_PASSENGERS.toLocaleString()} passengers who pass through Changi daily, and you're part of a movement that could divert ${(wasteKg * CHANGI_CONSTANTS.DAILY_PASSENGERS / 1000).toFixed(1)} tonnes of waste every single day. Small action, massive collective impact. Thank you for starting the ripple.`;
  }

  return `Your contribution of $${amount.toFixed(2)} is making a real difference in addressing climate change. Thank you for taking action.`;
}

/**
 * Generate a complete impact story with title and details
 */
export async function generateCompleteImpactStory(
  journeyContext: JourneyContext,
  greenTierContext: GreenTierContext
): Promise<ImpactStory> {
  const actions: string[] = [];
  let emissionsReduced = 0;
  let safContribution: number | undefined;
  let offsetContribution: number | undefined;
  let narrative = '';

  // Build narrative from all contributions
  const narratives: string[] = [];

  if (journeyContext.flight?.safContribution) {
    const safAmount = journeyContext.flight.safContribution.amount;
    safContribution = safAmount;
    emissionsReduced += journeyContext.flight.safContribution.emissionsReduced;
    actions.push('SAF Contribution');
    
    const safStory = await generateImpactStory({
      contributionType: 'saf',
      amount: safAmount,
      co2eKg: journeyContext.flight.safContribution.emissionsReduced,
      provider: 'neste_singapore',
      additionalDetails: {
        liters: journeyContext.flight.safContribution.liters,
        route: `${journeyContext.flight.origin} → ${journeyContext.flight.destination}`,
      },
    });
    narratives.push(safStory);
  }

  if (journeyContext.flight?.offsetPurchase) {
    const offsetAmount = journeyContext.flight.offsetPurchase.amount;
    offsetContribution = offsetAmount;
    emissionsReduced += journeyContext.flight.offsetPurchase.tonnesOffset * 1000;
    actions.push('Carbon Offset');
    
    const offsetStory = await generateImpactStory({
      contributionType: 'offset',
      amount: offsetAmount,
      co2eKg: journeyContext.flight.offsetPurchase.tonnesOffset * 1000,
      provider: 'verified_removal',
    });
    narratives.push(offsetStory);
  }

  if (journeyContext.circularity && journeyContext.circularity.length > 0) {
    const circularityArray = Array.isArray(journeyContext.circularity) 
      ? journeyContext.circularity 
      : [];
    const totalWaste = circularityArray.reduce(
      (sum: number, c) => sum + c.wasteDiverted,
      0
    );
    actions.push(`${circularityArray.length} Circularity Action${circularityArray.length > 1 ? 's' : ''}`);
    
    const circularityStory = await generateImpactStory({
      contributionType: 'circularity',
      amount: 0, // Circularity actions don't have monetary value
      co2eKg: 0, // Waste diversion, not CO2
      provider: 'changi_airport',
      additionalDetails: {
        wasteDiverted: totalWaste,
      },
    });
    narratives.push(circularityStory);
  }

  if (journeyContext.shopping && Array.isArray(journeyContext.shopping) && journeyContext.shopping.some((s) => s.isGreenMerchant)) {
    actions.push('Green Shopping');
  }

  if (journeyContext.dining && Array.isArray(journeyContext.dining) && journeyContext.dining.some((d) => d.isPlantBased)) {
    actions.push('Plant-Based Dining');
    emissionsReduced += journeyContext.dining.reduce(
      (sum: number, d) => sum + (d.emissionsReduced || 0),
      0
    );
  }

  // Combine narratives
  narrative = narratives.join('\n\n') || 
    `Every action you take creates a ripple effect. By choosing to address your travel footprint through SAF contributions and sustainable choices, you're not just reducing emissions—you're supporting the transition to cleaner aviation fuels and demonstrating that responsible travel is possible.\n\nYour journey from ${journeyContext.flight?.origin || 'your origin'} to ${journeyContext.flight?.destination || 'your destination'} represents more than just a trip. It's a statement about the future you want to see—one where travel and sustainability go hand in hand.`;

  return {
    title: 'Your Journey Towards Sustainable Travel',
    narrative,
    details: {
      emissionsReduced,
      safContribution,
      offsetContribution,
      ecoPointsEarned: journeyContext.totalEcoPointsEarned,
      actions,
    },
  };
}

