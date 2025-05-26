
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';
import { toast } from 'sonner';

export default function ValuationResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [valuationData, setValuationData] = useState<any>(null);

  useEffect(() => {
    // Simulate loading valuation data
    const loadValuation = async () => {
      try {
        // In production, this would fetch from API using the ID
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock valuation data
        const mockData = {
          id,
          vehicle: {
            year: 2020,
            make: 'Toyota',
            model: 'Camry',
            trim: 'LE',
            vin: 'SAMPLE17CHARVINNUM',
            mileage: 45000,
            condition: 'Good',
            estimatedValue: 22500,
            confidenceScore: 85
          },
          createdAt: new Date().toISOString()
        };
        
        setValuationData(mockData);
      } catch (error) {
        console.error('Error loading valuation:', error);
        toast.error('Failed to load valuation data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadValuation();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleDownload = () => {
    toast.success('PDF download will be available soon');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Vehicle Valuation Report',
        text: `Check out my vehicle valuation: ${valuationData?.vehicle?.year} ${valuationData?.vehicle?.make} ${valuationData?.vehicle?.model}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <Container className="max-w-4xl py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Container>
    );
  }

  if (!valuationData) {
    return (
      <Container className="max-w-4xl py-10">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Valuation Not Found</h2>
            <p className="text-gray-600 mb-6">
              The valuation report you're looking for could not be found.
            </p>
            <Button onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
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
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Valuation Results */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Valuation Report</CardTitle>
            <p className="text-sm text-gray-500">
              Generated on {new Date(valuationData.createdAt).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <VehicleFoundCard 
              vehicle={valuationData.vehicle}
              showActions={false}
            />
            
            {/* Valuation Summary */}
            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    ${valuationData.vehicle.estimatedValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Estimated Value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">
                    {valuationData.vehicle.confidenceScore}%
                  </div>
                  <div className="text-sm text-blue-600">Confidence Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-700">
                    {valuationData.vehicle.mileage.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">Miles</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhancement Offer */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Want a More Accurate Valuation?
              </h3>
              <p className="text-blue-700 mb-4">
                Get up to 25% more accuracy by providing additional vehicle details
              </p>
              <Button 
                onClick={() => navigate(`/valuation/enhance/${id}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Enhance This Valuation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
