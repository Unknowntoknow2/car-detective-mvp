
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/layout/MainLayout';
import { PremiumFeatures } from '@/components/valuation/result/PremiumFeatures';
import { ArrowRight, Download, Mail, BarChart3, Gauge } from 'lucide-react';

export default function ValuationResultPage() {
  const navigate = useNavigate();
  const [valuationData, setValuationData] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    // Get valuation data from localStorage
    const data = localStorage.getItem('valuation_data');
    if (data) {
      setValuationData(JSON.parse(data));
    }
    
    // Check if premium
    const premium = localStorage.getItem('premium_valuations');
    setIsPremium(!!premium);
  }, []);
  
  const handleUpgrade = () => {
    navigate('/premium');
  };
  
  const handleEmailReport = () => {
    // Implement email report functionality
    alert('Email report functionality would be implemented here');
  };
  
  const handleDownloadPdf = () => {
    // Implement download PDF functionality
    alert('Download PDF functionality would be implemented here');
  };
  
  if (!valuationData) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold">No valuation data found</h1>
          <p className="mt-4">Please complete a valuation to see results.</p>
          <Button onClick={() => navigate('/')} className="mt-8">
            Start a Valuation
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  // Simulate estimated value based on vehicle data
  const baseValue = 25000; // Base value for calculation
  const estimatedValue = baseValue + 
    (parseInt(valuationData.year) - 2015) * 1000 - 
    (parseInt(valuationData.mileage) / 20000) * 2000 +
    (valuationData.condition === 'excellent' ? 2000 : 
     valuationData.condition === 'good' ? 0 : 
     valuationData.condition === 'fair' ? -2000 : -4000);
  
  const priceRange = {
    low: Math.round(estimatedValue * 0.95),
    high: Math.round(estimatedValue * 1.05)
  };
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Valuation Result</h1>
            <p className="text-muted-foreground mt-2">
              Based on your vehicle's details and current market conditions
            </p>
          </div>
          
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Estimated Value</span>
                <Badge variant="outline" className="font-normal">
                  {valuationData.condition.charAt(0).toUpperCase() + valuationData.condition.slice(1)} Condition
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <h2 className="text-4xl font-bold text-primary">${Math.round(estimatedValue).toLocaleString()}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Value Range: ${priceRange.low.toLocaleString()} - ${priceRange.high.toLocaleString()}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    Vehicle Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span className="font-medium">{valuationData.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Make</span>
                      <span className="font-medium">{valuationData.make}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{valuationData.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mileage</span>
                      <span className="font-medium">{parseInt(valuationData.mileage).toLocaleString()} miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-medium capitalize">{valuationData.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ZIP Code</span>
                      <span className="font-medium">{valuationData.zipCode}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Why this price?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Base value for {valuationData.year} {valuationData.make} {valuationData.model}</span>
                      <span className="font-medium">${baseValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Mileage adjustment ({parseInt(valuationData.mileage).toLocaleString()} miles)</span>
                      <span className="font-medium text-red-500">-${Math.round((parseInt(valuationData.mileage) / 20000) * 2000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Condition ({valuationData.condition})</span>
                      <span className={`font-medium ${valuationData.condition === 'excellent' ? 'text-green-500' : valuationData.condition === 'good' ? '' : 'text-red-500'}`}>
                        {valuationData.condition === 'excellent' ? '+' : valuationData.condition === 'good' ? '' : '-'}
                        ${Math.abs(
                          valuationData.condition === 'excellent' ? 2000 : 
                          valuationData.condition === 'good' ? 0 : 
                          valuationData.condition === 'fair' ? 2000 : 4000
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Model year adjustment</span>
                      <span className="font-medium text-green-500">+${((parseInt(valuationData.year) - 2015) * 1000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2 mt-2">
                      <span className="font-medium">Final adjusted value</span>
                      <span className="font-medium">${Math.round(estimatedValue).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 mt-8">
                <Button variant="outline" className="flex-1" onClick={handleDownloadPdf}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleEmailReport}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {!isPremium && (
            <Card className="bg-primary-50 border-primary/30">
              <CardContent className="pt-6">
                <PremiumFeatures onUpgrade={handleUpgrade} />
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={() => navigate('/')}>
              Start a New Valuation
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
