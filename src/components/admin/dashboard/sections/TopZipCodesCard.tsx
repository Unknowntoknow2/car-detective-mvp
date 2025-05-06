
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LeaderboardRow } from '@/components/stats/LeaderboardRow';
import { MapPin } from 'lucide-react';

interface TopZipCodesCardProps {
  zipCodes: { zip: string; count: number }[];
  totalValuations: number;
}

export function TopZipCodesCard({ zipCodes, totalValuations }: TopZipCodesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>Top ZIP Codes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {zipCodes.map((item, index) => (
            <LeaderboardRow
              key={item.zip}
              rank={index + 1}
              title={item.zip}
              subtitle={`${item.count} valuations`}
              value={`${((item.count / totalValuations) * 100).toFixed(1)}%`}
              highlight={index === 0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
