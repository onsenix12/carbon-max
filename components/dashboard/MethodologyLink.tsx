'use client';

import { Info, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface MethodologyLinkProps {
  metric: string;
  source?: string;
  citation?: string;
  isEstimate?: boolean;
  methodology?: string;
}

export default function MethodologyLink({
  metric,
  source,
  citation,
  isEstimate,
  methodology,
}: MethodologyLinkProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        className="inline-flex items-center gap-1 text-xs text-changi-gray hover:text-carbon-leaf transition-colors"
        aria-label={`Methodology for ${metric}`}
        aria-expanded={showTooltip}
      >
        <Info className="w-3 h-3" />
        <span>How we calculate</span>
      </button>

      {showTooltip && (
        <div
          className="absolute z-50 mt-2 w-80 p-4 bg-white rounded-lg shadow-xl border border-changi-gray/20"
          role="tooltip"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-changi-navy text-sm">Methodology: {metric}</h4>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-changi-gray hover:text-changi-navy"
              aria-label="Close methodology tooltip"
            >
              ×
            </button>
          </div>
          
          {isEstimate && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <strong>Note:</strong> This is an estimated value based on available data.
            </div>
          )}

          {methodology && (
            <p className="text-sm text-changi-gray mb-3">{methodology}</p>
          )}

          {source && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-changi-navy mb-1">Data Source:</p>
              <p className="text-xs text-changi-gray">{source}</p>
            </div>
          )}

          {citation && (
            <div className="pt-2 border-t border-changi-gray/20">
              <p className="text-xs text-changi-gray italic">{citation}</p>
            </div>
          )}

          <a
            href="/doc/CARBON_Framework.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-carbon-leaf hover:text-carbon-forest font-medium"
          >
            View full methodology
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

