
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getValuationByToken } from '@/services/valuationService';
import { ValuationResult } from '@/types/valuation';
import { Button } from '@/components/ui/button';

const SharePage = () => {
  const { token } = useParams<{ token: string }>();
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuation = async () => {
      try {
        if (!token) {
          setError('Invalid sharing token');
          setLoading(false);
          return;
        }

        const result = await getValuationByToken(token);
        
        if (!result) {
          setError('Valuation not found or has expired');
          setLoading(false);
          return;
        }

        setValuation(result);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shared valuation:', err);
        setError('Failed to load valuation');
        setLoading(false);
      }
    };

    fetchValuation();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg text-gray-600">Loading valuation...</p>
        </div>
      </div>
    );
  }

  if (error || !valuation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 text-center max-w-md bg-white rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Valuation Not Available</h3>
          <p className="mt-2 text-gray-600">{error || 'This valuation could not be found or has expired.'}</p>
          <div className="mt-6">
            <Button variant="default" onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Vehicle Valuation Report
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Shared valuation details for {valuation.year} {valuation.make} {valuation.model}
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h4 className="text-xl font-semibold text-gray-900">
                ${valuation.estimatedValue.toLocaleString()}
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Estimated Value
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Make</h4>
              <p className="mt-1 text-sm text-gray-900">{valuation.make}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Model</h4>
              <p className="mt-1 text-sm text-gray-900">{valuation.model}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Year</h4>
              <p className="mt-1 text-sm text-gray-900">{valuation.year}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Mileage</h4>
              <p className="mt-1 text-sm text-gray-900">{valuation.mileage.toLocaleString()} miles</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Condition</h4>
              <p className="mt-1 text-sm text-gray-900">{valuation.condition}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Location</h4>
              <p className="mt-1 text-sm text-gray-900">{valuation.zipCode}</p>
            </div>
            
            {valuation.explanation && (
              <div className="sm:col-span-2 mt-4">
                <h4 className="text-sm font-medium text-gray-500">Valuation Explanation</h4>
                <p className="mt-1 text-sm text-gray-900">{valuation.explanation}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-between">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            View Similar Valuations
          </Button>
          <Button 
            variant="default" 
            onClick={() => window.location.href = '/register'}
          >
            Get Your Own Valuation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SharePage;
