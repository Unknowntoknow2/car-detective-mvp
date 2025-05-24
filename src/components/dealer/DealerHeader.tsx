
import React from 'react';

interface DealerHeaderProps {
  dealerName: string;
}

export const DealerHeader: React.FC<DealerHeaderProps> = ({ dealerName }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{dealerName} Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Manage your inventory, valuations, and offers
      </p>
    </div>
  );
};
