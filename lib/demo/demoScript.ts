/**
 * Demo Script - Guided Demo Mode with Compliance Narrative
 * 
 * Defines the demo scenario steps with narrative for presenting
 * the Changi Sustainable Loyalty Ecosystem in compliance context.
 */

export interface DemoStep {
  id: string;
  stepNumber: number;
  title: string;
  narrative: string; // Presenter notes
  route: string; // Route to navigate to
  highlight?: string; // Element to highlight (optional)
  action?: {
    type: 'calculate' | 'contribute_saf' | 'ask_max' | 'log_circularity' | 'view_impact' | 'view_dashboard';
    params?: Record<string, any>;
  };
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'intro',
    stepNumber: 0,
    title: 'Introduction',
    narrative: 'The offset era is ending. Singapore mandates SAF from 2026. Let\'s see how Changi is preparing...',
    route: '/',
    action: undefined,
  },
  {
    id: 'calculate_london',
    stepNumber: 1,
    title: 'Calculate London Flight',
    narrative: 'Show emissions with radiative forcing. Highlight methodology transparency.',
    route: '/calculator',
    action: {
      type: 'calculate',
      params: {
        routeId: 'SIN-LHR',
        cabinClass: 'economy',
        includeRF: true,
      },
    },
  },
  {
    id: 'saf_contribution',
    stepNumber: 2,
    title: 'SAF Contribution (Primary Action)',
    narrative: 'Explain Book & Claim. Show verification status. "This funds real SAF at Neste Singapore"',
    route: '/calculator',
    action: {
      type: 'contribute_saf',
      params: {
        routeId: 'SIN-LHR',
        contributionPercent: 50,
        safType: 'waste_based',
        providerId: 'neste_singapore',
      },
    },
  },
  {
    id: 'ask_max_saf',
    stepNumber: 3,
    title: 'Ask Max about SAF',
    narrative: '"Why SAF first?" question. Show Max\'s educational response.',
    route: '/chat',
    action: {
      type: 'ask_max',
      params: {
        question: 'Why SAF first?',
      },
    },
  },
  {
    id: 'circularity_action',
    stepNumber: 4,
    title: 'Circularity Action',
    narrative: 'Log Cup-as-a-Service. Show waste diverted. "Beyond carbon — addressing plastics too"',
    route: '/shop', // Assuming circularity actions are accessible from shop or a dedicated page
    action: {
      type: 'log_circularity',
      params: {
        actionId: 'cup_as_a_service',
      },
    },
  },
  {
    id: 'green_tier_progress',
    stepNumber: 5,
    title: 'Green Tier Progress',
    narrative: 'Show Eco-Points earned. Tier upgrade celebration. "Gamifying sustainable behavior"',
    route: '/',
    action: {
      type: 'view_dashboard',
      params: {},
    },
  },
  {
    id: 'impact_story',
    stepNumber: 6,
    title: 'Impact Story',
    narrative: 'Request personalized impact story. Show AI-generated narrative. "Making the abstract concrete"',
    route: '/chat',
    action: {
      type: 'view_impact',
      params: {
        request: 'Show me my impact story',
      },
    },
  },
  {
    id: 'dashboard_view',
    stepNumber: 7,
    title: 'Dashboard View',
    narrative: 'Show SAF progress toward 2026. Live activity feed. "Real-time compliance visibility"',
    route: '/dashboard',
    action: {
      type: 'view_dashboard',
      params: {},
    },
  },
];

export const TOTAL_STEPS = DEMO_STEPS.length;

/**
 * Get demo step by ID
 */
export function getDemoStep(stepId: string): DemoStep | undefined {
  return DEMO_STEPS.find(step => step.id === stepId);
}

/**
 * Get demo step by number
 */
export function getDemoStepByNumber(stepNumber: number): DemoStep | undefined {
  return DEMO_STEPS.find(step => step.stepNumber === stepNumber);
}

/**
 * Get next step
 */
export function getNextStep(currentStep: DemoStep): DemoStep | null {
  const nextNumber = currentStep.stepNumber + 1;
  if (nextNumber >= TOTAL_STEPS) return null;
  return getDemoStepByNumber(nextNumber) || null;
}

/**
 * Get previous step
 */
export function getPreviousStep(currentStep: DemoStep): DemoStep | null {
  const prevNumber = currentStep.stepNumber - 1;
  if (prevNumber < 0) return null;
  return getDemoStepByNumber(prevNumber) || null;
}

/**
 * Check if demo mode is active from URL params
 */
export function isDemoModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('demo') || params.has('demoStep');
}

/**
 * Get current demo step from URL params
 * Supports both 'step' and 'demoStepNumber' parameters for compatibility
 */
export function getCurrentDemoStepFromURL(): DemoStep | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  
  const stepId = params.get('demoStep');
  // Support both 'step' and 'demoStepNumber' parameters
  const stepNumber = params.get('step') || params.get('demoStepNumber');
  
  if (stepId) {
    return getDemoStep(stepId) || null;
  }
  
  if (stepNumber) {
    const num = parseInt(stepNumber, 10);
    if (!isNaN(num)) {
      return getDemoStepByNumber(num) || null;
    }
  }
  
  // Default to intro if demo mode is active
  if (params.has('demo')) {
    return DEMO_STEPS[0];
  }
  
  return null;
}

/**
 * Build URL with demo step
 * Uses 'step' parameter for cleaner URLs
 */
export function buildDemoURL(step: DemoStep, basePath?: string): string {
  const path = basePath || step.route;
  return `${path}?demo=true&step=${step.stepNumber}`;
}

/**
 * Update URL with demo step (without navigation)
 * Uses 'step' parameter for cleaner URLs
 */
export function updateURLWithDemoStep(step: DemoStep): void {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  url.searchParams.set('demo', 'true');
  url.searchParams.set('step', step.stepNumber.toString());
  // Keep demoStep for backwards compatibility
  url.searchParams.set('demoStep', step.id);
  
  window.history.replaceState({}, '', url.toString());
}

/**
 * Remove demo mode from URL
 */
export function removeDemoFromURL(): void {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  url.searchParams.delete('demo');
  url.searchParams.delete('step');
  url.searchParams.delete('demoStep');
  url.searchParams.delete('demoStepNumber');
  
  window.history.replaceState({}, '', url.toString());
}

