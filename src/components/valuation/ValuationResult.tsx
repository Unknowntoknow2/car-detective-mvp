import React from 'react';
import { ValuationResponse } from '@/types/vehicle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { ValuationSummary } from './result/ValuationSummary';
import { PriceRangeChart } from './result/PriceRangeChart';
import { MarketComparison } from './result/MarketComparison';
import { PremiumFeatures } from './result/PremiumFeatures';
import { ValuationScoreBar } from './ValuationScoreBar';

export interface ValuationResultProps {
  valuationId?: string;
  data: ValuationResponse & { isPremium?: boolean };
  isPremium: boolean;
  onUpgrade?: () => void;
}

const ValuationResult: React.FC<ValuationResultProps> = ({ 
  valuationId, 
  data, 
  isPremium,
  onUpgrade 
}) => {
  const handleEmailReport = () => {
    // Implementation for emailing the report
    console.log('Email report for valuation:', valuationId);
  };

  const handleDownloadPdf = () => {
    // Implementation for downloading the PDF
    console.log('Download PDF for valuation:', valuationId);
  };

  const estimatedValue = data.estimatedValue || data.estimated_value || 0;
  const confidenceScore = data.confidenceScore || data.confidence_score || 85;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Valuation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ValuationSummary
            estimatedValue={estimatedValue}
            confidenceScore={confidenceScore}
            vehicleInfo={{
              year: data.year,
              make: data.make,
              model: data.model,
              mileage: data.mileage || 0,
              condition: data.condition || 'Good'
            }}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleDownloadPdf}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleEmailReport}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceRangeChart 
            estimatedValue={estimatedValue}
            priceRange={data.price_range || {
              low: estimatedValue * 0.9,
              high: estimatedValue * 1.1
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Market Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <MarketComparison 
            make={data.make}
            model={data.model}
            year={data.year}
            estimatedValue={estimatedValue}
            isPremium={isPremium}
          />
        </CardContent>
      </Card>

      {!isPremium && onUpgrade && (
        <Card className="bg-primary-50 border-primary/30">
          <CardContent className="pt-6">
            <PremiumFeatures onUpgrade={onUpgrade} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ValuationResult;
