'use client';

import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from 'lucide-react';
import { 
  DEMO_STEPS, 
  getCurrentDemoStepFromURL, 
  getNextStep, 
  getPreviousStep,
  updateURLWithDemoStep,
  removeDemoFromURL,
  buildDemoURL,
  type DemoStep,
} from '@/lib/demo/demoScript';
import { useRouter } from 'next/navigation';

interface DemoOverlayProps {
  onStepChange?: (step: DemoStep) => void;
  onExit?: () => void;
}

export default function DemoOverlay({ onStepChange, onExit }: DemoOverlayProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<DemoStep | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const step = getCurrentDemoStepFromURL();
    if (step) {
      setCurrentStep(step);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Listen for URL changes
  useEffect(() => {
    const handlePopState = () => {
      const step = getCurrentDemoStepFromURL();
      if (step) {
        setCurrentStep(step);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for hash changes (for step navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const step = getCurrentDemoStepFromURL();
      if (step) {
        setCurrentStep(step);
        setIsVisible(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!isVisible || !currentStep) {
    return null;
  }

  const handleNext = () => {
    const next = getNextStep(currentStep);
    if (next) {
      navigateToStep(next);
    }
  };

  const handlePrevious = () => {
    const prev = getPreviousStep(currentStep);
    if (prev) {
      navigateToStep(prev);
    }
  };

  const navigateToStep = (step: DemoStep) => {
    updateURLWithDemoStep(step);
    setCurrentStep(step);
    router.push(buildDemoURL(step));
    onStepChange?.(step);
  };

  const handleExit = () => {
    removeDemoFromURL();
    setIsVisible(false);
    setCurrentStep(null);
    onExit?.();
  };

  const handleSkipToStep = (stepNumber: number) => {
    const step = DEMO_STEPS.find(s => s.stepNumber === stepNumber);
    if (step) {
      navigateToStep(step);
    }
  };

  const nextStep = getNextStep(currentStep);
  const prevStep = getPreviousStep(currentStep);
  const currentStepNumber = currentStep.stepNumber;
  const totalSteps = DEMO_STEPS.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-changi-navy via-changi-navy/95 to-transparent p-4 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              Step {currentStepNumber + 1} of {totalSteps}
            </span>
            <div className="flex gap-1">
              {DEMO_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => handleSkipToStep(step.stepNumber)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    step.stepNumber === currentStepNumber
                      ? 'bg-carbon-lime w-8'
                      : step.stepNumber < currentStepNumber
                      ? 'bg-carbon-lime/60'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to step ${step.stepNumber + 1}`}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={handleExit}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Exit demo mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Text */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="bg-carbon-lime/20 rounded-full p-2 flex-shrink-0">
              <Play className="w-4 h-4 text-carbon-lime" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">{currentStep.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed">{currentStep.narrative}</p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!prevStep}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                prevStep
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
          </div>

          {/* Step Selector Dropdown */}
          <div className="flex-1 mx-4">
            <select
              value={currentStepNumber}
              onChange={(e) => handleSkipToStep(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-carbon-lime cursor-pointer"
            >
              {DEMO_STEPS.map((step) => (
                <option key={step.id} value={step.stepNumber} className="bg-changi-navy text-white">
                  {step.stepNumber + 1}. {step.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {nextStep ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-carbon-lime text-changi-navy rounded-lg font-medium hover:bg-carbon-lime/90 transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleExit}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all"
              >
                <X className="w-4 h-4" />
                Exit Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

