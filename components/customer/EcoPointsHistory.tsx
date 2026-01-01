'use client';

import { useState, useEffect } from 'react';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { Filter, TrendingUp, Plane, Recycle, ShoppingBag, Utensils, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CategoryFilter = 'all' | 'saf_contribution' | 'circularity_action' | 'transport' | 'shopping' | 'dining';

interface PointsEntry {
  id: string;
  actionType: string;
  points: number;
  timestamp: string;
  description: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  saf_contribution: <Plane className="w-4 h-4" />,
  circularity_action: <Recycle className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  dining: <Utensils className="w-4 h-4" />,
};

const categoryLabels: Record<string, string> = {
  all: 'All Actions',
  saf_contribution: 'SAF Contribution',
  circularity_action: 'Circularity',
  transport: 'Transport',
  shopping: 'Shopping',
  dining: 'Dining',
};

export default function EcoPointsHistory() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [history, setHistory] = useState<PointsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningTotal, setRunningTotal] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || 'demo-user';
      const response = await fetch('/api/eco-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'history',
          userId,
          limit: 50,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.history) {
          setHistory(data.history);
          // Calculate running total
          const total = data.history.reduce((sum: number, entry: PointsEntry) => sum + entry.points, 0);
          setRunningTotal(total);
        }
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = categoryFilter === 'all'
    ? history
    : history.filter(entry => entry.actionType === categoryFilter);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-navy/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-changi-navy mb-1">Points History</h3>
          <p className="text-sm text-changi-gray">Track your Eco-Points earnings</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-carbon-leaf">{runningTotal.toLocaleString()}</div>
          <div className="text-xs text-changi-gray">Total Earned</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-4 h-4 text-changi-gray" />
        {(['all', 'saf_contribution', 'circularity_action', 'transport', 'shopping', 'dining'] as CategoryFilter[]).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-carbon-leaf text-white'
                : 'bg-changi-cream text-changi-gray hover:bg-carbon-lime/20'
            }`}
          >
            {categoryIcons[cat] && <span className="mr-2 inline-block">{categoryIcons[cat]}</span>}
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-changi-gray">Loading...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-changi-gray">
            <p>No points history yet.</p>
            <p className="text-sm mt-2">Start earning points by taking sustainable actions!</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredHistory.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-changi-cream rounded-lg hover:bg-carbon-lime/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-carbon-leaf/10 p-2 rounded-lg">
                    {categoryIcons[entry.actionType] || <TrendingUp className="w-4 h-4 text-carbon-leaf" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-changi-navy">{entry.description}</p>
                    <p className="text-xs text-changi-gray">{formatDate(entry.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-carbon-leaf">+{entry.points}</div>
                  <div className="text-xs text-changi-gray">points</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

