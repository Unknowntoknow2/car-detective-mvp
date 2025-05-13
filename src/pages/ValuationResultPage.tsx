import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, AlertTriangle, RotateCcw, FileDown, Share2, Mail, Navigation, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { useToast } from '@/components/ui/use-toast';
import { usePdfDownload } from '@/components/valuation/result/usePdfDownload';
import { useEmailPdf } from '@/components/valuation/result/useEmailPdf';
import EmailPdfModal from '@/components/valuation/result/EmailPdfModal';
import { DealerOfferList } from '@/components/valuation/offers/DealerOfferList';
import { formatCurrency } from '@/utils/formatters';
import { ValuationResult } from '@/types/valuation';

// Helper function to map database fields to ValuationResult type
const mapDbToValuationResult = (data: any): ValuationResult => {
  return {
    id: data.id,
    make: data.make || '',
    model: data.model || '',
    year: data.year || 0,
    mileage: data.mileage || 0,
    condition: data.condition_score ? 
              (data.condition_score >= 90 ? 'Excellent' : 
               data.condition_score >= 75 ? 'Good' : 
               data.condition_score >= 60 ? 'Fair' : 'Poor') : 
              'Good',
    zipCode: data.state || '',
    estimatedValue: data.estimated_value || 0,
    confidenceScore: data.confidence_score || 75,
    priceRange: [
      Math.round((data.estimated_value || 0) * 0.95),
      Math.round((data.estimated_value || 0) * 1.05)
    ] as [number, number],
    adjustments: [
      { 
        factor: 'Base Condition', 
        impact: 0, 
        description: 'Baseline vehicle value' 
      },
      { 
        factor: 'Market Demand', 
        impact: 1.5, 
        description: 'Current market conditions' 
      }
    ],
    // Include color and other properties only if they are defined in the ValuationResult type
    color: data.color || '',
    bodyStyle: data.body_style || '',
    bodyType: data.body_type || '',
    fuelType: data.fuel_type || '',
    transmission: data.transmission || '',
    explanation: '',
    bestPhotoUrl: undefined,
    photoScore: undefined,
    photoExplanation: '',
    aiCondition: null,
    features: [],
    vin: data.vin,
    created_at: data.created_at
  };
};

const ValuationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<ValuationResult | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [hasDealerOffers, setHasDealerOffers] = useState(false);
  const { toast } = useToast();
  
  // Use the PDF download hook
  const { downloadValuationPdf, isDownloading } = usePdfDownload();
  
  // Use the email PDF hook
  const { emailValuationPdf, isEmailing, userEmail } = useEmailPdf({ 
    valuationId: id 
  });

  useEffect(() => {
    const fetchValuationData = async () => {
      if (!id) {
        setError('No valuation ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch the valuation data from Supabase
        const { data, error: fetchError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error('Error fetching valuation:', fetchError);
          setError('Failed to load valuation data. Please try again later.');
          setIsLoading(false);
          return;
        }
        
        if (!data) {
          setError('Valuation not found');
          setIsLoading(false);
          return;
        }
        
        console.log('Fetched valuation data:', data);
        
        // Map database response to ValuationResult type
        setValuationData(mapDbToValuationResult(data));
        
        // Check if there are any dealer offers for this valuation
        const { data: dealerOffers, error: offersError } = await supabase
          .from('dealer_offers')
          .select('id')
          .eq('report_id', id)
          .limit(1);
          
        if (!offersError && dealerOffers && dealerOffers.length > 0) {
          setHasDealerOffers(true);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [id]);

  const handleStartNew = () => {
    navigate('/free');
  };
  
  const handleDownloadPdf = async () => {
    if (!valuationData) {
      toast({
        title: "Error",
        description: "No valuation data available to generate PDF",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Use the valuationData directly since it's already in the correct format
      await downloadValuationPdf(valuationData);
      
      toast({
        title: "Success",
        description: "Valuation report downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download valuation report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEmailPdf = async (email?: string) => {
    if (!valuationData || !id) {
      toast({
        title: "Error",
        description: "No valuation data available to email",
        variant: "destructive"
      });
      return;
    }
    
    if (email) {
      await emailValuationPdf(email);
    } else {
      // Open email modal if no email is provided
      setIsEmailModalOpen(true);
    }
  };
  
  const handleShareValuation = () => {
    if (!valuationData || !id) {
      toast({
        title: "Error",
        description: "No valuation data available to share",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a shareable URL for this valuation
    const shareUrl = `${window.location.origin}/valuation-result/${id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Shareable link copied to clipboard",
        });
      })
      .catch((err) => {
        console.error('Error copying to clipboard:', err);
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard",
          variant: "destructive"
        });
      });
  };
  
  const handleRequestOffers = () => {
    if (!valuationData || !id) return;
    
    // Either redirect to premium or show a toast about dealer notifications
    if (valuationData.isPremium) {
      toast({
        title: "Dealers notified",
        description: "Local dealers have been notified about your vehicle.",
      });
    } else {
      navigate('/premium');
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading Valuation Results</h2>
          <p className="text-muted-foreground mt-2">Please wait while we retrieve your valuation</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
          <div className="mt-4">
            <Button variant="outline" onClick={handleStartNew}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Start New Valuation
            </Button>
          </div>
        </Alert>
      </div>
    );
  }
  
  // Ensure we have valuation data
  if (!valuationData) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription className="mt-2">
            We couldn't find valuation data for this ID. It may have been deleted or expired.
          </AlertDescription>
          <div className="mt-4">
            <Button variant="outline" onClick={handleStartNew}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Start New Valuation
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Vehicle Valuation Result</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Valuation Details</CardTitle>
              <CardDescription>
                Based on your vehicle information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UnifiedValuationResult 
                vehicleInfo={{
                  make: valuationData.make,
                  model: valuationData.model,
                  year: valuationData.year,
                  mileage: valuationData.mileage,
                  condition: valuationData.condition
                }}
                estimatedValue={valuationData.estimatedValue}
                confidenceScore={valuationData.confidenceScore}
                priceRange={valuationData.priceRange}
                displayMode="full"
              />
            </CardContent>
          </Card>
          
          {/* Add Dealer Offers Section */}
          <div className="mb-6">
            <DealerOfferList valuationId={id} />
          </div>
          
          {/* Smart Action Footer */}
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Navigation className="mr-2 h-5 w-5" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasDealerOffers ? (
                <div>
                  <p className="mb-4">Want to see what dealers would offer for your vehicle?</p>
                  <Button onClick={handleRequestOffers}>
                    <Tag className="mr-2 h-4 w-4" />
                    Request Dealer Offers
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="mb-4">You have dealer offers available. You can respond to them or request updated offers at any time.</p>
                  <Button onClick={() => navigate('/my-valuations')}>
                    <Navigation className="mr-2 h-4 w-4" />
                    View All My Valuations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
            <Button variant="outline" onClick={handleStartNew}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Start New Valuation
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleShareValuation}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => handleEmailPdf()}
                disabled={isEmailing}
              >
                {isEmailing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Email PDF
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleDownloadPdf} 
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Premium Features</CardTitle>
              <CardDescription>
                Unlock additional insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">✓</div>
                  <span>Market comparison analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">✓</div>
                  <span>Receive dealer offers</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">✓</div>
                  <span>12-month value forecast</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">✓</div>
                  <span>Detailed PDF report</span>
                </li>
              </ul>
              
              <Button className="w-full" onClick={() => navigate('/premium')}>
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Email Modal */}
      <EmailPdfModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={emailValuationPdf}
        isLoading={isEmailing}
        defaultEmail={userEmail}
      />
    </div>
  );
};

export default ValuationResultPage;
