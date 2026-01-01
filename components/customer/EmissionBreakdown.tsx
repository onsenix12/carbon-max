'use client';

import { Plane, ShoppingBag, UtensilsCrossed, Car, Minus } from 'lucide-react';
import { useJourney } from '@/hooks/useJourney';

export default function EmissionBreakdown() {
  const { journey, flightEmissions, transportEmissions, totalEmissions, netEmissions } = useJourney();

  const breakdown = [
    {
      icon: Plane,
      name: 'Flight',
      amount: flightEmissions,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      safDeduction: journey.flight?.safContribution?.emissionsReduced || 0,
      offsetDeduction: journey.flight?.offsetPurchase 
        ? journey.flight.offsetPurchase.tonnesOffset * 1000 
        : 0,
    },
    {
      icon: ShoppingBag,
      name: 'Shopping',
      amount: journey.shopping.reduce((sum, s) => sum + (s.amount * 0.1), 0), // Rough estimate: 0.1 kg per dollar
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: UtensilsCrossed,
      name: 'Dining',
      amount: journey.dining.reduce((sum, d) => sum + (d.isPlantBased ? 0 : d.amount * 0.2), 0), // Rough estimate
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Car,
      name: 'Transport',
      amount: transportEmissions,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ].filter(item => item.amount > 0);

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="font-bold text-changi-navy text-lg mb-4">Emission Breakdown</h2>
      <div className="space-y-4">
        {breakdown.map((item, index) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0;
          const Icon = item.icon;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${item.bgColor} ${item.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-changi-navy">{item.name}</p>
                    <p className="text-xs text-changi-gray">{percentage.toFixed(1)}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-changi-navy">
                    {item.amount.toFixed(1)} kg CO₂e
                  </p>
                </div>
              </div>
              
              {/* SAF Deduction for Flight */}
              {item.name === 'Flight' && item.safDeduction > 0 && (
                <div className="ml-12 flex items-center gap-2 text-carbon-leaf">
                  <Minus className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    SAF: -{item.safDeduction.toFixed(1)} kg
                  </span>
                </div>
              )}
              
              {/* Offset Deduction for Flight */}
              {item.name === 'Flight' && item.offsetDeduction > 0 && (
                <div className="ml-12 flex items-center gap-2 text-carbon-leaf">
                  <Minus className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Offset: -{item.offsetDeduction.toFixed(1)} kg
                  </span>
                </div>
              )}
            </div>
          );
        })}
        
        {breakdown.length === 0 && (
          <p className="text-changi-gray text-center py-4">No emissions recorded yet</p>
        )}
      </div>
    </div>
  );
}

