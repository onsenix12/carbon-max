'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';

// Flight data structure
export interface FlightData {
  routeId?: string;
  origin?: string;
  destination?: string;
  emissions: number; // kg CO2e
  emissionsWithRF?: number; // kg CO2e with radiative forcing
  includeRF: boolean;
  passengers: number;
  safContribution?: {
    amount: number; // USD
    liters: number;
    emissionsReduced: number; // kg CO2e
    provider?: string;
    timestamp: string;
  };
  offsetPurchase?: {
    amount: number; // USD
    tonnesOffset: number;
    timestamp: string;
  };
}

// Transport data structure
export interface TransportData {
  mode: 'taxi' | 'bus' | 'mrt' | 'walk' | 'bike' | 'car';
  distance?: number; // km
  emissions: number; // kg CO2e
  ecoPointsEarned: number;
  timestamp: string;
}

// Shopping transaction
export interface ShoppingTransaction {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number; // USD
  isGreenMerchant: boolean;
  ecoPointsMultiplier: number;
  ecoPointsEarned: number;
  timestamp: string;
}

// Dining transaction
export interface DiningTransaction {
  id: string;
  restaurantId: string;
  restaurantName: string;
  amount: number; // USD
  isPlantBased: boolean;
  emissionsReduced?: number; // kg CO2e
  ecoPointsEarned: number;
  timestamp: string;
}

// Circularity action
export interface CircularityAction {
  id: string;
  actionId: string; // Reference to circularityActions.json
  actionName: string;
  wasteDiverted: number; // grams
  ecoPointsEarned: number;
  timestamp: string;
}

// Complete journey state
export interface JourneyState {
  flight: FlightData | null;
  transport: TransportData[];
  shopping: ShoppingTransaction[];
  dining: DiningTransaction[];
  circularity: CircularityAction[];
  totalEcoPointsEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyContextType {
  journey: JourneyState;
  
  // Flight methods
  setFlight: (flight: Partial<FlightData>) => void;
  addSAFContribution: (amount: number, liters: number, emissionsReduced: number, provider?: string) => void;
  addOffsetPurchase: (amount: number, tonnesOffset: number) => void;
  toggleRF: (includeRF: boolean) => void;
  
  // Transport methods
  addTransport: (transport: Omit<TransportData, 'timestamp'>) => void;
  
  // Shopping methods
  addTransaction: (transaction: Omit<ShoppingTransaction, 'id' | 'timestamp'>) => void;
  
  // Dining methods
  addDiningTransaction: (transaction: Omit<DiningTransaction, 'id' | 'timestamp'>) => void;
  
  // Circularity methods
  addCircularityAction: (action: Omit<CircularityAction, 'id' | 'timestamp'>) => void;
  
  // Journey management
  resetJourney: () => void;
  
  // Computed values
  totalEmissions: number;
  netEmissions: number; // After SAF and offsets
  totalWasteDiverted: number; // grams
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

const STORAGE_KEY = 'journey_state';

// Demo data for presentation
const DEMO_JOURNEY: JourneyState = {
  flight: {
    routeId: 'sin-lhr',
    origin: 'Singapore (SIN)',
    destination: 'London (LHR)',
    emissions: 850.5,
    emissionsWithRF: 1275.75,
    includeRF: true,
    passengers: 1,
    safContribution: {
      amount: 25.0,
      liters: 10,
      emissionsReduced: 765.45,
      provider: 'neste_singapore',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  },
  transport: [
    {
      mode: 'mrt',
      distance: 15,
      emissions: 0.5,
      ecoPointsEarned: 5,
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ],
  shopping: [
    {
      id: 'demo-shop-1',
      merchantId: 'gucci',
      merchantName: 'Gucci',
      amount: 500,
      isGreenMerchant: true,
      ecoPointsMultiplier: 1.8,
      ecoPointsEarned: 450,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  dining: [
    {
      id: 'demo-dining-1',
      restaurantId: 'starbucks',
      restaurantName: 'Starbucks',
      amount: 12.5,
      isPlantBased: true,
      emissionsReduced: 2.5,
      ecoPointsEarned: 18,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  circularity: [
    {
      id: 'demo-circularity-1',
      actionId: 'cup_as_a_service',
      actionName: 'Cup-as-a-Service',
      wasteDiverted: 15,
      ecoPointsEarned: 10,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo-circularity-2',
      actionId: 'refuse_bag',
      actionName: 'Refuse Bag, Bring Own Bag',
      wasteDiverted: 8,
      ecoPointsEarned: 5,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  totalEcoPointsEarned: 498,
  createdAt: new Date(Date.now() - 172800000).toISOString(),
  updatedAt: new Date().toISOString(),
};

function loadJourney(): JourneyState {
  if (typeof window === 'undefined') return DEMO_JOURNEY;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEMO_JOURNEY;
    const parsed = JSON.parse(stored);
    // Ensure all required fields exist
    return {
      ...DEMO_JOURNEY,
      ...parsed,
      flight: parsed.flight || null,
      transport: parsed.transport || [],
      shopping: parsed.shopping || [],
      dining: parsed.dining || [],
      circularity: parsed.circularity || [],
    };
  } catch {
    return DEMO_JOURNEY;
  }
}

function saveJourney(journey: JourneyState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
  } catch (error) {
    console.warn('Failed to save journey state:', error);
  }
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journey, setJourney] = useState<JourneyState>(loadJourney());

  // Save to localStorage whenever journey changes
  useEffect(() => {
    saveJourney(journey);
  }, [journey]);

  // Flight methods
  const setFlight = useCallback((flightData: Partial<FlightData>) => {
    setJourney(prev => ({
      ...prev,
      flight: prev.flight ? { ...prev.flight, ...flightData } : {
        emissions: 0,
        includeRF: true,
        passengers: 1,
        ...flightData,
      } as FlightData,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addSAFContribution = useCallback((
    amount: number,
    liters: number,
    emissionsReduced: number,
    provider?: string
  ) => {
    setJourney(prev => ({
      ...prev,
      flight: prev.flight ? {
        ...prev.flight,
        safContribution: {
          amount,
          liters,
          emissionsReduced,
          provider,
          timestamp: new Date().toISOString(),
        },
      } : null,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addOffsetPurchase = useCallback((amount: number, tonnesOffset: number) => {
    setJourney(prev => ({
      ...prev,
      flight: prev.flight ? {
        ...prev.flight,
        offsetPurchase: {
          amount,
          tonnesOffset,
          timestamp: new Date().toISOString(),
        },
      } : null,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const toggleRF = useCallback((includeRF: boolean) => {
    setJourney(prev => ({
      ...prev,
      flight: prev.flight ? { ...prev.flight, includeRF } : null,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Transport methods
  const addTransport = useCallback((transport: Omit<TransportData, 'timestamp'>) => {
    const newTransport: TransportData = {
      ...transport,
      timestamp: new Date().toISOString(),
    };
    
    setJourney(prev => ({
      ...prev,
      transport: [...prev.transport, newTransport],
      totalEcoPointsEarned: prev.totalEcoPointsEarned + transport.ecoPointsEarned,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Shopping methods
  const addTransaction = useCallback((transaction: Omit<ShoppingTransaction, 'id' | 'timestamp'>) => {
    const newTransaction: ShoppingTransaction = {
      ...transaction,
      id: `shop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    setJourney(prev => ({
      ...prev,
      shopping: [...prev.shopping, newTransaction],
      totalEcoPointsEarned: prev.totalEcoPointsEarned + transaction.ecoPointsEarned,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Dining methods
  const addDiningTransaction = useCallback((transaction: Omit<DiningTransaction, 'id' | 'timestamp'>) => {
    const newTransaction: DiningTransaction = {
      ...transaction,
      id: `dining-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    setJourney(prev => ({
      ...prev,
      dining: [...prev.dining, newTransaction],
      totalEcoPointsEarned: prev.totalEcoPointsEarned + transaction.ecoPointsEarned,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Circularity methods
  const addCircularityAction = useCallback((action: Omit<CircularityAction, 'id' | 'timestamp'>) => {
    const newAction: CircularityAction = {
      ...action,
      id: `circularity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    setJourney(prev => ({
      ...prev,
      circularity: [...prev.circularity, newAction],
      totalEcoPointsEarned: prev.totalEcoPointsEarned + action.ecoPointsEarned,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Reset journey
  const resetJourney = useCallback(() => {
    const newJourney: JourneyState = {
      flight: null,
      transport: [],
      shopping: [],
      dining: [],
      circularity: [],
      totalEcoPointsEarned: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJourney(newJourney);
    saveJourney(newJourney);
  }, []);

  // Computed values
  const totalEmissions = journey.flight
    ? (journey.flight.includeRF && journey.flight.emissionsWithRF
        ? journey.flight.emissionsWithRF
        : journey.flight.emissions)
    : 0;

  const netEmissions = totalEmissions
    - (journey.flight?.safContribution?.emissionsReduced || 0)
    - (journey.flight?.offsetPurchase ? journey.flight.offsetPurchase.tonnesOffset * 1000 : 0);

  const totalWasteDiverted = journey.circularity.reduce(
    (sum, action) => sum + action.wasteDiverted,
    0
  );

  const value: JourneyContextType = {
    journey,
    setFlight,
    addSAFContribution,
    addOffsetPurchase,
    toggleRF,
    addTransport,
    addTransaction,
    addDiningTransaction,
    addCircularityAction,
    resetJourney,
    totalEmissions,
    netEmissions,
    totalWasteDiverted,
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourneyContext(): JourneyContextType {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourneyContext must be used within a JourneyProvider');
  }
  return context;
}

// Backward compatibility wrapper
// For new code, prefer importing from '@/hooks/useJourney' for enhanced computed values
export function useJourney() {
  const context = useJourneyContext();
  
  // Provide compatibility with old interface while supporting new structure
  // Old interface expected: entries, addEntry, clearEntries, totalEmissionsReduced, totalPointsEarned
  // New structure provides: journey, totalEmissions, netEmissions, etc.
  
  // For backward compatibility, provide entries-like structure
  const entries = [
    ...(context.journey.flight ? [{
      id: 'flight',
      type: 'flight' as const,
      title: `${context.journey.flight.origin || ''} → ${context.journey.flight.destination || ''}`,
      description: 'Flight emissions',
      timestamp: context.journey.updatedAt,
      emissions: context.totalEmissions,
      emissionsReduced: context.journey.flight.safContribution?.emissionsReduced || 0,
      pointsEarned: context.journey.flight.safContribution ? Math.round(context.journey.flight.safContribution.amount * 10) : 0,
    }] : []),
    ...context.journey.transport.map(t => ({
      id: `transport-${t.timestamp}`,
      type: 'transport' as const,
      title: `${t.mode} transport`,
      description: `${t.distance || 0} km`,
      timestamp: t.timestamp,
      emissions: t.emissions,
      pointsEarned: t.ecoPointsEarned,
    })),
    ...context.journey.shopping.map(s => ({
      id: s.id,
      type: 'merchant' as const,
      title: s.merchantName,
      description: `$${s.amount.toFixed(2)}`,
      timestamp: s.timestamp,
      amount: s.amount,
      pointsEarned: s.ecoPointsEarned,
    })),
    ...context.journey.dining.map(d => ({
      id: d.id,
      type: 'dining' as const,
      title: d.restaurantName,
      description: d.isPlantBased ? 'Plant-based meal' : 'Meal',
      timestamp: d.timestamp,
      amount: d.amount,
      emissionsReduced: d.emissionsReduced,
      pointsEarned: d.ecoPointsEarned,
    })),
    ...context.journey.circularity.map(c => ({
      id: c.id,
      type: 'circularity' as const,
      title: c.actionName,
      description: `${c.wasteDiverted}g waste diverted`,
      timestamp: c.timestamp,
      pointsEarned: c.ecoPointsEarned,
    })),
  ];

  return {
    // Enhanced structure (preferred)
    journey: context.journey,
    totalEmissions: context.totalEmissions,
    netEmissions: context.netEmissions,
    totalEcoPoints: context.journey.totalEcoPointsEarned,
    totalWasteDiverted: context.totalWasteDiverted,
    
    // Backward compatibility
    entries,
    addEntry: (entry: any) => {
      // Map old entry format to new structure
      if (entry.type === 'flight') {
        context.setFlight({ emissions: entry.emissions || 0, includeRF: true, passengers: 1 });
      } else if (entry.type === 'saf_contribution') {
        context.addSAFContribution(entry.amount || 0, 0, entry.emissionsReduced || 0);
      } else if (entry.type === 'circularity') {
        context.addCircularityAction({
          actionId: entry.actionId || '',
          actionName: entry.title || '',
          wasteDiverted: 0,
          ecoPointsEarned: entry.pointsEarned || 0,
        });
      }
    },
    clearEntries: context.resetJourney,
    totalEmissionsReduced: context.totalEmissions - context.netEmissions,
    totalPointsEarned: context.journey.totalEcoPointsEarned,
    
    // All new methods
    setFlight: context.setFlight,
    addSAFContribution: context.addSAFContribution,
    addOffsetPurchase: context.addOffsetPurchase,
    toggleRF: context.toggleRF,
    addTransport: context.addTransport,
    addTransaction: context.addTransaction,
    addDiningTransaction: context.addDiningTransaction,
    addCircularityAction: context.addCircularityAction,
    resetJourney: context.resetJourney,
  };
}
