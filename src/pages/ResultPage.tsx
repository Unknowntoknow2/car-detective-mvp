
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get valuation ID from URL or state
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get('id');
    const idFromState = location.state?.valuationId;
    
    // Get valuation ID from localStorage as a fallback
    const idFromStorage = localStorage.getItem('latest_valuation_id');
    
    const id = idFromUrl || idFromState || idFromStorage;
    
    if (id) {
      console.log("Found valuation ID:", id);
      setValuationId(id);
    } else {
      console.log("No valuation ID found");
      toast.error("No valuation ID found. Please try looking up your vehicle again.");
    }
    
    setIsLoading(false);
  }, [location]);

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
