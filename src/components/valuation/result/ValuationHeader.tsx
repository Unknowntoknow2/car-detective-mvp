
import React from 'react';
import PhotoView from './PhotoView';
import { Share, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface ValuationHeaderProps {
  year: number;
  make: string;
  model: string;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
}

export function ValuationHeader({
  year,
  make,
  model,
  mileage,
  condition,
  location,
  valuation,
  bestPhotoUrl,
  photoScore,
  photoExplanation
}: ValuationHeaderProps) {
  const formatMileage = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        {year} {make} {model}
        <Badge variant="outline" className="ml-2">{condition}</Badge>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Valuation Details</h2>
            <p className="text-muted-foreground text-sm">Based on market data and condition analysis</p>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Estimated Value</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(valuation)}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Mileage:</p>
              <p className="font-medium">{formatMileage(mileage)} miles</p>
            </div>
            <div>
              <p className="text-muted-foreground">Location:</p>
              <p className="font-medium">{location}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Year:</p>
              <p className="font-medium">{year}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Condition:</p>
              <p className="font-medium">{condition}</p>
            </div>
          </div>
        </Card>
        
        {bestPhotoUrl ? (
          <PhotoView 
            photoUrl={bestPhotoUrl}
            photoScore={photoScore}
            explanation={photoExplanation}
          />
        ) : (
          <Card className="flex items-center justify-center p-6 bg-muted/30">
            <div className="text-center">
              <p className="text-muted-foreground">No photos available</p>
              <p className="text-xs text-muted-foreground mt-2">
                Upload photos for AI condition assessment
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
