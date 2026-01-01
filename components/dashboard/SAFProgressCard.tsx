'use client';

import { CheckCircle2, AlertCircle, Target } from 'lucide-react';

interface SAFProgressCardProps {
  currentUptake: number; // Current SAF uptake percentage (e.g., 0.35 for 0.35%)
  litersToday: number; // Liters contributed today
  targetMandate: number; // Target mandate percentage (e.g., 1 for 1%)
  targetYear: number; // Target year (e.g., 2026)
}

export default function SAFProgressCard({
  currentUptake,
  litersToday,
  targetMandate,
  targetYear,
}: SAFProgressCardProps) {
  const progressPercentage = (currentUptake / targetMandate) * 100;
  const isOnTrack = progressPercentage >= 80; // Consider "on track" if at least 80% of way to target

  const getStatusColor = () => {
    if (isOnTrack) return 'text-carbon-leaf';
    return 'text-changi-red';
  };

  const getStatusBg = () => {
    if (isOnTrack) return 'bg-carbon-lime/20';
    return 'bg-red-50';
  };

  const getStatusIcon = () => {
    if (isOnTrack) return <CheckCircle2 className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div 
      className="bg-gradient-to-br from-carbon-lime/10 via-white to-carbon-leaf/5 rounded-xl p-6 shadow-lg border-2 border-carbon-leaf"
      role="region"
      aria-label="SAF Progress toward 2026 mandate"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-6 h-6 text-carbon-leaf" />
            <h3 className="text-2xl font-bold text-carbon-forest">SAF Progress</h3>
            <span className="ml-2 px-2 py-1 bg-carbon-leaf text-white text-xs font-semibold rounded-full">
              HERO METRIC
            </span>
          </div>
          <p className="text-sm text-changi-gray">
            Progress toward {targetYear} mandate ({targetMandate}%)
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusBg()}`}>
          {getStatusIcon()}
          <span className={`text-sm font-semibold ${getStatusColor()}`}>
            {isOnTrack ? 'On Track' : 'Behind'}
          </span>
        </div>
      </div>

      {/* Current Uptake */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-3xl font-bold text-changi-navy">
            {currentUptake.toFixed(2)}%
          </p>
          <p className="text-sm text-changi-gray">current uptake</p>
        </div>
        <p className="text-xs text-changi-gray">
          Target: {targetMandate}% by {targetYear}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-changi-cream rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isOnTrack ? 'bg-carbon-leaf' : 'bg-changi-red'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-changi-gray">
          <span>0%</span>
          <span className="font-semibold">{targetMandate}% target</span>
        </div>
      </div>

      {/* Today's Contribution */}
      <div className="bg-carbon-lime/10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-changi-gray">
            Today's Contribution:
          </span>
          <span className="text-lg font-bold text-carbon-forest">
            {litersToday.toLocaleString()} liters
          </span>
        </div>
      </div>

      {/* Progress Status */}
      <div className="mt-4 pt-4 border-t border-changi-gray/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-changi-gray">Progress to target:</span>
          <span className={`font-semibold ${getStatusColor()}`}>
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        {!isOnTrack && (
          <p className="text-xs text-changi-red mt-2">
            Need to accelerate SAF adoption to meet {targetYear} mandate
          </p>
        )}
      </div>
    </div>
  );
}

