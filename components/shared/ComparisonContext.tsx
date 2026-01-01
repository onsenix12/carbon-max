'use client';

import { TreePine, Car } from 'lucide-react';

interface ComparisonContextProps {
  emissionsKg: number;
  hasContributions?: boolean;
}

/**
 * Provides contextual comparisons for emissions
 * Uses positive framing when contributions have been made
 */
export default function ComparisonContext({ 
  emissionsKg, 
  hasContributions = false 
}: ComparisonContextProps) {
  // Conversion factors
  const TREES_PER_YEAR = 21.77; // Average tree absorbs 21.77 kg CO2 per year
  const CAR_KM_PER_KG = 5.85; // Average car emits 0.171 kg CO2 per km, so 1 kg = ~5.85 km
  const HOUSEHOLD_DAYS = 0.4; // Average household emits ~2.5 kg CO2e per day

  const treesEquivalent = Math.round(emissionsKg / TREES_PER_YEAR);
  const carKmEquivalent = Math.round(emissionsKg * CAR_KM_PER_KG);
  const householdDaysEquivalent = Math.round(emissionsKg * HOUSEHOLD_DAYS);

  if (hasContributions && emissionsKg <= 0) {
    return (
      <div className="bg-gradient-to-br from-carbon-leaf to-carbon-forest text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <TreePine className="w-6 h-6" />
          <h3 className="font-bold text-lg">Carbon Neutral Journey!</h3>
        </div>
        <p className="text-sm opacity-90">
          Your SAF and offset contributions have fully addressed your journey's footprint.
        </p>
      </div>
    );
  }

  if (hasContributions) {
    // Positive framing when contributions made
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-carbon-leaf/20">
        <h3 className="font-bold text-changi-navy mb-4 flex items-center gap-2">
          <TreePine className="w-5 h-5 text-carbon-leaf" />
          Your Impact
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-carbon-lime rounded-lg p-2">
              <TreePine className="w-4 h-4 text-carbon-forest" />
            </div>
            <div>
              <p className="text-sm text-changi-gray">
                Equivalent to <span className="font-bold text-carbon-forest">{treesEquivalent}</span> trees absorbing CO₂ for a year
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-carbon-lime rounded-lg p-2">
              <Car className="w-4 h-4 text-carbon-forest" />
            </div>
            <div>
              <p className="text-sm text-changi-gray">
                Like avoiding <span className="font-bold text-carbon-forest">{carKmEquivalent.toLocaleString()} km</span> of car travel
              </p>
            </div>
          </div>
          {householdDaysEquivalent > 0 && (
            <div className="flex items-start gap-3">
              <div className="bg-carbon-lime rounded-lg p-2">
                <span className="text-carbon-forest text-sm">🏠</span>
              </div>
              <div>
                <p className="text-sm text-changi-gray">
                  Equivalent to <span className="font-bold text-carbon-forest">{householdDaysEquivalent}</span> days of average household emissions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Neutral framing when no contributions
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-changi-gray/20">
      <h3 className="font-bold text-changi-navy mb-4 flex items-center gap-2">
        <TreePine className="w-5 h-5 text-changi-gray" />
        Context
      </h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="bg-changi-cream rounded-lg p-2">
            <TreePine className="w-4 h-4 text-changi-gray" />
          </div>
          <div>
            <p className="text-sm text-changi-gray">
              Equivalent to <span className="font-semibold text-changi-navy">{treesEquivalent}</span> trees absorbing CO₂ for a year
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-changi-cream rounded-lg p-2">
            <Car className="w-4 h-4 text-changi-gray" />
          </div>
          <div>
            <p className="text-sm text-changi-gray">
              Like driving <span className="font-semibold text-changi-navy">{carKmEquivalent.toLocaleString()} km</span> by car
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

