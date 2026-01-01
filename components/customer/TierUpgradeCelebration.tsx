'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useGreenTier } from '@/hooks/useGreenTier';
import greenTiersData from '@/data/greenTiers.json';

interface TierUpgradeCelebrationProps {
  fromTier: string; // Tier name
  toTier: string; // Tier name
  onClose: () => void;
}

const tierIcons: Record<string, string> = {
  seedling: '🌱',
  sapling: '🌿',
  tree: '🌳',
  forest: '🌲',
  guardian: '🛡️',
};

const tierColors: Record<string, { bg: string; text: string; gradient: string }> = {
  seedling: {
    bg: 'bg-carbon-lime',
    text: 'text-carbon-forest',
    gradient: 'from-carbon-lime to-green-200',
  },
  sapling: {
    bg: 'bg-carbon-mint',
    text: 'text-carbon-forest',
    gradient: 'from-carbon-mint to-teal-200',
  },
  tree: {
    bg: 'bg-carbon-sage',
    text: 'text-white',
    gradient: 'from-carbon-sage to-green-400',
  },
  forest: {
    bg: 'bg-carbon-leaf',
    text: 'text-white',
    gradient: 'from-carbon-leaf to-green-600',
  },
  guardian: {
    bg: 'bg-carbon-forest',
    text: 'text-carbon-lime',
    gradient: 'from-carbon-forest to-green-800',
  },
};

export default function TierUpgradeCelebration({ fromTier, toTier, onClose }: TierUpgradeCelebrationProps) {
  const [showPerks, setShowPerks] = useState(false);
  const [shared, setShared] = useState(false);

  // Find tier by name (since context stores names)
  const newTierData = greenTiersData.tiers.find(t => t.name === toTier);
  const tierId = newTierData?.id || 'seedling';
  const colors = tierColors[tierId] || tierColors.seedling;
  const icon = tierIcons[tierId] || '🌱';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I just reached ${newTierData?.name} tier!`,
          text: `I've earned enough Eco-Points to reach the ${newTierData?.name} tier at Changi Airport! 🌱✈️`,
          url: window.location.href,
        });
        setShared(true);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      const text = `I just reached ${newTierData?.name} tier at Changi Airport! 🌱✈️`;
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-gradient-to-br ${colors.gradient} ${colors.text} rounded-2xl p-8 max-w-lg w-full shadow-2xl relative`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Celebration Content */}
          <div className="text-center">
            {/* Confetti Animation */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="text-8xl mb-4"
            >
              {icon}
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-2"
            >
              Tier Upgraded!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl mb-6 opacity-90"
            >
              You've reached <strong>{newTierData?.name}</strong> tier!
            </motion.p>

            {/* Perks Unlocked */}
            {!showPerks ? (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setShowPerks(true)}
                className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors mb-4"
              >
                View Perks Unlocked
              </motion.button>
            ) : (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 text-left"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-lg">New Perks:</h3>
                </div>
                <ul className="space-y-2">
                  {newTierData?.perks.slice(0, 5).map((perk, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="mt-1">✓</span>
                      <span>{perk}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex-1 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                {shared ? 'Copied!' : 'Share'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 bg-white text-carbon-forest px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Continue
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

