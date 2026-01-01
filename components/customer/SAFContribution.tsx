'use client';

import { useState } from 'react';
import { Info, CheckCircle2 } from 'lucide-react';
import { calculateSAFContribution } from '@/lib/saf/bookAndClaim';
import { SAF_EXPLAINER } from '@/lib/saf/bookAndClaim';

interface SAFContributionProps {
  emissionsKg: number;
  onContribute: (amount: number, result: ReturnType<typeof calculateSAFContribution>) => void;
}

export default function SAFContribution({ emissionsKg, onContribute }: SAFContributionProps) {
  const [coveragePercent, setCoveragePercent] = useState(50);
  const [showExplainer, setShowExplainer] = useState(false);

  // Calculate SAF contribution based on coverage
  // Conventional fuel: 2.52 kg CO2e/L, SAF waste-based: 0.25 kg CO2e/L
  // Reduction per liter: 2.52 - 0.25 = 2.27 kg CO2e per liter
  const litersNeeded = (emissionsKg * (coveragePercent / 100)) / 2.27;
  const contributionAmount = litersNeeded * 2.5; // $2.5 per liter premium
  
  const result = calculateSAFContribution({
    routeId: '',
    emissionsKg: emissionsKg * (coveragePercent / 100),
    contributionAmount,
    safType: 'waste_based',
    provider: 'neste_singapore'
  });

  const coverageOptions = [25, 50, 75, 100];

  return (
    <div className="bg-white rounded-xl border-2 border-carbon-leaf shadow-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-carbon-leaf text-white px-3 py-1 rounded-full text-sm font-semibold">
              Recommended
            </span>
            <h3 className="text-xl font-bold text-changi-navy">SAF Contribution</h3>
          </div>
          <p className="text-sm text-changi-gray">
            Support Sustainable Aviation Fuel production and reduce emissions by up to 90%
          </p>
        </div>
      </div>

      {/* Coverage Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-changi-navy">
            Coverage: {coveragePercent}%
          </label>
          <div className="flex gap-2">
            {coverageOptions.map((option) => (
              <button
                key={option}
                onClick={() => setCoveragePercent(option)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  coveragePercent === option
                    ? 'bg-carbon-leaf text-white'
                    : 'bg-changi-cream text-changi-gray hover:bg-carbon-lime'
                }`}
              >
                {option}%
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="25"
          max="100"
          step="25"
          value={coveragePercent}
          onChange={(e) => setCoveragePercent(Number(e.target.value))}
          className="w-full h-2 bg-changi-cream rounded-lg appearance-none cursor-pointer accent-carbon-leaf"
        />
      </div>

      {/* SAF Details */}
      <div className="bg-carbon-lime/10 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-changi-gray">SAF Attributed:</span>
          <span className="font-semibold text-carbon-forest">
            {result.litersAttributed.toFixed(1)} liters
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-changi-gray">CO2e Avoided:</span>
          <span className="font-semibold text-carbon-forest">
            {result.co2eAvoided.toFixed(1)} kg
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-changi-gray">Provider:</span>
          <span className="font-semibold text-carbon-forest">Neste Singapore</span>
        </div>
      </div>

      {/* Cost and Points */}
      <div className="bg-changi-cream rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-changi-navy">Cost:</span>
          <span className="text-2xl font-bold text-changi-navy">
            ${contributionAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-changi-gray">Eco-Points Earned:</span>
          <span className="font-semibold text-carbon-leaf">
            {result.ecoPointsEarned} points
          </span>
        </div>
        <p className="text-xs text-changi-gray mt-2">
          Earn 10 points per dollar contributed
        </p>
      </div>

      {/* Book & Claim Info */}
      <div className="flex items-start gap-2 text-sm">
        <Info className="w-4 h-4 text-carbon-leaf mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-changi-gray">
            <strong className="text-changi-navy">Book-and-Claim:</strong> Your contribution supports 
            SAF production even if the physical fuel isn't used on your specific flight. This system 
            is certified and tracked to prevent double-counting.
          </p>
        </div>
      </div>

      {/* Why SAF? Expandable */}
      <div>
        <button
          onClick={() => setShowExplainer(!showExplainer)}
          className="w-full flex items-center justify-between p-3 bg-carbon-lime/20 rounded-lg hover:bg-carbon-lime/30 transition-colors"
        >
          <span className="font-semibold text-carbon-forest">Why SAF?</span>
          <span className="text-carbon-leaf">{showExplainer ? '−' : '+'}</span>
        </button>
        {showExplainer && (
          <div className="mt-3 p-4 bg-white rounded-lg border border-carbon-leaf/20 space-y-3">
            <div>
              <h4 className="font-semibold text-changi-navy mb-2">{SAF_EXPLAINER.title}</h4>
              <p className="text-sm text-changi-gray mb-3">{SAF_EXPLAINER.whatIsSAF}</p>
              <p className="text-sm text-changi-gray">{SAF_EXPLAINER.howItWorks}</p>
            </div>
            <div>
              <h4 className="font-semibold text-changi-navy mb-2">{SAF_EXPLAINER.bookAndClaim.title}</h4>
              <p className="text-sm text-changi-gray mb-2">{SAF_EXPLAINER.bookAndClaim.content}</p>
              <ul className="text-sm text-changi-gray list-disc list-inside space-y-1">
                {SAF_EXPLAINER.bookAndClaim.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Contribute Button */}
      <button
        onClick={() => onContribute(contributionAmount, result)}
        className="w-full bg-carbon-leaf text-white py-4 rounded-lg font-bold text-lg hover:bg-carbon-forest transition-colors flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" />
        Contribute ${contributionAmount.toFixed(2)}
      </button>
    </div>
  );
}
