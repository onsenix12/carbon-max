'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Plane,
  Leaf,
  Recycle,
  Store,
  FileText,
  Menu,
  X,
  RefreshCw,
  Circle,
  User,
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  emoji?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', emoji: '📊' },
  { icon: Plane, label: 'Flight Emissions', path: '/dashboard/flights', emoji: '✈️' },
  { icon: Leaf, label: 'SAF Tracking', path: '/dashboard/saf', emoji: '🌿' },
  { icon: Recycle, label: 'Circularity', path: '/dashboard/circularity', emoji: '♻️' },
  { icon: Store, label: 'Merchant Performance', path: '/dashboard/merchants', emoji: '🏪' },
  { icon: FileText, label: 'Activity Log', path: '/dashboard/activity', emoji: '📋' },
];

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname.startsWith(path);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Trigger data refresh
    window.location.reload();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const currentDate = new Date().toLocaleDateString('en-SG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-changi-cream flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-changi-navy text-white
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
          shadow-xl lg:shadow-none
        `}
      >
        {/* Sidebar Header */}
        <div className={`p-6 border-b border-white/10 ${sidebarCollapsed ? 'p-4' : ''}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 bg-changi-purple rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">CAG</span>
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-bold text-lg truncate">Operations</h1>
                  <p className="text-xs text-white/70 truncate">Dashboard</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    group relative
                    ${sidebarCollapsed ? 'justify-center' : ''}
                    ${
                      active
                        ? 'bg-changi-purple text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      active ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <>
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="text-base">{item.emoji}</span>
                        {item.label}
                      </span>
                      {active && (
                        <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </>
                  )}
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-changi-navy text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10">
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-changi-navy" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-changi-purple rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-white/60 truncate">Sustainability Manager</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-changi-gray/20 shadow-sm sticky top-0 z-30">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-changi-navy hover:text-changi-purple transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Date and Live Indicator */}
              <div className="flex-1 flex items-center gap-4">
                <div className="hidden sm:block">
                  <p className="text-sm text-changi-gray">{currentDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-carbon-lime/20 rounded-full">
                    <Circle className="w-2 h-2 fill-carbon-leaf text-carbon-leaf animate-pulse" />
                    <span className="text-xs font-medium text-carbon-leaf">Live</span>
                  </div>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-changi-navy text-white rounded-lg hover:bg-changi-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="text-sm font-medium hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-changi-cream">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

