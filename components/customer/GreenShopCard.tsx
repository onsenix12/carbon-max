'use client';

import { MapPin, ExternalLink } from 'lucide-react';

interface Merchant {
  id: string;
  name: string;
  category: string;
  terminal: string[];
  carbon_score: number;
  carbon_score_max: number;
  sustainability_initiatives: string[];
  eco_points_multiplier: number;
}

interface GreenShopCardProps {
  merchant: Merchant;
  featured?: boolean;
}

export default function GreenShopCard({ merchant, featured = false }: GreenShopCardProps) {
  // Get carbon score letter (A-E) and color
  const getCarbonScoreInfo = (score: number) => {
    if (score >= 9) return { letter: 'A', color: 'bg-emerald-500', textColor: 'text-white' };
    if (score >= 7) return { letter: 'B', color: 'bg-green-400', textColor: 'text-carbon-forest' };
    if (score >= 5) return { letter: 'C', color: 'bg-yellow-400', textColor: 'text-changi-navy' };
    if (score >= 3) return { letter: 'D', color: 'bg-orange-400', textColor: 'text-white' };
    return { letter: 'E', color: 'bg-red-500', textColor: 'text-white' };
  };

  const carbonScoreInfo = getCarbonScoreInfo(merchant.carbon_score);
  const categoryDisplay = merchant.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const handleGetDirections = () => {
    // In a real app, this would open maps or navigation
    const terminal = merchant.terminal[0] || 'T1';
    alert(`Opening directions to ${merchant.name} at ${terminal}`);
  };

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md hover:-translate-y-1 ${
        featured
          ? 'border-2 border-carbon-leaf bg-gradient-to-br from-carbon-lime/10 to-white'
          : 'border-changi-navy/10'
      }`}
    >
      {/* Header with badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-changi-navy mb-1">{merchant.name}</h3>
          <p className="text-sm text-changi-gray">{categoryDisplay}</p>
        </div>
        {featured && (
          <span className="bg-carbon-leaf text-white px-2 py-1 rounded-full text-xs font-semibold">
            🌿 Pick
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Carbon Score Badge */}
        <div
          className={`${carbonScoreInfo.color} ${carbonScoreInfo.textColor} px-3 py-1 rounded-full text-xs font-bold`}
        >
          Carbon Score: {carbonScoreInfo.letter}
        </div>

        {/* Eco-Points Multiplier Badge */}
        {merchant.eco_points_multiplier > 1 && (
          <div className="bg-changi-purple text-white px-3 py-1 rounded-full text-xs font-semibold">
            {merchant.eco_points_multiplier}x Points
          </div>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-changi-gray mb-3">
        <MapPin className="w-4 h-4" />
        <span>{merchant.terminal.join(', ')}</span>
      </div>

      {/* Sustainability Highlights */}
      {merchant.sustainability_initiatives.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-changi-navy mb-2">Sustainability Highlights:</p>
          <ul className="space-y-1">
            {merchant.sustainability_initiatives.slice(0, 2).map((initiative, idx) => (
              <li key={idx} className="text-xs text-changi-gray flex items-start gap-1">
                <span className="text-carbon-leaf mt-0.5">•</span>
                <span>{initiative}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleGetDirections}
          className="flex-1 bg-carbon-leaf text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-carbon-forest transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Get Directions
        </button>
      </div>
    </div>
  );
}

