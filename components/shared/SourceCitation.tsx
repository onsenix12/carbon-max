'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

export interface SourceCitationProps {
  source?: string;
  citation?: string;
  compact?: boolean;
}

export default function SourceCitation({ source, citation, compact = false }: SourceCitationProps) {
  const [showFull, setShowFull] = useState(false);

  if (!source && !citation) return null;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1">
        <span className="text-xs text-changi-gray">Source: </span>
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-xs text-changi-purple hover:text-changi-navy underline"
          onMouseEnter={() => setShowFull(true)}
          onMouseLeave={() => setShowFull(false)}
        >
          {source}
        </button>
        {showFull && citation && (
          <div className="absolute z-10 mt-2 p-3 bg-white border border-changi-gray rounded-lg shadow-lg max-w-md text-xs">
            <p className="font-semibold mb-1">{source}</p>
            <p className="text-changi-gray">{citation}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-sm text-changi-gray">
      {source && (
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Source: {source}</p>
            {citation && (
              <p className="text-xs mt-1 italic">{citation}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
