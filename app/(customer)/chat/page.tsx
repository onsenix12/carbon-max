'use client';

import AskMaxChat from '@/components/customer/AskMaxChat';

export default function ChatPage() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-changi-navy mb-6">Ask Max</h1>
      <AskMaxChat />
    </div>
  );
}

