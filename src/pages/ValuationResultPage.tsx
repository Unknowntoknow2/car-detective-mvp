
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import FoundCarCard from '@/components/lookup/found/FoundCarCard';
import { ValuationResponse } from '@/types/vehicle';
import { DecodedVehicleInfo } from '@/types/vehicle.d';
import { formatCurrency } from '@/utils/formatters';

const ValuationResultPage: React.FC = () => {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuation, setValuation] = useState<ValuationResponse | null>(null);
  const [showAccidentQuestion, setShowAccidentQuestion] = useState(false);
  const [accidentAnswered, setAccidentAnswered] = useState(false);

  useEffect(() => {
    if (!vin) {
      setError('No VIN provided');
      setLoading(false);
      return;
    }

    fetchValuationData();
  }, [vin]);

  const fetchValuationData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!vin) {
        throw new Error('VIN is required');
      }

      console.log('Fetching valuation for VIN:', vin);

      // Query the valuations table directly without RLS policies that might cause recursion
      const { data, error: queryError } = await supabase
        .from('valuations')
        .select(`
          *
        `)
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(1);

      if (queryError) {
        console.error('Supabase query error:', queryError);
        throw new Error(`Database error: ${queryError.message}`);
      }

      if (!data || data.length === 0) {
        console.log('No valuation found for VIN:', vin);
        setError('No valuation found for this VIN. Please try again.');
        setLoading(false);
        return;
      }

      const valuationData = data[0];
      console.log('Valuation data retrieved:', valuationData);

      // Map the database result to ValuationResponse format
      const mappedValuation: ValuationResponse = {
        estimatedValue: valuationData.estimated_value || 0,
        confidenceScore: valuationData.confidence_score || 75,
        valuationId: valuationData.id,
        make: valuationData.make || '',
        model: valuationData.model || '',
        year: valuationData.year || 0,
        mileage: valuationData.mileage,
        condition: valuationData.condition || 'good',
        vin: valuationData.vin,
        zipCode: valuationData.state,
        fuelType: valuationData.fuel_type,
        transmission: valuationData.transmission,
        bodyType: valuationData.body_type,
        color: valuationData.color,
        price_range: valuationData.estimated_value ? {
          low: Math.round(valuationData.estimated_value * 0.95),
          high: Math.round(valuationData.estimated_value * 1.05)
        } : { low: 0, high: 0 }
      };

      setValuation(mappedValuation);
      
      // Show accident question if not already answered
      if (valuationData.accident_count === null || valuationData.accident_count === undefined) {
        setShowAccidentQuestion(true);
      } else {
        setAccidentAnswered(true);
      }

    } catch (err) {
      console.error('Error fetching valuation data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load valuation data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAccidentResponse = async (hasAccident: boolean) => {
    try {
      if (!vin || !valuation) return;

      const accidentCount = hasAccident ? 1 : 0;
      
      const { error: updateError } = await supabase
        .from('valuations')
        .update({ accident_count: accidentCount })
        .eq('vin', vin);

      if (updateError) {
        console.error('Error updating accident count:', updateError);
        toast.error('Failed to save accident information');
        return;
      }

      setShowAccidentQuestion(false);
      setAccidentAnswered(true);
      toast.success('Information saved successfully');

      // Optionally refetch data to get updated valuation
      if (hasAccident) {
        fetchValuationData();
      }

    } catch (err) {
      console.error('Error saving accident response:', err);
      toast.error('Failed to save accident information');
    }
  };

  const mapValuationToVehicleInfo = (val: ValuationResponse): DecodedVehicleInfo => ({
    vin: val.vin || '',
    year: val.year || 0,
    make: val.make || '',
    model: val.model || '',
    trim: '', // Not available in valuation data
    bodyType: val.bodyType || '',
    fuelType: val.fuelType || '',
    transmission: val.transmission || '',
    color: val.color || '',
    estimatedValue: val.estimatedValue,
    confidenceScore: val.confidenceScore,
    valuationId: val.valuationId
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading valuation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Valuation</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={() => navigate('/')} variant="outline">
              Return to Home
            </Button>
            <Button onClick={fetchValuationData}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!valuation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Valuation Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find a valuation for this VIN. Please try searching again.
          </p>
          <Button onClick={() => navigate('/valuation')} className="w-full">
            New Valuation
          </Button>
        </div>
      </div>
    );
  }

  const vehicleInfo = mapValuationToVehicleInfo(valuation);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Vehicle Summary Card */}
        <FoundCarCard vehicle={vehicleInfo} />

        {/* Accident Question */}
        {showAccidentQuestion && !accidentAnswered && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Has this vehicle been in any accidents?
              </p>
              <div className="space-x-2">
                <Button 
                  onClick={() => handleAccidentResponse(true)}
                  variant="outline"
                >
                  Yes, it has been in accidents
                </Button>
                <Button 
                  onClick={() => handleAccidentResponse(false)}
                  variant="default"
                >
                  No accidents
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Valuation Result */}
        <Card>
          <CardHeader>
            <CardTitle>Estimated Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {formatCurrency(valuation.estimatedValue)}
              </div>
              <div className="text-gray-600 mb-4">
                Confidence Score: {valuation.confidenceScore}%
              </div>
              {valuation.price_range && (
                <div className="text-sm text-gray-500">
                  Range: {formatCurrency(Array.isArray(valuation.price_range) ? valuation.price_range[0] : valuation.price_range.low)} - {formatCurrency(Array.isArray(valuation.price_range) ? valuation.price_range[1] : valuation.price_range.high)}
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Next Steps</h3>
              <p className="text-gray-600 mb-4">
                This is your vehicle's estimated market value. Ready to get more detailed insights?
              </p>
              <div className="space-x-2">
                <Button onClick={() => navigate('/premium')} className="w-full sm:w-auto">
                  Get Premium Report
                </Button>
                <Button onClick={() => navigate('/valuation')} variant="outline" className="w-full sm:w-auto">
                  New Valuation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ValuationResultPage;
