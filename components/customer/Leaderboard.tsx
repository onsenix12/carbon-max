'use client';

import { useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGreenTier } from '@/hooks/useGreenTier';

interface LeaderboardEntry {
  rank: number;
  name: string;
  tier: string;
  tierIcon: string;
  points: number;
  isCurrentUser: boolean;
}

// Mock leaderboard data
const generateMockLeaderboard = (currentUserTier: string, currentUserPoints: number, currentUserTierIcon: string): LeaderboardEntry[] => {
  const mockUsers: LeaderboardEntry[] = [
    { rank: 1, name: 'Sarah Chen', tier: 'guardian', tierIcon: '🛡️', points: 15234, isCurrentUser: false },
    { rank: 2, name: 'Michael Tan', tier: 'guardian', tierIcon: '🛡️', points: 12890, isCurrentUser: false },
    { rank: 3, name: 'Emma Wong', tier: 'forest', tierIcon: '🌲', points: 9876, isCurrentUser: false },
    { rank: 4, name: 'David Lim', tier: 'forest', tierIcon: '🌲', points: 8765, isCurrentUser: false },
    { rank: 5, name: 'Lisa Koh', tier: 'tree', tierIcon: '🌳', points: 6543, isCurrentUser: false },
    { rank: 6, name: 'James Ng', tier: 'tree', tierIcon: '🌳', points: 5432, isCurrentUser: false },
    { rank: 7, name: 'You', tier: currentUserTier, tierIcon: currentUserTierIcon, points: currentUserPoints, isCurrentUser: true },
    { rank: 8, name: 'Rachel Teo', tier: 'sapling', tierIcon: '🌿', points: 3210, isCurrentUser: false },
    { rank: 9, name: 'Kevin Chua', tier: 'sapling', tierIcon: '🌿', points: 2987, isCurrentUser: false },
    { rank: 10, name: 'Amanda Lee', tier: 'seedling', tierIcon: '🌱', points: 1876, isCurrentUser: false },
  ];

  // Sort by points and reassign ranks
  return mockUsers.sort((a, b) => b.points - a.points).map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
};

export default function Leaderboard() {
  const { tierInfo, totalEcoPoints } = useGreenTier();
  const [timeframe, setTimeframe] = useState<'week' | 'alltime'>('alltime');

  const leaderboard = generateMockLeaderboard(
    tierInfo.id,
    totalEcoPoints,
    tierInfo.icon
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <Award className="w-6 h-6 text-changi-gray" />;
  };

  const getTierColor = (tierId: string) => {
    const colors: Record<string, string> = {
      seedling: 'bg-carbon-lime text-carbon-forest',
      sapling: 'bg-carbon-mint text-carbon-forest',
      tree: 'bg-carbon-sage text-white',
      forest: 'bg-carbon-leaf text-white',
      guardian: 'bg-carbon-forest text-carbon-lime',
    };
    return colors[tierId] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-navy/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-changi-navy mb-2">Leaderboard</h3>
            <p className="text-sm text-changi-gray">
              Rankings based on Eco-Points earned
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === 'week'
                  ? 'bg-changi-purple text-white'
                  : 'bg-changi-cream text-changi-gray hover:bg-carbon-lime/20'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('alltime')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === 'alltime'
                  ? 'bg-changi-purple text-white'
                  : 'bg-changi-cream text-changi-gray hover:bg-carbon-lime/20'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="bg-carbon-lime/10 border border-carbon-leaf/20 rounded-lg p-3 text-sm text-changi-gray">
          <p>
            <strong>Note:</strong> Rankings are based on total Eco-Points earned. 
            {timeframe === 'week' ? ' This week\'s rankings reset every Monday.' : ' All-time rankings show your lifetime achievements.'}
          </p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-xl shadow-sm border border-changi-navy/10 overflow-hidden">
        <div className="divide-y divide-changi-navy/10">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 flex items-center gap-4 ${
                entry.isCurrentUser
                  ? `${getTierColor(entry.tier)} font-semibold`
                  : 'hover:bg-changi-cream'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                {entry.rank <= 3 ? (
                  getRankIcon(entry.rank)
                ) : (
                  <span className={`text-lg font-bold ${entry.isCurrentUser ? '' : 'text-changi-gray'}`}>
                    #{entry.rank}
                  </span>
                )}
              </div>

              {/* Tier Icon */}
              <div className="text-3xl">{entry.tierIcon}</div>

              {/* Name */}
              <div className="flex-1">
                <div className="font-semibold">{entry.name}</div>
                {entry.isCurrentUser && (
                  <div className="text-xs opacity-75 mt-1">That's you!</div>
                )}
              </div>

              {/* Points */}
              <div className="text-right">
                <div className={`text-lg font-bold ${entry.isCurrentUser ? '' : 'text-changi-navy'}`}>
                  {entry.points.toLocaleString()}
                </div>
                <div className={`text-xs ${entry.isCurrentUser ? 'opacity-75' : 'text-changi-gray'}`}>
                  points
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Your Position Summary */}
      <div className="bg-gradient-to-r from-carbon-lime/20 to-carbon-mint/20 rounded-xl p-6 border border-carbon-leaf/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-changi-navy mb-1">Your Position</h4>
            <p className="text-sm text-changi-gray">
              You're ranked #{leaderboard.find(e => e.isCurrentUser)?.rank || 'N/A'} out of all users
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-carbon-leaf">
              {totalEcoPoints.toLocaleString()}
            </div>
            <div className="text-sm text-changi-gray">Your Points</div>
          </div>
        </div>
      </div>
    </div>
  );
}

