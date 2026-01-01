import { NextRequest, NextResponse } from 'next/server';
import { askMax, type JourneyContext, type GreenTierContext, type ChatMessage } from '@/lib/claude/askMax';
import { generateCompleteImpactStory } from '@/lib/claude/impactStories';
import { checkForNudge } from '@/lib/claude/nudges';
import { validateRequest, chatRequestSchema } from '@/lib/utils/validation';
import { createErrorResponse, createSuccessResponse, handleError, logError, ERROR_CODES } from '@/lib/utils/errors';
import { checkRateLimit, getClientId, RATE_LIMITS } from '@/lib/utils/rateLimiter';

export interface ChatResponse {
  success: boolean;
  reply?: string;
  nudge?: {
    id: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    actionType?: string;
  };
  impactStory?: {
    title: string;
    narrative: string;
    details: {
      emissionsReduced: number;
      safContribution?: number;
      offsetContribution?: number;
      ecoPointsEarned: number;
      actions: string[];
    };
  };
  error?: string;
  code?: string;
}

/**
 * POST /api/chat
 * Chat endpoint for Ask Max AI advisor
 * 
 * @param request - Next.js request object
 * @returns Chat response with AI reply, optional nudge, and optional impact story
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(request);
    const rateLimit = checkRateLimit(
      `chat:${clientId}`,
      RATE_LIMITS.CHAT_REQUESTS_PER_WINDOW,
      RATE_LIMITS.CHAT_WINDOW_MS
    );
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        createErrorResponse(
          `Rate limit exceeded. Please try again in ${rateLimit.retryAfter} seconds.`,
          ERROR_CODES.INTERNAL_ERROR
        ),
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': RATE_LIMITS.CHAT_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          },
        }
      );
    }
    
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(chatRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          `Validation failed: ${validation.error}`,
          ERROR_CODES.INVALID_INPUT,
          validation.details.errors
        ),
        { status: 400 }
      );
    }

    const { message, journeyContext, greenTierContext, chatHistory = [] } = validation.data;

    // Detect if user is asking for impact story
    const lowerMessage = message.toLowerCase().trim();
    const isImpactStoryRequest = 
      lowerMessage.includes('impact story') ||
      lowerMessage.includes('my story') ||
      lowerMessage.includes('show me my impact') ||
      (lowerMessage.includes('story') && (lowerMessage.includes('impact') || lowerMessage.includes('my')));

    let reply: string;
    let impactStory;

    if (isImpactStoryRequest) {
      // Generate impact story
      impactStory = await generateCompleteImpactStory(journeyContext, greenTierContext);
      reply = `Here's your personalized impact story! ${impactStory.narrative.substring(0, 100)}...`;
    } else {
      // Regular chat response
      reply = await askMax(message, journeyContext, greenTierContext, chatHistory);
    }

    // Check for proactive nudges
    const nudge = checkForNudge({
      journey: journeyContext,
      greenTier: greenTierContext,
      time: new Date(),
    });

    const response: ChatResponse = {
      ...createSuccessResponse(),
      reply,
      ...(nudge && { nudge }),
      ...(impactStory && { impactStory }),
    };

    return NextResponse.json(response);
  } catch (error) {
    logError(error, { endpoint: '/api/chat' });
    const errorResponse = handleError(error);
    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

