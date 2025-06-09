
import React from 'react';
import { useParams } from 'react-router-dom';
import { useValuationResult } from '@/hooks/useValuationResult';
import { Loading } from '@/components/ui/loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Container } from '@/components/ui/container';

export default function ValuationResultPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const { data, isLoading, error } = useValuationResult(valuationId);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <Container className="py-10">
        <ErrorMessage 
          message="Error loading valuation. Could not load the valuation details." 
          className="text-center"
        />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Valuation Result</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            {data.make} {data.model} ({data.year})
          </h2>
          <p className="text-3xl font-bold text-green-600">
            ${data.estimatedValue?.toLocaleString()}
          </p>
        </div>
      </div>
    </Container>
  );
}
