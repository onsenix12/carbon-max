'use client';

import { CheckCircle2, XCircle, Info } from 'lucide-react';
import routesData from '@/data/routes.json';

interface Route {
  id: string;
  origin: string;
  destination: string;
  destination_city: string;
  destination_country: string;
  distance_km: number;
  saf_availability: {
    available: boolean;
    provider: string | null;
    blend_percentage: number;
    book_and_claim: boolean;
    notes: string;
  };
}

interface TopRoutesTableProps {
  routes: Array<{
    routeId: string;
    emissions: number;
    passengers: number;
    safLiters?: number;
  }>;
}

export default function TopRoutesTable({ routes }: TopRoutesTableProps) {
  // Merge route data with emissions data
  const enrichedRoutes = routes
    .map((route) => {
      const routeInfo = routesData.routes.find((r) => r.id === route.routeId) as Route | undefined;
      return {
        ...route,
        routeInfo,
      };
    })
    .filter((r) => r.routeInfo) // Only show routes we have data for
    .sort((a, b) => b.emissions - a.emissions) // Sort by emissions descending
    .slice(0, 10); // Top 10

  const getSAFBadge = (route: typeof enrichedRoutes[0]) => {
    if (!route.routeInfo?.saf_availability.available) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full">
          <XCircle className="w-3.5 h-3.5 text-changi-gray" />
          <span className="text-xs font-medium text-changi-gray">Not Available</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-carbon-lime/20 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5 text-carbon-leaf" />
        <span className="text-xs font-medium text-carbon-leaf">
          {route.routeInfo.saf_availability.blend_percentage}% SAF
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-changi-navy">Top Routes by Emissions</h3>
        <div className="flex items-center gap-1 text-xs text-changi-gray">
          <Info className="w-4 h-4" />
          <span>SAF availability shown</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-changi-gray/20">
              <th className="text-left py-3 px-4 text-sm font-semibold text-changi-gray">Route</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-changi-gray">Emissions</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-changi-gray">Passengers</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-changi-gray">SAF</th>
            </tr>
          </thead>
          <tbody>
            {enrichedRoutes.map((route, index) => (
              <tr
                key={route.routeId}
                className="border-b border-changi-gray/10 hover:bg-changi-cream transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-semibold text-changi-navy">
                      {route.routeInfo?.origin} → {route.routeInfo?.destination}
                    </p>
                    <p className="text-xs text-changi-gray">
                      {route.routeInfo?.destination_city}, {route.routeInfo?.destination_country}
                    </p>
                  </div>
                </td>
                <td className="text-right py-3 px-4">
                  <p className="font-semibold text-changi-navy">
                    {route.emissions.toFixed(1)} tCO₂e
                  </p>
                </td>
                <td className="text-right py-3 px-4">
                  <p className="text-sm text-changi-gray">
                    {route.passengers.toLocaleString()}
                  </p>
                </td>
                <td className="text-center py-3 px-4">
                  {getSAFBadge(route)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enrichedRoutes.length === 0 && (
        <div className="text-center py-8 text-changi-gray">
          No route data available
        </div>
      )}
    </div>
  );
}

