'use client';

import { Building2, TrendingUp, AlertCircle } from 'lucide-react';

interface TerminalData {
  terminal: string;
  actions: number;
  wasteDiverted: number; // kg
  participants: number;
}

interface TerminalHeatmapProps {
  data: TerminalData[];
}

export default function TerminalHeatmap({ data }: TerminalHeatmapProps) {
  // Calculate max values for normalization
  const maxActions = Math.max(...data.map((d) => d.actions), 1);
  const maxWaste = Math.max(...data.map((d) => d.wasteDiverted), 1);
  const maxParticipants = Math.max(...data.map((d) => d.participants), 1);

  // Calculate intensity (0-100) for heatmap coloring
  const getIntensity = (value: number, max: number): number => {
    return Math.min((value / max) * 100, 100);
  };

  // Get color based on intensity
  const getColor = (intensity: number): string => {
    if (intensity < 20) return 'bg-red-50 border-red-200';
    if (intensity < 40) return 'bg-orange-50 border-orange-200';
    if (intensity < 60) return 'bg-yellow-50 border-yellow-200';
    if (intensity < 80) return 'bg-carbon-lime/30 border-carbon-lime';
    return 'bg-carbon-leaf/20 border-carbon-leaf';
  };

  // Get text color based on intensity
  const getTextColor = (intensity: number): string => {
    if (intensity < 20) return 'text-red-700';
    if (intensity < 40) return 'text-orange-700';
    if (intensity < 60) return 'text-yellow-700';
    if (intensity < 80) return 'text-carbon-forest';
    return 'text-carbon-forest';
  };

  // Sort by actions (descending) to show highest first
  const sortedData = [...data].sort((a, b) => b.actions - a.actions);

  // Identify opportunity areas (lowest performing terminals)
  const opportunityAreas = sortedData
    .filter((d) => getIntensity(d.actions, maxActions) < 40)
    .map((d) => d.terminal);

  return (
    <div 
      className="bg-gradient-to-br from-carbon-sage/5 via-white to-carbon-mint/5 rounded-xl p-6 shadow-sm border-2 border-carbon-sage/30"
      role="region"
      aria-label="Terminal performance heatmap"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-changi-navy mb-1">Terminal Performance</h3>
          <p className="text-sm text-changi-gray">
            Circularity actions by terminal location
          </p>
        </div>
        {opportunityAreas.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-700" />
            <span className="text-xs font-medium text-yellow-700">
              {opportunityAreas.length} opportunity area{opportunityAreas.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {sortedData.map((terminal) => {
          const actionsIntensity = getIntensity(terminal.actions, maxActions);
          const wasteIntensity = getIntensity(terminal.wasteDiverted, maxWaste);
          const participantsIntensity = getIntensity(terminal.participants, maxParticipants);
          
          // Use average intensity for overall color
          const avgIntensity = (actionsIntensity + wasteIntensity + participantsIntensity) / 3;
          const isOpportunity = avgIntensity < 40;

          return (
            <div
              key={terminal.terminal}
              className={`
                rounded-lg p-4 border-2 transition-all
                ${getColor(avgIntensity)}
                ${isOpportunity ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className={`w-5 h-5 ${getTextColor(avgIntensity)}`} />
                  <h4 className={`font-bold ${getTextColor(avgIntensity)}`}>
                    {terminal.terminal}
                  </h4>
                </div>
                {isOpportunity && (
                  <AlertCircle className="w-4 h-4 text-yellow-700" />
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-changi-gray">Actions</span>
                    <span className={`text-sm font-semibold ${getTextColor(avgIntensity)}`}>
                      {terminal.actions.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-carbon-leaf transition-all"
                      style={{ width: `${actionsIntensity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-changi-gray">Waste Diverted</span>
                    <span className={`text-sm font-semibold ${getTextColor(avgIntensity)}`}>
                      {terminal.wasteDiverted.toFixed(1)} kg
                    </span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-carbon-forest transition-all"
                      style={{ width: `${wasteIntensity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-changi-gray">Participants</span>
                    <span className={`text-sm font-semibold ${getTextColor(avgIntensity)}`}>
                      {terminal.participants.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-carbon-mint transition-all"
                      style={{ width: `${participantsIntensity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Opportunity Areas Section */}
      {opportunityAreas.length > 0 && (
        <div className="mt-6 pt-6 border-t border-changi-gray/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-700" />
            <h4 className="font-semibold text-changi-navy">Opportunity Areas</h4>
          </div>
          <p className="text-sm text-changi-gray mb-3">
            These terminals have lower circularity engagement and represent opportunities for targeted campaigns:
          </p>
          <div className="flex flex-wrap gap-2">
            {opportunityAreas.map((terminal) => (
              <span
                key={terminal}
                className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg text-sm font-medium text-yellow-700"
              >
                {terminal}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

