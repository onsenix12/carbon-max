'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles } from 'lucide-react';
import { evaluateNudges, markNudgeSent, markNudgeDismissed, type Nudge, type NudgeContext } from '@/lib/claude/nudges';
import { useJourney } from '@/hooks/useJourney';
import { useGreenTier } from '@/hooks/useGreenTier';

interface NudgeToastProps {
  userId?: string;
  onAction?: (actionType: string, actionData?: any) => void;
}

export default function NudgeToast({ userId = 'default', onAction }: NudgeToastProps) {
  const [currentNudge, setCurrentNudge] = useState<Nudge | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { journey, totalEmissions, netEmissions, totalEcoPoints, totalWasteDiverted } = useJourney();
  const { tierInfo, progress, totalEcoPoints: tierPoints, lifetimeEcoPoints, tierMultiplier } = useGreenTier();

  // Check for nudges when context changes
  useEffect(() => {
    const checkNudges = () => {
      const context: NudgeContext = {
        journey: {
          flight: journey.flight ? {
            emissions: journey.flight.emissions,
            emissionsWithRF: journey.flight.emissionsWithRF,
            includeRF: journey.flight.includeRF,
            safContribution: journey.flight.safContribution,
            offsetPurchase: journey.flight.offsetPurchase,
            routeId: journey.flight.routeId,
          } : undefined,
          transport: journey.transport,
          shopping: journey.shopping,
          dining: journey.dining,
          totalEmissions,
          netEmissions,
          totalEcoPointsEarned: totalEcoPoints,
          totalWasteDiverted,
          hasSAF: !!journey.flight?.safContribution,
          hasCircularity: journey.circularity.length > 0,
        },
        greenTier: {
          currentTier: {
            id: tierInfo.id,
            name: tierInfo.name,
            level: tierInfo.level || 1,
          },
          totalEcoPoints: tierPoints,
          pointsToNextTier: progress.pointsToNextTier,
          progressPercent: progress.progressPercent,
          tierProgress: {
            progressToNext: progress.tierProgress?.progressToNext ? {
              nextTier: {
                name: progress.tierProgress.progressToNext.nextTier.name,
                minPoints: progress.tierProgress.progressToNext.nextTier.minPoints,
              },
            } : undefined,
          },
        },
        time: new Date(),
      };

      const nudge = evaluateNudges(context, userId);
      if (nudge && nudge.message) {
        setCurrentNudge(nudge);
        setIsVisible(true);
        markNudgeSent(userId, nudge.id);
      }
    };

    // Check for nudges after a short delay to avoid showing immediately
    const timer = setTimeout(checkNudges, 1000);
    return () => clearTimeout(timer);
  }, [journey, totalEmissions, netEmissions, totalEcoPoints, totalWasteDiverted, tierInfo, tierPoints, progress, userId]);

  const handleDismiss = useCallback(() => {
    if (currentNudge) {
      markNudgeDismissed(userId, currentNudge.id);
      setIsVisible(false);
      setTimeout(() => setCurrentNudge(null), 300);
    }
  }, [currentNudge, userId]);

  const handleAction = useCallback(() => {
    if (!currentNudge) return;

    // Mark as sent (user interacted)
    markNudgeSent(userId, currentNudge.id);
    
    // Call the action handler
    if (onAction) {
      onAction(currentNudge.actionType || 'info', currentNudge.actionData);
    }

    // Dismiss the toast
    setIsVisible(false);
    setTimeout(() => setCurrentNudge(null), 300);
  }, [currentNudge, userId, onAction]);

  if (!currentNudge || !isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-md transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex gap-3">
        {/* Max Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm text-gray-900 whitespace-pre-line">
                {currentNudge.message}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Button */}
          {currentNudge.actionButton && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAction}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                {currentNudge.actionButton.text}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

