import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useValuation } from '@/contexts/ValuationContext';
import { PremiumPdfSection } from '@/components/valuation/PremiumPdfSection';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FollowUpAnswers } from '@/types/follow-up-answers';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { getValuationById, isLoading } = useValuation();
  const [valuationData, setValuationData] = useState<any>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followUpData, setFollowUpData] = useState<FollowUpAnswers>({
    vin: '',
    mileage: 0,
    condition: 'good',
    zip_code: '',
    title_status: 'clean',
    transmission: 'automatic',
    previous_use: 'personal',
    previous_owners: 1,
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    brake_condition: 'good',
    dashboard_lights: [],
    loan_balance: 0,
    payoffAmount: 0,
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false
    },
    modifications: {
      hasModifications: false,
      modified: false,
      types: [],
      reversible: true
    },
    serviceHistory: {
      hasRecords: false,
      frequency: 'unknown',
      dealerMaintained: false,
      description: '',
      services: []
    },
    features: [],
    additional_notes: '',
    completion_percentage: 0,
    is_complete: false,
    vehicleConfirmed: false
  });

  useEffect(() => {
    const loadValuationData = async () => {
      try {
        // Try to get ID from params first, then from localStorage, then from search params
        const valuationId = id || 
          localStorage.getItem('latest_valuation_id') || 
          searchParams.get('id');

        if (!valuationId) {
          toast.error('No valuation ID found');
          setLoading(false);
          return;
        }

        const data = await getValuationById(valuationId);
        setValuationData(data);
        
        // Initialize follow-up data with valuation data
        setFollowUpData((prev: FollowUpAnswers) => ({
          ...prev,
          vin: data.vin || '',
          mileage: data.mileage || 0,
          condition: data.condition || 'good',
          zip_code: data.zip_code || ''
        }));
        
        // Show follow-up questions if this is a basic VIN lookup
        if (data.vin && (!data.mileage || data.mileage === 50000)) {
          setShowFollowUp(true);
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

  const updateFollowUpData = (updates: Partial<FollowUpAnswers>) => {
    setFollowUpData((prev: FollowUpAnswers) => ({ ...prev, ...updates }));
  };

  const handleFollowUpSubmit = async () => {
    try {
      // Update valuation with follow-up answers
      setValuationData((prev: any) => ({
        ...prev,
        mileage: followUpData.mileage || prev.mileage,
        condition: followUpData.condition || prev.condition,
        zip_code: followUpData.zip_code || prev.zip_code,
      }));
      setShowFollowUp(false);
      toast.success('Vehicle details updated successfully!');
    } catch (error) {
      console.error('Error updating valuation:', error);
      toast.error('Failed to update vehicle details');
    }
  };

  const handleFollowUpSave = () => {
    toast.success('Progress saved!');
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Vehicle Information Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              {valuationData.year} {valuationData.make} {valuationData.model}
              {valuationData.vehicle_data?.trim && ` ${valuationData.vehicle_data.trim}`}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ${valuationData.estimated_value?.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Confidence: {valuationData.confidence_score}%
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {valuationData.vin && (
              <div>
                <span className="font-medium">VIN:</span>
                <div className="font-mono text-xs">{valuationData.vin}</div>
              </div>
            )}
            <div>
              <span className="font-medium">Mileage:</span>
              <div>{valuationData.mileage?.toLocaleString()} miles</div>
            </div>
            <div>
              <span className="font-medium">Condition:</span>
              <div>{valuationData.condition}</div>
            </div>
            <div>
              <span className="font-medium">Location:</span>
              <div>{valuationData.zip_code}</div>
            </div>
          </div>
          
          {valuationData.price_range_low && valuationData.price_range_high && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="text-sm font-medium mb-1">Price Range</div>
              <div className="text-sm text-muted-foreground">
                ${Math.floor(valuationData.price_range_low).toLocaleString()} - 
                ${Math.ceil(valuationData.price_range_high).toLocaleString()}
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
              formData={followUpData}
              updateFormData={updateFollowUpData}
              onSubmit={handleFollowUpSubmit}
              onSave={handleFollowUpSave}
              isLoading={false}
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
            <div className="space-y-2">
              {valuationData.adjustments.map((adjustment: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{adjustment.factor}</div>
                    <div className="text-sm text-muted-foreground">{adjustment.description}</div>
                  </div>
                  <div className={`font-medium ${adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustment.impact >= 0 ? '+' : ''}${adjustment.impact}
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
