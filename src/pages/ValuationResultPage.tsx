
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';
import { ArrowLeft, Download, Share } from 'lucide-react';
import { toast } from 'sonner';

interface ValuationData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  accidents: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  valuationId: string;
  vin?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  drivetrain?: string;
}

export default function ValuationResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching valuation data
    const fetchValuationData = async () => {
      try {
        // In a real app, you would fetch from your API
        // For now, we'll use mock data
        const mockData: ValuationData = {
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          mileage: 35000,
          accidents: 0,
          condition: 'Good',
          estimatedValue: 22500,
          confidenceScore: 85,
          valuationId: id || 'mock-valuation-id',
          vin: '1HGCM82633A004352',
          trim: 'LE',
          engine: '2.5L 4-Cylinder',
          transmission: 'CVT Automatic',
          fuelType: 'Gasoline',
          bodyType: 'Sedan',
          drivetrain: 'FWD'
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setValuationData(mockData);
      } catch (error) {
        console.error('Error fetching valuation data:', error);
        toast.error('Failed to load valuation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleDownload = () => {
    toast.success('PDF download started');
    // Implement PDF download logic
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Vehicle Valuation Report',
        text: `Check out my ${valuationData?.year} ${valuationData?.make} ${valuationData?.model} valuation`,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <Container className="max-w-4xl py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    );
  }

  if (!valuationData) {
    return (
      <Container className="max-w-4xl py-10">
        <Card>
          <CardContent className="text-center py-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Valuation Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The valuation you're looking for doesn't exist or has expired.
            </p>
            <Button onClick={handleBack}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Vehicle Information */}
        <VehicleFoundCard
          vehicle={valuationData}
          showActions={false}
        />

        {/* Valuation Results */}
        <Card>
          <CardHeader>
            <CardTitle>Valuation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Estimated Value
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${valuationData.estimatedValue.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Confidence Score</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${valuationData.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {valuationData.confidenceScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium">
                    {valuationData.mileage.toLocaleString()} miles
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium">{valuationData.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accidents:</span>
                  <span className="font-medium">{valuationData.accidents}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
