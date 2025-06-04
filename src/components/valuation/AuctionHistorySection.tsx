// src/components/valuation/AuctionHistorySection.tsx

import React, { useEffect, useState } from 'react';
import { AuctionHistoryViewer, AuctionData } from './AuctionHistoryViewer';

export const AuctionHistorySection = ({ vin }: { vin: string }) => {
  const [data, setData] = useState<AuctionData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/auction-results?vin=${vin}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.result);
        }
      } catch (err) {
        console.error('Auction fetch failed', err);
      }
    };

    fetchData();
  }, [vin]);

  return data ? <AuctionHistoryViewer data={data} /> : null;
};
