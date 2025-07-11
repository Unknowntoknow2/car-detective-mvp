
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useValuation } from '@/contexts/ValuationContext';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { PremiumPdfSection } from '@/components/valuation/PremiumPdfSection';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { ValueBreakdown } from '@/components/valuation/ValueBreakdown';
import { DataIntegrityPanel } from '@/components/valuation/DataIntegrityPanel';
import { convertLegacyToUnified } from '@/utils/valuation/legacyConverter';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { getValuationById, isLoading, processFreeValuation } = useValuation();
  const { user, userDetails } = useAuth();
  const [valuationData, setValuationData] = useState<any>(null);
  const [followUpData, setFollowUpData] = useState<any>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState(false);

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
        console.log('📊 Valuation data loaded:', data);
        
        // Try to fetch follow-up data based on valuation ID or VIN
        try {
          let followUpQuery = supabase
            .from('follow_up_answers')
            .select('*');
          
          // First try by valuation_id
          let { data: followUpByValuationId } = await followUpQuery
            .eq('valuation_id', valuationId)
            .single();
          
          console.log('🔍 Follow-up data by valuation_id:', followUpByValuationId);
          
          // If not found and we have a VIN, try by VIN
          if (!followUpByValuationId && data.vin) {
            const { data: followUpByVin } = await followUpQuery
              .eq('vin', data.vin)
              .order('updated_at', { ascending: false })
              .limit(1)
              .single();
            
            console.log('🔍 Follow-up data by VIN:', followUpByVin);
            followUpByValuationId = followUpByVin;
          }
          
          // If still not found, try the generic search across all follow-up data for this VIN
          if (!followUpByValuationId && data.vin) {
            const { data: followUpGeneric } = await supabase
              .from('follow_up_answers')
              .select('*')
              .eq('vin', data.vin)
              .order('updated_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            console.log('🔍 Follow-up data by generic VIN search:', followUpGeneric);
            followUpByValuationId = followUpGeneric;
          }
          
          if (followUpByValuationId) {
            setFollowUpData(followUpByValuationId);
            console.log('✅ Follow-up data set:', followUpByValuationId);
          } else {
            console.log('❌ No follow-up data found');
          }
        } catch (error) {
          console.log('❌ Error fetching follow-up data:', error);
        }
        
        // Show follow-up if we have VIN and need more data (not hardcoded zip check)
        const shouldShowFollowUp = (
          data.vin && 
          (data.confidence_score < 85 || 
           !data.adjustments?.length ||
           !data.zip_code ||
           !data.mileage ||
           data.mileage === 0)
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

  const handleRerunValuation = async () => {
    if (!valuationData) {
      toast.error('Missing vehicle data for rerun');
      return;
    }

    console.log('🔥 RERUN BUTTON CLICKED - Starting enhanced rerun process');
    console.log('📋 Input data:', {
      vin: valuationData.vin,
      make: valuationData.make,
      model: valuationData.model,
      year: valuationData.year,
      mileage: followUpData?.mileage || valuationData.mileage,
      condition: followUpData?.condition || valuationData.condition,
      zipCode: followUpData?.zip_code || valuationData.zip_code
    });

    setLoading(true);
    try {
      console.log('🔄 FORCE RERUNNING valuation with enhanced unified engine...');
      
      const result = await processFreeValuation({
        vin: valuationData.vin,
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: followUpData?.mileage || valuationData.mileage,
        condition: followUpData?.condition || valuationData.condition,
        zipCode: followUpData?.zip_code || valuationData.zip_code
      }, true); // FORCE NEW = true

      console.log('✅ Enhanced rerun result:', result);

      if (result && result.valuationId) {
        toast.success('Valuation updated with enhanced engine!');
        // Reload the page with new valuation data
        window.location.reload();
      } else {
        console.error('❌ No result returned from enhanced engine');
        toast.error('Failed to rerun valuation');
      }
    } catch (error) {
      console.error('❌ Error rerunning valuation:', error);
      toast.error('Failed to rerun valuation: ' + (error as Error).message);
    } finally {
      setLoading(false);
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

  // FIXED: Prioritize follow-up data over valuation data for display
  const vehicleInfo = {
    year: valuationData.year || new Date().getFullYear(),
    make: valuationData.make || 'Unknown',
    model: valuationData.model || 'Unknown',
    trim: valuationData.vehicle_data?.trim || '',
    // CRITICAL FIX: Always prioritize follow-up data for user-entered values
    mileage: followUpData?.mileage > 0 ? followUpData.mileage : 
             (valuationData.mileage > 0 ? valuationData.mileage : null),
    condition: followUpData?.condition || valuationData.condition || 'Good',
    vin: valuationData.vin || '',
    zipCode: followUpData?.zip_code || valuationData.zip_code || ''
  };

  console.log('🚗 Vehicle info used for display:', vehicleInfo);
  console.log('📋 Follow-up data mileage:', followUpData?.mileage);
  console.log('📋 Valuation data mileage:', valuationData.mileage);

  // MSRP extraction - no fallbacks, use only real data
  const baseMSRP = valuationData.vehicle_data?.baseMSRP;
  const msrpSource = valuationData.vehicle_data?.msrpSource;

  // Add debug logging before conversion
  console.log('🔍 About to convert data:', { vehicleInfo, valuationData });
  const convertedResult = convertLegacyToUnified(vehicleInfo, valuationData);
  console.log('🔄 Converted result:', convertedResult);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Debug info */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold">Debug Information:</h4>
        <p>Vehicle Info: {JSON.stringify(vehicleInfo, null, 2)}</p>
        <p>Final Value: {valuationData.estimated_value}</p>
        <p>Converted Result Final Value: {convertedResult?.finalValue}</p>
      </div>
      
      {/* Main Valuation Result */}
      <div className="space-y-2">
        <UnifiedValuationResult
          result={convertedResult}
        />
        
        {/* Data Integrity Panel - Complete Transparency */}
        <DataIntegrityPanel
          dataSource={valuationData.data_source || {
            marketListings: 0,
            calculationMethod: 'market_analysis',
            dataSourcesUsed: [],
            confidenceBreakdown: [],
            timestamp: new Date().toISOString()
          }}
          vehicleData={valuationData.vehicle_data}
          confidenceScore={valuationData.confidence_score || 0}
        />
      </div>

      {/* Value Breakdown - only show if we have real data */}
      {(baseMSRP || valuationData.adjustments?.length) && (
        <ValueBreakdown
          adjustments={(valuationData.adjustments || []).map((adj: any) => ({
            factor: adj.factor || 'Unknown factor',
            impact: adj.impact || 0,
            percentage: adj.percentage || 0,
            description: adj.description || 'No description available'
          }))}
          baseValue={baseMSRP || 0}
          finalValue={valuationData.estimated_value || 0}
          confidenceScore={valuationData.confidence_score || 0}
          vehicleData={{
            baseMSRP: baseMSRP || 0,
            calculationMethod: valuationData.vehicle_data?.calculationMethod || 'market_analysis',
            usedRealMSRP: !!baseMSRP && msrpSource !== 'make_fallback' && msrpSource !== 'error_fallback'
          }}
        />
      )}

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
      <div className="flex gap-4 flex-wrap">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Start New Valuation
        </Button>
        {!showFollowUp && valuationData.vin && (
          <Button variant="outline" onClick={() => setShowFollowUp(true)}>
            Improve Accuracy
          </Button>
        )}
        
        {/* Debug: Rerun Valuation Button */}
        {valuationData.vin && (
          <Button 
            variant="secondary" 
            onClick={handleRerunValuation}
            disabled={loading}
          >
            {loading ? 'Rerunning...' : 'Rerun with Enhanced Engine'}
          </Button>
        )}
      </div>
      
      {/* Debug Info */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <h3 className="text-sm font-medium mb-2">Debug Info</h3>
        <div className="text-xs space-y-1">
          <p>Current Engine: {valuationData.vehicle_data?.calculationMethod || 'legacy'}</p>
          <p>Has Follow-up Data: {followUpData ? 'Yes' : 'No'}</p>
          <p>Market Listings: {valuationData.listings?.length || 0}</p>
          <p>Confidence: {valuationData.confidence_score}%</p>
        </div>
      </div>
    </div>
  );
}
