
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Share, Download, Star } from 'lucide-react';

interface ValuationHeaderProps {
  vehicleName: string;
  vehicleSpecs?: string;
  estimatedValue: number;
  confidenceScore?: number;
}

export function ValuationHeader({
  vehicleName,
  vehicleSpecs,
  estimatedValue,
  confidenceScore
}: ValuationHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">{vehicleName}</h1>
          {vehicleSpecs && <p className="text-gray-600">{vehicleSpecs}</p>}
        </div>
        
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            ${estimatedValue.toLocaleString()}
          </div>
          {confidenceScore && (
            <div className="text-sm text-gray-500 mt-1">
              {confidenceScore}% confidence
            </div>
          )}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          <span>Save</span>
        </Button>
      </div>
    </div>
  );
}
