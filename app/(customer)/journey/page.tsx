'use client';

import JourneySummary from '@/components/customer/JourneySummary';

export default function JourneyPage() {
  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-changi-navy">My Journey</h1>
      <JourneySummary />
    </div>
  );
}

