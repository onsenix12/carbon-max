'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Calculator, ShoppingBag, Gift, MessageCircle, User } from 'lucide-react';
import { useGreenTier } from '@/context/GreenTierContext';
import GreenTierStatus from './GreenTierStatus';

interface ChangiAppShellProps {
  children: React.ReactNode;
}

const tierHeaderColors: Record<string, string> = {
  seedling: 'bg-carbon-lime',
  sapling: 'bg-carbon-mint',
  tree: 'bg-carbon-sage',
  forest: 'bg-carbon-leaf',
  guardian: 'bg-carbon-forest',
};

export default function ChangiAppShell({ children }: ChangiAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentTier, totalPoints } = useGreenTier();

  const headerBg = tierHeaderColors[currentTier.id] || tierHeaderColors.seedling;

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Calculator, label: 'Calculator', path: '/calculator' },
    { icon: ShoppingBag, label: 'Shop', path: '/shop' },
    { icon: Gift, label: 'Rewards', path: '/rewards' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/home') {
      return pathname === '/home';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-changi-cream">
      {/* Mobile Container */}
      <div className="mx-auto max-w-[430px] bg-white shadow-2xl min-h-screen flex flex-col">
        {/* Header */}
        <header className={`${headerBg} text-white px-4 pt-12 pb-4 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">C</span>
              </div>
              <span className="font-bold text-lg">Changi</span>
            </div>

            {/* User Avatar with Tier Badge */}
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <User className="w-6 h-6" />
              </div>
              {/* Tier Badge Overlay */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <span className="text-xs">
                  {currentTier.social_signaling.badge_icon}
                </span>
              </div>
            </div>
          </div>

          {/* Eco-Points Balance */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90">Eco-Points</p>
                <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-90">{currentTier.name}</p>
                <p className="text-sm font-semibold">{currentTier.points_multiplier}x multiplier</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-changi-gray/20 shadow-lg">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'text-carbon-leaf'
                      : 'text-changi-gray hover:text-changi-navy'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${active ? 'stroke-2' : ''}`} />
                  <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute bottom-0 w-12 h-1 bg-carbon-leaf rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

