
import React from 'react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { ValuationResults } from '@/components/valuation/ValuationResults';
import { Loader2 } from 'lucide-react';
import { ChatBubble } from '@/components/chat/ChatBubble';

interface PredictionResultProps {
  valuationId: string;
}

export function PredictionResult({ valuationId }: PredictionResultProps) {
  const { data, isLoading, error } = useValuationResult(valuationId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-3 text-lg">Loading valuation data...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-white rounded-lg shadow border border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Valuation</h3>
        <p className="text-gray-600">
          We encountered an error while loading your valuation data.
          Please try refreshing the page or contact support if the problem persists.
        </p>
      </div>
    );
  }

  // Ensure all adjustment objects have a description property
  const adjustmentsWithDescription = data.adjustments ? data.adjustments.map(adj => ({
    ...adj,
    description: adj.description || `${adj.factor} adjustment` // Provide default description if missing
  })) : [];

  return (
    <div className="relative">
      <ValuationResults
        estimatedValue={data.estimatedValue}
        confidenceScore={data.confidenceScore || 85}
        basePrice={data.estimatedValue * 0.9}
        adjustments={adjustmentsWithDescription}
        priceRange={data.priceRange}
        vehicleInfo={{
          year: data.year,
          make: data.make,
          model: data.model,
          mileage: data.mileage,
          condition: data.condition
        }}
        valuationId={valuationId}
      />
      
      {/* Add Car Detective Chat Bubble */}
      <ChatBubble 
        valuationId={valuationId} 
        initialMessage="Tell me about my car's valuation"
      />
    </div>
  );
}
