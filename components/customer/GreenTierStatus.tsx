'use client';

import { useGreenTier } from '@/hooks/useGreenTier';
import { Shield, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GreenTierStatus() {
  const { tierInfo, progress, nextTier, allTiers } = useGreenTier();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    setAnimatedProgress(progress.progressPercent);
  }, [progress.progressPercent]);

  const tierIcons: Record<string, string> = {
    seedling: '🌱',
    sapling: '🌿',
    tree: '🌳',
    forest: '🌲',
    guardian: '🛡️',
  };

  const tierColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    seedling: {
      bg: 'bg-carbon-lime',
      text: 'text-carbon-forest',
      border: 'border-carbon-leaf',
      gradient: 'from-carbon-lime to-green-200',
    },
    sapling: {
      bg: 'bg-carbon-mint',
      text: 'text-carbon-forest',
      border: 'border-carbon-sage',
      gradient: 'from-carbon-mint to-teal-200',
    },
    tree: {
      bg: 'bg-carbon-sage',
      text: 'text-white',
      border: 'border-carbon-leaf',
      gradient: 'from-carbon-sage to-green-400',
    },
    forest: {
      bg: 'bg-carbon-leaf',
      text: 'text-white',
      border: 'border-carbon-forest',
      gradient: 'from-carbon-leaf to-green-600',
    },
    guardian: {
      bg: 'bg-carbon-forest',
      text: 'text-carbon-lime',
      border: 'border-carbon-leaf',
      gradient: 'from-carbon-forest to-green-800',
    },
  };

  const colors = tierColors[tierInfo.id] || tierColors.seedling;
  const icon = tierIcons[tierInfo.id] || '🌱';
  const currentTierData = allTiers.find(t => t.id === tierInfo.id);

  return (
    <div className="space-y-6">
      {/* Main Tier Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-br ${colors.gradient} ${colors.text} rounded-2xl p-8 shadow-xl border-2 ${colors.border}`}
      >
        {/* Tier Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="text-7xl"
            >
              {icon}
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold mb-1">{tierInfo.name}</h2>
              <p className="text-lg opacity-90">{tierInfo.description}</p>
            </div>
          </div>
          <div className="text-right bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-2xl font-bold">{tierInfo.multiplier}x</span>
            </div>
            <p className="text-sm opacity-75">Points Multiplier</p>
          </div>
        </div>

        {/* Progress Bar */}
        {nextTier ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-lg">
              <motion.span
                key={progress.pointsToNextTier}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-semibold"
              >
                {progress.pointsToNextTier?.toLocaleString() || 0} points to {nextTier.name}
              </motion.span>
              <span className="font-bold text-2xl">{progress.currentPoints.toLocaleString()} pts</span>
            </div>
            <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-6 overflow-hidden">
              <motion.div
                className={`bg-white h-full rounded-full shadow-lg`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, animatedProgress)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-sm opacity-75">
              <span>{progress.currentPoints.toLocaleString()}</span>
              <span>{nextTier.minPoints.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
            <Shield className="w-8 h-8" />
            <div>
              <p className="font-bold text-xl">Guardian Status</p>
              <p className="text-sm opacity-90">You've reached the highest tier!</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Perks Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Tier Perks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-navy/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-carbon-leaf" />
            <h3 className="text-xl font-bold text-changi-navy">Your Perks</h3>
          </div>
          <ul className="space-y-3">
            {currentTierData?.perks.map((perk, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-changi-gray"
              >
                <span className="text-carbon-leaf mt-1">✓</span>
                <span>{perk}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Next Tier Preview */}
        {nextTier && (
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-changi-gray/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl opacity-50">{tierIcons[allTiers.find(t => t.name === nextTier.name)?.id || ''] || '🌿'}</span>
              <h3 className="text-xl font-bold text-changi-gray">Next: {nextTier.name}</h3>
            </div>
            <p className="text-sm text-changi-gray mb-4 opacity-75">
              Unlock at {nextTier.minPoints.toLocaleString()} points
            </p>
            <ul className="space-y-2">
              {allTiers.find(t => t.name === nextTier.name)?.perks.slice(0, 3).map((perk, index) => (
                <li key={index} className="flex items-start gap-2 text-changi-gray opacity-50">
                  <span className="mt-1">•</span>
                  <span className="text-sm">{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
