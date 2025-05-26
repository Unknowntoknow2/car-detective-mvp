
import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { UnifiedVinLookup } from '@/components/lookup/UnifiedVinLookup';
import { VinFollowupFlow } from '@/components/lookup/followup/VinFollowupFlow';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

export default function VinLookupPage() {
  const { state } = useVinLookupFlow();

  useEffect(() => {
    console.log('✅ VinLookupPage mounted - Stage:', state.stage);
  }, [state.stage]);

  return (
    <Container className="max-w-6xl py-10">
      {state.stage === 'followup' ? (
        <VinFollowupFlow />
      ) : (
        <UnifiedVinLookup showHeader={true} />
      )}
      
      {/* Debug info only visible in development mode */}
      {SHOW_ALL_COMPONENTS && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-black p-3 rounded-lg text-xs z-50 opacity-80">
          <div className="space-y-1">
            <div>Debug Mode: ON</div>
            <div>Stage: {state.stage}</div>
            <div>Progress: {state.followupProgress}%</div>
            <div>VIN: {state.vin || 'None'}</div>
            <div>Vehicle: {state.vehicle ? 'Found' : 'None'}</div>
          </div>
        </div>
      )}
    </Container>
  );
}
