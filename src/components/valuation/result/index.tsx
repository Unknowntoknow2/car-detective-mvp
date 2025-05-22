
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PDFActions } from './sections/PDFActions';
import { Separator } from '@/components/ui/separator';

interface ValuationResultProps {
  valuationId?: string;
  data: any;
  isPremium: boolean;
  onUpgrade: () => void;
  onDownloadPdf?: () => void;
  onEmailPdf?: () => void;
  isGeneratingPdf?: boolean;
  isEmailingSending?: boolean;
}

export const ValuationResult: React.FC<ValuationResultProps> = ({
  valuationId,
  data,
  isPremium,
  onUpgrade,
  onDownloadPdf,
  onEmailPdf,
  isGeneratingPdf = false,
  isEmailingSending = false
}) => {
  if (!data) {
    return <div>No valuation data available</div>;
  }
  
  const handleDownloadPdf = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    }
  };
  
  const handleEmailPdf = () => {
    if (onEmailPdf) {
      onEmailPdf();
    }
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Info */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold">
            {data.year} {data.make} {data.model}
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.mileage ? `${data.mileage.toLocaleString()} miles` : 'Mileage not provided'} • 
            {data.condition || 'Condition not specified'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
              <p className="text-3xl font-bold text-primary">
                ${data.estimatedValue ? data.estimatedValue.toLocaleString() : 'N/A'}
              </p>
              
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Price Range</p>
                <p className="font-medium">
                  ${data.priceRange?.[0]?.toLocaleString()} - ${data.priceRange?.[1]?.toLocaleString()}
                </p>
              </div>
              
              {data.confidenceScore && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Confidence Score</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${data.confidenceScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{data.confidenceScore}%</span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {data.adjustments && data.adjustments.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Value Adjustments</p>
                  <ul className="space-y-2">
                    {data.adjustments.map((adj: any, index: number) => (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <span>{adj.factor}</span>
                        <span className={adj.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {adj.impact > 0 ? '+' : ''}{adj.impact.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* PDF Actions */}
      {valuationId && (
        <PDFActions 
          isPremium={isPremium}
          onDownloadPdf={handleDownloadPdf}
          onEmailPdf={handleEmailPdf}
          onUpgrade={onUpgrade}
          isDownloading={isGeneratingPdf}
          isEmailSending={isEmailingSending}
        />
      )}
    </div>
  );
};
