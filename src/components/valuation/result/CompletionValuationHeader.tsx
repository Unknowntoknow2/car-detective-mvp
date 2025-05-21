
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { PremiumBadge } from '@/components/dashboard/PremiumBadge';

export interface CompletionValuationHeaderProps {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  estimatedValue: number;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export function CompletionValuationHeader({
  make,
  model,
  year,
  mileage,
  condition,
  estimatedValue,
  isPremium = false,
  additionalInfo = {}
}: CompletionValuationHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-2xl font-bold">{year} {make} {model}</h1>
              {isPremium && <PremiumBadge small />}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {mileage && (
                <Badge variant="outline" className="text-xs">
                  {new Intl.NumberFormat().format(mileage)} miles
                </Badge>
              )}
              
              {condition && (
                <Badge variant="outline" className="text-xs">
                  {condition} condition
                </Badge>
              )}
              
              {Object.entries(additionalInfo).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs capitalize">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm text-muted-foreground uppercase font-medium">
              Estimated Value
            </p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(estimatedValue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
