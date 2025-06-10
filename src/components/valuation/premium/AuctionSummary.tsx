
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuctionSummaryProps {
  data?: any[];
}

const AuctionSummary: React.FC<AuctionSummaryProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auction History</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {data.length} auction records found
        </p>
      </CardContent>
    </Card>
  );
};

export default AuctionSummary;
