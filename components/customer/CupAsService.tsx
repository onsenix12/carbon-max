'use client';

import { QrCode, CheckCircle2, MapPin } from 'lucide-react';

interface CircularityAction {
  id: string;
  name: string;
  description: string;
  category: string;
  eco_points: number;
  waste_diverted_grams: number;
  availability?: {
    locations: string[];
    partners: string[];
  };
}

interface CupAsServiceProps {
  action: CircularityAction;
  onLogAction: () => void;
}

export default function CupAsService({ action, onLogAction }: CupAsServiceProps) {
  return (
    <div className="bg-gradient-to-br from-carbon-lime/30 via-white to-carbon-mint/20 rounded-xl p-6 border-2 border-carbon-leaf shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-carbon-leaf text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
            <h2 className="text-2xl font-bold text-changi-navy">{action.name}</h2>
          </div>
          <p className="text-changi-gray">{action.description}</p>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="bg-white rounded-lg p-6 mb-4 flex flex-col items-center justify-center border-2 border-dashed border-carbon-leaf/30">
        <QrCode className="w-24 h-24 text-carbon-leaf/50 mb-3" />
        <p className="text-sm text-changi-gray text-center">
          Scan QR code at participating outlets to borrow a reusable cup
        </p>
        <p className="text-xs text-changi-gray mt-2 italic">
          (QR code integration coming soon)
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-white/80 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-changi-navy mb-3">How It Works:</h3>
        <ol className="space-y-2 text-sm text-changi-gray">
          <li className="flex items-start gap-2">
            <span className="font-bold text-carbon-leaf">1.</span>
            <span>Scan the QR code at any participating outlet</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-carbon-leaf">2.</span>
            <span>Borrow a reusable cup for your drink</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-carbon-leaf">3.</span>
            <span>Return the cup at any participating location in the terminal</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-carbon-leaf">4.</span>
            <span>Earn {action.eco_points} Eco-Points and divert {action.waste_diverted_grams}g of waste!</span>
          </li>
        </ol>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/80 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-carbon-leaf">{action.eco_points}</div>
          <div className="text-xs text-changi-gray">Eco-Points</div>
        </div>
        <div className="bg-white/80 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-carbon-forest">{action.waste_diverted_grams}g</div>
          <div className="text-xs text-changi-gray">Waste Diverted</div>
        </div>
      </div>

      {/* Participating Outlets */}
      {action.availability && (
        <div className="mb-4">
          <h3 className="font-semibold text-changi-navy mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Participating Outlets
          </h3>
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-sm text-changi-gray mb-2 font-semibold">Partners:</p>
            <div className="flex flex-wrap gap-2">
              {action.availability.partners.map((partner, idx) => (
                <span
                  key={idx}
                  className="bg-carbon-lime/30 text-carbon-forest px-2 py-1 rounded text-xs font-medium"
                >
                  {partner}
                </span>
              ))}
            </div>
            <p className="text-xs text-changi-gray mt-3">
              Available at: {action.availability.locations.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Log Action Button */}
      <button
        onClick={onLogAction}
        className="w-full bg-carbon-leaf text-white px-4 py-3 rounded-lg font-semibold hover:bg-carbon-forest transition-colors flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" />
        Log Cup-as-a-Service Action
      </button>
    </div>
  );
}

