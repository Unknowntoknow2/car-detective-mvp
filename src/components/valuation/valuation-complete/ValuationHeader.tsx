
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, DollarSign, Gauge, CalendarDays } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ValuationHeaderProps {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  estimatedValue: number;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export function ValuationHeader({
  make,
  model,
  year,
  mileage,
  condition,
  estimatedValue,
  isPremium = false,
  additionalInfo = {}
}: ValuationHeaderProps) {
  return (
    <Card className={`overflow-hidden transition-all ${isPremium ? 'border-primary/30 bg-primary/5' : ''}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              {year} {make} {model}
            </h1>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {mileage && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
                  <Gauge className="h-3 w-3" />
                  {mileage.toLocaleString()} miles
                </Badge>
              )}
              
              {condition && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
                  <CalendarDays className="h-3 w-3" />
                  {condition} Condition
                </Badge>
              )}
              
              {Object.entries(additionalInfo).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs px-2 py-1">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Estimated Value
            </div>
            <div className="text-2xl md:text-3xl font-bold text-primary flex items-center">
              <DollarSign className="h-5 w-5" />
              {formatCurrency(estimatedValue)}
            </div>
            
            {isPremium && (
              <Badge className="mt-2 bg-primary/20 hover:bg-primary/30 text-primary border-primary/20">
                Premium Valuation
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
