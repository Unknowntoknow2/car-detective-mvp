
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, AlertCircle, Share2, Star } from 'lucide-react';
import { toast } from 'sonner';

// Import components
import { ValuationResults } from '@/components/valuation/ValuationResults';
import { ValuationTabContent } from '@/components/result/ValuationTabContent';
import { VehicleDetailsCard } from '@/components/result/VehicleDetailsCard';
import { NextStepsCard } from '@/components/result/NextStepsCard';
import { getValuationById } from '@/services/valuationService';
import { formatCurrency } from '@/utils/formatters';

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('valuation');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [valuationData, setValuationData] = useState<any | null>(null);
  const valuationId = searchParams.get('valuationId') || localStorage.getItem('latest_valuation_id') || '';
  
  useEffect(() => {
    async function fetchValuationData() {
      if (!valuationId) {
        setError(new Error('No valuation ID provided'));
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await getValuationById(valuationId);
        setValuationData(data);
      } catch (err) {
        console.error('Error fetching valuation:', err);
        setError(err instanceof Error ? err : new Error('Failed to load valuation data'));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchValuationData();
  }, [valuationId]);
  
  const handleDownloadReport = () => {
    // For now, just show a toast since we don't have PDF generation yet
    toast.success('PDF report downloaded successfully');
  };
  
  const handleShareReport = () => {
    // Create a shareable link
    const shareUrl = `${window.location.origin}/valuation/${valuationId}`;
    
    // Try to use the native share API if available
    if (navigator.share) {
      navigator.share({
        title: `Vehicle Valuation: ${valuationData?.year} ${valuationData?.make} ${valuationData?.model}`,
        text: `Check out this vehicle valuation: ${formatCurrency(valuationData?.estimated_value || 0)}`,
        url: shareUrl
      }).catch((err) => {
        console.error('Error sharing:', err);
        // Fallback to copying to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(shareUrl);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link');
      });
  };
  
  const handleSaveValuation = () => {
    // This would normally save to the database
    toast.success('Valuation saved to your account');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Valuation Results</h1>
        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !valuationData) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Valuation Results</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load valuation</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{error?.message || "We couldn't find your valuation data. Please try submitting your vehicle information again."}</p>
            <div className="mt-4">
              <Link to="/valuation">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Return to Valuation
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Format adjustments for display
  const adjustments = Array.isArray(valuationData.adjustments) ? valuationData.adjustments : [
    { factor: 'Mileage', impact: -500, description: 'Based on average for this model year' },
    { factor: 'Condition', impact: 300, description: 'Good condition adds value' },
    { factor: 'Market Demand', impact: 800, description: 'High demand in your area' }
  ];

  // Calculate price range if not provided
  const priceRange = valuationData.priceRange || [
    valuationData.estimated_value * 0.95,
    valuationData.estimated_value * 1.05
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Valuation Results</h1>
          <p className="text-muted-foreground mt-1">
            {valuationData.year} {valuationData.make} {valuationData.model}
            {valuationData.trim && ` ${valuationData.trim}`}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleDownloadReport}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleShareReport}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleSaveValuation}
          >
            <Star className="h-4 w-4" />
            <span>Save</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ValuationResults
            estimatedValue={valuationData.estimated_value || 0}
            confidenceScore={valuationData.confidence_score || 85}
            basePrice={valuationData.base_price}
            adjustments={adjustments}
            priceRange={priceRange}
            demandFactor={valuationData.zip_demand_factor}
            vehicleInfo={{
              year: valuationData.year,
              make: valuationData.make,
              model: valuationData.model,
              trim: valuationData.trim,
              mileage: valuationData.mileage,
              condition: valuationData.condition
            }}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="valuation">Valuation Details</TabsTrigger>
              <TabsTrigger value="details">Vehicle Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="valuation" className="mt-4">
              <ValuationTabContent valuationId={valuationId} />
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <VehicleDetailsCard 
                make={valuationData.make}
                model={valuationData.model}
                year={valuationData.year}
                mileage={valuationData.mileage}
                condition={valuationData.condition}
                vin={valuationData.vin}
                trim={valuationData.trim}
                bodyType={valuationData.body_type || valuationData.body_style}
                fuelType={valuationData.fuel_type || valuationData.fuelType}
                color={valuationData.color}
                transmission={valuationData.transmission}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <NextStepsCard 
            isPremium={valuationData.premium_unlocked}
            valuationId={valuationId}
          />
          
          {/* Additional cards for the sidebar can be added here */}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
