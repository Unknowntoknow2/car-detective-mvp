import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateUnifiedValuation } from '@/services/valuation/valuationEngine';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { ValuationProgressDisplay } from '@/components/valuation/ValuationProgressDisplay';
import { ValuationProgressTracker } from '@/utils/valuation/progressTracker';
import { Loader2, TestTube } from 'lucide-react';

export function ValuationEngineTestComponent() {
  const [vin, setVin] = useState('WBAFA5C58DD396767'); // BMW test VIN
  const [zipCode, setZipCode] = useState('90210');
  const [mileage, setMileage] = useState(45000);
  const [condition, setCondition] = useState('good');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Progress tracking state
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [tracker] = useState(() => new ValuationProgressTracker());

  // Setup progress tracking
  React.useEffect(() => {
    tracker.onProgress((progress, step) => {
      setProgress(progress);
      setCurrentStep(step);
      setSteps([...tracker.getProgress().steps]);
    });
  }, [tracker]);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    setCurrentStep(null);
    tracker.reset();

    try {
      console.log('🧪 Starting valuation engine test...');
      
      const t0 = performance.now();
      const valuationResult = await calculateUnifiedValuation({
        vin,
        mileage,
        condition,
        zipCode,
        decodedVehicle: {
          year: 2020,
          make: 'BMW',
          model: 'X5'
        }
      });
      console.info("ain.val.ms", Math.round(performance.now()-t0), { via: import.meta.env.USE_AIN_VALUATION });
      
      console.log('✅ Valuation test completed:', valuationResult);
      setResult(valuationResult);
      
    } catch (err) {
      console.error('❌ Valuation test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Valuation Engine Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-vin">VIN</Label>
              <Input
                id="test-vin"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="Enter 17-character VIN"
                maxLength={17}
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="test-zip">ZIP Code</Label>
              <Input
                id="test-zip"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="90210"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="test-mileage">Mileage</Label>
              <Input
                id="test-mileage"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
                placeholder="45000"
              />
            </div>
            <div>
              <Label htmlFor="test-condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleTest} 
            disabled={loading || !vin || !zipCode}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Valuation Engine...
              </>
            ) : (
              'Run Valuation Test'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Progress Display */}
      {(loading || progress > 0) && (
        <ValuationProgressDisplay
          currentProgress={progress}
          currentStep={currentStep}
          steps={steps}
          showEngineering={true}
        />
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Test Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Raw Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Result Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Formatted Display */}
      {result && (
        <UnifiedValuationResult
          result={result}
        />
      )}
    </div>
  );
}