
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Car, DollarSign, Clock } from 'lucide-react';

export default function ResultsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isPremium = searchParams.get('premium') === 'true';
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Simulate loading result
    const timer = setTimeout(() => {
      setResult({
        id,
        estimatedValue: Math.floor(Math.random() * 50000) + 15000,
        make: 'Toyota',
        model: 'Camry',
        year: 2021,
        confidence: 85,
        isPremium
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, isPremium]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Processing your valuation...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-red-600">Valuation not found</p>
          <Button onClick={() => window.location.href = '/'} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-3xl font-bold">
              {isPremium ? 'Premium ' : ''}Valuation Complete
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Your vehicle valuation is ready
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Year:</span> {result.year}</p>
                <p><span className="font-medium">Make:</span> {result.make}</p>
                <p><span className="font-medium">Model:</span> {result.model}</p>
                <p><span className="font-medium">Valuation ID:</span> {result.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Estimated Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  ${result.estimatedValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence Score: {result.confidence}%
                </div>
                {isPremium && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">
                      Premium features include CARFAX® report, market trends, and dealer offers
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-x-4">
          <Button onClick={() => window.location.href = '/'}>
            Get Another Valuation
          </Button>
          {isPremium && (
            <Button variant="outline">
              Download PDF Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
