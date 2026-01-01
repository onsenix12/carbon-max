'use client';

import { useState, useEffect } from 'react';
import { Calculator, Plane, Info, TreePine, Car } from 'lucide-react';
import { calculateFlightEmissions } from '@/lib/emissions/flightCalculator';
import { getRadiativeForcingInfo } from '@/lib/emissions/radiativeForcing';
import routesData from '@/data/routes.json';
import MethodologyDrawer from './MethodologyDrawer';
import SAFContribution from './SAFContribution';
import UncertaintyRange from '@/components/shared/UncertaintyRange';
import SourceCitation from '@/components/shared/SourceCitation';
import { getCurrentDemoStepFromURL } from '@/lib/demo/demoScript';

type TravelClass = 'economy' | 'business' | 'first';

export default function FlightCalculator() {
  const [destination, setDestination] = useState('');
  const [travelClass, setTravelClass] = useState<TravelClass>('economy');
  const [includeRF, setIncludeRF] = useState(true);
  const [results, setResults] = useState<ReturnType<typeof calculateFlightEmissions> | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const rfInfo = getRadiativeForcingInfo();

  // Demo mode integration
  useEffect(() => {
    const demoStep = getCurrentDemoStepFromURL();
    if (demoStep?.action?.type === 'calculate' && demoStep.action.params) {
      const params = demoStep.action.params;
      setDestination(params.routeId || '');
      setTravelClass(params.cabinClass || 'economy');
      setIncludeRF(params.includeRF !== false);
      
      // Auto-calculate after a short delay
      setTimeout(() => {
        if (params.routeId) {
          try {
            const result = calculateFlightEmissions({
              routeId: params.routeId,
              passengers: 1,
              cabinClass: params.cabinClass || 'economy',
            });
            setResults(result);
          } catch (error) {
            console.error('Demo calculation error:', error);
          }
        }
      }, 500);
    }
  }, []);

  const handleCalculate = () => {
    if (!destination) return;

    setIsCalculating(true);
    try {
      const result = calculateFlightEmissions({
        routeId: destination,
        passengers: 1,
        cabinClass: travelClass
      });
      setResults(result);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Error calculating emissions. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSAFContribute = (amount: number, safResult: any) => {
    // Handle SAF contribution - integrate with your payment/API system
    console.log('SAF Contribution:', { amount, safResult });
    alert(`SAF Contribution: $${amount.toFixed(2)}\nEco-Points: ${safResult.ecoPointsEarned}`);
  };

  const handleOffset = (amount: number) => {
    // Handle carbon offset - integrate with your payment/API system
    console.log('Carbon Offset:', amount);
    alert(`Carbon Offset: $${amount.toFixed(2)}`);
  };

  // Context comparisons
  const getContextComparisons = (emissionsKg: number) => {
    const treesPerYear = Math.round(emissionsKg / 21.77); // Average tree absorbs 21.77 kg CO2 per year
    const carKm = Math.round(emissionsKg / 0.171); // Average car emits 0.171 kg CO2 per km
    return { treesPerYear, carKm };
  };

  const comparisons = results ? getContextComparisons(results.result.emissionsWithRF) : null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-changi-navy flex items-center justify-center gap-3">
          <Calculator className="w-8 h-8" />
          Flight Carbon Calculator
        </h1>
        <p className="text-changi-gray">Calculate your flight emissions and take action</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Origin (Fixed) */}
        <div>
          <label className="block text-sm font-semibold text-changi-navy mb-2">
            Origin
          </label>
          <div className="flex items-center gap-2 p-3 bg-changi-cream rounded-lg">
            <Plane className="w-5 h-5 text-changi-purple" />
            <span className="font-semibold">Singapore (SIN)</span>
            <span className="text-sm text-changi-gray">- Fixed</span>
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-semibold text-changi-navy mb-2">
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 border border-changi-gray/30 rounded-lg focus:ring-2 focus:ring-changi-purple focus:border-transparent"
          >
            <option value="">Select destination...</option>
            {routesData.routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.destination_city}, {route.destination_country} ({route.destination})
              </option>
            ))}
          </select>
        </div>

        {/* Travel Class */}
        <div>
          <label className="block text-sm font-semibold text-changi-navy mb-3">
            Travel Class
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['economy', 'business', 'first'] as TravelClass[]).map((cls) => (
              <button
                key={cls}
                onClick={() => setTravelClass(cls)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  travelClass === cls
                    ? 'border-changi-purple bg-changi-purple/10'
                    : 'border-changi-gray/30 hover:border-changi-purple/50'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold text-changi-navy capitalize">{cls}</div>
                  <div className="text-xs text-changi-gray mt-1">
                    {cls === 'economy' && 'Standard points'}
                    {cls === 'business' && '1.5x points'}
                    {cls === 'first' && '2x points'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Radiative Forcing Toggle */}
        <div className="flex items-center justify-between p-4 bg-carbon-lime/10 rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeRF"
              checked={includeRF}
              onChange={(e) => setIncludeRF(e.target.checked)}
              className="w-5 h-5 accent-carbon-leaf"
            />
            <label htmlFor="includeRF" className="font-semibold text-changi-navy cursor-pointer">
              Include non-CO₂ effects (Radiative Forcing)
            </label>
          </div>
          <div className="relative group">
            <Info className="w-5 h-5 text-changi-gray cursor-help" />
            <div className="absolute right-0 mt-2 p-3 bg-white border border-changi-gray rounded-lg shadow-lg max-w-xs text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="font-semibold mb-1">{rfInfo.educationalContent.title}</p>
              <p className="text-changi-gray">{rfInfo.explanation}</p>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={!destination || isCalculating}
          className="w-full bg-changi-purple text-white py-4 rounded-lg font-bold text-lg hover:bg-changi-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? 'Calculating...' : 'Calculate Emissions'}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Large Emission Number */}
          <div className="bg-gradient-to-br from-carbon-leaf to-carbon-forest text-white rounded-xl p-8 text-center shadow-lg">
            <p className="text-sm uppercase tracking-wider mb-2 opacity-90">
              Total Climate Impact
            </p>
            <div className="text-6xl font-bold mb-2">
              {includeRF
                ? results.result.emissionsWithRF.toLocaleString(undefined, { maximumFractionDigits: 0 })
                : results.result.emissions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-2xl mb-4">kg CO₂e</p>
            <div className="text-lg opacity-90">
              <UncertaintyRange
                value={results.result.emissionsWithRF}
                uncertainty={results.uncertainty.rangePercent}
                unit=" kg"
                format="compact"
              />
            </div>
          </div>

          {/* Aircraft Efficiency Badge */}
          <div className="flex items-center justify-center gap-2">
            <span className="bg-changi-cream px-4 py-2 rounded-full font-semibold text-changi-navy">
              Aircraft Efficiency Rating:
            </span>
            <span className={`px-6 py-2 rounded-full font-bold text-white text-lg ${
              results.route.aircraftEfficiencyRating === 'A' ? 'bg-green-600' :
              results.route.aircraftEfficiencyRating === 'B' ? 'bg-yellow-600' :
              'bg-orange-600'
            }`}>
              {results.route.aircraftEfficiencyRating}
            </span>
          </div>

          {/* Methodology Drawer Button */}
          <button
            onClick={() => setShowMethodology(true)}
            className="w-full p-4 bg-changi-cream rounded-lg hover:bg-changi-cream/80 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-changi-navy">How we calculated this</span>
              <span className="text-changi-purple">View methodology →</span>
            </div>
          </button>

          {/* Context Comparisons */}
          {comparisons && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-changi-navy mb-4">Context</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-carbon-lime/10 rounded-lg">
                  <TreePine className="w-8 h-8 text-carbon-leaf" />
                  <div>
                    <p className="text-2xl font-bold text-carbon-forest">{comparisons.treesPerYear}</p>
                    <p className="text-sm text-changi-gray">trees needed per year</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-carbon-lime/10 rounded-lg">
                  <Car className="w-8 h-8 text-carbon-leaf" />
                  <div>
                    <p className="text-2xl font-bold text-carbon-forest">{comparisons.carKm.toLocaleString()}</p>
                    <p className="text-sm text-changi-gray">km by car equivalent</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Section - SAF FIRST */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-changi-navy">Take Action</h2>

            {/* SAF Contribution Card (Primary) */}
            <SAFContribution
              emissionsKg={results.result.emissions}
              onContribute={handleSAFContribute}
            />

            {/* Carbon Removal Card (Secondary) */}
            <div className="bg-white rounded-xl border border-changi-gray/30 shadow p-6 space-y-4 opacity-90">
              <div>
                <h3 className="text-xl font-bold text-changi-navy mb-2">Carbon Removal</h3>
                <p className="text-sm text-changi-gray mb-4">
                  Offsets are secondary to SAF for aviation. We recommend SAF first, then offsets for remaining emissions.
                </p>
              </div>

              <div className="bg-changi-cream rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-changi-navy">Cost (100% coverage):</span>
                  <span className="text-2xl font-bold text-changi-navy">
                    ${results.actions.offset.cost?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-changi-gray">Eco-Points Earned:</span>
                  <span className="font-semibold text-changi-purple">
                    {results.actions.offset.ecoPointsEarned} points
                  </span>
                </div>
                <p className="text-xs text-changi-gray mt-2">
                  Earn 5 points per dollar contributed
                </p>
              </div>

              <button
                onClick={() => handleOffset(results.actions.offset.cost || 0)}
                className="w-full bg-changi-gray text-white py-3 rounded-lg font-semibold hover:bg-changi-navy transition-colors"
              >
                Purchase Offset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Methodology Drawer */}
      <MethodologyDrawer
        isOpen={showMethodology}
        onClose={() => setShowMethodology(false)}
        methodology={results?.methodology}
      />
    </div>
  );
}

