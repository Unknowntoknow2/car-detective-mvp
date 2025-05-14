import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PredictionResult } from '@/components/valuation/PredictionResult';
import { useValuationResult } from '@/hooks/useValuationResult';
import { AIChatBubble } from '@/components/chat/AIChatBubble';

export default function ValuationDetailPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const navigate = useNavigate();
  const { data: valuation, isLoading, error } = useValuationResult(valuationId || '');

  // ✅ Safe error message
  const errorMessage = (() => {
    if (!error) return "Could not load the valuation details.";
    if (typeof error === 'object' && 'message' in error) {
      return String((error as { message: string }).message);
    }
    return String(error);
  })();

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
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Valuation</h2>
            <p className="text-gray-600 mb-4">
              {errorMessage}
            </p>
            <Button onClick={() => navigate('/my-valuations')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Valuations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPremium = valuation.isPremium;

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
        <h1 className="text-3xl font-bold">
          Valuation Details
          {isPremium && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              Premium
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-2">
          {valuation.year} {valuation.make} {valuation.model}
          {valuation.mileage && ` • ${valuation.mileage.toLocaleString()} miles`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Valuation Report</CardTitle>
        </CardHeader>
        <CardContent>
          <PredictionResult valuationId={valuationId || ''} />
        </CardContent>
      </Card>

      <AIChatBubble 
        valuation={{
          id: valuation.id,
          created_at: new Date().toISOString(),
          make: valuation.make,
          model: valuation.model,
          year: valuation.year,
          mileage: valuation.mileage,
          estimated_value: valuation.estimatedValue,
          is_premium: isPremium,
          premium_unlocked: isPremium,
          condition: valuation.condition,
          confidence_score: valuation.confidenceScore,
        }} 
      />
    </div>
  );
}
