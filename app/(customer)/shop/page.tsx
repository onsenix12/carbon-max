'use client';

import { useState } from 'react';
import GreenShopList from '@/components/customer/GreenShopList';
import CircularityActions from '@/components/customer/CircularityActions';
import ProductAdvisor from '@/components/customer/ProductAdvisor';

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<'shops' | 'actions'>('shops');

  return (
    <div className="min-h-screen bg-changi-cream">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-changi-navy mb-2">Green Shopping & Circularity</h1>
          <p className="text-changi-gray">
            Discover sustainable merchants and take circularity actions to reduce waste and earn Eco-Points
          </p>
        </div>

        {/* Product Advisor - Always visible */}
        <div className="mb-6">
          <ProductAdvisor />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-changi-navy/10">
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'shops'
                ? 'text-changi-purple border-b-2 border-changi-purple'
                : 'text-changi-gray hover:text-changi-navy'
            }`}
          >
            Green Shops
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'actions'
                ? 'text-changi-purple border-b-2 border-changi-purple'
                : 'text-changi-gray hover:text-changi-navy'
            }`}
          >
            Eco Actions
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'shops' && <GreenShopList />}
          {activeTab === 'actions' && <CircularityActions />}
        </div>
      </div>
    </div>
  );
}
