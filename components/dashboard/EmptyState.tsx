'use client';

import { Inbox, TrendingUp, Leaf, Recycle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: 'inbox' | 'trending' | 'leaf' | 'recycle';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, message, icon = 'inbox', action }: EmptyStateProps) {
  const icons = {
    inbox: Inbox,
    trending: TrendingUp,
    leaf: Leaf,
    recycle: Recycle,
  };

  const Icon = icons[icon];

  return (
    <div className="bg-white rounded-xl p-12 shadow-sm border border-changi-gray/20 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-changi-cream rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-changi-gray" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-changi-navy mb-2">{title}</h3>
      <p className="text-changi-gray mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-carbon-leaf text-white rounded-lg font-semibold hover:bg-carbon-forest transition-colors"
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

