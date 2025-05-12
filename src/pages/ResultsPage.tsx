
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, Share, Download, Lock, Star as StarIcon, Car as CarIcon, AlertCircle } from 'lucide-react';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('valuationId');
  const [isLoading, setIsLoading] = useState(true);
  const [valuation, setValuation] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuation = async () => {
      if (!valuationId) {
        setError('No valuation ID provided');
        setIsLoading(false);
        return;
      }

      try {
        // In a real app, fetch from Supabase or API
        // For demo, we'll use localStorage or mock data
        const storedValuation = localStorage.getItem(`valuation_${valuationId}`);
        
        if (storedValuation) {
          setValuation(JSON.parse(storedValuation));
        } else {
          // Mock valuation data
          const mockValuation = {
            id: valuationId,
            make: 'Honda',
            model: 'Accord',
            year: 2019,
            mileage: 45000,
            condition: 'Good',
            zipCode: '90210',
            estimated_value: 19850,
            confidence_score: 88,
            created_at: new Date().toISOString(),
            premium_unlocked: false
          };
          
          setValuation(mockValuation);
          
          // Store for future reference
          localStorage.setItem(`valuation_${valuationId}`, JSON.stringify(mockValuation));
        }
      } catch (err) {
        console.error('Error fetching valuation:', err);
        setError('Failed to load valuation results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuation();
  }, [valuationId]);

  const handleShareValuation = () => {
    if (navigator.share) {
      navigator.share({
        title: `Car Valuation: ${valuation?.year} ${valuation?.make} ${valuation?.model}`,
        text: `Check out my car valuation for a ${valuation?.year} ${valuation?.make} ${valuation?.model}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Share failed:', err);
      });
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleDownloadPdf = () => {
    if (!valuation?.premium_unlocked) {
      toast.error('Premium upgrade required to download PDF report');
      return;
    }
    
    // Mock PDF download for now
    toast.success('PDF report downloaded');
  };

  const handleUpgradeToPremium = () => {
    toast.success('Redirecting to premium upgrade');
    // Navigate to premium page
    window.location.href = `/premium?valuationId=${valuationId}`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold">Loading valuation results...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !valuation) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              {error || 'Failed to load valuation'}
            </h2>
            <p className="text-red-600 mb-6">
              We couldn't find the valuation results you're looking for.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="destructive" asChild>
                <Link to="/valuation">Start New Valuation</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Button variant="outline" size="sm" asChild className="mb-2">
              <Link to="/valuation">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Valuation
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Your {valuation.year} {valuation.make} {valuation.model} Valuation
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShareValuation}>
              <Share className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button 
              size="sm" 
              onClick={valuation.premium_unlocked ? handleDownloadPdf : handleUpgradeToPremium}
            >
              <Download className="h-4 w-4 mr-2" />
              {valuation.premium_unlocked ? 'Download PDF' : 'Get PDF Report'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UnifiedValuationResult
              valuationId={valuationId || undefined}
              estimatedValue={valuation.estimated_value}
              confidenceScore={valuation.confidence_score}
              vehicleInfo={{
                year: valuation.year,
                make: valuation.make,
                model: valuation.model,
                mileage: valuation.mileage,
                condition: valuation.condition
              }}
              displayMode="full"
            />
            
            <div className="mt-6">
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger 
                    value="market" 
                    className="flex-1" 
                    disabled={!valuation.premium_unlocked}
                  >
                    Market Analysis
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4 border rounded-lg mt-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Valuation Overview</h3>
                    <p>
                      Based on your {valuation.year} {valuation.make} {valuation.model} with {valuation.mileage.toLocaleString()} miles in {valuation.condition} condition, we estimate its value at {formatCurrency(valuation.estimated_value)}.
                    </p>
                    <p>
                      This valuation has a {valuation.confidence_score}% confidence score, which reflects the accuracy of our estimate based on the information provided.
                    </p>
                    
                    {!valuation.premium_unlocked && (
                      <Card className="bg-primary/5 border border-primary/20 mt-4">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <StarIcon className="h-5 w-5 text-primary mr-2" />
                            Upgrade to Premium
                          </h4>
                          <p className="text-sm mb-3">
                            Get a detailed market analysis, similar vehicles comparison, and professional PDF report.
                          </p>
                          <Button size="sm" onClick={handleUpgradeToPremium}>
                            Upgrade Now
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="details" className="p-4 border rounded-lg mt-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Vehicle Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p className="font-medium">{valuation.year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Make</p>
                        <p className="font-medium">{valuation.make}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Model</p>
                        <p className="font-medium">{valuation.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mileage</p>
                        <p className="font-medium">{valuation.mileage.toLocaleString()} miles</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Condition</p>
                        <p className="font-medium">{valuation.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{valuation.zipCode}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="market" className="p-4 border rounded-lg mt-2">
                  {valuation.premium_unlocked ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Market Analysis</h3>
                      <p>Detailed market analysis for your vehicle.</p>
                      {/* Premium content would go here */}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        Unlock market analysis, price trends, and similar listings with a premium upgrade.
                      </p>
                      <Button onClick={handleUpgradeToPremium}>
                        Upgrade to Premium
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Sell your car?</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Get offers from local dealers interested in your vehicle.
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Get Dealer Offers
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <StarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Want more details?</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Upgrade to premium for detailed analysis and PDF report.
                      </p>
                      <Button size="sm" className="w-full" onClick={handleUpgradeToPremium}>
                        Upgrade to Premium
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Save for later</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Create an account to save this valuation to your profile.
                      </p>
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link to="/auth">Create Account</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
