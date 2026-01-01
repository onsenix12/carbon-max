'use client';

import { useState } from 'react';
import { Search, Sparkles, Loader2, Leaf, Store, TrendingDown } from 'lucide-react';
import { useJourney } from '@/hooks/useJourney';
import { useGreenTier } from '@/hooks/useGreenTier';

interface ProductCheckResponse {
  success: boolean;
  productName: string;
  carbonFootprint?: {
    estimatedKgCO2e: number;
    uncertaintyRange: {
      min: number;
      max: number;
    };
    methodology: string;
    source?: string;
  };
  sustainableAlternatives?: Array<{
    name: string;
    category: string;
    carbonReduction: string;
    description: string;
  }>;
  merchantRecommendations?: Array<{
    id: string;
    name: string;
    category: string;
    terminals: string[];
    carbonScore: number;
    ecoPointsMultiplier: number;
    sustainabilityInitiatives: string[];
  }>;
  advice: string;
  error?: string;
}

export default function ProductAdvisor() {
  const [productName, setProductName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<ProductCheckResponse | null>(null);
  const { journey, totalEmissions, netEmissions, totalEcoPoints, totalWasteDiverted } = useJourney();
  const { tierInfo, progress, totalEcoPoints: tierPoints, lifetimeEcoPoints, tierMultiplier } = useGreenTier();

  const handleCheckProduct = async () => {
    if (!productName.trim()) return;

    setIsSearching(true);
    setResult(null);

    try {
      // Build context from hooks
      const journeyContext = {
        flight: journey.flight ? {
          origin: journey.flight.origin,
          destination: journey.flight.destination,
          emissions: journey.flight.emissions,
          emissionsWithRF: journey.flight.emissionsWithRF,
          includeRF: journey.flight.includeRF,
          safContribution: journey.flight.safContribution,
          offsetPurchase: journey.flight.offsetPurchase,
        } : undefined,
        transport: journey.transport.map(t => ({
          mode: t.mode,
          emissions: t.emissions,
          ecoPointsEarned: t.ecoPointsEarned,
        })),
        shopping: journey.shopping.map(s => ({
          merchantName: s.merchantName,
          amount: s.amount,
          isGreenMerchant: s.isGreenMerchant,
          ecoPointsEarned: s.ecoPointsEarned,
        })),
        dining: journey.dining.map(d => ({
          restaurantName: d.restaurantName,
          amount: d.amount,
          isPlantBased: d.isPlantBased,
          emissionsReduced: d.emissionsReduced,
          ecoPointsEarned: d.ecoPointsEarned,
        })),
        circularity: journey.circularity.map(c => ({
          actionName: c.actionName,
          wasteDiverted: c.wasteDiverted,
          ecoPointsEarned: c.ecoPointsEarned,
        })),
        totalEcoPointsEarned: totalEcoPoints,
        totalEmissions,
        netEmissions,
        totalWasteDiverted,
      };

      const greenTierContext = {
        currentTier: {
          id: tierInfo.id,
          name: tierInfo.name,
          level: tierInfo.level || 1,
          points_multiplier: tierMultiplier,
        },
        totalEcoPoints: tierPoints,
        lifetimeEcoPoints,
        pointsToNextTier: progress.pointsToNextTier,
        progressPercent: progress.progressPercent,
      };

      // Call product check API
      const response = await fetch('/api/product-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: productName.trim(),
          journeyContext,
          greenTierContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check product');
      }

      const data: ProductCheckResponse = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setResult({
          success: false,
          productName: productName.trim(),
          advice: data.error || 'Unable to get product advice at this time. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error checking product:', error);
      setResult({
        success: false,
        productName: productName.trim(),
        advice: 'An error occurred while checking the product. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-navy/10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-changi-purple" />
        <h2 className="text-xl font-bold text-changi-navy">Check Before You Buy</h2>
      </div>

      <p className="text-sm text-changi-gray mb-4">
        Get instant advice from Ask Max about any product's carbon footprint and find sustainable alternatives at Changi.
      </p>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCheckProduct()}
          placeholder="Enter product name (e.g., 'leather handbag', 'electronics')"
          className="flex-1 px-4 py-3 border-2 border-changi-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-changi-purple focus:border-transparent"
          disabled={isSearching}
        />
        <button
          onClick={handleCheckProduct}
          disabled={isSearching || !productName.trim()}
          className="bg-changi-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-changi-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Check
            </>
          )}
        </button>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-4 mt-4">
          {/* Carbon Footprint */}
          {result.carbonFootprint && (
            <div className="bg-carbon-lime/10 rounded-lg p-4 border border-carbon-leaf/20">
              <h3 className="font-semibold text-changi-navy mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-carbon-leaf" />
                Estimated Carbon Footprint
              </h3>
              <div className="text-2xl font-bold text-carbon-forest mb-1">
                {result.carbonFootprint.estimatedKgCO2e} kg CO₂e
              </div>
              <div className="text-xs text-changi-gray mb-2">
                Range: {result.carbonFootprint.uncertaintyRange.min} - {result.carbonFootprint.uncertaintyRange.max} kg CO₂e
              </div>
              <p className="text-xs text-changi-gray italic">{result.carbonFootprint.methodology}</p>
            </div>
          )}

          {/* Sustainable Alternatives */}
          {result.sustainableAlternatives && result.sustainableAlternatives.length > 0 && (
            <div className="bg-carbon-lime/10 rounded-lg p-4 border border-carbon-leaf/20">
              <h3 className="font-semibold text-changi-navy mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-carbon-leaf" />
                Sustainable Alternatives
              </h3>
              <div className="space-y-3">
                {result.sustainableAlternatives.map((alt, idx) => (
                  <div key={idx} className="bg-white/50 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-changi-navy">{alt.name}</span>
                      <span className="text-xs font-semibold text-carbon-forest bg-carbon-lime/30 px-2 py-1 rounded">
                        {alt.carbonReduction} less CO₂
                      </span>
                    </div>
                    <p className="text-xs text-changi-gray">{alt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Merchant Recommendations */}
          {result.merchantRecommendations && result.merchantRecommendations.length > 0 && (
            <div className="bg-carbon-lime/10 rounded-lg p-4 border border-carbon-leaf/20">
              <h3 className="font-semibold text-changi-navy mb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-carbon-leaf" />
                Green Merchant Recommendations
              </h3>
              <div className="space-y-3">
                {result.merchantRecommendations.map((merchant) => (
                  <div key={merchant.id} className="bg-white/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-changi-navy">{merchant.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-carbon-forest bg-carbon-lime/30 px-2 py-1 rounded">
                          Score: {merchant.carbonScore}/10
                        </span>
                        {merchant.ecoPointsMultiplier > 1 && (
                          <span className="text-xs font-semibold text-changi-purple bg-changi-purple/10 px-2 py-1 rounded">
                            {merchant.ecoPointsMultiplier}x points
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-changi-gray mb-2">
                      Terminals: {merchant.terminals.join(', ')}
                    </div>
                    {merchant.sustainabilityInitiatives.length > 0 && (
                      <div className="text-xs text-changi-gray">
                        <span className="font-semibold">Initiatives: </span>
                        {merchant.sustainabilityInitiatives.slice(0, 2).join(', ')}
                        {merchant.sustainabilityInitiatives.length > 2 && '...'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ask Max's Advice */}
          {result.advice && (
            <div className="bg-carbon-lime/10 rounded-lg p-4 border border-carbon-leaf/20">
              <h3 className="font-semibold text-changi-navy mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-carbon-leaf" />
                Ask Max's Advice
              </h3>
              <div className="text-sm text-changi-gray whitespace-pre-line">{result.advice}</div>
            </div>
          )}
        </div>
      )}

      {/* Example queries */}
      <div className="mt-4">
        <p className="text-xs text-changi-gray mb-2">Try asking about:</p>
        <div className="flex flex-wrap gap-2">
          {['leather handbag', 'electronics', 'cosmetics', 'souvenirs'].map((example) => (
            <button
              key={example}
              onClick={() => {
                setProductName(example);
                handleCheckProduct();
              }}
              className="text-xs bg-changi-cream hover:bg-carbon-lime/20 px-3 py-1 rounded-full text-changi-gray hover:text-carbon-forest transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

