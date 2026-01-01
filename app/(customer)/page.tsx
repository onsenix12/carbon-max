'use client';

import { useGreenTier } from '@/context/GreenTierContext';
import { useJourney } from '@/context/JourneyContext';
import { Calculator, ShoppingBag, Map, MessageCircle, TrendingUp, Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GreenTierStatus from '@/components/customer/GreenTierStatus';

export default function HomePage() {
  const { currentTier, totalPoints } = useGreenTier();
  const { totalEmissionsReduced, totalPointsEarned } = useJourney();
  const router = useRouter();

  const quickActions = [
    {
      icon: Calculator,
      title: 'Calculate Flight',
      description: 'Calculate your carbon footprint',
      color: 'bg-changi-purple',
      textColor: 'text-white',
      path: '/calculator',
    },
    {
      icon: ShoppingBag,
      title: 'Green Shops',
      description: 'Shop at sustainable merchants',
      color: 'bg-carbon-leaf',
      textColor: 'text-white',
      path: '/shop',
    },
    {
      icon: Map,
      title: 'My Journey',
      description: 'View your impact history',
      color: 'bg-carbon-sage',
      textColor: 'text-white',
      path: '/journey',
    },
    {
      icon: MessageCircle,
      title: 'Ask Max',
      description: 'Chat with our AI assistant',
      color: 'bg-changi-navy',
      textColor: 'text-white',
      path: '/chat',
    },
  ];

  // Get current month points (simplified - in production, filter by month)
  const thisMonthPoints = Math.floor(totalPointsEarned * 0.3); // Simulated

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-changi-navy">
          Welcome back! 👋
        </h1>
        <p className="text-changi-gray">
          Keep up the great work, {currentTier.name}! Your sustainable choices are making a difference.
        </p>
      </div>

      {/* Green Tier Status Card */}
      <GreenTierStatus />

      {/* Eco-Points This Month */}
      <div className="bg-gradient-to-br from-carbon-leaf to-carbon-forest text-white rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-90 mb-1">Eco-Points This Month</p>
            <p className="text-3xl font-bold">{thisMonthPoints.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm opacity-90">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            <span>{totalEmissionsReduced.toFixed(1)} kg CO₂e reduced</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-changi-navy mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => router.push(action.path)}
                className={`${action.color} ${action.textColor} rounded-xl p-4 shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <h3 className="font-bold text-sm mb-1">{action.title}</h3>
                <p className="text-xs opacity-90">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-changi-gray/20">
        <h3 className="font-bold text-changi-navy mb-3">Your Impact</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-changi-gray">Total Eco-Points</span>
            <span className="font-bold text-changi-navy">{totalPoints.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-changi-gray">Emissions Reduced</span>
            <span className="font-bold text-carbon-leaf">
              {totalEmissionsReduced.toFixed(1)} kg CO₂e
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-changi-gray">Current Tier</span>
            <span className="font-bold text-changi-navy flex items-center gap-1">
              {currentTier.social_signaling.badge_icon} {currentTier.name}
            </span>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-carbon-lime/20 border-l-4 border-carbon-leaf rounded-lg p-4">
        <p className="text-sm text-carbon-forest">
          <strong>💚 You're doing great!</strong> Every action counts. Keep making sustainable choices 
          to unlock new tiers and maximize your impact.
        </p>
      </div>
    </div>
  );
}

