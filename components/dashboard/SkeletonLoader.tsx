'use client';

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20 animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="h-4 bg-changi-gray/20 rounded w-32" />
        <div className="h-4 w-4 bg-changi-gray/20 rounded" />
      </div>
      <div className="mb-2">
        <div className="h-9 bg-changi-gray/20 rounded w-24" />
      </div>
      <div className="h-3 bg-changi-gray/20 rounded w-40" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20 animate-pulse">
      <div className="mb-6">
        <div className="h-6 bg-changi-gray/20 rounded w-48 mb-2" />
        <div className="h-4 bg-changi-gray/20 rounded w-64" />
      </div>
      <div className="h-[350px] bg-changi-gray/10 rounded" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20 animate-pulse">
      <div className="mb-4">
        <div className="h-6 bg-changi-gray/20 rounded w-48 mb-2" />
        <div className="h-4 bg-changi-gray/20 rounded w-64" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-12 bg-changi-gray/20 rounded flex-1" />
            <div className="h-12 bg-changi-gray/20 rounded w-32" />
            <div className="h-12 bg-changi-gray/20 rounded w-32" />
            <div className="h-12 bg-changi-gray/20 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SAFProgressSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-changi-gray/20 rounded w-48 mb-2" />
          <div className="h-4 bg-changi-gray/20 rounded w-64" />
        </div>
        <div className="h-8 bg-changi-gray/20 rounded w-24" />
      </div>
      <div className="mb-4">
        <div className="h-9 bg-changi-gray/20 rounded w-32 mb-2" />
        <div className="h-4 bg-changi-gray/20 rounded w-48" />
      </div>
      <div className="w-full bg-changi-cream rounded-full h-4 mb-2" />
      <div className="flex justify-between">
        <div className="h-3 bg-changi-gray/20 rounded w-12" />
        <div className="h-3 bg-changi-gray/20 rounded w-24" />
      </div>
    </div>
  );
}

