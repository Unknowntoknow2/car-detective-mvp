
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import ValuationResult from '@/modules/valuation-result/ValuationResult';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function ValuationResultPage() {
  const { id, vin } = useParams<{ id?: string; vin?: string }>();
  const navigate = useNavigate();
  const [valuationId, setValuationId] = useState<string | undefined>(undefined);

  // Determine the lookup strategy based on route parameters
  const lookupKey = vin || id;
  const isVinLookup = Boolean(vin);

  // Query to get valuation data
  const { data: valuationData, isLoading, error } = useQuery({
    queryKey: ['valuation', lookupKey, isVinLookup],
    queryFn: async () => {
      if (!lookupKey) {
        throw new Error('No valuation identifier provided');
      }

      console.log('Fetching valuation data for:', { lookupKey, isVinLookup });

      let query = supabase.from('valuations').select('*');
      
      if (isVinLookup) {
        // Look up by VIN
        query = query.eq('vin', lookupKey);
      } else {
        // Look up by ID
        query = query.eq('id', lookupKey);
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(1);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch valuation: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.warn('No valuation found for:', lookupKey);
        throw new Error(`No valuation found for ${isVinLookup ? 'VIN' : 'ID'}: ${lookupKey}`);
      }

      console.log('Valuation data found:', data[0]);
      return data[0];
    },
    enabled: Boolean(lookupKey),
    retry: 1,
    staleTime: 30000, // 30 seconds
  });

  // Set valuation ID when data is loaded
  useEffect(() => {
    if (valuationData?.id) {
      setValuationId(valuationData.id);
    }
  }, [valuationData]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Convert error to string for display
  const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error occurred');

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 container max-w-4xl py-8 px-4">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !valuationData) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 container max-w-4xl py-8 px-4">
          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>

            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                We couldn't find the valuation you're looking for.
              </p>
              <Button onClick={() => navigate('/vin-lookup')}>
                Try Another Lookup
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 container max-w-4xl py-8 px-4">
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>

          <ValuationResult 
            valuationId={valuationId}
            isManualValuation={false}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
