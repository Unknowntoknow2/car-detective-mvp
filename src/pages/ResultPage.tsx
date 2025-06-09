
import React from 'react';
import { Container } from '@/components/ui/container';

export default function ResultPage() {
  return (
    <Container className="max-w-6xl py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Valuation Results
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your vehicle valuation results will appear here.
        </p>
      </div>
    </Container>
  );
}
