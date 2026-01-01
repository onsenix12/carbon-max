'use client';

import { useState, useEffect, useMemo } from 'react';
import badgesData from '@/data/badges.json';
import { useJourney } from '@/hooks/useJourney';
import { useGreenTier } from '@/hooks/useGreenTier';
import { CheckCircle2, Lock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEcoPoints } from '@/hooks/useEcoPoints';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: any;
  rarity: string;
  pointsReward: number;
}

interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

export default function BadgeGrid() {
  const { journey } = useJourney();
  const { totalEcoPoints } = useGreenTier();
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges = badgesData.badges as Badge[];

  // Check which badges are earned
  useEffect(() => {
    const earned: EarnedBadge[] = [];

    badges.forEach(badge => {
      if (checkBadgeRequirement(badge)) {
        // Check if already earned
        const existing = earnedBadges.find(e => e.badgeId === badge.id);
        if (existing) {
          earned.push(existing);
        } else {
          earned.push({
            badgeId: badge.id,
            earnedAt: new Date().toISOString(),
          });
        }
      }
    });

    setEarnedBadges(earned);
  }, [journey, totalEcoPoints, badges]);

  const checkBadgeRequirement = (badge: Badge): boolean => {
    const req = badge.requirement;

    switch (req.type) {
      case 'action_count':
        if (req.actionType === 'saf_contribution') {
          return journey.flight?.safContribution ? 1 >= req.count : false;
        }
        if (req.actionType === 'circularity_action') {
          return journey.circularity.length >= req.count;
        }
        if (req.actionType === 'transport') {
          const filtered = req.filter?.mode === 'public_transport'
            ? journey.transport.filter(t => t.mode === 'mrt' || t.mode === 'bus')
            : journey.transport;
          return filtered.length >= req.count;
        }
        if (req.actionType === 'dining') {
          const filtered = req.filter?.isPlantBased
            ? journey.dining.filter(d => d.isPlantBased)
            : journey.dining;
          return filtered.length >= req.count;
        }
        if (req.actionType === 'shopping') {
          const filtered = req.filter?.isGreenMerchant
            ? journey.shopping.filter(s => s.isGreenMerchant)
            : journey.shopping;
          return filtered.length >= req.count;
        }
        return false;

      case 'waste_diverted':
        const totalWaste = journey.circularity.reduce((sum, c) => sum + c.wasteDiverted, 0);
        return totalWaste >= req.grams;

      case 'emissions_reduced':
        const emissionsReduced =
          (journey.flight?.safContribution?.emissionsReduced || 0) +
          (journey.flight?.offsetPurchase ? journey.flight.offsetPurchase.tonnesOffset * 1000 : 0) +
          journey.dining.reduce((sum, d) => sum + (d.emissionsReduced || 0), 0);
        return emissionsReduced >= req.kg;

      case 'points_total':
        return totalEcoPoints >= req.points;

      default:
        return false;
    }
  };

  const isEarned = (badgeId: string) => {
    return earnedBadges.some(e => e.badgeId === badgeId);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Common';
      case 'rare': return 'Rare';
      case 'epic': return 'Epic';
      case 'legendary': return 'Legendary';
      default: return '';
    }
  };

  const getHowToEarn = (badge: Badge): string => {
    const req = badge.requirement;
    switch (req.type) {
      case 'action_count':
        if (req.actionType === 'saf_contribution') {
          return `Make ${req.count} SAF contribution${req.count > 1 ? 's' : ''}`;
        }
        if (req.actionType === 'circularity_action') {
          return `Complete ${req.count} circularity action${req.count > 1 ? 's' : ''}`;
        }
        if (req.actionType === 'transport') {
          return `Take ${req.count} public transport trip${req.count > 1 ? 's' : ''}`;
        }
        if (req.actionType === 'dining') {
          return `Enjoy ${req.count} plant-based meal${req.count > 1 ? 's' : ''}`;
        }
        if (req.actionType === 'shopping') {
          return `Make ${req.count} purchase${req.count > 1 ? 's' : ''} at green merchants`;
        }
        return `Complete ${req.count} ${req.actionType} action${req.count > 1 ? 's' : ''}`;
      case 'waste_diverted':
        return `Divert ${(req.grams / 1000).toFixed(1)}kg of waste from landfill`;
      case 'emissions_reduced':
        return `Reduce ${(req.kg / 1000).toFixed(1)} tonnes of CO₂e`;
      case 'points_total':
        return `Earn ${req.points.toLocaleString()} total Eco-Points`;
      default:
        return 'Complete the requirement';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-changi-navy/10 text-center">
          <div className="text-3xl font-bold text-carbon-leaf">{earnedBadges.length}</div>
          <div className="text-sm text-changi-gray">Badges Earned</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-changi-navy/10 text-center">
          <div className="text-3xl font-bold text-changi-purple">{badges.length}</div>
          <div className="text-sm text-changi-gray">Total Badges</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-changi-navy/10 text-center">
          <div className="text-3xl font-bold text-carbon-forest">
            {Math.round((earnedBadges.length / badges.length) * 100)}%
          </div>
          <div className="text-sm text-changi-gray">Completion</div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge, index) => {
          const earned = isEarned(badge.id);
          const earnedData = earnedBadges.find(e => e.badgeId === badge.id);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBadge(badge)}
              className={`relative bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all ${
                earned
                  ? `${getRarityColor(badge.rarity)} border-opacity-100`
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div className="text-center mb-3">
                <div className={`text-5xl mb-2 ${earned ? '' : 'grayscale opacity-50'}`}>
                  {badge.icon}
                </div>
                {earned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-carbon-leaf text-white rounded-full p-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.div>
                )}
                {!earned && (
                  <div className="absolute top-2 right-2 bg-gray-400 text-white rounded-full p-1">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Badge Info */}
              <div>
                <h4 className={`font-bold text-sm mb-1 ${earned ? 'text-changi-navy' : 'text-gray-400'}`}>
                  {badge.name}
                </h4>
                <p className={`text-xs mb-2 ${earned ? 'text-changi-gray' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getRarityText(badge.rarity)}
                </div>
              </div>

              {/* Earned Date */}
              {earned && earnedData && (
                <div className="mt-2 text-xs text-changi-gray">
                  Earned {new Date(earnedData.earnedAt).toLocaleDateString()}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-4">
              <div className="text-7xl mb-4">{selectedBadge.icon}</div>
              <h3 className="text-2xl font-bold text-changi-navy mb-2">{selectedBadge.name}</h3>
              <p className="text-changi-gray">{selectedBadge.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-changi-navy mb-2">How to Earn:</h4>
                <p className="text-sm text-changi-gray bg-changi-cream p-3 rounded-lg">
                  {getHowToEarn(selectedBadge)}
                </p>
              </div>

              {selectedBadge.pointsReward > 0 && (
                <div className="bg-carbon-lime/20 p-3 rounded-lg">
                  <p className="text-sm text-carbon-forest">
                    <strong>Reward:</strong> {selectedBadge.pointsReward} Eco-Points
                  </p>
                </div>
              )}

              {isEarned(selectedBadge.id) && (
                <div className="bg-carbon-leaf/10 p-3 rounded-lg border border-carbon-leaf">
                  <p className="text-sm text-carbon-forest font-semibold">
                    ✓ You've earned this badge!
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-6 w-full bg-changi-purple text-white py-3 rounded-lg font-semibold hover:bg-changi-navy transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

