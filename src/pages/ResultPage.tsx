
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useValuationId } from '@/components/result/useValuationId';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const params = new URLSearchParams(location.search);
  const idFromUrl = params.get('id');
  
  // Use the custom hook to get the valuation ID from various sources
  const { valuationId, manualData } = useValuationId(idFromUrl);

  useEffect(() => {
    // Log the valuation ID for debugging
    console.log("ResultPage: Found valuation ID:", valuationId);
    
    if (!valuationId && !manualData) {
      console.log("No valuation ID or manual data found");
      toast.error("No valuation ID found. Please try looking up your vehicle again.");
    }
    
    setIsLoading(false);
  }, [valuationId, manualData]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Valuation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading valuation information...</span>
                </div>
              ) : valuationId ? (
                <ValuationResult valuationId={valuationId} />
              ) : manualData ? (
                <ValuationResult manualValuation={manualData} />
              ) : (
                <div className="text-center text-muted-foreground p-6">
                  <p>No valuation information found. Please try again or start a new valuation.</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/lookup')}
                  >
                    Start New Lookup
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
