
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, FileText, Download, Share2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useValuation } from '@/contexts/ValuationContext';
import { toast } from 'sonner';

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
}

interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

interface UnifiedValuationResultProps {
  valuationId: string;
  vehicleInfo: VehicleInfo;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: Adjustment[];
  displayMode?: 'compact' | 'full';
  onDownloadPdf?: () => Promise<void> | void;
  onEmailReport?: () => Promise<void> | void;
}

const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  valuationId,
  vehicleInfo,
  estimatedValue,
  confidenceScore,
  priceRange = [0, 0],
  adjustments = [],
  displayMode = 'full',
  onDownloadPdf,
  onEmailReport
}) => {
  const { isPremium, hasPurchasedReport, downloadPdf } = useValuation();
  
  const { make, model, year, mileage, condition } = vehicleInfo;
  
  // Default price range if not provided
  const [minPrice, maxPrice] = priceRange[0] === 0 ? 
    [Math.round(estimatedValue * 0.9), Math.round(estimatedValue * 1.1)] : 
    priceRange;
  
  const handleDownloadPdf = async () => {
    if (onDownloadPdf) {
      return onDownloadPdf();
    }
    
    if (!isPremium && !hasPurchasedReport) {
      toast.info('Premium access required to download the PDF report.');
      return;
    }
    
    try {
      await downloadPdf();
      toast.success('PDF report downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download the PDF report');
    }
  };
  
  const handleShareClick = () => {
    // Copy valuation link to clipboard
    const shareUrl = `${window.location.origin}/valuation-result?id=${valuationId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success('Valuation link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link to clipboard'));
  };
  
  const handleEmailPdf = async () => {
    if (onEmailReport) {
      return onEmailReport();
    }
    
    // Default email functionality if no handler provided
    toast.info('Email functionality not configured.');
  };
  
  // Calculate confidence level text and color
  const confidenceLevelText = 
    confidenceScore >= 90 ? 'Very High' :
    confidenceScore >= 80 ? 'High' :
    confidenceScore >= 70 ? 'Good' :
    confidenceScore >= 60 ? 'Moderate' : 'Low';
  
  const confidenceColor = 
    confidenceScore >= 90 ? 'bg-green-100 text-green-800' :
    confidenceScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
    confidenceScore >= 70 ? 'bg-blue-100 text-blue-800' :
    confidenceScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';
  
  return (
    <div className="space-y-8">
      {/* Vehicle Details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-primary/10 p-2 rounded-full">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl">
              {year} {make} {model}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline">{condition} Condition</Badge>
              <Badge variant="outline">{mileage.toLocaleString()} miles</Badge>
            </div>
          </div>
        </div>
        
        {displayMode === 'full' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShareClick}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-2" />
              PDF Report
            </Button>
          </div>
        )}
      </div>
      
      {/* Valuation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Estimated Value</p>
              <h2 className="text-4xl font-bold text-primary">
                {formatCurrency(estimatedValue)}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Retail Price Range: {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Confidence Score</p>
              <div className={`inline-block px-2 py-1 rounded ${confidenceColor}`}>
                <span className="font-semibold">{confidenceScore}% - {confidenceLevelText}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Price Adjustments */}
      {displayMode === 'full' && adjustments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Price Adjustments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adjustments.map((adjustment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{adjustment.factor}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {adjustment.impact >= 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{adjustment.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Premium Features Teaser */}
      {displayMode === 'full' && !isPremium && !hasPurchasedReport && (
        <Card className="mt-8 bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Unlock Premium Valuation Report
                </h3>
                <p className="text-amber-700 mb-4">
                  Get detailed market analysis, comparative sales data, and a comprehensive PDF report to help negotiate the best deal.
                </p>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedValuationResult;
