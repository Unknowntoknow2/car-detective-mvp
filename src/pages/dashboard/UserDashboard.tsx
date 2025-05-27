
import React, { useState, useEffect } from 'react';
import { ValuationResult } from '@/types/valuation';
import { formatCurrency } from '@/utils/formatters';

export default function UserDashboard() {
  const [valuations, setValuations] = useState<ValuationResult[]>([]);

  useEffect(() => {
    // Mock data for dashboard
    const mockValuations: ValuationResult[] = [
      {
        id: '1',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        vin: '1234567890ABCDEFG',
        estimatedValue: 25000,
        photoScore: 0.8,
        created_at: '2023-01-01T00:00:00Z',
        priceRange: [23000, 27000],
        adjustments: [],
        condition: 'Good',
        confidenceScore: 85
      }
    ];
    
    setValuations(mockValuations);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Valuations</h1>
      
      <div className="grid gap-4">
        {valuations.map((valuation) => (
          <div key={valuation.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {valuation.year} {valuation.make} {valuation.model}
                </h3>
                <p className="text-muted-foreground">VIN: {valuation.vin}</p>
                <p className="text-lg font-bold">
                  {formatCurrency(valuation.estimatedValue || 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(valuation.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
