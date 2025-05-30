
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { PremiumDownloadButton } from '@/components/premium/PremiumDownloadButton';
import { DealerOffersSection } from './DealerOffersSection';
import { DealerOfferCard } from '@/components/dealer/DealerOfferCard';
import { useAuth } from '@/contexts/AuthContext';

interface ValuationResultProps {
  valuationId?: string;
  data: {
    success: boolean;
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    condition?: string;
    estimatedValue: number;
    confidenceScore?: number;
    valuationId?: string;
    vin?: string;
    zipCode?: string;
    userId?: string;
  };
  isPremium: boolean;
}

export function ValuationResult({ valuationId, data, isPremium }: ValuationResultProps) {
  const { user } = useAuth();
  
  const actualValuationId = valuationId || data.valuationId;
  
  if (!data.success) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Valuation Failed</h3>
          <p className="text-gray-600">Unable to generate valuation for this vehicle.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Valuation Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Vehicle Valuation
              </h2>
              {data.make && data.model && (
                <p className="text-lg text-gray-600">
                  {data.year} {data.make} {data.model}
                </p>
              )}
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${data.estimatedValue.toLocaleString()}
              </div>
              <div className="text-sm text-blue-800">Estimated Value</div>
            </div>
            
            {data.confidenceScore && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {data.confidenceScore}%
                </div>
                <div className="text-sm text-green-800">Confidence Score</div>
              </div>
            )}
            
            {data.mileage && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {data.mileage.toLocaleString()}
                </div>
                <div className="text-sm text-gray-800">Miles</div>
              </div>
            )}
            
            {data.condition && (
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {data.condition}
                </div>
                <div className="text-sm text-orange-800">Condition</div>
              </div>
            )}
          </div>

          {isPremium && (
            <div className="flex justify-center">
              <PremiumDownloadButton 
                valuationData={data}
                className="w-full md:w-auto"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dealer Offers Section - Always show for users to see offers */}
      {actualValuationId && (
        <DealerOffersSection 
          valuationId={actualValuationId}
          estimatedValue={data.estimatedValue}
        />
      )}

      {/* Dealer Offer Form - Only show for dealers */}
      {user && actualValuationId && (
        <DealerOfferCard 
          reportId={actualValuationId}
          userId={data.userId}
          estimatedValue={data.estimatedValue}
        />
      )}
    </div>
  );
}
