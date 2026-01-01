import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { askMax } from '@/lib/claude/askMax';
import merchantsData from '@/data/merchants.json';
import { validateRequest } from '@/lib/utils/validation';
import { createErrorResponse, createSuccessResponse, handleError, logError, ERROR_CODES } from '@/lib/utils/errors';
import { checkRateLimit, getClientId, RATE_LIMITS } from '@/lib/utils/rateLimiter';
import { z } from 'zod';

export interface ProductCheckRequest {
  productName: string;
  journeyContext?: {
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
    transport?: Array<{
      mode: string;
      emissions: number;
      ecoPointsEarned: number;
    }>;
    shopping?: Array<{
      merchantName: string;
      amount: number;
      isGreenMerchant: boolean;
      ecoPointsEarned: number;
    }>;
    dining?: Array<{
      restaurantName: string;
      amount: number;
      isPlantBased: boolean;
      emissionsReduced?: number;
      ecoPointsEarned: number;
    }>;
    circularity?: Array<{
      actionName: string;
      wasteDiverted: number;
      ecoPointsEarned: number;
    }>;
    totalEcoPointsEarned: number;
    totalEmissions: number;
    netEmissions: number;
    totalWasteDiverted: number;
  };
  greenTierContext?: {
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
  };
}

export interface ProductCheckResponse {
  success: boolean;
  productName: string;
  carbonFootprint?: {
    estimatedKgCO2e: number;
    uncertaintyRange: {
      min: number;
      max: number;
    };
    methodology: string;
    source?: string;
  };
  sustainableAlternatives?: Array<{
    name: string;
    category: string;
    carbonReduction: string;
    description: string;
  }>;
  merchantRecommendations?: Array<{
    id: string;
    name: string;
    category: string;
    terminals: string[];
    carbonScore: number;
    ecoPointsMultiplier: number;
    sustainabilityInitiatives: string[];
    location?: string;
  }>;
  advice: string;
  error?: string;
  code?: string;
}

const productCheckRequestSchema = z.object({
  productName: z.string().min(1, 'Product name is required').max(200, 'Product name too long'),
  journeyContext: z.object({
    flight: z.object({
      origin: z.string().optional(),
      destination: z.string().optional(),
      emissions: z.number().min(0),
      emissionsWithRF: z.number().min(0).optional(),
      includeRF: z.boolean(),
      safContribution: z.object({
        amount: z.number().min(0),
        liters: z.number().min(0),
        emissionsReduced: z.number().min(0),
      }).optional(),
      offsetPurchase: z.object({
        amount: z.number().min(0),
        tonnesOffset: z.number().min(0),
      }).optional(),
    }).optional(),
    transport: z.array(z.object({
      mode: z.string(),
      emissions: z.number().min(0),
      ecoPointsEarned: z.number().min(0),
    })).optional().default([]),
    shopping: z.array(z.object({
      merchantName: z.string(),
      amount: z.number().min(0),
      isGreenMerchant: z.boolean(),
      ecoPointsEarned: z.number().min(0),
    })).optional().default([]),
    dining: z.array(z.object({
      restaurantName: z.string(),
      amount: z.number().min(0),
      isPlantBased: z.boolean(),
      emissionsReduced: z.number().min(0).optional(),
      ecoPointsEarned: z.number().min(0),
    })).optional().default([]),
    circularity: z.array(z.object({
      actionName: z.string(),
      wasteDiverted: z.number().min(0),
      ecoPointsEarned: z.number().min(0),
    })).optional().default([]),
    totalEcoPointsEarned: z.number().min(0).optional().default(0),
    totalEmissions: z.number().min(0).optional().default(0),
    netEmissions: z.number().min(0).optional().default(0),
    totalWasteDiverted: z.number().min(0).optional().default(0),
  }).optional(),
  greenTierContext: z.object({
    currentTier: z.object({
      id: z.string(),
      name: z.string(),
      level: z.number().min(1),
      points_multiplier: z.number().min(1),
    }),
    totalEcoPoints: z.number().min(0),
    lifetimeEcoPoints: z.number().min(0),
    pointsToNextTier: z.number().min(0).nullable(),
    progressPercent: z.number().min(0).max(100),
  }).optional(),
});

/**
 * Estimate product carbon footprint based on product type
 */
function estimateProductCarbonFootprint(productName: string): {
  estimatedKgCO2e: number;
  uncertaintyRange: { min: number; max: number };
  methodology: string;
} {
  const lowerName = productName.toLowerCase();
  
  // Basic carbon footprint estimates (kg CO2e per product)
  // These are rough estimates based on product categories
  const estimates: Record<string, { base: number; uncertainty: number }> = {
    // Fashion & Accessories
    'leather': { base: 25, uncertainty: 15 },
    'handbag': { base: 30, uncertainty: 20 },
    'bag': { base: 25, uncertainty: 20 },
    'shoes': { base: 15, uncertainty: 10 },
    'clothing': { base: 10, uncertainty: 8 },
    'watch': { base: 20, uncertainty: 15 },
    'jewelry': { base: 50, uncertainty: 30 },
    
    // Electronics
    'electronics': { base: 80, uncertainty: 40 },
    'phone': { base: 60, uncertainty: 30 },
    'laptop': { base: 200, uncertainty: 100 },
    'tablet': { base: 50, uncertainty: 25 },
    'headphones': { base: 20, uncertainty: 10 },
    
    // Cosmetics & Personal Care
    'cosmetics': { base: 5, uncertainty: 3 },
    'perfume': { base: 8, uncertainty: 5 },
    'skincare': { base: 4, uncertainty: 2 },
    
    // Food & Beverages
    'coffee': { base: 2, uncertainty: 1 },
    'tea': { base: 1, uncertainty: 0.5 },
    'chocolate': { base: 3, uncertainty: 2 },
    
    // Souvenirs
    'souvenir': { base: 3, uncertainty: 2 },
    'gift': { base: 5, uncertainty: 3 },
  };

  // Find matching category
  let match: { base: number; uncertainty: number } | null = null;
  for (const [key, value] of Object.entries(estimates)) {
    if (lowerName.includes(key)) {
      match = value;
      break;
    }
  }

  // Default estimate if no match
  if (!match) {
    match = { base: 10, uncertainty: 8 };
  }

  const estimated = match.base;
  const uncertainty = match.uncertainty;
  const uncertaintyRange = {
    min: Math.max(0, estimated - uncertainty),
    max: estimated + uncertainty,
  };

  return {
    estimatedKgCO2e: estimated,
    uncertaintyRange,
    methodology: 'Estimated based on product category and typical manufacturing emissions. Actual values vary significantly based on materials, production location, and supply chain.',
  };
}

/**
 * Find relevant merchants for product recommendations
 */
function findRelevantMerchants(productName: string): Array<{
  id: string;
  name: string;
  category: string;
  terminals: string[];
  carbonScore: number;
  ecoPointsMultiplier: number;
  sustainabilityInitiatives: string[];
}> {
  const lowerName = productName.toLowerCase();
  const merchants = merchantsData.merchants;

  // Map product keywords to merchant categories
  const categoryMap: Record<string, string[]> = {
    'leather': ['luxury_fashion'],
    'handbag': ['luxury_fashion'],
    'bag': ['luxury_fashion'],
    'fashion': ['luxury_fashion'],
    'jewelry': ['luxury_jewelry'],
    'watch': ['luxury_watches'],
    'electronics': ['luxury_fashion', 'luxury_jewelry'], // Some luxury brands sell electronics
    'cosmetics': ['luxury_fashion'],
    'perfume': ['luxury_fashion'],
    'coffee': ['food_beverage'],
    'tea': ['food_beverage'],
    'food': ['food_beverage'],
    'beverage': ['food_beverage'],
  };

  // Find matching categories
  const relevantCategories: string[] = [];
  for (const [keyword, categories] of Object.entries(categoryMap)) {
    if (lowerName.includes(keyword)) {
      relevantCategories.push(...categories);
    }
  }

  // If no specific match, return top green merchants
  if (relevantCategories.length === 0) {
    return merchants
      .filter(m => m.carbon_score >= 7)
      .sort((a, b) => b.carbon_score - a.carbon_score)
      .slice(0, 3)
      .map(m => ({
        id: m.id,
        name: m.name,
        category: m.category,
        terminals: m.terminal,
        carbonScore: m.carbon_score,
        ecoPointsMultiplier: m.eco_points_multiplier,
        sustainabilityInitiatives: m.sustainability_initiatives,
      }));
  }

  // Filter merchants by relevant categories and sort by carbon score
  return merchants
    .filter(m => relevantCategories.includes(m.category))
    .sort((a, b) => b.carbon_score - a.carbon_score)
    .slice(0, 5)
    .map(m => ({
      id: m.id,
      name: m.name,
      category: m.category,
      terminals: m.terminal,
      carbonScore: m.carbon_score,
      ecoPointsMultiplier: m.eco_points_multiplier,
      sustainabilityInitiatives: m.sustainability_initiatives,
    }));
}

/**
 * POST /api/product-check
 * Check product carbon footprint and get sustainable alternatives
 * 
 * @param request - Next.js request object
 * @returns Product check response with carbon footprint, alternatives, and merchant recommendations
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(request);
    const rateLimit = checkRateLimit(
      `product-check:${clientId}`,
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
          },
        }
      );
    }
    
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(productCheckRequestSchema, body);
    if (!validation.success) {
      const zodError: ZodError = validation.details;
      return NextResponse.json(
        createErrorResponse(
          `Validation failed: ${validation.error}`,
          ERROR_CODES.INVALID_INPUT,
          zodError.issues
        ),
        { status: 400 }
      );
    }

    const { productName, journeyContext, greenTierContext } = validation.data;

    // Estimate carbon footprint
    const carbonFootprint = estimateProductCarbonFootprint(productName);

    // Find relevant merchants
    const merchantRecommendations = findRelevantMerchants(productName);

    // Generate AI advice using Ask Max
    const query = `Check before I buy: ${productName}. Please provide:
1. Estimated carbon footprint (approximately ${carbonFootprint.estimatedKgCO2e} kg CO2e)
2. Sustainable alternatives available at Changi Airport
3. Green merchant recommendations for this product
4. Tips for making a more sustainable choice

Keep the response concise (under 200 words) and actionable.`;

    const advice = await askMax(
      query,
      journeyContext || {
        transport: [],
        shopping: [],
        dining: [],
        circularity: [],
        totalEcoPointsEarned: 0,
        totalEmissions: 0,
        netEmissions: 0,
        totalWasteDiverted: 0,
      },
      greenTierContext || {
        currentTier: {
          id: 'green',
          name: 'Green',
          level: 1,
          points_multiplier: 1.0,
        },
        totalEcoPoints: 0,
        lifetimeEcoPoints: 0,
        pointsToNextTier: null,
        progressPercent: 0,
      },
      []
    );

    // Generate sustainable alternatives suggestions
    const sustainableAlternatives: Array<{
      name: string;
      category: string;
      carbonReduction: string;
      description: string;
    }> = [];

    const lowerName = productName.toLowerCase();
    if (lowerName.includes('leather') || lowerName.includes('handbag')) {
      sustainableAlternatives.push({
        name: 'Vegan Leather Alternatives',
        category: 'Fashion',
        carbonReduction: '60-80%',
        description: 'Plant-based materials like Piñatex (pineapple), mushroom leather, or recycled materials',
      });
    }
    if (lowerName.includes('electronics')) {
      sustainableAlternatives.push({
        name: 'Refurbished Electronics',
        category: 'Electronics',
        carbonReduction: '70-90%',
        description: 'Certified refurbished devices with warranty, extending product lifecycle',
      });
    }
    if (lowerName.includes('cosmetics') || lowerName.includes('perfume')) {
      sustainableAlternatives.push({
        name: 'Refillable & Sustainable Packaging',
        category: 'Beauty',
        carbonReduction: '40-60%',
        description: 'Products with refillable containers and minimal packaging',
      });
    }

    const response: ProductCheckResponse = {
      ...createSuccessResponse(),
      productName,
      carbonFootprint: {
        ...carbonFootprint,
        source: 'Estimated based on product category averages. Actual values vary by brand, materials, and production methods.',
      },
      sustainableAlternatives: sustainableAlternatives.length > 0 ? sustainableAlternatives : undefined,
      merchantRecommendations: merchantRecommendations.length > 0 ? merchantRecommendations : undefined,
      advice,
    };

    return NextResponse.json(response);
  } catch (error) {
    logError(error, { endpoint: '/api/product-check' });
    const errorResponse = handleError(error);
    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

