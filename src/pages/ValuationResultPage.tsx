
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Share2, Download, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ValuationResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vin = searchParams.get('vin');
  const [isLoading, setIsLoading] = useState(true);
  const [valuationData, setValuationData] = useState<any>(null);
  
  useEffect(() => {
    // Get stored data for the VIN
    if (vin) {
      const storedData = localStorage.getItem(`vin_lookup_${vin}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          
          // Calculate estimated value based on various factors
          // This is a simplified calculation - in production, you'd use a more sophisticated algorithm
          const baseValue = 25000; // Base value for the vehicle
          
          // Adjust for mileage
          const mileageAdjustment = calculateMileageAdjustment(parsedData.mileage || 35000);
          
          // Adjust for condition
          const conditionAdjustment = calculateConditionAdjustment(parsedData.condition || 'good');
          
          // Adjust for accident history
          const accidentAdjustment = calculateAccidentAdjustment(parsedData.hasAccidentHistory || 'none');
          
          // Adjust for title status
          const titleAdjustment = calculateTitleAdjustment(parsedData.titleStatus || 'clean');
          
          // Adjust for features
          const featuresAdjustment = calculateFeaturesAdjustment(parsedData.features || []);
          
          // Calculate final value
          const estimatedValue = Math.round(
            baseValue + mileageAdjustment + conditionAdjustment + 
            accidentAdjustment + titleAdjustment + featuresAdjustment
          );
          
          // Calculate confidence score (75-95% range)
          const confidenceScore = calculateConfidenceScore(parsedData);
          
          // Calculate price range (±10% by default)
          const priceRange = [
            Math.round(estimatedValue * 0.9),
            Math.round(estimatedValue * 1.1)
          ];
          
          setValuationData({
            ...parsedData,
            estimatedValue,
            confidenceScore,
            priceRange,
            adjustments: [
              { label: 'Mileage', value: mileageAdjustment },
              { label: 'Condition', value: conditionAdjustment },
              { label: 'Accident History', value: accidentAdjustment },
              { label: 'Title Status', value: titleAdjustment },
              { label: 'Premium Features', value: featuresAdjustment }
            ]
          });
        } catch (e) {
          console.error('Error parsing valuation data:', e);
        }
      }
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [vin]);
  
  const calculateMileageAdjustment = (mileage: number) => {
    // Simple adjustment: $0 for average mileage (35k), -$1000 for each 10k above, +$1000 for each 10k below
    const avgMileage = 35000;
    return Math.round((avgMileage - mileage) / 10000) * 1000;
  };
  
  const calculateConditionAdjustment = (condition: string) => {
    // Condition adjustments
    const adjustments: Record<string, number> = {
      'excellent': 2000,
      'good': 0,
      'fair': -2000,
      'poor': -5000
    };
    return adjustments[condition] || 0;
  };
  
  const calculateAccidentAdjustment = (accidentHistory: string) => {
    // Accident history adjustments
    const adjustments: Record<string, number> = {
      'none': 0,
      'minor': -500,
      'moderate': -2000,
      'severe': -5000
    };
    return adjustments[accidentHistory] || 0;
  };
  
  const calculateTitleAdjustment = (titleStatus: string) => {
    // Title status adjustments
    const adjustments: Record<string, number> = {
      'clean': 0,
      'salvage': -7000,
      'rebuilt': -4000,
      'lemon': -3000,
      'other': -2000
    };
    return adjustments[titleStatus] || 0;
  };
  
  const calculateFeaturesAdjustment = (features: string[]) => {
    // Each premium feature adds some value
    return features.length * 300;
  };
  
  const calculateConfidenceScore = (data: any) => {
    // Calculate confidence score based on completeness of data
    // More complete data = higher confidence
    let score = 75; // Base score
    
    // Add points for each key data point provided
    if (data.mileage) score += 2;
    if (data.condition) score += 2;
    if (data.exteriorCondition) score += 1;
    if (data.paintCondition) score += 1;
    if (data.seatsCondition) score += 1;
    if (data.dashboardCondition) score += 1;
    if (data.engineCondition) score += 1;
    if (data.transmissionCondition) score += 1;
    if (data.tiresCondition) score += 1;
    if (data.hasAccidentHistory) score += 2;
    if (data.titleStatus) score += 2;
    if (data.serviceHistory) score += 2;
    if (data.zipCode) score += 2;
    
    // Cap at 95% - there's always some uncertainty
    return Math.min(score, 95);
  };
  
  const getConfidenceLabel = (score: number) => {
    if (score >= 85) return 'High';
    if (score >= 70) return 'Medium';
    return 'Low';
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Finalizing your valuation...</p>
        </div>
      </div>
    );
  }
  
  if (!valuationData) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Valuation Data Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sorry, we couldn't find valuation data for this vehicle. Please try the valuation process again.</p>
            <Button 
              onClick={() => navigate('/lookup')} 
              className="mt-4"
            >
              Start New Valuation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Your Valuation Result</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Valuation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Value</h3>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(valuationData.estimatedValue)}
              </p>
              
              <div className="mt-2 flex items-center gap-2">
                <Progress value={valuationData.confidenceScore} className="h-2" />
                <span className="text-sm whitespace-nowrap">
                  {valuationData.confidenceScore}% ({getConfidenceLabel(valuationData.confidenceScore)})
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Year</h4>
                <p className="font-medium">{valuationData.year}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Make</h4>
                <p className="font-medium">{valuationData.make}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Model</h4>
                <p className="font-medium">{valuationData.model}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Mileage</h4>
                <p className="font-medium">{valuationData.mileage?.toLocaleString() || 'N/A'} mi</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Condition</h4>
                <p className="font-medium capitalize">{valuationData.condition || 'Good'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">ZIP Code</h4>
                <p className="font-medium">{valuationData.zipCode || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Price Range</h3>
              </div>
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>{formatCurrency(valuationData.priceRange[0])}</span>
                <span className="font-medium">{formatCurrency(valuationData.estimatedValue)}</span>
                <span>{formatCurrency(valuationData.priceRange[1])}</span>
              </div>
              <div className="relative h-2 bg-secondary rounded-full mb-4">
                <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: '50%', left: '25%' }} />
              </div>
              <p className="text-sm text-muted-foreground">
                This price range represents what similar vehicles are selling for in your area. Your specific vehicle's value may vary based on its condition, options, and local market demand.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Market Comparison</h3>
              <p className="text-sm mb-2">
                See how this {valuationData.year} {valuationData.make} {valuationData.model} 
                compares to others on the market, including dealer and private sale prices.
              </p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/premium')}>
                View Market Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Value Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {valuationData.adjustments.map((adjustment: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{adjustment.label}</span>
                  <Badge variant={adjustment.value >= 0 ? "default" : "destructive"}>
                    {adjustment.value > 0 ? '+' : ''}{formatCurrency(adjustment.value)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full flex items-center" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button className="w-full flex items-center" variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Valuation
            </Button>
            <Separator className="my-2" />
            <Button className="w-full" onClick={() => navigate('/premium')}>
              Get Premium Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Valuation Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This valuation is based on the information you provided about your {valuationData.year} {valuationData.make} {valuationData.model}.
            We analyze multiple factors including:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
            <li>Vehicle age, make, model, and trim</li>
            <li>Current mileage and regional location</li>
            <li>Overall condition and maintenance history</li>
            <li>Accident history and title status</li>
            <li>Premium features and options</li>
            <li>Current market trends and comparable sales</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            For a more comprehensive analysis including market trends, comparable listings, and dealer offers, 
            upgrade to our Premium Valuation Report.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuationResultPage;
