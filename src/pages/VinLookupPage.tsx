
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { UnifiedVinLookup } from '@/components/lookup/UnifiedVinLookup';
import { VinFollowupFlow } from '@/components/lookup/followup/VinFollowupFlow';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function VinLookupPage() {
  const { state, setVin, lookupVin } = useVinLookupFlow();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hasAttemptedAutoLookup, setHasAttemptedAutoLookup] = useState(false);

  const urlVin = searchParams.get('vin');

  useEffect(() => {
    if (urlVin && !hasAttemptedAutoLookup && state.stage === 'input') {
      setVin(urlVin);
      setHasAttemptedAutoLookup(true);
      
      setTimeout(() => {
        lookupVin(urlVin);
      }, 100);
    }
  }, [urlVin, hasAttemptedAutoLookup, state.stage, setVin, lookupVin]);

  const handleBackToValuation = () => {
    if (urlVin) {
      navigate(`/valuation/${urlVin}`);
    } else {
      navigate('/valuation');
    }
  };

  return (
    <Container className="max-w-6xl py-10">
      {urlVin && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBackToValuation}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Valuation
                </Button>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                VIN: {urlVin}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {state.stage === 'results' || state.stage === 'complete' ? (
        <VinFollowupFlow />
      ) : (
        <UnifiedVinLookup 
          showHeader={true} 
          initialVin={urlVin || undefined}
        />
      )}
      
      {SHOW_ALL_COMPONENTS && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-black p-3 rounded-lg text-xs z-50 opacity-80">
          <div className="space-y-1">
            <div>Debug Mode: ON</div>
            <div>Stage: {state.stage}</div>
            <div>Progress: {state.followupProgress}%</div>
            <div>VIN: {state.vin || 'None'}</div>
            <div>URL VIN: {urlVin || 'None'}</div>
            <div>Vehicle: {state.vehicle ? 'Found' : 'None'}</div>
            <div>Auto-lookup attempted: {hasAttemptedAutoLookup ? 'Yes' : 'No'}</div>
          </div>
        </div>
      )}
    </Container>
  );
}
