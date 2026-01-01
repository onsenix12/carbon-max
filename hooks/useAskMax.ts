'use client';

import { useState, useCallback, useEffect } from 'react';
import { useJourney } from '@/hooks/useJourney';
import { useGreenTier } from '@/hooks/useGreenTier';
import type { ChatMessage } from '@/lib/claude/askMax';
import type { ImpactStory } from '@/lib/claude/impactStories';

const STORAGE_KEY = 'ask_max_chat_history';
const MAX_HISTORY_LENGTH = 50;

interface ChatResponse {
  success: boolean;
  reply?: string;
  nudge?: {
    id: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    actionType?: string;
  };
  impactStory?: ImpactStory;
  error?: string;
}

export function useAskMax() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { journey, totalEmissions, netEmissions, totalEcoPoints, totalWasteDiverted } = useJourney();
  const { tierInfo, progress, totalEcoPoints: tierPoints, lifetimeEcoPoints, tierMultiplier } = useGreenTier();

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects if needed
        const history = parsed.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        }));
        setChatHistory(history);
      }
    } catch (err) {
      console.warn('Failed to load chat history:', err);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined' || chatHistory.length === 0) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (err) {
      console.warn('Failed to save chat history:', err);
    }
  }, [chatHistory]);

  const sendMessage = useCallback(async (message: string): Promise<ChatResponse | null> => {
    if (!message.trim()) return null;

    setIsLoading(true);
    setError(null);

    // Add user message to history immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => [...prev, userMessage].slice(-MAX_HISTORY_LENGTH));

    try {
      // Build context from hooks
      const journeyContext = {
        flight: journey.flight ? {
          origin: journey.flight.origin,
          destination: journey.flight.destination,
          emissions: journey.flight.emissions,
          emissionsWithRF: journey.flight.emissionsWithRF,
          includeRF: journey.flight.includeRF,
          safContribution: journey.flight.safContribution,
          offsetPurchase: journey.flight.offsetPurchase,
        } : undefined,
        transport: journey.transport.map(t => ({
          mode: t.mode,
          emissions: t.emissions,
          ecoPointsEarned: t.ecoPointsEarned,
        })),
        shopping: journey.shopping.map(s => ({
          merchantName: s.merchantName,
          amount: s.amount,
          isGreenMerchant: s.isGreenMerchant,
          ecoPointsEarned: s.ecoPointsEarned,
        })),
        dining: journey.dining.map(d => ({
          restaurantName: d.restaurantName,
          amount: d.amount,
          isPlantBased: d.isPlantBased,
          emissionsReduced: d.emissionsReduced,
          ecoPointsEarned: d.ecoPointsEarned,
        })),
        circularity: journey.circularity.map(c => ({
          actionName: c.actionName,
          wasteDiverted: c.wasteDiverted,
          ecoPointsEarned: c.ecoPointsEarned,
        })),
        totalEcoPointsEarned: totalEcoPoints,
        totalEmissions,
        netEmissions,
        totalWasteDiverted,
      };

      const greenTierContext = {
        currentTier: {
          id: tierInfo.id,
          name: tierInfo.name,
          level: tierInfo.level || 1,
          points_multiplier: tierMultiplier,
        },
        totalEcoPoints: tierPoints,
        lifetimeEcoPoints,
        pointsToNextTier: progress.pointsToNextTier,
        progressPercent: progress.progressPercent,
      };

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          journeyContext,
          greenTierContext,
          chatHistory: chatHistory.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data: ChatResponse = await response.json();

      if (data.success && data.reply) {
        // Add assistant message to history
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
        };

        setChatHistory(prev => [...prev, assistantMessage].slice(-MAX_HISTORY_LENGTH));
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Send message error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [journey, totalEmissions, netEmissions, totalEcoPoints, totalWasteDiverted, tierInfo, tierPoints, lifetimeEcoPoints, tierMultiplier, progress, chatHistory]);

  const clearHistory = useCallback(() => {
    setChatHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    chatHistory,
    sendMessage,
    clearHistory,
    isLoading,
    error,
  };
}

