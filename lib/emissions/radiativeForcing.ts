/**
 * Radiative Forcing Module
 * 
 * Explains and calculates the non-CO2 effects of aviation emissions,
 * including contrails, NOx, and water vapor at altitude.
 */

export interface RadiativeForcingInfo {
  multiplier: number;
  explanation: string;
  nonCO2Effects: {
    contrails: string;
    nox: string;
    waterVapor: string;
  };
  source: {
    name: string;
    citation: string;
    year: number;
    url?: string;
  };
  educationalContent: {
    title: string;
    description: string;
    keyPoints: string[];
  };
}

/**
 * Get radiative forcing multiplier and educational content
 * 
 * @returns RadiativeForcingInfo with multiplier (1.9) and detailed explanations
 */
export function getRadiativeForcingInfo(): RadiativeForcingInfo {
  return {
    multiplier: 1.9,
    explanation: "Radiative forcing accounts for the additional warming effects of aviation emissions at altitude, including contrails and cirrus cloud formation. This multiplier is applied to CO2 emissions to reflect the total climate impact.",
    nonCO2Effects: {
      contrails: "Contrails (condensation trails) form when aircraft exhaust mixes with cold, humid air at high altitudes. Persistent contrails can spread into cirrus clouds that trap heat in the atmosphere, contributing to warming.",
      nox: "Nitrogen oxides (NOx) from aircraft engines react in the atmosphere to form ozone, a potent greenhouse gas. At cruise altitude, these reactions are more effective, increasing the warming impact.",
      waterVapor: "Water vapor is a natural greenhouse gas. While most water vapor from aircraft quickly condenses, the additional water vapor at high altitudes can contribute to warming, especially in the upper troposphere and lower stratosphere."
    },
    source: {
      name: "Lee et al. 2021",
      citation: "Lee, D.S., Fahey, D.W., Skowron, A., Allen, M.R., Burkhardt, U., Chen, Q., Doherty, S.J., Freeman, S., Forster, P.M., Fuglestvedt, J., Gettelman, A., De León, R.R., Lim, L.L., Lund, M.T., Millar, R.J., Owen, B., Penner, J.E., Pitari, G., Prather, M.J., Sausen, R., & Wilcox, L.J. (2021). The contribution of global aviation to anthropogenic climate forcing for 2000 to 2018. Atmospheric Environment, 244, 117834.",
      year: 2021,
      url: "https://doi.org/10.1016/j.atmosenv.2020.117834"
    },
    educationalContent: {
      title: "Why Aviation's Climate Impact is More Than Just CO2",
      description: "When we calculate aviation's climate impact, we need to account for more than just carbon dioxide emissions. The multiplier of 1.9 reflects the additional warming effects that occur when aircraft fly at high altitudes.",
      keyPoints: [
        "CO2 emissions from aviation have the same warming effect regardless of altitude",
        "Non-CO2 effects (contrails, NOx, water vapor) are more significant at cruise altitude",
        "The 1.9 multiplier represents the total climate forcing relative to CO2 alone",
        "This multiplier is based on comprehensive scientific research from 2000-2018",
        "The multiplier may vary by route, time of day, and weather conditions"
      ]
    }
  };
}

/**
 * Apply radiative forcing multiplier to CO2 emissions
 * 
 * @param co2Emissions - CO2 emissions in kg CO2e
 * @returns Total climate impact including non-CO2 effects in kg CO2e
 */
export function applyRadiativeForcing(co2Emissions: number): number {
  const { multiplier } = getRadiativeForcingInfo();
  return co2Emissions * multiplier;
}

/**
 * Get the radiative forcing multiplier
 * 
 * @returns The multiplier value (1.9)
 */
export function getRadiativeForcingMultiplier(): number {
  return getRadiativeForcingInfo().multiplier;
}

