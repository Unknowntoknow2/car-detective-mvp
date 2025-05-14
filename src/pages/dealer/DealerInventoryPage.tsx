
import React from 'react';
import DealerGuard from '@/guards/DealerGuard';
import { DealerInventory } from '@/components/dealer/DealerInventory';

const DealerInventoryPage = () => {
  return (
    <div className="container py-12">
      <DealerInventory />
    </div>
  );
};

export default function ProtectedDealerInventoryPage() {
  return (
    <DealerGuard>
      <DealerInventoryPage />
    </DealerGuard>
  );
}
