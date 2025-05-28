
import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { VINFollowUpWrapper } from '@/components/followup/VINFollowUpWrapper';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

export default function VinLookupPage() {
  useEffect(() => {
    console.log('✅ VinLookupPage mounted - Using VINFollowUpWrapper');
  }, []);

  return (
    <Container className="max-w-6xl py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          VIN Lookup & Valuation
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Enter your VIN to get a comprehensive vehicle valuation.
        </p>
      </div>
      
      <VINFollowUpWrapper />
      
      {/* Debug info only visible in development mode */}
      {SHOW_ALL_COMPONENTS && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-black p-3 rounded-lg text-xs z-50 opacity-80">
          <div className="space-y-1">
            <div>Debug Mode: ON</div>
            <div>Component: VINFollowUpWrapper</div>
          </div>
        </div>
      )}
    </Container>
  );
}
