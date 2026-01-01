'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  getCurrentDemoStepFromURL,
  updateURLWithDemoStep,
  removeDemoFromURL,
  buildDemoURL,
  getDemoStep,
  getDemoStepByNumber,
  getNextStep,
  getPreviousStep,
  type DemoStep,
} from '@/lib/demo/demoScript';

export interface UseDemoModeReturn {
  isActive: boolean;
  currentStep: DemoStep | null;
  nextStep: DemoStep | null;
  previousStep: DemoStep | null;
  navigateToStep: (step: DemoStep) => void;
  navigateToStepById: (stepId: string) => void;
  navigateToStepByNumber: (stepNumber: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  exitDemo: () => void;
  startDemo: () => void;
}

export function useDemoMode(): UseDemoModeReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<DemoStep | null>(null);

  useEffect(() => {
    const step = getCurrentDemoStepFromURL();
    if (step) {
      setCurrentStep(step);
      setIsActive(true);
    } else {
      setCurrentStep(null);
      setIsActive(false);
    }
  }, [pathname, searchParams]);

  const navigateToStep = useCallback(
    (step: DemoStep) => {
      updateURLWithDemoStep(step);
      setCurrentStep(step);
      router.push(buildDemoURL(step, pathname));
    },
    [router, pathname]
  );

  const navigateToStepById = useCallback(
    (stepId: string) => {
      const step = getDemoStep(stepId);
      if (step) {
        navigateToStep(step);
      }
    },
    [navigateToStep]
  );

  const navigateToStepByNumber = useCallback(
    (stepNumber: number) => {
      const targetStep = getDemoStepByNumber(stepNumber);
      if (targetStep) {
        navigateToStep(targetStep);
      }
    },
    [navigateToStep]
  );

  const goToNext = useCallback(() => {
    if (currentStep) {
      const next = getNextStep(currentStep);
      if (next) {
        navigateToStep(next);
      }
    }
  }, [currentStep, navigateToStep]);

  const goToPrevious = useCallback(() => {
    if (currentStep) {
      const prev = getPreviousStep(currentStep);
      if (prev) {
        navigateToStep(prev);
      }
    }
  }, [currentStep, navigateToStep]);

  const exitDemo = useCallback(() => {
    removeDemoFromURL();
    setCurrentStep(null);
    setIsActive(false);
    // Optionally navigate to home
    // router.push('/');
  }, [router]);

  const startDemo = useCallback(() => {
    const introStep = getDemoStep('intro');
    if (introStep) {
      navigateToStep(introStep);
    }
  }, [navigateToStep]);

  const nextStep = currentStep ? getNextStep(currentStep) : null;
  const previousStep = currentStep ? getPreviousStep(currentStep) : null;

  return {
    isActive,
    currentStep,
    nextStep,
    previousStep,
    navigateToStep,
    navigateToStepById,
    navigateToStepByNumber,
    goToNext,
    goToPrevious,
    exitDemo,
    startDemo,
  };
}

