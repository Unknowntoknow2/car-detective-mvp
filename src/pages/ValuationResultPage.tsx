
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Share2 } from 'lucide-react';

const ValuationResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [valuationData, setValuationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulating API call to fetch valuation data
    const fetchValuationData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // await api.getValuation(id)
        setTimeout(() => {
          setValuationData({
            id,
            make: 'Toyota',
            model: 'Camry',
            year: 2019,
            estimatedValue: 22500,
            confidenceScore: 87,
            condition: 'Good',
            mileage: 42000,
            priceRange: [21000, 24000],
            isPremium: false
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load valuation data');
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading valuation results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  if (!valuationData) {
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Vehicle Valuation Result</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              {valuationData.year} {valuationData.make} {valuationData.model}
            </h2>
            <p className="text-gray-600">{valuationData.condition} Condition · {valuationData.mileage.toLocaleString()} miles</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-gray-500">Confidence Score</span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ width: `${valuationData.confidenceScore}%` }}
                ></div>
              </div>
              <span className="font-medium">{valuationData.confidenceScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-b py-6 my-6">
          <div className="text-center">
            <div className="text-gray-500 text-sm">Estimated Value</div>
            <div className="text-4xl font-bold text-primary my-2">
              ${valuationData.estimatedValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              Range: ${valuationData.priceRange[0].toLocaleString()} - ${valuationData.priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Valuation
          </Button>
        </div>
      </div>
      
      {!valuationData.isPremium && (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Want a more detailed valuation?</h3>
          <p className="text-blue-600 mb-4">
            Upgrade to our premium valuation for advanced market analysis, dealer insights, and more.
          </p>
          <Button variant="premium" onClick={() => window.location.href = '/premium'}>
            Upgrade to Premium Valuation
          </Button>
        </div>
      )}
    </div>
  );
};

export default ValuationResultPage;
