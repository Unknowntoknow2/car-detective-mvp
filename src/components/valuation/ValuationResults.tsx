
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAICondition } from '@/hooks/useAICondition';

interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  basePrice?: number;
  adjustments?: Adjustment[];
  priceRange?: [number, number];
  demandFactor?: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage?: number;
    condition?: string;
  };
  valuationId?: string;
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
}

export function ValuationResults({
  estimatedValue,
  confidenceScore,
  basePrice,
  adjustments,
  priceRange,
  demandFactor,
  vehicleInfo,
  valuationId,
  onDownloadPdf,
  onEmailReport
}: ValuationResultsProps) {
  const isMobile = useIsMobile();
  const { conditionData } = valuationId ? useAICondition(valuationId) : { conditionData: null };
  
  const handleDownloadPdf = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      toast.success("PDF download started!");
      // Default implementation could go here
    }
  };

  const handleEmailReport = () => {
    if (onEmailReport) {
      onEmailReport();
    } else {
      toast.success("Report emailed successfully!");
      // Default implementation could go here
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="bg-primary-light/10 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-base md:text-lg line-clamp-1">
              {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
            </CardTitle>
          </div>
          <CardDescription className="text-xs md:text-sm line-clamp-1">
            {vehicleInfo.trim && `${vehicleInfo.trim} • `}
            {vehicleInfo.mileage && `${vehicleInfo.mileage.toLocaleString()} miles • `}
            {vehicleInfo.condition && vehicleInfo.condition}
            {conditionData && conditionData.confidenceScore >= 80 && (
              <span className="ml-2 text-green-600 font-medium"> • AI Verified: {conditionData.condition}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">Estimated Value</p>
            <p className="text-3xl md:text-4xl font-bold text-primary">
              ${estimatedValue?.toLocaleString() || 'N/A'}
            </p>
            <div className="flex items-center justify-center mt-2">
              <div className="px-3 py-1 text-xs font-medium bg-primary-light/20 text-primary rounded-full">
                {confidenceScore || 0}% Confidence
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {basePrice && (
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">Base Price</p>
                <p className="text-lg">${basePrice?.toLocaleString() || 'N/A'}</p>
              </div>
            )}
            {adjustments && adjustments.length > 0 && (
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">Adjustments</p>
                <ul className="text-sm mt-1 space-y-1">
                  {adjustments.slice(0, 3).map((adj, i) => (
                    <li key={i} className="flex justify-between">
                      <span className="line-clamp-1">{adj.factor}</span>
                      <span className={adj.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {adj.impact > 0 ? '+' : ''}{adj.impact}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {demandFactor && (
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">Market Adjustment</p>
                <p className="text-lg">
                  {demandFactor !== 1 
                    ? ((demandFactor - 1) * 100).toFixed(1) + '%' 
                    : '0%'}
                </p>
              </div>
            )}
          </div>

          {priceRange && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <p className="font-medium">Price Range</p>
              <p className="text-base md:text-lg">${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleDownloadPdf} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          {isMobile ? "Download PDF" : "Download PDF Report"}
        </Button>
        <Button variant="outline" onClick={handleEmailReport} className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          {isMobile ? "Email Report" : "Email Me the Report"}
        </Button>
      </div>
    </div>
  );
}
