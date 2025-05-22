
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ValuationResult } from '@/types/valuation';
import { fetchValuation } from '@/services/valuationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SharedValuationPage() {
  const { token } = useParams<{ token: string }>();
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        setError('Invalid share token');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // For now, we'll just use a mock implementation since getValuationByToken is not yet available
        // In a real implementation, you would call getValuationByToken from your service
        
        // Mock implementation
        setTimeout(() => {
          // Mock valuation data for demonstration
          const mockValuation: ValuationResult = {
            id: 'shared-id',
            make: 'Toyota',
            model: 'Camry',
            year: 2019,
            mileage: 35000,
            condition: 'Good',
            zipCode: '90210',
            estimatedValue: 19500,
            confidenceScore: 88,
            isPremium: true,
            created_at: new Date().toISOString(),
            priceRange: [18500, 20500],
            adjustments: [
              { 
                factor: 'Mileage', 
                impact: -2, 
                description: 'Slightly higher than average mileage'
              }
            ]
          };
          
          setValuation(mockValuation);
          setIsLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error fetching shared valuation:', error);
        setError('Failed to load shared valuation');
        setIsLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading shared valuation...</span>
      </div>
    );
  }

  if (error || !valuation) {
    return (
      <div className="container mx-auto max-w-lg p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Could not load the shared valuation'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Shared Vehicle Valuation</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{valuation.year} {valuation.make} {valuation.model}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Estimated Value</p>
              <p className="text-xl font-bold">${valuation.estimatedValue?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mileage</p>
              <p>{valuation.mileage?.toLocaleString() || 0} miles</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p>{valuation.condition || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Confidence</p>
              <div className="flex items-center">
                <div className="h-2 w-16 bg-gray-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-primary rounded-full" 
                    style={{width: `${valuation.confidenceScore || 0}%`}}
                  ></div>
                </div>
                <span className="text-sm">{valuation.confidenceScore || 0}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-sm text-gray-500 text-center">
        This valuation was shared with you by a Car Detective user.
      </p>
    </div>
  );
}
