// src/components/valuation/AuctionHistorySection.tsx

import React, { useEffect, useState } from 'react';
import { AuctionHistoryViewer, AuctionData } from './AuctionHistoryViewer';

export const AuctionHistorySection = ({ vin }: { vin: string }) => {
  const [data, setData] = useState<AuctionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctionHistory = async () => {
      try {
        const response = await fetch('https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-bidcars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ vin }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch auction data (Status: ${response.status})`);
        }

        const result = await response.json();
        if (result?.success && result?.data) {
          setData(result.data);
        } else {
          throw new Error('No valid auction result returned.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Auction fetch error:', err);
      }
    };

    fetchAuctionHistory();
  }, [vin]);

  if (error) {
    return (
      <div className="text-sm text-red-600 mt-4">
        ⚠️ Could not load auction history: {error}
      </div>
    );
  }

  return data ? <AuctionHistoryViewer data={data} /> : null;
};
