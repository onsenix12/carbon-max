'use client';

import { Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ImpactStoryProps {
  story: {
    title: string;
    narrative: string;
    details: {
      emissionsReduced: number;
      safContribution?: number;
      offsetContribution?: number;
      ecoPointsEarned: number;
      actions: string[];
    };
  };
  onShare?: () => void;
}

export default function ImpactStory({ story, onShare }: ImpactStoryProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      const text = `${story.title}\n\n${story.narrative}\n\nImpact: ${story.details.emissionsReduced.toFixed(1)} kg CO₂e reduced`;
      
      if (navigator.share) {
        navigator.share({
          title: story.title,
          text,
        }).catch(() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      } else {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-carbon-leaf via-carbon-forest to-carbon-sage text-white rounded-xl p-6 shadow-xl border-2 border-white/20">
      {/* Illustration Placeholder */}
      <div className="mb-4 flex justify-center">
        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-white/80" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3 text-center">{story.title}</h3>

      {/* Narrative */}
      <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm">
        <p className="text-white/95 leading-relaxed whitespace-pre-line">
          {story.narrative}
        </p>
      </div>

      {/* Impact Details */}
      <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm">
        <h4 className="font-semibold mb-2 text-lg">Your Impact</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/80">Emissions Addressed:</span>
            <span className="font-bold">{story.details.emissionsReduced.toFixed(1)} kg CO₂e</span>
          </div>
          {story.details.safContribution && (
            <div className="flex justify-between">
              <span className="text-white/80">SAF Contribution:</span>
              <span className="font-bold">${story.details.safContribution.toFixed(2)}</span>
            </div>
          )}
          {story.details.offsetContribution && (
            <div className="flex justify-between">
              <span className="text-white/80">Offset Contribution:</span>
              <span className="font-bold">${story.details.offsetContribution.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-white/80">Eco-Points Earned:</span>
            <span className="font-bold">{story.details.ecoPointsEarned.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Actions Taken */}
      {story.details.actions.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-sm">Actions You Took:</h4>
          <div className="flex flex-wrap gap-2">
            {story.details.actions.map((action, index) => (
              <span
                key={index}
                className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm"
              >
                {action}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Thank You */}
      <div className="text-center mb-4">
        <p className="text-white/90 italic">
          Thank you for taking action to address your travel footprint.
        </p>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-full bg-white text-carbon-forest font-semibold py-3 px-4 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
      >
        <Share2 className="w-5 h-5" />
        {copied ? 'Copied!' : 'Share Your Story'}
      </button>
    </div>
  );
}

