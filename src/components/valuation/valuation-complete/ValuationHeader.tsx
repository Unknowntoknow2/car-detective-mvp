
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share, Save } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { Valuation } from '@/types/valuation-history';

interface ValuationHeaderProps {
  valuation: Valuation;
  onShare?: () => void;
  onDownload?: () => void;
  onSave?: () => void;
}

export function ValuationHeader({ 
  valuation, 
  onShare, 
  onDownload, 
  onSave 
}: ValuationHeaderProps) {
  return (
    <Card className="border-primary/10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {valuation.year} {valuation.make} {valuation.model}
              {valuation.trim && <span className="text-muted-foreground ml-1">{valuation.trim}</span>}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {valuation.mileage && (
                <span>{valuation.mileage.toLocaleString()} miles</span>
              )}
              {valuation.condition && (
                <Badge variant="outline">{valuation.condition}</Badge>
              )}
              {valuation.zipCode && (
                <span>ZIP: {valuation.zipCode}</span>
              )}
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-sm text-muted-foreground mb-1">Estimated Value</div>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(valuation.estimatedValue || 0)}
            </div>
            
            <div className="flex gap-2 mt-4 justify-center md:justify-end">
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              )}
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              )}
              {onSave && (
                <Button variant="default" size="sm" onClick={onSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
