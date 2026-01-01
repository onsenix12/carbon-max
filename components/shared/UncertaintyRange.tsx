'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

export interface UncertaintyRangeProps {
  value: number;
  uncertainty?: number;
  unit?: string;
  format?: 'compact' | 'full';
}

export default function UncertaintyRange({ 
  value, 
  uncertainty, 
  unit = ' kg',
  format = 'compact'
}: UncertaintyRangeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!uncertainty) {
    return <span>{value.toLocaleString()}{unit}</span>;
  }

  const min = Math.round(value - uncertainty);
  const max = Math.round(value + uncertainty);

  if (format === 'compact') {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="font-semibold">
          {min.toLocaleString()} - {max.toLocaleString()}{unit}
        </span>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-changi-gray hover:text-changi-navy"
          >
            <Info className="w-4 h-4" />
          </button>
          {showTooltip && (
            <div className="absolute z-10 left-0 mt-2 p-3 bg-white border border-changi-gray rounded-lg shadow-lg max-w-xs text-xs">
              <p className="font-semibold mb-1">Why uncertainty ranges?</p>
              <p className="text-changi-gray">
                Emissions calculations include uncertainty ranges to reflect variations in fuel composition, 
                aircraft efficiency, and radiative forcing effects. Actual emissions may fall anywhere within this range.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="font-semibold">{value.toLocaleString()} ± {uncertainty.toLocaleString()}{unit}</span>
      <span className="text-changi-gray text-sm ml-2">
        (Range: {min.toLocaleString()}{unit} - {max.toLocaleString()}{unit})
      </span>
    </div>
  );
}
