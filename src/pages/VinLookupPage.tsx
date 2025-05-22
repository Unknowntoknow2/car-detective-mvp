
import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import VinDecoderForm from '@/components/lookup/VinDecoderForm';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';
import NicbVinCheck from '@/components/valuation/NicbVinCheck';

export default function VinLookupPage() {
  useEffect(() => {
    console.log('✅ VinLookupPage mounted');
  }, []);

  return (
    <Container className="max-w-4xl py-10">
      <h1 className="text-2xl font-bold mb-6">VIN Lookup</h1>
      <VinDecoderForm />
      
      {/* Additional VIN check component */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Theft & Title Check</h2>
        <NicbVinCheck />
      </div>
      
      {/* Debug info only visible in development mode */}
      {SHOW_ALL_COMPONENTS && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-black p-3 rounded-lg text-xs z-50 opacity-80">
          Debug Mode: ON
        </div>
      )}
    </Container>
  );
}
