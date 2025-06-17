import React from 'react';
import { useParams } from 'react-router-dom';
import { useValuationResult } from '@/hooks/useValuationResult';
import UnifiedValuationResult from '@/components/valuation/valuation-core/ValuationResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ValuationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { valuation, loading, error } = useValuationResult();

  // Mock result for the specific ID
  React.useEffect(() => {
    // This would normally fetch the result by ID
    console.log('Loading valuation for ID:', id);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!valuation) return <div>Valuation not found</div>;

  // Fix property access to use correct ValuationResult properties
  const priceRange = valuation.price_range || valuation.priceRange;
  const lowPrice = Array.isArray(priceRange) ? priceRange[0] : (priceRange as any)?.low || (priceRange as any)?.min;
  const highPrice = Array.isArray(priceRange) ? priceRange[1] : (priceRange as any)?.high || (priceRange as any)?.max;
  
  // Calculate fallback price range if none exists
  const calculatedLowPrice = lowPrice || Math.floor(valuation.estimatedValue * 0.95);
  const calculatedHighPrice = highPrice || Math.ceil(valuation.estimatedValue * 1.05);

  const handleDownloadPdf = async () => {
    const reportData = {
      id: valuation.id,
      make: valuation.make,
      model: valuation.model,
      year: valuation.year,
      mileage: valuation.mileage,
      condition: valuation.condition,
      estimatedValue: valuation.estimatedValue, // Fix: use correct property name
      confidenceScore: valuation.confidenceScore, // Fix: use correct property name
      zipCode: valuation.zipCode || '90210',
      adjustments: valuation.adjustments || [],
      generatedAt: new Date().toISOString(),
      price: valuation.estimatedValue,
      priceRange: [calculatedLowPrice, calculatedHighPrice] as [number, number],
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
        estimatedValue={valuation.estimatedValue || valuation.estimated_value || 0}
        confidenceScore={valuation.confidenceScore || valuation.confidence_score || 85}
        priceRange={priceRange}
        adjustments={valuation.adjustments || []}
      />
    </div>
  );
}
