
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Valuation } from '@/types/valuation-history';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface PremiumFeaturesProps {
  valuation: Valuation;
}

export function PremiumFeatures({ valuation }: PremiumFeaturesProps) {
  // Define premium features based on valuation data
  const features = [
    {
      name: 'CARFAX Report',
      available: valuation.premium_unlocked || valuation.is_premium || false,
      description: 'Full vehicle history and records'
    },
    {
      name: 'Market Analysis',
      available: valuation.premium_unlocked || valuation.is_premium || false,
      description: 'Local market data and price comparisons'
    },
    {
      name: 'Confidence Score',
      available: true,
      value: valuation.confidenceScore || valuation.confidence_score || 75,
      description: 'Accuracy of the valuation based on available data'
    },
    {
      name: 'Feature Adjustments',
      available: valuation.premium_unlocked || valuation.is_premium || false,
      description: 'Individual value of each feature and option'
    },
    {
      name: 'Similar Listings',
      available: valuation.premium_unlocked || valuation.is_premium || false,
      description: 'Comparable vehicles currently on the market'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Premium Features
          <Badge variant="outline" className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="p-4 border rounded-md bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{feature.name}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{feature.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {feature.value !== undefined && (
                <div className="text-lg font-bold">{feature.value}%</div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                {feature.available ? (
                  <span className="text-green-600">Included</span>
                ) : (
                  <span className="text-amber-600">Upgrade to access</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
