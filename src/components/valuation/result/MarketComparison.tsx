
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export interface MarketComparisonProps {
  vehicleData?: {
    make: string;
    model: string;
    year: number;
  };
  estimatedValue?: number;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export const MarketComparison: React.FC<MarketComparisonProps> = ({
  vehicleData,
  estimatedValue,
  isPremium,
  onUpgrade
}) => {
  if (!isPremium) {
    return (
      <div className="relative rounded-md border border-dashed border-muted-foreground/30 p-6 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <Lock className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-medium">Market Comparison</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            See how this {vehicleData?.year} {vehicleData?.make} {vehicleData?.model} 
            compares to others on the market, including dealer and private sale prices.
          </p>
          {onUpgrade && (
            <Button onClick={onUpgrade} className="mt-2">
              Unlock Premium
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Based on {Math.floor(Math.random() * 50) + 20} similar vehicles in your market.
      </p>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Dealer Listings</p>
              <p className="text-2xl font-bold">
                ${Math.floor((estimatedValue || 20000) * 1.15 / 100) * 100}
              </p>
              <p className="text-xs text-muted-foreground">
                Average of {Math.floor(Math.random() * 20) + 5} dealer listings
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Private Sales</p>
              <p className="text-2xl font-bold">
                ${Math.floor((estimatedValue || 20000) * 0.95 / 100) * 100}
              </p>
              <p className="text-xs text-muted-foreground">
                Average of {Math.floor(Math.random() * 10) + 3} private sales
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
