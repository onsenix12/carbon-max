'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import routesData from '@/data/routes.json';

interface Route {
  id: string;
  origin: string;
  destination: string;
  destination_city: string;
  destination_country: string;
  saf_availability: {
    available: boolean;
    provider: string | null;
    blend_percentage: number;
  };
}

interface RouteSAFData {
  routeId: string;
  flights: number;
  safContributions: number; // liters
  coverage: number; // percentage
}

type SortField = 'coverage' | 'flights' | 'safContributions';
type SortDirection = 'asc' | 'desc';

interface SAFByRouteTableProps {
  routes: RouteSAFData[];
}

export default function SAFByRouteTable({ routes }: SAFByRouteTableProps) {
  const [sortField, setSortField] = useState<SortField>('coverage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Merge route data with SAF data
  const enrichedRoutes = routes
    .map((route) => {
      const routeInfo = routesData.routes.find((r) => r.id === route.routeId) as Route | undefined;
      return {
        ...route,
        routeInfo,
      };
    })
    .filter((r) => r.routeInfo) // Only show routes we have data for
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'coverage') {
        comparison = a.coverage - b.coverage;
      } else if (sortField === 'flights') {
        comparison = a.flights - b.flights;
      } else if (sortField === 'safContributions') {
        comparison = a.safContributions - b.safContributions;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-changi-navy transition-colors"
      >
        {children}
        {isActive ? (
          sortDirection === 'asc' ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-50" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-changi-navy">SAF by Route</h3>
        <p className="text-xs text-changi-gray">
          {enrichedRoutes.filter((r) => r.coverage === 0).length} routes with 0% coverage
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-changi-gray/20">
              <th className="text-left py-3 px-4 text-sm font-semibold text-changi-gray">Route</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-changi-gray">
                <SortButton field="flights">Flights</SortButton>
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-changi-gray">
                <SortButton field="safContributions">SAF Contributions</SortButton>
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-changi-gray">
                <SortButton field="coverage">Coverage %</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {enrichedRoutes.map((route, index) => {
              const isZeroCoverage = route.coverage === 0;
              return (
                <tr
                  key={route.routeId}
                  className={`
                    border-b border-changi-gray/10 transition-colors
                    ${isZeroCoverage ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-changi-cream'}
                  `}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {isZeroCoverage && (
                        <AlertCircle className="w-4 h-4 text-changi-red flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-changi-navy">
                          {route.routeInfo?.origin} → {route.routeInfo?.destination}
                        </p>
                        <p className="text-xs text-changi-gray">
                          {route.routeInfo?.destination_city}, {route.routeInfo?.destination_country}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <p className="font-semibold text-changi-navy">
                      {route.flights.toLocaleString()}
                    </p>
                  </td>
                  <td className="text-right py-3 px-4">
                    <p className="font-semibold text-changi-navy">
                      {route.safContributions.toLocaleString()} L
                    </p>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 bg-changi-cream rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            isZeroCoverage ? 'bg-changi-red' : 'bg-carbon-leaf'
                          }`}
                          style={{ width: `${Math.min(route.coverage, 100)}%` }}
                        />
                      </div>
                      <p
                        className={`text-sm font-semibold min-w-[3rem] text-right ${
                          isZeroCoverage ? 'text-changi-red' : 'text-changi-navy'
                        }`}
                      >
                        {route.coverage.toFixed(1)}%
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
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

