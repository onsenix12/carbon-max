'use client';

import { GreenTierProvider } from '@/context/GreenTierContext';
import { JourneyProvider } from '@/context/JourneyContext';
import ChangiAppShell from '@/components/customer/ChangiAppShell';
import DemoOverlay from '@/components/shared/DemoOverlay';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GreenTierProvider>
      <JourneyProvider>
        <ChangiAppShell>
          {children}
          <DemoOverlay />
        </ChangiAppShell>
      </JourneyProvider>
    </GreenTierProvider>
  );
}

