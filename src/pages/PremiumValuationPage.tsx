import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { PremiumFeatures } from '@/components/premium/PremiumFeatures';
import { ValuationBreakdown } from '@/components/premium/ValuationBreakdown';
import { MarketTrends } from '@/components/premium/MarketTrends';
import { AIChatBubble } from '@/components/chat/AIChatBubble';

export default function PremiumValuationPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const navigate = useNavigate();
  const { data: valuation, isLoading, error } = useValuationResult(valuationId || '');
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !valuation) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h2 className="text-xl font-semibold">Error Loading Valuation</h2>
            </div>
            <p className="text-gray-600 mb-4">
              {error?.message || "Could not load the premium valuation details."}
            </p>
            <Button onClick={() => navigate('/my-valuations')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Valuations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Check if this is actually a premium valuation using the isPremium property
  if (!valuation.isPremium) {
    return (
      <div className="container mx-auto py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/my-valuations')} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Valuations
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Premium Valuation Not Available</CardTitle>
            <CardDescription>
              This valuation hasn't been upgraded to premium yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Upgrade to premium to access detailed valuation insights, market trends, and more.
            </p>
            <Button onClick={() => navigate(`/premium?id=${valuationId}`)}>
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Convert valuation data to match the Valuation type expected by our components
  const valuationData = {
    id: valuation.id,
    created_at: new Date().toISOString(), // Add required property
    make: valuation.make,
    model: valuation.model,
    year: valuation.year,
    mileage: valuation.mileage,
    estimated_value: valuation.estimatedValue,
    is_premium: true,
    premium_unlocked: true,
    condition: valuation.condition,
    confidence_score: valuation.confidenceScore,
    color: valuation.color,
    body_style: valuation.bodyStyle,
    body_type: valuation.bodyType,
    fuel_type: valuation.fuelType,
    explanation: valuation.explanation,
    transmission: valuation.transmission
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/my-valuations')} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Valuations
        </Button>
        <h1 className="text-3xl font-bold flex items-center">
          Premium Valuation
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            Premium
          </span>
        </h1>
        <p className="text-gray-600 mt-2">
          {valuation.year} {valuation.make} {valuation.model}
          {valuation.mileage && ` • ${valuation.mileage.toLocaleString()} miles`}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Premium Valuation</CardTitle>
            <CardDescription>
              Enhanced valuation with premium factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-4">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(valuation.estimatedValue || 0)}
            </div>
            <p className="text-gray-600">
              Confidence Score: {valuation.confidenceScore || 75}%
            </p>
          </CardContent>
        </Card>
        
        <ValuationBreakdown valuation={valuationData} />
      </div>
      
      <div className="space-y-6">
        <PremiumFeatures valuation={valuationData} />
        <MarketTrends vehicleInfo={{
          make: valuation.make || '',
          model: valuation.model || '',
          year: valuation.year || 0
        }} />
      </div>
      
      {/* Add the AI Chat Bubble */}
      <AIChatBubble valuation={valuationData} />
    </div>
  );
}
