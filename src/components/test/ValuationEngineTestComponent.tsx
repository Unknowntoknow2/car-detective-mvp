// Test component for Phase 1B integration
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { processValuation } from '@/utils/valuation/unifiedValuationEngine';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { toast } from 'sonner';

export function ValuationEngineTestComponent() {
  const [vin, setVin] = useState('');
  const [zipCode, setZipCode] = useState('90210');
  const [mileage, setMileage] = useState(50000);
  const [condition, setCondition] = useState('good');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestValuation = async () => {
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🧪 Testing unified valuation engine with:', { vin, zipCode, mileage, condition });
      
      const valuationResult = await processValuation({
        vin,
        zipCode,
        mileage,
        condition
      });

      console.log('✅ Valuation test completed:', valuationResult);
      setResult(valuationResult);
      toast.success('Valuation completed successfully!');
      
    } catch (error) {
      console.error('❌ Valuation test failed:', error);
      toast.error('Valuation failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Unified Valuation Engine Test</CardTitle>
          <p className="text-muted-foreground">
            Test the new unified valuation engine directly
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">VIN</label>
              <Input
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="Enter 17-character VIN"
                maxLength={17}
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium">ZIP Code</label>
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="90210"
                maxLength={5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mileage</label>
              <Input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
                placeholder="50000"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Condition</label>
              <select 
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
          
          <Button 
            onClick={handleTestValuation}
            disabled={isLoading || !vin}
            className="w-full"
          >
            {isLoading ? 'Processing Valuation...' : 'Test Unified Engine'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📊 Test Results</h3>
          
          {/* Raw Data Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Raw Engine Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Formatted Display */}
          <UnifiedValuationResult
            vehicleInfo={{
              year: result.vehicle.year,
              make: result.vehicle.make,
              model: result.vehicle.model,
              trim: result.vehicle.trim,
              mileage: result.mileage,
              condition: condition,
              vin: vin
            }}
            estimatedValue={result.finalValue}
            confidenceScore={result.confidenceScore}
            priceRange={result.listingRange ? [result.listingRange.min, result.listingRange.max] : undefined}
            adjustments={result.adjustments.map((adj: any) => ({
              factor: adj.label,
              impact: adj.amount,
              description: adj.reason,
              source: 'unified_engine',
              timestamp: new Date().toISOString()
            }))}
            zipCode={result.zip}
            isPremium={false}
            dataSources={result.sources}
            valuationNotes={[`🔍 ${result.aiExplanation}`]}
          />
        </div>
      )}
    </div>
  );
}