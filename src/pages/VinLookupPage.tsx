
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import VinDecoderForm from '@/components/lookup/VinDecoderForm';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

export default function VinLookupPage() {
  const [vin, setVin] = useState<string | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleVinSubmit = (vinValue: string) => {
    console.log("VIN submitted:", vinValue);
    setVin(vinValue);
    setShowFollowUp(true);
  };

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
      
      <VinDecoderForm />
      
      {/* Debug info only visible in development mode */}
      {SHOW_ALL_COMPONENTS && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-black p-3 rounded-lg text-xs z-50 opacity-80">
          <div className="space-y-1">
            <div>Debug Mode: ON</div>
            <div>Component: VinLookupPage</div>
            <div>VIN: {vin || 'None'}</div>
          </div>
        </div>
      )}
    </Container>
  );
}
