
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useValuation } from '@/contexts/ValuationContext';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { PremiumPdfSection } from '@/components/valuation/PremiumPdfSection';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { ValueBreakdown } from '@/components/valuation/ValueBreakdown';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { getValuationById, isLoading } = useValuation();
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Main Valuation Result */}
      <div className="space-y-2">
        <UnifiedValuationResult
          vehicleInfo={vehicleInfo}
          estimatedValue={valuationData.estimated_value}
          confidenceScore={valuationData.confidence_score || 0}
          priceRange={
            valuationData.price_range_low && valuationData.price_range_high
              ? [valuationData.price_range_low, valuationData.price_range_high]
              : undefined
          }
          adjustments={valuationData.adjustments || []}
          zipCode={valuationData.zip_code || ''}
          isPremium={valuationData.valuation_type === 'premium'}
          onEmailReport={async () => {
            // Prevent duplicate sends
            if (emailSending) return;
            
            if (!user?.email) {
              toast.error('Please log in to email your report');
              return;
            }

            setEmailSending(true);
            try {
              const response = await fetch(`${window.location.origin}/functions/v1/email-valuation-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  valuationId: valuationData.id,
                  email: user.email,
                  userName: userDetails?.full_name || user.email?.split('@')[0]
                })
              });
              
              if (response.ok) {
                toast.success(`Valuation report sent to ${user.email}!`);
              } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to send email');
              }
            } catch (error) {
              console.error('Email error:', error);
              toast.error('Failed to send email report');
            } finally {
              setEmailSending(false);
            }
          }}
          onUpgrade={() => toast.info('Premium upgrade coming soon')}
        />
        
        {/* Display data source information when available */}
        {valuationData.dataSource && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Valuation Data Sources</h4>
            {valuationData.dataSource.marketListings && (
              <p className="text-xs text-muted-foreground mb-1">
                Based on {valuationData.dataSource.marketListings} market listings
              </p>
            )}
            {valuationData.dataSource.calculationMethod && (
              <p className="text-xs text-muted-foreground mb-1">
                Method: {valuationData.dataSource.calculationMethod}
              </p>
            )}
            {valuationData.dataSource.dataSourcesUsed && (
              <p className="text-xs text-muted-foreground mb-1">
                Sources: {valuationData.dataSource.dataSourcesUsed.join(', ')}
              </p>
            )}
            {valuationData.dataSource.timestamp && (
              <p className="text-xs text-muted-foreground">
                Calculated: {new Date(valuationData.dataSource.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Show when MSRP data is available */}
        {baseMSRP && msrpSource && msrpSource !== 'make_fallback' && msrpSource !== 'error_fallback' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">MSRP Used:</span> ${baseMSRP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Source: {msrpSource === 'trim_id' ? 'Specific trim data' : 'Vehicle database'}
            </p>
          </div>
        )}

        {/* Show warning when critical data is missing */}
        {(!baseMSRP || !valuationData.confidence_score || !valuationData.dataSource?.marketListings) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-sm text-amber-800 mb-2">Limited Data Available</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              {!baseMSRP && <li>• No reliable MSRP data found</li>}
              {!valuationData.confidence_score && <li>• Confidence score not calculated</li>}
              {!valuationData.dataSource?.marketListings && <li>• Market comparison data limited</li>}
            </ul>
            <p className="text-xs text-amber-600 mt-2">
              This valuation may be less accurate than usual. Consider upgrading to premium for more comprehensive data.
            </p>
          </div>
        )}
      </div>

      {/* Value Breakdown - only show if we have real data */}
      {(baseMSRP || valuationData.adjustments?.length) && (
        <ValueBreakdown
          adjustments={valuationData.adjustments || []}
          baseValue={baseMSRP || 0}
          finalValue={valuationData.estimated_value}
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
