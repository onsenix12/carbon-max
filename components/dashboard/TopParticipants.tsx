'use client';

import { Trophy, Award, Users, TrendingUp } from 'lucide-react';

interface Participant {
  rank: number;
  userId: string; // anonymized
  actions: number;
  wasteDiverted: number; // kg
  tier: string;
  points: number;
}

interface TopParticipantsProps {
  participants: Participant[];
}

export default function TopParticipants({ participants }: TopParticipantsProps) {
  // Get tier colors
  const getTierColor = (tier: string): string => {
    const tierMap: Record<string, string> = {
      Green: 'bg-carbon-lime/20 text-carbon-forest border-carbon-leaf',
      Silver: 'bg-gray-100 text-gray-700 border-gray-300',
      Gold: 'bg-yellow-50 text-yellow-700 border-yellow-300',
      Platinum: 'bg-purple-50 text-purple-700 border-purple-300',
    };
    return tierMap[tier] || tierMap.Green;
  };

  // Calculate tier distribution
  const tierDistribution = participants.reduce((acc, p) => {
    acc[p.tier] = (acc[p.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-400" />;
    return <span className="w-5 h-5 flex items-center justify-center text-changi-gray font-bold text-sm">{rank}</span>;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-changi-navy mb-1">Top Participants</h3>
          <p className="text-sm text-changi-gray">
            Most active circularity participants (anonymized)
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-changi-gray">
          <Users className="w-4 h-4" />
          <span>{participants.length} participants</span>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3 mb-6">
        {participants.slice(0, 10).map((participant) => (
          <div
            key={participant.userId}
            className={`
              flex items-center gap-4 p-4 rounded-lg border transition-colors
              ${participant.rank <= 3 ? 'bg-changi-cream border-carbon-leaf/30' : 'bg-white border-changi-gray/20 hover:bg-changi-cream'}
            `}
          >
            {/* Rank */}
            <div className="flex-shrink-0">
              {getRankIcon(participant.rank)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-changi-navy truncate">
                  {participant.userId}
                </p>
                <span
                  className={`
                    px-2 py-0.5 rounded text-xs font-medium border
                    ${getTierColor(participant.tier)}
                  `}
                >
                  {participant.tier}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-changi-gray">
                <span>{participant.actions} actions</span>
                <span>•</span>
                <span>{participant.wasteDiverted.toFixed(1)} kg diverted</span>
                <span>•</span>
                <span>{participant.points.toLocaleString()} points</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="hidden md:block w-32">
              <div className="w-full bg-changi-cream rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-carbon-leaf transition-all"
                  style={{
                    width: `${Math.min((participant.actions / participants[0].actions) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tier Distribution */}
      <div className="pt-6 border-t border-changi-gray/20">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-changi-gray" />
          <h4 className="text-sm font-semibold text-changi-navy">Tier Distribution</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(tierDistribution).map(([tier, count]) => (
            <div
              key={tier}
              className={`
                p-3 rounded-lg border text-center
                ${getTierColor(tier)}
              `}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-1">{tier} Tier</p>
              <p className="text-xs opacity-75 mt-1">
                {((count / participants.length) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

