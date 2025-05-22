
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ValueEstimateCard } from '@/components/premium/sections/ValueEstimateCard';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function ValuationResultPage() {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    // Load vehicle data from localStorage
    const storedData = localStorage.getItem('vehicle_data');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setVehicleData(parsedData);
      
      // Calculate estimated value (in a real app, this would come from an API)
      const baseValue = parsedData.year * 1000 - (parsedData.mileage / 100);
      const estimatedValue = Math.max(5000, Math.round(baseValue));
      setEstimatedValue(estimatedValue);
      
      // Set confidence score
      setConfidenceScore(parsedData.vin ? 85 : 70);
    } else {
      // No data found, redirect to home
      navigate('/');
    }
    
    // Check if premium is purchased
    const isPremiumPurchased = localStorage.getItem('premium_purchased') === 'true';
    setIsPremium(isPremiumPurchased);
  }, [navigate]);
  
  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF
    toast.success('PDF report is being generated...');
    
    // Simulate download
    setTimeout(() => {
      toast.success('Report downloaded successfully!');
    }, 2000);
  };
  
  const handleUpgrade = () => {
    navigate('/premium');
  };
  
  if (!vehicleData) {
    return null; // Or loading state
  }
  
  return (
    <MainLayout>
      <Container className="py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Valuation Results</h1>
          <p className="text-muted-foreground">
            Your estimated vehicle value based on current market conditions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Year</p>
                    <p>{vehicleData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Make</p>
                    <p>{vehicleData.make}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                    <p>{vehicleData.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mileage</p>
                    <p>{vehicleData.mileage?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Condition</p>
                    <p className="capitalize">{vehicleData.condition || 'Good'}</p>
                  </div>
                  {vehicleData.vin && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">VIN</p>
                      <p>{vehicleData.vin}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Valuation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Base Value</span>
                    <span>{formatCurrency(estimatedValue * 0.9)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Condition Adjustment</span>
                    <span>{formatCurrency(estimatedValue * 0.05)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Mileage Adjustment</span>
                    <span>{formatCurrency(estimatedValue * 0.03)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Market Adjustment</span>
                    <span>{formatCurrency(estimatedValue * 0.02)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold pt-2">
                    <span>Final Estimated Value</span>
                    <span>{formatCurrency(estimatedValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {!isPremium && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Upgrade to Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Get access to more detailed valuation insights, market comparison, and a comprehensive PDF report.
                  </p>
                  <Button onClick={handleUpgrade}>
                    Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <ValueEstimateCard 
              estimatedValue={estimatedValue}
              confidenceScore={confidenceScore}
              onDownloadReport={isPremium ? handleDownloadReport : undefined}
              isPremiumPurchased={isPremium}
            />
            
            {isPremium && (
              <Card className="mt-6 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="font-medium text-green-700">Premium Active</p>
                  </div>
                  <p className="text-sm text-green-700">
                    You have access to all premium features and reports.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
