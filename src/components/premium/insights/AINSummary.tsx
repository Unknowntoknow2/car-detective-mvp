// Canonical AINSummary.tsx
// This is the unified version. Duplicate removed from src/components/valuation/premium/AINSummary.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AINSummaryProps {
  vin: string;
  vehicleData?: {
    year?: number;
    make?: string;
    model?: string;
    mileage?: number;
    estimatedValue?: number;
  };
}

export function AINSummary({ vin, vehicleData }: AINSummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateAINSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Prepare context for AI analysis
        const context = {
          vin,
          vehicleInfo: vehicleData,
          analysisType: 'premium_valuation_summary'
        };

        const prompt = `Analyze this vehicle valuation data for VIN ${vin}. 
        Vehicle Details: ${vehicleData?.year} ${vehicleData?.make} ${vehicleData?.model}
        Mileage: ${vehicleData?.mileage || 'Unknown'}
        Estimated Value: $${vehicleData?.estimatedValue?.toLocaleString() || 'Calculating'}
        
        Provide a comprehensive AIN™ summary covering:
        1. Vehicle history interpretation
        2. Current market conditions for this vehicle
        3. AI-predicted resale trends
        4. Any red flags or positive indicators
        5. Investment perspective and recommendations
        
        Format as professional insights suitable for a premium valuation report.`;

        const { data, error } = await supabase.functions.invoke('ask-ai', {
          body: {
            question: prompt,
            userContext: context,
            systemPrompt: `You are AIN — Auto Intelligence Network™, providing premium vehicle valuation insights. 
            Analyze the provided vehicle data and give expert-level market intelligence and recommendations.`
          }
        });

        if (error) {
          throw new Error(error.message || 'Failed to generate AI summary');
        }

        setSummary(data?.answer || 'Unable to generate insights at this time.');
      } catch (err) {
        setError('Failed to generate AI insights. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (vin) {
      generateAINSummary();
    }
  }, [vin, vehicleData]);

  if (isLoading) {
    return (
      <Card className="premium-highlight bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Brain className="h-5 w-5" />
            AIN™ Insights
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600 mr-3" />
            <span className="text-amber-700">Generating AI insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="premium-highlight bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            AIN™ Insights
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-highlight bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Brain className="h-5 w-5" />
          AIN™ Insights
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-gray-700">
          {summary.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="mb-3 last:mb-0">
                {paragraph.trim()}
              </p>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
