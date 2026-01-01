'use client';

import { X } from 'lucide-react';
import { getFlightCalculationMethodology } from '@/lib/emissions/methodology';
import SourceCitation from '@/components/shared/SourceCitation';

interface MethodologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  methodology?: {
    formula: string;
    factorsUsed: Array<{
      name: string;
      value: number;
      unit: string;
      source: string;
      citation: string;
      year: number;
    }>;
    sources: Array<{
      name: string;
      citation: string;
      year: number;
    }>;
    calculationMethod: string;
  };
}

export default function MethodologyDrawer({ isOpen, onClose, methodology }: MethodologyDrawerProps) {
  const defaultMethodology = getFlightCalculationMethodology();

  const method = methodology || {
    formula: defaultMethodology.formula,
    factorsUsed: [],
    sources: defaultMethodology.sources,
    calculationMethod: defaultMethodology.description
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-changi-cream shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-changi-navy text-white p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">How We Calculated This</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-changi-purple rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transparency Message */}
          <div className="bg-carbon-lime/20 border-l-4 border-carbon-leaf p-4 rounded">
            <p className="font-semibold text-carbon-forest mb-1">We prioritize transparency</p>
            <p className="text-sm text-changi-gray">
              Every calculation is based on published scientific sources and industry standards. 
              We show you exactly how we arrived at these numbers.
            </p>
          </div>

          {/* Formula */}
          <section>
            <h3 className="text-lg font-semibold text-changi-navy mb-3">Formula</h3>
            <div className="bg-white p-4 rounded-lg border border-changi-gray/20">
              <code className="text-sm font-mono text-changi-navy">
                {method.formula}
              </code>
            </div>
          </section>

          {/* Calculation Method */}
          <section>
            <h3 className="text-lg font-semibold text-changi-navy mb-3">Calculation Method</h3>
            <p className="text-changi-gray">{method.calculationMethod}</p>
          </section>

          {/* Factors Used */}
          {method.factorsUsed && method.factorsUsed.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-changi-navy mb-3">Factors Used</h3>
              <div className="space-y-3">
                {method.factorsUsed.map((factor, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-changi-gray/20">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-changi-navy">{factor.name}</p>
                        <p className="text-sm text-changi-gray">
                          {factor.value} {factor.unit}
                        </p>
                      </div>
                    </div>
                    <SourceCitation source={factor.source} citation={factor.citation} compact />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sources */}
          <section>
            <h3 className="text-lg font-semibold text-changi-navy mb-3">Sources</h3>
            <div className="space-y-3">
              {method.sources.map((source, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-changi-gray/20">
                  <SourceCitation 
                    source={source.name} 
                    citation={'citation' in source ? source.citation : undefined} 
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Uncertainty Acknowledgment */}
          <section>
            <div className="bg-changi-cream border border-changi-gray/20 p-4 rounded-lg">
              <p className="text-sm text-changi-gray">
                <strong className="text-changi-navy">Uncertainty:</strong> All emission factors 
                include uncertainty ranges to reflect scientific confidence levels. Actual emissions 
                may vary based on specific flight conditions, aircraft age, and weather.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

