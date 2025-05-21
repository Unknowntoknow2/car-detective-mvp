
import React from 'react';
import { Container } from '@/components/ui/container';
import VinDecoderForm from '@/components/lookup/VinDecoderForm';

export default function VinLookupPage() {
  return (
    <Container className="max-w-md py-10">
      <h1 className="text-2xl font-bold mb-6">VIN Lookup</h1>
      <VinDecoderForm />
    </Container>
  );
}
