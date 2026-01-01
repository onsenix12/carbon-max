/**
 * SAF Book-and-Claim Module
 * 
 * Handles SAF contribution calculations, book-and-claim logic,
 * and verification tracking.
 */

import emissionFactorsData from '@/data/emissionFactors.json';
import safProjectsData from '@/data/safProjects.json';

export interface SAFContributionInput {
  routeId: string;
  emissionsKg: number; // Flight emissions in kg CO2e (without RF)
  contributionAmount: number; // USD contribution amount
  safType?: 'waste_based' | 'imported';
  provider?: 'neste_singapore' | 'shell_saf';
}

export interface SAFContributionResult {
  litersAttributed: number;
  co2eAvoided: number;
  cost: number;
  ecoPointsEarned: number;
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    registry: string;
    certificateId?: string;
    timestamp: string;
    provider: string;
  };
  bookAndClaimInfo: {
    explanation: string;
    benefits: string[];
    certification: string[];
  };
}

export interface SAFExplainer {
  title: string;
  whatIsSAF: string;
  howItWorks: string;
  bookAndClaim: {
    title: string;
    content: string;
    benefits: string[];
  };
  environmentalImpact: string;
  sources: Array<{
    name: string;
    citation: string;
    year: number;
  }>;
}

// Constants
const SAF_COST_PER_LITER = 2.5; // USD per liter (premium)
const ECO_POINTS_PER_DOLLAR = 10; // SAF earns 10 points per dollar
const WASTE_BASED_REDUCTION = 0.9; // 90% reduction
const IMPORTED_REDUCTION = 0.8; // 80% reduction

/**
 * Calculate SAF contribution and attribution
 * 
 * @param input - SAF contribution input parameters
 * @returns Complete SAF contribution result with verification
 */
export function calculateSAFContribution(input: SAFContributionInput): SAFContributionResult {
  const safType = input.safType || 'waste_based';
  const provider = input.provider || 'neste_singapore';
  
  // Get SAF provider info
  const providerData = safProjectsData.providers.find(p => p.id === provider);
  if (!providerData) {
    throw new Error(`SAF provider ${provider} not found`);
  }

  // Calculate liters attributed based on contribution amount
  const litersAttributed = input.contributionAmount / SAF_COST_PER_LITER;

  // Calculate emissions avoided
  const conventionalFuelFactor = emissionFactorsData.factors.aviation_fuel.co2_per_liter;
  const conventionalEmissions = litersAttributed * conventionalFuelFactor;
  
  const safFactor = safType === 'waste_based' 
    ? emissionFactorsData.factors.saf_waste_based.co2_per_liter
    : emissionFactorsData.factors.saf_imported.co2_per_liter;
  
  const safEmissions = litersAttributed * safFactor;
  const co2eAvoided = conventionalEmissions - safEmissions;

  // Calculate eco points
  const ecoPointsEarned = Math.round(input.contributionAmount * ECO_POINTS_PER_DOLLAR);

  // Generate verification info
  const verification = {
    status: 'pending' as const,
    registry: 'IATA Book-and-Claim Registry',
    certificateId: `SAF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    provider: providerData.name
  };

  // Get book-and-claim explainer
  const bookAndClaimInfo = {
    explanation: safProjectsData.book_and_claim_explainer.content,
    benefits: safProjectsData.book_and_claim_explainer.benefits,
    certification: safProjectsData.book_and_claim_explainer.certification.standards
  };

  return {
    litersAttributed,
    co2eAvoided,
    cost: input.contributionAmount,
    ecoPointsEarned,
    verification,
    bookAndClaimInfo
  };
}

/**
 * Get SAF explainer content for UI
 */
export function getSAFExplainer(): SAFExplainer {
  return {
    title: "Sustainable Aviation Fuel (SAF)",
    whatIsSAF: "Sustainable Aviation Fuel (SAF) is a drop-in replacement for conventional jet fuel made from renewable feedstocks such as used cooking oil, municipal waste, and agricultural residues. SAF can reduce lifecycle CO2 emissions by up to 90% compared to conventional jet fuel.",
    howItWorks: "SAF is produced at certified facilities using sustainable feedstocks. The fuel meets the same technical specifications as conventional jet fuel and can be blended up to 50% with conventional fuel without any modifications to aircraft or infrastructure.",
    bookAndClaim: {
      title: "Book-and-Claim System",
      content: safProjectsData.book_and_claim_explainer.content,
      benefits: safProjectsData.book_and_claim_explainer.benefits
    },
    environmentalImpact: "By contributing to SAF, you're directly supporting the production and use of sustainable aviation fuel. Each liter of SAF reduces emissions by approximately 2.27 kg CO2e compared to conventional fuel (90% reduction for waste-based SAF).",
    sources: [
      {
        name: "IATA",
        citation: emissionFactorsData.sources.iata.full_citation,
        year: emissionFactorsData.sources.iata.year
      },
      {
        name: "Neste",
        citation: safProjectsData.providers[0].source.citation,
        year: safProjectsData.providers[0].source.year
      }
    ]
  };
}

/**
 * Get Singapore SAF mandate information
 */
export function getSingaporeMandate() {
  return safProjectsData.singapore_mandate;
}

/**
 * Get available SAF providers
 */
export function getSAFProviders() {
  return safProjectsData.providers;
}

// Export explainer content for UI
export const SAF_EXPLAINER = getSAFExplainer();

