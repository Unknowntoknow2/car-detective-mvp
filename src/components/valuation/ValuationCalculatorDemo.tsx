
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { calculateEnhancedValuation } from '@/utils/valuationCalculator';
import { ValuationParams, ValuationResult } from '@/utils/valuation/types';

// Component to demo the valuation calculator
export const ValuationCalculatorDemo: React.FC = () => {
  const [valuationParams, setValuationParams] = useState<ValuationParams>({
    zipCode: '90210',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 35000,
    condition: 'Good',
    baseMarketValue: 25000,
  });

  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValuationParams((prev) => ({
      ...prev,
      [name]: name === 'mileage' || name === 'year' || name === 'baseMarketValue'
        ? parseInt(value, 10)
        : value,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setValuationParams((prev) => {
      const currentFeatures = prev.features || [];
      const updatedFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((f) => f !== feature)
        : [...currentFeatures, feature];

      return { ...prev, features: updatedFeatures };
    });
  };

  const calculateValuation = async () => {
    setIsCalculating(true);
    try {
      const result = await calculateEnhancedValuation(valuationParams);
      setValuationResult(result);
    } catch (error) {
      console.error('Error calculating valuation:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Recalculate when params change
  useEffect(() => {
    // Only auto-calculate if all required fields are present
    if (valuationParams.make && valuationParams.model && valuationParams.year && 
        valuationParams.mileage && valuationParams.condition && valuationParams.zipCode) {
      const timer = setTimeout(() => {
        calculateValuation();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [valuationParams]);

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold">Valuation Calculator Demo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vehicle Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Make</label>
              <input
                type="text"
                name="make"
                value={valuationParams.make}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <input
                type="text"
                name="model"
                value={valuationParams.model}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <input
                type="number"
                name="year"
                value={valuationParams.year}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mileage</label>
              <input
                type="number"
                name="mileage"
                value={valuationParams.mileage}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <select
                name="condition"
                value={valuationParams.condition}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={valuationParams.zipCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Market Value</label>
              <input
                type="number"
                name="baseMarketValue"
                value={valuationParams.baseMarketValue}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {['Leather Seats', 'Navigation System', 'Sunroof', 'Premium Audio', 'Backup Camera'].map((feature, index) => (
                <Button
                  key={index}
                  variant={valuationParams.features?.includes(feature) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFeatureToggle(feature)}
                >
                  {feature}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={calculateValuation} 
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Valuation'}
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Valuation Result</h3>
          
          {valuationResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="text-xl font-bold text-primary">
                  ${(valuationResult.estimatedValue || 0).toLocaleString()}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Estimated Value with {valuationResult.confidenceScore || 0}% confidence
                </p>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-2">Value Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Value:</span>
                    <span>${(valuationResult.baseValue || 0).toLocaleString()}</span>
                  </div>
                  
                  {valuationResult.adjustments?.map((adjustment, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{adjustment.factor}:</span>
                      <span className={adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {adjustment.impact >= 0 ? '+' : ''}{adjustment.impact.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Final Value:</span>
                    <span>${(valuationResult.finalValue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-2">Price Range</h4>
                <div className="flex justify-between">
                  <span>${((valuationResult.estimatedValue || 0) * 0.95).toLocaleString()}</span>
                  <span>to</span>
                  <span>${((valuationResult.estimatedValue || 0) * 1.05).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">
                {isCalculating ? 'Calculating...' : 'Enter vehicle details to see valuation results'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValuationCalculatorDemo;
