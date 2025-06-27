
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
        console.log('📊 Rendering result for valuation_id:', valuationId);

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

        // Validate form-to-valuation linkage on results page
        if (data.id && !data.vin) {
          console.warn('⚠️ Valuation', data.id, 'missing VIN — enrichment blocked');
        }

        if (!data.estimated_value || data.estimated_value <= 0) {
          console.warn('⚠️ Invalid estimated_value:', data.estimated_value);
          toast.error('Invalid valuation data - please try again');
          setLoading(false);
          return;
        }

        console.log('📊 Rendering result for VIN:', data.vin || 'missing');
        console.log('📉 Confidence:', (data.confidence_score || 75) + '% — market data missing?');

        if (!data.vin) {
          console.log('⚠️ Cannot enrich results — valuation record lacks VIN linkage');
        }

        // Check for missing MSRP
        if (data.estimated_value && data.estimated_value < 25000 && data.make === 'Toyota') {
          console.log('⚠️ Missing MSRP prevents accurate baseline valuation');
        }

        console.log('✅ Setting valuation data');
        setValuationData(data);
        
        // Determine if follow-up is needed based on valuation type and data completeness
        const shouldShowFollowUp = (
          data.vin && // Has VIN (indicates VIN lookup)
          (data.mileage === 50000 || // Default mileage indicates incomplete data
           data.confidence_score < 80 || // Low confidence
           !data.condition || // Missing condition
           data.zip_code === '90210') // Default zip code
        );

        if (shouldShowFollowUp) {
          console.log('✅ Setting showFollowUp to true');
          setShowFollowUp(true);
          toast.info('Please provide additional details for a more accurate valuation');
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
            {valuationData.vin && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">VIN:</span>
                <span className="text-sm font-mono text-muted-foreground">
                  {valuationData.vin.slice(-8)}
                </span>
              </div>
            )}
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
          </div>
          
          {/* Show notice for VIN-based valuations */}
          {valuationData.vin && showFollowUp && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm text-blue-800">
                <strong>Initial VIN-based valuation.</strong> Complete the questions below for a more accurate estimate.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Follow-up Questions */}
      {showFollowUp && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Valuation</CardTitle>
            <p className="text-muted-foreground">
              Please provide additional details to get a more accurate valuation.
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

      {/* Value Adjustments */}
      {valuationData.adjustments && valuationData.adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Value Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {valuationData.adjustments.map((adjustment: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{adjustment.factor}</div>
                    <div className="text-sm text-muted-foreground">{adjustment.description}</div>
                  </div>
                  <div className={`font-medium ${adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustment.impact >= 0 ? '+' : ''}${adjustment.impact?.toLocaleString() || 0}
                  </div>
                </div>
              ))}
            </div>
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
            Update Vehicle Details
          </Button>
        )}
      </div>
    </div>
  );
}
