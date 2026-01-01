'use client';

import { useState, useEffect } from 'react';
import GreenTierStatus from '@/components/customer/GreenTierStatus';
import EcoPointsHistory from '@/components/customer/EcoPointsHistory';
import BadgeGrid from '@/components/customer/BadgeGrid';
import Leaderboard from '@/components/customer/Leaderboard';
import TierUpgradeCelebration from '@/components/customer/TierUpgradeCelebration';
import { useGreenTierContext } from '@/context/GreenTierContext';

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'tier' | 'badges' | 'leaderboard'>('tier');
  const context = useGreenTierContext();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [lastTierUpgrade, setLastTierUpgrade] = useState<{ fromTier: string; toTier: string } | null>(null);

  // Check for tier upgrade
  useEffect(() => {
    if (context.showCelebration) {
      // Get last tier upgrade from state if available
      try {
        const state = JSON.parse(localStorage.getItem('green_tier_state') || '{}');
        if (state.lastTierUpgrade) {
          setLastTierUpgrade({
            fromTier: state.lastTierUpgrade.fromTier,
            toTier: state.lastTierUpgrade.toTier || state.lastTierUpgrade.toTier,
          });
          setShowUpgradeModal(true);
        }
      } catch (err) {
        console.warn('Error reading tier upgrade state:', err);
      }
    }
  }, [context.showCelebration]);

  return (
    <div className="min-h-screen bg-changi-cream">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-changi-navy mb-2">Rewards & Recognition</h1>
          <p className="text-changi-gray">
            Track your progress, earn badges, and see how you rank among Changi's sustainability champions.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-changi-navy/10">
          <button
            onClick={() => setActiveTab('tier')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'tier'
                ? 'text-changi-purple border-b-2 border-changi-purple'
                : 'text-changi-gray hover:text-changi-navy'
            }`}
          >
            My Tier
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'badges'
                ? 'text-changi-purple border-b-2 border-changi-purple'
                : 'text-changi-gray hover:text-changi-navy'
            }`}
          >
            Badges
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'leaderboard'
                ? 'text-changi-purple border-b-2 border-changi-purple'
                : 'text-changi-gray hover:text-changi-navy'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'tier' && (
            <div className="space-y-6">
              <GreenTierStatus />
              <EcoPointsHistory />
            </div>
          )}
          {activeTab === 'badges' && <BadgeGrid />}
          {activeTab === 'leaderboard' && <Leaderboard />}
        </div>
      </div>

      {/* Tier Upgrade Celebration Modal */}
      {showUpgradeModal && lastTierUpgrade && (
        <TierUpgradeCelebration
          fromTier={lastTierUpgrade.fromTier}
          toTier={lastTierUpgrade.toTier}
          onClose={() => {
            setShowUpgradeModal(false);
            context.dismissCelebration();
          }}
        />
      )}
    </div>
  );
}
