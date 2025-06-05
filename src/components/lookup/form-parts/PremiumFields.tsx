
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface PremiumFieldsProps {
  className?: string;
}

export function PremiumFields({ className }: PremiumFieldsProps) {
  const premiumFeatures = [
    'Market Analysis',
    'Price Forecasting',
    'Detailed Vehicle History',
    'Professional Report PDF',
    'Advanced Comparables',
    'Accident History Details'
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Premium Features
          <Badge variant="secondary">Upgrade Required</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-3 w-3" />
              {feature}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
