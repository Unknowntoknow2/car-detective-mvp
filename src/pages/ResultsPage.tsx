import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useValuation } from '@/contexts/ValuationContext';
import { PremiumPdfSection } from '@/components/valuation/PremiumPdfSection';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { Loader2, Car, MapPin, Gauge, Star } from 'lucide-react';
import { toast } from 'sonner';
import { ValueBreakdown } from '@/components/valuation/ValueBreakdown';

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

        console.log('🔍 Loading valuation data for ID:', valuationId);

        if (!valuationId) {
          console.log('❌ No valuation ID found');
          toast.error('No valuation ID found');
          setLoading(false);
          return;
        }

        const data = await getValuationById(valuationId);
        console.log('📊 Valuation data loaded:', data);

        if (!data) {
          console.log('❌ No data returned from getValuationById');
          toast.error('Valuation not found');
          setLoading(false);
          return;
        }

        // Enhanced validation with better error messages
        if (!data.estimated_value || data.estimated_value <= 0) {
          console.warn('⚠️ Invalid estimated_value:', data.estimated_value);
          toast.error('Invalid valuation data - please try again');
          setLoading(false);
          return;
        }

        console.log('📊 Real valuation data:', {
          vin: data.vin || 'missing',
          make: data.make,
          model: data.model,
          year: data.year,
          value: data.estimated_value,
          adjustments: data.adjustments?.length || 0,
          confidence: data.confidence_score
        });

        setValuationData(data);
        
        // Show follow-up only if we have VIN and need more data
        const shouldShowFollowUp = (
          data.vin && 
          (data.confidence_score < 85 || 
           !data.adjustments?.length ||
           data.zip_code === '90210')
        );

        if (shouldShowFollowUp) {
          console.log('✅ Setting showFollowUp to true - low confidence or missing data');
          setShowFollowUp(true);
          toast.info('Complete additional questions for higher accuracy');
        }
      } catch (error) {
        console.error('❌ Error loading valuation data:', error);
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
      console.error('❌ Error updating valuation:', error);
      toast.error('Failed to update vehicle details');
      return false;
    }
  };

  const getValuationType = (data: any) => {
    if (data.valuation_type === 'premium') return 'Premium';
    if (data.vin) return 'VIN Lookup';
    return 'Free';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
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
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Valuation Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find the valuation results you're looking for.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Start New Valuation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayValue = valuationData.estimated_value > 0 
    ? valuationData.estimated_value 
    : 'Processing...';

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Vehicle Information Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Car className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">
                  {valuationData.year} {valuationData.make} {valuationData.model}
                  {valuationData.vehicle_data?.trim && ` ${valuationData.vehicle_data.trim}`}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline">{getValuationType(valuationData)}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span className={`text-sm font-medium ${getConfidenceColor(valuationData.confidence_score || 75)}`}>
                      {valuationData.confidence_score || 75}% Confidence
                    </span>
                  </div>
                  {valuationData.vin && (
                    <Badge variant="secondary" className="font-mono text-xs">
                      VIN: {valuationData.vin.slice(-8)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {typeof displayValue === 'number' 
                  ? `$${displayValue.toLocaleString()}` 
                  : displayValue}
              </div>
              {valuationData.price_range_low && valuationData.price_range_high && (
                <div className="text-sm text-muted-foreground mt-1">
                  Range: ${Math.floor(valuationData.price_range_low).toLocaleString()} - 
                  ${Math.ceil(valuationData.price_range_high).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span className="text-sm font-medium">Mileage:</span>
              <span className="text-sm text-muted-foreground">
                {valuationData.mileage?.toLocaleString() || 'Unknown'} miles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Condition:</span>
              <Badge variant="secondary">{valuationData.condition || 'Good'}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Location:</span>
              <span className="text-sm text-muted-foreground">
                {valuationData.zip_code || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Data Quality:</span>
              <Badge variant={valuationData.vin ? "default" : "secondary"}>
                {valuationData.vin ? 'Complete' : 'Partial'}
              </Badge>
            </div>
          </div>
          
          {/* Show data source notice */}
          {valuationData.vin && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm text-blue-800">
                <strong>VIN-based valuation.</strong> This estimate uses your vehicle's specific data and market conditions.
                {showFollowUp && ' Complete additional questions for maximum accuracy.'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Value Breakdown - New Component */}
      <ValueBreakdown
        adjustments={valuationData.adjustments || []}
        baseValue={valuationData.vehicle_data?.baseValue}
        finalValue={valuationData.estimated_value}
        confidenceScore={valuationData.confidence_score || 75}
      />

      {/* Follow-up Questions */}
      {showFollowUp && (
        <Card>
          <CardHeader>
            <CardTitle>Improve Your Valuation Accuracy</CardTitle>
            <p className="text-muted-foreground">
              Answer a few more questions to get the most precise estimate possible.
            </p>
          </CardHeader>
          <CardContent>
            <TabbedFollowUpForm
              vehicleData={{
                vin: valuationData.vin || '',
                year: valuationData.year,
                make: valuationData.make,
                model: valuationData.model
              }}
              onSubmit={handleFollowUpSubmit}
            />
          </CardContent>
        </Card>
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
