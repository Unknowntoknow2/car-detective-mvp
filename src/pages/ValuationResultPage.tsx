
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { useValuationData } from '@/modules/valuation-result/hooks/useValuationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';

const ValuationResultPage = () => {
  const { id, vin } = useParams<{ id?: string; vin?: string }>();
  const [searchParams] = useSearchParams();
  const [valuationId, setValuationId] = useState<string | undefined>();

  // Determine the correct valuation identifier
  useEffect(() => {
    console.log('ValuationResultPage params:', { id, vin });
    
    if (vin) {
      // VIN route: /valuation/vin/:vin
      setValuationId(vin);
      console.log('Using VIN from URL path:', vin);
    } else if (id) {
      // UUID route: /valuation/:id
      setValuationId(id);
      console.log('Using ID from URL path:', id);
    } else {
      // Fallback: check localStorage for latest valuation
      const storedId = localStorage.getItem('latest_valuation_id');
      if (storedId) {
        setValuationId(storedId);
        console.log('Using stored valuation ID:', storedId);
      } else {
        console.error('No valuation identifier found');
      }
    }
  }, [id, vin]);

  const { data, isLoading, error, isError, refetch } = useValuationData(valuationId || '');

  // Loading state
  if (isLoading || !valuationId) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-600">Loading valuation results...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <p>Could not load valuation results.</p>
                <p className="text-sm text-muted-foreground">
                  {error || 'The valuation data may not be available or the link may have expired.'}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Try Again
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/vin-lookup">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      New Lookup
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Success state - display valuation results
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link to="/vin-lookup">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lookup
              </Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {/* Main Valuation Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Vehicle Valuation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Estimated Value */}
                <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-primary mb-2">Estimated Value</h3>
                  <div className="text-4xl font-bold text-primary">
                    {formatCurrency(data.estimated_value || data.estimatedValue || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Confidence: {data.confidence_score || data.confidenceScore || 0}%
                  </p>
                </div>

                {/* Vehicle Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Vehicle Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Make:</span>
                        <span>{data.make || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span>{data.model || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span>{data.year || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mileage:</span>
                        <span>{data.mileage ? `${data.mileage.toLocaleString()} miles` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Additional Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition:</span>
                        <span className="capitalize">{data.condition || 'Good'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VIN:</span>
                        <span className="font-mono text-xs">{data.vin || vin || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{data.created_at ? new Date(data.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                {data.price_range && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Price Range</h4>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <span>Low: {formatCurrency(data.price_range[0] || 0)}</span>
                      <span>High: {formatCurrency(data.price_range[1] || 0)}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button className="flex-1">
                    Get Premium Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ValuationResultPage;
