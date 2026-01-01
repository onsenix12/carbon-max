'use client';

import { useState, useMemo } from 'react';
import GreenShopCard from './GreenShopCard';
import merchantsData from '@/data/merchants.json';
import { Filter, SortAsc } from 'lucide-react';

type SortOption = 'rating' | 'eco-points' | 'carbon-score';
type CategoryFilter = string | 'all';
type TerminalFilter = string | 'all';
type CarbonScoreFilter = string | 'all';

interface Merchant {
  id: string;
  name: string;
  category: string;
  terminal: string[];
  carbon_score: number;
  carbon_score_max: number;
  sustainability_initiatives: string[];
  eco_points_multiplier: number;
}

export default function GreenShopList() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [terminalFilter, setTerminalFilter] = useState<TerminalFilter>('all');
  const [carbonScoreFilter, setCarbonScoreFilter] = useState<CarbonScoreFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('carbon-score');

  const merchants = merchantsData.merchants as Merchant[];

  // Get unique categories and terminals
  const categories = useMemo(() => {
    const cats = new Set(merchants.map(m => m.category));
    return Array.from(cats);
  }, [merchants]);

  const terminals = useMemo(() => {
    const terms = new Set(merchants.flatMap(m => m.terminal));
    return Array.from(terms).sort();
  }, [merchants]);

  // Filter and sort merchants
  const filteredAndSorted = useMemo(() => {
    let filtered = merchants.filter(merchant => {
      // Category filter
      if (categoryFilter !== 'all' && merchant.category !== categoryFilter) {
        return false;
      }

      // Terminal filter
      if (terminalFilter !== 'all' && !merchant.terminal.includes(terminalFilter)) {
        return false;
      }

      // Carbon score filter
      if (carbonScoreFilter !== 'all') {
        const score = merchant.carbon_score;
        if (carbonScoreFilter === 'A' && score < 9) return false;
        if (carbonScoreFilter === 'B' && (score < 7 || score >= 9)) return false;
        if (carbonScoreFilter === 'C' && (score < 5 || score >= 7)) return false;
        if (carbonScoreFilter === 'D' && (score < 3 || score >= 5)) return false;
        if (carbonScoreFilter === 'E' && score >= 3) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'carbon-score':
          return b.carbon_score - a.carbon_score;
        case 'eco-points':
          return b.eco_points_multiplier - a.eco_points_multiplier;
        case 'rating':
          // For rating, we'll use carbon score as proxy (higher = better rating)
          return b.carbon_score - a.carbon_score;
        default:
          return 0;
      }
    });

    return filtered;
  }, [merchants, categoryFilter, terminalFilter, carbonScoreFilter, sortBy]);

  // Get carbon score letter (A-E)
  const getCarbonScoreLetter = (score: number): string => {
    if (score >= 9) return 'A';
    if (score >= 7) return 'B';
    if (score >= 5) return 'C';
    if (score >= 3) return 'D';
    return 'E';
  };

  // Green Picks (top 3 by carbon score)
  const greenPicks = useMemo(() => {
    return merchants
      .sort((a, b) => b.carbon_score - a.carbon_score)
      .slice(0, 3);
  }, [merchants]);

  return (
    <div className="space-y-6">
      {/* Green Picks Section */}
      <div>
        <h2 className="text-xl font-bold text-changi-navy mb-4 flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          Green Picks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {greenPicks.map(merchant => (
            <GreenShopCard key={merchant.id} merchant={merchant} featured />
          ))}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-changi-navy/10">
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-changi-gray" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="px-3 py-2 border border-changi-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-changi-purple"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Terminal Filter */}
          <select
            value={terminalFilter}
            onChange={(e) => setTerminalFilter(e.target.value as TerminalFilter)}
            className="px-3 py-2 border border-changi-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-changi-purple"
          >
            <option value="all">All Terminals</option>
            {terminals.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>

          {/* Carbon Score Filter */}
          <select
            value={carbonScoreFilter}
            onChange={(e) => setCarbonScoreFilter(e.target.value as CarbonScoreFilter)}
            className="px-3 py-2 border border-changi-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-changi-purple"
          >
            <option value="all">All Carbon Scores</option>
            <option value="A">A (9-10)</option>
            <option value="B">B (7-8)</option>
            <option value="C">C (5-6)</option>
            <option value="D">D (3-4)</option>
            <option value="E">E (1-2)</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <SortAsc className="w-4 h-4 text-changi-gray" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-changi-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-changi-purple"
            >
              <option value="carbon-score">Sort by Carbon Score</option>
              <option value="eco-points">Sort by Eco-Points Multiplier</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-changi-gray">
        Showing {filteredAndSorted.length} of {merchants.length} merchants
      </div>

      {/* Merchant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSorted.map(merchant => (
          <GreenShopCard key={merchant.id} merchant={merchant} />
        ))}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-12 text-changi-gray">
          <p className="text-lg">No merchants found matching your filters.</p>
          <p className="text-sm mt-2">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
}

