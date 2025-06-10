
import React from 'react';
import { LookupTabs as BaseLookupTabs } from '@/components/lookup/LookupTabs';

interface LookupTabsProps {
  defaultTab?: string;
}

export function LookupTabs({ defaultTab = "vin" }: LookupTabsProps) {
  return (
    <div className="w-full">
      <BaseLookupTabs />
    </div>
  );
}

export default LookupTabs;
