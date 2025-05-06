
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getValuationByToken, SharedValuation } from '@/utils/publicShareService';
import ValuationResult from '@/components/valuation/ValuationResult';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Info, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';

export default function SharedValuationPage() {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [valuation, setValuation] = useState<SharedValuation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    async function loadValuation() {
      if (!token) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      try {
        const result = await getValuationByToken(token);
        
        if (!result) {
          setError('Valuation not found');
        } else if ('expired' in result) {
          setIsExpired(true);
        } else {
          setValuation(result.valuation);
        }
      } catch (err) {
        console.error('Error loading shared valuation:', err);
        setError('Failed to load valuation data');
      } finally {
        setIsLoading(false);
      }
    }

    loadValuation();
  }, [token]);

  // Generate meta tags for the page
  const getMetaTags = () => {
    const baseUrl = window.location.origin;
    const title = valuation ? 
      `${valuation.year} ${valuation.make} ${valuation.model} Valuation Report` : 
      'Car Valuation Report';
    
    const description = valuation ? 
      `Check out this ${valuation.year} ${valuation.make} ${valuation.model} valued at $${valuation.estimated_value.toLocaleString()}` : 
      'Check out this valuation report created with Car Detective';
    
    // For the image, we could eventually implement dynamic OG images
    const imageUrl = `${baseUrl}/og-image.jpg`;
    
    return (
      <Helmet>
        <title>{title} - Car Detective</title>
        <meta name="description" content={description} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={`${baseUrl}/share/${token}`} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
    );
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-center text-muted-foreground">Loading valuation report...</p>
      </div>
    );
  }

  if (error || !valuation) {
    return (
      <div className="container max-w-4xl mx-auto py-12 min-h-[70vh]">
        {getMetaTags()}
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Valuation not found. This link may be invalid or expired.'}
          </AlertDescription>
        </Alert>
        <Footer />
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="container max-w-4xl mx-auto py-12 min-h-[70vh]">
        {getMetaTags()}
        <Alert variant="default" className="mb-4 border-amber-300 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-700">Expired Link</AlertTitle>
          <AlertDescription className="text-amber-600">
            This valuation share link has expired. Please request a new link from the valuation owner.
          </AlertDescription>
        </Alert>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {getMetaTags()}
      
      <Card className="border-2 border-primary/20 mb-8">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Shared Valuation Report</CardTitle>
              <CardDescription>
                {valuation.year} {valuation.make} {valuation.model}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Public View
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Display a watermark for the shared view */}
          <div className="p-3 mb-6 bg-primary/5 border border-primary/10 rounded-md text-center text-sm text-primary/80">
            This is a read-only public view of a valuation report shared by its owner.
          </div>
          
          <ValuationResult
            make={valuation.make}
            model={valuation.model}
            year={valuation.year}
            mileage={valuation.mileage}
            condition={getConditionLabel(valuation.condition_score)}
            location="N/A" // No location info in public view
            valuation={valuation.estimated_value}
            valuationId={valuation.id}
          />
        </CardContent>
      </Card>
      
      <Footer />
    </div>
  );
}

// Helper function to convert condition score to label
function getConditionLabel(score: number): string {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}
