
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Download } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface UnifiedValuationHeaderProps {
  year: number;
  make: string;
  model: string;
  valuation: number;
  confidenceScore?: number;
  condition?: string;
  location?: string;
  mileage?: number;
  onDownloadPdf?: () => void;
  onShareReport?: () => void;
}

export function UnifiedValuationHeader({
  year,
  make,
  model,
  valuation,
  confidenceScore,
  condition,
  location,
  mileage,
  onDownloadPdf,
  onShareReport
}: UnifiedValuationHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">{year} {make} {model}</h1>
        
        <div className="flex space-x-2 mt-2 md:mt-0">
          {onShareReport && (
            <Button variant="outline" size="sm" onClick={onShareReport}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          
          {onDownloadPdf && (
            <Button variant="outline" size="sm" onClick={onDownloadPdf}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Estimated Value</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(valuation)}</p>
          {confidenceScore && (
            <p className="text-xs text-muted-foreground mt-1">
              {confidenceScore >= 80 ? 'High' : confidenceScore >= 60 ? 'Medium' : 'Low'} confidence
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {condition && (
            <div>
              <p className="text-muted-foreground">Condition</p>
              <p className="font-medium capitalize">{condition}</p>
            </div>
          )}
          
          {location && (
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{location}</p>
            </div>
          )}
          
          {mileage && (
            <div>
              <p className="text-muted-foreground">Mileage</p>
              <p className="font-medium">{mileage.toLocaleString()} miles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnifiedValuationHeader;
