/**
 * Application Constants
 * 
 * Centralized constants for the application.
 * Note: Simulation/mock data constants are kept in their respective files.
 */

// SAF (Sustainable Aviation Fuel) Constants
export const SAF_CONSTANTS = {
  /** CO2e reduction per liter of SAF compared to conventional fuel (kg CO2e/L) */
  CO2E_REDUCTION_PER_LITER: 2.27, // Calculated: 2.52 (conventional) - 0.25 (waste-based SAF) = 2.27
  
  /** Cost premium per liter of SAF over conventional fuel (USD) */
  COST_PER_LITER: 2.5,
  
  /** Eco-points earned per dollar spent on SAF */
  ECO_POINTS_PER_DOLLAR: 10,
  
  /** Waste-based SAF emissions reduction percentage */
  WASTE_BASED_REDUCTION: 0.9, // 90%
  
  /** Imported SAF emissions reduction percentage */
  IMPORTED_REDUCTION: 0.8, // 80%
} as const;

// Carbon Offset Constants
export const OFFSET_CONSTANTS = {
  /** Cost per tonne of CO2e offset (USD) */
  COST_PER_TONNE: 15,
  
  /** Eco-points earned per dollar spent on offsets */
  ECO_POINTS_PER_DOLLAR: 5,
} as const;

// Nudge System Constants
export const NUDGE_CONSTANTS = {
  /** Rate limiting: minimum time between nudges (milliseconds) */
  MIN_TIME_BETWEEN_NUDGES_MS: 30 * 60 * 1000, // 30 minutes
  
  /** Minimum flight emissions (kg CO2e) to trigger post-flight nudge */
  MIN_EMISSIONS_FOR_NUDGE: 500,
  
  /** Maximum points to next tier to trigger tier upgrade nudge */
  MAX_POINTS_TO_TIER_FOR_NUDGE: 100,
  
  /** Points threshold for "very close" tier upgrade messaging */
  VERY_CLOSE_TIER_THRESHOLD: 50,
} as const;

// Meal Time Constants (for plant-based nudge)
export const MEAL_TIME_CONSTANTS = {
  /** Lunch hours (24-hour format) */
  LUNCH_HOURS: [11, 12, 13] as const,
  
  /** Dinner hours (24-hour format) */
  DINNER_HOURS: [17, 18, 19] as const,
  
  /** CO2e saved per plant-based meal (kg) */
  CO2E_SAVED_PER_PLANT_MEAL: 2.5,
  
  /** Eco-points earned per plant-based meal */
  ECO_POINTS_PER_PLANT_MEAL: 50,
} as const;

// Circularity Constants
export const CIRCULARITY_CONSTANTS = {
  /** Waste diverted per cup-as-a-service action (grams) */
  WASTE_DIVERTED_PER_CUP: 15,
  
  /** Eco-points earned per cup-as-a-service action */
  ECO_POINTS_PER_CUP: 30,
} as const;

// Transport Constants
export const TRANSPORT_CONSTANTS = {
  /** Eco-points earned for MRT/Bus transport */
  ECO_POINTS_MRT_BUS: 100,
  
  /** Eco-points earned for EV Taxi transport */
  ECO_POINTS_EV_TAXI: 50,
} as const;

// Radiative Forcing Constants
export const RADIATIVE_FORCING_CONSTANTS = {
  /** Multiplier for radiative forcing effects */
  MULTIPLIER: 1.9,
  
  /** Uncertainty range for radiative forcing (%) */
  UNCERTAINTY_PERCENT: 25,
} as const;

// SAF Contribution Percentage Options
export const SAF_PERCENTAGE_OPTIONS = {
  TWENTY_FIVE: 0.25,
  FIFTY: 0.5,
  SEVENTY_FIVE: 0.75,
  ONE_HUNDRED: 1.0,
} as const;

// Helper function to convert percentage (25, 50, 75, 100) to decimal
export function safPercentageToDecimal(percent: 25 | 50 | 75 | 100): number {
  return percent / 100;
}

// Changi Airport Constants (for impact stories)
export const CHANGI_CONSTANTS = {
  /** Average daily passengers at Changi Airport */
  DAILY_PASSENGERS: 180000,
} as const;

