
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useValuation } from '@/contexts/ValuationContext';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { PremiumPdfSection } from '@/components/valuation/PremiumPdfSection';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { ValueBreakdown } from '@/components/valuation/ValueBreakdown';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { getValuationById, isLoading } = useValuation();
  const [valuationData, setValuationData] = useState<any>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadValuationData = async () => {
      try {
        const valuationId = id || 
          localStorage.getItem('latest_valuation_id') || 
          searchParams.get('id');

        if (!valuationId) {
          toast.error('No valuation ID found');
          setLoading(false);
          return;
        }

        const data = await getValuationById(valuationId);

        if (!data) {
          toast.error('Valuation not found');
          setLoading(false);
          return;
        }

        if (!data.estimated_value || data.estimated_value <= 0) {
          toast.error('Invalid valuation data - please try again');
          setLoading(false);
          return;
        }

        setValuationData(data);
        
        // Show follow-up only if we have VIN and need more data
        const shouldShowFollowUp = (
          data.vin && 
          (data.confidence_score < 85 || 
           !data.adjustments?.length ||
           data.zip_code === '90210')
        );

        if (shouldShowFollowUp) {
          setShowFollowUp(true);
          toast.info('Complete additional questions for higher accuracy');
        }
      } catch (error) {
        console.error('Error loading valuation data:', error);
        toast.error('Failed to load valuation data');
      } finally {
        setLoading(false);
      }
    };

    loadValuationData();
  }, [id, searchParams, getValuationById]);

  const handleFollowUpSubmit = async (): Promise<boolean> => {
    try {
      setShowFollowUp(false);
      toast.success('Vehicle details updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating valuation:', error);
      toast.error('Failed to update vehicle details');
      return false;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading valuation results...</span>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Valuation Not Found</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't find the valuation results you're looking for.
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Start New Valuation
        </Button>
      </div>
    );
  }

  // Safe vehicle info extraction with defaults
  const vehicleInfo = {
    year: valuationData.year || new Date().getFullYear(),
    make: valuationData.make || 'Unknown',
    model: valuationData.model || 'Unknown',
    trim: valuationData.vehicle_data?.trim || '',
    mileage: valuationData.mileage || 0,
    condition: valuationData.condition || 'Good',
    vin: valuationData.vin || '',
    zipCode: valuationData.zip_code || ''
  };

  // Safe MSRP extraction with fallbacks
  const baseMSRP = valuationData.vehicle_data?.baseMSRP || 25000;
  const msrpSource = valuationData.vehicle_data?.msrpSource || 'estimated';

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Main Valuation Result */}
      <div className="space-y-2">
        <UnifiedValuationResult
          vehicleInfo={vehicleInfo}
          estimatedValue={valuationData.estimated_value}
          confidenceScore={valuationData.confidence_score || 75}
          priceRange={
            valuationData.price_range_low && valuationData.price_range_high
              ? [valuationData.price_range_low, valuationData.price_range_high]
              : [
                  Math.round(valuationData.estimated_value * 0.92),
                  Math.round(valuationData.estimated_value * 1.08)
                ]
          }
          adjustments={valuationData.adjustments || []}
          zipCode={valuationData.zip_code || ''}
          isPremium={valuationData.valuation_type === 'premium'}
          onEmailReport={() => toast.info('Email feature coming soon')}
          onUpgrade={() => toast.info('Premium upgrade coming soon')}
        />
        
        {/* Display MSRP if available and not a fallback value */}
        {baseMSRP && baseMSRP !== 25000 && msrpSource && msrpSource !== 'make_fallback' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">MSRP Used in Calculation:</span> ${baseMSRP.toLocaleString()}
            </p>
            {msrpSource === 'trim_id' && (
              <p className="text-xs text-muted-foreground mt-1">
                Sourced from specific trim data
              </p>
            )}
            {msrpSource === 'database_fallback' && (
              <p className="text-xs text-muted-foreground mt-1">
                Sourced from vehicle database
              </p>
            )}
          </div>
        )}
      </div>

      {/* Value Breakdown */}
      <ValueBreakdown
        adjustments={valuationData.adjustments || []}
        baseValue={valuationData.vehicle_data?.baseMSRP || baseMSRP}
        finalValue={valuationData.estimated_value}
        confidenceScore={valuationData.confidence_score || 75}
        vehicleData={{
          baseMSRP: valuationData.vehicle_data?.baseMSRP || baseMSRP,
          calculationMethod: valuationData.vehicle_data?.calculationMethod || 'standard',
          usedRealMSRP: valuationData.vehicle_data?.msrpSource !== 'make_fallback' && valuationData.vehicle_data?.msrpSource !== 'error_fallback'
        }}
      />

      {/* Follow-up Questions */}
      {showFollowUp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Improve Your Valuation Accuracy</h3>
          <p className="text-muted-foreground mb-4">
            Answer a few more questions to get the most precise estimate possible.
          </p>
          <TabbedFollowUpForm
            vehicleData={{
              vin: valuationData.vin || '',
              year: valuationData.year,
              make: valuationData.make,
              model: valuationData.model
            }}
            onSubmit={handleFollowUpSubmit}
          />
        </div>
      )}

      {/* Premium PDF Section */}
      <PremiumPdfSection
        valuationResult={valuationData}
        isPremium={valuationData.valuation_type === 'premium'}
      />

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Start New Valuation
        </Button>
        {!showFollowUp && valuationData.vin && (
          <Button variant="outline" onClick={() => setShowFollowUp(true)}>
            Improve Accuracy
          </Button>
        )}
      </div>
    </div>
  );
}
