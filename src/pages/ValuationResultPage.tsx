
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FoundCarCard } from '@/components/lookup/found/FoundCarCard';
import { DecodedVehicleInfo, ValuationResponse } from '@/types/vehicle';
import { toast } from 'sonner';

const ValuationResultPage: React.FC = () => {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuation, setValuation] = useState<ValuationResponse | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [accidentQuestion, setAccidentQuestion] = useState(false);
  const [showAccidentQuestion, setShowAccidentQuestion] = useState(true);

  const loadValuation = async () => {
    if (!vin) {
      setError('No VIN provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query valuations table without triggering RLS issues
      // Use a more direct approach to avoid user_roles recursion
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (valuationError) {
        console.error('Error loading valuation:', valuationError);
        setError(`Failed to load valuation: ${valuationError.message}`);
        setLoading(false);
        return;
      }

      if (!valuationData) {
        setError('No valuation found for this VIN');
        setLoading(false);
        return;
      }

      // Map valuation data to the expected formats
      const mappedValuation: ValuationResponse = {
        estimatedValue: valuationData.estimated_value || 0,
        confidenceScore: valuationData.confidence_score || 75,
        valuationId: valuationData.id,
        make: valuationData.make || '',
        model: valuationData.model || '',
        year: valuationData.year || 0,
        mileage: valuationData.mileage,
        condition: valuationData.condition_score ? 'good' : 'unknown',
        vin: valuationData.vin,
        zipCode: valuationData.state || '',
        fuelType: valuationData.fuel_type,
        transmission: valuationData.transmission,
        bodyType: valuationData.body_type,
        color: valuationData.color,
        priceRange: [
          Math.round((valuationData.estimated_value || 0) * 0.95),
          Math.round((valuationData.estimated_value || 0) * 1.05)
        ]
      };

      const mappedVehicleInfo: DecodedVehicleInfo = {
        vin: valuationData.vin || '',
        make: valuationData.make || '',
        model: valuationData.model || '',
        year: valuationData.year || 0,
        bodyType: valuationData.body_type,
        fuelType: valuationData.fuel_type,
        transmission: valuationData.transmission,
        color: valuationData.color,
        estimatedValue: valuationData.estimated_value,
        confidenceScore: valuationData.confidence_score,
        mileage: valuationData.mileage
      };

      setValuation(mappedValuation);
      setVehicleInfo(mappedVehicleInfo);
      
    } catch (err: any) {
      console.error('Error loading valuation:', err);
      setError(err.message || 'Failed to load valuation');
    } finally {
      setLoading(false);
    }
  };

  const handleAccidentResponse = async (hasAccident: boolean) => {
    if (!vin) return;

    try {
      // Update accident count in the valuation record
      const { error: updateError } = await supabase
        .from('valuations')
        .update({ accident_count: hasAccident ? 1 : 0 })
        .eq('vin', vin);

      if (updateError) {
        console.error('Error updating accident info:', updateError);
        toast.error('Failed to update accident information');
      } else {
        toast.success('Information updated successfully');
        setShowAccidentQuestion(false);
      }
    } catch (error) {
      console.error('Error updating accident info:', error);
      toast.error('Failed to update accident information');
    }
  };

  useEffect(() => {
    loadValuation();
  }, [vin]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading valuation results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !valuation || !vehicleInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'No valuation data found'}
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
            <Button onClick={() => navigate('/valuation')}>
              <Plus className="h-4 w-4 mr-2" />
              New Valuation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Vehicle Information Card */}
        <FoundCarCard vehicle={vehicleInfo} />

        {/* Follow-up Questions */}
        {showAccidentQuestion && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To provide a more accurate valuation, please answer this optional question:
                </p>
                
                <div>
                  <p className="font-medium mb-3">Has this vehicle been in any accidents?</p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleAccidentResponse(true)}
                      className="flex-1"
                    >
                      Yes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAccidentResponse(false)}
                      className="flex-1"
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Valuation Results */}
        <Card>
          <CardHeader>
            <CardTitle>Estimated Vehicle Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  ${valuation.estimatedValue?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Estimated Market Value</p>
              </div>
              
              {valuation.priceRange && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="font-medium">
                    ${valuation.priceRange[0]?.toLocaleString()} - ${valuation.priceRange[1]?.toLocaleString()}
                  </p>
                </div>
              )}
              
              {valuation.confidenceScore && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Confidence Score</span>
                    <span className="font-medium">{valuation.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${valuation.confidenceScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
          <Button onClick={() => navigate('/valuation')}>
            <Plus className="h-4 w-4 mr-2" />
            New Valuation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValuationResultPage;
