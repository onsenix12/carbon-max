/**
 * Flight Emission Calculator
 * 
 * Calculates flight emissions with full transparency including:
 * - CO2-only emissions
 * - Emissions with radiative forcing
 * - Methodology and sources
 * - Uncertainty ranges
 * - Action options (SAF and offset)
 */

import { applyRadiativeForcing, getRadiativeForcingInfo } from './radiativeForcing';
import { getFlightCalculationMethodology } from './methodology';
import emissionFactorsData from '@/data/emissionFactors.json';
import routesData from '@/data/routes.json';

export interface FlightInput {
  routeId: string;
  passengers?: number; // Defaults to 1 if not specified
  cabinClass?: 'economy' | 'business' | 'first';
}

export interface EmissionResult {
  emissions: number; // CO2 only, in kg CO2e
  emissionsWithRF: number; // With radiative forcing, in kg CO2e
  perPassenger: {
    emissions: number;
    emissionsWithRF: number;
  };
}

export interface UncertaintyRange {
  rangePercent: number;
  min: number;
  max: number;
  explanation: string;
}

export interface FactorUsed {
  name: string;
  value: number;
  unit: string;
  source: string;
  citation: string;
  year: number;
}

export interface MethodologyInfo {
  formula: string;
  factorsUsed: FactorUsed[];
  sources: Array<{
    name: string;
    citation: string;
    year: number;
  }>;
  calculationMethod: string;
}

export interface ActionOption {
  type: 'saf' | 'offset';
  priority: number; // 1 = first priority, 2 = secondary
  description: string;
  cost?: number;
  ecoPointsEarned?: number;
  emissionsReduced?: number;
}

export interface FlightEmissionResult {
  result: EmissionResult;
  methodology: MethodologyInfo;
  uncertainty: UncertaintyRange;
  actions: {
    saf: ActionOption;
    offset: ActionOption;
  };
  route: {
    id: string;
    origin: string;
    destination: string;
    distanceKm: number;
    aircraftEfficiencyRating: string;
  };
}

// Constants
const FUEL_CONSUMPTION_PER_KM = 0.0035; // liters per km per passenger (average)
const SAF_COST_PER_LITER = 2.5; // USD per liter (premium over conventional fuel)
const OFFSET_COST_PER_TONNE = 15; // USD per tonne CO2e
const SAF_EMISSIONS_REDUCTION = 0.9; // 90% reduction for waste-based SAF

// Aircraft efficiency factors
const EFFICIENCY_FACTORS: Record<string, number> = {
  A: 0.85,
  B: 1.0,
  C: 1.15
};

/**
 * Calculate flight emissions with full transparency
 * 
 * @param input - Flight input parameters
 * @returns Complete emission calculation with methodology and actions
 */
export function calculateFlightEmissions(input: FlightInput): FlightEmissionResult {
  const passengers = input.passengers || 1;
  
  // Find route data
  const route = routesData.routes.find(r => r.id === input.routeId);
  if (!route) {
    throw new Error(`Route ${input.routeId} not found`);
  }

  // Get emission factors
  const fuelFactor = emissionFactorsData.factors.aviation_fuel;
  const rfInfo = getRadiativeForcingInfo();

  // Calculate fuel consumption
  const totalFuelLiters = route.distance_km * FUEL_CONSUMPTION_PER_KM * passengers;
  const efficiencyFactor = EFFICIENCY_FACTORS[route.aircraft_efficiency_rating] || 1.0;

  // Calculate CO2 emissions (without radiative forcing)
  const co2Emissions = totalFuelLiters * fuelFactor.co2_per_liter * efficiencyFactor;
  const co2EmissionsPerPassenger = co2Emissions / passengers;

  // Apply radiative forcing
  const emissionsWithRF = applyRadiativeForcing(co2Emissions);
  const emissionsWithRFPerPassenger = emissionsWithRF / passengers;

  // Calculate uncertainty
  const fuelUncertainty = fuelFactor.uncertainty_range_percent;
  const rfUncertainty = 25; // Radiative forcing has higher uncertainty
  const combinedUncertainty = Math.sqrt(fuelUncertainty ** 2 + rfUncertainty ** 2);
  
  const uncertaintyMin = emissionsWithRF * (1 - combinedUncertainty / 100);
  const uncertaintyMax = emissionsWithRF * (1 + combinedUncertainty / 100);

  // Calculate SAF cost and benefits
  const safLitersNeeded = totalFuelLiters;
  const safCost = safLitersNeeded * SAF_COST_PER_LITER;
  const safEmissionsReduced = co2Emissions * SAF_EMISSIONS_REDUCTION;
  const safEcoPoints = Math.round(safCost * 10); // 10 points per dollar

  // Calculate offset cost
  const offsetCost = (emissionsWithRF / 1000) * OFFSET_COST_PER_TONNE;
  const offsetEcoPoints = Math.round(offsetCost * 5); // 5 points per dollar

  // Build methodology info
  const methodology: MethodologyInfo = {
    formula: `Emissions = Distance × Fuel/km × Emission Factor × Efficiency Factor × RF Multiplier`,
    factorsUsed: [
      {
        name: "Distance",
        value: route.distance_km,
        unit: "km",
        source: "Route data",
        citation: route.methodology.citation,
        year: route.methodology.year
      },
      {
        name: "Fuel consumption per km",
        value: FUEL_CONSUMPTION_PER_KM,
        unit: "L/km/passenger",
        source: "IATA",
        citation: "IATA. (2023). Carbon Offset Program Methodology. International Air Transport Association.",
        year: 2023
      },
      {
        name: "Emission factor",
        value: fuelFactor.co2_per_liter,
        unit: "kg CO2e/L",
        source: fuelFactor.source,
        citation: fuelFactor.citation,
        year: fuelFactor.year
      },
      {
        name: "Efficiency factor",
        value: efficiencyFactor,
        unit: "multiplier",
        source: "Aircraft efficiency rating",
        citation: "IATA. (2023). Carbon Offset Program Methodology. International Air Transport Association.",
        year: 2023
      },
      {
        name: "Radiative forcing multiplier",
        value: rfInfo.multiplier,
        unit: "multiplier",
        source: rfInfo.source.name,
        citation: rfInfo.source.citation,
        year: rfInfo.source.year
      }
    ],
    sources: [
      {
        name: fuelFactor.source,
        citation: fuelFactor.citation,
        year: fuelFactor.year
      },
      {
        name: rfInfo.source.name,
        citation: rfInfo.source.citation,
        year: rfInfo.source.year
      },
      {
        name: route.methodology.source,
        citation: route.methodology.citation,
        year: route.methodology.year
      }
    ],
    calculationMethod: route.methodology.calculation_method
  };

  // Build uncertainty info
  const uncertainty: UncertaintyRange = {
    rangePercent: combinedUncertainty,
    min: uncertaintyMin,
    max: uncertaintyMax,
    explanation: `Uncertainty reflects variations in fuel composition (±${fuelUncertainty}%), aircraft efficiency, and radiative forcing effects (±${rfUncertainty}%). Actual emissions may fall anywhere within this range.`
  };

  // Build action options
  const actions = {
    saf: {
      type: 'saf' as const,
      priority: 1,
      description: `Contribute to Sustainable Aviation Fuel (SAF) for this flight. SAF reduces emissions by up to 90% compared to conventional fuel.`,
      cost: safCost,
      ecoPointsEarned: safEcoPoints,
      emissionsReduced: safEmissionsReduced
    },
    offset: {
      type: 'offset' as const,
      priority: 2,
      description: `Purchase carbon offsets to neutralize the remaining emissions from this flight.`,
      cost: offsetCost,
      ecoPointsEarned: offsetEcoPoints,
      emissionsReduced: emissionsWithRF
    }
  };

  return {
    result: {
      emissions: co2Emissions,
      emissionsWithRF: emissionsWithRF,
      perPassenger: {
        emissions: co2EmissionsPerPassenger,
        emissionsWithRF: emissionsWithRFPerPassenger
      }
    },
    methodology,
    uncertainty,
    actions,
    route: {
      id: route.id,
      origin: route.origin,
      destination: route.destination,
      distanceKm: route.distance_km,
      aircraftEfficiencyRating: route.aircraft_efficiency_rating
    }
  };
}

/**
 * Calculate SAF cost based on emissions
 * 
 * @param emissionsKg - Emissions in kg CO2e (without RF)
 * @param safType - Type of SAF ('waste_based' | 'imported')
 * @returns Cost in USD
 */
export function calculateSAFCost(emissionsKg: number, safType: 'waste_based' | 'imported' = 'waste_based'): number {
  // Calculate fuel needed to produce these emissions
  const fuelFactor = emissionFactorsData.factors.aviation_fuel.co2_per_liter;
  const litersNeeded = emissionsKg / fuelFactor;
  
  // Calculate cost (premium over conventional fuel)
  return litersNeeded * SAF_COST_PER_LITER;
}

