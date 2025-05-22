
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Share, Download, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function ValuationResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [valuation, setValuation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchValuation() {
      if (!id) {
        setError('No valuation ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          setError('Valuation not found');
        } else {
          setValuation(data);
        }
      } catch (err: any) {
        console.error('Error fetching valuation:', err);
        setError(err.message || 'Failed to load valuation');
      } finally {
        setIsLoading(false);
      }
    }

    fetchValuation();
  }, [id]);

  const handlePremiumUpgrade = () => {
    if (user) {
      navigate(`/premium-valuation?valuationId=${id}`);
    } else {
      navigate(`/auth?redirect=/premium-valuation?valuationId=${id}`);
    }
  };

  const handleStartOver = () => {
    navigate('/valuation');
  };

  const handleShare = () => {
    // Share functionality would be implemented here
    toast.info('Share functionality coming soon!');
  };

  const handleDownloadPdf = () => {
    // PDF download would be implemented here
    toast.info('PDF download functionality coming soon!');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <Toaster position="top-center" richColors />
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !valuation) {
    return (
      <div className="container mx-auto py-12">
        <Toaster position="top-center" richColors />
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Valuation Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the valuation you're looking for. It may have been removed or the link is invalid."}
            </p>
            <Button onClick={handleStartOver}>Start a New Valuation</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate price range
  const priceRange = {
    low: Math.floor(valuation.estimated_value * 0.95),
    high: Math.floor(valuation.estimated_value * 1.05)
  };

  return (
    <div className="container mx-auto py-12">
      <Toaster position="top-center" richColors />
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center text-muted-foreground"
        onClick={handleStartOver}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        New Valuation
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {valuation.year} {valuation.make} {valuation.model}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-primary mb-1">Estimated Value</h3>
                  <p className="text-4xl font-bold">{formatCurrency(valuation.estimated_value)}</p>
                  <p className="text-sm text-muted-foreground">
                    Price range: {formatCurrency(priceRange.low)} - {formatCurrency(priceRange.high)}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Valuation Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Confidence Score</p>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${valuation.confidence_score}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 font-medium">{valuation.confidence_score}%</span>
                      </div>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-medium">{valuation.mileage?.toLocaleString() || 'N/A'} miles</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Condition</p>
                      <p className="font-medium capitalize">{valuation.condition || 'Good'}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{valuation.state || 'US'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Valuation Factors</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span>Base Price</span>
                      <span className="font-medium">{formatCurrency(valuation.base_price || valuation.estimated_value * 0.8)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Year Adjustment</span>
                      <span className="text-green-600">+{formatCurrency(valuation.estimated_value * 0.05)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Mileage Impact</span>
                      <span className="text-red-600">-{formatCurrency(valuation.estimated_value * 0.03)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Condition Factor</span>
                      <span className="text-green-600">+{formatCurrency(valuation.estimated_value * 0.02)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="font-semibold">Final Valuation</span>
                      <span className="font-semibold">{formatCurrency(valuation.estimated_value)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleShare} variant="outline" className="w-full flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share Valuation
              </Button>
              <Button onClick={handleDownloadPdf} variant="outline" className="w-full flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Unlock Premium Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 mb-4">Get access to premium features including:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span>Full vehicle history report</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span>Market comparison data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span>Detailed condition analysis</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handlePremiumUpgrade}
              >
                Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
