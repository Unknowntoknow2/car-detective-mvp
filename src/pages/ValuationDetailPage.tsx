import React from 'react';
import { useParams } from 'react-router-dom';
import { useValuationResult } from '@/hooks/useValuationResult';
import UnifiedValuationResult from '@/components/valuation/valuation-core/ValuationResult';
import { downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';

export default function ValuationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { valuation, loading, error } = useValuationResult(id);

  if (loading) return <div className="container mx-auto py-8">Loading valuation...</div>;
  if (error) return <div className="container mx-auto py-8">Error: {error}</div>;
  if (!valuation) return <div className="container mx-auto py-8">Valuation not found</div>;

  const handleDownloadPdf = async () => {
    const reportData = {
      id: valuation.id,
      make: valuation.make,
      model: valuation.model,
      year: valuation.year,
      mileage: valuation.mileage || 0,
      condition: valuation.condition || 'Good',
      estimatedValue: valuation.estimatedValue,
      confidenceScore: valuation.confidenceScore,
      zipCode: valuation.zipCode || '',
      adjustments: valuation.adjustments || [],
      generatedAt: new Date().toISOString(),
      price: valuation.estimatedValue,
      priceRange: valuation.priceRange || [valuation.estimatedValue * 0.95, valuation.estimatedValue * 1.05] as [number, number],
      vin: valuation.vin
    };
    
    await downloadValuationPdf(reportData);
  };

  const vehicleInfo = {
    make: valuation.make || 'Unknown',
    model: valuation.model || 'Unknown',
    year: valuation.year || new Date().getFullYear(),
    mileage: valuation.mileage || 0,
    condition: valuation.condition || 'Good',
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Valuation Details</h1>
      
      <UnifiedValuationResult
        displayMode="full"
        vehicleInfo={vehicleInfo}
        estimatedValue={valuation.estimatedValue}
        confidenceScore={valuation.confidenceScore}
        priceRange={valuation.priceRange}
        adjustments={valuation.adjustments || []}
      />
      
      <div className="mt-6">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
}
