
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface SeasonalFactorDisplayProps {
  saleDate: Date | string;
  bodyStyle: string;
  multiplier: number;
}

export function SeasonalFactorDisplay({ 
  saleDate, 
  bodyStyle,
  multiplier 
}: SeasonalFactorDisplayProps) {
  const date = typeof saleDate === 'string' ? new Date(saleDate) : saleDate;
  const month = format(date, 'MMMM');
  const formattedDate = format(date, 'PP');
  const percentChange = ((multiplier - 1) * 100).toFixed(1);
  const isPositive = multiplier > 1;
  
  // Get appropriate icon
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Seasonal Market Factor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="text-sm font-medium">Sale Date</div>
            <div className="text-sm">{formattedDate}</div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-sm font-medium">Body Style</div>
            <div className="text-sm capitalize">{bodyStyle}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Market Impact</div>
            <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <Icon className="h-4 w-4 mr-1" />
              {isPositive ? '+' : ''}{percentChange}%
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>{month} is typically a {isPositive ? 'favorable' : 'less favorable'} time 
            to sell {bodyStyle.toLowerCase()} vehicles.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
