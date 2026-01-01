'use client';

import { useState } from 'react';
import { useJourney } from '@/hooks/useJourney';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import circularityActionsData from '@/data/circularityActions.json';
import CupAsService from './CupAsService';
import { CheckCircle2, Leaf, Recycle, Trash2 } from 'lucide-react';

interface CircularityAction {
  id: string;
  name: string;
  description: string;
  category: string;
  eco_points: number;
  waste_diverted_grams: number;
  waste_type?: string;
  carbon_reduction_kg?: number;
  impact_description: string;
}

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 bg-carbon-leaf text-white px-6 py-4 rounded-lg shadow-lg z-50 slide-in-from-right flex items-center gap-3 min-w-[300px]">
      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      <span className="font-semibold flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 text-white/80 hover:text-white text-xl leading-none flex-shrink-0"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

// Celebration animation component
function CelebrationAnimation({ points }: { points: number }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-carbon-leaf/90 backdrop-blur-sm rounded-full p-8 zoom-in">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <div className="text-3xl font-bold">+{points} Eco-Points!</div>
          <div className="text-lg mt-2">Nice work!</div>
        </div>
      </div>
    </div>
  );
}

export default function CircularityActions() {
  const { addCircularityAction } = useJourney();
  const { earnPoints } = useEcoPoints();
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [celebration, setCelebration] = useState<number | null>(null);

  const actions = circularityActionsData.actions as CircularityAction[];

  // Separate Cup-as-a-Service
  const cupServiceAction = actions.find(a => a.id === 'cup_as_a_service');
  const otherActions = actions.filter(a => a.id !== 'cup_as_a_service');

  const handleLogAction = async (action: CircularityAction) => {
    try {
      // Award Eco-Points
      const pointsEarned = await earnPoints('circularity_action', undefined, action.id);
      
      if (pointsEarned !== null) {
        // Add to journey context
        addCircularityAction({
          actionId: action.id,
          actionName: action.name,
          wasteDiverted: action.waste_diverted_grams,
          ecoPointsEarned: pointsEarned,
        });

        // Show celebration
        setCelebration(pointsEarned);
        setTimeout(() => setCelebration(null), 2000);

        // Show toast
        setToast({ message: `Nice! +${pointsEarned} Eco-Points` });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error('Error logging action:', error);
      setToast({ message: 'Failed to log action. Please try again.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'waste_reduction':
        return <Trash2 className="w-5 h-5" />;
      case 'sustainable_dining':
        return <Leaf className="w-5 h-4" />;
      default:
        return <Recycle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}

      {/* Celebration */}
      {celebration !== null && <CelebrationAnimation points={celebration} />}

      {/* Cup-as-a-Service Special Card */}
      {cupServiceAction && (
        <div className="mb-8">
          <CupAsService action={cupServiceAction} onLogAction={() => handleLogAction(cupServiceAction)} />
        </div>
      )}

      {/* Other Actions */}
      <div>
        <h2 className="text-xl font-bold text-changi-navy mb-4">All Circularity Actions</h2>
        <p className="text-sm text-changi-gray mb-6">
          Take these actions to reduce waste and earn Eco-Points. Every small action contributes to a more circular economy at Changi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherActions.map(action => (
            <div
              key={action.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-changi-navy/10 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-carbon-lime/20 p-2 rounded-lg text-carbon-leaf">
                  {getCategoryIcon(action.category)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-changi-navy mb-1">{action.name}</h3>
                  <p className="text-sm text-changi-gray">{action.description}</p>
                </div>
              </div>

              {/* Impact Info */}
              <div className="bg-carbon-lime/10 rounded-lg p-3 mb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-changi-gray">Eco-Points:</span>
                  <span className="font-semibold text-carbon-leaf">{action.eco_points} points</span>
                </div>
                {action.waste_diverted_grams > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-changi-gray">Waste Diverted:</span>
                    <span className="font-semibold text-carbon-forest">
                      {action.waste_diverted_grams}g
                    </span>
                  </div>
                )}
                {action.carbon_reduction_kg && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-changi-gray">Carbon Reduced:</span>
                    <span className="font-semibold text-carbon-forest">
                      {action.carbon_reduction_kg} kg CO₂e
                    </span>
                  </div>
                )}
              </div>

              {/* Impact Description */}
              <p className="text-xs text-changi-gray mb-4 italic">
                {action.impact_description}
              </p>

              {/* Log Action Button */}
              <button
                onClick={() => handleLogAction(action)}
                className="w-full bg-carbon-leaf text-white px-4 py-3 rounded-lg font-semibold hover:bg-carbon-forest transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Log Action
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Framework Messaging */}
      <div className="bg-gradient-to-r from-carbon-lime/20 to-carbon-mint/20 rounded-xl p-6 border border-carbon-leaf/30">
        <h3 className="font-bold text-changi-navy mb-2">Beyond Carbon: Circularity Matters</h3>
        <p className="text-sm text-changi-gray">
          While carbon emissions are important, true sustainability goes beyond just CO₂. Circularity actions 
          help reduce waste, conserve resources, and create a more sustainable airport experience. Every action 
          you take—from refusing a bag to using a reusable cup—contributes to Changi's circular economy goals 
          and helps divert waste from Singapore's only landfill.
        </p>
      </div>
    </div>
  );
}

