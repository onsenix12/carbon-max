'use client';

import { useJourney } from '@/hooks/useJourney';
import { CheckCircle2, Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface CarbonReceiptProps {
  onGetImpactStory?: () => void;
}

export default function CarbonReceipt({ onGetImpactStory }: CarbonReceiptProps) {
  const { journey, totalEmissions, netEmissions, totalEcoPoints } = useJourney();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `I've addressed ${((totalEmissions - netEmissions) / totalEmissions * 100).toFixed(0)}% of my journey's carbon footprint! 🌱\n\nGross: ${totalEmissions.toFixed(1)} kg CO₂e\nNet: ${netEmissions.toFixed(1)} kg CO₂e\nEco-Points: ${totalEcoPoints}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Carbon Impact',
        text,
      }).catch(() => {
        // Fallback to copy
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const journeyDate = journey.createdAt 
    ? new Date(journey.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  const route = journey.flight
    ? `${journey.flight.origin || 'Origin'} → ${journey.flight.destination || 'Destination'}`
    : 'Journey';

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-changi-gray/10">
      {/* Receipt Header */}
      <div className="text-center mb-6 pb-4 border-b border-changi-gray/20">
        <h2 className="font-bold text-2xl text-changi-navy mb-2">Carbon Receipt</h2>
        <p className="text-sm text-changi-gray">{journeyDate}</p>
        <p className="text-sm font-semibold text-changi-navy mt-1">{route}</p>
      </div>

      {/* Itemized Emissions */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-changi-gray/10">
          <span className="text-changi-gray">Flight Emissions</span>
          <span className="font-semibold text-changi-navy">
            {journey.flight ? (journey.flight.includeRF && journey.flight.emissionsWithRF 
              ? journey.flight.emissionsWithRF 
              : journey.flight.emissions).toFixed(1) : '0.0'} kg CO₂e
          </span>
        </div>
        
        {journey.transport.length > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-changi-gray/10">
            <span className="text-changi-gray">Transport</span>
            <span className="font-semibold text-changi-navy">
              {journey.transport.reduce((sum, t) => sum + t.emissions, 0).toFixed(1)} kg CO₂e
            </span>
          </div>
        )}

        {journey.shopping.length > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-changi-gray/10">
            <span className="text-changi-gray">Shopping</span>
            <span className="font-semibold text-changi-navy">
              {journey.shopping.length} transaction{journey.shopping.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {journey.dining.length > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-changi-gray/10">
            <span className="text-changi-gray">Dining</span>
            <span className="font-semibold text-changi-navy">
              {journey.dining.length} meal{journey.dining.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* SAF Contribution */}
        {journey.flight?.safContribution && (
          <div className="flex justify-between items-center py-2 border-b border-carbon-leaf/30 bg-carbon-lime/20 -mx-2 px-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-carbon-leaf" />
              <span className="text-carbon-forest font-semibold">SAF Contribution</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-carbon-forest">
                -{journey.flight.safContribution.emissionsReduced.toFixed(1)} kg CO₂e
              </span>
              <p className="text-xs text-carbon-forest/70">
                ${journey.flight.safContribution.amount.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Offset Purchase */}
        {journey.flight?.offsetPurchase && (
          <div className="flex justify-between items-center py-2 border-b border-carbon-leaf/30 bg-carbon-lime/20 -mx-2 px-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-carbon-leaf" />
              <span className="text-carbon-forest font-semibold">Carbon Offset</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-carbon-forest">
                -{journey.flight.offsetPurchase.tonnesOffset.toFixed(3)} t CO₂e
              </span>
              <p className="text-xs text-carbon-forest/70">
                ${journey.flight.offsetPurchase.amount.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Verification Status */}
        {(journey.flight?.safContribution || journey.flight?.offsetPurchase) && (
          <div className="pt-2 pb-4 border-b border-changi-gray/20">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-carbon-leaf" />
              <span className="text-carbon-forest font-semibold">Verified</span>
              <span className="text-changi-gray text-xs">
                (IATA Book-and-Claim Registry)
              </span>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-4">
          <span className="font-bold text-lg text-changi-navy">Net Emissions</span>
          <span className="font-bold text-2xl text-carbon-forest">
            {netEmissions.toFixed(1)} kg CO₂e
          </span>
        </div>
      </div>

      {/* Eco-Points Earned */}
      <div className="bg-carbon-lime/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-carbon-forest" />
            <span className="font-semibold text-carbon-forest">Eco-Points Earned</span>
          </div>
          <span className="font-bold text-2xl text-carbon-forest">
            +{totalEcoPoints.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {onGetImpactStory && (
          <button
            onClick={onGetImpactStory}
            className="w-full bg-gradient-to-r from-carbon-leaf to-carbon-forest text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Get Impact Story
          </button>
        )}
        
        <button
          onClick={handleShare}
          className="w-full bg-white border-2 border-carbon-leaf text-carbon-forest font-semibold py-3 px-4 rounded-lg hover:bg-carbon-lime/20 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          {copied ? 'Copied!' : 'Share Your Impact'}
        </button>
      </div>
    </div>
  );
}

