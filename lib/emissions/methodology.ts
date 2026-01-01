/**
 * Methodology Module
 * 
 * Exports source citations, uncertainty explanations, and
 * "How we calculated this" content for transparency.
 */

export interface SourceCitation {
  name: string;
  fullCitation: string;
  url?: string;
  year: number;
  description: string;
}

export interface UncertaintyExplanation {
  category: string;
  explanation: string;
  rangePercent: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface CalculationMethodology {
  title: string;
  description: string;
  formula: string;
  steps: string[];
  factors: string[];
  sources: SourceCitation[];
}

/**
 * Get all source citations for emission factors
 */
export function getSourceCitations(): Record<string, SourceCitation> {
  return {
    defra_2023: {
      name: "DEFRA 2023",
      fullCitation: "Department for Environment, Food & Rural Affairs (DEFRA). (2023). Greenhouse gas reporting: conversion factors 2023. UK Government.",
      url: "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023",
      year: 2023,
      description: "UK Government standard conversion factors for greenhouse gas reporting"
    },
    iata: {
      name: "IATA",
      fullCitation: "International Air Transport Association (IATA). (2023). Sustainable Aviation Fuel (SAF) Lifecycle Assessment. IATA Environmental Programs.",
      url: "https://www.iata.org/en/programs/environment/sustainable-aviation-fuels/",
      year: 2023,
      description: "IATA standards and guidelines for SAF lifecycle assessment"
    },
    lee_et_al_2021: {
      name: "Lee et al. 2021",
      fullCitation: "Lee, D.S., Fahey, D.W., Skowron, A., Allen, M.R., Burkhardt, U., Chen, Q., Doherty, S.J., Freeman, S., Forster, P.M., Fuglestvedt, J., Gettelman, A., De León, R.R., Lim, L.L., Lund, M.T., Millar, R.J., Owen, B., Penner, J.E., Pitari, G., Prather, M.J., Sausen, R., & Wilcox, L.J. (2021). The contribution of global aviation to anthropogenic climate forcing for 2000 to 2018. Atmospheric Environment, 244, 117834.",
      url: "https://doi.org/10.1016/j.atmosenv.2020.117834",
      year: 2021,
      description: "Comprehensive study on aviation's contribution to climate forcing, including radiative forcing effects"
    }
  };
}

/**
 * Get uncertainty explanations for different emission categories
 */
export function getUncertaintyExplanations(): UncertaintyExplanation[] {
  return [
    {
      category: "Aviation Fuel (Conventional)",
      explanation: "Conventional jet fuel emissions are well-established with high confidence. The 5% uncertainty reflects variations in fuel composition and combustion efficiency.",
      rangePercent: 5,
      confidence: "high"
    },
    {
      category: "SAF (Waste-based)",
      explanation: "Waste-based SAF emissions have higher uncertainty (15%) due to variations in feedstock sources, production methods, and transportation distances. The lifecycle assessment includes all stages from feedstock collection to fuel delivery.",
      rangePercent: 15,
      confidence: "medium"
    },
    {
      category: "SAF (Imported)",
      explanation: "Imported SAF has the highest uncertainty (20%) as it includes additional transportation emissions and variations in production methods across different regions.",
      rangePercent: 20,
      confidence: "medium"
    },
    {
      category: "Radiative Forcing",
      explanation: "The 1.9 multiplier for radiative forcing is based on comprehensive research but can vary by route, time of day, and weather conditions. The actual impact may range from 1.5 to 2.5 depending on specific flight conditions.",
      rangePercent: 25,
      confidence: "medium"
    },
    {
      category: "Waste Management",
      explanation: "Waste-related emissions have higher uncertainty (15-25%) due to variations in waste composition, local processing methods, and methane capture rates at landfills.",
      rangePercent: 20,
      confidence: "medium"
    }
  ];
}

/**
 * Get "How we calculated this" content for flight emissions
 */
export function getFlightCalculationMethodology(): CalculationMethodology {
  return {
    title: "How We Calculate Flight Emissions",
    description: "Our flight emission calculations use distance-based methodology with aircraft-specific efficiency factors and account for non-CO2 effects through radiative forcing.",
    formula: "Emissions (kg CO2e) = Distance (km) × Fuel per km × Emission Factor (kg CO2e/L) × Efficiency Factor × Radiative Forcing Multiplier",
    steps: [
      "Determine flight distance in kilometers",
      "Calculate fuel consumption based on distance and aircraft type",
      "Apply emission factor (2.52 kg CO2e per liter for conventional fuel)",
      "Adjust for aircraft efficiency rating (A: 0.85, B: 1.0, C: 1.15)",
      "Apply radiative forcing multiplier (1.9) to account for non-CO2 effects",
      "Calculate uncertainty range based on factor confidence levels"
    ],
    factors: [
      "Flight distance (route-specific)",
      "Aircraft efficiency rating (A/B/C)",
      "Emission factor: 2.52 kg CO2e per liter (DEFRA 2023)",
      "Radiative forcing multiplier: 1.9 (Lee et al. 2021)",
      "Uncertainty: ±5% for fuel factor, ±25% for radiative forcing"
    ],
    sources: [
      getSourceCitations().defra_2023,
      getSourceCitations().lee_et_al_2021,
      {
        name: "IATA Carbon Offset Program",
        fullCitation: "IATA. (2023). Carbon Offset Program Methodology. International Air Transport Association.",
        year: 2023,
        description: "IATA standard methodology for flight emission calculations"
      }
    ]
  };
}

/**
 * Get "How we calculated this" content for SAF emissions
 */
export function getSAFCalculationMethodology(): CalculationMethodology {
  return {
    title: "How We Calculate SAF Emissions",
    description: "SAF emissions are calculated using lifecycle assessment (LCA) methodology that accounts for all stages from feedstock production to fuel delivery.",
    formula: "SAF Emissions (kg CO2e) = Fuel Volume (L) × SAF Emission Factor (kg CO2e/L)",
    steps: [
      "Determine SAF volume in liters",
      "Identify SAF type (waste-based: 0.25 kg CO2e/L, imported: 0.50 kg CO2e/L)",
      "Calculate total emissions using appropriate factor",
      "Calculate emissions avoided compared to conventional fuel",
      "Apply uncertainty range (15-20% depending on SAF type)"
    ],
    factors: [
      "Waste-based SAF: 0.25 kg CO2e per liter (90% reduction)",
      "Imported SAF: 0.50 kg CO2e per liter (80% reduction)",
      "Uncertainty: ±15% for waste-based, ±20% for imported",
      "Certification: ISCC or RSB required"
    ],
    sources: [
      getSourceCitations().iata,
      {
        name: "ISCC",
        fullCitation: "International Sustainability and Carbon Certification (ISCC). (2023). ISCC Standards for Sustainable Aviation Fuel.",
        year: 2023,
        description: "International certification standard for sustainable fuels"
      }
    ]
  };
}

/**
 * Get explanation for uncertainty ranges
 */
export function getUncertaintyExplanation(): string {
  return `Uncertainty ranges reflect the scientific confidence in our emission factors. These ranges account for:

• **Variations in fuel composition** - Different fuel batches may have slightly different carbon content
• **Aircraft efficiency** - Actual fuel consumption varies by aircraft age, maintenance, and flight conditions
• **Radiative forcing variability** - Non-CO2 effects vary by route, time of day, and weather
• **SAF production methods** - Different feedstocks and production processes affect lifecycle emissions
• **Measurement limitations** - Some factors are based on models and estimates rather than direct measurement

We provide uncertainty ranges to give you a realistic understanding of the precision of our calculations. The actual emissions for your specific flight may fall anywhere within the stated range.`;
}

