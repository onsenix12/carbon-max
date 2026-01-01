'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Sparkles } from 'lucide-react';
import type { ActivityType, Activity } from '@/lib/activity/logger';

interface DemoModeProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const DEMO_ACTIVITIES: Array<{
  type: ActivityType;
  weight: number; // Probability weight
  generator: () => Partial<Activity>;
}> = [
  {
    type: 'saf_contributed',
    weight: 0.3,
    generator: () => ({
      details: {
        safProvider: Math.random() > 0.5 ? 'Neste Singapore' : 'Shell SAF',
        safType: Math.random() > 0.7 ? 'imported' : 'waste_based',
        amount: (10 + Math.random() * 50) * 2.5,
        liters: 10 + Math.random() * 50,
        verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending',
        certificateId: `SAF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      emissionsAvoided: (10 + Math.random() * 50) * 2.27,
      ecoPoints: Math.floor((10 + Math.random() * 50) * 2.5 * 10),
      safLiters: 10 + Math.random() * 50,
    }),
  },
  {
    type: 'circularity_action',
    weight: 0.4,
    generator: () => {
      const actions = [
        { name: 'Cup-as-a-Service', waste: 15, points: 10 },
        { name: 'Refuse Bag, Bring Own Bag', waste: 8, points: 5 },
        { name: 'Plant-Based Meal', waste: 0, points: 15 },
        { name: 'Use Water Refill Station', waste: 20, points: 8 },
      ];
      const action = actions[Math.floor(Math.random() * actions.length)];
      return {
        details: {
          actionId: action.name.toLowerCase().replace(/\s+/g, '_'),
          actionName: action.name,
        },
        wasteDiverted: action.waste,
        ecoPoints: action.points,
      };
    },
  },
  {
    type: 'flight_calculated',
    weight: 0.2,
    generator: () => {
      const routes = ['SIN-LHR', 'SIN-JFK', 'SIN-SYD', 'SIN-NRT', 'SIN-HKG'];
      const route = routes[Math.floor(Math.random() * routes.length)];
      return {
        details: {
          routeId: route,
          origin: route.split('-')[0],
          destination: route.split('-')[1],
          emissions: 200 + Math.random() * 300,
          emissionsWithRF: (200 + Math.random() * 300) * 1.9,
          cabinClass: ['economy', 'business', 'first'][Math.floor(Math.random() * 3)] as any,
        },
        emissions: (200 + Math.random() * 300) * 1.9,
      };
    },
  },
  {
    type: 'offset_purchased',
    weight: 0.1,
    generator: () => {
      const tonnes = 0.1 + Math.random() * 0.5;
      return {
        details: {
          offsetProvider: 'Gold Standard',
          offsetType: 'removal',
          amount: tonnes * 15,
          tonnesOffset: tonnes,
        },
        emissionsAvoided: tonnes * 1000,
        ecoPoints: Math.floor(tonnes * 15 * 5),
      };
    },
  },
];

export default function DemoMode({ enabled, onToggle }: DemoModeProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [activityCount, setActivityCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const generateActivity = async () => {
      // Select activity type based on weights
      const totalWeight = DEMO_ACTIVITIES.reduce((sum, a) => sum + a.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const activityDef of DEMO_ACTIVITIES) {
        random -= activityDef.weight;
        if (random <= 0) {
          const activityData = activityDef.generator();
          const userId = `demo_user_${Math.floor(Math.random() * 100)}`;
          
          try {
            // Use API route instead of direct import (server-side only)
            const response = await fetch('/api/activity', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: activityDef.type,
                userId,
                details: activityData.details || {},
                emissions: activityData.emissions,
                emissionsAvoided: activityData.emissionsAvoided,
                wasteDiverted: activityData.wasteDiverted,
                ecoPoints: activityData.ecoPoints,
                safLiters: activityData.safLiters,
              }),
            });

            if (!response.ok) {
              throw new Error(`Failed to log activity: ${response.statusText}`);
            }

            setActivityCount((prev) => prev + 1);
          } catch (error) {
            console.error('Error logging activity:', error);
            // Silently fail in demo mode - don't break the UI
          }
          break;
        }
      }
    };

    // Generate initial activity
    generateActivity();

    // Set up interval (every 30 seconds)
    intervalRef.current = setInterval(generateActivity, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-carbon-lime/20 rounded-lg border border-carbon-leaf/30">
      <button
        onClick={() => onToggle(!enabled)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${enabled ? 'bg-carbon-leaf text-white' : 'bg-white text-carbon-leaf border border-carbon-leaf'}
        `}
        aria-label={enabled ? 'Disable demo mode' : 'Enable demo mode'}
        aria-pressed={enabled}
      >
        {enabled ? (
          <>
            <Pause className="w-4 h-4" />
            <span>Demo Mode ON</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Demo Mode OFF</span>
          </>
        )}
      </button>
      
      {enabled && (
        <div className="flex items-center gap-2 text-sm text-carbon-forest">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>{activityCount} activities generated</span>
        </div>
      )}
    </div>
  );
}

